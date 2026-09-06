"use client";

import { useConsent } from "@/lib/analytics/ConsentContext";
import { ANALYTICS_ENABLED } from "@/lib/analytics/config";
import { useT } from "@/lib/i18n/LanguageContext";
import styles from "./ConsentPreferences.module.css";

/**
 * Le retrait du consentement, sur la page qui le décrit.
 *
 * Le RGPD demande qu'il soit aussi simple de retirer son accord que de le
 * donner : deux clics pour accepter dans la bannière, deux clics pour revenir
 * ici. Le retrait prend effet sur-le-champ, sans rechargement — le mode
 * consentement coupe l'écriture des cookies dès la commande reçue, et les
 * cookies déjà posés sont effacés dans la foulée.
 */

const COPY = {
  fr: {
    eyebrow: "Votre choix",
    granted: "Vous avez accepté Google Analytics et ses cookies de mesure.",
    denied:
      "Vous avez refusé Google Analytics. Rien ne lui est envoyé. Seuls nos compteurs internes, sans cookie ni identifiant, enregistrent le passage.",
    pending:
      "Vous n’avez pas encore répondu. Google Analytics n’est pas chargé et aucun cookie n’est déposé.",
    accept: "Accepter",
    decline: "Refuser",
  },
  en: {
    eyebrow: "Your choice",
    granted: "You accepted Google Analytics and its measurement cookies.",
    denied:
      "You declined Google Analytics. Nothing is sent to it. Only our internal counters, with no cookie and no identifier, record the visit.",
    pending:
      "You haven’t answered yet. Google Analytics is not loaded and no cookie is set.",
    accept: "Accept",
    decline: "Decline",
  },
} as const;

export default function ConsentPreferences() {
  const { choice, resolved, decide } = useConsent();
  const t = useT(COPY);

  if (!ANALYTICS_ENABLED || !resolved) return null;

  const status =
    choice === "granted" ? t.granted : choice === "denied" ? t.denied : t.pending;

  return (
    <div className={styles.panel}>
      <p className={styles.eyebrow}>{t.eyebrow}</p>
      <p className={styles.status}>{status}</p>

      <div className={styles.actions}>
        {choice !== "granted" ? (
          <button
            type="button"
            className={styles.accept}
            onClick={() => decide("granted")}
          >
            {t.accept}
          </button>
        ) : null}
        {choice !== "denied" ? (
          <button type="button" className={styles.decline} onClick={() => decide("denied")}>
            {t.decline}
          </button>
        ) : null}
      </div>
    </div>
  );
}
