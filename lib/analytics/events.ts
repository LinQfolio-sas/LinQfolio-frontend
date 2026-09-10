import type { Lang } from "@/lib/i18n/LanguageContext";
import { sendAudience } from "@/lib/audience/beacon";
import { clickContext, track } from "./track";

/**
 * Les gestes que plusieurs composants déclenchent à l'identique. Les
 * paramètres sont fixés ici une fois pour toutes : deux boutons « App Store »
 * à deux endroits de la page doivent produire exactement le même événement,
 * à `placement` près.
 */

export type StorePlacement = "hero" | "header" | "cta_footer" | "links";

export function trackStoreClick(
  store: "app_store" | "google_play",
  placement: StorePlacement,
  lang: Lang,
) {
  // Le total va aux compteurs internes, le contexte du clic à GA4. Le premier
  // est exhaustif et pauvre, le second riche et partiel : c'est en les
  // rapportant l'un à l'autre qu'on sait ce que vaut le second.
  sendAudience({ event: "store_click", placement, store });
  track("store_click", { store, placement, lang, ...clickContext() });
}

export function trackLangSwitch(from: Lang, to: Lang) {
  track("lang_switch", {
    from_lang: from,
    to_lang: to,
    page_path: window.location.pathname,
  });
}
