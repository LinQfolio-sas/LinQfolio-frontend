import type { Metadata } from "next";
import ConfidentialitePage from "@/components/ConfidentialitePage";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  alternates: { canonical: "/confidentialite" },
  title: "Politique de Confidentialité · LinQfolio",
  description:
    "La Politique de Confidentialité de LinQfolio : données collectées, finalités, cookies, durées de conservation et droits RGPD.",
  openGraph: {
    title: "Politique de Confidentialité · LinQfolio",
    description:
      "Ce que LinQfolio collecte, pourquoi, et comment exercer vos droits RGPD.",
    images: ["/linqfolio/LinQfolio_og.webp"],
  },
};

export default function Page() {
  return (
    <>
      <ConfidentialitePage />
      <Footer />
    </>
  );
}
