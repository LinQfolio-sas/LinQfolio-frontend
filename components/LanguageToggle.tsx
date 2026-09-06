"use client";

import { trackLangSwitch } from "@/lib/analytics/events";
import { useLanguage, type Lang } from "@/lib/i18n/LanguageContext";
import styles from "./LanguageToggle.module.css";

export default function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage();

  /** Une bascule vers l'anglais est la seule demande de marché anglophone
   *  qu'on puisse mesurer aujourd'hui : le contenu EN n'a pas d'URL propre,
   *  donc il n'apparaît ni dans Search Console ni dans les pages vues. */
  function choose(next: Lang) {
    if (next === lang) return;
    trackLangSwitch(lang, next);
    setLang(next);
  }

  return (
    <div
      className={className ? `${styles.toggle} ${className}` : styles.toggle}
      role="group"
      aria-label="Choisir la langue / Choose language"
    >
      <span
        className={`${styles.thumb} ${lang === "en" ? styles.thumbEn : ""}`}
        aria-hidden="true"
      />
      <button
        type="button"
        className={`${styles.option} ${lang === "fr" ? styles.optionActive : ""}`}
        aria-pressed={lang === "fr"}
        onClick={() => choose("fr")}
        lang="fr"
      >
        FR
      </button>
      <button
        type="button"
        className={`${styles.option} ${lang === "en" ? styles.optionActive : ""}`}
        aria-pressed={lang === "en"}
        onClick={() => choose("en")}
        lang="en"
      >
        EN
      </button>
    </div>
  );
}
