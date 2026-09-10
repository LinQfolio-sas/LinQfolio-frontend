import type { Metadata } from "next";
import FaqPage from "@/components/FaqPage";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { FAQ_ITEMS_EN } from "@/lib/faq-data";
import { breadcrumbs, faqPage, webPage } from "@/lib/schema";
import { alternates } from "@/lib/seo";

const TITLE = "Frequently asked questions";
const DESCRIPTION =
  "Search answers by keyword, filter by topic (account, library, Reading DNA, community, privacy) or contact the LinQfolio team directly.";

export const metadata: Metadata = {
  alternates: alternates("faq", "en"),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: `${TITLE} · LinQfolio`, description: DESCRIPTION },
};

export default function Page() {
  return (
    <>
      <JsonLd
        nodes={[
          webPage("faq", "en", { title: TITLE, description: DESCRIPTION }),
          faqPage("faq", "en", FAQ_ITEMS_EN),
          breadcrumbs("en", [{ name: TITLE, path: "/en/faq" }]),
        ]}
      />
      <FaqPage />
      <Footer />
    </>
  );
}
