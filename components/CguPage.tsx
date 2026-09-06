"use client";

import styles from "./CguPage.module.css";
import {
  CGU_ARTICLES_FR,
  CGU_ARTICLES_EN,
  CGU_EFFECTIVE_DATE_FR,
  CGU_EFFECTIVE_DATE_EN,
  type CguBlock,
} from "@/lib/cgu-data";
import Navbar from "./Navbar";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { autolink } from "@/lib/legal-links";

const COPY = {
  fr: {
    eyebrow: "Document légal",
    headlineLine1: "Conditions Générales",
    headlineLine2: "d’Utilisation",
    subheadPrefix: "En vigueur depuis le",
    subheadSuffix:
      "Rédigées pour être lues jusqu’au bout, pas seulement acceptées d’un clic.",
    note: (n: number) => `${n} articles, en clair 🔖`,
    tocAria: "Sommaire des CGU",
    tocLabel: "Sommaire",
    articleLabel: "Article",
    contactEyebrow: "Une question sur ces CGU ?",
    contactHeadline: "Écrivez-nous directement.",
    supportTitle: "Support général",
    supportDesc: "Questions sur les CGU, réclamations, support technique",
    dpoTitle: "Données personnelles (DPO)",
    dpoDesc: "Droits RGPD, export et suppression de données",
    articles: CGU_ARTICLES_FR,
    effectiveDate: CGU_EFFECTIVE_DATE_FR,
  },
  en: {
    eyebrow: "Legal document",
    headlineLine1: "Terms of Use",
    headlineLine2: "",
    subheadPrefix: "In effect since",
    subheadSuffix:
      "Written to be read all the way through, not just accepted with a click.",
    note: (n: number) => `${n} articles, plainly stated 🔖`,
    tocAria: "Table of contents",
    tocLabel: "Contents",
    articleLabel: "Article",
    contactEyebrow: "A question about these Terms?",
    contactHeadline: "Write to us directly.",
    supportTitle: "General support",
    supportDesc: "Questions about the Terms, complaints, technical support",
    dpoTitle: "Personal data (DPO)",
    dpoDesc: "GDPR rights, data export and deletion",
    articles: CGU_ARTICLES_EN,
    effectiveDate: CGU_EFFECTIVE_DATE_EN,
  },
} as const;

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function renderBlock(block: CguBlock, key: number) {
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

export default function CguPage() {
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
            {t.headlineLine2 && (
              <>
                <br />
                {t.headlineLine2}
              </>
            )}
          </h1>
          <p className={styles.subhead}>
            {t.subheadPrefix} {t.effectiveDate}. {t.subheadSuffix}
          </p>

          <div className={styles.note} aria-hidden="true">
            {t.note(t.articles.length)}
          </div>
        </div>
      </section>

      <section className={styles.doc}>
        <div className={styles.docInner}>
          <nav className={styles.toc} aria-label={t.tocAria}>
            <p className={styles.tocLabel}>{t.tocLabel}</p>
            <ol className={styles.tocList}>
              {t.articles.map((article) => (
                <li key={article.id}>
                  <a href={`#${article.id}`}>
                    <span className={styles.tocNumber}>{pad(article.number)}</span>
                    {article.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className={styles.articles}>
            {t.articles.map((article) => (
              <section
                className={styles.article}
                id={article.id}
                key={article.id}
              >
                <div className={styles.articleHead}>
                  <span className={styles.articleTab}>
                    {t.articleLabel} {article.number}
                  </span>
                  <h2 className={styles.articleTitle}>{article.title}</h2>
                </div>
                {article.blocks.map((block, i) => renderBlock(block, i))}
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
              <span className={styles.contactCardDesc}>{t.supportDesc}</span>
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
              <span className={styles.contactCardDesc}>{t.dpoDesc}</span>
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
