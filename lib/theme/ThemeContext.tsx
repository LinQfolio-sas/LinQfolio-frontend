"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  THEME_STORAGE_KEY,
  isTheme,
  syncThemeColorMeta,
  type Theme,
} from "./theme-script";

type ThemeContextValue = {
  /** Le thème affiché : `light` tant que personne n'a choisi le sombre. */
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/* ---------------------------------------------------------------------------
   Le thème vit dans un système extérieur à React — le stockage local. On le
   lit donc avec `useSyncExternalStore` plutôt qu'avec un état recopié dans un
   effet : pas de rendu en cascade, et React remplace l'instantané serveur par
   celui du client avant la première peinture.

   La préférence système n'entre pas dans le calcul : l'arrivée se fait en
   clair, seul un choix enregistré fait passer au sombre.
   ------------------------------------------------------------------------ */

const SERVER_SNAPSHOT: Theme = "light";

const listeners = new Set<() => void>();
let cached: Theme | null = null;

function getSnapshot(): Theme {
  if (cached === null) {
    try {
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
      cached = isTheme(stored) ? stored : "light";
    } catch {
      // Navigation privée stricte : le thème vaut pour la session.
      cached = "light";
    }
  }
  return cached;
}

function getServerSnapshot(): Theme {
  return SERVER_SNAPSHOT;
}

function invalidate() {
  cached = null;
  for (const listener of listeners) listener();
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  // `storage` garde les onglets ouverts en accord entre eux.
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === THEME_STORAGE_KEY) invalidate();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

function apply(theme: Theme) {
  const root = document.documentElement;
  if (theme === "light") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", theme);
  syncThemeColorMeta(theme);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // En développement, le double montage de Strict Mode réinitialise les
  // attributs de <html> à ce que React gère depuis le JSX, ce qui efface celui
  // posé par le script inline. On le repose. Sans effet en production, où
  // l'attribut est déjà le bon.
  useEffect(() => {
    apply(theme);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    const root = document.documentElement;

    // Fondu court, uniquement le temps du basculement : une transition
    // permanente sur `*` coûterait un repaint à chaque survol.
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.setAttribute("data-theme-switching", "");
      window.setTimeout(() => root.removeAttribute("data-theme-switching"), 200);
    }

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Stockage refusé : le choix vaut pour la session.
    }

    apply(next);
    invalidate();
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
