import type { Metadata } from "next";
import CguPage from "@/components/CguPage";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { breadcrumbs, webPage } from "@/lib/schema";
import { alternates } from "@/lib/seo";

const TITLE = "Terms of Use";
const DESCRIPTION =
  "LinQfolio's Terms of Use: access to the service, accounts, content, intellectual property, personal data and governing law.";

export const metadata: Metadata = {
  alternates: alternates("cgu", "en"),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: `${TITLE} · LinQfolio`, description: DESCRIPTION },
};

export default function Page() {
  return (
    <>
      <JsonLd
        nodes={[
          webPage("cgu", "en", { title: TITLE, description: DESCRIPTION }),
          breadcrumbs("en", [{ name: TITLE, path: "/en/terms" }]),
        ]}
      />
      <CguPage />
      <Footer />
    </>
  );
}
