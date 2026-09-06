"use client";

import { useTheme } from "@/lib/theme/ThemeContext";
import { useT } from "@/lib/i18n/LanguageContext";
import styles from "./ThemeToggle.module.css";

/**
 * Sélecteur clair / sombre, même grammaire que le sélecteur de langue.
 *
 * L'état visuel vient entièrement du CSS, lu depuis `[data-theme]` sur <html>
 * (posé avant la première peinture par le script inline). React ne pilote donc
 * aucune classe ici : rien à réconcilier à l'hydratation, et le bouton affiche
 * le bon état même avant que le JavaScript n'arrive.
 *
 * `aria-pressed` est le seul point qui dépend de l'état React. Serveur et premier
 * rendu client partent tous deux de « clair », donc l'hydratation correspond ;
 * la valeur réelle est posée juste après, avant la première peinture.
 */

const COPY = {
  fr: {
    group: "Thème d'affichage",
    light: "Thème clair",
    dark: "Thème sombre",
  },
  en: {
    group: "Display theme",
    light: "Light theme",
    dark: "Dark theme",
  },
} as const;

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
      <circle cx="12" cy="12" r="4.4" />
      <path d="M12 2.4v2.2M12 19.4v2.2M2.4 12h2.2M19.4 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
      <path d="M20.2 14.6A8.6 8.6 0 0 1 9.4 3.8a8.6 8.6 0 1 0 10.8 10.8Z" />
    </svg>
  );
}

export default function ThemeToggle({ className }: { className?: string }) {
  const { resolved, setTheme } = useTheme();
  const t = useT(COPY);

  return (
    <div
      className={className ? `${styles.toggle} ${className}` : styles.toggle}
      role="group"
      aria-label={t.group}
    >
      <span className={styles.thumb} aria-hidden="true" />
      <button
        type="button"
        className={`${styles.option} ${styles.light}`}
        aria-label={t.light}
        aria-pressed={resolved === "light"}
        onClick={() => setTheme("light")}
      >
        <SunIcon />
      </button>
      <button
        type="button"
        className={`${styles.option} ${styles.dark}`}
        aria-label={t.dark}
        aria-pressed={resolved === "dark"}
        onClick={() => setTheme("dark")}
      >
        <MoonIcon />
      </button>
    </div>
  );
}
