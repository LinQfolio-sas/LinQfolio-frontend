import type { Metadata } from "next";
import BlogPage from "@/components/BlogPage";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { getPostGroupsIn } from "@/lib/blog/posts";
import { blogIndex, breadcrumbs, webPage } from "@/lib/schema";
import { alternates } from "@/lib/seo";

const TITLE = "The journal";
const DESCRIPTION =
  "Reading notes, behind the scenes of the app, and conversations between readers. The LinQfolio journal comes out once or twice a month.";

export const metadata: Metadata = {
  alternates: alternates("blog", "en"),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: `${TITLE} · LinQfolio`, description: DESCRIPTION },
};

export default function Page() {
  // English articles only. An index that mixed the two languages would be a
  // bad page for its reader and an ambiguous document for a crawler.
  const groups = getPostGroupsIn("en");
  const posts = groups.flatMap((group) => (group.en ? [group.en] : []));

  return (
    <>
      <JsonLd
        nodes={[
          webPage("blog", "en", { title: TITLE, description: DESCRIPTION }),
          blogIndex("en", posts),
          breadcrumbs("en", [{ name: TITLE, path: "/en/blog" }]),
        ]}
      />
      <BlogPage groups={groups} />
      <Footer />
    </>
  );
}
