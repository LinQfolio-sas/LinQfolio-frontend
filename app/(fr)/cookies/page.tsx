import type { Metadata } from "next";
import CookiesPage from "@/components/CookiesPage";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { breadcrumbs, webPage } from "@/lib/schema";
import { alternates } from "@/lib/seo";

const TITLE = "Politique Cookies";
const DESCRIPTION =
  "La politique cookies de LinQfolio : traceurs déposés sur le site marketing, finalités, durées de conservation et gestion du consentement.";

export const metadata: Metadata = {
  alternates: alternates("cookies", "fr"),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: `${TITLE} · LinQfolio`,
    description:
      "Ce que LinQfolio dépose sur votre navigateur, pourquoi, et pour combien de temps.",
  },
};

export default function Page() {
  return (
    <>
      <JsonLd
        nodes={[
          webPage("cookies", "fr", { title: TITLE, description: DESCRIPTION }),
          breadcrumbs("fr", [{ name: TITLE, path: "/cookies" }]),
        ]}
      />
      <CookiesPage />
      <Footer />
    </>
  );
}
