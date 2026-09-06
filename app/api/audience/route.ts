import type { NextRequest } from "next/server";
import { countersFor } from "@/lib/audience/metrics";
import { increment } from "@/lib/audience/store";

/**
 * Mesure d'audience interne, sans consentement.
 *
 * Ce que la route reçoit tient dans un vocabulaire fermé (voir
 * `lib/audience/metrics.ts`) et ce qu'elle écrit tient dans des compteurs
 * journaliers. Elle ne conserve ni adresse IP, ni agent utilisateur, ni
 * identifiant de session, ni ligne par visiteur ; rien n'est écrit sur le
 * terminal du visiteur, pas même une clé de stockage local.
 *
 * C'est ce cumul qui la place dans l'exemption de consentement décrite par la
 * CNIL pour la mesure d'audience : finalité unique, résultats strictement
 * anonymes, périmètre limité à notre seul site, aucune transmission à un
 * tiers. Toute évolution qui ajouterait un identifiant, un recoupement ou un
 * destinataire externe ferait retomber cette route sous consentement — et
 * imposerait de rouvrir la politique cookies avant, pas après.
 */

/** Le SDK AWS n'existe pas sur l'edge runtime : la route reste en Node. */
export const runtime = "nodejs";

/** Fenêtre glissante en mémoire, par instance. Comme pour la newsletter, elle
 *  ne protège pas d'une attaque distribuée : elle coupe le bruit d'un onglet
 *  qui rejoue en boucle. L'adresse ne sert qu'ici et n'est jamais écrite. */
const WINDOW_MS = 60 * 1000;
const MAX_PER_WINDOW = 60;
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((at) => now - at < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);

  if (hits.size > 5_000) {
    for (const [k, times] of hits) {
      if (times.every((at) => now - at >= WINDOW_MS)) hits.delete(k);
    }
  }

  return recent.length > MAX_PER_WINDOW;
}

function clientKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

/** Filtre de robots minimal, lu à la volée et jamais conservé. Il ne prétend
 *  pas être exhaustif : il évite que les passages d'indexation dominent des
 *  totaux encore petits. */
const BOT = /bot|crawler|spider|crawling|headless|lighthouse|preview|monitor/i;

export async function POST(request: NextRequest) {
  if (BOT.test(request.headers.get("user-agent") ?? "")) {
    return new Response(null, { status: 204 });
  }

  if (rateLimited(clientKey(request))) {
    return new Response(null, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  const counters = countersFor(body);
  if (counters === null) return new Response(null, { status: 400 });

  try {
    await increment(counters);
  } catch (error) {
    // Une panne de compteur ne doit jamais remonter au visiteur : la mesure
    // est une commodité, la page reste le service.
    console.error("[audience] écriture impossible", error);
  }

  return new Response(null, { status: 204 });
}
