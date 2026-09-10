"use client";

import type { CSSProperties, ReactNode } from "react";
import LanguageToggle from "./LanguageToggle";
import ThemeToggle from "./ThemeToggle";
import { socialIcon } from "./SocialIcons";
import { useLanguage, useT } from "@/lib/i18n/LanguageContext";
import { trackStoreClick } from "@/lib/analytics/events";
import { CONTACT_EMAILS, SOCIAL_BY_NAME, STORE_LINKS } from "@/lib/links";
import styles from "./LinksPage.module.css";

/**
 * La page « lien en bio » — la destination unique qu'on colle dans le profil
 * Instagram, TikTok ou LinkedIn.
 *
 * Elle est mise en page comme les pages de garde d'un livre : la marque en
 * frontispice, l'ex-libris qui porte le code à scanner, puis un sommaire. Le
 * sommaire n'est pas un ornement — une liste de destinations EST une table des
 * matières, et sa colonne de droite porte l'adresse comme celle d'un livre
 * porte le numéro de page. D'où les pointillés de conduite, qui relient le nom
 * à son adresse au lieu de décorer la ligne.
 *
 * Les rangées ne sont pas numérotées : rien ici ne se lit dans l'ordre.
 */

const COPY = {
  fr: {
    tagline: "Le fil social des lecteurs et lectrices.",
    qrAlt:
      "Code QR menant à linqfolio.com, où télécharger l’application",
    storeLabel: "L’application",
    appStore: "App Store",
    googlePlay: "Google Play",
    appStoreAria: "Télécharger LinQfolio sur l’App Store",
    googlePlayAria: "Télécharger LinQfolio sur Google Play",
    contentsAria: "Sommaire",
    onSocial: "Sur les réseaux",
    direct: "En direct",
    site: "Le site",
    write: "Nous écrire",
    discordLocator: "le serveur",
    legalNotice: "Mentions légales",
    privacy: "Confidentialité",
    copyright: "© 2026 LinQfolio · Paris",
  },
  en: {
    tagline: "The social feed for readers.",
    qrAlt: "QR code leading to linqfolio.com, where the app is available",
    storeLabel: "The app",
    appStore: "App Store",
    googlePlay: "Google Play",
    appStoreAria: "Download LinQfolio on the App Store",
    googlePlayAria: "Download LinQfolio on Google Play",
    contentsAria: "Contents",
    onSocial: "On social",
    direct: "Direct",
    site: "The site",
    write: "Write to us",
    discordLocator: "the server",
    legalNotice: "Legal notice",
    privacy: "Privacy",
    copyright: "© 2026 LinQfolio · Paris",
  },
} as const;

/** Flèche de téléchargement, la même que dans le hero et le bandeau de fin. */
function DownloadGlyph() {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M10 2.5v10.5M6 9.5l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.5 15.5v1.5a1.5 1.5 0 0 0 1.5 1.5h10a1.5 1.5 0 0 0 1.5-1.5v-1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* Les deux dernières rangées ne sont pas des marques : leur glyphe est tracé
   au filet plutôt qu'en aplat, ce qui distingue « nos comptes ailleurs » de
   « nous, en direct » sans avoir à l'écrire. */

function GlobeGlyph() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M3 12h18M12 3c2.4 2.5 3.6 5.5 3.6 9s-1.2 6.5-3.6 9c-2.4-2.5-3.6-5.5-3.6-9S9.6 5.5 12 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailGlyph() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="2.75"
        y="5"
        width="18.5"
        height="14"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="m3.75 7.5 7.09 5.06a2 2 0 0 0 2.32 0l7.09-5.06"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

type Row = {
  key: string;
  href: string;
  name: string;
  /** La colonne de droite du sommaire : où la rangée mène, en clair. */
  locator: string;
  icon: ReactNode;
  /** Un lien interne ou `mailto:` reste dans l'onglet courant. */
  external: boolean;
};

/** Retarde l'entrée d'un élément dans la chorégraphie d'arrivée. */
function delay(value: string): CSSProperties {
  return { "--delay": value } as CSSProperties;
}

export default function LinksPage() {
  const t = useT(COPY);
  const { lang } = useLanguage();

  const social: Row[] = [
    {
      key: "instagram",
      href: SOCIAL_BY_NAME.Instagram,
      name: "Instagram",
      locator: "@linqfolio",
      icon: socialIcon("Instagram", 17),
      external: true,
    },
    {
      key: "tiktok",
      href: SOCIAL_BY_NAME.TikTok,
      name: "TikTok",
      locator: "@linqfolio",
      icon: socialIcon("TikTok", 17),
      external: true,
    },
    {
      key: "facebook",
      href: SOCIAL_BY_NAME.Facebook,
      name: "Facebook",
      locator: "@linqfolio",
      icon: socialIcon("Facebook", 17),
      external: true,
    },
    {
      key: "x",
      href: SOCIAL_BY_NAME.X,
      name: "X",
      locator: "@linqfolio",
      icon: socialIcon("X", 17),
      external: true,
    },
    {
      key: "linkedin",
      href: SOCIAL_BY_NAME.LinkedIn,
      name: "LinkedIn",
      locator: "@linqfolio",
      icon: socialIcon("LinkedIn", 17),
      external: true,
    },
    {
      key: "discord",
      href: SOCIAL_BY_NAME.Discord,
      name: "Discord",
      locator: t.discordLocator,
      icon: socialIcon("Discord", 17),
      external: true,
    },
  ];

  const direct: Row[] = [
    {
      key: "site",
      href: "/",
      name: t.site,
      locator: "linqfolio.com",
      icon: <GlobeGlyph />,
      external: false,
    },
    {
      key: "mail",
      href: `mailto:${CONTACT_EMAILS.support}`,
      name: t.write,
      locator: CONTACT_EMAILS.support,
      icon: <MailGlyph />,
      external: false,
    },
  ];

  /* `rank` est le rang de la rangée dans la page entière, pas dans son groupe :
     la séquence d'arrivée descend d'un bloc à l'autre sans repartir de zéro.
     Le second groupe reçoit donc la longueur du premier comme point de départ. */
  function renderGroup(id: string, label: string, rows: Row[], rank: number) {
    return (
      <section className={styles.group} aria-labelledby={`${id}-titre`}>
        <div
          className={`${styles.groupHead} ${styles.reveal}`}
          style={delay(`${0.4 + rank * 0.045}s`)}
        >
          <h2 className={styles.groupLabel} id={`${id}-titre`}>
            {label}
          </h2>
          <span className={styles.groupRule} aria-hidden="true" />
        </div>

        <ul className={styles.rows}>
          {rows.map((row, index) => {
            return (
              <li key={row.key}>
                <a
                  className={`${styles.row} ${styles.reveal}`}
                  style={delay(`${0.4 + (rank + index + 1) * 0.045}s`)}
                  href={row.href}
                  {...(row.external
                    ? { target: "_blank", rel: "noreferrer" }
                    : {})}
                >
                  <span className={styles.rowIcon} aria-hidden="true">
                    {row.icon}
                  </span>
                  <span className={styles.rowName}>{row.name}</span>
                  <span className={styles.leader} aria-hidden="true" />
                  <span className={styles.rowLocator}>{row.locator}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </section>
    );
  }

  return (
    <main className={styles.page} data-section="liens">
      <div className={styles.wash} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />

      <div className={styles.inner}>
        {/* Les deux bascules tiennent le haut de page, à la taille d'un
            réglage : on les cherche là, et elles ne disputent rien au
            frontispice. */}
        <div className={styles.topBar}>
          <LanguageToggle />
          <ThemeToggle />
        </div>

        <div className={styles.identity}>
          <h1 className={`${styles.masthead} ${styles.reveal}`}>
            <img
              className={styles.logo}
              src="/linqfolio/LinQFolio_Primary_Logo_Violet.png"
              alt="LinQfolio"
              width={1667}
              height={1667}
            />
          </h1>

          <p className={`${styles.tagline} ${styles.reveal}`} style={delay("0.08s")}>
            {t.tagline}
          </p>

          {/* L'ex-libris : la petite plaque gravée qu'on colle en page de garde
              pour dire à qui appartient le livre. Ici elle porte le code.

              Sa palette est celle de la marque, pas celle du thème. Un lecteur
              de QR attend des modules sombres sur fond clair ; en thème sombre,
              inverser ferait échouer une partie des appareils. La plaque reste
              donc crème, éclairée, comme un objet posé sur la page. */}
          <div className={`${styles.plate} ${styles.reveal}`} style={delay("0.16s")}>
            <div className={styles.qrFrame}>
              <img
                className={styles.qrImage}
                src="/qr-bio.svg"
                alt={t.qrAlt}
                width={33}
                height={33}
              />
            </div>
          </div>
        </div>

        <div className={styles.store} data-cta="links">
          <p className={`${styles.storeLabel} ${styles.reveal}`} style={delay("0.24s")}>
            {t.storeLabel}
          </p>

          <div className={`${styles.storeRow} ${styles.reveal}`} style={delay("0.28s")}>
            <a
              className={styles.storeButton}
              href={STORE_LINKS.appStore}
              target="_blank"
              rel="noreferrer"
              aria-label={t.appStoreAria}
              onClick={() => trackStoreClick("app_store", "links", lang)}
            >
              <DownloadGlyph />
              {t.appStore}
            </a>
            <a
              className={`${styles.storeButton} ${styles.storeButtonPlain}`}
              href={STORE_LINKS.googlePlay}
              target="_blank"
              rel="noreferrer"
              aria-label={t.googlePlayAria}
              onClick={() => trackStoreClick("google_play", "links", lang)}
            >
              <DownloadGlyph />
              {t.googlePlay}
            </a>
          </div>
        </div>

        <nav className={styles.contents} aria-label={t.contentsAria}>
          {renderGroup("reseaux", t.onSocial, social, 0)}
          {renderGroup("direct", t.direct, direct, social.length)}
        </nav>

        <footer className={`${styles.colophon} ${styles.reveal}`} style={delay("0.82s")}>
          <p className={styles.legal}>
            <a href="/mentions-legales">{t.legalNotice}</a>
            <span aria-hidden="true">·</span>
            <a href="/confidentialite">{t.privacy}</a>
          </p>
          <p className={styles.copyright}>{t.copyright}</p>
        </footer>
      </div>
    </main>
  );
}
