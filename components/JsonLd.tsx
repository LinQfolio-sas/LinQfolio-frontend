import {
  CONTACT_EMAILS,
  SITE_URL,
  SOCIAL_LINKS,
  STORE_LINKS,
} from "@/lib/links";

/**
 * Données structurées du site. `sameAs` liste tous les profils officiels,
 * Discord compris : c'est ce qui permet aux moteurs de rattacher ces comptes
 * à l'organisation plutôt que de les traiter comme des pages sans lien.
 */
const ORGANIZATION = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "LinQfolio",
  url: SITE_URL,
  logo: `${SITE_URL}/linqfolio/LinQFolio_Secondary_Logo_Violet_Large.png`,
  sameAs: SOCIAL_LINKS.map((social) => social.href),
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

const APPLICATION = {
  "@type": "MobileApplication",
  "@id": `${SITE_URL}/#app`,
  name: "LinQfolio",
  applicationCategory: "SocialNetworkingApplication",
  operatingSystem: "iOS, Android",
  publisher: { "@id": ORGANIZATION["@id"] },
  installUrl: [STORE_LINKS.appStore, STORE_LINKS.googlePlay],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
  },
};

const GRAPH = {
  "@context": "https://schema.org",
  "@graph": [ORGANIZATION, APPLICATION],
};

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      // `<` échappé : le JSON est inséré tel quel dans le document.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(GRAPH).replace(/</g, "\\u003c"),
      }}
    />
  );
}
