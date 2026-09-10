import type { Metadata } from "next";
import MentionsPage from "@/components/MentionsPage";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { breadcrumbs, webPage } from "@/lib/schema";
import { alternates } from "@/lib/seo";

const TITLE = "Mentions Légales";
const DESCRIPTION =
  "Les Mentions Légales de LinQfolio : identification de l'éditeur, hébergement, propriété intellectuelle et contact.";

export const metadata: Metadata = {
  alternates: alternates("notices", "fr"),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: `${TITLE} · LinQfolio`,
    description:
      "Qui édite LinQfolio, qui héberge, et qui contacter en cas de besoin.",
  },
};

export default function Page() {
  return (
    <>
      <JsonLd
        nodes={[
          webPage("notices", "fr", { title: TITLE, description: DESCRIPTION }),
          breadcrumbs("fr", [{ name: TITLE, path: "/mentions-legales" }]),
        ]}
      />
      <MentionsPage />
      <Footer />
    </>
  );
}
