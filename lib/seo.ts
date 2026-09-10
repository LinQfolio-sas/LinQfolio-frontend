import type { Lang } from "@/lib/i18n/LanguageContext";
import { SITE_URL } from "@/lib/links";

/**
 * Table des routes du site, dans les deux langues.
 *
 * C'est la source unique dont dérivent le plan du site, les liens `hreflang`,
 * les fils d'Ariane et les liens internes des composants. Ajouter une page,
 * c'est ajouter une ligne ici : le reste suit tout seul.
 *
 * Le français vit à la racine et l'anglais sous `/en`. Ce n'est pas une
 * symétrie manquée mais un choix : le marché principal est francophone, et
 * une page d'accueil à `/` concentre l'autorité du domaine là où elle sert,
 * au lieu de la dépenser dans une redirection vers `/fr`.
 */

export type PageId =
  | "home"
  | "about"
  | "faq"
  | "blog"
  | "cgu"
  | "privacy"
  | "cookies"
  | "notices"
  | "bio";

type Route = {
  /** Chemin français, à la racine. */
  fr: string;
  /** Chemin anglais, sous `/en`. `null` quand la page n'existe qu'en français. */
  en: string | null;
  /** Priorité relative, à l'échelle du site seulement : elle ordonne nos pages
   *  entre elles, elle ne nous compare pas aux autres domaines. */
  priority: number;
  /** Fausse pour les pages volontairement hors index, comme `/bio`. */
  indexed: boolean;
};

export const ROUTES: Record<PageId, Route> = {
  home: { fr: "/", en: "/en", priority: 1, indexed: true },
  about: { fr: "/a-propos", en: "/en/about", priority: 0.8, indexed: true },
  faq: { fr: "/faq", en: "/en/faq", priority: 0.8, indexed: true },
  blog: { fr: "/blog", en: "/en/blog", priority: 0.8, indexed: true },
  cgu: { fr: "/cgu", en: "/en/terms", priority: 0.3, indexed: true },
  privacy: {
    fr: "/confidentialite",
    en: "/en/privacy",
    priority: 0.3,
    indexed: true,
  },
  cookies: { fr: "/cookies", en: "/en/cookies", priority: 0.3, indexed: true },
  notices: {
    fr: "/mentions-legales",
    en: "/en/notices",
    priority: 0.3,
    indexed: true,
  },
  // Adresse qu'on colle dans les bios de profil : on y arrive par une bio,
  // jamais par une recherche. Voir `app/(fr)/bio/page.tsx`.
  bio: { fr: "/bio", en: null, priority: 0, indexed: false },
};

/** Chemin d'une page dans une langue, en retombant sur le français. */
export function href(page: PageId, lang: Lang = "fr"): string {
  const route = ROUTES[page];
  return (lang === "en" ? route.en : route.fr) ?? route.fr;
}

/** Chemin d'un article. Le `slug` est celui de la langue demandée. */
export function postHref(slug: string, lang: Lang = "fr"): string {
  return `${href("blog", lang)}/${slug}`;
}

/** Passe un chemin en URL absolue. Les données structurées et les `hreflang`
 *  n'acceptent rien d'autre. */
export function absolute(path: string): string {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

type Alternates = {
  canonical: string;
  languages?: Record<string, string>;
};

/**
 * Bloc `alternates` d'une page, canonique et `hreflang` compris.
 *
 * La réciprocité est la seule règle que Google applique sans indulgence : si
 * la page anglaise ne renvoie pas vers la française, l'ensemble est ignoré.
 * Elle est acquise ici par construction, les deux langues lisant la même
 * ligne de `ROUTES`.
 *
 * `x-default` désigne le français : c'est la langue d'origine du produit, donc
 * celle qu'on sert à un visiteur dont on ne sait rien.
 */
export function alternates(page: PageId, lang: Lang = "fr"): Alternates {
  const route = ROUTES[page];
  const canonical = href(page, lang);

  if (!route.en) return { canonical };

  return {
    canonical,
    languages: {
      fr: route.fr,
      en: route.en,
      "x-default": route.fr,
    },
  };
}

/** La même chose pour un article, dont les slugs diffèrent d'une langue à
 *  l'autre : `comment-fonctionne-le-reading-dna` d'un côté,
 *  `how-the-reading-dna-works` de l'autre. */
export function postAlternates(
  slugs: { fr?: string; en?: string },
  lang: Lang,
): Alternates {
  const current = slugs[lang] ?? slugs.fr ?? slugs.en;
  const canonical = postHref(current ?? "", lang);

  const languages: Record<string, string> = {};
  if (slugs.fr) languages.fr = postHref(slugs.fr, "fr");
  if (slugs.en) languages.en = postHref(slugs.en, "en");

  // Un article qui n'existe que dans une langue n'a pas d'alternative à
  // déclarer : un `hreflang` qui ne pointe que vers lui-même est du bruit, et
  // un `x-default` isolé en est encore. Le compte se fait donc avant d'ajouter
  // ce dernier, qui n'est pas une langue mais un repli.
  if (Object.keys(languages).length < 2) return { canonical };

  // Sans version française, l'anglais fait office de défaut : mieux vaut une
  // page servie dans la mauvaise langue qu'aucune page du tout.
  languages["x-default"] = languages.fr ?? languages.en;

  return { canonical, languages };
}

/**
 * Jeton de vérification Search Console, si l'on passe par la balise `<meta>`.
 *
 * La vérification par enregistrement DNS `TXT` est préférable et rend cette
 * variable inutile : elle couvre le domaine entier — sous-domaines, `http` et
 * `https` compris — et survit à une refonte, alors qu'une balise disparaît
 * avec le gabarit qui la portait. Elle demande en revanche un accès à la zone
 * DNS ; la balise est là pour le cas où on ne l'a pas.
 *
 * Absente, aucune balise n'est posée : une propriété non vérifiée ne se
 * répare pas en publiant un jeton vide.
 */
export const SITE_VERIFICATION = process.env.GOOGLE_SITE_VERIFICATION || undefined;
