"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Navbar from "./Navbar";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { getRubric } from "@/lib/blog/rubrics";
import { pick, type Post, type PostGroup, type PostMeta } from "@/lib/blog/types";
import styles from "./BlogPostPage.module.css";

const COPY = {
  fr: {
    back: "Le journal",
    minutes: (n: number) => `${n} min de lecture`,
    onlyInFrench: "Ce texte n’existe pour l’instant qu’en français.",
    onlyInEnglish: "Ce texte n’existe pour l’instant qu’en anglais.",
    alsoRead: "Lire aussi",
    progressAria: "Progression dans le texte",
  },
  en: {
    back: "The journal",
    minutes: (n: number) => `${n} min read`,
    onlyInFrench: "This piece is only available in French for now.",
    onlyInEnglish: "This piece is only available in English for now.",
    alsoRead: "Read next",
    progressAria: "Progress through the piece",
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

/** Chapter progress, in the app's own idiom: a lilac track, a violet fill. */
function useReadingProgress(target: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    function measure() {
      frame = 0;
      const node = target.current;
      if (!node) return;
      const span = node.offsetHeight - window.innerHeight * 0.6;
      if (span <= 0) return setProgress(1);
      const scrolled = (window.scrollY - node.offsetTop) / span;
      setProgress(Math.min(1, Math.max(0, scrolled)));
    }

    function onScroll() {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    }

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [target]);

  return progress;
}

function Book({ post, lang }: { post: PostMeta; lang: "fr" | "en" }) {
  const rubric = getRubric(post.rubric);
  return (
    <div
      className={styles.book}
      style={{ "--cover": rubric.cover } as CSSProperties}
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

export default function BlogPostPage({
  group,
  related,
}: {
  group: PostGroup<Post>;
  related: PostGroup[];
}) {
  const { lang } = useLanguage();
  const t = COPY[lang];
  const articleRef = useRef<HTMLElement>(null);
  const progress = useReadingProgress(articleRef);

  const post = pick(group, lang);
  if (!post) return null;

  const rubric = getRubric(post.rubric);
  const mismatch =
    post.lang !== lang
      ? post.lang === "fr"
        ? t.onlyInFrench
        : t.onlyInEnglish
      : null;

  return (
    <div className={styles.page}>
      <div
        className={styles.progressTrack}
        role="progressbar"
        aria-label={t.progressAria}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      >
        <div
          className={styles.progressFill}
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      <Navbar />

      <article
        className={styles.article}
        ref={articleRef}
        data-section="post_body"
      >
        <header className={styles.head}>
          <div className={styles.washTop} aria-hidden="true" />
          <div className={styles.washBottom} aria-hidden="true" />
          <div className={styles.grain} aria-hidden="true" />

          <div className={styles.headText}>
            <a href="/blog" className={styles.back}>
              <span className={styles.backArrow} aria-hidden="true">
                &larr;
              </span>
              {t.back}
            </a>

            <p className={styles.eyebrow}>{rubric[lang]}</p>
            <h1 className={styles.title}>{post.title}</h1>
            {post.excerpt && <p className={styles.lead}>{post.excerpt}</p>}

            <p className={styles.folio}>
              <span className={styles.folioRule} aria-hidden="true" />
              {post.author}
              {post.authorRole && (
                <>
                  <span className={styles.dot} aria-hidden="true" />
                  {post.authorRole}
                </>
              )}
              <span className={styles.dot} aria-hidden="true" />
              {formatDate(post.date, lang)}
              <span className={styles.dot} aria-hidden="true" />
              {t.minutes(post.readingMinutes)}
            </p>

            {mismatch && <p className={styles.langNotice}>{mismatch}</p>}
          </div>

          <div className={styles.headBook}>
            <Book post={post} lang={lang} />
          </div>
        </header>

        <div
          className={styles.body}
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        <p className={styles.endMark} aria-hidden="true">
          &#10087;
        </p>
      </article>

      {related.length > 0 && (
        <section className={styles.next} data-section="post_next">
          <div className={styles.nextInner}>
            <p className={styles.eyebrowCentered}>{t.alsoRead}</p>
            <ul className={styles.nextList}>
              {related.map((other) => {
                const item = pick(other, lang);
                if (!item) return null;
                return (
                  <li key={other.slug} className={styles.nextItem}>
                    <a href={`/blog/${other.slug}`} className={styles.nextLink}>
                      <div className={styles.nextBook}>
                        <Book post={item} lang={lang} />
                      </div>
                      <div className={styles.nextText}>
                        <p className={styles.nextExcerpt}>{item.excerpt}</p>
                        <span className={styles.folio}>
                          <span className={styles.folioRule} aria-hidden="true" />
                          {formatDate(item.date, lang)}
                          <span className={styles.dot} aria-hidden="true" />
                          {t.minutes(item.readingMinutes)}
                        </span>
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
