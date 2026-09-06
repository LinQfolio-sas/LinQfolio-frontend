# Compteurs d'audience — table DynamoDB et accès AWS

Chaque page vue incrémente des compteurs via `POST /api/audience`
([app/api/audience/route.ts](../app/api/audience/route.ts)), qui écrit dans
DynamoDB par [lib/audience/store.ts](../lib/audience/store.ts).

Région : **eu-west-1 (Irlande)**, comme le reste de l'infrastructure.

C'est la couche de mesure exemptée de consentement. Le raisonnement juridique
et les invariants à préserver sont dans [analytics.md](analytics.md) — les lire
avant toute modification de la table ou de la route.

---

## 1. Ce que la couche Terraform crée

Les ressources vivent dans `linqfolio-cloud/layers/70-newsletter`, fichier
`audience.tf`, aux côtés de la newsletter : c'est le même runtime SSR qui sert
les deux routes, donc le même rôle de compute.

| Ressource | Rôle |
| --- | --- |
| `aws_dynamodb_table.audience` | Table `linqfolio-audience`, clé de partition `day` (String), clé de tri `metric` (String), facturation à la demande, point-in-time recovery et protection contre la suppression actives. |
| `aws_iam_policy.audience_increment` | `linqfolio-audience-increment` : autorise **uniquement** `dynamodb:UpdateItem`. Ni lecture, ni scan, ni suppression. |
| `aws_iam_role_policy_attachment.web_compute_audience_increment` | Attache la politique au rôle `linqfolio-web-compute` existant. |

```bash
cd ../linqfolio-cloud/layers/70-newsletter
terraform init
terraform plan     # doit annoncer 3 ajouts, 0 modification, 0 suppression
terraform apply
```

`plan` ne doit **rien** modifier sur les ressources newsletter existantes. Si
c'est le cas, s'arrêter et comprendre pourquoi avant d'appliquer.

### Pourquoi l'écriture seule

Le front incrémente, il ne consulte jamais. Une permission de lecture ouvrirait
la porte à une route qui exposerait les totaux sans qu'on l'ait décidé. Les
chiffres se lisent depuis la console AWS ou un tableau de bord, avec des
identifiants d'administration.

---

## 2. Le schéma

Une ligne par jour et par compteur. Rien d'autre.

| Attribut | Type | Exemple |
| --- | --- | --- |
| `day` (PK) | String | `2026-09-05` — jour civil UTC |
| `metric` (SK) | String | `views#home`, `store#hero#app_store` |
| `count` | Number | `412` |

Les clés de compteur sont construites côté serveur à partir de valeurs déjà
validées, jamais reprises telles quelles du corps de requête.

| Famille | Forme | Écrit quand |
| --- | --- | --- |
| Pages vues | `views#<page_type>` | chaque page vue |
| Canal | `channel#<canal>` | chaque page vue |
| Appareil | `device#<appareil>` | chaque page vue |
| Support imprimé | `qr#<qr_id>` | page vue avec `qr_id` valide |
| Lecture complète | `scroll90#<page_type>` | palier 90 % franchi |
| Clic boutique | `store#<placement>#<store>` | clic App Store / Google Play |
| Newsletter | `newsletter#success` | inscription réussie |
| Bandeau | `banner#shown`, `banner#accept`, `banner#decline` | affichage et réponse |

`UpdateExpression: "ADD #count :one"` crée l'attribut s'il n'existe pas : pas
de lecture préalable, pas de course entre deux requêtes simultanées, une seule
unité d'écriture par compteur.

---

## 3. Le jour où il faudra lire

Aucune route ne lit la table, par construction. Depuis un poste avec des
identifiants d'administration :

```bash
# Une journée complète
aws dynamodb query --table-name linqfolio-audience --region eu-west-1 \
  --key-condition-expression 'day = :d' \
  --expression-attribute-values '{":d":{"S":"2026-09-05"}}' \
  --output table

# Le taux d'acceptation du bandeau sur une journée
aws dynamodb query --table-name linqfolio-audience --region eu-west-1 \
  --key-condition-expression '#d = :d AND begins_with(metric, :m)' \
  --expression-attribute-names '{"#d":"day"}' \
  --expression-attribute-values '{":d":{"S":"2026-09-05"},":m":{"S":"banner#"}}' \
  --query 'Items[].[metric.S, count.N]' --output text

# Un compteur précis
aws dynamodb get-item --table-name linqfolio-audience --region eu-west-1 \
  --key '{"day":{"S":"2026-09-05"},"metric":{"S":"views#home"}}' \
  --query 'Item.count.N' --output text
```

`query` sur une journée reste une seule partition : quelques dizaines de lignes,
une unité de lecture. Ne jamais utiliser `scan`, qui parcourt tout l'historique.

---

## 4. Les indicateurs qui en sortent

| Indicateur | Calcul |
| --- | --- |
| **Taux d'acceptation** | `banner#accept / banner#shown` |
| Taux de refus | `banner#decline / banner#shown` |
| Représentativité de GA4 | `banner#accept / banner#shown`, à appliquer comme facteur de correction à tout chiffre GA4 |
| Visites réelles | somme des `views#*` |
| Taux de clic store réel | somme des `store#*` / `views#home` |
| Conversion newsletter réelle | `newsletter#success` / somme des `views#*` |
| Lecture complète | `scroll90#home / views#home` |
| Mix de canaux | `channel#*` entre eux |
| Rendement d'un support imprimé | `qr#<id>`, comparé au tirage |

Ce qu'on **ne peut pas** en tirer, et qu'il ne faut pas essayer de reconstituer :
visiteurs uniques, sessions, taux de rebond, parcours, retours de visite. Ces
chiffres n'existent que dans GA4, sur les consentants — et c'est le facteur de
correction ci-dessus qui dit ce qu'ils valent.

---

## 5. Coût

Une visite écrit 3 à 5 compteurs, soit 3 à 5 unités d'écriture.

| Volume mensuel | Écritures | Coût indicatif |
| --- | --- | --- |
| 5 000 visites | ~20 000 | < 0,05 $ |
| 100 000 visites | ~400 000 | ~0,50 $ |
| 1 000 000 visites | ~4 000 000 | ~5 $ |

Le stockage est négligeable : quelques dizaines de lignes par jour, moins d'un
mégaoctet par an.

---

## 6. Rétention

Les compteurs ne contiennent aucune donnée personnelle : il n'y a donc pas
d'obligation de purge, et aucun TTL n'est posé. Un historique long est même
souhaitable, c'est ce qui permet de comparer une campagne à celle de l'an
dernier.

Si un TTL devait être ajouté un jour, ce serait un choix de coût, pas de
conformité — et il faudrait le dire ainsi dans la politique plutôt que de
laisser croire à une mesure de protection des données.
