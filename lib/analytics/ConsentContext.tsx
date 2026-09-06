"use client";

import Script from "next/script";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  ANALYTICS_ENABLED,
  GA_MEASUREMENT_ID,
  readConsent,
  writeConsent,
  type ConsentChoice,
} from "./config";
import { activateGtag } from "./consent-script";
import { elapsedSeconds, track } from "./track";
import { sendAudience } from "@/lib/audience/beacon";

/* ---------------------------------------------------------------------------
   Le consentement vit dans le stockage local, hors de React. On le lit donc
   avec `useSyncExternalStore`, comme le thème : pas d'état recopié dans un
   effet, pas de rendu en cascade, et React remplace l'instantané serveur par
   celui du client avant la première peinture.

   L'instantané est une chaîne pour rester comparable par valeur, ce qu'attend
   `useSyncExternalStore`. Quatre valeurs, dont une seule n'existe qu'au
   serveur :

     "pending"  le stockage n'a pas encore été lu — on n'affiche rien
     "unset"    personne n'a répondu, ou la réponse a plus de six mois
     "granted"  mesure avec cookies acceptée
     "denied"   mesure avec cookies refusée

   gtag.js n'est rendu que si l'instantané vaut "granted". Sans accord, la
   bibliothèque n'est jamais téléchargée : c'est la seule lecture compatible
   avec la doctrine de la CNIL, qui n'accorde pas à Google Analytics
   l'exemption de consentement dont bénéficient les solutions de mesure
   internes. Le volume total et le taux de refus viennent donc d'ailleurs — de
   nos propres compteurs, dans `lib/audience/`.
   ------------------------------------------------------------------------ */

type Snapshot = "pending" | "unset" | "granted" | "denied";

const listeners = new Set<() => void>();
let cached: Snapshot | null = null;

function getSnapshot(): Snapshot {
  if (cached === null) cached = readConsent()?.choice ?? "unset";
  return cached;
}

function getServerSnapshot(): Snapshot {
  return "pending";
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

function invalidate() {
  cached = null;
  for (const listener of listeners) listener();
}

/** Supprime les cookies GA4 posés sur ce domaine. Un cookie ne s'efface qu'en
 *  le réécrivant avec la même portée : on tente le chemin racine et le domaine
 *  parent, les deux formes que gtag.js utilise. */
function clearMeasurementCookies() {
  const { hostname } = window.location;

  for (const entry of document.cookie.split(";")) {
    const name = entry.split("=")[0]?.trim();
    if (!name || !name.startsWith("_ga")) continue;

    document.cookie = `${name}=; Max-Age=0; path=/`;
    document.cookie = `${name}=; Max-Age=0; path=/; domain=${hostname}`;
    document.cookie = `${name}=; Max-Age=0; path=/; domain=.${hostname}`;
  }
}

type ConsentContextValue = {
  /** `null` tant que le stockage n'est pas lu, ou si personne n'a répondu. */
  choice: ConsentChoice | null;
  /** Vrai une fois le stockage lu. Avant, on n'affiche rien. */
  resolved: boolean;
  decide: (choice: ConsentChoice) => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function ConsentProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  /** Instant où la question a été posée, pour mesurer le temps de décision.
   *  Renseigné dans un effet : `Date.now()` pendant le rendu rendrait le
   *  composant impur, et la valeur ne sert qu'après une interaction. */
  const askedAt = useRef(0);
  useEffect(() => {
    askedAt.current = Date.now();
  }, []);

  const decide = useCallback((choice: ConsentChoice) => {
    const granted = choice === "granted";

    // La réponse elle-même est comptée par la mesure interne, refus compris :
    // c'est de là que vient le taux d'acceptation. GA4 ne pourrait pas le
    // donner — un refus n'y produit rien, par construction.
    sendAudience({ event: granted ? "banner_accept" : "banner_decline" });

    writeConsent(choice);
    invalidate();

    if (!ANALYTICS_ENABLED) return;

    if (granted) {
      // Met les commandes en file avant que la balise <Script> ne soit rendue
      // au tour suivant : gtag.js les rejouera à son arrivée.
      activateGtag();
      track("consent_update", {
        consent_choice: choice,
        time_to_choice_s: elapsedSeconds(askedAt.current),
      });
      return;
    }

    // Retrait : couper l'écriture ne suffit pas, les cookies `_ga` déjà posés
    // survivraient treize mois à la décision.
    window.gtag?.("consent", "update", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    });
    clearMeasurementCookies();
  }, []);

  const value = useMemo<ConsentContextValue>(
    () => ({
      choice: snapshot === "granted" || snapshot === "denied" ? snapshot : null,
      resolved: snapshot !== "pending",
      decide,
    }),
    [snapshot, decide],
  );

  return (
    <ConsentContext.Provider value={value}>
      {children}
      {ANALYTICS_ENABLED && snapshot === "granted" ? (
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
      ) : null}
    </ConsentContext.Provider>
  );
}

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error("useConsent must be used within a ConsentProvider");
  }
  return ctx;
}
