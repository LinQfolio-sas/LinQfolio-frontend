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
 *
 * The file name identifies the article; it is not necessarily its address.
 * A translation may declare its own `slug` in the front matter, so that
 * `comment-fonctionne-le-reading-dna.en.md` is served at
 * `/en/blog/how-the-reading-dna-works` rather than at the French slug.
 */

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");
const FILENAME = /^(.+)\.(fr|en)\.md$/;
const RUBRIC_IDS = new Set<string>(RUBRICS.map((rubric) => rubric.id));

function readFiles(): { id: string; lang: Lang; raw: string }[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  return fs
    .readdirSync(CONTENT_DIR)
    .map((name) => ({ name, match: FILENAME.exec(name) }))
    .filter((entry): entry is { name: string; match: RegExpExecArray } =>
      Boolean(entry.match),
    )
    .map(({ name, match }) => ({
      id: match[1],
      lang: match[2] as Lang,
      raw: fs.readFileSync(path.join(CONTENT_DIR, name), "utf8"),
    }));
}

type Entry = { meta: PostMeta; html: string };

function toEntry(id: string, lang: Lang, raw: string): Entry | null {
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
    id,
    // The front matter wins, the file name is the default.
    slug: typeof data.slug === "string" && data.slug ? data.slug : id,
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

  for (const { id, lang, raw } of readFiles()) {
    const entry = toEntry(id, lang, raw);
    if (!entry) continue;
    const group = groups.get(id) ?? { id };
    group[lang] = entry;
    groups.set(id, group);
  }

  return [...groups.values()].sort((a, b) => {
    const left = a.fr ?? a.en;
    const right = b.fr ?? b.en;
    if (!left || !right) return 0;
    return byDateDesc(left.meta, right.meta);
  });
}

function strip(group: PostGroup<Entry>): PostGroup {
  return { id: group.id, fr: group.fr?.meta, en: group.en?.meta };
}

/** Every article, newest first, without bodies. Safe to send to the client. */
export function getPostGroups(): PostGroup[] {
  return loadGroups().map(strip);
}

/**
 * The articles that exist in a given language, newest first.
 *
 * The index of one language must never list the articles of the other: an
 * English reader landing on a French title is a bad page, and a search engine
 * reading it there is a mixed-language document, which it will rank for
 * neither language cleanly.
 */
export function getPostGroupsIn(lang: Lang): PostGroup[] {
  return loadGroups()
    .filter((group) => group[lang])
    .map(strip);
}

/** One article in every language it exists in, bodies included. */
export function getPostGroup(id: string): PostGroup<Post> | undefined {
  const group = loadGroups().find((entry) => entry.id === id);
  if (!group) return undefined;
  return {
    id: group.id,
    fr: group.fr && { ...group.fr.meta, html: group.fr.html },
    en: group.en && { ...group.en.meta, html: group.en.html },
  };
}

/** The article served at `/blog/<slug>` (or `/en/blog/<slug>`), by address. */
export function getPostGroupByUrl(
  slug: string,
  lang: Lang,
): PostGroup<Post> | undefined {
  const group = loadGroups().find((entry) => entry[lang]?.meta.slug === slug);
  return group && getPostGroup(group.id);
}

/** The URL segments to prerender for one language. */
export function getSlugs(lang: Lang): string[] {
  return loadGroups().flatMap((group) =>
    group[lang] ? [group[lang]!.meta.slug] : [],
  );
}
