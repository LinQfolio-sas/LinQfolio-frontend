import type { Lang } from "@/lib/i18n/LanguageContext";
import { ANALYTICS_ENABLED, type ConsentChoice } from "./config";

/* ---------------------------------------------------------------------------
   Plan de marquage — lot 1
   ----------------------------------------------------------------------------
   Douze événements, et un socle de paramètres réutilisés d'un événement à
   l'autre (`placement`, `section_id`, `page_type`…). Cette mutualisation n'est
   pas cosmétique : GA4 plafonne à 50 dimensions personnalisées à portée
   événement, et elles ne sont PAS rétroactives. Un paramètre inventé par
   événement épuiserait le quota avant la moitié du plan, sans possibilité de
   revenir en arrière sur l'historique.

   Toute addition ici doit donc d'abord chercher à réutiliser un nom existant.
   ------------------------------------------------------------------------ */

export type EventName =
  /* Conversion */
  | "store_click"
  | "cta_view"
  | "newsletter_start"
  | "newsletter_success"
  | "newsletter_error"
  | "newsletter_abandon"
  /* Acquisition */
  | "qr_landing"
  /* Comportement */
  | "scroll_milestone"
  | "section_view"
  | "section_dwell"
  /* Communication */
  | "consent_update"
  | "lang_switch";

export type PageType =
  | "home"
  | "blog_index"
  | "blog_post"
  | "faq"
  | "about"
  | "legal"
  | "links"
  | "other";

/** Le vocabulaire fermé des paramètres. Une faute de frappe ne compile pas. */
export type EventParams = {
  /* socle, envoyé aussi largement que possible */
  placement?: string;
  section_id?: string;
  page_type?: PageType;
  lang?: Lang;

  /* store_click */
  store?: "app_store" | "google_play";
  time_to_click_s?: number;
  scroll_depth_at_click?: number;
  sections_seen?: number;

  /* newsletter */
  form_source?: string;
  error_code?: string;
  attempts?: number;
  time_to_submit_s?: number;
  time_in_field_s?: number;
  had_input?: boolean;
  is_returning?: boolean;

  /* qr_landing */
  qr_id?: string;
  qr_placement?: string;

  /* comportement */
  percent?: number;
  dwell_s?: number;
  time_to_view_s?: number;
  scroll_depth_at_view?: number;

  /* consentement et langue */
  consent_choice?: ConsentChoice;
  time_to_choice_s?: number;
  from_lang?: Lang;
  to_lang?: Lang;
  page_path?: string;
};

type GtagArgs =
  | [command: "js", date: Date]
  | [command: "config", targetId: string, config?: Record<string, unknown>]
  | [command: "event", name: string, params?: Record<string, unknown>]
  | [command: "consent", action: "default" | "update", state: Record<string, unknown>];

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: GtagArgs) => void;
  }
}

/* --- état de page ---------------------------------------------------------
   Trois compteurs partagés par plusieurs événements. Ils vivent au niveau du
   module parce que le site navigue en chargements complets (tous les liens
   sont des <a> classiques) : un module rechargé par page, c'est exactement la
   portée qu'on veut. */

const pageOpenedAt = Date.now();
let sectionsSeen = 0;
let maxScrollDepth = 0;

export function elapsedSeconds(since: number): number {
  return Math.round(((Date.now() - since) / 1000) * 10) / 10;
}

export function noteSectionSeen() {
  sectionsSeen += 1;
}

export function noteScrollDepth(percent: number) {
  if (percent > maxScrollDepth) maxScrollDepth = percent;
}

export function currentScrollDepth(): number {
  return maxScrollDepth;
}

/**
 * Le type de page, sous forme de table plutôt que de cascade de `if`.
 *
 * La raison est ailleurs que dans le style : le script de consentement, écrit
 * en ES5 et exécuté dans le <head>, a besoin de la même classification pour
 * étiqueter la page vue automatique. Il génère sa boucle à partir de cette
 * table — une seule source, aucune dérive possible entre les deux.
 */
export const PAGE_TYPE_RULES: ReadonlyArray<readonly [string, PageType]> = [
  ["^/$", "home"],
  ["^/blog$", "blog_index"],
  ["^/blog/", "blog_post"],
  ["^/faq$", "faq"],
  ["^/a-propos$", "about"],
  ["^/bio$", "links"],
  ["^/(cgu|confidentialite|mentions-legales|cookies)$", "legal"],
];

export function pageTypeOf(pathname: string): PageType {
  for (const [pattern, type] of PAGE_TYPE_RULES) {
    if (new RegExp(pattern).test(pathname)) return type;
  }
  return "other";
}

/* --- envoi ---------------------------------------------------------------- */

/** GA4 tronque au-delà de 100 caractères : autant le faire nous-mêmes, pour
 *  que ce qui part soit ce qu'on lira dans les rapports. */
const MAX_VALUE_LENGTH = 100;

function clean(params: EventParams): Record<string, unknown> {
  const out: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    out[key] =
      typeof value === "string" ? value.slice(0, MAX_VALUE_LENGTH) : value;
  }

  return out;
}

/**
 * Envoie un événement, si et seulement si le tag est chargé.
 *
 * Aucune file d'attente : tant que le consentement n'est pas donné, `gtag`
 * n'existe pas et l'événement est perdu — c'est le comportement voulu, et
 * celui qu'annonce notre politique cookies. Rejouer après coup ce qui s'est
 * passé avant l'acceptation reviendrait à mesurer sans consentement.
 */
export function track(name: EventName, params: EventParams = {}) {
  if (!ANALYTICS_ENABLED) return;
  if (typeof window === "undefined") return;

  const payload = clean({
    page_type: pageTypeOf(window.location.pathname),
    ...params,
  });

  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", name, payload);
  }

  window.gtag?.("event", name, payload);
}

/** Raccourci pour les événements déclenchés par un clic : le délai depuis
 *  l'ouverture de la page et la profondeur atteinte disent, ensemble, combien
 *  d'argumentaire il aura fallu. */
export function clickContext() {
  return {
    time_to_click_s: elapsedSeconds(pageOpenedAt),
    scroll_depth_at_click: maxScrollDepth,
    sections_seen: sectionsSeen,
  };
}

export function viewContext() {
  return {
    time_to_view_s: elapsedSeconds(pageOpenedAt),
    scroll_depth_at_view: maxScrollDepth,
  };
}
