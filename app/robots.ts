import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/links";

/**
 * Le site est entièrement public : rien à cacher aux robots, sauf les routes
 * d'API, qui ne renvoient pas de HTML et n'ont donc rien à faire dans l'index.
 *
 * `/bio` n'est pas interdite ici alors qu'elle ne doit pas être indexée. C'est
 * délibéré, et c'est le piège classique : une page bloquée par `robots.txt`
 * n'est jamais téléchargée, donc son `noindex` n'est jamais lu, et Google
 * finit par la lister quand même à partir des liens qui pointent vers elle.
 * Pour tenir une page hors de l'index, il faut la laisser accessible et lui
 * faire dire non — ce que fait son `robots: { index: false }`.
 *
 * Les assistants conversationnels sont nommés un par un plus bas. Sans ces
 * lignes ils passeraient de toute façon, la règle par défaut étant permissive :
 * elles ne changent pas le comportement des robots, elles rendent le choix
 * explicite et repérable le jour où l'on voudra en exclure un.
 */

/** Robots des assistants : réponses conversationnelles et entraînement. */
const ASSISTANT_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  // Réservés à l'IA de Google et d'Apple : distincts de Googlebot et
  // d'Applebot, qui font l'indexation classique et qu'on ne touche pas.
  "Google-Extended",
  "Applebot-Extended",
  "Meta-ExternalAgent",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/api/" },
      ...ASSISTANT_AGENTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: "/api/",
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
