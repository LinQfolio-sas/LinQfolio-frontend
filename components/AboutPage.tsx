"use client";

import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import styles from "./AboutPage.module.css";

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
const getReducedMotionSnapshot = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const getReducedMotionServerSnapshot = () => false;

const VALUE_ICONS = [
  <svg key="bienveillance" width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M10 17S2.5 12.6 2.5 7.4A3.9 3.9 0 0 1 10 5.3a3.9 3.9 0 0 1 7.5 2.1C17.5 12.6 10 17 10 17Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  </svg>,
  <svg key="transparence" width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M2 10s2.8-5.5 8-5.5 8 5.5 8 5.5-2.8 5.5-8 5.5-8-5.5-8-5.5Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    <circle cx="10" cy="10" r="2.25" stroke="currentColor" strokeWidth="1.4" />
  </svg>,
  <svg key="lecteurs" width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="6.5" r="3.5" stroke="currentColor" strokeWidth="1.4" />
    <path
      d="M3 17c.7-3.7 3.3-5.7 7-5.7s6.3 2 7 5.7"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>,
];

const VALUES_FR = [
  {
    id: "bienveillance",
    title: "Bienveillance",
    desc: "Une communauté modérée, des outils de signalement clairs et une tolérance zéro pour les comportements toxiques. La lecture mérite un espace serein.",
  },
  {
    id: "transparence",
    title: "Transparence",
    desc: "Une FAQ honnête, une politique de confidentialité qu’on peut vraiment lire, et des choix de produit qu’on assume. Aucune promesse qu’on ne pourrait pas tenir.",
  },
  {
    id: "lecteurs",
    title: "Les lecteurs avant tout",
    desc: "Pas d’algorithme opaque, pas de gamification artificielle. Vos lectures, vos avis et votre rythme guident l’app, jamais l’inverse.",
  },
].map((v, i) => ({ ...v, icon: VALUE_ICONS[i] }));

const VALUES_EN = [
  {
    id: "bienveillance",
    title: "Kindness",
    desc: "A moderated community, clear reporting tools, and zero tolerance for toxic behavior. Reading deserves a calm space.",
  },
  {
    id: "transparence",
    title: "Transparency",
    desc: "An honest FAQ, a privacy policy you can actually read, and product choices we stand behind. No promise we couldn’t keep.",
  },
  {
    id: "lecteurs",
    title: "Readers first",
    desc: "No opaque algorithm, no artificial gamification. Your reading, your reviews, and your pace guide the app, never the other way around.",
  },
].map((v, i) => ({ ...v, icon: VALUE_ICONS[i] }));

const COLOPHON_ROWS_FR = [
  { label: "Conçu par", value: "une équipe produit & tech, basée en France" },
  { label: "Composé en", value: "Newsreader & IBM Plex Sans" },
  { label: "Hébergé en", value: "Europe, conformément au RGPD" },
  { label: "Édition", value: "2026, en amélioration continue" },
];

const COLOPHON_ROWS_EN = [
  { label: "Designed by", value: "a product & tech team, based in France" },
  { label: "Set in", value: "Newsreader & IBM Plex Sans" },
  { label: "Hosted in", value: "Europe, in compliance with GDPR" },
  { label: "Edition", value: "2026, continuously improved" },
];

const EXPLORER_BOOKS_FR = [
  { title: "Les Heures suspendues", author: "N. Aubry", tone: "violet" as const, tag: "Coup de cœur" },
  { title: "Sapiens", author: "Y. N. Harari", tone: "plum" as const, tag: undefined },
  { title: "Circé", author: "M. Miller", tone: "glow" as const, tag: undefined },
  { title: "Le Bruit du dégel", author: "R. Lachance", tone: "ink" as const, tag: undefined },
];

const EXPLORER_BOOKS_EN = [
  { title: "The Suspended Hours", author: "N. Aubry", tone: "violet" as const, tag: "Staff pick" },
  { title: "Sapiens", author: "Y. N. Harari", tone: "plum" as const, tag: undefined },
  { title: "Circe", author: "M. Miller", tone: "glow" as const, tag: undefined },
  { title: "The Sound of Thaw", author: "R. Lachance", tone: "ink" as const, tag: undefined },
];

const COPY = {
  fr: {
    heroEyebrow: "À propos de LinQfolio",
    heroHeadline: (
      <>
        Aucun livre ne se referme
        <br />
        tout à fait seul.
      </>
    ),
    heroSubhead: (
      <>
        Une petite équipe française qui pense que la lecture se
        vit mieux à plusieurs, et qui construit, un chapitre
        à la fois, l&rsquo;endroit pour ça.
      </>
    ),
    heroNote: "toujours une vraie personne derrière l’écran 💌",
    missionEyebrow: "Notre mission",
    missionDropcap: "O",
    missionText: (
      <>
        n découvre rarement un livre seul. On en parle, on le
        prête, on le recommande à qui saura l’aimer.
        LinQfolio rassemble ces gestes qu’on connaît déjà
        (profils, échanges, discussions) au même
        endroit, pour rendre la lecture{" "}
        <em className={styles.emph}>plus sociale, plus durable et plus vivante</em>.
      </>
    ),
    missionCaption: "dessiné (et lu) par l’équipe",
    valuesEyebrow: "Ce qui nous guide",
    valuesHeadline: "Trois idées, non négociables.",
    values: VALUES_FR,
    teamEyebrow: "L’équipe",
    teamHeadline: "Une petite équipe, un objectif simple.",
    teamBody: (
      <>
        Nous sommes une poignée de personnes (produit, design,
        tech) basées en France, réunies autour d’une
        idée simple : construire un lieu de lecture en ligne qui
        respecte votre temps, vos données et vos livres.
      </>
    ),
    colophon: COLOPHON_ROWS_FR,
    ctaEyebrow: "Club de lecteurs",
    ctaHeadline: "Prêt·e à tourner la page ?",
    ctaSubhead: (
      <>
        Téléchargez LinQfolio sur iOS et Android, ou explorez
        d’abord ce que l’app permet de faire.
      </>
    ),
    ctaDownload: "Télécharger l’app",
    ctaFeatures: "Voir les fonctionnalités",
    explorerTitle: "Explorer",
    explorerLabel: "Tendances cette semaine",
    explorerBooks: EXPLORER_BOOKS_FR,
  },
  en: {
    heroEyebrow: "About LinQfolio",
    heroHeadline: (
      <>
        No book closes
        <br />
        entirely alone.
      </>
    ),
    heroSubhead: (
      <>
        A small French team who believes reading is better
        shared, and who&rsquo;s building, one chapter at a
        time, the place for that.
      </>
    ),
    heroNote: "always a real person behind the screen 💌",
    missionEyebrow: "Our mission",
    missionDropcap: "W",
    missionText: (
      <>
        e rarely discover a book alone. We talk about it, lend
        it, recommend it to someone who&rsquo;ll love it.
        LinQfolio brings these familiar gestures (profiles,
        swaps, discussions) together in one place, to make
        reading{" "}
        <em className={styles.emph}>more social, more sustainable, and more alive</em>.
      </>
    ),
    missionCaption: "drawn (and read) by the team",
    valuesEyebrow: "What guides us",
    valuesHeadline: "Three ideas, non-negotiable.",
    values: VALUES_EN,
    teamEyebrow: "The team",
    teamHeadline: "A small team, one simple goal.",
    teamBody: (
      <>
        We&rsquo;re a handful of people (product, design,
        tech) based in France, united around one simple
        idea: building an online reading space that respects
        your time, your data, and your books.
      </>
    ),
    colophon: COLOPHON_ROWS_EN,
    ctaEyebrow: "Readers club",
    ctaHeadline: "Ready to turn the page?",
    ctaSubhead: (
      <>
        Download LinQfolio on iOS and Android, or explore what
        the app can do first.
      </>
    ),
    ctaDownload: "Download the app",
    ctaFeatures: "See the features",
    explorerTitle: "Explore",
    explorerLabel: "Trending this week",
    explorerBooks: EXPLORER_BOOKS_EN,
  },
} as const;

export default function AboutPage() {
  const { lang } = useLanguage();
  const t = COPY[lang];
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  const rise = prefersReducedMotion
    ? { initial: { opacity: 0 }, whileInView: { opacity: 1 } }
    : { initial: { opacity: 0, y: 18 }, whileInView: { opacity: 1, y: 0 } };

  const pin = prefersReducedMotion
    ? { initial: { opacity: 0 }, whileInView: { opacity: 1 } }
    : { initial: { opacity: 0, rotate: -9, scale: 0.94 }, whileInView: { opacity: 1, rotate: -4, scale: 1 } };

  return (
    <>
      {/* ---------- hero ---------- */}
      <section className={styles.hero} data-section="about_hero">
        <div className={styles.washTop} aria-hidden="true" />
        <div className={styles.washBottom} aria-hidden="true" />
        <div className={styles.grain} aria-hidden="true" />
        <span className={styles.markHedera} aria-hidden="true">
          &#10087;
        </span>

        <Navbar />

        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>{t.heroEyebrow}</p>
          <h1 className={styles.headline}>{t.heroHeadline}</h1>
          <p className={styles.subhead}>{t.heroSubhead}</p>
          <div className={styles.heroNote} aria-hidden="true">
            {t.heroNote}
          </div>
        </div>
      </section>

      {/* ---------- mission ---------- */}
      <section className={styles.mission} data-section="about_mission">
        <div className={styles.missionInner}>
          <motion.div
            className={styles.missionText}
            initial={rise.initial}
            whileInView={rise.whileInView}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className={styles.eyebrow}>{t.missionEyebrow}</p>
            <p className={styles.dropcapGraf}>
              <span className={styles.dropcap} aria-hidden="true">
                {t.missionDropcap}
              </span>
              {t.missionText}
            </p>
          </motion.div>

          <motion.figure
            className={styles.missionPhoto}
            initial={pin.initial}
            whileInView={pin.whileInView}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className={styles.pinDot} aria-hidden="true" />
            <img
              src="/illustrations/dessin_femme_linqfolio.webp"
              alt=""
              aria-hidden="true"
              width={1254}
              height={1254}
            />
            <figcaption className={styles.missionCaption}>
              {t.missionCaption}
            </figcaption>
          </motion.figure>
        </div>
      </section>

      {/* ---------- values ---------- */}
      <section className={styles.values} data-section="about_values">
        <div className={styles.valuesInner}>
          <p className={styles.eyebrow}>{t.valuesEyebrow}</p>
          <h2 className={styles.valuesHeadline}>{t.valuesHeadline}</h2>

          <div className={styles.rail} aria-hidden="true" />

          <ul className={styles.valueList}>
            {t.values.map((value, index) => (
              <motion.li
                className={styles.valueCard}
                key={value.id}
                initial={rise.initial}
                whileInView={rise.whileInView}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.55, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className={styles.valueRibbon} aria-hidden="true" />
                <span className={styles.valueIcon}>{value.icon}</span>
                <h3 className={styles.valueTitle}>{value.title}</h3>
                <p className={styles.valueDesc}>{value.desc}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- team / colophon ---------- */}
      <section className={styles.team} data-section="about_team">
        <div className={styles.teamInner}>
          <p className={styles.eyebrow}>{t.teamEyebrow}</p>
          <h2 className={styles.teamHeadline}>{t.teamHeadline}</h2>
          <p className={styles.teamBody}>{t.teamBody}</p>

          <motion.div
            className={styles.colophon}
            initial={rise.initial}
            whileInView={rise.whileInView}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className={styles.colophonMark} aria-hidden="true">&#10087;</span>
            <dl className={styles.colophonList}>
              {t.colophon.map((row) => (
                <div className={styles.colophonRow} key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
            <span className={styles.colophonMark} aria-hidden="true">&#10087;</span>
          </motion.div>
        </div>
      </section>

      {/* ---------- cta ---------- */}
      <section className={styles.cta} data-section="about_cta">
        <div className={styles.washCta} aria-hidden="true" />
        <div className={styles.ctaInner}>
          <div className={styles.ctaText}>
            <p className={styles.eyebrow}>{t.ctaEyebrow}</p>
            <h2 className={styles.ctaHeadline}>{t.ctaHeadline}</h2>
            <p className={styles.ctaSubhead}>{t.ctaSubhead}</p>
            <div className={styles.ctaActions}>
              <a href="/" className={styles.btnPrimary}>
                {t.ctaDownload}
              </a>
              <a href="/" className={styles.btnSecondary}>
                {t.ctaFeatures}
              </a>
            </div>
          </div>

          <div className={styles.phoneStage}>
            <div className={styles.phoneFrame}>
              <div className={styles.phoneNotch} aria-hidden="true" />
              <div className={styles.phoneScreen}>
                <div className={styles.explorerHeader}>
                  <span className={styles.explorerTitle}>{t.explorerTitle}</span>
                  <span className={styles.explorerSearch} aria-hidden="true">
                    <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
                      <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.6" />
                      <path d="M18 18l-4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </span>
                </div>
                <p className={styles.explorerLabel}>{t.explorerLabel}</p>
                <div className={styles.explorerGrid}>
                  {t.explorerBooks.map((book) => (
                    <div className={styles.explorerCard} key={book.title}>
                      <div className={`${styles.explorerCover} ${styles[`cover${book.tone}`]}`}>
                        {book.tag && <span className={styles.explorerTag}>{book.tag}</span>}
                      </div>
                      <span className={styles.explorerBookTitle}>{book.title}</span>
                      <span className={styles.explorerBookAuthor}>{book.author}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.phoneHome} aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
