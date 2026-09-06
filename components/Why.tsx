"use client";

import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import styles from "./Why.module.css";

type Reason = {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
};

const REASONS_FR: Reason[] = [
  {
    id: "fil",
    title: "Tout au même endroit",
    desc: "Lectures, échanges, clubs et discussions dans un seul fil.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 2v16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="7.2" cy="4.5" r="1.6" fill="currentColor" />
        <circle cx="12.5" cy="10" r="1.6" fill="currentColor" />
        <circle cx="7.2" cy="15.5" r="1.6" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "donnees",
    title: "Vos données restent les vôtres",
    desc: "Aucune revente. Hébergement Europe, conformité RGPD.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d="M5.5 8.75V6.5a4.5 4.5 0 0 1 9 0v2.25"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <rect x="4" y="8.75" width="12" height="7.5" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="10" cy="12.25" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "local",
    title: "Un impact local et durable",
    desc: "Échanges près de chez vous, librairies indépendantes mises en avant.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
          d="M4.5 15.5C4.5 8 9.5 3.5 16 3.5c0 8-4.5 13-13 13Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path d="M5 15c2.8-3.6 5.6-6.4 9.5-9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
];

const REASONS_EN: Reason[] = [
  {
    id: "fil",
    title: "Everything in one place",
    desc: "Reading, book swaps, circles and discussions in a single feed.",
    icon: REASONS_FR[0].icon,
  },
  {
    id: "donnees",
    title: "Your data stays yours",
    desc: "No reselling. Hosted in Europe, GDPR-compliant.",
    icon: REASONS_FR[1].icon,
  },
  {
    id: "local",
    title: "A local, lasting impact",
    desc: "Swaps near you, independent bookshops put in the spotlight.",
    icon: REASONS_FR[2].icon,
  },
];

const COPY = {
  fr: {
    eyebrow: "Pourquoi LinQfolio",
    headline: "Le livre au centre, tout simplement",
    lead: (
      <>
        Vous ouvrez l&rsquo;app comme on ouvre un livre, et tout y est déjà à sa
        place&nbsp;: vos lectures, vos amis, vos échanges.
      </>
    ),
    reasons: REASONS_FR,
  },
  en: {
    eyebrow: "Why LinQfolio",
    headline: "The book, front and center",
    lead: (
      <>
        You open the app the way you open a book, and everything is
        already in its place: your reading, your friends, your swaps.
      </>
    ),
    reasons: REASONS_EN,
  },
} as const;

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
const getReducedMotionSnapshot = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const getReducedMotionServerSnapshot = () => false;

export default function Why() {
  const { lang } = useLanguage();
  const t = COPY[lang];
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  const pageLeftMotion = prefersReducedMotion
    ? { initial: { opacity: 0 }, whileInView: { opacity: 1 } }
    : { initial: { opacity: 0, rotateY: -10, x: 10 }, whileInView: { opacity: 1, rotateY: 0, x: 0 } };
  const pageRightMotion = prefersReducedMotion
    ? { initial: { opacity: 0 }, whileInView: { opacity: 1 } }
    : { initial: { opacity: 0, rotateY: 10, x: -10 }, whileInView: { opacity: 1, rotateY: 0, x: 0 } };

  return (
    <section className={styles.section} data-section="why">
      <div className={styles.wash} aria-hidden="true" />

      <div className={styles.inner}>
        <p className={styles.eyebrow}>{t.eyebrow}</p>
        <div className={styles.rule} />

        <div className={styles.spread}>
          <div className={styles.ribbon} aria-hidden="true" />

          <motion.div
            className={`${styles.page} ${styles.pageLeft}`}
            initial={pageLeftMotion.initial}
            whileInView={pageLeftMotion.whileInView}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className={styles.headline}>{t.headline}</h2>
            <p className={styles.lead}>{t.lead}</p>
            <p className={styles.folio}>
              <span className={styles.folioRule} aria-hidden="true" />1
            </p>
          </motion.div>

          <div className={styles.spine} aria-hidden="true" />

          <motion.div
            className={`${styles.page} ${styles.pageRight}`}
            initial={pageRightMotion.initial}
            whileInView={pageRightMotion.whileInView}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <ul className={styles.reasons}>
              {t.reasons.map((reason) => (
                <li className={styles.reason} key={reason.id}>
                  <span className={styles.reasonIcon}>{reason.icon}</span>
                  <span className={styles.reasonBody}>
                    <h3 className={styles.reasonTitle}>{reason.title}</h3>
                    <p className={styles.reasonDesc}>{reason.desc}</p>
                  </span>
                </li>
              ))}
            </ul>
            <p className={styles.folio}>
              2<span className={styles.folioRule} aria-hidden="true" />
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
