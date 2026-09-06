/**
 * Réglages partagés par la bannière de consentement, le chargeur GA4 et la
 * couche d'événements. Rien ici ne touche au DOM : le fichier est importable
 * depuis le serveur comme depuis le client.
 */

/**
 * Identifiant de mesure GA4 (`G-XXXXXXXXXX`).
 *
 * Absent, toute la télémétrie est inerte : pas de bannière, pas de script, pas
 * d'événement. C'est l'état voulu en local et sur les préproductions, où des
 * hits parasites feraient dériver les moyennes de production.
 */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

export const ANALYTICS_ENABLED = GA_MEASUREMENT_ID.length > 0;

/** Clé partagée par la bannière et le contexte de consentement. */
export const CONSENT_STORAGE_KEY = "linqfolio-consent";

export type ConsentChoice = "granted" | "denied";

/** Ce qu'on écrit dans le stockage local : le choix, et sa date. */
export type ConsentRecord = { choice: ConsentChoice; at: number };

/**
 * Durée de validité d'un choix avant de reposer la question.
 *
 * La CNIL demande de ne pas traiter un refus comme définitif : six mois est la
 * durée qu'elle cite en exemple, et c'est celle que retient notre politique
 * cookies. Une acceptation suit la même horloge que le cookie `_ga` (13 mois),
 * mais on garde une seule échéance : plus simple à expliquer, plus court donc
 * plus prudent.
 */
export const CONSENT_TTL_MS = 182 * 24 * 60 * 60 * 1000;

export function isConsentChoice(value: unknown): value is ConsentChoice {
  return value === "granted" || value === "denied";
}

/** Relit le choix enregistré. `null` = personne n'a répondu, ou la réponse a expiré. */
export function readConsent(): ConsentRecord | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;

    const { choice, at } = parsed as Partial<ConsentRecord>;
    if (!isConsentChoice(choice) || typeof at !== "number") return null;
    if (Date.now() - at > CONSENT_TTL_MS) return null;

    return { choice, at };
  } catch {
    // Navigation privée stricte, ou valeur corrompue : on repose la question.
    return null;
  }
}

export function writeConsent(choice: ConsentChoice): ConsentRecord {
  const record: ConsentRecord = { choice, at: Date.now() };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Le choix vaut alors pour la session : on le respecte quand même en
    // mémoire, on le redemandera au prochain passage.
  }
  return record;
}
