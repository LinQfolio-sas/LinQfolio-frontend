import type { Metadata } from "next";
import MentionsPage from "@/components/MentionsPage";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { breadcrumbs, webPage } from "@/lib/schema";
import { alternates } from "@/lib/seo";

const TITLE = "Legal Notice";
const DESCRIPTION =
  "LinQfolio's legal notice: publisher identification, hosting, intellectual property and contact details.";

export const metadata: Metadata = {
  alternates: alternates("notices", "en"),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: `${TITLE} · LinQfolio`, description: DESCRIPTION },
};

export default function Page() {
  return (
    <>
      <JsonLd
        nodes={[
          webPage("notices", "en", { title: TITLE, description: DESCRIPTION }),
          breadcrumbs("en", [{ name: TITLE, path: "/en/notices" }]),
        ]}
      />
      <MentionsPage />
      <Footer />
    </>
  );
}
