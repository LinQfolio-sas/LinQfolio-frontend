"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Lang = "fr" | "en";

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const STORAGE_KEY = "linqfolio-lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  // En navigation privée stricte, l'accès à `localStorage` lève. Sans garde,
  // l'exception remonte pendant l'hydratation et emporte toute la page.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "fr" || stored === "en") setLangState(stored);
    } catch {
      // La langue vaut alors pour la session.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Idem : rien à persister, on continue.
    }
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang: setLangState }}>
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
