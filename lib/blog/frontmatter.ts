/**
 * Minimal front matter reader for `content/blog/*.md`.
 *
 * Deliberately small: the content is written in this repo, so it only needs
 * the shapes an author actually types — `key: value`, quoted or bare, plus
 * booleans and inline `[a, b]` lists.
 */

type Parsed = {
  data: Record<string, string | boolean | string[]>;
  body: string;
};

const FENCE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

function unquote(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function coerce(value: string): string | boolean | string[] {
  const trimmed = value.trim();
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    const inner = trimmed.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(",").map(unquote);
  }
  return unquote(trimmed);
}

export function parseFrontmatter(raw: string): Parsed {
  const source = raw.replace(/^﻿/, "");
  const match = FENCE.exec(source);
  if (!match) return { data: {}, body: source.trim() };

  const data: Parsed["data"] = {};
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const separator = line.indexOf(":");
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    if (!key) continue;
    data[key] = coerce(line.slice(separator + 1));
  }

  return { data, body: source.slice(match[0].length).trim() };
}
