import type { MetadataRoute } from "next";
import { getPostGroups } from "@/lib/blog/posts";
import { pick } from "@/lib/blog/types";
import { SITE_URL } from "@/lib/links";

/**
 * Le plan du site, dérivé des mêmes sources que les pages elles-mêmes : les
 * routes statiques sont listées à la main parce qu'elles se comptent sur deux
 * mains, les articles viennent de `content/blog/`. Un article ajouté apparaît
 * donc ici sans qu'on ait rien à enregistrer.
 *
 * Pas de `changeFrequency` : Google l'ignore depuis des années, et une valeur
 * inventée ne fait qu'ajouter du bruit. `lastModified` est en revanche lu, à
 * condition d'être honnête — d'où la date de publication de l'article plutôt
 * qu'un `new Date()` qui prétendrait que tout a changé aujourd'hui.
 */

/** Priorité relative, à l'échelle du site seulement : elle ordonne nos pages
 *  entre elles, elle ne nous compare pas aux autres domaines. */
const STATIC_ROUTES: { path: string; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/a-propos", priority: 0.8 },
  { path: "/blog", priority: 0.8 },
  { path: "/faq", priority: 0.8 },
  { path: "/cgu", priority: 0.3 },
  { path: "/confidentialite", priority: 0.3 },
  { path: "/mentions-legales", priority: 0.3 },
  { path: "/cookies", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPostGroups().flatMap((group) => {
    const meta = pick(group, "fr");
    if (!meta) return [];

    return [
      {
        url: `${SITE_URL}/blog/${group.slug}`,
        lastModified: new Date(meta.date),
        priority: 0.6,
      },
    ];
  });

  const now = new Date();

  return [
    ...STATIC_ROUTES.map(({ path, priority }) => ({
      url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
      lastModified: now,
      priority,
    })),
    ...posts,
  ];
}
