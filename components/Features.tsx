"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
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

type Feature = {
  id: string;
  label: string;
  title: string;
  desc: string;
};

const FEATURES_FR: Feature[] = [
  {
    id: "dna",
    label: "Reading DNA",
    title: "Un profil qui vous ressemble",
    desc: "Répondez à quelques questions sur vos genres et vos rythmes de lecture : vos suggestions s'affinent à chaque livre ajouté.",
  },
  {
    id: "scan",
    label: "Scan ISBN",
    title: "Un livre en main, une fiche en 3 secondes",
    desc: "Visez le code-barres avec votre appareil photo : titre, auteur et couverture arrivent seuls, sans une ligne à taper.",
  },
  {
    id: "echanges",
    label: "Échanges",
    title: "Un livre contre un livre",
    desc: "Proposez un titre, convenez d'une remise près de chez vous et suivez chaque étape dans une messagerie dédiée.",
  },
  {
    id: "cercles",
    label: "Cercles de lecture",
    title: "Lisez à plusieurs, à votre rythme",
    desc: "Polar, romance, SF, classiques : rejoignez un cercle public ou privé et avancez ensemble sur le même livre.",
  },
  {
    id: "mystery",
    label: "Mystery Book",
    title: "Un mystère par jour, à minuit",
    desc: "Devinez le livre du jour avec le moins d'indices possible : deux essais, cinq indices, une série à ne pas briser.",
  },
  {
    id: "critiques",
    label: "Avis",
    title: "Choisissez sans scroller à l'infini",
    desc: "Notes, critiques courtes et tendances du fil : de quoi trancher avant d'ouvrir votre prochain livre.",
  },
  {
    id: "listes",
    label: "Listes",
    title: "Votre bibliothèque, rangée et partageable",
    desc: "Envies, livres possédés, livres lus : créez vos listes, likez et partagez celles des profils que vous suivez.",
  },
  {
    id: "profils",
    label: "Profils",
    title: "Suivez les lecteurs que vous admirez",
    desc: "Un fil d'activité qui montre, vraiment, ce que lisent les personnes dont vous aimez les goûts.",
  },
  {
    id: "messages",
    label: "Messagerie",
    title: "Un fil, juste pour parler livres",
    desc: "Coordonnez une remise, envoyez un extrait ou prolongez le débat, loin du bruit des réseaux généralistes.",
  },
];

const FEATURES_EN: Feature[] = [
  {
    id: "dna",
    label: "Reading DNA",
    title: "A profile that looks like you",
    desc: "Answer a few questions about your genres and reading pace: your suggestions get sharper with every book you add.",
  },
  {
    id: "scan",
    label: "ISBN Scan",
    title: "A book in hand, a listing in 3 seconds",
    desc: "Point your camera at the barcode: title, author, and cover show up on their own, without typing a line.",
  },
  {
    id: "echanges",
    label: "Swaps",
    title: "One book for another",
    desc: "Offer a title, arrange a handoff near you, and follow every step in a dedicated messaging thread.",
  },
  {
    id: "cercles",
    label: "Reading Circles",
    title: "Read together, at your own pace",
    desc: "Mystery, romance, sci-fi, classics: join a public or private circle and move through the same book together.",
  },
  {
    id: "mystery",
    label: "Mystery Book",
    title: "A mystery every day, at midnight",
    desc: "Guess the day's book with as few clues as possible: two guesses, five clues, a streak not to break.",
  },
  {
    id: "critiques",
    label: "Reviews",
    title: "Choose without the endless scroll",
    desc: "Ratings, short reviews, and feed trends: enough to decide before you open your next book.",
  },
  {
    id: "listes",
    label: "Lists",
    title: "Your library, organized and shareable",
    desc: "Want-to-read, owned, and finished: build your lists, like and share the ones from profiles you follow.",
  },
  {
    id: "profils",
    label: "Profiles",
    title: "Follow the readers you admire",
    desc: "An activity feed that actually shows what the people whose taste you love are reading.",
  },
  {
    id: "messages",
    label: "Messaging",
    title: "A thread, just for talking books",
    desc: "Coordinate a handoff, send a passage, or keep the conversation going, away from the noise of general social media.",
  },
];

// The app screenshot each chapter shows on the phone, by feature id.
const SCREENS: Record<string, string> = {
  dna: "/SCREENS/reading-dna.webp",
  scan: "/SCREENS/scan.webp",
  echanges: "/SCREENS/echange.webp",
  cercles: "/SCREENS/club-lecture.webp",
  mystery: "/SCREENS/livre-mystere.webp",
  critiques: "/SCREENS/avis-critiques.webp",
  listes: "/SCREENS/liste-lecture.webp",
  profils: "/SCREENS/profil.webp",
  messages: "/SCREENS/messageries.webp",
};

const SCREEN_COPY = {
  fr: {
    srHeading: "Fonctionnalités de LinQfolio",
    eyebrow: "Fonctionnalités",
    chapter: "Chapitre",
    scrollHint: "Continuez à descendre",
    tocLabel: "Sommaire des fonctionnalités",
  },
  en: {
    srHeading: "LinQfolio features",
    eyebrow: "Features",
    chapter: "Chapter",
    scrollHint: "Keep scrolling",
    tocLabel: "Features table of contents",
  },
} as const;

const STEPS = FEATURES_FR.length;
const STEP_VH = 85;

// Every chapter gets an anchor in the middle of the scroll band where it
// shows (active = floor(progress * STEPS), progress running over the stage's
// height minus one viewport). The table of contents links to these, and so
// can anyone else: /#echanges opens on that chapter. Aiming for the middle
// leaves half a band of slack for viewport quirks such as a mobile address bar.
const chapterTop = (i: number) =>
  `calc(${((i + 0.5) / STEPS).toFixed(4)} * (100% - 100vh))`;

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
const getReducedMotionSnapshot = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const getReducedMotionServerSnapshot = () => false;

export default function Features() {
  const { lang } = useLanguage();
  const FEATURES = lang === "fr" ? FEATURES_FR : FEATURES_EN;
  const s = SCREEN_COPY[lang];

  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  // Where a table-of-contents jump is headed, until the scroll gets there.
  const [jumpTarget, setJumpTarget] = useState<number | null>(null);
  const shown = jumpTarget ?? active;

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
    setJumpTarget((target) => (target === idx ? null : target));
  });

  // Anything the reader does mid-jump hands control back to the scroll
  // position; so does the scroll coming to rest short of the target.
  useEffect(() => {
    if (jumpTarget === null) return;
    const release = () => setJumpTarget(null);
    const events = ["wheel", "touchstart", "pointerdown", "keydown", "scrollend"] as const;
    events.forEach((type) => window.addEventListener(type, release, { passive: true }));
    return () => events.forEach((type) => window.removeEventListener(type, release));
  }, [jumpTarget]);

  // Each chapter mounts a fresh <img>: fetch every screenshot up front so a
  // chapter change never shows the phone empty while its image downloads.
  useEffect(() => {
    Object.values(SCREENS).forEach((src) => {
      new Image().src = src;
    });
  }, []);

  // The phone itself arrives from the hero via PhoneFlight (a GSAP
  // ScrollTrigger-scrubbed shared-element transition that flies the real
  // hero phone across the boundary and hands off to this one). From here
  // it just keeps drifting right while its screen cycles through the 9 features.
  const driftX = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? ["0%", "0%"] : ["-4%", "9%"]);
  const driftRotate = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [-3, 1.5]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.06, 0.92, 1], [0, 1, 1, 0]);

  const feature = FEATURES[shown];
  const textMotion = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -14 } };
  const screenMotion = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0, scale: 0.97 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.97 } };

  // The table of contents moves the page to a chapter's anchor rather than
  // setting `active` directly, so the phone drift and the chapter mark follow
  // the same path they take under the wheel: on a long jump the mark riffles
  // through the chapters in between. The copy, the screen and the contents
  // highlight go straight to the destination instead of stacking every
  // chapter's exit on the way. The address bar is left alone, since the hash
  // would go stale as soon as the reader scrolls on.
  const goToChapter = (i: number) => {
    if (i !== active) setJumpTarget(i);
    document.getElementById(FEATURES[i].id)?.scrollIntoView({
      behavior: prefersReducedMotion ? "instant" : "smooth",
      block: "start",
    });
  };

  return (
    <section className={styles.section} data-section="features">
      <h2 className="sr-only">{s.srHeading}</h2>

      <div
        ref={sectionRef}
        className={styles.stage}
        style={{ height: `${STEPS * STEP_VH}vh` }}
        data-phone-stage=""
      >
        <div className={styles.pin}>
          <FeaturesBackground active={active} prefersReducedMotion={prefersReducedMotion} />
          <div className={styles.inner}>
            <p className={styles.eyebrow} aria-hidden="true">
              {s.eyebrow}
            </p>

            <div className={styles.layout}>
              <nav className={styles.toc} aria-label={s.tocLabel}>
                <ol className={styles.tocList}>
                  {FEATURES.map((f, i) => (
                    <li key={f.id}>
                      <a
                        href={`#${f.id}`}
                        className={`${styles.tocItem} ${i === shown ? styles.tocItemActive : ""}`}
                        aria-current={i === shown ? "true" : undefined}
                        onClick={(event) => {
                          // Cmd/Ctrl-click still opens the chapter in a new tab.
                          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                          event.preventDefault();
                          goToChapter(i);
                        }}
                      >
                        <span className={styles.tocLabel}>{f.label}</span>
                        <span className={styles.tocDots} aria-hidden="true" />
                        <span className={styles.tocNumber} aria-hidden="true">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>

              {/* Screen readers get the copy from the chapter list below; this
                  is its animated rendition. */}
              <div className={styles.textCol} aria-hidden="true">
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
                      {s.chapter} {String(shown + 1).padStart(2, "0")}
                    </span>
                    <h3 className={styles.title}>{feature.title}</h3>
                    <p className={styles.desc}>{feature.desc}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <motion.div
                className={styles.phoneCol}
                style={{ x: driftX, rotate: driftRotate }}
                aria-hidden="true"
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
                      <img src={SCREENS[feature.id]} alt="" width={1206} height={2622} />
                    </motion.div>
                  </AnimatePresence>
                </Phone>
              </motion.div>
            </div>

            <motion.div
              className={styles.scrollHint}
              style={{ opacity: hintOpacity }}
              aria-hidden="true"
            >
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

        {/* The chapters themselves, for screen readers and as link targets,
            each placed at its point in the scroll (see chapterTop). */}
        <ol>
          {FEATURES.map((f, i) => (
            <li key={f.id} id={f.id} className="sr-only" style={{ top: chapterTop(i) }}>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
