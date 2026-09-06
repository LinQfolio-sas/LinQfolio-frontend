import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

/**
 * Compteurs d'audience agrégés.
 *
 * La table ne contient que des additions : une ligne par jour et par compteur,
 * un entier dedans. Aucun identifiant, aucune adresse IP, aucun agent
 * utilisateur, aucune ligne par visiteur. Il n'y a donc rien à anonymiser
 * après coup — le résultat est anonyme par construction, ce qui est
 * exactement la condition posée par la CNIL pour se passer de consentement.
 *
 * C'est aussi ce qui borne définitivement ce qu'on peut en tirer : on connaît
 * des totaux, jamais un parcours. Le détail du comportement vit dans GA4, pour
 * les seules personnes qui l'ont accepté.
 */

/** Même préfixe que la newsletter : les plateformes AWS injectent déjà leurs
 *  propres `AWS_*` en lecture seule. */
const REGION =
  process.env.NEWSLETTER_AWS_REGION ?? process.env.AWS_REGION ?? "eu-west-1";
const TABLE = process.env.AUDIENCE_TABLE_NAME ?? "linqfolio-audience";

function credentials() {
  const accessKeyId = process.env.NEWSLETTER_AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.NEWSLETTER_AWS_SECRET_ACCESS_KEY;
  if (!accessKeyId || !secretAccessKey) return undefined;
  return { accessKeyId, secretAccessKey };
}

let cached: DynamoDBDocumentClient | null = null;

function client(): DynamoDBDocumentClient {
  if (!cached) {
    cached = DynamoDBDocumentClient.from(
      new DynamoDBClient({
        region: REGION,
        credentials: credentials(),
        endpoint: process.env.NEWSLETTER_DYNAMODB_ENDPOINT || undefined,
      }),
    );
  }
  return cached;
}

/** Jour civil en UTC. Un fuseau fixe garde les journées comparables entre
 *  elles, y compris au changement d'heure. */
export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Incrémente les compteurs du jour.
 *
 * `ADD` crée l'attribut s'il n'existe pas : pas de lecture préalable, pas de
 * course entre deux requêtes simultanées, et une seule unité d'écriture par
 * compteur.
 */
export async function increment(counters: string[], day = today()) {
  const db = client();

  await Promise.all(
    counters.map((metric) =>
      db.send(
        new UpdateCommand({
          TableName: TABLE,
          Key: { day, metric },
          UpdateExpression: "ADD #count :one",
          ExpressionAttributeNames: { "#count": "count" },
          ExpressionAttributeValues: { ":one": 1 },
        }),
      ),
    ),
  );
}
