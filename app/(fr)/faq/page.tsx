import type { Metadata } from "next";
import FaqPage from "@/components/FaqPage";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { FAQ_ITEMS_FR } from "@/lib/faq-data";
import { breadcrumbs, faqPage, webPage } from "@/lib/schema";
import { alternates } from "@/lib/seo";

const TITLE = "Questions fréquentes";
const DESCRIPTION =
  "Recherchez une réponse par mot-clé, filtrez par thème (compte, bibliothèque, Reading DNA, communauté, confidentialité) ou contactez l'équipe LinQfolio directement.";

export const metadata: Metadata = {
  alternates: alternates("faq", "fr"),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: `${TITLE} · LinQfolio`,
    description:
      "Recherchez une réponse par mot-clé, filtrez par thème ou contactez l'équipe LinQfolio directement.",
  },
};

export default function Page() {
  return (
    <>
      {/* Les questions sont balisées une à une. C'est la page du site qui
          répond au plus grand nombre de formulations différentes : chaque
          couple question/réponse est une réponse toute faite qu'un moteur
          conversationnel peut citer sans avoir à la reformuler. */}
      <JsonLd
        nodes={[
          webPage("faq", "fr", { title: TITLE, description: DESCRIPTION }),
          faqPage("faq", "fr", FAQ_ITEMS_FR),
          breadcrumbs("fr", [{ name: TITLE, path: "/faq" }]),
        ]}
      />
      <FaqPage />
      <Footer />
    </>
  );
}
