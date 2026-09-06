import type { AudienceHit, Channel, Device } from "./metrics";

/**
 * Envoi des compteurs internes, sans consentement et sans rien écrire sur le
 * terminal.
 *
 * `sendBeacon` plutôt que `fetch` : la requête est mise en file par le
 * navigateur et part même si la page se ferme dans la seconde. C'est ce qui
 * permet de compter un visiteur qui repart tout de suite — précisément celui
 * qu'un `fetch` perdrait.
 */

/** Interrupteur explicite : rien ne part d'un poste de développement ni d'une
 *  préproduction, où des passages de test fausseraient les totaux. */
export const AUDIENCE_ENABLED = process.env.NEXT_PUBLIC_AUDIENCE_ENABLED === "1";

const ENDPOINT = "/api/audience";

export function sendAudience(hit: AudienceHit) {
  if (typeof window === "undefined") return;

  if (!AUDIENCE_ENABLED) {
    if (process.env.NODE_ENV !== "production") {
      console.debug("[audience]", hit);
    }
    return;
  }

  try {
    navigator.sendBeacon(
      ENDPOINT,
      new Blob([JSON.stringify(hit)], { type: "application/json" }),
    );
  } catch {
    // Un compteur perdu ne vaut pas une erreur affichée.
  }
}

/* ------------------------------------------------------------------------ */

const SEARCH = /(^|\.)(google|bing|duckduckgo|ecosia|qwant|yahoo|brave)\./i;
const SOCIAL =
  /(^|\.)(instagram|tiktok|twitter|x|linkedin|discord|facebook|reddit|pinterest|threads)\./i;

/**
 * Range la provenance dans l'une des six cases connues.
 *
 * Le calcul se fait ici, dans le navigateur : c'est la case qui part au
 * serveur, jamais l'URL de provenance. Un référent porte parfois un chemin, un
 * identifiant de partage ou un fragment de recherche — autant de choses qui
 * n'ont rien à faire dans un compteur.
 */
export function detectChannel(): Channel {
  const params = new URLSearchParams(window.location.search);
  const medium = params.get("utm_medium")?.toLowerCase() ?? "";

  if (medium === "print" || medium === "qr" || params.has("qr_id")) return "qr";
  if (medium === "email" || medium === "newsletter") return "email";
  if (medium === "social" || medium === "cpc") return "social";

  const referrer = document.referrer;
  if (!referrer) return "direct";

  let host: string;
  try {
    host = new URL(referrer).hostname;
  } catch {
    return "direct";
  }

  if (host === window.location.hostname) return "direct";
  if (SEARCH.test(host)) return "search";
  if (SOCIAL.test(host)) return "social";
  return "referral";
}

/** Trois classes, déduites de la largeur d'affichage. Ni modèle, ni système,
 *  ni version : rien qui contribue à une empreinte de navigateur. */
export function detectDevice(): Device {
  const width = window.innerWidth;
  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

/** Identifiant de support imprimé, tel qu'il figure sur le QR code. */
export function readQrId(): string | undefined {
  const value = new URLSearchParams(window.location.search).get("qr_id");
  return value && /^[a-z0-9][a-z0-9_-]{0,31}$/.test(value) ? value : undefined;
}
