"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import ThemeToggle from "./ThemeToggle";
import { useLanguage, useT } from "@/lib/i18n/LanguageContext";
import { href } from "@/lib/seo";
import { elapsedSeconds, track } from "@/lib/analytics/track";
import { sendAudience } from "@/lib/audience/beacon";
import { socialIcon } from "./SocialIcons";
import { SOCIAL_LINKS } from "@/lib/links";
import styles from "./Footer.module.css";

const COPY = {
  fr: {
    tagline: "Le fil social des lecteurs et lectrices.",
    newsletterEyebrow: "La lettre de LinQfolio",
    newsletterHeadline: "Un nouveau chapitre, chaque semaine dans votre boîte mail.",
    success: "C’est noté, à bientôt dans votre boîte mail.",
    alreadySubscribed: "Vous êtes déjà sur la liste. À très vite.",
    errorInvalidEmail: "Cette adresse est incomplète. Vérifiez-la, puis renvoyez.",
    errorRateLimited: "Trop d’envois depuis cet appareil. Reprenez dans quelques minutes.",
    errorServer: "L’inscription n’a pas été enregistrée. Renvoyez dans un instant.",
    errorNetwork: "La connexion s’est interrompue. Renvoyez quand elle revient.",
    sendingAria: "Inscription en cours",
    emailLabel: "Adresse email",
    emailPlaceholder: "vous@exemple.com",
    subscribeAria: "S’inscrire à la lettre",
    microcopy: "Recommandations, cercles à rejoindre, extraits choisis. Un email par semaine, désinscription en un clic.",
    footerNavAria: "Pied de page",
    resources: "Ressources",
    about: "À propos",
    blog: "Blog",
    faq: "FAQ",
    legal: "Légal",
    privacy: "Confidentialité",
    terms: "Conditions d’utilisation",
    legalNotice: "Mentions légales",
    cookies: "Cookies",
    followUs: "Suivez-nous",
    socialAria: "LinQfolio sur les réseaux sociaux",
    copyright: "© 2026 LinQfolio · Paris",
  },
  en: {
    tagline: "The social feed for readers.",
    newsletterEyebrow: "The LinQfolio Letter",
    newsletterHeadline: "A new chapter, every week in your inbox.",
    success: "Got it, see you soon in your inbox.",
    alreadySubscribed: "You’re already on the list. See you soon.",
    errorInvalidEmail: "That address is incomplete. Check it, then send again.",
    errorRateLimited: "Too many sends from this device. Pick it up again in a few minutes.",
    errorServer: "Your subscription wasn’t saved. Send again in a moment.",
    errorNetwork: "The connection dropped. Send again once it’s back.",
    sendingAria: "Subscribing",
    emailLabel: "Email address",
    emailPlaceholder: "you@example.com",
    subscribeAria: "Subscribe to the newsletter",
    microcopy: "Recommendations, circles to join, handpicked excerpts. One email a week, unsubscribe in one click.",
    footerNavAria: "Footer",
    resources: "Resources",
    about: "About",
    blog: "Blog",
    faq: "FAQ",
    legal: "Legal",
    privacy: "Privacy",
    terms: "Terms of Use",
    legalNotice: "Legal Notice",
    cookies: "Cookies",
    followUs: "Follow us",
    socialAria: "LinQfolio on social media",
    copyright: "© 2026 LinQfolio · Paris",
  },
} as const;

const bookmarkPath =
  "M1 1h18v21.2c0 .9-1 1.4-1.7.9L10 17.5l-7.3 5.6c-.7.5-1.7 0-1.7-.9V1Z";

/** `stamped` est l'instant du cachet : la requête a abouti, mais le formulaire
 *  reste à l'écran le temps que le bouton finisse son animation. */
type Status = "idle" | "pending" | "stamped" | "success" | "error";

type ErrorKey = "invalidEmail" | "rateLimited" | "server" | "network";

const ERROR_BY_CODE: Record<string, ErrorKey> = {
  invalid_email: "invalidEmail",
  invalid_body: "invalidEmail",
  rate_limited: "rateLimited",
};

/** Durée du tampon avant de céder la place au message de confirmation. */
const STAMP_MS = 1000;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export default function Footer() {
  const [status, setStatus] = useState<Status>("idle");
  const [alreadyOnList, setAlreadyOnList] = useState(false);
  const [errorKey, setErrorKey] = useState<ErrorKey | null>(null);
  const stampTimer = useRef<number | null>(null);
  /* Suivi du formulaire. Des refs, pas des états : rien de tout cela ne
     s'affiche, et un rendu supplémentaire au premier focus ferait sauter le
     curseur sur certains navigateurs mobiles. */
  const startedAt = useRef<number | null>(null);
  const hadInput = useRef(false);
  const attempts = useRef(0);
  const settled = useRef(false);
  const t = useT(COPY);
  const { lang } = useLanguage();

  useEffect(() => {
    return () => {
      if (stampTimer.current !== null) window.clearTimeout(stampTimer.current);
    };
  }, []);

  /* Un formulaire commencé puis quitté est la friction la plus coûteuse du
     site : la personne était convaincue, et quelque chose l'a arrêtée.
     `visibilitychange` est le seul signal de départ fiable sur mobile, où
     l'onglet est mis en veille plutôt que fermé. */
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState !== "hidden") return;
      if (startedAt.current === null || settled.current) return;
      settled.current = true;
      track("newsletter_abandon", {
        form_source: "footer",
        time_in_field_s: elapsedSeconds(startedAt.current),
        had_input: hadInput.current,
      });
    };

    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, []);

  function handleFocus() {
    if (startedAt.current !== null) return;
    startedAt.current = Date.now();
    track("newsletter_start", { form_source: "footer", lang });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "pending" || status === "stamped") return;

    // `currentTarget` est remis à null dès la fin du gestionnaire : on garde
    // le nœud avant le premier `await`.
    const form = event.currentTarget;
    const input = form.elements.namedItem("email") as HTMLInputElement;

    if (!input.reportValidity()) return;
    const email = input.value;

    setErrorKey(null);
    setStatus("pending");
    attempts.current += 1;

    let response: Response;
    try {
      response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, lang, source: "footer" }),
      });
    } catch {
      setErrorKey("network");
      setStatus("error");
      track("newsletter_error", {
        form_source: "footer",
        error_code: "network",
        attempts: attempts.current,
      });
      return;
    }

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      setErrorKey(ERROR_BY_CODE[payload?.error] ?? "server");
      setStatus("error");
      // Le code brut de l'API, pas la clé de traduction : c'est lui qui
      // distingue un bug d'une limitation de débit dans les rapports.
      track("newsletter_error", {
        form_source: "footer",
        error_code:
          typeof payload?.error === "string" ? payload.error : "server",
        attempts: attempts.current,
      });
      return;
    }

    const isReturning = payload?.status === "already-subscribed";
    settled.current = true;
    sendAudience({ event: "newsletter_success" });
    track("newsletter_success", {
      form_source: "footer",
      lang,
      is_returning: isReturning,
      time_to_submit_s: elapsedSeconds(startedAt.current ?? Date.now()),
      attempts: attempts.current,
    });

    setAlreadyOnList(isReturning);
    form.reset();
    setStatus("stamped");
    stampTimer.current = window.setTimeout(
      () => setStatus("success"),
      prefersReducedMotion() ? 0 : STAMP_MS,
    );
  }

  function handleInput() {
    hadInput.current = true;
    if (status !== "error") return;
    setStatus("idle");
    setErrorKey(null);
  }

  const errorCopy: Record<ErrorKey, string> = {
    invalidEmail: t.errorInvalidEmail,
    rateLimited: t.errorRateLimited,
    server: t.errorServer,
    network: t.errorNetwork,
  };

  const sealState =
    status === "pending" || status === "stamped" || status === "error"
      ? status
      : "idle";
  const busy = status === "pending" || status === "stamped";

  return (
    <footer className={styles.footer} data-section="footer">
      <div className={styles.wash} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brandBlock}>
            <a href={href("home", lang)} className={styles.brand}>
              <img
                className={styles.brandMark}
                src="/linqfolio/LinQFolio_Secondary_Logo_Violet_Large.png"
                alt="LinQfolio"
                width={1667}
                height={413}
              />
            </a>
            <p className={styles.tagline}>{t.tagline}</p>
          </div>

          <div className={styles.newsletter}>
            <p className={styles.eyebrow}>{t.newsletterEyebrow}</p>
            <h2 className={styles.headline}>{t.newsletterHeadline}</h2>

            {status === "success" ? (
              <p className={styles.success} role="status">
                <span className={styles.successMark} aria-hidden="true">
                  ✓
                </span>
                {alreadyOnList ? t.alreadySubscribed : t.success}
              </p>
            ) : (
              <>
                <form
                  className={styles.form}
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <label className={styles.visuallyHidden} htmlFor="footer-email">
                    {t.emailLabel}
                  </label>
                  <input
                    id="footer-email"
                    name="email"
                    type="email"
                    required
                    disabled={busy}
                    onFocus={handleFocus}
                    onInput={handleInput}
                    placeholder={t.emailPlaceholder}
                    className={styles.input}
                  />
                  <button
                    type="submit"
                    className={styles.seal}
                    data-state={sealState}
                    disabled={busy}
                    aria-busy={busy}
                    aria-label={busy ? t.sendingAria : t.subscribeAria}
                  >
                    <span className={styles.sealRing} aria-hidden="true" />
                    <span className={styles.sealFace} aria-hidden="true">
                      <svg
                        className={`${styles.sealGlyph} ${styles.sealBookmark}`}
                        width="14"
                        height="17"
                        viewBox="0 0 20 24"
                        fill="none"
                      >
                        <path d={bookmarkPath} fill="currentColor" />
                      </svg>
                      <svg
                        className={`${styles.sealGlyph} ${styles.sealCheck}`}
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        {/* `pathLength` normalise le tracé : le dash vaut 1,
                            quelle que soit la longueur réelle du chemin. */}
                        <path
                          d="M5 12.5 10 17.5 19 7"
                          pathLength={1}
                          stroke="currentColor"
                          strokeWidth={2.75}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>
                </form>

                {errorKey ? (
                  <p className={styles.error} role="alert">
                    {errorCopy[errorKey]}
                  </p>
                ) : null}
              </>
            )}

            <p className={styles.microcopy}>{t.microcopy}</p>
          </div>
        </div>

        <div className={styles.rule} aria-hidden="true" />

        <nav className={styles.linksRow} aria-label={t.footerNavAria}>
          <div className={styles.linkColumns}>
            <div className={styles.linkGroup}>
              <span className={styles.linkGroupTitle}>{t.resources}</span>
              <a href={href("about", lang)}>{t.about}</a>
              <a href={href("blog", lang)}>{t.blog}</a>
              <a href={href("faq", lang)}>{t.faq}</a>
            </div>
            <div className={styles.linkGroup}>
              <span className={styles.linkGroupTitle}>{t.legal}</span>
              <a href={href("privacy", lang)}>{t.privacy}</a>
              <a href={href("cgu", lang)}>{t.terms}</a>
              <a href={href("notices", lang)}>{t.legalNotice}</a>
              <a href={href("cookies", lang)}>{t.cookies}</a>
            </div>
          </div>

          <div className={styles.socialGroup}>
            <span className={styles.linkGroupTitle}>{t.followUs}</span>
            <ul className={styles.social} aria-label={t.socialAria}>
              {SOCIAL_LINKS.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.socialLink}
                    aria-label={social.name}
                  >
                    {socialIcon(social.name, 16)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className={styles.rule} aria-hidden="true" />

        <div className={styles.bottom}>
          <span>{t.copyright}</span>
          {/* Seul point d'accès au thème sous 560px, où l'en-tête n'a plus la
              place de le porter. */}
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
