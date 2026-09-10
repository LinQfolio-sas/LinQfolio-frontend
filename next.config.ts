import type { NextConfig } from "next";

/**
 * Redirections de la refonte.
 *
 * L'ancien site rangeait le français sous `/fr` et le juridique sous
 * `/legal` ; celui-ci met le français à la racine et nomme ses pages en
 * français. Toutes les adresses indexées changent donc d'un coup, et sans
 * cette table elles renverraient toutes un 404 le jour du déploiement : le
 * domaine repartirait de zéro.
 *
 * `permanent: true` émet un 308, que Google lit comme un 301 — il transmet
 * l'autorité de l'ancienne adresse à la nouvelle et finit par la remplacer
 * dans l'index. Un 307, comme celui que sert l'ancien site sur `/`, ne le
 * fait pas : il annonce un déplacement provisoire.
 *
 * L'anglais n'apparaît pas ici, et c'est voulu : `/en`, `/en/about`,
 * `/en/faq`, `/en/blog` et `/en/blog/how-the-reading-dna-works` gardent
 * exactement les adresses qu'ils avaient. Une redirection, même bien faite,
 * coûte toujours un peu ; l'absence de redirection ne coûte rien.
 *
 * Ces lignes se suppriment le jour où Search Console ne signale plus aucune
 * arrivée sur les anciennes adresses — comptez un an, pas un trimestre.
 */
const MIGRATION_REDIRECTS = [
  // --- Français : `/fr/...` passe à la racine ------------------------------
  { source: "/fr", destination: "/" },
  { source: "/fr/about", destination: "/a-propos" },
  { source: "/fr/faq", destination: "/faq" },
  { source: "/fr/blog", destination: "/blog" },
  {
    source: "/fr/blog/comment-fonctionne-reading-dna",
    destination: "/blog/comment-fonctionne-le-reading-dna",
  },
  {
    source: "/fr/blog/pourquoi-trois-livres-inscription-linqfolio",
    destination: "/blog/trois-livres-a-l-inscription",
  },

  // --- Juridique : `/legal/...` prend des noms français --------------------
  { source: "/legal/privacy", destination: "/confidentialite" },
  { source: "/legal/terms", destination: "/cgu" },
  { source: "/legal/cookies", destination: "/cookies" },
  { source: "/legal/notices", destination: "/mentions-legales" },

  // --- Anglais : le seul article sans traduction --------------------------
  // `why-three-books-on-signup` était indexé mais n'a pas été retraduit. Le
  // journal anglais est la page vivante la plus proche ; c'est mieux qu'un
  // 404, et moins trompeur qu'une redirection vers l'article français, que le
  // lecteur ne saurait pas lire. À remplacer par la traduction dès qu'elle
  // existe : voir `content/blog/README.md`.
  { source: "/en/blog/why-three-books-on-signup", destination: "/en/blog" },
] as const;

const nextConfig: NextConfig = {
  async redirects() {
    return MIGRATION_REDIRECTS.map((rule) => ({ ...rule, permanent: true }));
  },
};

export default nextConfig;
