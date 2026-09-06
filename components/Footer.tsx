"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import ThemeToggle from "./ThemeToggle";
import { useLanguage, useT } from "@/lib/i18n/LanguageContext";
import { elapsedSeconds, track } from "@/lib/analytics/track";
import { sendAudience } from "@/lib/audience/beacon";
import { SOCIAL_LINKS, type SocialName } from "@/lib/links";
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
    journal: "Journal",
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
    journal: "Journal",
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

const SOCIAL_ICONS: Record<SocialName, ReactNode> = {
  Instagram: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793 0 1.44.645 1.44 1.439z" />
    </svg>
  ),
  TikTok: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  ),
  X: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  LinkedIn: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  Discord: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
    </svg>
  ),
};

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
            <a href="/" className={styles.brand}>
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
              <a href="/a-propos">{t.about}</a>
              <a href="/blog">{t.journal}</a>
              <a href="/faq">{t.faq}</a>
            </div>
            <div className={styles.linkGroup}>
              <span className={styles.linkGroupTitle}>{t.legal}</span>
              <a href="/confidentialite">{t.privacy}</a>
              <a href="/cgu">{t.terms}</a>
              <a href="/mentions-legales">{t.legalNotice}</a>
              <a href="/cookies">{t.cookies}</a>
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
                    {SOCIAL_ICONS[social.name]}
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
