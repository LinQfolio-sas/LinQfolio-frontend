"use client";

import { motion, AnimatePresence } from "framer-motion";
import styles from "./FeaturesBackground.module.css";

export default function FeaturesBackground({
  active,
  prefersReducedMotion,
}: {
  active: number;
  prefersReducedMotion: boolean;
}) {
  const markMotion = prefersReducedMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 0.09 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0, y: 40 }, animate: { opacity: 0.09, y: 0 }, exit: { opacity: 0, y: -40 } };

  return (
    <div className={styles.wrap} aria-hidden="true">
      <div className={styles.washTop} />
      <div className={styles.washBottom} />
      <div className={styles.grain} />
      <div className={styles.markWrap}>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={active}
            className={styles.chapterMark}
            initial={markMotion.initial}
            animate={markMotion.animate}
            exit={markMotion.exit}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {String(active + 1).padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
