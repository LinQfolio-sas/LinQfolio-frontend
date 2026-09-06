import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/links";

/**
 * Le site est entièrement public : rien à cacher aux robots, sauf les routes
 * d'API, qui ne renvoient pas de HTML et n'ont donc rien à faire dans l'index.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
