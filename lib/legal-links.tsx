import type { ReactNode } from "react";
import { CONTACT_EMAILS, LEGAL_LINKS } from "./links";

/**
 * Les textes légaux sont stockés en chaînes brutes : ils citent des adresses
 * email et des sites tiers en clair. Plutôt que de dupliquer chaque paragraphe
 * en JSX, on transforme ces mentions en liens au rendu.
 */

type Rule = { pattern: string; href: string };

/**
 * Les motifs les plus longs passent en premier : « ec.europa.eu/consumers/odr »
 * doit gagner avant qu'un motif plus court ne morde dedans.
 */
const RULES: Rule[] = [
  { pattern: CONTACT_EMAILS.support, href: `mailto:${CONTACT_EMAILS.support}` },
  { pattern: CONTACT_EMAILS.dpo, href: `mailto:${CONTACT_EMAILS.dpo}` },
  { pattern: "ec.europa.eu/consumers/odr", href: LEGAL_LINKS.odr },
  { pattern: "aws.amazon.com", href: LEGAL_LINKS.aws },
  { pattern: "www.cnil.fr", href: LEGAL_LINKS.cnil },
].sort((a, b) => b.pattern.length - a.pattern.length);

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const MATCHER = new RegExp(
  `(${RULES.map((rule) => escapeRegExp(rule.pattern)).join("|")})`,
  "g",
);

/**
 * Rend un texte légal en remplaçant les adresses email et les références
 * tierces connues par des liens. Retourne la chaîne telle quelle si elle n'en
 * contient aucune, pour éviter d'emballer inutilement le texte.
 */
export function autolink(text: string): ReactNode {
  MATCHER.lastIndex = 0;
  if (!MATCHER.test(text)) return text;

  MATCHER.lastIndex = 0;
  const parts = text.split(MATCHER);

  return parts.map((part, index) => {
    const rule = RULES.find((candidate) => candidate.pattern === part);
    if (!rule) return part;

    const isEmail = rule.href.startsWith("mailto:");

    return (
      <a
        key={index}
        href={rule.href}
        className="legalLink"
        {...(isEmail ? {} : { target: "_blank", rel: "noreferrer" })}
      >
        {part}
      </a>
    );
  });
}
