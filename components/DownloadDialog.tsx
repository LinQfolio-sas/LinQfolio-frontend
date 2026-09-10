"use client";

import { useEffect, useId, useRef } from "react";
import { useLanguage, useT } from "@/lib/i18n/LanguageContext";
import { trackStoreClick } from "@/lib/analytics/events";
import { STORE_LINKS } from "@/lib/links";
import styles from "./DownloadDialog.module.css";

/**
 * Les deux façons d'installer l'application, dans une boîte de dialogue.
 *
 * Le bouton « Télécharger » de l'en-tête menait jusqu'ici au bandeau de fin de
 * page d'accueil — un aller-retour pour deux liens. La carte les apporte sur
 * place : le code à scanner pour passer de l'écran au téléphone, les deux
 * magasins pour ceux qui y sont déjà.
 *
 * C'est un `<dialog>` natif ouvert par `showModal()`. Le navigateur fournit
 * alors le piège à focus, la fermeture par Échap, l'inertie du reste de la
 * page et la promotion au calque supérieur — donc aucun `z-index` à négocier
 * avec l'en-tête ni avec le bandeau de consentement.
 */

const COPY = {
  fr: {
    /* Le geste garde son nom d'un bout à l'autre : le bouton dit
       « Télécharger », la carte qu'il ouvre aussi. */
    eyebrow: "Télécharger",
    title: (
      <>
        LinQfolio,
        <br />
        sur votre téléphone.
      </>
    ),
    qrAlt: "Code QR menant à linqfolio.com, où télécharger l’application",
    qrNote: "à scanner avec un téléphone",
    appStore: "App Store",
    googlePlay: "Google Play",
    appStoreAria: "Télécharger LinQfolio sur l’App Store",
    googlePlayAria: "Télécharger LinQfolio sur Google Play",
    microcopy: "Gratuit · iOS et Android · sans carte bancaire",
    close: "Fermer",
  },
  en: {
    eyebrow: "Download",
    title: (
      <>
        LinQfolio,
        <br />
        on your phone.
      </>
    ),
    qrAlt: "QR code leading to linqfolio.com, where the app is available",
    qrNote: "scan it with a phone",
    appStore: "App Store",
    googlePlay: "Google Play",
    appStoreAria: "Download LinQfolio on the App Store",
    googlePlayAria: "Download LinQfolio on Google Play",
    microcopy: "Free · iOS and Android · no credit card",
    close: "Close",
  },
} as const;

/** La flèche de téléchargement, la même que dans le hero et le bandeau de fin. */
function DownloadGlyph() {
  return (
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
  );
}

export default function DownloadDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useT(COPY);
  const { lang } = useLanguage();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  /* `showModal()` ne s'appelle qu'en impératif : l'état React est la source,
     l'attribut `open` du DOM en est le reflet. */
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  /* Le calque supérieur rend le reste de la page inerte, mais ne l'empêche pas
     de défiler sous la carte. */
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      onClose={onClose}
      /* La carte ne couvre pas toute la boîte : un clic qui atteint la boîte
         elle-même est un clic à côté de la carte, donc une fermeture. */
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      <div className={styles.card}>
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label={t.close}
        >
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <p className={styles.eyebrow}>{t.eyebrow}</p>
        <h2 className={styles.title} id={titleId}>
          {t.title}
        </h2>

        {/* L'ex-libris de la page de liens, repris tel quel : c'est déjà la
            façon dont ce site présente un code à scanner. Un lecteur de code
            attend des modules sombres sur fond clair — la plaque garde donc
            les couleurs de marque dans les deux thèmes, et le rembourrage EST
            la zone de silence du code. */}
        <div className={styles.plate}>
          <div className={styles.qrFrame}>
            <img
              className={styles.qrImage}
              src="/qr-header.svg"
              alt={t.qrAlt}
              width={33}
              height={33}
            />
          </div>
        </div>
        <p className={styles.qrNote}>{t.qrNote}</p>

        {/* Les deux magasins pèsent le même poids : on ne sait pas sur quel
            appareil la carte s'ouvre. */}
        <div className={styles.storeRow} data-cta="header">
          <a
            className={`${styles.storeButton} ${styles.appStore}`}
            href={STORE_LINKS.appStore}
            target="_blank"
            rel="noreferrer"
            aria-label={t.appStoreAria}
            onClick={() => trackStoreClick("app_store", "header", lang)}
          >
            <DownloadGlyph />
            {t.appStore}
          </a>
          <a
            className={`${styles.storeButton} ${styles.googlePlay}`}
            href={STORE_LINKS.googlePlay}
            target="_blank"
            rel="noreferrer"
            aria-label={t.googlePlayAria}
            onClick={() => trackStoreClick("google_play", "header", lang)}
          >
            <DownloadGlyph />
            {t.googlePlay}
          </a>
        </div>

        <p className={styles.microcopy}>{t.microcopy}</p>
      </div>
    </dialog>
  );
}
