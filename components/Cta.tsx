"use client";

import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { useLanguage, useT } from "@/lib/i18n/LanguageContext";
import { trackStoreClick } from "@/lib/analytics/events";
import { STORE_LINKS } from "@/lib/links";
import styles from "./Cta.module.css";

const COPY = {
  fr: {
    eyebrow: "Avant de tourner la page",
    headline: (
      <>
        Le prochain chapitre
        <br />
        s&rsquo;écrit à plusieurs.
      </>
    ),
    subhead: (
      <>
        Téléchargez LinQfolio, gratuitement, et retrouvez dès ce soir une
        communauté qui tourne les pages avec vous&nbsp;: cercles de
        lecture, échanges de livres, mystère quotidien à percer.
      </>
    ),
    note1: "on l’a fini le même soir 😭",
    note2: "un cercle rejoint en 30 secondes",
    qrLabel: (
      <>
        Scannez
        <br />
        pour lire
      </>
    ),
    storeLabel: "Téléchargez LinQfolio sur les stores",
    microcopy: "Gratuit · iOS et Android · sans carte bancaire",
    appStore: "App Store",
    googlePlay: "Google Play",
  },
  en: {
    eyebrow: "Before you turn the page",
    headline: (
      <>
        The next chapter
        <br />
        is written together.
      </>
    ),
    subhead: (
      <>
        Download LinQfolio for free, and find a community turning pages
        with you tonight: reading circles, book swaps, a daily mystery
        to crack.
      </>
    ),
    note1: "we finished it the same night 😭",
    note2: "a circle joined in 30 seconds",
    qrLabel: (
      <>
        Scan
        <br />
        to read
      </>
    ),
    storeLabel: "Download LinQfolio on the app stores",
    microcopy: "Free · iOS and Android · no credit card",
    appStore: "App Store",
    googlePlay: "Google Play",
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

export default function Cta() {
  const t = useT(COPY);
  const { lang } = useLanguage();
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  const textMotion = prefersReducedMotion
    ? { initial: { opacity: 0 }, whileInView: { opacity: 1 } }
    : { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 } };

  const bookMotion = prefersReducedMotion
    ? { initial: { opacity: 0 }, whileInView: { opacity: 1 } }
    : {
        initial: { opacity: 0, y: 26, rotate: -8, scale: 0.92 },
        whileInView: { opacity: 1, y: 0, rotate: -3, scale: 1 },
      };

  const noteMotion = (rot: number) =>
    prefersReducedMotion
      ? { initial: { opacity: 0 }, whileInView: { opacity: 1 } }
      : { initial: { opacity: 0, y: 14, rotate: 0 }, whileInView: { opacity: 1, y: 0, rotate: rot } };

  const noteOne = noteMotion(-5);
  const noteTwo = noteMotion(4);

  return (
    <section className={styles.section} id="telecharger" data-section="cta">
      <div className={styles.wash} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />

      <div className={styles.inner}>
        <motion.p
          className={styles.eyebrow}
          initial={textMotion.initial}
          whileInView={textMotion.whileInView}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {t.eyebrow}
        </motion.p>

        <motion.h2
          className={styles.headline}
          initial={textMotion.initial}
          whileInView={textMotion.whileInView}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
        >
          {t.headline}
        </motion.h2>

        <motion.p
          className={styles.subhead}
          initial={textMotion.initial}
          whileInView={textMotion.whileInView}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        >
          {t.subhead}
        </motion.p>

        <div className={styles.stage}>
          <motion.div
            className={`${styles.note} ${styles.noteOne}`}
            aria-hidden="true"
            initial={noteOne.initial}
            whileInView={noteOne.whileInView}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            {t.note1}
          </motion.div>

          <motion.div
            className={styles.book}
            aria-hidden="true"
            initial={bookMotion.initial}
            whileInView={bookMotion.whileInView}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.ribbon} />
            <div className={styles.pagesEdge} />
            <div className={styles.bookCover}>
              <img
                className={styles.bookLogo}
                src="/linqfolio/LinQfolio_Logo_Transparent_White.png"
                alt="LinQfolio"
                width={667}
                height={667}
              />
            </div>

            <div className={styles.qrCard}>
              <img
                className={styles.qrImage}
                src="/qr-cta.svg"
                alt=""
                width={33}
                height={33}
              />
              <span className={styles.qrLabel}>{t.qrLabel}</span>
            </div>
          </motion.div>

          <motion.div
            className={`${styles.note} ${styles.noteTwo}`}
            aria-hidden="true"
            initial={noteTwo.initial}
            whileInView={noteTwo.whileInView}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
          >
            {t.note2}
          </motion.div>
        </div>

        <div className={styles.actions} data-cta="cta_footer">
          <p className={styles.storeLabel}>{t.storeLabel}</p>

          <div className={styles.storeRow}>
            <a
              href={STORE_LINKS.appStore}
              className={`${styles.storeBadge} ${styles.appStore}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackStoreClick("app_store", "cta_footer", lang)}
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M10 2.5v10.5M6 9.5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3.5 15.5v1.5a1.5 1.5 0 0 0 1.5 1.5h10a1.5 1.5 0 0 0 1.5-1.5v-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {t.appStore}
            </a>
            <a
              href={STORE_LINKS.googlePlay}
              className={`${styles.storeBadge} ${styles.googlePlay}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackStoreClick("google_play", "cta_footer", lang)}
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M10 2.5v10.5M6 9.5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3.5 15.5v1.5a1.5 1.5 0 0 0 1.5 1.5h10a1.5 1.5 0 0 0 1.5-1.5v-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {t.googlePlay}
            </a>
          </div>

          <p className={styles.microcopy}>
            {t.microcopy}
          </p>
        </div>
      </div>
    </section>
  );
}
