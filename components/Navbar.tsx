"use client";

import { usePathname } from "next/navigation";
import LanguageToggle from "./LanguageToggle";
import ThemeToggle from "./ThemeToggle";
import { useT } from "@/lib/i18n/LanguageContext";
import styles from "./Navbar.module.css";

/** The site header. One instance, used by every page. */

const COPY = {
  fr: {
    aria: "Navigation principale",
    home: "Accueil LinQfolio",
    about: "À propos",
    blog: "Blog",
    faq: "FAQ",
    cta: "Télécharger",
  },
  en: {
    aria: "Main navigation",
    home: "LinQfolio home",
    about: "About",
    blog: "Blog",
    faq: "FAQ",
    cta: "Download",
  },
} as const;

const LINKS = [
  { href: "/a-propos", label: "about" },
  { href: "/blog", label: "blog" },
  { href: "/faq", label: "faq" },
] as const;

export default function Navbar() {
  const t = useT(COPY);
  const pathname = usePathname() ?? "/";

  return (
    <nav className={styles.nav} aria-label={t.aria}>
      <a href="/" className={styles.brand} aria-label={t.home}>
        <img
          className={styles.brandMark}
          src="/linqfolio/LinQFolio_Secondary_Logo_Violet_Large.png"
          alt="LinQfolio"
          width={1667}
          height={413}
        />
      </a>

      <ul className={styles.links}>
        {LINKS.map((link) => {
          // /blog/some-article keeps Blog marked as the current section.
          const current =
            pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <li key={link.href}>
              <a
                href={link.href}
                className={current ? styles.current : undefined}
                aria-current={current ? "page" : undefined}
              >
                {t[link.label]}
              </a>
            </li>
          );
        })}
      </ul>

      <div className={styles.right}>
        {/* Sous 560px l'en-tête n'a plus la place : le sélecteur de thème
            reprend sa place dans le pied de page. */}
        <ThemeToggle className={styles.themeToggle} />
        <LanguageToggle />
        <a href="/#telecharger" className={styles.cta}>
          {t.cta}
        </a>
      </div>
    </nav>
  );
}
