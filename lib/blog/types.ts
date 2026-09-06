import type { Lang } from "@/lib/i18n/LanguageContext";

export type RubricId = "lecture" | "communaute" | "coulisses" | "produit";

/** Front matter an author writes at the top of a `.md` file. */
export type PostFrontmatter = {
  title: string;
  excerpt: string;
  rubric: RubricId;
  date: string; // ISO, e.g. 2026-08-28
  author: string;
  authorRole?: string;
  featured?: boolean;
  /** Overrides the computed reading time when an editor states one. */
  minutes?: number;
  /** Featured only: the marginalia note pinned beside the book. */
  note?: string;
};

/** Everything the index needs. Serializable: crosses the server → client boundary. */
export type PostMeta = PostFrontmatter & {
  slug: string;
  lang: Lang;
  /** Minutes, computed from the body at 200 words per minute. */
  readingMinutes: number;
  words: number;
};

/** A post plus its rendered body. Used by the article page. */
export type Post = PostMeta & {
  html: string;
};

/** The same article in every language it exists in. */
export type PostGroup<T = PostMeta> = {
  slug: string;
  fr?: T;
  en?: T;
};

/** Picks the requested language, falling back to whatever exists. */
export function pick<T>(group: PostGroup<T>, lang: Lang): T | undefined {
  return group[lang] ?? group.fr ?? group.en;
}
