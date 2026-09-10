import type { Metadata } from "next";
import BlogPage from "@/components/BlogPage";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { getPostGroupsIn } from "@/lib/blog/posts";
import { blogIndex, breadcrumbs, webPage } from "@/lib/schema";
import { alternates } from "@/lib/seo";

const TITLE = "Le journal";
const DESCRIPTION =
  "Notes de lecture, coulisses de l’app et conversations de lecteurs. Le journal de LinQfolio paraît une à deux fois par mois.";

export const metadata: Metadata = {
  alternates: alternates("blog", "fr"),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: `${TITLE} · LinQfolio`,
    description:
      "Notes de lecture, coulisses de l’app et conversations de lecteurs.",
  },
};

export default function Page() {
  const groups = getPostGroupsIn("fr");
  const posts = groups.flatMap((group) => (group.fr ? [group.fr] : []));

  return (
    <>
      <JsonLd
        nodes={[
          webPage("blog", "fr", { title: TITLE, description: DESCRIPTION }),
          blogIndex("fr", posts),
          breadcrumbs("fr", [{ name: TITLE, path: "/blog" }]),
        ]}
      />
      <BlogPage groups={groups} />
      <Footer />
    </>
  );
}
