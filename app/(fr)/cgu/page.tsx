import type { Metadata } from "next";
import CguPage from "@/components/CguPage";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { breadcrumbs, webPage } from "@/lib/schema";
import { alternates } from "@/lib/seo";

const TITLE = "Conditions Générales d'Utilisation";
const DESCRIPTION =
  "Les Conditions Générales d'Utilisation de LinQfolio : accès au service, compte, contenus, propriété intellectuelle, données personnelles et droit applicable.";

export const metadata: Metadata = {
  alternates: alternates("cgu", "fr"),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: `${TITLE} · LinQfolio`,
    description:
      "Les Conditions Générales d'Utilisation de LinQfolio, article par article.",
  },
};

export default function Page() {
  return (
    <>
      <JsonLd
        nodes={[
          webPage("cgu", "fr", { title: TITLE, description: DESCRIPTION }),
          breadcrumbs("fr", [{ name: TITLE, path: "/cgu" }]),
        ]}
      />
      <CguPage />
      <Footer />
    </>
  );
}
