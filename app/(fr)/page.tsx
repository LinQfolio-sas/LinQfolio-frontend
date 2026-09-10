import type { Metadata } from "next";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Why from "@/components/Why";
import Faq from "@/components/Faq";
import Cta from "@/components/Cta";
import PhoneFlight from "@/components/PhoneFlight";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { webPage } from "@/lib/schema";
import { alternates } from "@/lib/seo";

/* Le titre et la description viennent du layout : l'accueil EST la page que
   ces métadonnées décrivent. Seules les adresses doivent être posées ici,
   sinon toutes les variantes d'URL de la racine (paramètres UTM des QR codes,
   ancres) se présentent à Google comme autant de pages distinctes. */
export const metadata: Metadata = {
  alternates: alternates("home", "fr"),
};

export default function Home() {
  return (
    <>
      <JsonLd
        nodes={[
          webPage("home", "fr", {
            title: "Réseau social des lecteurs et échange de livres · LinQfolio",
            description:
              "Échangez vos livres avec des lecteurs à proximité, rejoignez un club de lecture et découvrez votre Reading DNA.",
          }),
        ]}
      />
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
