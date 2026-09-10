import type { Lang } from "@/lib/i18n/LanguageContext";
import {
  CONTACT_EMAILS,
  SITE_URL,
  SOCIAL_LINKS,
  STORE_LINKS,
} from "@/lib/links";
import { absolute, href, postHref, type PageId } from "@/lib/seo";

/**
 * Données structurées du site.
 *
 * Tout se rattache à trois nœuds permanents — l'organisation, le site, et
 * l'application — que chaque page cite par `@id` au lieu de les redécrire.
 * C'est ce qui distingue un graphe d'une collection de balises : les moteurs
 * n'y voient pas dix pages qui parlent chacune d'un éditeur, mais un seul
 * éditeur qui publie dix pages.
 *
 * Rien ici n'est inventé. Pas de `aggregateRating` tant qu'on n'a pas de vraies
 * notes à déclarer, pas de `SearchAction` tant que le site n'a pas de
 * recherche adressable par URL : un balisage qui promet ce que la page ne
 * tient pas se retourne contre elle.
 */

type Node = Record<string, unknown>;

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const APPLICATION_ID = `${SITE_URL}/#app`;

const DESCRIPTIONS: Record<Lang, string> = {
  fr: "LinQfolio est l'application où les lecteurs partagent ce qu'ils lisent, échangent des livres près de chez eux et découvrent leur Reading DNA.",
  en: "LinQfolio is the app where readers share what they are reading, swap books nearby, and discover their Reading DNA.",
};

/**
 * L'organisation, décrite par ce qui l'identifie sans ambiguïté.
 *
 * Le nom seul ne suffit pas : cherché tel quel, « LinQfolio » ramène
 * aujourd'hui Linqto et Linfolio. Ce sont la raison sociale, l'adresse du
 * siège et le SIRET qui permettent de rattacher la marque à une personne
 * morale existante plutôt qu'à un mot qui ressemble à un autre.
 *
 * `sameAs` liste les comptes officiels, fiches des stores comprises : c'est
 * ce qui les fait reconnaître comme des expressions de la même entité au lieu
 * de pages sans lien entre elles.
 */
const ORGANIZATION: Node = {
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: "LinQfolio",
  legalName: "LINQFOLIO SAS",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/linqfolio/LinQFolio_Secondary_Logo_Violet_Large.png`,
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "142 rue de Rivoli",
    postalCode: "75001",
    addressLocality: "Paris",
    addressCountry: "FR",
  },
  identifier: {
    "@type": "PropertyValue",
    propertyID: "SIRET",
    value: "10262518300011",
  },
  sameAs: [
    ...SOCIAL_LINKS.map((social) => social.href),
    STORE_LINKS.appStore,
    STORE_LINKS.googlePlay,
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: CONTACT_EMAILS.support,
      availableLanguage: ["fr", "en"],
    },
    {
      "@type": "ContactPoint",
      contactType: "data protection officer",
      email: CONTACT_EMAILS.dpo,
      availableLanguage: ["fr", "en"],
    },
  ],
};

const WEBSITE: Node = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE_URL,
  name: "LinQfolio",
  publisher: { "@id": ORGANIZATION_ID },
  inLanguage: ["fr-FR", "en"],
};

const APPLICATION: Node = {
  "@type": "MobileApplication",
  "@id": APPLICATION_ID,
  name: "LinQfolio",
  applicationCategory: "SocialNetworkingApplication",
  operatingSystem: "iOS, Android",
  publisher: { "@id": ORGANIZATION_ID },
  installUrl: [STORE_LINKS.appStore, STORE_LINKS.googlePlay],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
  },
};

/** Les trois nœuds permanents, posés une fois par page. */
export function siteNodes(lang: Lang): Node[] {
  return [
    { ...ORGANIZATION, description: DESCRIPTIONS[lang] },
    WEBSITE,
    { ...APPLICATION, description: DESCRIPTIONS[lang] },
  ];
}

/** La page courante, rattachée au site qui la publie. */
export function webPage(
  page: PageId,
  lang: Lang,
  { title, description }: { title: string; description: string },
): Node {
  const url = absolute(href(page, lang));
  return {
    "@type": "WebPage",
    "@id": `${url}#page`,
    url,
    name: title,
    description,
    isPartOf: { "@id": WEBSITE_ID },
    inLanguage: lang === "fr" ? "fr-FR" : "en",
  };
}

/**
 * Fil d'Ariane.
 *
 * Il ne décrit pas la navigation affichée mais la hiérarchie : c'est ce que
 * Google affiche à la place de l'URL brute dans les résultats. Le premier
 * échelon est toujours l'accueil de la langue courante — un fil qui remonte
 * vers une page française depuis une page anglaise mélangerait les deux
 * arborescences.
 */
export function breadcrumbs(
  lang: Lang,
  trail: { name: string; path: string }[],
): Node {
  const home = {
    name: lang === "fr" ? "Accueil" : "Home",
    path: href("home", lang),
  };

  return {
    "@type": "BreadcrumbList",
    itemListElement: [home, ...trail].map((step, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: step.name,
      item: absolute(step.path),
    })),
  };
}

/**
 * Les questions fréquentes.
 *
 * Google a restreint l'affichage des résultats enrichis « FAQ » aux sites
 * institutionnels et de santé : ce balisage ne nous vaudra donc pas d'accordéon
 * dans les résultats. Il reste utile pour autre chose, et c'est la raison pour
 * laquelle il est là : une question-réponse balisée est une unité que les
 * moteurs conversationnels savent citer telle quelle.
 */
export function faqPage(
  page: PageId,
  lang: Lang,
  items: { question: string; answer: string }[],
): Node {
  const url = absolute(href(page, lang));
  return {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    inLanguage: lang === "fr" ? "fr-FR" : "en",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

type PostForSchema = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  words: number;
};

/** Un article du journal. */
export function blogPosting(post: PostForSchema, lang: Lang): Node {
  const url = absolute(postHref(post.slug, lang));
  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: url,
    url,
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    wordCount: post.words,
    inLanguage: lang === "fr" ? "fr-FR" : "en",
    // L'auteur est l'équipe, pas une personne nommée : le déclarer comme une
    // `Person` inventerait un individu que rien ne permet de vérifier.
    author: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
    image: `${SITE_URL}/linqfolio/LinQfolio_og.webp`,
  };
}

/** Le sommaire du journal, et l'ordre dans lequel il se lit. */
export function blogIndex(
  lang: Lang,
  posts: { slug: string; title: string }[],
): Node {
  const url = absolute(href("blog", lang));
  return {
    "@type": "Blog",
    "@id": `${url}#blog`,
    url,
    name: lang === "fr" ? "Le journal LinQfolio" : "The LinQfolio journal",
    publisher: { "@id": ORGANIZATION_ID },
    inLanguage: lang === "fr" ? "fr-FR" : "en",
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      "@id": `${absolute(postHref(post.slug, lang))}#article`,
      headline: post.title,
      url: absolute(postHref(post.slug, lang)),
    })),
  };
}

/** Assemble le graphe final. */
export function graph(nodes: Node[]): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": nodes,
  })
    // `<` échappé : le JSON est inséré tel quel dans le document.
    .replace(/</g, "\\u003c");
}
