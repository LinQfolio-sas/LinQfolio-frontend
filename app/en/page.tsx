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

/* Same page as the French home, same components: every one of them already
   carries its English copy. Only the language and the address differ. */
export const metadata: Metadata = {
  alternates: alternates("home", "en"),
};

export default function Home() {
  return (
    <>
      <JsonLd
        nodes={[
          webPage("home", "en", {
            title: "Social network for readers and book swapping · LinQfolio",
            description:
              "Swap books with readers nearby, join a book club and discover your Reading DNA.",
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
