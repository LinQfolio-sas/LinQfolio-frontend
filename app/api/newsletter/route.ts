import type { NextRequest } from "next/server";
import { subscribe } from "@/lib/newsletter/store";

/** Le SDK AWS n'existe pas sur l'edge runtime : la route reste en Node. */
export const runtime = "nodejs";

const MAX_EMAIL_LENGTH = 254; // RFC 5321
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

/** Fenêtre glissante en mémoire : par instance seulement, donc insuffisante
 *  comme protection unique, mais elle coupe le bruit d'un formulaire rejoué
 *  sans dépendre d'un service tiers. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((at) => now - at < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);

  // La map ne doit pas croître indéfiniment sur une instance longue durée.
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

export async function POST(request: NextRequest) {
  if (rateLimited(clientKey(request))) {
    return Response.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_body" }, { status: 400 });
  }

  const { email, lang, source } = (body ?? {}) as Record<string, unknown>;

  if (
    typeof email !== "string" ||
    email.length > MAX_EMAIL_LENGTH ||
    !EMAIL_PATTERN.test(email.trim())
  ) {
    return Response.json({ error: "invalid_email" }, { status: 400 });
  }

  try {
    const result = await subscribe({
      email,
      lang: lang === "en" ? "en" : "fr",
      source: typeof source === "string" ? source.slice(0, 64) : "footer",
    });
    return Response.json({ status: result }, { status: 200 });
  } catch (error) {
    // Le détail AWS reste côté serveur : le visiteur n'a rien à en faire.
    console.error("[newsletter] subscribe failed", error);
    return Response.json({ error: "store_unavailable" }, { status: 502 });
  }
}
