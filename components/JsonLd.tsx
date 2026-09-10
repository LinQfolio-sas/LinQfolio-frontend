import { graph } from "@/lib/schema";

/**
 * Pose un graphe de données structurées dans le document.
 *
 * Les nœuds viennent de `lib/schema.ts` ; ce composant ne fait que les écrire.
 * Plusieurs `<JsonLd>` peuvent coexister sur une page — les moteurs lisent
 * tous les blocs `application/ld+json` et fusionnent ceux qui partagent un
 * `@id` — mais un seul graphe par page reste plus simple à vérifier.
 */
export default function JsonLd({ nodes }: { nodes: Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: graph(nodes) }}
    />
  );
}
