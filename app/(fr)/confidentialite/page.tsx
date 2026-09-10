import type { Metadata } from "next";
import ConfidentialitePage from "@/components/ConfidentialitePage";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { breadcrumbs, webPage } from "@/lib/schema";
import { alternates } from "@/lib/seo";

const TITLE = "Politique de Confidentialité";
const DESCRIPTION =
  "La Politique de Confidentialité de LinQfolio : données collectées, finalités, cookies, durées de conservation et droits RGPD.";

export const metadata: Metadata = {
  alternates: alternates("privacy", "fr"),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: `${TITLE} · LinQfolio`,
    description:
      "Ce que LinQfolio collecte, pourquoi, et comment exercer vos droits RGPD.",
  },
};

export default function Page() {
  return (
    <>
      <JsonLd
        nodes={[
          webPage("privacy", "fr", { title: TITLE, description: DESCRIPTION }),
          breadcrumbs("fr", [{ name: TITLE, path: "/confidentialite" }]),
        ]}
      />
      <ConfidentialitePage />
      <Footer />
    </>
  );
}
