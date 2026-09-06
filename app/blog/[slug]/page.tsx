import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostPage from "@/components/BlogPostPage";
import Footer from "@/components/Footer";
import { getPostGroup, getPostGroups, getSlugs } from "@/lib/blog/posts";
import { pick } from "@/lib/blog/types";

export function generateStaticParams() {
  return getSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: PageProps<"/blog/[slug]">,
): Promise<Metadata> {
  const { slug } = await params;
  const group = getPostGroup(slug);
  const post = group && pick(group, "fr");

  if (!post) return { title: "Le journal · LinQfolio" };

  return {
    alternates: { canonical: `/blog/${slug}` },
    title: `${post.title} · Le journal LinQfolio`,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      images: ["/linqfolio/LinQfolio_og.webp"],
    },
  };
}

export default async function Page({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const group = getPostGroup(slug);
  if (!group) notFound();

  const current = pick(group, "fr");

  // Two neighbours: same rubric first, then the rest of the journal.
  const others = getPostGroups().filter((other) => other.slug !== slug);
  const sameRubric = others.filter(
    (other) => pick(other, "fr")?.rubric === current?.rubric,
  );
  const related = [
    ...sameRubric,
    ...others.filter((other) => !sameRubric.includes(other)),
  ].slice(0, 2);

  return (
    <>
      <BlogPostPage group={group} related={related} />
      <Footer />
    </>
  );
}
