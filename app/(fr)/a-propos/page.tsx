import type { Metadata } from "next";
import AboutPage from "@/components/AboutPage";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { breadcrumbs, webPage } from "@/lib/schema";
import { alternates } from "@/lib/seo";

const TITLE = "À propos";
const DESCRIPTION =
  "LinQfolio est fait par une petite équipe française qui pense que la lecture se vit mieux à plusieurs. Notre mission, nos valeurs et l'équipe derrière l'app.";

export const metadata: Metadata = {
  alternates: alternates("about", "fr"),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: `${TITLE} · LinQfolio`,
    description:
      "LinQfolio est fait par une petite équipe française qui pense que la lecture se vit mieux à plusieurs.",
  },
};

export default function Page() {
  return (
    <>
      <JsonLd
        nodes={[
          webPage("about", "fr", { title: TITLE, description: DESCRIPTION }),
          breadcrumbs("fr", [{ name: TITLE, path: "/a-propos" }]),
        ]}
      />
      <AboutPage />
      <Footer />
    </>
  );
}
