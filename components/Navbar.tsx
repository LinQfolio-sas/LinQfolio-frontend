"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import DownloadDialog from "./DownloadDialog";
import LanguageToggle from "./LanguageToggle";
import ThemeToggle from "./ThemeToggle";
import { useLanguage, useT } from "@/lib/i18n/LanguageContext";
import { href } from "@/lib/seo";
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
  const { lang } = useLanguage();
  const t = useT(COPY);
  const pathname = usePathname() ?? "/";
  const [downloadOpen, setDownloadOpen] = useState(false);

  return (
    <nav className={styles.nav} aria-label={t.aria}>
      <a href={href("home", lang)} className={styles.brand} aria-label={t.home}>
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
        {/* Le lien reste un lien : sans JavaScript il mène au bandeau de fin
            de la page d'accueil, qui porte les mêmes deux magasins. Avec, il
            ouvre la carte sur place plutôt que de faire faire l'aller-retour. */}
        <a
          href={`${href("home", lang)}#telecharger`}
          className={styles.cta}
          aria-haspopup="dialog"
          onClick={(event) => {
            event.preventDefault();
            setDownloadOpen(true);
          }}
        >
          {t.cta}
        </a>
      </div>

      <DownloadDialog
        open={downloadOpen}
        onClose={() => setDownloadOpen(false)}
      />
    </nav>
  );
}
