import type { MetadataRoute } from "next";
import { getPostGroups } from "@/lib/blog/posts";
import { absolute, postHref, ROUTES, type PageId } from "@/lib/seo";

/**
 * Le plan du site, dérivé des mêmes sources que les pages elles-mêmes : les
 * routes statiques viennent de `ROUTES`, les articles de `content/blog/`. Un
 * article ajouté, une page ajoutée, et ils apparaissent ici sans qu'on ait
 * rien à enregistrer.
 *
 * Chaque entrée porte ses `alternates.languages`, que Next traduit en balises
 * `xhtml:link`. C'est la deuxième déclaration des `hreflang`, après celle du
 * `<head>` — Google accepte les deux et se contente d'une, mais le plan du
 * site est le seul endroit où il découvre la paire avant d'avoir visité les
 * deux pages.
 *
 * Pas de `changeFrequency` : Google l'ignore depuis des années, et une valeur
 * inventée ne fait qu'ajouter du bruit. `lastModified` est en revanche lu, à
 * condition d'être honnête — d'où la date de publication de l'article plutôt
 * qu'un `new Date()` qui prétendrait que tout a changé aujourd'hui.
 */

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages = (Object.keys(ROUTES) as PageId[]).flatMap((id) => {
    const route = ROUTES[id];
    // `/bio` se tient volontairement hors de l'index : la lister ici
    // contredirait son propre `noindex`.
    if (!route.indexed) return [];

    const languages = route.en
      ? { fr: absolute(route.fr), en: absolute(route.en) }
      : undefined;

    return [route.fr, route.en]
      .filter((path): path is string => Boolean(path))
      .map((path) => ({
        url: absolute(path),
        lastModified: now,
        priority: route.priority,
        ...(languages ? { alternates: { languages } } : {}),
      }));
  });

  const posts = getPostGroups().flatMap((group) => {
    const languages: Record<string, string> = {};
    if (group.fr) languages.fr = absolute(postHref(group.fr.slug, "fr"));
    if (group.en) languages.en = absolute(postHref(group.en.slug, "en"));
    const paired = Object.keys(languages).length > 1;

    return (["fr", "en"] as const).flatMap((lang) => {
      const meta = group[lang];
      if (!meta) return [];

      return [
        {
          url: absolute(postHref(meta.slug, lang)),
          lastModified: new Date(meta.date),
          priority: 0.6,
          ...(paired ? { alternates: { languages } } : {}),
        },
      ];
    });
  });

  return [...pages, ...posts];
}
