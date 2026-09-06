import type { Metadata } from "next";
import CguPage from "@/components/CguPage";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  alternates: { canonical: "/cgu" },
  title: "Conditions Générales d'Utilisation · LinQfolio",
  description:
    "Les Conditions Générales d'Utilisation de LinQfolio : accès au service, compte, contenus, propriété intellectuelle, données personnelles et droit applicable.",
  openGraph: {
    title: "Conditions Générales d'Utilisation · LinQfolio",
    description:
      "Les Conditions Générales d'Utilisation de LinQfolio, article par article.",
    images: ["/linqfolio/LinQfolio_og.webp"],
  },
};

export default function Page() {
  return (
    <>
      <CguPage />
      <Footer />
    </>
  );
}
