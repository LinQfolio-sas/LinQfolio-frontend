import type { Metadata } from "next";
import FaqPage from "@/components/FaqPage";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  alternates: { canonical: "/faq" },
  title: "Questions fréquentes · LinQfolio",
  description:
    "Recherchez une réponse par mot-clé, filtrez par thème (compte, bibliothèque, Reading DNA, communauté, confidentialité) ou contactez l'équipe LinQfolio directement.",
  openGraph: {
    title: "Questions fréquentes · LinQfolio",
    description:
      "Recherchez une réponse par mot-clé, filtrez par thème ou contactez l'équipe LinQfolio directement.",
    images: ["/linqfolio/LinQfolio_og.webp"],
  },
};

export default function Page() {
  return (
    <>
      <FaqPage />
      <Footer />
    </>
  );
}
