"use client";

import { useEffect } from "react";
import {
  elapsedSeconds,
  noteScrollDepth,
  noteSectionSeen,
  pageTypeOf,
  track,
  viewContext,
} from "@/lib/analytics/track";
import {
  detectChannel,
  detectDevice,
  readQrId,
  sendAudience,
} from "@/lib/audience/beacon";

/**
 * Les trois mesures passives du lot 1 : profondeur de défilement, sections
 * vues et temps passé dedans, atterrissages QR.
 *
 * Le composant ne rend rien et ne connaît aucune section : il observe les
 * éléments porteurs de `data-section` (et `data-cta`). Ajouter une section au
 * plan de marquage tient donc dans un attribut, pas dans un import.
 *
 * Deux destinations, deux régimes. `track()` alimente GA4 et ne fait rien tant
 * que le consentement n'est pas donné — sans accord, `window.gtag` n'existe
 * pas. `sendAudience()` alimente nos propres compteurs agrégés et part
 * toujours : sans identifiant, sans cookie et sans tiers, il relève de
 * l'exemption de mesure d'audience.
 *
 * Le second est volontairement plus pauvre que le premier. Il donne des
 * totaux — combien de visites, combien de clics store, quelle proportion
 * accepte le bandeau — là où GA4 donne un comportement. Le premier corrige le
 * second : sans lui, on ne connaîtrait que les consentants et on ne saurait
 * même pas quelle part du public ils représentent.
 */

/** Paliers de défilement. Quatre, pas cinq : le 100 % est atteint par tout
 *  lecteur de pied de page et ne distingue plus personne. */
const MILESTONES = [25, 50, 75, 90] as const;

/** Durée de visibilité au-delà de laquelle on parle de « vu » plutôt que de
 *  « traversé au défilement ». */
const VIEW_DELAY_MS = 1000;

type SectionState = {
  id: string;
  cta: string | null;
  visible: boolean;
  enteredAt: number;
  viewTimer: number | null;
  viewed: boolean;
  dwellSent: boolean;
};

function scrollPercent(): number {
  const doc = document.documentElement;
  const scrollable = doc.scrollHeight - window.innerHeight;
  if (scrollable <= 0) return 100;
  return Math.min(100, Math.round((window.scrollY / scrollable) * 100));
}

/** Une section plus haute que la fenêtre n'atteint jamais un ratio de 0.5 :
 *  on regarde alors la part de fenêtre qu'elle occupe, pas la part d'elle-même
 *  qui est visible. */
function countsAsVisible(entry: IntersectionObserverEntry): boolean {
  if (!entry.isIntersecting) return false;
  if (entry.intersectionRatio >= 0.5) return true;
  return entry.intersectionRect.height >= window.innerHeight * 0.5;
}

export default function Telemetry() {
  /* --- page vue : compteur interne, une requête pour tout --- */
  useEffect(() => {
    sendAudience({
      event: "page_view",
      page_type: pageTypeOf(window.location.pathname),
      channel: detectChannel(),
      device: detectDevice(),
      qr_id: readQrId(),
    });
  }, []);

  /* --- atterrissage depuis un support imprimé (détail, côté GA4) --- */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const medium = params.get("utm_medium");
    const qrId = params.get("qr_id");

    // Un QR sans `qr_id` reste comptabilisé : mieux vaut un support anonyme
    // qu'un atterrissage manquant. C'est le signal de tirer les prochains QR
    // avec un identifiant.
    if (medium !== "print" && medium !== "qr" && !qrId) return;

    track("qr_landing", {
      qr_id: qrId ?? "unlabelled",
      qr_placement: params.get("utm_content") ?? "unspecified",
      page_path: window.location.pathname,
    });
  }, []);

  /* --- profondeur de défilement --- */
  useEffect(() => {
    const reached = new Set<number>();
    let frame = 0;

    const measure = () => {
      frame = 0;
      const percent = scrollPercent();
      noteScrollDepth(percent);

      for (const milestone of MILESTONES) {
        if (percent >= milestone && !reached.has(milestone)) {
          reached.add(milestone);
          track("scroll_milestone", { percent: milestone });

          // Un seul palier remonte aux compteurs internes : quatre feraient
          // quatre écritures par visite pour une nuance que des totaux
          // agrégés ne peuvent de toute façon pas exploiter.
          if (milestone === 90) {
            sendAudience({
              event: "scroll_90",
              page_type: pageTypeOf(window.location.pathname),
            });
          }
        }
      }
    };

    const onScroll = () => {
      // Un palier par image affichée suffit largement, et le gestionnaire
      // reste hors du chemin critique du défilement.
      if (frame === 0) frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /* --- sections vues, temps passé, CTA affichés --- */
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(
      "[data-section],[data-cta]",
    );
    if (targets.length === 0) return;

    const states = new Map<Element, SectionState>();

    /** Le temps retenu est celui du PREMIER passage continu dans la section.
     *  Cumuler les allers-retours donnerait un chiffre plus flatteur mais sans
     *  définition claire ; un premier passage se compare d'une section à
     *  l'autre et d'une semaine à l'autre. */
    const sendDwell = (state: SectionState) => {
      // Un conteneur marqué seulement `data-cta` n'est pas une section : il
      // n'a pas de temps de lecture à déclarer.
      if (state.id === "") return;
      if (!state.viewed || state.dwellSent) return;
      state.dwellSent = true;
      track("section_dwell", {
        section_id: state.id,
        dwell_s: elapsedSeconds(state.enteredAt),
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const state = states.get(entry.target);
          if (!state) continue;

          const visible = countsAsVisible(entry);
          if (visible === state.visible) continue;
          state.visible = visible;

          if (visible) {
            state.enteredAt = Date.now();
            state.viewTimer = window.setTimeout(() => {
              state.viewTimer = null;
              state.viewed = true;

              if (state.id !== "") {
                // `sections_seen` compte des sections lues, pas des éléments
                // observés : un bloc de boutons ne doit pas gonfler le
                // compteur que `store_click` emporte avec lui.
                noteSectionSeen();
                track("section_view", {
                  section_id: state.id,
                  ...viewContext(),
                });
              }
              if (state.cta !== null) {
                track("cta_view", { placement: state.cta, ...viewContext() });
              }
            }, VIEW_DELAY_MS);
            continue;
          }

          if (state.viewTimer !== null) {
            window.clearTimeout(state.viewTimer);
            state.viewTimer = null;
          }
          sendDwell(state);
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75] },
    );

    for (const target of targets) {
      states.set(target, {
        id: target.dataset.section ?? "",
        cta: target.dataset.cta ?? null,
        visible: false,
        enteredAt: 0,
        viewTimer: null,
        viewed: false,
        dwellSent: false,
      });
      observer.observe(target);
    }

    /** Ce qui est encore à l'écran au départ n'a jamais été « quitté ».
     *  `visibilitychange` est le seul signal qui parte de façon fiable sur
     *  mobile, où l'onglet est mis en veille plutôt que fermé. */
    const flush = () => {
      if (document.visibilityState !== "hidden") return;
      for (const state of states.values()) sendDwell(state);
    };

    document.addEventListener("visibilitychange", flush);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", flush);
      for (const state of states.values()) {
        if (state.viewTimer !== null) window.clearTimeout(state.viewTimer);
      }
    };
  }, []);

  return null;
}
