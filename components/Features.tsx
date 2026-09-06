"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import Phone from "./Phone";
import FeaturesBackground from "./FeaturesBackground";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import styles from "./Features.module.css";

type ScreenKind =
  | "dna"
  | "scan"
  | "echanges"
  | "cercles"
  | "mystery"
  | "critiques"
  | "listes"
  | "profils"
  | "messages";

type Feature = {
  id: string;
  label: string;
  title: string;
  desc: string;
  screen: ScreenKind;
};

const FEATURES_FR: Feature[] = [
  {
    id: "dna",
    label: "Reading DNA",
    title: "Un profil qui vous ressemble",
    desc: "Répondez à quelques questions sur vos genres et vos rythmes de lecture : vos suggestions s'affinent à chaque livre ajouté.",
    screen: "dna",
  },
  {
    id: "scan",
    label: "Scan ISBN",
    title: "Un livre en main, une fiche en 3 secondes",
    desc: "Visez le code-barres avec votre appareil photo : titre, auteur et couverture arrivent seuls, sans une ligne à taper.",
    screen: "scan",
  },
  {
    id: "echanges",
    label: "Échanges",
    title: "Un livre contre un livre",
    desc: "Proposez un titre, convenez d'une remise près de chez vous et suivez chaque étape dans une messagerie dédiée.",
    screen: "echanges",
  },
  {
    id: "cercles",
    label: "Cercles de lecture",
    title: "Lisez à plusieurs, à votre rythme",
    desc: "Polar, romance, SF, classiques : rejoignez un cercle public ou privé et avancez ensemble sur le même livre.",
    screen: "cercles",
  },
  {
    id: "mystery",
    label: "Mystery Book",
    title: "Un mystère par jour, à minuit",
    desc: "Devinez le livre du jour avec le moins d'indices possible : deux essais, cinq indices, une série à ne pas briser.",
    screen: "mystery",
  },
  {
    id: "critiques",
    label: "Avis",
    title: "Choisissez sans scroller à l'infini",
    desc: "Notes, critiques courtes et tendances du fil : de quoi trancher avant d'ouvrir votre prochain livre.",
    screen: "critiques",
  },
  {
    id: "listes",
    label: "Listes",
    title: "Votre bibliothèque, rangée et partageable",
    desc: "Envies, livres possédés, livres lus : créez vos listes, likez et partagez celles des profils que vous suivez.",
    screen: "listes",
  },
  {
    id: "profils",
    label: "Profils",
    title: "Suivez les lecteurs que vous admirez",
    desc: "Un fil d'activité qui montre, vraiment, ce que lisent les personnes dont vous aimez les goûts.",
    screen: "profils",
  },
  {
    id: "messages",
    label: "Messagerie",
    title: "Un fil, juste pour parler livres",
    desc: "Coordonnez une remise, envoyez un extrait ou prolongez le débat, loin du bruit des réseaux généralistes.",
    screen: "messages",
  },
];

const FEATURES_EN: Feature[] = [
  {
    id: "dna",
    label: "Reading DNA",
    title: "A profile that looks like you",
    desc: "Answer a few questions about your genres and reading pace: your suggestions get sharper with every book you add.",
    screen: "dna",
  },
  {
    id: "scan",
    label: "ISBN Scan",
    title: "A book in hand, a listing in 3 seconds",
    desc: "Point your camera at the barcode: title, author, and cover show up on their own, without typing a line.",
    screen: "scan",
  },
  {
    id: "echanges",
    label: "Swaps",
    title: "One book for another",
    desc: "Offer a title, arrange a handoff near you, and follow every step in a dedicated messaging thread.",
    screen: "echanges",
  },
  {
    id: "cercles",
    label: "Reading Circles",
    title: "Read together, at your own pace",
    desc: "Mystery, romance, sci-fi, classics: join a public or private circle and move through the same book together.",
    screen: "cercles",
  },
  {
    id: "mystery",
    label: "Mystery Book",
    title: "A mystery every day, at midnight",
    desc: "Guess the day's book with as few clues as possible: two guesses, five clues, a streak not to break.",
    screen: "mystery",
  },
  {
    id: "critiques",
    label: "Reviews",
    title: "Choose without the endless scroll",
    desc: "Ratings, short reviews, and feed trends: enough to decide before you open your next book.",
    screen: "critiques",
  },
  {
    id: "listes",
    label: "Lists",
    title: "Your library, organized and shareable",
    desc: "Want-to-read, owned, and finished: build your lists, like and share the ones from profiles you follow.",
    screen: "listes",
  },
  {
    id: "profils",
    label: "Profiles",
    title: "Follow the readers you admire",
    desc: "An activity feed that actually shows what the people whose taste you love are reading.",
    screen: "profils",
  },
  {
    id: "messages",
    label: "Messaging",
    title: "A thread, just for talking books",
    desc: "Coordinate a handoff, send a passage, or keep the conversation going, away from the noise of general social media.",
    screen: "messages",
  },
];

const SCREEN_COPY = {
  fr: {
    profilsName: "Léa M.",
    profilsMeta: "lit · 62 % · chapitre 14",
    bookTitle: "Les Heures suspendues",
    bookAuthor: "N. Aubry",
    profilsQuote: "« Il y a des silences qu’on n’ose pas rompre. »",
    dnaChip1: "Contemplatif",
    dnaChip2: "Personnages forts",
    dnaChip3: "Romans courts",
    dnaMeta: (
      <>
        de correspondance avec <em>Les Heures suspendues</em>
      </>
    ),
    scanMeta: "Ajouté en 3 secondes",
    listTitle: "Lectures d’été",
    listMeta: "12 livres · 34 ♥",
    circles: [
      { name: "Lectures d'été", meta: "34 membres · Sapiens" },
      { name: "Club des mardis", meta: "12 membres · Circé" },
      { name: "Poésie du soir", meta: "8 membres · Odes" },
    ],
    swapCaption: "Léo propose un échange",
    swapBook1: "Sapiens",
    swapBook2: "Circé",
    swapAccept: "Accepter",
    mysteryMeta: "jours de série Mystery Book",
    chat1: <>On se retrouve où pour l&rsquo;échange&nbsp;? 👀</>,
    chat2: <>Devant la librairie du coin, 18h&nbsp;?</>,
    chat3Chip: "Sapiens",
    chat3: <>je te l&rsquo;apporte contre le tien 😊</>,
    critiquesQuote: (
      <>
        « Je n&rsquo;ouvre plus un livre sans <em>LinQfolio</em>. »
      </>
    ),
    critiquesName: "Inès, 24 ans",
    srHeading: "Fonctionnalités de LinQfolio",
    eyebrow: "Fonctionnalités",
    chapter: "Chapitre",
    scrollHint: "Continuez à descendre",
  },
  en: {
    profilsName: "Léa M.",
    profilsMeta: "reading · 62% · chapter 14",
    bookTitle: "The Suspended Hours",
    bookAuthor: "N. Aubry",
    profilsQuote: "“There are silences we don’t dare break.”",
    dnaChip1: "Contemplative",
    dnaChip2: "Strong characters",
    dnaChip3: "Short novels",
    dnaMeta: (
      <>
        match with <em>The Suspended Hours</em>
      </>
    ),
    scanMeta: "Added in 3 seconds",
    listTitle: "Summer Reads",
    listMeta: "12 books · 34 ♥",
    circles: [
      { name: "Summer Reads", meta: "34 members · Sapiens" },
      { name: "Tuesday Club", meta: "12 members · Circe" },
      { name: "Evening Poetry", meta: "8 members · Odes" },
    ],
    swapCaption: "Léo suggests a swap",
    swapBook1: "Sapiens",
    swapBook2: "Circe",
    swapAccept: "Accept",
    mysteryMeta: "day Mystery Book streak",
    chat1: <>Where should we meet for the swap&nbsp;? 👀</>,
    chat2: <>In front of the corner bookshop, 6pm&nbsp;?</>,
    chat3Chip: "Sapiens",
    chat3: <>I&rsquo;ll bring it in exchange for yours 😊</>,
    critiquesQuote: (
      <>
        &ldquo;I don&rsquo;t open a book without LinQfolio anymore.&rdquo;
      </>
    ),
    critiquesName: "Inès, 24",
    srHeading: "LinQfolio features",
    eyebrow: "Features",
    chapter: "Chapter",
    scrollHint: "Keep scrolling",
  },
} as const;

const STEPS = FEATURES_FR.length;
const STEP_VH = 85;

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
const getReducedMotionSnapshot = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const getReducedMotionServerSnapshot = () => false;

function FeatureScreen({
  kind,
  s,
}: {
  kind: ScreenKind;
  s: (typeof SCREEN_COPY)["fr"] | (typeof SCREEN_COPY)["en"];
}) {
  switch (kind) {
    case "profils":
      return (
        <div className={styles.feedPost}>
          <div className={styles.postHead}>
            <span className={styles.avatar} aria-hidden="true">
              L
            </span>
            <span>
              <span className={styles.postName}>{s.profilsName}</span>
              <br />
              <span className={styles.postMeta}>{s.profilsMeta}</span>
            </span>
          </div>
          <div className={styles.bookRow}>
            <div className={styles.cover} aria-hidden="true" />
            <div>
              <div className={styles.bookTitle}>{s.bookTitle}</div>
              <div className={styles.bookAuthor}>{s.bookAuthor}</div>
            </div>
          </div>
          <div className={styles.progressTrack} aria-hidden="true">
            <div className={styles.progressFill} />
          </div>
          <p className={styles.quote}>{s.profilsQuote}</p>
        </div>
      );

    case "dna":
      return (
        <div className={styles.dnaWrap}>
          <div className={styles.dnaChips} aria-hidden="true">
            <span className={styles.dnaChip}>{s.dnaChip1}</span>
            <span className={styles.dnaChip}>{s.dnaChip2}</span>
            <span className={styles.dnaChip}>{s.dnaChip3}</span>
          </div>
          <div className={styles.dnaScore}>92%</div>
          <p className={styles.postMeta}>{s.dnaMeta}</p>
        </div>
      );

    case "scan":
      return (
        <div className={styles.scanWrap}>
          <div className={styles.scanFrame} aria-hidden="true">▐│▌║ ▌│▐║ │▌</div>
          <div className={styles.bookRow}>
            <div className={styles.cover} aria-hidden="true" />
            <div>
              <div className={styles.bookTitle}>{s.bookTitle}</div>
              <div className={styles.bookAuthor}>{s.bookAuthor}</div>
            </div>
          </div>
          <p className={styles.postMeta}>{s.scanMeta}</p>
        </div>
      );

    case "listes":
      return (
        <div className={styles.listWrap}>
          <div className={styles.bookTitle}>{s.listTitle}</div>
          <p className={styles.postMeta}>{s.listMeta}</p>
          <div className={styles.discoverGrid} aria-hidden="true">
            {[
              "155deg, #6a3df0, #2c0f5c",
              "155deg, #e2b04a, #2c0f5c",
              "155deg, #cba9ff, #6a3df0",
              "155deg, #2c0f5c, #170733",
              "155deg, #f2ecfb, #6a3df0",
              "155deg, #6a3df0, #e2b04a",
            ].map((g, i) => (
              <span key={i} className={styles.discoverCover} style={{ backgroundImage: `linear-gradient(${g})` }} />
            ))}
          </div>
        </div>
      );

    case "cercles":
      return (
        <div className={styles.circleList}>
          {s.circles.map((c) => (
            <div className={styles.circleRow} key={c.name}>
              <span className={styles.circleAvatars} aria-hidden="true">
                <span className={styles.miniAvatar}>A</span>
                <span className={styles.miniAvatar}>B</span>
              </span>
              <span>
                <span className={styles.circleName}>{c.name}</span>
                <br />
                <span className={styles.postMeta}>{c.meta}</span>
              </span>
            </div>
          ))}
        </div>
      );

    case "echanges":
      return (
        <div className={styles.swapCard}>
          <p className={styles.swapCaption}>{s.swapCaption}</p>
          <div className={styles.swapRow}>
            <div className={styles.swapSide}>
              <div className={styles.cover} aria-hidden="true" />
              <span className={styles.bookAuthor}>{s.swapBook1}</span>
            </div>
            <span className={styles.swapIcon} aria-hidden="true">
              ⇄
            </span>
            <div className={styles.swapSide}>
              <div className={`${styles.cover} ${styles.coverAlt}`} aria-hidden="true" />
              <span className={styles.bookAuthor}>{s.swapBook2}</span>
            </div>
          </div>
          <span className={styles.swapPill}>{s.swapAccept}</span>
        </div>
      );

    case "mystery":
      return (
        <div className={styles.streakWrap}>
          <span className={styles.flameIcon} aria-hidden="true">
            🔍
          </span>
          <div className={styles.streakNumber}>12</div>
          <div className={styles.postMeta}>{s.mysteryMeta}</div>
          <div className={styles.weekRow} aria-hidden="true">
            {[1, 1, 1, 1, 1, 1, 0].map((done, i) => (
              <span key={i} className={`${styles.dayDot} ${done ? styles.dayDotDone : ""}`} />
            ))}
          </div>
        </div>
      );

    case "messages":
      return (
        <div className={styles.chatThread}>
          <div className={`${styles.bubble} ${styles.bubbleIn}`}>
            {s.chat1}
          </div>
          <div className={`${styles.bubble} ${styles.bubbleOut}`}>
            {s.chat2}
          </div>
          <div className={`${styles.bubble} ${styles.bubbleIn}`}>
            <span className={styles.bubbleChip}>{s.chat3Chip}</span>
            {s.chat3}
          </div>
        </div>
      );

    case "critiques":
      return (
        <div className={styles.reviewWrap}>
          <span className={styles.reviewStars}>★★★★★</span>
          <p className={styles.quote}>{s.critiquesQuote}</p>
          <div className={styles.postHead}>
            <span className={styles.avatar} aria-hidden="true">
              I
            </span>
            <span className={styles.postName}>{s.critiquesName}</span>
          </div>
        </div>
      );
  }
}

export default function Features() {
  const { lang } = useLanguage();
  const FEATURES = lang === "fr" ? FEATURES_FR : FEATURES_EN;
  const s = SCREEN_COPY[lang];

  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Matches the server's render (no preference) during hydration, then
  // picks up the real preference — avoids a hydration mismatch.
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(STEPS - 1, Math.max(0, Math.floor(v * STEPS)));
    setActive((prev) => (prev === idx ? prev : idx));
  });

  // The phone itself arrives from the hero via PhoneFlight (a GSAP
  // ScrollTrigger-scrubbed shared-element transition that flies the real
  // hero phone across the boundary and hands off to this one). From here
  // it just keeps drifting right while its screen cycles through the 9 features.
  const driftX = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? ["0%", "0%"] : ["-4%", "9%"]);
  const driftRotate = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [-3, 1.5]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.06, 0.92, 1], [0, 1, 1, 0]);

  const feature = FEATURES[active];
  const textMotion = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -14 } };
  const screenMotion = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0, scale: 0.97 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.97 } };

  return (
    <section className={styles.section} data-section="features">
      <h2 className="sr-only">{s.srHeading}</h2>
      <ul className="sr-only">
        {FEATURES.map((f) => (
          <li key={f.id}>
            {f.title}. {f.desc}
          </li>
        ))}
      </ul>

      <div
        ref={sectionRef}
        className={styles.stage}
        style={{ height: `${STEPS * STEP_VH}vh` }}
        data-phone-stage=""
        aria-hidden="true"
      >
        <div className={styles.pin}>
          <FeaturesBackground active={active} prefersReducedMotion={prefersReducedMotion} />
          <div className={styles.inner}>
            <p className={styles.eyebrow}>{s.eyebrow}</p>

            <div className={styles.layout}>
              <ol className={styles.toc}>
                {FEATURES.map((f, i) => (
                  <li
                    key={f.id}
                    className={`${styles.tocItem} ${i === active ? styles.tocItemActive : ""}`}
                  >
                    <span className={styles.tocLabel}>{f.label}</span>
                    <span className={styles.tocDots} />
                    <span className={styles.tocNumber}>{String(i + 1).padStart(2, "0")}</span>
                  </li>
                ))}
              </ol>

              <div className={styles.textCol}>
                <AnimatePresence>
                  <motion.div
                    key={feature.id}
                    className={styles.textFrame}
                    initial={textMotion.initial}
                    animate={textMotion.animate}
                    exit={textMotion.exit}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className={styles.kicker}>
                      {s.chapter} {String(active + 1).padStart(2, "0")}
                    </span>
                    <h3 className={styles.title}>{feature.title}</h3>
                    <p className={styles.desc}>{feature.desc}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <motion.div
                className={styles.phoneCol}
                style={{ x: driftX, rotate: driftRotate }}
              >
                <Phone className={styles.featurePhone} data-phone-flight="to">
                  <AnimatePresence>
                    <motion.div
                      key={feature.id}
                      className={styles.screenInner}
                      initial={screenMotion.initial}
                      animate={screenMotion.animate}
                      exit={screenMotion.exit}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className={styles.screenContent}>
                        <FeatureScreen kind={feature.screen} s={s} />
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </Phone>
              </motion.div>
            </div>

            <motion.div className={styles.scrollHint} style={{ opacity: hintOpacity }}>
              {s.scrollHint}
              <svg width="14" height="9" viewBox="0 0 14 9" fill="none">
                <path
                  d="M1 1l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
