"use client";

import styles from "./ConfidentialitePage.module.css";
import {
  CONFIDENTIALITE_SECTIONS_FR,
  CONFIDENTIALITE_SECTIONS_EN,
  CONFIDENTIALITE_EFFECTIVE_DATE_FR,
  CONFIDENTIALITE_EFFECTIVE_DATE_EN,
  type PolicyBlock,
} from "@/lib/confidentialite-data";
import Navbar from "./Navbar";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { autolink } from "@/lib/legal-links";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function renderBlock(block: PolicyBlock, key: number) {
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
    case "p":
    default:
      return (
        <p className={styles.text} key={key}>
          {autolink(block.text)}
        </p>
      );
  }
}

const COPY = {
  fr: {
    eyebrow: "Document légal",
    headline: (
      <>
        Politique de
        <br />
        Confidentialité
      </>
    ),
    subhead: (
      <>
        En vigueur depuis le {CONFIDENTIALITE_EFFECTIVE_DATE_FR}. Ce que
        nous collectons, pourquoi, et comment reprendre la main sur vos
        données.
      </>
    ),
    note: "13 sections, en clair 🔒",
    tocLabel: "Sommaire",
    tocAria: "Sommaire de la politique de confidentialité",
    sectionLabel: (n: number) => `Section ${n}`,
    contactEyebrow: "Une question sur vos données ?",
    contactHeadline: "Écrivez-nous directement.",
    dpoTitle: "Données personnelles (DPO)",
    dpoDesc: "Droits RGPD, export et suppression de données",
    authorityTitle: "Autorité de contrôle",
    authorityDesc: "Déposer une réclamation auprès de la CNIL",
    sections: CONFIDENTIALITE_SECTIONS_FR,
  },
  en: {
    eyebrow: "Legal document",
    headline: (
      <>
        Privacy
        <br />
        Policy
      </>
    ),
    subhead: (
      <>
        In effect since {CONFIDENTIALITE_EFFECTIVE_DATE_EN}. What we
        collect, why, and how to take back control of your data.
      </>
    ),
    note: "13 sections, in plain English 🔒",
    tocLabel: "Table of contents",
    tocAria: "Table of contents for the privacy policy",
    sectionLabel: (n: number) => `Section ${n}`,
    contactEyebrow: "A question about your data?",
    contactHeadline: "Write to us directly.",
    dpoTitle: "Personal data (DPO)",
    dpoDesc: "GDPR rights, data export, and deletion",
    authorityTitle: "Supervisory authority",
    authorityDesc: "File a complaint with the CNIL",
    sections: CONFIDENTIALITE_SECTIONS_EN,
  },
} as const;

export default function ConfidentialitePage() {
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
          <h1 className={styles.headline}>{t.headline}</h1>
          <p className={styles.subhead}>{t.subhead}</p>

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
                    {t.sectionLabel(section.number)}
                  </span>
                  <h2 className={styles.articleTitle}>{section.title}</h2>
                </div>
                {section.blocks.map((block, i) => renderBlock(block, i))}
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

            <a
              href="https://www.cnil.fr"
              target="_blank"
              rel="noreferrer"
              className={styles.contactCard}
            >
              <span className={styles.contactIcon} aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 2.5 3 5.5v3c0 4.4 3 8.1 7 9 4-.9 7-4.6 7-9v-3l-7-3Z"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className={styles.contactCardTitle}>{t.authorityTitle}</span>
              <span className={styles.contactCardDesc}>
                {t.authorityDesc}
              </span>
              <span className={styles.contactCardLink}>
                www.cnil.fr
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
