import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Why from "@/components/Why";
import Faq from "@/components/Faq";
import Cta from "@/components/Cta";
import PhoneFlight from "@/components/PhoneFlight";
import Footer from "@/components/Footer";

/* Le titre et la description viennent du layout : l'accueil EST la page que
   ces métadonnées décrivent. Seule la canonique doit être posée ici, sinon
   toutes les variantes d'URL de la racine (paramètres UTM des QR codes,
   ancres) se présentent à Google comme autant de pages distinctes. */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Why />
      <Faq />
      <Cta />
      <PhoneFlight />
      <Footer />
    </>
  );
}
