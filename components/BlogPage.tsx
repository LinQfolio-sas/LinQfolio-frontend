"use client";

import { useMemo, useState, type CSSProperties } from "react";
import Navbar from "./Navbar";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { postHref } from "@/lib/seo";
import { RUBRICS, getRubric } from "@/lib/blog/rubrics";
import { pick, type PostGroup, type PostMeta, type RubricId } from "@/lib/blog/types";
import styles from "./BlogPage.module.css";

type Filter = "all" | RubricId;

const COPY = {
  fr: {
    eyebrow: "Le journal",
    kicker: "un ou deux textes par mois",
    headline: "Ce qu’on lit entre les lignes.",
    lead: "Notes de lecture, coulisses de l’app et conversations de lecteurs, écrits par l’équipe.",
    shelfEyebrow: "L’étagère",
    filterAria: "Filtrer par rubrique",
    all: "Tout",
    read: "Lire le texte",
    minutes: (n: number) => `${n} min`,
    minutesAria: (n: number) => `${n} minutes de lecture`,
    emptyTitle: "Rien dans cette rubrique pour l’instant.",
    emptyBody: "Le journal paraît une à deux fois par mois.",
    showAll: "Voir tous les textes",
  },
  en: {
    eyebrow: "The journal",
    kicker: "one or two pieces a month",
    headline: "What we read between the lines.",
    lead: "Reading notes, what happens behind the app, and conversations between readers, written by the team.",
    shelfEyebrow: "The shelf",
    filterAria: "Filter by section",
    all: "All",
    read: "Read the piece",
    minutes: (n: number) => `${n} min`,
    minutesAria: (n: number) => `${n} minute read`,
    emptyTitle: "Nothing in this section yet.",
    emptyBody: "The journal comes out once or twice a month.",
    showAll: "Show every piece",
  },
} as const;

function formatDate(iso: string, lang: "fr" | "en"): string {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function coverStyle(rubric: RubricId): CSSProperties {
  return { "--cover": getRubric(rubric).cover } as CSSProperties;
}

/**
 * An article, bound as a book: the site's own object, from Cta's .book --
 * 2:3, spine on the left, page edges on the right.
 */
function Book({
  post,
  lang,
  featured = false,
}: {
  post: PostMeta;
  lang: "fr" | "en";
  featured?: boolean;
}) {
  const rubric = getRubric(post.rubric);
  return (
    <div
      className={featured ? styles.bookLarge : styles.book}
      style={coverStyle(post.rubric)}
    >
      <span className={styles.pagesEdge} aria-hidden="true" />
      <div className={styles.bookCover} data-tone={rubric.tone}>
        <span className={styles.spineShade} aria-hidden="true" />
        <p className={styles.bookRubric}>{rubric[lang]}</p>
        <p className={styles.bookTitle}>{post.title}</p>
        <span className={styles.bookRule} aria-hidden="true" />
        <p className={styles.bookAuthor}>{post.author}</p>
      </div>
    </div>
  );
}

function Folio({ children }: { children: React.ReactNode }) {
  return (
    <p className={styles.folio}>
      <span className={styles.folioRule} aria-hidden="true" />
      {children}
    </p>
  );
}

export default function BlogPage({ groups }: { groups: PostGroup[] }) {
  const { lang } = useLanguage();
  const t = COPY[lang];
  const [filter, setFilter] = useState<Filter>("all");

  const posts = useMemo(
    () =>
      groups
        .map((group) => pick(group, lang))
        .filter((post): post is PostMeta => Boolean(post)),
    [groups, lang],
  );

  const featured = useMemo(
    () => posts.find((post) => post.featured) ?? posts[0],
    [posts],
  );
  const counts = useMemo(() => {
    const map = new Map<RubricId, number>();
    for (const post of posts) map.set(post.rubric, (map.get(post.rubric) ?? 0) + 1);
    return map;
  }, [posts]);

  const shown = useMemo(
    () => (filter === "all" ? posts : posts.filter((p) => p.rubric === filter)),
    [posts, filter],
  );

  return (
    <div className={styles.page}>
      <section className={styles.hero} data-section="blog_hero">
        <div className={styles.washTop} aria-hidden="true" />
        <div className={styles.washBottom} aria-hidden="true" />
        <div className={styles.grain} aria-hidden="true" />
        <span className={styles.markQuote} aria-hidden="true">
          &laquo;
        </span>

        <Navbar />

        <div className={styles.mastheadInner}>
          <p className={styles.eyebrow}>{t.eyebrow}</p>
          <span className={styles.kicker}>{t.kicker}</span>
          <h1 className={styles.headline}>{t.headline}</h1>
          <p className={styles.lead}>{t.lead}</p>
        </div>
        {featured && (
          <div className={styles.featureInner}>
            <div className={styles.stage}>
              <span className={styles.ribbon} aria-hidden="true" />
              <a
                href={postHref(featured.slug, lang)}
                className={styles.stageLink}
                tabIndex={-1}
                aria-hidden="true"
              >
                <Book post={featured} lang={lang} featured />
              </a>

              {featured.note && (
                <span className={styles.note} aria-hidden="true">
                  {featured.note}
                </span>
              )}
            </div>

            <div className={styles.featureText}>
              <p className={styles.eyebrow}>{getRubric(featured.rubric)[lang]}</p>
              <h2 className={styles.featureTitle}>
                <a href={postHref(featured.slug, lang)} className={styles.titleLink}>
                  {featured.title}
                </a>
              </h2>
              <p className={styles.lead}>{featured.excerpt}</p>

              <Folio>
                {featured.author}
                <span className={styles.dot} aria-hidden="true" />
                {formatDate(featured.date, lang)}
                <span className={styles.dot} aria-hidden="true" />
                <span aria-label={t.minutesAria(featured.readingMinutes)}>
                  {t.minutes(featured.readingMinutes)}
                </span>
              </Folio>

              <a href={postHref(featured.slug, lang)} className={styles.btnPrimary}>
                {t.read}
              </a>
            </div>
          </div>
        )}
      </section>

      <section className={styles.shelf} data-section="blog_shelf">
        <div className={styles.shelfInner}>
          <p className={styles.eyebrowCentered}>{t.shelfEyebrow}</p>

          <div className={styles.filters} role="group" aria-label={t.filterAria}>
            <button
              type="button"
              className={filter === "all" ? styles.chipOn : styles.chip}
              onClick={() => setFilter("all")}
              aria-pressed={filter === "all"}
            >
              {t.all}
            </button>
            {RUBRICS.filter((rubric) => counts.has(rubric.id)).map((rubric) => (
              <button
                key={rubric.id}
                type="button"
                className={filter === rubric.id ? styles.chipOn : styles.chip}
                onClick={() => setFilter(rubric.id)}
                aria-pressed={filter === rubric.id}
              >
                {rubric[lang]}
              </button>
            ))}
          </div>

          {shown.length === 0 ? (
            <div className={styles.empty}>
              <p className={styles.emptyTitle}>{t.emptyTitle}</p>
              <p className={styles.emptyBody}>{t.emptyBody}</p>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => setFilter("all")}
              >
                {t.showAll}
              </button>
            </div>
          ) : (
            <ul className={styles.row}>
              {shown.map((post) => (
                <li key={post.slug} className={styles.slot}>
                  <a href={postHref(post.slug, lang)} className={styles.slotLink}>
                    <Book post={post} lang={lang} />
                    <span className={styles.slotFolio}>
                      <span className={styles.folioRule} aria-hidden="true" />
                      {formatDate(post.date, lang)}
                      <span className={styles.dot} aria-hidden="true" />
                      <span aria-label={t.minutesAria(post.readingMinutes)}>
                        {t.minutes(post.readingMinutes)}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
