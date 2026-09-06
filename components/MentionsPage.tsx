"use client";

import styles from "./MentionsPage.module.css";
import {
  MENTIONS_SECTIONS_FR,
  MENTIONS_SECTIONS_EN,
  MENTIONS_EFFECTIVE_DATE_FR,
  MENTIONS_EFFECTIVE_DATE_EN,
  type MentionsBlock,
} from "@/lib/mentions-data";
import Navbar from "./Navbar";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { autolink } from "@/lib/legal-links";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function renderBlock(block: MentionsBlock, key: number) {
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
    headlineLine1: "Mentions",
    headlineLine2: "Légales",
    subhead: (date: string) => (
      <>
        En vigueur depuis le {date}. Qui édite LinQfolio, qui héberge, et qui
        contacter en cas de besoin.
      </>
    ),
    note: "13 sections, en clair 🏛️",
    tocAriaLabel: "Sommaire des mentions légales",
    tocLabel: "Sommaire",
    sectionLabel: "Section",
    contactEyebrow: "Une question sur ces mentions ?",
    contactHeadline: "Écrivez-nous directement.",
    supportTitle: "Support général",
    supportDesc: "Questions légales, réclamations, support technique",
    dpoTitle: "Données personnelles (DPO)",
    dpoDesc: "Droits RGPD, export et suppression de données",
    sections: MENTIONS_SECTIONS_FR,
    effectiveDate: MENTIONS_EFFECTIVE_DATE_FR,
  },
  en: {
    eyebrow: "Legal document",
    headlineLine1: "Legal",
    headlineLine2: "Notice",
    subhead: (date: string) => (
      <>
        In effect since {date}. Who publishes LinQfolio, who hosts it, and
        who to contact if you need help.
      </>
    ),
    note: "13 sections, plain and clear 🏛️",
    tocAriaLabel: "Legal notice table of contents",
    tocLabel: "Table of contents",
    sectionLabel: "Section",
    contactEyebrow: "A question about this notice?",
    contactHeadline: "Write to us directly.",
    supportTitle: "General support",
    supportDesc: "Legal questions, complaints, technical support",
    dpoTitle: "Personal data (DPO)",
    dpoDesc: "GDPR rights, data export and deletion",
    sections: MENTIONS_SECTIONS_EN,
    effectiveDate: MENTIONS_EFFECTIVE_DATE_EN,
  },
} as const;

export default function MentionsPage() {
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
          <p className={styles.subhead}>{t.subhead(t.effectiveDate)}</p>

          <div className={styles.note} aria-hidden="true">
            {t.note}
          </div>
        </div>
      </section>

      <section className={styles.doc}>
        <div className={styles.docInner}>
          <nav className={styles.toc} aria-label={t.tocAriaLabel}>
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
          </div>
        </div>
      </section>
    </>
  );
}
