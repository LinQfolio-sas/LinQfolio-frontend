import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostPage from "@/components/BlogPostPage";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import {
  getPostGroupByUrl,
  getPostGroupsIn,
  getSlugs,
} from "@/lib/blog/posts";
import { blogPosting, breadcrumbs } from "@/lib/schema";
import { postAlternates } from "@/lib/seo";

export function generateStaticParams() {
  return getSlugs("en").map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: PageProps<"/en/blog/[slug]">,
): Promise<Metadata> {
  const { slug } = await params;
  const group = getPostGroupByUrl(slug, "en");
  const post = group?.en;

  if (!post) return { title: "The journal" };

  return {
    alternates: postAlternates(
      { fr: group?.fr?.slug, en: group?.en?.slug },
      "en",
    ),
    title: `${post.title} · The journal`,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
    },
  };
}

export default async function Page({ params }: PageProps<"/en/blog/[slug]">) {
  const { slug } = await params;
  const group = getPostGroupByUrl(slug, "en");
  if (!group?.en) notFound();

  const current = group.en;

  const others = getPostGroupsIn("en").filter((other) => other.id !== group.id);
  const sameRubric = others.filter(
    (other) => other.en?.rubric === current.rubric,
  );
  const related = [
    ...sameRubric,
    ...others.filter((other) => !sameRubric.includes(other)),
  ].slice(0, 2);

  return (
    <>
      <JsonLd
        nodes={[
          blogPosting(current, "en"),
          breadcrumbs("en", [
            { name: "The journal", path: "/en/blog" },
            { name: current.title, path: `/en/blog/${current.slug}` },
          ]),
        ]}
      />
      <BlogPostPage group={group} related={related} />
      <Footer />
    </>
  );
}
