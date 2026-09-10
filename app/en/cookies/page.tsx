import type { Metadata } from "next";
import CookiesPage from "@/components/CookiesPage";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { breadcrumbs, webPage } from "@/lib/schema";
import { alternates } from "@/lib/seo";

const TITLE = "Cookie Policy";
const DESCRIPTION =
  "LinQfolio's cookie policy: what the marketing site stores in your browser, what for, and for how long.";

export const metadata: Metadata = {
  alternates: alternates("cookies", "en"),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: `${TITLE} · LinQfolio`, description: DESCRIPTION },
};

export default function Page() {
  return (
    <>
      <JsonLd
        nodes={[
          webPage("cookies", "en", { title: TITLE, description: DESCRIPTION }),
          breadcrumbs("en", [{ name: TITLE, path: "/en/cookies" }]),
        ]}
      />
      <CookiesPage />
      <Footer />
    </>
  );
}
