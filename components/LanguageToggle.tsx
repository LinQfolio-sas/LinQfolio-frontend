"use client";

import { usePathname } from "next/navigation";
import { trackLangSwitch } from "@/lib/analytics/events";
import { useLanguage, type Lang } from "@/lib/i18n/LanguageContext";
import { ROUTES, type PageId } from "@/lib/seo";
import styles from "./LanguageToggle.module.css";

/**
 * La bascule de langue, devenue une paire de liens.
 *
 * C'était un bouton qui changeait une valeur dans `localStorage`. Les deux
 * langues partageaient alors une seule adresse, et l'anglais n'existait donc
 * pour aucun moteur de recherche. Chaque langue ayant maintenant la sienne,
 * la bascule est un déplacement : un `<a href>` que le lecteur peut ouvrir
 * dans un onglet, que le clavier atteint sans code, et que Google suit pour
 * découvrir la version qu'il n'a pas encore vue.
 */

/** L'adresse de la page courante dans la langue `to`.
 *
 *  `from` est la langue de la page qu'on regarde, pas l'inverse de `to` : les
 *  deux options du sélecteur sont calculées depuis la même page, et celle qui
 *  correspond à la langue courante doit se retrouver elle-même.
 *
 *  Les articles ne passent pas par `ROUTES` — leurs slugs sont propres à
 *  chaque traduction et ne se déduisent pas de l'URL — et le journal est
 *  l'échelon le plus proche qu'on sache atteindre à coup sûr. Le `hreflang`
 *  du `<head>`, lui, pointe bien vers l'article traduit : c'est là que Google
 *  lit la correspondance, pas ici. */
function counterpart(pathname: string, from: Lang, to: Lang): string {
  for (const id of Object.keys(ROUTES) as PageId[]) {
    const route = ROUTES[id];
    const here = from === "en" ? route.en : route.fr;
    const there = to === "en" ? route.en : route.fr;
    if (here && there && here === pathname) return there;
  }

  const blog = to === "en" ? ROUTES.blog.en : ROUTES.blog.fr;
  if (blog && pathname.startsWith(from === "en" ? "/en/blog" : "/blog")) {
    return blog;
  }

  return to === "en" ? "/en" : "/";
}

export default function LanguageToggle({ className }: { className?: string }) {
  const { lang } = useLanguage();
  const pathname = usePathname();

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
      {(["fr", "en"] as const).map((option) => {
        const active = option === lang;
        return (
          <a
            key={option}
            className={`${styles.option} ${active ? styles.optionActive : ""}`}
            href={counterpart(pathname, lang, option)}
            hrefLang={option}
            lang={option}
            // La page courante reste dans le groupe pour que la bascule garde
            // ses deux repères, mais elle ne mène nulle part.
            aria-current={active ? "true" : undefined}
            onClick={() => {
              if (!active) trackLangSwitch(lang, option);
            }}
          >
            {option.toUpperCase()}
          </a>
        );
      })}
    </div>
  );
}
