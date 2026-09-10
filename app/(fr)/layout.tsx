import type { Metadata, Viewport } from "next";
import JsonLd from "@/components/JsonLd";
import SiteShell from "@/components/SiteShell";
import { siteNodes } from "@/lib/schema";
import { SITE_URL } from "@/lib/links";
import { SITE_VERIFICATION } from "@/lib/seo";
import "../globals.css";

/**
 * Racine française, servie à la racine du domaine.
 *
 * C'est l'un des deux layouts racine du site — l'autre est `app/en/layout.tsx`.
 * Chacun pose son propre `<html lang>` dans le HTML servi, ce qu'un layout
 * unique ne peut pas faire, et c'est toute la raison de cette scission. Passer
 * d'une langue à l'autre provoque un rechargement complet : c'est le
 * comportement documenté quand on franchit deux racines, et c'est sans
 * conséquence ici puisque la bascule est rare et volontaire.
 */

export const metadata: Metadata = {
  // Base absolue pour les images Open Graph, sinon Next retombe sur localhost.
  metadataBase: new URL(SITE_URL),

  /* Le titre porte la requête, le H1 porte la marque.
     « La lecture, enfin partagée » est la bonne phrase pour ouvrir la page ;
     ce n'est pas une phrase que quelqu'un tape dans Google. Le `<title>` est
     à la fois le signal de pertinence le plus lourd et la ligne bleue qu'on
     lit dans les résultats : c'est lui qui doit nommer ce qu'on cherche —
     échange de livres, réseau social de lecteurs — pendant que le H1 garde
     le ton du site. */
  title: {
    default: "Réseau social des lecteurs et échange de livres · LinQfolio",
    // Les pages n'ont plus à répéter la marque : elles donnent leur seul
    // titre et le gabarit l'ajoute, toujours de la même façon.
    template: "%s · LinQfolio",
  },
  description:
    "Échangez vos livres avec des lecteurs à proximité, rejoignez un club de lecture et découvrez votre Reading DNA. Le réseau social des lecteurs, sur iOS et Android.",
  applicationName: "LinQfolio",
  verification: { google: SITE_VERIFICATION },
  openGraph: {
    type: "website",
    siteName: "LinQfolio",
    locale: "fr_FR",
    alternateLocale: ["en"],
    images: ["/linqfolio/LinQfolio_og.webp"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/linqfolio/LinQfolio_og.webp"],
  },
};

/** Teinte la barre d'adresse mobile avec le fond de page du thème d'arrivée.
    Le sombre, qui demande un choix explicite, pose son propre `theme-color`
    depuis `syncThemeColorMeta`. */
export const viewport: Viewport = {
  themeColor: "#fffefc",
};

export default function FrenchRootLayout({ children }: LayoutProps<"/">) {
  return (
    <SiteShell lang="fr">
      <JsonLd nodes={siteNodes("fr")} />
      {children}
    </SiteShell>
  );
}
