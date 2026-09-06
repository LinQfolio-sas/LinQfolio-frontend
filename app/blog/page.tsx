import type { Metadata } from "next";
import BlogPage from "@/components/BlogPage";
import Footer from "@/components/Footer";
import { getPostGroups } from "@/lib/blog/posts";

export const metadata: Metadata = {
  alternates: { canonical: "/blog" },
  title: "Le journal · LinQfolio",
  description:
    "Notes de lecture, coulisses de l’app et conversations de lecteurs. Le journal de LinQfolio paraît une à deux fois par mois.",
  openGraph: {
    title: "Le journal · LinQfolio",
    description:
      "Notes de lecture, coulisses de l’app et conversations de lecteurs.",
    images: ["/linqfolio/LinQfolio_og.webp"],
  },
};

export default function Page() {
  const groups = getPostGroups();

  return (
    <>
      <BlogPage groups={groups} />
      <Footer />
    </>
  );
}
