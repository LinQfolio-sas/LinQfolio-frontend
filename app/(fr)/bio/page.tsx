import type { Metadata } from "next";
import LinksPage from "@/components/LinksPage";
import { alternates } from "@/lib/seo";

/**
 * L'adresse qu'on colle dans les bios de profil.
 *
 * `index: false` est délibéré. La page ne dit rien que l'accueil ne dise mieux :
 * elle ne contient que des liens sortants, et indexée elle entrerait en
 * concurrence avec lui sur le nom de la marque. `follow` reste vrai pour que
 * les liens comptent quand même. Elle est absente de `sitemap.ts` pour la même
 * raison : on n'y arrive pas par une recherche, mais par une bio.
 */
export const metadata: Metadata = {
  alternates: alternates("bio", "fr"),
  robots: { index: false, follow: true },
  title: "Tous nos liens",
  description:
    "L’application, le code à scanner et tous les comptes LinQfolio : Instagram, TikTok, Facebook, LinkedIn, Discord, le site et notre adresse email.",
  openGraph: {
    title: "Tous nos liens · LinQfolio",
    description:
      "L’application, le code à scanner et tous les comptes LinQfolio, au même endroit.",
    images: ["/linqfolio/LinQfolio_og.webp"],
  },
};

export default function Page() {
  return <LinksPage />;
}
