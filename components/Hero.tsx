"use client";

import type { CSSProperties } from "react";
import Phone from "./Phone";
import Navbar from "./Navbar";
import { useLanguage, useT } from "@/lib/i18n/LanguageContext";
import { trackStoreClick } from "@/lib/analytics/events";
import { STORE_LINKS } from "@/lib/links";
import styles from "./Hero.module.css";

function delay(value: string): CSSProperties {
  return { "--delay": value } as CSSProperties;
}

/* Le filigrane de l'accueil.

   Chaque page intérieure porte une seule marque tenue en fond : ❧ pour
   « À propos », « pour le journal, ? pour la FAQ, § pour les pages légales.
   L'accueil est l'endroit où elles se croisent, alors la marque unique y
   devient un champ : les mêmes signes, dispersés comme les annotations d'un
   livre passé de main en main. Chacun désigne un geste de l'app — citer (« »),
   annoter (¶ ‡), échanger (⇄), demander (?), lire ensemble (&). */
/* La seconde famille du filigrane : des symboles pleins, parce qu'aucun signe
   de ponctuation ne sait dire « discussion » ou « avis ».

   Le cœur, la bulle, le marque-page et les cercles reprennent les silhouettes
   des icônes de la barre d'actions et de la barre d'onglets du téléphone, plus
   bas dans la page — remplies ici plutôt que tracées. Le fond est donc
   l'iconographie de l'app agrandie, pas une collection d'icônes trouvées
   ailleurs. Tout est dessiné sur la même grille de 20, en contours fermés.

   L'échange n'a pas de symbole dessiné : le ⇄ typographique le dit déjà. */
const SYMBOLS = {
  // lire : deux pages ouvertes, séparées par le pli
  book: [
    "M9.2 6.4C7.6 5.1 5.6 4.4 3.3 4.3 2.7 4.3 2.3 4.7 2.3 5.3v9.1c0 .5.4.9.9.9 2.2.1 4.2.7 6 1.9Z",
    "M10.8 6.4c1.6-1.3 3.6-2 5.9-2.1.6 0 1 .4 1 1v9.1c0 .5-.4.9-.9.9-2.2.1-4.2.7-6 1.9Z",
  ],
  // discuter — la bulle de la barre d'actions
  bubble: [
    "M2.5 9.3c0-3.6 3.4-6.3 7.5-6.3s7.5 2.7 7.5 6.3-3.4 6.3-7.5 6.3c-.8 0-1.6-.1-2.3-.3L4 17l1-3.2c-1.6-1.1-2.5-2.7-2.5-4.5Z",
  ],
  // aimer — le cœur de la barre d'actions
  heart: [
    "M10 17S2.5 12.6 2.5 7.4A3.9 3.9 0 0 1 10 5.3a3.9 3.9 0 0 1 7.5 2.1C17.5 12.6 10 17 10 17Z",
  ],
  // garder le passage — le marque-page de la barre d'actions
  bookmark: [
    "M5 2.75h10a.5.5 0 0 1 .5.5V17l-5.5-3.4L4.5 17V3.25a.5.5 0 0 1 .5-.5Z",
  ],
  // le cercle de lecture — l'onglet « Cercles »
  circles: [
    "M9.9 7.4a2.9 2.9 0 1 1-5.8 0 2.9 2.9 0 0 1 5.8 0Z",
    "M16.6 8.6a2.4 2.4 0 1 1-4.8 0 2.4 2.4 0 0 1 4.8 0Z",
    "M7 11.3c-3.2 0-5.2 1.9-5.6 4.9-.1.6.4 1.1 1 1.1h9.2c.6 0 1.1-.5 1-1.1-.4-3-2.4-4.9-5.6-4.9Z",
    "M14.2 12.1c-1 0-1.9.2-2.6.6 1 1 1.7 2.3 1.9 3.9h4.7c.6 0 1-.5.9-1.1-.4-2.4-2-3.4-4.9-3.4Z",
  ],
  // l'avis
  star: ["M10 3.2l2.1 4.3 4.7.7-3.4 3.3.8 4.7L10 14l-4.2 2.2.8-4.7L3.2 8.2l4.7-.7Z"],
} as const;

type SymbolName = keyof typeof SYMBOLS;

type MarkArt = { glyph: string; symbol?: never } | { symbol: SymbolName; glyph?: never };

type Mark = MarkArt & {
  /** Position sur le hero, en pourcentage, centre du signe. */
  x: number;
  y: number;
  size: string;
  rot: number;
  op: number;
  /** Repli sous 64rem. Absent : la marque disparaît sur petit écran. */
  sm?: { x: number; y: number; size: string };
};

/* Les tailles sont visuelles, pas typographiques : un guillemet occupe le
   tiers de son cadratin là où un fleuron le remplit, d'où l'écart. */
const MARKS: Mark[] = [
  // fleuron : la fin d'un passage
  { glyph: "\u2767", x: 24, y: 28, size: "15rem", rot: -12, op: 0.085 },
  // guillemet ouvrant : le passage qu'on cite à quelqu'un
  { glyph: "\u00ab", x: 84, y: 71, size: "24rem", rot: 7, op: 0.08,
    sm: { x: 89, y: 13, size: "11rem" } },
  // pied-de-mouche : le paragraphe, unité de ce qu'on partage
  { glyph: "\u00b6", x: 95, y: 11, size: "7rem", rot: 9, op: 0.09 },
  // double flèche : l'échange de livres
  { glyph: "\u21c4", x: 21, y: 57, size: "8.5rem", rot: -7, op: 0.085,
    sm: { x: 11, y: 46, size: "4.5rem" } },
  { glyph: "?", x: 91, y: 36, size: "5.5rem", rot: 11, op: 0.085 },
  // esperluette : lire à plusieurs
  { glyph: "&", x: 8, y: 79, size: "9.5rem", rot: -9, op: 0.08,
    sm: { x: 87, y: 88, size: "6rem" } },
  { glyph: "\u00bb", x: 33, y: 89, size: "6.5rem", rot: 6, op: 0.08 },
  { glyph: "\u00b6", x: 16, y: 39, size: "3.25rem", rot: 13, op: 0.08,
    sm: { x: 10, y: 21, size: "3rem" } },
  { glyph: "\u2767", x: 71, y: 92, size: "4.5rem", rot: 15, op: 0.075 },

  /* Un aplat pèse plus qu'un signe typographique de même taille : les symboles
     restent donc sous la barre des glyphes, pas au-dessus. */
  { symbol: "book", x: 29, y: 33, size: "5rem", rot: -8, op: 0.075,
    sm: { x: 16, y: 96, size: "2.75rem" } },
  { symbol: "bubble", x: 71, y: 31, size: "4rem", rot: 7, op: 0.08 },
  { symbol: "star", x: 25, y: 50, size: "3.25rem", rot: 12, op: 0.085 },
  { symbol: "circles", x: 73, y: 47, size: "5.5rem", rot: -6, op: 0.07,
    sm: { x: 82, y: 96, size: "3rem" } },
  { symbol: "heart", x: 67, y: 64, size: "3.25rem", rot: -10, op: 0.085 },
  { symbol: "bookmark", x: 3, y: 55, size: "3.5rem", rot: 8, op: 0.08 },
  { symbol: "book", x: 97, y: 60, size: "3.25rem", rot: -12, op: 0.08 },
  { symbol: "bubble", x: 24, y: 63, size: "3rem", rot: -9, op: 0.085 },
  { symbol: "star", x: 60, y: 92, size: "2.75rem", rot: -14, op: 0.085 },
  { symbol: "circles", x: 44, y: 97, size: "3.75rem", rot: 5, op: 0.07 },
];

function markStyle(mark: Mark, index: number): CSSProperties {
  return {
    "--x": `${mark.x}%`,
    "--y": `${mark.y}%`,
    "--size": mark.size,
    "--rot": `${mark.rot}deg`,
    "--op": mark.op,
    "--delay": `${(0.2 + index * 0.04).toFixed(2)}s`,
    ...(mark.sm && {
      "--x-sm": `${mark.sm.x}%`,
      "--y-sm": `${mark.sm.y}%`,
      "--size-sm": mark.sm.size,
    }),
  } as CSSProperties;
}

const COPY = {
  fr: {
    headlineLine1: "La lecture,",
    headlinePrefix: "enfin ",
    headlineHighlight: "partagée",
    subhead: (
      <>
        LinQfolio est le fil social où l&rsquo;on partage ce qu&rsquo;on
        lit, échange des livres et suit ses amis chapitre après chapitre,
        et referme rarement un livre seul&middot;e.
      </>
    ),
    appStore: "App Store",
    googlePlay: "Google Play",
    note1: <>j&rsquo;ai relu ce chapitre trois fois 😭</>,
    note2: <>+34 dans « Lectures d&rsquo;été »</>,
    phoneAlt: "Le fil d’actualité de LinQfolio : les lecteurs que vous suivez partagent leurs lectures et leur Reading DNA",
    cardReviewQuote: (
      <>
        « Je n&rsquo;ouvre plus un livre sans <em>LinQfolio</em>. »
      </>
    ),
    cardReviewMeta: "Inès, 24 ans",
    cardFeedHead: "Sacha a terminé un livre",
    cardFeedBody: (
      <>
        <em>L&rsquo;Été où tout a changé</em> · 🎉 5 étoiles
      </>
    ),
    cardSwapHead: "Léo propose un échange",
    cardSwapBody: (
      <>
        <em>Sapiens</em> contre <em>Circé</em>
      </>
    ),
    cardMessageHead: "Camille",
    cardMessageBody: <>Tu en es où du chapitre 9&nbsp;? 👀</>,
  },
  en: {
    headlineLine1: "Reading,",
    headlinePrefix: "finally ",
    headlineHighlight: "shared",
    subhead: (
      <>
        LinQfolio is the social feed where you share what you&rsquo;re
        reading, trade books, and follow your friends chapter after
        chapter, and rarely close a book alone.
      </>
    ),
    appStore: "App Store",
    googlePlay: "Google Play",
    note1: <>I reread this chapter three times 😭</>,
    note2: <>+34 in &ldquo;Summer Reads&rdquo;</>,
    phoneAlt: "The LinQfolio news feed: readers you follow share what they’re reading and their Reading DNA",
    cardReviewQuote: (
      <>
        &ldquo;I don&rsquo;t open a book without LinQfolio anymore.&rdquo;
      </>
    ),
    cardReviewMeta: "Inès, 24",
    cardFeedHead: "Sacha finished a book",
    cardFeedBody: (
      <>
        <em>The Summer Everything Changed</em> · 🎉 5 stars
      </>
    ),
    cardSwapHead: "Léo suggests a swap",
    cardSwapBody: (
      <>
        <em>Sapiens</em> for <em>Circe</em>
      </>
    ),
    cardMessageHead: "Camille",
    cardMessageBody: <>Where are you at in chapter 9&nbsp;? 👀</>,
  },
} as const;

export default function Hero() {
  const t = useT(COPY);
  const { lang } = useLanguage();
  return (
    <section className={styles.hero} data-section="hero">
      <div className={styles.washTop} aria-hidden="true" />
      <div className={styles.washMid} aria-hidden="true" />
      <div className={styles.washBottom} aria-hidden="true" />

      <div className={styles.marks} aria-hidden="true">
        {MARKS.map((mark, index) => {
          const className = [
            styles.mark,
            mark.symbol ? styles.markSymbol : styles.markGlyph,
            mark.sm ? "" : styles.markWide,
          ]
            .filter(Boolean)
            .join(" ");

          return mark.symbol ? (
            <svg
              key={index}
              className={className}
              style={markStyle(mark, index)}
              viewBox="0 0 20 20"
            >
              {SYMBOLS[mark.symbol].map((d) => (
                <path key={d} d={d} />
              ))}
            </svg>
          ) : (
            <span key={index} className={className} style={markStyle(mark, index)}>
              {mark.glyph}
            </span>
          );
        })}
      </div>

      <div className={styles.grain} aria-hidden="true" />

      <Navbar />

      <div className={styles.content}>
        <div className={styles.masthead}>
          <figure
            className={`${styles.perch} ${styles.perchArmchair} ${styles.reveal}`}
            style={delay("0.6s")}
          >
            <img
              src="/illustrations/reading-armchair.webp"
              alt=""
              aria-hidden="true"
              width={516}
              height={560}
            />
          </figure>
          <figure
            className={`${styles.perch} ${styles.perchPillow} ${styles.reveal}`}
            style={delay("0.7s")}
          >
            <img
              src="/illustrations/reading-pillow.webp"
              alt=""
              aria-hidden="true"
              width={560}
              height={363}
            />
          </figure>

          <h1 className={styles.headline}>
            <span
              className={`${styles.headlineLine} ${styles.reveal}`}
              style={delay("0.1s")}
            >
              {t.headlineLine1}
            </span>
            <span
              className={`${styles.headlineLine} ${styles.reveal}`}
              style={delay("0.22s")}
            >
              {t.headlinePrefix}
              <span className={styles.highlightWord}>
                {t.headlineHighlight}
                <span className={styles.highlightMark} aria-hidden="true" />
              </span>
              .
            </span>
          </h1>
        </div>

        <p className={`${styles.subhead} ${styles.reveal}`} style={delay("0.36s")}>
          {t.subhead}
        </p>

        <div
          className={`${styles.ctaRow} ${styles.reveal}`}
          style={delay("0.46s")}
          data-cta="hero"
        >
          <a
            href={STORE_LINKS.appStore}
            className={styles.btnPrimary}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackStoreClick("app_store", "hero", lang)}
          >
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
            {t.appStore}
          </a>
          <a
            href={STORE_LINKS.googlePlay}
            className={styles.btnSecondary}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackStoreClick("google_play", "hero", lang)}
          >
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
            {t.googlePlay}
          </a>
        </div>
      </div>

      <div className={styles.stage}>
        <div className={styles.stageInner}>
          <div className={styles.glow} aria-hidden="true" />

          <div
            className={`${styles.note} ${styles.noteOne} ${styles.reveal}`}
            style={delay("0.85s")}
          >
            {t.note1}
          </div>
          <div
            className={`${styles.note} ${styles.noteTwo} ${styles.reveal}`}
            style={delay("1s")}
          >
            {t.note2}
          </div>

          <Phone
            className={`${styles.heroPhone} ${styles.reveal}`}
            style={delay("0.55s")}
            data-phone-flight="from"
          >
            <img
              src="/SCREENS/hero.webp"
              alt={t.phoneAlt}
              width={1206}
              height={2622}
              fetchPriority="high"
            />
          </Phone>
        </div>
      </div>

      <div className={styles.orbit}>
        <figure
          className={`${styles.orbitFigure} ${styles.figSwap} ${styles.reveal}`}
          style={delay("1.25s")}
        >
          <img
            src="/illustrations/reading-swap.webp"
            alt=""
            aria-hidden="true"
            width={428}
            height={560}
          />
        </figure>
        <figure
          className={`${styles.orbitFigure} ${styles.figPhone} ${styles.reveal}`}
          style={delay("1.3s")}
        >
          <img
            src="/illustrations/reading-phone.webp"
            alt=""
            aria-hidden="true"
            width={560}
            height={349}
          />
        </figure>
        <figure
          className={`${styles.orbitFigure} ${styles.figCross} ${styles.reveal}`}
          style={delay("1.4s")}
        >
          <img
            src="/illustrations/reading-crosslegged.webp"
            alt=""
            aria-hidden="true"
            width={560}
            height={539}
          />
        </figure>

        <div
          className={`${styles.glassCard} ${styles.cardReview} ${styles.reveal}`}
          style={delay("1.1s")}
          aria-hidden="true"
        >
          <div className={styles.cardHead}>
            <span className={styles.cardStars}>★★★★★</span>
          </div>
          <p className={styles.cardBody}>{t.cardReviewQuote}</p>
          <p className={styles.cardMeta}>{t.cardReviewMeta}</p>
        </div>

        <div
          className={`${styles.glassCard} ${styles.cardFeed} ${styles.reveal}`}
          style={delay("1.2s")}
          aria-hidden="true"
        >
          <div className={styles.cardHead}>
            <span className={styles.cardAvatar}>S</span>
            {t.cardFeedHead}
          </div>
          <p className={styles.cardBody}>{t.cardFeedBody}</p>
        </div>

        <div
          className={`${styles.glassCard} ${styles.cardSwap} ${styles.reveal}`}
          style={delay("1.3s")}
          aria-hidden="true"
        >
          <div className={styles.cardHead}>
            <span className={styles.cardIcon} aria-hidden="true">
              ⇄
            </span>
            {t.cardSwapHead}
          </div>
          <p className={styles.cardBody}>{t.cardSwapBody}</p>
        </div>

        <div
          className={`${styles.glassCard} ${styles.cardMessage} ${styles.reveal}`}
          style={delay("1.4s")}
          aria-hidden="true"
        >
          <div className={styles.cardHead}>
            <span className={styles.cardAvatar}>C</span>
            {t.cardMessageHead}
          </div>
          <p className={styles.cardBody}>{t.cardMessageBody}</p>
        </div>
      </div>
    </section>
  );
}
