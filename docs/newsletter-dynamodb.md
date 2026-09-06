# Newsletter — table DynamoDB et accès AWS

Le formulaire du pied de page envoie l'adresse à `POST /api/newsletter`
([app/api/newsletter/route.ts](../app/api/newsletter/route.ts)), qui écrit dans
DynamoDB via [lib/newsletter/store.ts](../lib/newsletter/store.ts).

Région : **eu-west-1 (Irlande)**, comme le reste de l'infrastructure.

L'infrastructure n'est pas créée à la main : elle vit dans la couche Terraform
`linqfolio-cloud/layers/70-newsletter`. Les commandes `aws` données plus bas ne
servent qu'à vérifier ou à exploiter la liste, jamais à provisionner.

---

## 1. Ce que la couche Terraform crée

`layers/70-newsletter` déclare trois ressources :

| Ressource | Rôle |
| --- | --- |
| `aws_dynamodb_table.newsletter` | Table `linqfolio-newsletter`, clé de partition `email` (String), facturation à la demande, point-in-time recovery et protection contre la suppression actives. |
| `aws_iam_policy.newsletter_put` | `linqfolio-newsletter-put` : autorise **uniquement** `dynamodb:PutItem` sur cette table. Ni lecture, ni scan, ni suppression. |
| `aws_iam_role.web_compute` | `linqfolio-web-compute`, endossé par le runtime SSR d'Amplify, avec la politique ci-dessus pour seule permission. |

```bash
cd ../linqfolio-cloud/layers/70-newsletter
terraform init
terraform plan
terraform apply
```

Le rôle de compute est distinct du rôle de service Amplify
(`AmplifySSRLoggingRole-…`, géré en `50-identity`) qui ne sert qu'aux logs :
c'est délibéré, et le commentaire dans `newsletter.tf` explique pourquoi.

---

## 2. Le rôle côté Amplify

Déjà en place, rien à faire. L'application Amplify **LinQfolio-web** est
elle-même gérée par Terraform (`layers/60-apps`, importée depuis l'existant),
et son `compute_role_arn` pointe sur `linqfolio-web-compute` :

```hcl
# generated.tf
compute_role_arn = "arn:aws:iam::779846824550:role/linqfolio-web-compute"
```

Ce rôle est distinct du rôle de service Amplify
(`AmplifySSRLoggingRole-487c0d15-…`) qui ne sert qu'aux logs SSR. Les
permissions applicatives ne doivent jamais être attachées à ce dernier : cela
donnerait au collecteur de logs un accès en écriture sur les données.

Aucune clé d'accès n'est distribuée : le SDK résout le rôle tout seul, donc
`NEWSLETTER_AWS_ACCESS_KEY_ID` et `NEWSLETTER_AWS_SECRET_ACCESS_KEY` restent
vides en production.

Pour contrôler l'état réel, sans rien modifier :

```bash
aws amplify get-app --app-id d3eg5uuhf82ii1 --region eu-west-1 \
  --query 'app.computeRoleArn' --output text
# → arn:aws:iam::779846824550:role/linqfolio-web-compute

aws iam simulate-principal-policy \
  --policy-source-arn arn:aws:iam::779846824550:role/linqfolio-web-compute \
  --action-names dynamodb:PutItem dynamodb:Scan dynamodb:DeleteItem \
  --resource-arns arn:aws:dynamodb:eu-west-1:779846824550:table/linqfolio-newsletter \
  --query 'EvaluationResults[].{action:EvalActionName,decision:EvalDecision}' \
  --output table
# → PutItem allowed, Scan et DeleteItem implicitDeny
```

Si la console Amplify affichait un jour un rôle différent, c'est une dérive :
corriger dans `60-apps`, pas dans la console.

---

## 3. Variables d'environnement

| Variable | Obligatoire | Valeur |
| --- | --- | --- |
| `NEWSLETTER_TABLE_NAME` | non | `linqfolio-newsletter` par défaut |
| `NEWSLETTER_AWS_REGION` | non | `eu-west-1` par défaut |
| `NEWSLETTER_AWS_ACCESS_KEY_ID` | non | dév local ou hébergement hors AWS |
| `NEWSLETTER_AWS_SECRET_ACCESS_KEY` | non | idem |
| `NEWSLETTER_DYNAMODB_ENDPOINT` | non | uniquement pour une DynamoDB Local |

Le préfixe `NEWSLETTER_` est délibéré : sur Amplify et Lambda, les variables
`AWS_*` sont réservées par la plateforme et ne peuvent pas être redéfinies. Si
elles sont absentes, le code retombe sur `AWS_REGION` et sur la chaîne de
credentials standard du SDK — c'est ce qui fait fonctionner le rôle de compute
en production sans configuration.

En développement, un fichier `.env.local` (déjà ignoré par git) avec des clés
personnelles ayant le droit `PutItem` sur la table :

```bash
NEWSLETTER_TABLE_NAME=linqfolio-newsletter
NEWSLETTER_AWS_REGION=eu-west-1
NEWSLETTER_AWS_ACCESS_KEY_ID=...
NEWSLETTER_AWS_SECRET_ACCESS_KEY=...
```

---

## 4. Forme d'un enregistrement

```json
{
  "email": "marie.lecteur@exemple.fr",
  "status": "subscribed",
  "subscribedAt": "2026-09-05T18:09:19.668Z",
  "lang": "fr",
  "source": "footer",
  "unsubscribeToken": "901c5bfa-26d3-4aa6-93f9-c9f6e15d356a"
}
```

L'adresse est normalisée (minuscules, sans espaces) avant écriture, et la
condition `attribute_not_exists(email)` rend l'appel idempotent : une seconde
inscription n'écrase pas la date d'origine et remonte `already-subscribed`.

Aucune IP n'est stockée : elle ne sert qu'en mémoire, le temps de la limitation
de débit.

---

## 5. Vérifier et exploiter

```bash
curl -i -X POST http://localhost:3000/api/newsletter \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@exemple.fr","lang":"fr","source":"footer"}'
# → 200 {"status":"subscribed"}
# le même appel rejoué → 200 {"status":"already-subscribed"}
```

La lecture de la table demande des droits que le site n'a pas — c'est voulu.
Elle se fait avec des credentials d'administration :

```bash
aws dynamodb scan \
  --table-name linqfolio-newsletter \
  --filter-expression '#s = :ok' \
  --expression-attribute-names '{"#s":"status"}' \
  --expression-attribute-values '{":ok":{"S":"subscribed"}}' \
  --region eu-west-1 \
  --query 'Items[].email.S' --output text
```

---

## 6. Reste à faire

- **Désinscription** : `unsubscribeToken` est écrit dès l'inscription, mais la
  route `/api/newsletter/unsubscribe` et le lien dans les emails n'existent pas
  encore. Le pied de page promet « désinscription en un clic » : à livrer avant
  le premier envoi. Elle demandera d'élargir la politique IAM (`UpdateItem` et
  une lecture par jeton, donc un index secondaire).
- **Confidentialité** : ajouter la finalité « newsletter », la base légale
  (consentement), la durée de conservation et le sous-traitant AWS dans
  [confid.md](../confid.md).
- **Double opt-in** : recommandé si le volume grimpe, pour éviter les
  inscriptions d'adresses tierces.
- **Limitation de débit** : la fenêtre en mémoire est par instance. Sur
  plusieurs instances, la protéger en amont (WAF, rate limit de la plateforme).
