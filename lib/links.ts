/**
 * Source de vérité unique pour tous les liens sortants du site : stores,
 * réseaux sociaux, adresses de contact et références légales tierces.
 * Toute URL externe affichée quelque part dans l'interface part d'ici.
 */

export const STORE_LINKS = {
  appStore: "https://apps.apple.com/app/linqfolio/id6762664863",
  googlePlay: "https://play.google.com/store/apps/details?id=com.linqfolio.app",
} as const;

export type SocialName = "Instagram" | "TikTok" | "X" | "LinkedIn" | "Discord";

export const SOCIAL_LINKS: ReadonlyArray<{ name: SocialName; href: string }> = [
  { name: "Instagram", href: "https://www.instagram.com/linqfolio" },
  { name: "TikTok", href: "https://www.tiktok.com/@linqfolio" },
  { name: "X", href: "https://x.com/linqfolio" },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/linqfolio" },
  { name: "Discord", href: "https://discord.gg/9cQ9v8dQHC" },
];

export const CONTACT_EMAILS = {
  /** Support général : questions, signalements, réclamations. */
  support: "support@linqfolio.com",
  /** Délégué à la protection des données : droits RGPD. */
  dpo: "dpo@linqfolio.com",
} as const;

/** Références citées dans les pages légales. */
export const LEGAL_LINKS = {
  cnil: "https://www.cnil.fr",
  /** Plateforme européenne de règlement en ligne des litiges. */
  odr: "https://ec.europa.eu/consumers/odr",
  /** Hébergeur. */
  aws: "https://aws.amazon.com/fr/",
} as const;

export const SITE_URL = "https://linqfolio.com";
