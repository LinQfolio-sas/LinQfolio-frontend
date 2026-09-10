import type { Metadata } from "next";
import ConfidentialitePage from "@/components/ConfidentialitePage";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { breadcrumbs, webPage } from "@/lib/schema";
import { alternates } from "@/lib/seo";

const TITLE = "Privacy Policy";
const DESCRIPTION =
  "LinQfolio's Privacy Policy: what we collect, why, cookies, retention periods and your GDPR rights.";

export const metadata: Metadata = {
  alternates: alternates("privacy", "en"),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: `${TITLE} · LinQfolio`, description: DESCRIPTION },
};

export default function Page() {
  return (
    <>
      <JsonLd
        nodes={[
          webPage("privacy", "en", { title: TITLE, description: DESCRIPTION }),
          breadcrumbs("en", [{ name: TITLE, path: "/en/privacy" }]),
        ]}
      />
      <ConfidentialitePage />
      <Footer />
    </>
  );
}
