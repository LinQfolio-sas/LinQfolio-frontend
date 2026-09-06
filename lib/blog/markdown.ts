import type { Lang } from "@/lib/i18n/LanguageContext";
import { renderOctave, renderRadar, renderStats } from "./blocks";

/**
 * Minimal Markdown renderer for `content/blog/*.md`.
 *
 * Supports what the journal actually uses: headings, paragraphs, bold,
 * italic, links, inline code, blockquotes, bullet and numbered lists,
 * images and horizontal rules. Input is escaped first, so an author can
 * type `<` in a sentence without breaking the page.
 */

/** U+202F, the thin no-break space French typography puts before ? ! ; : */
const NARROW_NBSP = "\u202F";
const CODE_TOKEN = "@@code";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * French spacing: a thin no-break space hugs guillemets and high punctuation,
 * and holds thousands together so "40 000" never breaks across two lines.
 */
function frenchSpacing(value: string): string {
  return value
    .replace(/(\p{L})'(\p{L})/gu, "$1\u2019$2")
    .replace(/«\s+/g, "«" + NARROW_NBSP)
    .replace(/\s+»/g, NARROW_NBSP + "»")
    .replace(/\s+([?!;:])/g, NARROW_NBSP + "$1")
    .replace(/(\d) (?=\d{3}(?!\d))/g, "$1" + NARROW_NBSP);
}

function inline(value: string): string {
  let out = escapeHtml(value);

  // Pull code spans aside first, so their contents are not re-formatted.
  const codeSpans: string[] = [];
  out = out.replace(/`([^`]+)`/g, (_match, code: string) => {
    codeSpans.push(code);
    return CODE_TOKEN + (codeSpans.length - 1) + CODE_TOKEN;
  });

  out = out
    .replace(
      /!\[([^\]]*)\]\(([^)\s]+)\)/g,
      '<img src="$2" alt="$1" loading="lazy" />',
    )
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, text: string, href: string) => {
      const external = /^https?:\/\//.test(href);
      const attrs = external ? ' target="_blank" rel="noreferrer"' : "";
      return `<a href="${href}"${attrs}>${text}</a>`;
    })
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>")
    .replace(/ -- /g, " — ");

  out = frenchSpacing(out);

  const tokenPattern = new RegExp(CODE_TOKEN + "(\\d+)" + CODE_TOKEN, "g");
  return out.replace(
    tokenPattern,
    (_match, index: string) =>
      `<code>${escapeHtml(codeSpans[Number(index)])}</code>`,
  );
}

const BLOCKS: Record<
  string,
  (lines: string[], inline: (value: string) => string, lang: Lang) => string
> = {
  octave: renderOctave,
  radar: renderRadar,
  stats: renderStats,
};

export function renderMarkdown(source: string, lang: Lang = "fr"): string {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let paragraph: string[] = [];
  let list: { type: "ul" | "ol"; items: string[] } | null = null;
  let quote: string[] = [];

  function flushParagraph() {
    if (!paragraph.length) return;
    html.push(`<p>${inline(paragraph.join(" "))}</p>`);
    paragraph = [];
  }

  function flushList() {
    if (!list) return;
    const items = list.items.map((item) => `<li>${inline(item)}</li>`).join("");
    html.push(`<${list.type}>${items}</${list.type}>`);
    list = null;
  }

  function flushQuote() {
    if (!quote.length) return;
    html.push(`<blockquote><p>${inline(quote.join(" "))}</p></blockquote>`);
    quote = [];
  }

  function flushAll() {
    flushParagraph();
    flushList();
    flushQuote();
  }

  for (let index = 0; index < lines.length; index += 1) {
    const trimmed = lines[index].trim();

    if (!trimmed) {
      flushAll();
      continue;
    }

    // Editorial block: `:::name` ... `:::`
    const open = /^:::([a-z]+)\s*$/.exec(trimmed);
    if (open) {
      flushAll();
      const inner: string[] = [];
      index += 1;
      while (index < lines.length && lines[index].trim() !== ":::") {
        inner.push(lines[index]);
        index += 1;
      }
      const block = BLOCKS[open[1]];
      if (block) html.push(block(inner, inline, lang));
      continue;
    }

    const heading = /^(#{2,4})\s+(.*)$/.exec(trimmed);
    if (heading) {
      flushAll();
      const level = heading[1].length;
      html.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      continue;
    }

    if (/^(---|\*\*\*|___)$/.test(trimmed)) {
      flushAll();
      html.push("<hr />");
      continue;
    }

    const blockquote = /^>\s?(.*)$/.exec(trimmed);
    if (blockquote) {
      flushParagraph();
      flushList();
      quote.push(blockquote[1]);
      continue;
    }

    const bullet = /^[-*+]\s+(.*)$/.exec(trimmed);
    if (bullet) {
      flushParagraph();
      flushQuote();
      if (list?.type !== "ul") {
        flushList();
        list = { type: "ul", items: [] };
      }
      list.items.push(bullet[1]);
      continue;
    }

    const numbered = /^\d+[.)]\s+(.*)$/.exec(trimmed);
    if (numbered) {
      flushParagraph();
      flushQuote();
      if (list?.type !== "ol") {
        flushList();
        list = { type: "ol", items: [] };
      }
      list.items.push(numbered[1]);
      continue;
    }

    flushList();
    flushQuote();
    paragraph.push(trimmed);
  }

  flushAll();
  return html.join("\n");
}

/**
 * The same typographic tidy-up as the body, for plain front matter strings
 * (titles, excerpts, the highlighted sentence). Produces text, never markup.
 */
export function typographicText(value: string): string {
  return frenchSpacing(value.replace(/ -- /g, " \u2014 "));
}

/** Words in the body, ignoring Markdown punctuation. */
export function countWords(source: string): number {
  const plain = source
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/^:::[a-z]+[\s\S]*?^:::$/gm, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~|]/g, " ");
  const matches = plain.match(/[\p{L}\p{N}’'-]+/gu);
  return matches ? matches.length : 0;
}

export function readingMinutes(words: number): number {
  // Rounded up: a reader never finishes a piece early.
  return Math.max(1, Math.ceil(words / 200));
}
