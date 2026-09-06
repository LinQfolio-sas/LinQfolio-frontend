"use client";

import ConsentPreferences from "./ConsentPreferences";
import styles from "./CookiesPage.module.css";
import {
  COOKIES_SECTIONS_FR,
  COOKIES_SECTIONS_EN,
  COOKIES_EFFECTIVE_DATE_FR,
  COOKIES_EFFECTIVE_DATE_EN,
  type CookiesBlock,
} from "@/lib/cookies-data";
import Navbar from "./Navbar";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { autolink } from "@/lib/legal-links";

const COPY = {
  fr: {
    eyebrow: "Document légal",
    headlineLine1: "Politique",
    headlineLine2: "Cookies",
    subheadPrefix: "En vigueur depuis le",
    subheadSuffix: "Ce que nous déposons sur votre navigateur, pourquoi, et pour combien de temps.",
    note: "7 sections, en clair 🍪",
    tocAria: "Sommaire de la politique cookies",
    tableAria: "Tableau des cookies déposés",
    tocLabel: "Sommaire",
    sectionLabel: "Section",
    contactEyebrow: "Une question sur les cookies ?",
    contactHeadline: "Écrivez-nous directement.",
    dpoTitle: "Données personnelles (DPO)",
    dpoDesc: "Droits RGPD, retrait du consentement",
    supportTitle: "Support général",
    supportDesc: "Questions sur le site marketing et la newsletter",
    sections: COOKIES_SECTIONS_FR,
    effectiveDate: COOKIES_EFFECTIVE_DATE_FR,
  },
  en: {
    eyebrow: "Legal document",
    headlineLine1: "Cookie",
    headlineLine2: "Policy",
    subheadPrefix: "In effect since",
    subheadSuffix: "What we place on your browser, why, and for how long.",
    note: "7 sections, plain and simple 🍪",
    tocAria: "Cookie policy table of contents",
    tableAria: "Table of cookies set",
    tocLabel: "Table of contents",
    sectionLabel: "Section",
    contactEyebrow: "A question about cookies?",
    contactHeadline: "Write to us directly.",
    dpoTitle: "Personal data (DPO)",
    dpoDesc: "GDPR rights, withdrawing consent",
    supportTitle: "General support",
    supportDesc: "Questions about the marketing site and the newsletter",
    sections: COOKIES_SECTIONS_EN,
    effectiveDate: COOKIES_EFFECTIVE_DATE_EN,
  },
} as const;

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function renderBlock(block: CookiesBlock, key: number, tableLabel: string) {
  switch (block.type) {
    case "h3":
      return (
        <h3 className={styles.subhead} key={key}>
          {block.text}
        </h3>
      );
    case "list":
      return (
        <ul className={styles.list} key={key}>
          {block.items.map((item) => (
            <li key={item}>{autolink(item)}</li>
          ))}
        </ul>
      );
    case "check":
      return (
        <ul className={styles.checklist} key={key}>
          {block.items.map((item) => (
            <li key={item}>
              <span className={styles.checkMark} aria-hidden="true">
                ✓
              </span>
              {autolink(item)}
            </li>
          ))}
        </ul>
      );
    case "table":
      return (
        /* Le tableau défile horizontalement sur petit écran : sans `tabindex`,
           on ne peut pas le faire défiler au clavier (WCAG 2.1.1). */
        <div
          className={styles.tableWrap}
          key={key}
          role="region"
          aria-label={tableLabel}
          tabIndex={0}
        >
          <table className={styles.table}>
            <thead>
              <tr>
                {block.headers.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{autolink(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "p":
    default:
      return (
        <p className={styles.text} key={key}>
          {autolink(block.text)}
        </p>
      );
  }
}

export default function CookiesPage() {
  const { lang } = useLanguage();
  const t = COPY[lang];

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.washTop} aria-hidden="true" />
        <div className={styles.washBottom} aria-hidden="true" />
        <div className={styles.grain} aria-hidden="true" />
        <span className={styles.markSection} aria-hidden="true">
          §
        </span>

        <Navbar />

        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>{t.eyebrow}</p>
          <h1 className={styles.headline}>
            {t.headlineLine1}
            <br />
            {t.headlineLine2}
          </h1>
          <p className={styles.subhead}>
            {t.subheadPrefix} {t.effectiveDate}. {t.subheadSuffix}
          </p>

          <div className={styles.note} aria-hidden="true">
            {t.note}
          </div>
        </div>
      </section>

      <section className={styles.doc}>
        <div className={styles.docInner}>
          <nav className={styles.toc} aria-label={t.tocAria}>
            <p className={styles.tocLabel}>{t.tocLabel}</p>
            <ol className={styles.tocList}>
              {t.sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>
                    <span className={styles.tocNumber}>{pad(section.number)}</span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className={styles.articles}>
            {t.sections.map((section) => (
              <section
                className={styles.article}
                id={section.id}
                key={section.id}
              >
                <div className={styles.articleHead}>
                  <span className={styles.articleTab}>
                    {t.sectionLabel} {section.number}
                  </span>
                  <h2 className={styles.articleTitle}>{section.title}</h2>
                </div>
                {section.blocks.map((block, i) => renderBlock(block, i, t.tableAria))}

                {/* Le contrôle est posé dans la section qui l'explique, pas en
                    bas de page : « Comment retirer votre consentement ? » est
                    l'entrée du sommaire que l'on vient cliquer pour ça. */}
                {section.id === "retrait-consentement" ? (
                  <ConsentPreferences />
                ) : null}
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.contact}>
        <div className={styles.contactInner}>
          <p className={styles.contactEyebrow}>{t.contactEyebrow}</p>
          <h2 className={styles.contactHeadline}>{t.contactHeadline}</h2>

          <div className={styles.contactCards}>
            <a href="mailto:dpo@linqfolio.com" className={styles.contactCard}>
              <span className={styles.contactIcon} aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <rect x="4" y="8.5" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M6.5 8.5V6a3.5 3.5 0 0 1 7 0v2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </span>
              <span className={styles.contactCardTitle}>{t.dpoTitle}</span>
              <span className={styles.contactCardDesc}>
                {t.dpoDesc}
              </span>
              <span className={styles.contactCardLink}>
                dpo@linqfolio.com
                <svg width="12" height="9" viewBox="0 0 14 10" fill="none" aria-hidden="true">
                  <path
                    d="M1 5h11.5M8 1l4.5 4L8 9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </a>

            <a href="mailto:support@linqfolio.com" className={styles.contactCard}>
              <span className={styles.contactIcon} aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M2.5 9.3c0-3.6 3.4-6.3 7.5-6.3s7.5 2.7 7.5 6.3-3.4 6.3-7.5 6.3c-.8 0-1.6-.1-2.3-.3L4 17l1-3.2c-1.6-1.1-2.5-2.7-2.5-4.5Z"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className={styles.contactCardTitle}>{t.supportTitle}</span>
              <span className={styles.contactCardDesc}>
                {t.supportDesc}
              </span>
              <span className={styles.contactCardLink}>
                support@linqfolio.com
                <svg width="12" height="9" viewBox="0 0 14 10" fill="none" aria-hidden="true">
                  <path
                    d="M1 5h11.5M8 1l4.5 4L8 9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
