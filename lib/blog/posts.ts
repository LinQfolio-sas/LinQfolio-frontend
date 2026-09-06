import fs from "node:fs";
import path from "node:path";

import type { Lang } from "@/lib/i18n/LanguageContext";
import {
  countWords,
  readingMinutes,
  renderMarkdown,
  typographicText,
} from "./markdown";
import { parseFrontmatter } from "./frontmatter";
import { RUBRICS } from "./rubrics";
import type { Post, PostGroup, PostMeta, RubricId } from "./types";

/**
 * Reads the journal from `content/blog/`.
 *
 * One Markdown file is one article: `<slug>.<lang>.md`. Adding an article
 * means dropping a file in that folder -- nothing else to register.
 * Everything here runs on the server, at build time.
 */

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");
const FILENAME = /^(.+)\.(fr|en)\.md$/;
const RUBRIC_IDS = new Set<string>(RUBRICS.map((rubric) => rubric.id));

function readFiles(): { slug: string; lang: Lang; raw: string }[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  return fs
    .readdirSync(CONTENT_DIR)
    .map((name) => ({ name, match: FILENAME.exec(name) }))
    .filter((entry): entry is { name: string; match: RegExpExecArray } =>
      Boolean(entry.match),
    )
    .map(({ name, match }) => ({
      slug: match[1],
      lang: match[2] as Lang,
      raw: fs.readFileSync(path.join(CONTENT_DIR, name), "utf8"),
    }));
}

type Entry = { meta: PostMeta; html: string };

function toEntry(slug: string, lang: Lang, raw: string): Entry | null {
  const { data, body } = parseFrontmatter(raw);

  const title = typeof data.title === "string" ? typographicText(data.title) : "";
  const excerpt =
    typeof data.excerpt === "string" ? typographicText(data.excerpt) : "";
  const date = typeof data.date === "string" ? data.date : "";
  const author =
    typeof data.author === "string" ? typographicText(data.author) : "";
  const rubric =
    typeof data.rubric === "string" && RUBRIC_IDS.has(data.rubric)
      ? (data.rubric as RubricId)
      : "lecture";

  // An article without a title, a date or a body is a draft, not a post.
  if (!title || !date || !body) return null;

  const words = countWords(body);

  const meta: PostMeta = {
    slug,
    lang,
    title,
    excerpt,
    rubric,
    date,
    author,
    authorRole:
      typeof data.authorRole === "string"
        ? typographicText(data.authorRole)
        : undefined,
    featured: data.featured === true,
    note: typeof data.note === "string" ? typographicText(data.note) : undefined,
    words,
    readingMinutes:
      typeof data.minutes === "string" && Number(data.minutes) > 0
        ? Math.round(Number(data.minutes))
        : readingMinutes(words),
  };

  return { meta, html: renderMarkdown(body, lang) };
}

/** Newest first; ties broken by title so the order is stable across builds. */
function byDateDesc(a: { date: string; title: string }, b: { date: string; title: string }) {
  if (a.date !== b.date) return a.date < b.date ? 1 : -1;
  return a.title.localeCompare(b.title);
}

function loadGroups(): PostGroup<Entry>[] {
  const groups = new Map<string, PostGroup<Entry>>();

  for (const { slug, lang, raw } of readFiles()) {
    const entry = toEntry(slug, lang, raw);
    if (!entry) continue;
    const group = groups.get(slug) ?? { slug };
    group[lang] = entry;
    groups.set(slug, group);
  }

  return [...groups.values()].sort((a, b) => {
    const left = a.fr ?? a.en;
    const right = b.fr ?? b.en;
    if (!left || !right) return 0;
    return byDateDesc(left.meta, right.meta);
  });
}

/** Every article, newest first, without bodies. Safe to send to the client. */
export function getPostGroups(): PostGroup[] {
  return loadGroups().map((group) => ({
    slug: group.slug,
    fr: group.fr?.meta,
    en: group.en?.meta,
  }));
}

/** One article in every language it exists in, bodies included. */
export function getPostGroup(slug: string): PostGroup<Post> | undefined {
  const group = loadGroups().find((entry) => entry.slug === slug);
  if (!group) return undefined;
  return {
    slug: group.slug,
    fr: group.fr && { ...group.fr.meta, html: group.fr.html },
    en: group.en && { ...group.en.meta, html: group.en.html },
  };
}

export function getSlugs(): string[] {
  return loadGroups().map((group) => group.slug);
}
