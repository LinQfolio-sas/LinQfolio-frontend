"use client";

import { useEffect, useRef } from "react";
import { useConsent } from "@/lib/analytics/ConsentContext";
import { ANALYTICS_ENABLED } from "@/lib/analytics/config";
import { sendAudience } from "@/lib/audience/beacon";
import { useT } from "@/lib/i18n/LanguageContext";
import styles from "./ConsentBanner.module.css";

const COPY = {
  fr: {
    title: "Mesurer l’audience du site",
    body: (
      <>
        Google Analytics nous dit quelles pages servent vraiment. Si vous
        acceptez, un cookie nous permet de reconnaître vos visites d’une fois
        sur l’autre. Si vous refusez, rien n’est envoyé à Google : nous
        comptons seulement le passage, sur nos serveurs, sans cookie ni
        identifiant.
      </>
    ),
    accept: "Accepter",
    decline: "Refuser",
    more: "Politique cookies",
    aria: "Choix de mesure d’audience",
  },
  en: {
    title: "Measuring site traffic",
    body: (
      <>
        Google Analytics tells us which pages actually help. If you accept, a
        cookie lets us recognise your visits over time. If you decline,
        nothing is sent to Google: we only count the visit, on our own
        servers, with no cookie and no identifier.
      </>
    ),
    accept: "Accept",
    decline: "Decline",
    more: "Cookie policy",
    aria: "Traffic measurement choice",
  },
} as const;

export default function ConsentBanner() {
  const { choice, resolved, decide } = useConsent();
  const t = useT(COPY);
  const counted = useRef(false);

  const asking = ANALYTICS_ENABLED && resolved && choice === null;

  /* Le dénominateur du taux d'acceptation : combien de fois la question a
     réellement été posée. Sans lui, on saurait combien de personnes acceptent
     sans jamais savoir sur combien. Compté une fois par visite, même si la
     bannière est démontée puis remontée. */
  useEffect(() => {
    if (!asking || counted.current) return;
    counted.current = true;
    sendAudience({ event: "banner_shown" });
  }, [asking]);

  // Sans identifiant de mesure, il n'y a rien à consentir : pas de bannière.
  if (!ANALYTICS_ENABLED) return null;
  // Avant la lecture du stockage, on ne rend rien — un affichage puis un
  // retrait ferait clignoter la page pour ceux qui ont déjà répondu.
  if (!resolved || choice !== null) return null;

  return (
    <aside className={styles.banner} role="dialog" aria-label={t.aria}>
      <div className={styles.card}>
        <div className={styles.text}>
          <p className={styles.title}>{t.title}</p>
          <p className={styles.body}>{t.body}</p>
        </div>

        <div className={styles.actions}>
          {/* Les deux boutons ont la même taille, la même typographie et le
              même nombre de clics : la CNIL demande qu'un refus soit aussi
              simple qu'une acceptation. */}
          <button
            type="button"
            className={styles.decline}
            onClick={() => decide("denied")}
          >
            {t.decline}
          </button>
          <button
            type="button"
            className={styles.accept}
            onClick={() => decide("granted")}
          >
            {t.accept}
          </button>
        </div>

        <a className={styles.more} href="/cookies">
          {t.more}
        </a>
      </div>
    </aside>
  );
}
