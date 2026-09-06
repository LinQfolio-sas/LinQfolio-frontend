import type { RubricId } from "./types";

/**
 * A rubric is a binding: the cloth an article's book is bound in.
 * One flat colour each, taken straight from the palette -- no gradients,
 * and nothing invented.
 */
export type Rubric = {
  id: RubricId;
  /** Flat cover colour. */
  cover: string;
  /** A pale binding takes ink type instead of paper type. */
  tone?: "light";
  fr: string;
  en: string;
};

export const RUBRICS: Rubric[] = [
  {
    id: "lecture",
    cover: "var(--brand-violet)",
    fr: "Lecture",
    en: "Reading",
  },
  {
    // The one pale binding, so a shelf never reads as a single dark block.
    id: "communaute",
    cover: "var(--brand-glow)",
    tone: "light",
    fr: "Communauté",
    en: "Community",
  },
  {
    id: "coulisses",
    cover: "var(--brand-ink)",
    fr: "Coulisses",
    en: "Behind the app",
  },
  {
    id: "produit",
    cover: "var(--brand-violet-deep)",
    fr: "Produit",
    en: "Product",
  },
];

const BY_ID = new Map(RUBRICS.map((rubric) => [rubric.id, rubric]));

export function getRubric(id: RubricId): Rubric {
  return BY_ID.get(id) ?? RUBRICS[0];
}
