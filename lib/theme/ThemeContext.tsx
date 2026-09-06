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

type Resolved = "light" | "dark";

type ThemeContextValue = {
  /** Ce qui est enregistré : `system` tant que personne n'a choisi. */
  theme: Theme;
  /** Ce qui est réellement affiché, préférence système résolue. */
  resolved: Resolved;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/* ---------------------------------------------------------------------------
   Le thème vit dans deux systèmes extérieurs à React — le stockage local et
   `prefers-color-scheme`. On le lit donc avec `useSyncExternalStore` plutôt
   qu'avec un état recopié dans un effet : pas de rendu en cascade, et React
   remplace l'instantané serveur par celui du client avant la première peinture.

   L'instantané est une chaîne « choix|résolu » pour rester comparable par
   valeur, ce qu'attend `useSyncExternalStore`.
   ------------------------------------------------------------------------ */

const SERVER_SNAPSHOT = "system|light";

const listeners = new Set<() => void>();
let cached: string | null = null;

function systemPrefersDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function readStored(): Theme {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : "system";
  } catch {
    // Navigation privée stricte : le thème vaut pour la session.
    return "system";
  }
}

function getSnapshot(): string {
  if (cached === null) {
    const stored = readStored();
    const resolved =
      stored === "system" ? (systemPrefersDark() ? "dark" : "light") : stored;
    cached = `${stored}|${resolved}`;
  }
  return cached;
}

function getServerSnapshot(): string {
  return SERVER_SNAPSHOT;
}

function invalidate() {
  cached = null;
  for (const listener of listeners) listener();
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onMedia = () => invalidate();
  // `storage` garde les onglets ouverts en accord entre eux.
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === THEME_STORAGE_KEY) invalidate();
  };
  media.addEventListener("change", onMedia);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    media.removeEventListener("change", onMedia);
    window.removeEventListener("storage", onStorage);
  };
}

function apply(theme: Theme) {
  const root = document.documentElement;
  if (theme === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", theme);
  syncThemeColorMeta(theme);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [theme, resolved] = snapshot.split("|") as [Theme, Resolved];

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
      if (next === "system") window.localStorage.removeItem(THEME_STORAGE_KEY);
      else window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Stockage refusé : le choix vaut pour la session.
    }

    apply(next);
    invalidate();
  }, []);

  const value = useMemo(
    () => ({ theme, resolved, setTheme }),
    [theme, resolved, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
