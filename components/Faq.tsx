"use client";

import { useState } from "react";
import { useLanguage, useT } from "@/lib/i18n/LanguageContext";
import { href } from "@/lib/seo";
import styles from "./Faq.module.css";

type QA = { q: string; a: string };

const FAQS_FR: QA[] = [
  {
    q: "LinQfolio est-il gratuit ?",
    a: "Oui, entièrement. Le fil, les cercles de lecture et les échanges de livres sont gratuits, sans carte bancaire à l'inscription.",
  },
  {
    q: "Comment se passe un échange de livres ?",
    a: "Vous proposez un titre, convenez d'une remise dans la messagerie intégrée et suivez chaque étape jusqu'à la remise en main propre, près de chez vous ou ailleurs en France.",
  },
  {
    q: "Dois-je lire sur l'application ?",
    a: "Non. LinQfolio accompagne votre lecture : papier, liseuse ou audio. Ce n'est ni une librairie ni un lecteur d'ebooks, juste le fil qui relie vos lectures à celles de vos amis.",
  },
  {
    q: "Que deviennent mes données ?",
    a: "Elles restent les vôtres. Aucune revente à des tiers, hébergement en Europe, conforme au RGPD.",
  },
];

const FAQS_EN: QA[] = [
  {
    q: "Is LinQfolio free?",
    a: "Yes, entirely. The feed, reading circles, and book swaps are free, no credit card required to sign up.",
  },
  {
    q: "How does a book swap work?",
    a: "You offer a title, arrange a handoff through the built-in messaging, and follow each step through to handing it over in person, near you or elsewhere in France.",
  },
  {
    q: "Do I have to read inside the app?",
    a: "No. LinQfolio accompanies your reading: print, e-reader, or audio. It's neither a bookshop nor an ebook reader, just the feed that connects your reading to your friends'.",
  },
  {
    q: "What happens to my data?",
    a: "It stays yours. No reselling to third parties, hosted in Europe, GDPR-compliant.",
  },
];

const COPY = {
  fr: { eyebrow: "Questions fréquentes", headline: "Avant de vous lancer", more: "Voir toutes les questions", faqs: FAQS_FR },
  en: { eyebrow: "Frequently asked questions", headline: "Before you dive in", more: "See all questions", faqs: FAQS_EN },
} as const;

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const { lang } = useLanguage();
  const t = useT(COPY);

  return (
    <section className={styles.section} data-section="faq_home">
      <div className={styles.inner}>
        <p className={styles.eyebrow}>{t.eyebrow}</p>
        <h2 className={styles.headline}>{t.headline}</h2>

        <ul className={styles.list}>
          {t.faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <li className={styles.item} key={item.q}>
                <h3 className={styles.itemHeading}>
                  <button
                    type="button"
                    className={styles.question}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    {item.q}
                    <span className={styles.icon} aria-hidden="true" />
                  </button>
                </h3>
                <div
                  className={styles.answerWrap}
                  id={`faq-answer-${i}`}
                  data-open={isOpen}
                >
                  <p className={styles.answer}>{item.a}</p>
                </div>
              </li>
            );
          })}
        </ul>

        <a href={href("faq", lang)} className={styles.more}>
          {t.more}
          <svg width="13" height="10" viewBox="0 0 14 10" fill="none" aria-hidden="true">
            <path
              d="M1 5h11.5M8 1l4.5 4L8 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </section>
  );
}
