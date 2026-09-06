import type { Metadata } from "next";
import CookiesPage from "@/components/CookiesPage";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  alternates: { canonical: "/cookies" },
  title: "Politique Cookies · LinQfolio",
  description:
    "La politique cookies de LinQfolio : traceurs déposés sur le site marketing, finalités, durées de conservation et gestion du consentement.",
  openGraph: {
    title: "Politique Cookies · LinQfolio",
    description:
      "Ce que LinQfolio dépose sur votre navigateur, pourquoi, et pour combien de temps.",
    images: ["/linqfolio/LinQfolio_og.webp"],
  },
};

export default function Page() {
  return (
    <>
      <CookiesPage />
      <Footer />
    </>
  );
}
