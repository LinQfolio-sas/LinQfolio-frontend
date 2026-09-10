/**
 * Source de vérité unique pour tous les liens sortants du site : stores,
 * réseaux sociaux, adresses de contact et références légales tierces.
 * Toute URL externe affichée quelque part dans l'interface part d'ici.
 */

export const STORE_LINKS = {
  appStore: "https://apps.apple.com/app/linqfolio/id6762664863",
  googlePlay: "https://play.google.com/store/apps/details?id=com.linqfolio.app",
} as const;

export type SocialName =
  | "Instagram"
  | "TikTok"
  | "Facebook"
  | "X"
  | "LinkedIn"
  | "Discord";

export const SOCIAL_LINKS: ReadonlyArray<{ name: SocialName; href: string }> = [
  { name: "Instagram", href: "https://www.instagram.com/linqfolio" },
  { name: "TikTok", href: "https://www.tiktok.com/@linqfolio" },
  { name: "Facebook", href: "https://www.facebook.com/linqfolio" },
  { name: "X", href: "https://x.com/linqfolio" },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/linqfolio" },
  { name: "Discord", href: "https://discord.gg/9cQ9v8dQHC" },
];

/**
 * Les mêmes liens, adressés par nom.
 *
 * Le tableau ci-dessus porte l'ordre d'affichage du pied de page ; cette table
 * sert aux endroits qui choisissent leurs réseaux un par un, comme la page de
 * liens. L'assertion de type est sûre parce que la source est le littéral
 * juste au-dessus : chaque `SocialName` y figure exactement une fois.
 */
export const SOCIAL_BY_NAME = Object.fromEntries(
  SOCIAL_LINKS.map((social) => [social.name, social.href]),
) as Record<SocialName, string>;

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
