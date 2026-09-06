"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./FaqPage.module.css";
import {
  FAQ_CATEGORIES_FR,
  FAQ_CATEGORIES_EN,
  FAQ_ITEMS_FR,
  FAQ_ITEMS_EN,
  type FaqCategoryId,
} from "@/lib/faq-data";
import Navbar from "./Navbar";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type CategoryFilter = "all" | FaqCategoryId;

const COPY = {
  fr: {
    heroEyebrow: "Centre d’aide",
    headline: "Questions fréquentes",
    subhead: "Recherchez une réponse par mot-clé, filtrez par thème ou contactez-nous directement.",
    note1: "tapez un mot, ça suffit 🔍",
    note2: "29 réponses, zéro jargon",
    searchLabel: "Rechercher dans la FAQ",
    searchPlaceholder: "Ex. mot de passe, échange, Reading DNA…",
    clearAria: "Effacer la recherche",
    allCategories: "Toutes les catégories",
    resultsCount: (n: number) => `${n} question${n !== 1 ? "s" : ""} trouvée${n !== 1 ? "s" : ""}`,
    emptyNoQuery: "Aucune question dans cette catégorie pour le moment.",
    emptyWithQuery: (q: string) => (
      <>
        Aucun résultat pour «&nbsp;{q}&nbsp;». Essayez d&rsquo;autres mots ou contactez le support.
      </>
    ),
    contactSupport: "Contacter le support",
    questionWord: (n: number) => `question${n !== 1 ? "s" : ""}`,
    contactEyebrow: "Besoin d’aide ?",
    contactHeadline: "Vous ne trouvez pas votre réponse ?",
    contactSubhead: (
      <>
        Notre équipe répond aux questions sur l&rsquo;application, le
        compte et les signalements. Pour la vie privée et vos données,
        contactez le DPO.
      </>
    ),
    supportTitle: "Support général",
    supportDesc: "Bugs, compte, échanges, signalements",
    dpoTitle: "Données personnelles (DPO)",
    dpoDesc: "RGPD, export, suppression, cookies",
    categories: FAQ_CATEGORIES_FR,
    items: FAQ_ITEMS_FR,
  },
  en: {
    heroEyebrow: "Help center",
    headline: "Frequently asked questions",
    subhead: "Search for an answer by keyword, filter by topic, or contact us directly.",
    note1: "type a word, that’s it 🔍",
    note2: "29 answers, zero jargon",
    searchLabel: "Search the FAQ",
    searchPlaceholder: "E.g. password, swap, Reading DNA…",
    clearAria: "Clear search",
    allCategories: "All categories",
    resultsCount: (n: number) => `${n} question${n !== 1 ? "s" : ""} found`,
    emptyNoQuery: "No questions in this category yet.",
    emptyWithQuery: (q: string) => (
      <>
        No results for &ldquo;{q}&rdquo;. Try other words or contact support.
      </>
    ),
    contactSupport: "Contact support",
    questionWord: (n: number) => `question${n !== 1 ? "s" : ""}`,
    contactEyebrow: "Need help?",
    contactHeadline: "Can’t find your answer?",
    contactSubhead: (
      <>
        Our team answers questions about the app, your account, and
        reports. For privacy and your data, contact the DPO.
      </>
    ),
    supportTitle: "General support",
    supportDesc: "Bugs, account, swaps, reports",
    dpoTitle: "Personal data (DPO)",
    dpoDesc: "GDPR, export, deletion, cookies",
    categories: FAQ_CATEGORIES_EN,
    items: FAQ_ITEMS_EN,
  },
} as const;

const DIACRITICS_PATTERN = new RegExp("[\\u0300-\\u036f]", "g");

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(DIACRITICS_PATTERN, "")
    .toLowerCase()
    .trim();
}

export default function FaqPage() {
  const { lang } = useLanguage();
  const t = COPY[lang];
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  // Deep-link support: /faq#compte-3 opens the right question.
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const item = t.items.find((i) => i.id === hash);
    if (!item) return;
    setActiveCategory(item.category);
    setOpenIds(new Set([item.id]));
    requestAnimationFrame(() => {
      document.getElementById(item.id)?.scrollIntoView({ block: "center" });
    });
  }, [t.items]);

  const categoryCounts = useMemo(() => {
    const counts = new Map<FaqCategoryId, number>();
    for (const item of t.items) {
      counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
    }
    return counts;
  }, [t.items]);

  const normalizedQuery = normalize(query);

  const filteredItems = useMemo(() => {
    return t.items.filter((item) => {
      if (activeCategory !== "all" && item.category !== activeCategory) return false;
      if (!normalizedQuery) return true;
      return (
        normalize(item.question).includes(normalizedQuery) ||
        normalize(item.answer).includes(normalizedQuery)
      );
    });
  }, [t.items, activeCategory, normalizedQuery]);

  const groups = useMemo(() => {
    return t.categories.map((category) => ({
      category,
      items: filteredItems.filter((item) => item.category === category.id),
    })).filter((group) => group.items.length > 0);
  }, [t.categories, filteredItems]);

  function toggleItem(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function clearSearch() {
    setQuery("");
  }

  const trimmedQuery = query.trim();

  return (
    <>
      <section className={styles.hero} data-section="faq_hero">
        <div className={styles.washTop} aria-hidden="true" />
        <div className={styles.washBottom} aria-hidden="true" />
        <div className={styles.grain} aria-hidden="true" />
        <span className={styles.markQuestion} aria-hidden="true">
          ?
        </span>

        <Navbar />

        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>{t.heroEyebrow}</p>
          <h1 className={styles.headline}>{t.headline}</h1>
          <p className={styles.subhead}>{t.subhead}</p>

          <div className={styles.searchStage}>
            <div
              className={`${styles.note} ${styles.noteOne}`}
              aria-hidden="true"
            >
              {t.note1}
            </div>
            <div
              className={`${styles.note} ${styles.noteTwo}`}
              aria-hidden="true"
            >
              {t.note2}
            </div>

          <div className={styles.searchBar}>
            <svg
              className={styles.searchIcon}
              width="17"
              height="17"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.6" />
              <path d="M18 18l-4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <label htmlFor="faq-search" className={styles.visuallyHidden}>
              {t.searchLabel}
            </label>
            <input
              id="faq-search"
              type="search"
              className={styles.searchInput}
              placeholder={t.searchPlaceholder}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoComplete="off"
            />
            {trimmedQuery && (
              <button
                type="button"
                className={styles.clearButton}
                onClick={clearSearch}
                aria-label={t.clearAria}
              >
                <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path
                    d="M1.5 1.5l11 11M12.5 1.5l-11 11"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
          </div>
          </div>

          <div className={styles.chipRow} role="group" aria-label="Filtrer par catégorie">
            <button
              type="button"
              className={styles.chip}
              data-active={activeCategory === "all"}
              onClick={() => setActiveCategory("all")}
              aria-pressed={activeCategory === "all"}
            >
              {t.allCategories}
              <span className={styles.chipCount}>{t.items.length}</span>
            </button>
            {t.categories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={styles.chip}
                data-active={activeCategory === category.id}
                onClick={() => setActiveCategory(category.id)}
                aria-pressed={activeCategory === category.id}
              >
                {category.label}
                <span className={styles.chipCount}>
                  {categoryCounts.get(category.id) ?? 0}
                </span>
              </button>
            ))}
          </div>

          <p className={styles.resultsCount} aria-live="polite">
            {t.resultsCount(filteredItems.length)}
          </p>
        </div>
      </section>

      <section className={styles.results} data-section="faq_results">
        <div className={styles.resultsInner}>
          {groups.length === 0 ? (
            <div className={styles.empty}>
              <p className={styles.emptyText}>
                {trimmedQuery ? t.emptyWithQuery(trimmedQuery) : t.emptyNoQuery}
              </p>
              <a href="mailto:support@linqfolio.com" className={styles.emptyLink}>
                {t.contactSupport}
              </a>
            </div>
          ) : (
            groups.map((group) => (
              <div key={group.category.id} className={styles.group} id={group.category.id}>
                <div className={styles.groupHead}>
                  <span className={styles.groupTab}>{group.category.label}</span>
                  <span className={styles.groupLine} aria-hidden="true" />
                  <span className={styles.groupCount}>
                    {group.items.length} {t.questionWord(group.items.length)}
                  </span>
                </div>

                <ul className={styles.list}>
                  {group.items.map((item) => {
                    const isOpen = openIds.has(item.id);
                    return (
                      <li className={styles.item} key={item.id} id={item.id}>
                        <h3 className={styles.itemHeading}>
                          <button
                            type="button"
                            className={styles.question}
                            aria-expanded={isOpen}
                            aria-controls={`${item.id}-answer`}
                            onClick={() => toggleItem(item.id)}
                          >
                            {item.question}
                            <span className={styles.icon} aria-hidden="true" />
                          </button>
                        </h3>
                        <div
                          className={styles.answerWrap}
                          id={`${item.id}-answer`}
                          data-open={isOpen}
                        >
                          <p className={styles.answer}>{item.answer}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>
      </section>

      <section className={styles.contact} data-section="faq_contact">
        <div className={styles.contactInner}>
          <p className={styles.contactEyebrow}>{t.contactEyebrow}</p>
          <h2 className={styles.contactHeadline}>
            {t.contactHeadline}
          </h2>
          <p className={styles.contactSubhead}>{t.contactSubhead}</p>

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
