"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

export type Lang = "fr" | "en";

type LanguageContextValue = {
  lang: Lang;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

/**
 * La langue de la page, décidée par l'URL.
 *
 * Elle l'était auparavant par `localStorage` et `navigator.languages`, ce qui
 * donnait une bascule instantanée mais une seule adresse pour deux langues.
 * Le prix était lourd : le HTML servi était toujours français, donc l'anglais
 * n'existait pour aucun moteur de recherche — pas une position perdue, pas une
 * page mal classée, simplement rien du tout. La moitié du contenu du site
 * était invisible.
 *
 * Le français vit désormais à la racine et l'anglais sous `/en` (voir
 * `lib/seo.ts`). Chaque langue a son adresse, son `<html lang>` posé par le
 * serveur et son entrée dans le plan du site ; le contexte ne fait plus que
 * distribuer, aux composants qui en ont besoin, ce que l'URL a déjà tranché.
 *
 * Il n'y a donc plus de `setLang` : changer de langue, c'est changer de page.
 * `LanguageToggle` s'en charge par un lien, ce qui a l'avantage secondaire
 * d'être une bascule que Google peut suivre.
 */
export function LanguageProvider({
  lang,
  children,
}: {
  lang: Lang;
  children: ReactNode;
}) {
  const value = useMemo(() => ({ lang }), [lang]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}

/** Picks the value for the active language from a { fr, en } pair. */
export function useT<F, E>(pair: { fr: F; en: E }): F | E {
  const { lang } = useLanguage();
  return pair[lang];
}
