import type { Metadata } from "next";
import AboutPage from "@/components/AboutPage";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  alternates: { canonical: "/a-propos" },
  title: "À propos · LinQfolio",
  description:
    "LinQfolio est fait par une petite équipe française qui pense que la lecture se vit mieux à plusieurs. Notre mission, nos valeurs et l'équipe derrière l'app.",
  openGraph: {
    title: "À propos · LinQfolio",
    description:
      "LinQfolio est fait par une petite équipe française qui pense que la lecture se vit mieux à plusieurs.",
    images: ["/linqfolio/LinQfolio_og.webp"],
  },
};

export default function Page() {
  return (
    <>
      <AboutPage />
      <Footer />
    </>
  );
}
