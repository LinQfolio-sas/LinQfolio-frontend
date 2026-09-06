import {
  ConditionalCheckFailedException,
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

export type SubscribeResult = "subscribed" | "already-subscribed";

export type SubscribeInput = {
  email: string;
  lang: string;
  source: string;
};

/** Région et table : préfixe `NEWSLETTER_` prioritaire, car les plateformes
 *  AWS (Amplify, Lambda) injectent déjà leurs propres `AWS_*` en lecture seule. */
const REGION =
  process.env.NEWSLETTER_AWS_REGION ?? process.env.AWS_REGION ?? "eu-west-1";
const TABLE = process.env.NEWSLETTER_TABLE_NAME ?? "linqfolio-newsletter";

/** Clés explicites hors AWS (Vercel, machine locale) ; sinon on laisse le SDK
 *  résoudre le rôle IAM de l'exécution — aucun secret à stocker. */
function credentials() {
  const accessKeyId = process.env.NEWSLETTER_AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.NEWSLETTER_AWS_SECRET_ACCESS_KEY;
  if (!accessKeyId || !secretAccessKey) return undefined;
  return { accessKeyId, secretAccessKey };
}

/** Le client est instancié une fois par worker : il garde son pool de
 *  connexions et ses credentials résolus entre deux requêtes. */
let cached: DynamoDBDocumentClient | null = null;

function client(): DynamoDBDocumentClient {
  if (!cached) {
    cached = DynamoDBDocumentClient.from(
      new DynamoDBClient({
        region: REGION,
        credentials: credentials(),
        // Renseigné pour viser une DynamoDB Local en développement ;
        // vide en production, le SDK résout l'URL régionale.
        endpoint: process.env.NEWSLETTER_DYNAMODB_ENDPOINT || undefined,
      }),
      { marshallOptions: { removeUndefinedValues: true } },
    );
  }
  return cached;
}

/** Casse et espaces sont ignorés côté adressage : on stocke une seule forme
 *  pour que la clé primaire dédoublonne réellement. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Écrit l'inscription dans DynamoDB. La condition `attribute_not_exists`
 * fait de l'appel une opération idempotente : une seconde inscription ne
 * réécrit pas la date d'origine et remonte `already-subscribed`.
 */
export async function subscribe({
  email,
  lang,
  source,
}: SubscribeInput): Promise<SubscribeResult> {
  try {
    await client().send(
      new PutCommand({
        TableName: TABLE,
        Item: {
          email: normalizeEmail(email),
          status: "subscribed",
          subscribedAt: new Date().toISOString(),
          lang,
          source,
          // Promis dans le pied de page : « désinscription en un clic ».
          // Le jeton est créé ici pour que le lien existe dès le premier envoi.
          unsubscribeToken: crypto.randomUUID(),
        },
        ConditionExpression: "attribute_not_exists(email)",
      }),
    );
    return "subscribed";
  } catch (error) {
    if (error instanceof ConditionalCheckFailedException) {
      return "already-subscribed";
    }
    throw error;
  }
}
