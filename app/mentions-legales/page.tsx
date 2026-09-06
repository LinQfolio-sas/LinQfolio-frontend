import type { Metadata } from "next";
import MentionsPage from "@/components/MentionsPage";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  alternates: { canonical: "/mentions-legales" },
  title: "Mentions Légales · LinQfolio",
  description:
    "Les Mentions Légales de LinQfolio : identification de l'éditeur, hébergement, propriété intellectuelle et contact.",
  openGraph: {
    title: "Mentions Légales · LinQfolio",
    description:
      "Qui édite LinQfolio, qui héberge, et qui contacter en cas de besoin.",
    images: ["/linqfolio/LinQfolio_og.webp"],
  },
};

export default function Page() {
  return (
    <>
      <MentionsPage />
      <Footer />
    </>
  );
}
