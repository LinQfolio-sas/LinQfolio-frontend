/**
 * Le vocabulaire de la mesure interne, partagé par le client et la route.
 *
 * Tout est fermé : chaque valeur reçue par l'API doit appartenir à l'une de
 * ces listes, sinon la requête est rejetée sans rien écrire. Ce n'est pas de
 * la rigueur gratuite — c'est ce qui garantit qu'aucun texte libre, donc
 * aucune donnée personnelle, ne peut entrer dans le compteur, même par
 * accident ou par requête forgée.
 */

export const AUDIENCE_EVENTS = [
  "page_view",
  "scroll_90",
  "store_click",
  "newsletter_success",
  "banner_shown",
  "banner_accept",
  "banner_decline",
] as const;

export const PAGE_TYPES = [
  "home",
  "blog_index",
  "blog_post",
  "faq",
  "about",
  "legal",
  "links",
  "other",
] as const;

/** Le canal est calculé dans le navigateur et envoyé déjà rangé : l'URL de
 *  provenance, elle, ne quitte jamais le terminal. */
export const CHANNELS = [
  "qr",
  "social",
  "search",
  "email",
  "referral",
  "direct",
] as const;

export const PLACEMENTS = ["hero", "header", "cta_footer", "links"] as const;
export const STORES = ["app_store", "google_play"] as const;
export const DEVICES = ["mobile", "tablet", "desktop"] as const;

/** Identifiant de support imprimé : un slug que nous imprimons nous-mêmes,
 *  jamais une valeur saisie par quelqu'un. */
export const QR_ID_PATTERN = /^[a-z0-9][a-z0-9_-]{0,31}$/;

export type AudienceEvent = (typeof AUDIENCE_EVENTS)[number];
export type PageType = (typeof PAGE_TYPES)[number];
export type Channel = (typeof CHANNELS)[number];
export type Placement = (typeof PLACEMENTS)[number];
export type Store = (typeof STORES)[number];
export type Device = (typeof DEVICES)[number];

export type AudienceHit = {
  event: AudienceEvent;
  page_type?: PageType;
  channel?: Channel;
  device?: Device;
  placement?: Placement;
  store?: Store;
  qr_id?: string;
};

function isMember<T extends string>(
  list: readonly T[],
  value: unknown,
): value is T {
  return typeof value === "string" && (list as readonly string[]).includes(value);
}

/**
 * Valide un corps de requête et renvoie les compteurs à incrémenter, ou `null`
 * si quoi que ce soit sort du vocabulaire.
 *
 * Les clés sont construites ici, côté serveur, à partir de valeurs déjà
 * validées : le client décrit ce qui s'est passé, il ne choisit jamais ce qui
 * est écrit.
 */
export function countersFor(body: unknown): string[] | null {
  if (typeof body !== "object" || body === null) return null;

  const hit = body as Record<string, unknown>;
  if (!isMember(AUDIENCE_EVENTS, hit.event)) return null;

  const counters: string[] = [];

  switch (hit.event) {
    case "page_view": {
      if (!isMember(PAGE_TYPES, hit.page_type)) return null;
      counters.push(`views#${hit.page_type}`);

      // Le canal et l'appareil ne sont comptés qu'à la page vue : les
      // rattacher à chaque événement ferait des totaux incohérents.
      if (isMember(CHANNELS, hit.channel)) counters.push(`channel#${hit.channel}`);
      if (isMember(DEVICES, hit.device)) counters.push(`device#${hit.device}`);
      if (typeof hit.qr_id === "string") {
        if (!QR_ID_PATTERN.test(hit.qr_id)) return null;
        counters.push(`qr#${hit.qr_id}`);
      }
      break;
    }

    case "scroll_90": {
      if (!isMember(PAGE_TYPES, hit.page_type)) return null;
      counters.push(`scroll90#${hit.page_type}`);
      break;
    }

    case "store_click": {
      if (!isMember(PLACEMENTS, hit.placement)) return null;
      if (!isMember(STORES, hit.store)) return null;
      counters.push(`store#${hit.placement}#${hit.store}`);
      break;
    }

    case "newsletter_success":
      counters.push("newsletter#success");
      break;

    case "banner_shown":
      counters.push("banner#shown");
      break;

    case "banner_accept":
      counters.push("banner#accept");
      break;

    case "banner_decline":
      counters.push("banner#decline");
      break;
  }

  return counters;
}
