/**
 * Editorial blocks an author can drop into an article with `:::name`.
 *
 * Each one renders to plain HTML with `lqf-` class names, styled from
 * BlogPostPage.module.css through :global(). Colours come from palette
 * tokens only, so a block never carries a hex of its own.
 */

import type { Lang } from "@/lib/i18n/LanguageContext";

type Lines = string[];

/** Octave signs himself differently in each language. */
const OCTAVE_NAME: Record<Lang, string> = {
  fr: "Octave &middot; le hibou éditorialiste",
  en: "Octave &middot; the resident owl",
};

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Splits `key: value` lines, keeping repeated keys in order. */
function fields(lines: Lines): [string, string][] {
  const out: [string, string][] = [];
  for (const line of lines) {
    const at = line.indexOf(":");
    if (at === -1) continue;
    out.push([line.slice(0, at).trim(), line.slice(at + 1).trim()]);
  }
  return out;
}

const OWL = `<svg class="lqf-owl" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5.2 5 7.4 8.7M18.8 5l-2.2 3.7" stroke-linecap="round"/><path d="M12 20.8c-4.2 0-6.8-2.8-6.8-7 0-4 2.9-7 6.8-7s6.8 3 6.8 7c0 4.2-2.6 7-6.8 7Z"/><circle cx="9.5" cy="12.3" r="1.4"/><circle cx="14.5" cy="12.3" r="1.4"/><path d="M12 15.1v1.3" stroke-linecap="round"/></svg>`;

/** Octave's aside: the site's marginalia voice, in Caveat. */
export function renderOctave(
  lines: Lines,
  inline: (s: string) => string,
  lang: Lang,
): string {
  const body = lines
    .filter((line) => line.trim())
    .map((line) => `<p>${inline(line.trim())}</p>`)
    .join("");
  return `<aside class="lqf-octave">${OWL}<div class="lqf-octave-body"><p class="lqf-octave-name">${OCTAVE_NAME[lang]}</p>${body}</div></aside>`;
}

/* ---------- radar ---------- */

const TAU = Math.PI * 2;

type Point = { x: number; y: number };

function polygon(cx: number, cy: number, r: number, n: number, scale = 1): Point[] {
  return Array.from({ length: n }, (_, i) => {
    const angle = -TAU / 4 + (i * TAU) / n;
    return {
      x: cx + Math.cos(angle) * r * scale,
      y: cy + Math.sin(angle) * r * scale,
    };
  });
}

function path(points: Point[]): string {
  return (
    points.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ") +
    " Z"
  );
}

/** Catmull-Rom through the vertices: the profile reads as one organic shape. */
function smoothPath(points: Point[]): string {
  const n = points.length;
  const at = (i: number) => points[((i % n) + n) % n];
  let d = `M${at(0).x.toFixed(1)} ${at(0).y.toFixed(1)}`;
  for (let i = 0; i < n; i += 1) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C${c1.x.toFixed(1)} ${c1.y.toFixed(1)} ${c2.x.toFixed(1)} ${c2.y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return `${d} Z`;
}

/**
 * One reader, five dimensions -- a single series, so it takes one hue and
 * needs no legend. Every value is direct-labelled, which is why there is no
 * hover layer to retrieve: nothing is hidden behind the mark.
 */
export function renderRadar(lines: Lines, inline: (s: string) => string): string {
  const entries = fields(lines);
  const caption = entries.find(([k]) => k === "caption")?.[1];
  const dims = entries
    .filter(([k]) => k !== "caption")
    .map(([label, value]) => ({ label, value: Math.max(0, Math.min(100, Number(value) || 0)) }));

  if (dims.length < 3) return "";

  // Sized to the drawing: room for the outer labels, no dead band below.
  const W = 420;
  const H = 284;
  const cx = W / 2;
  const cy = 150;
  const R = 92;
  const n = dims.length;

  const rings = [0.25, 0.5, 0.75, 1]
    .map(
      (scale) =>
        `<path d="${path(polygon(cx, cy, R, n, scale))}" fill="none" stroke="var(--ink)" stroke-opacity="0.09" stroke-width="1"/>`,
    )
    .join("");

  const spokes = polygon(cx, cy, R, n)
    .map(
      (p) =>
        `<line x1="${cx}" y1="${cy}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}" stroke="var(--ink)" stroke-opacity="0.09" stroke-width="1"/>`,
    )
    .join("");

  const vertices = dims.map((dim, i) => {
    const angle = -TAU / 4 + (i * TAU) / n;
    const r = (R * dim.value) / 100;
    return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r, angle, ...dim };
  });

  const blob = `<path d="${smoothPath(vertices)}" fill="var(--violet)" fill-opacity="0.16" stroke="var(--violet)" stroke-width="2" stroke-linejoin="round"/>`;

  const dots = vertices
    .map(
      (v) =>
        `<circle cx="${v.x.toFixed(1)}" cy="${v.y.toFixed(1)}" r="4" fill="var(--violet)" stroke="var(--paper)" stroke-width="2"/>`,
    )
    .join("");

  const labels = vertices
    .map((v) => {
      const lx = cx + Math.cos(v.angle) * (R + 30);
      const ly = cy + Math.sin(v.angle) * (R + 30);
      const cos = Math.cos(v.angle);
      const anchor = cos > 0.25 ? "start" : cos < -0.25 ? "end" : "middle";
      const above = Math.sin(v.angle) < -0.4;
      const top = above ? ly - 14 : ly;
      return `<text x="${lx.toFixed(1)}" y="${top.toFixed(1)}" text-anchor="${anchor}"><tspan class="lqf-radar-name">${esc(v.label)}</tspan><tspan class="lqf-radar-value" x="${lx.toFixed(1)}" dy="17">${v.value} %</tspan></text>`;
    })
    .join("");

  const summary = dims.map((d) => `${d.label} ${d.value} %`).join(", ");

  return `<figure class="lqf-figure"><svg class="lqf-radar" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(summary)}">${rings}${spokes}${blob}${dots}${labels}</svg>${
    caption ? `<figcaption>${inline(caption)}</figcaption>` : ""
  }</figure>`;
}

/* ---------- stat row ---------- */

/**
 * `meter:` is a ratio against a limit, so it gets a track of the same ramp;
 * `tile:` is a plain label, never dressed up as a number.
 */
export function renderStats(lines: Lines, inline: (s: string) => string): string {
  const entries = fields(lines);
  const caption = entries.find(([k]) => k === "caption")?.[1];

  const tiles = entries
    .filter(([k]) => k === "meter" || k === "tile")
    .map(([kind, value]) => {
      const parts = value.split("|").map((s) => s.trim());
      if (kind === "meter") {
        const pct = Math.max(0, Math.min(100, Number(parts[0]) || 0));
        return `<div class="lqf-tile"><p class="lqf-meter-value">${pct} %</p><div class="lqf-meter-track"><div class="lqf-meter-fill" style="width:${pct}%"></div></div><p class="lqf-tile-label">${inline(parts[1] ?? "")}</p></div>`;
      }
      const mark = parts[2]
        ? `<span class="lqf-tile-mark" aria-hidden="true">${esc(parts[2])}</span>`
        : "";
      return `<div class="lqf-tile">${mark}<p class="lqf-tile-title">${inline(parts[0] ?? "")}</p><p class="lqf-tile-label">${inline(parts[1] ?? "")}</p></div>`;
    })
    .join("");

  return `<figure class="lqf-figure"><div class="lqf-tiles">${tiles}</div>${
    caption ? `<figcaption>${inline(caption)}</figcaption>` : ""
  }</figure>`;
}
