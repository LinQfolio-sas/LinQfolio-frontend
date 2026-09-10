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
  return getSlugs("fr").map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: PageProps<"/blog/[slug]">,
): Promise<Metadata> {
  const { slug } = await params;
  const group = getPostGroupByUrl(slug, "fr");
  const post = group?.fr;

  if (!post) return { title: "Le journal" };

  return {
    // Les deux langues d'un même article se déclarent l'une l'autre, chacune
    // sous son propre slug. Sans cette réciprocité, Google ignore la paire
    // entière et traite les deux versions comme des pages sans rapport.
    alternates: postAlternates(
      { fr: group?.fr?.slug, en: group?.en?.slug },
      "fr",
    ),
    title: `${post.title} · Le journal`,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
    },
  };
}

export default async function Page({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const group = getPostGroupByUrl(slug, "fr");
  if (!group?.fr) notFound();

  const current = group.fr;

  // Two neighbours: same rubric first, then the rest of the journal.
  const others = getPostGroupsIn("fr").filter((other) => other.id !== group.id);
  const sameRubric = others.filter(
    (other) => other.fr?.rubric === current.rubric,
  );
  const related = [
    ...sameRubric,
    ...others.filter((other) => !sameRubric.includes(other)),
  ].slice(0, 2);

  return (
    <>
      <JsonLd
        nodes={[
          blogPosting(current, "fr"),
          breadcrumbs("fr", [
            { name: "Le journal", path: "/blog" },
            { name: current.title, path: `/blog/${current.slug}` },
          ]),
        ]}
      />
      <BlogPostPage group={group} related={related} />
      <Footer />
    </>
  );
}
