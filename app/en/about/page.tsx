import type { Metadata } from "next";
import AboutPage from "@/components/AboutPage";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { breadcrumbs, webPage } from "@/lib/schema";
import { alternates } from "@/lib/seo";

const TITLE = "About";
const DESCRIPTION =
  "LinQfolio is built by a small French team who believe reading is better shared. Our mission, our values and the people behind the app.";

export const metadata: Metadata = {
  alternates: alternates("about", "en"),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: `${TITLE} · LinQfolio`, description: DESCRIPTION },
};

export default function Page() {
  return (
    <>
      <JsonLd
        nodes={[
          webPage("about", "en", { title: TITLE, description: DESCRIPTION }),
          breadcrumbs("en", [{ name: TITLE, path: "/en/about" }]),
        ]}
      />
      <AboutPage />
      <Footer />
    </>
  );
}
