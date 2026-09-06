# Export BigQuery — GA4 et Search Console

> Ce document ne concerne que la couche GA4, celle des **consentants**. Les
> totaux tous publics confondus vivent dans DynamoDB, voir
> [audience-dynamodb.md](audience-dynamodb.md). Les deux se lisent ensemble :
> voir la requête 5.8.

L'interface GA4 est un outil de lecture, pas d'analyse. Elle échantillonne dès
que le volume monte, plafonne les croisements de dimensions, et ne conserve
l'événement brut que quatorze mois. BigQuery reçoit chaque événement tel qu'il
a été envoyé, sans limite de croisement et sans date de péremption.

**L'export n'est pas rétroactif.** Le jour où il est activé devient le premier
jour de votre historique. C'est la seule raison pour laquelle cette page
n'attend pas d'avoir un usage : à activer le jour du déploiement, même sans
requête à écrire tout de suite.

---

## 1. Prérequis

| Élément | Détail |
|---|---|
| Compte Google Cloud | Le même compte Google que celui qui administre GA4 |
| Compte de facturation | Obligatoire même pour rester dans le gratuit — Google exige une carte, sans débit tant que les seuils ne sont pas franchis |
| Rôle GA4 | Administrateur sur la propriété |
| Rôle Cloud | `Propriétaire` sur le projet, ou `Éditeur BigQuery` + `Utilisateur de compte de service` |

### Ce que ça coûte réellement

| Poste | Gratuit jusqu'à | Au-delà |
|---|---|---|
| Stockage BigQuery | 10 Go/mois | ~0,02 $/Go/mois |
| Requêtes | 1 To analysé/mois | ~5 $/To |
| Export GA4 quotidien | 1 M événements/jour | Export interrompu, pas facturé |
| Export GA4 continu | facturé au volume | ~0,05 $/Go d'export |

À l'échelle de linqfolio.com aujourd'hui — quelques milliers de visites par
mois, une douzaine d'événements par visite — on parle de quelques dizaines de
mégaoctets par mois. Le gratuit couvre largement, et il le couvrira encore à
cent fois ce volume.

Le vrai risque de facture n'est pas l'export, c'est une requête écrite sans
filtre de date. Voir la section 6.

---

## 2. Créer le projet Google Cloud

1. [console.cloud.google.com](https://console.cloud.google.com) → **Sélectionner
   un projet** → **Nouveau projet**
2. Nom : `linqfolio-analytics`. Noter l'**ID du projet** généré — c'est lui qui
   apparaîtra dans toutes les requêtes, et il n'est pas modifiable ensuite.
3. **Facturation** → associer un compte de facturation au projet
4. **API et services → Bibliothèque** → activer **BigQuery API**

---

## 3. Lier GA4 à BigQuery

`GA4 → Admin → Liaisons de produits → BigQuery → Associer`

| Réglage | Valeur | Pourquoi |
|---|---|---|
| Projet | `linqfolio-analytics` | — |
| **Emplacement des données** | **UE (eu)** | ⚠️ **Irréversible.** Nos politiques annoncent un traitement européen ; un dataset créé aux États-Unis ne se déplace pas, il se recrée en perdant l'historique. |
| Flux de données | Le flux Web `linqfolio.com` | Ajouter le flux App le jour où l'application existe |
| Exclure des événements | aucun | Filtrer coûte moins cher que de tout garder, mais on ne rattrape jamais un événement non exporté |
| Fréquence — **Quotidien** | ✅ activé | Le lot complet de la veille, propre et définitif |
| Fréquence — **Continu** | ❌ désactivé | Facturé au volume, utile seulement pour du temps réel dont nous n'avons pas l'usage |
| Inclure les annonces | ❌ | Aucune campagne publicitaire |

Le premier export arrive **sous 24 h**. Tant que le dataset
`analytics_<ID de propriété>` n'apparaît pas dans BigQuery, la liaison n'est
pas active — revérifier les rôles.

---

## 4. Ce que vous recevez

Un dataset `analytics_<ID de propriété>` contenant :

| Table | Contenu |
|---|---|
| `events_YYYYMMDD` | Une table par jour, figée. C'est la source de vérité. |
| `events_intraday_YYYYMMDD` | Journée en cours, uniquement si l'export continu est actif |
| `pseudonymous_users_YYYYMMDD` | Profils pseudonymes, si activé |

Colonnes utiles au quotidien :

```
event_date            STRING   'YYYYMMDD'
event_timestamp       INT64    microsecondes
event_name            STRING   'store_click', 'section_dwell'…
event_params          ARRAY<STRUCT<key, value STRUCT<string_value, int_value, double_value, float_value>>>
user_properties       ARRAY<…> consent_state vit ici
user_pseudo_id        STRING   NULL en mesure sans cookie
traffic_source        STRUCT<name, medium, source>
device                STRUCT<category, operating_system, web_info…>
geo                   STRUCT<country, region, city>
privacy_info          STRUCT<analytics_storage, ads_storage, uses_transient_token>
```

Deux pièges qui font perdre une soirée :

**Les paramètres sont typés.** Un nombre entier arrive dans `int_value`, un
décimal dans `double_value`. `sections_seen` (entier) et `time_to_click_s`
(décimal) ne se lisent donc pas de la même façon — d'où le `COALESCE` dans
toutes les requêtes ci-dessous.

**`user_pseudo_id` est NULL en mesure sans cookie.** C'est normal et voulu :
sans consentement, il n'y a aucun identifiant. Toute requête qui compte des
`COUNT(DISTINCT user_pseudo_id)` ne compte que les consentants. Pour un volume
réel, compter les événements ou les sessions.

---

## 5. Requêtes prêtes à l'emploi

Remplacer `PROJET` par l'ID du projet et `analytics_XXXXXXXXX` par le nom du
dataset. Toutes filtrent sur 28 jours glissants.

### 5.1 Acceptations, et délai de décision

⚠️ **Le taux d'acceptation ne se calcule pas ici.** GA4 ne mesure que les
personnes ayant accepté : un refus n'y produit rien, par construction. Le
dénominateur vit dans les compteurs internes (`banner#shown`), voir
[audience-dynamodb.md](audience-dynamodb.md).

Ce que BigQuery donne, c'est le délai de décision — un bandeau sur lequel on
hésite dix secondes n'est pas assez clair.

```sql
SELECT
  COUNT(*) AS acceptations,
  ROUND(APPROX_QUANTILES(
    (SELECT COALESCE(value.double_value, CAST(value.int_value AS FLOAT64))
     FROM UNNEST(event_params) WHERE key = 'time_to_choice_s'), 100)[OFFSET(50)], 1
  ) AS secondes_avant_decision_mediane
FROM `PROJET.analytics_XXXXXXXXX.events_*`
WHERE _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 28 DAY))
                        AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
  AND event_name = 'consent_update'
```

### 5.2 Clics store par emplacement, avec l'effort de conviction

`sections_seen` répond à la question que se pose toute page d'accueil :
combien d'argumentaire faut-il avant de convaincre ?

```sql
WITH clics AS (
  SELECT
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'placement') AS emplacement,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'store')     AS store,
    traffic_source.source AS source,
    traffic_source.medium AS support,
    (SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'sections_seen') AS sections_vues,
    (SELECT COALESCE(value.double_value, CAST(value.int_value AS FLOAT64))
     FROM UNNEST(event_params) WHERE key = 'time_to_click_s') AS secondes_avant_clic
  FROM `PROJET.analytics_XXXXXXXXX.events_*`
  WHERE _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 28 DAY))
                          AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
    AND event_name = 'store_click'
)
SELECT
  emplacement,
  store,
  source,
  support,
  COUNT(*) AS clics,
  APPROX_QUANTILES(sections_vues, 100)[OFFSET(50)] AS sections_vues_mediane,
  ROUND(APPROX_QUANTILES(secondes_avant_clic, 100)[OFFSET(50)], 1) AS secondes_avant_clic_mediane
FROM clics
GROUP BY emplacement, store, source, support
ORDER BY clics DESC
```

### 5.3 Taux de clic sur CTA réellement vu

Le vrai taux de conversion d'un bouton : rapporté aux gens qui l'ont eu sous
les yeux, pas à l'ensemble des visites.

```sql
WITH vues AS (
  SELECT (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'placement') AS emplacement,
         COUNT(*) AS affichages
  FROM `PROJET.analytics_XXXXXXXXX.events_*`
  WHERE _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 28 DAY))
                          AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
    AND event_name = 'cta_view'
  GROUP BY emplacement
),
clics AS (
  SELECT (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'placement') AS emplacement,
         COUNT(*) AS clics
  FROM `PROJET.analytics_XXXXXXXXX.events_*`
  WHERE _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 28 DAY))
                          AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
    AND event_name = 'store_click'
  GROUP BY emplacement
)
SELECT
  vues.emplacement,
  vues.affichages,
  COALESCE(clics.clics, 0) AS clics,
  ROUND(100 * COALESCE(clics.clics, 0) / vues.affichages, 2) AS taux_pct
FROM vues LEFT JOIN clics USING (emplacement)
ORDER BY taux_pct DESC
```

### 5.4 Quelle section retient, quelle section on traverse

```sql
SELECT
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'section_id') AS section,
  COUNT(*) AS passages,
  ROUND(APPROX_QUANTILES(
    (SELECT COALESCE(value.double_value, CAST(value.int_value AS FLOAT64))
     FROM UNNEST(event_params) WHERE key = 'dwell_s'), 100)[OFFSET(50)], 1) AS secondes_medianes,
  ROUND(APPROX_QUANTILES(
    (SELECT COALESCE(value.double_value, CAST(value.int_value AS FLOAT64))
     FROM UNNEST(event_params) WHERE key = 'dwell_s'), 100)[OFFSET(90)], 1) AS secondes_p90
FROM `PROJET.analytics_XXXXXXXXX.events_*`
WHERE _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 28 DAY))
                        AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
  AND event_name = 'section_dwell'
GROUP BY section
ORDER BY secondes_medianes DESC
```

### 5.5 Courbe de décrochage

```sql
WITH pages AS (
  SELECT COUNT(*) AS vues
  FROM `PROJET.analytics_XXXXXXXXX.events_*`
  WHERE _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 28 DAY))
                          AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
    AND event_name = 'page_view'
    AND (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_type') = 'home'
)
SELECT
  (SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'percent') AS palier_pct,
  COUNT(*) AS atteintes,
  ROUND(100 * COUNT(*) / (SELECT vues FROM pages), 1) AS part_des_visites_pct
FROM `PROJET.analytics_XXXXXXXXX.events_*`
WHERE _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 28 DAY))
                        AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
  AND event_name = 'scroll_milestone'
  AND (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_type') = 'home'
GROUP BY palier_pct
ORDER BY palier_pct
```

### 5.6 Rendement des supports imprimés

Un `qr_id` par tirage, sinon tout le print se fond dans une seule ligne.

```sql
WITH arrivees AS (
  SELECT (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'qr_id') AS qr,
         COUNT(*) AS scans
  FROM `PROJET.analytics_XXXXXXXXX.events_*`
  WHERE _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY))
                          AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
    AND event_name = 'qr_landing'
  GROUP BY qr
),
conversions AS (
  SELECT
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'qr_id') AS qr,
    COUNTIF(event_name = 'store_click')       AS clics_store,
    COUNTIF(event_name = 'newsletter_success') AS inscriptions
  FROM `PROJET.analytics_XXXXXXXXX.events_*`
  WHERE _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY))
                          AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
    AND traffic_source.medium IN ('print', 'qr')
  GROUP BY qr
)
SELECT
  arrivees.qr AS support,
  arrivees.scans,
  COALESCE(conversions.clics_store, 0) AS clics_store,
  COALESCE(conversions.inscriptions, 0) AS inscriptions,
  ROUND(100 * COALESCE(conversions.clics_store, 0) / arrivees.scans, 1) AS taux_clic_store_pct
FROM arrivees LEFT JOIN conversions USING (qr)
ORDER BY arrivees.scans DESC
```

### 5.7 Entonnoir newsletter

```sql
SELECT
  COUNTIF(event_name = 'newsletter_start')   AS champs_ouverts,
  COUNTIF(event_name = 'newsletter_success') AS inscriptions,
  COUNTIF(event_name = 'newsletter_error')   AS erreurs,
  COUNTIF(event_name = 'newsletter_abandon') AS abandons,
  ROUND(100 * COUNTIF(event_name = 'newsletter_success')
            / NULLIF(COUNTIF(event_name = 'newsletter_start'), 0), 1) AS taux_completion_pct
FROM `PROJET.analytics_XXXXXXXXX.events_*`
WHERE _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 28 DAY))
                        AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
  AND event_name LIKE 'newsletter_%'
```

Le détail des motifs d'échec, qui distingue un bug d'un robot :

```sql
SELECT
  (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'error_code') AS motif,
  COUNT(*) AS echecs
FROM `PROJET.analytics_XXXXXXXXX.events_*`
WHERE _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 28 DAY))
                        AND FORMAT_DATE('%Y%m%d', CURRENT_DATE())
  AND event_name = 'newsletter_error'
GROUP BY motif
ORDER BY echecs DESC
```

### 5.8 Appliquer le facteur de correction

Tout chiffre issu de BigQuery ne décrit que les consentants. Pour l'extrapoler,
le multiplier par l'inverse du taux d'acceptation lu dans les compteurs
internes :

```
volume réel estimé  =  volume GA4  ÷  (banner#accept / banner#shown)
```

Deux précautions. La première : ce n'est valable que pour des **volumes**, pas
pour des **taux**. Un taux de clic store mesuré sur les consentants est déjà un
ratio ; le corriger n'aurait pas de sens. La seconde : l'extrapolation suppose
que consentants et refusants se comportent pareil, ce que rien ne garantit.

Le contrôle qui tranche, sans supposition : comparer les totaux que les deux
couches mesurent tous les deux.

| Indicateur | GA4 (BigQuery) | Compteurs internes |
|---|---|---|
| Clics store | requête 5.2 | `store#*` |
| Inscriptions newsletter | requête 5.7 | `newsletter#success` |
| Lecture complète accueil | requête 5.5, palier 90 | `scroll90#home` |

Si le rapport entre les deux colonnes est stable et proche du taux
d'acceptation, l'extrapolation tient. S'il s'en écarte nettement, les
consentants ne ressemblent pas au reste du public — et il faut le dire dans
chaque rapport plutôt que de corriger.

---

## 6. Garde-fous de coût

**La règle unique : toujours filtrer `_TABLE_SUFFIX`.** Le joker `events_*`
sans filtre de date scanne l'intégralité de l'historique à chaque exécution.
C'est indolore le premier mois et coûteux au bout de deux ans.

À faire une fois, dans la console BigQuery :

1. **Paramètres de requête → Limite d'octets facturés** : `1000000000`
   (1 Go). Une requête qui dépasse échoue au lieu de coûter.
2. **IAM et administration → Quotas** → `BigQuery API` → *Query usage per day*
   → plafonner à 10 Go/jour pour le projet.
3. Ne jamais écrire `SELECT *` : BigQuery facture les colonnes lues, et
   `event_params` est de loin la plus lourde.

L'aperçu d'une table (onglet **Aperçu**) et `INFORMATION_SCHEMA` sont gratuits.

---

## 7. Export Search Console

Complémentaire et indépendant de GA4. Il lève les deux limites de l'interface
Search Console : l'historique de seize mois, et l'échantillonnage des requêtes
qui masque la longue traîne — précisément là où se trouvent les mots-clés
atteignables pour un site jeune.

`Search Console → Paramètres → Exportation groupée de données`

| Réglage | Valeur |
|---|---|
| Projet Cloud | `linqfolio-analytics`, le même que GA4 |
| Dataset | `searchconsole` |
| Emplacement | **UE (eu)**, comme le dataset GA4 |

Prérequis : le compte de service
`search-console-data-export@system.gserviceaccount.com` doit avoir les rôles
**Éditeur de données BigQuery** et **Utilisateur de tâches BigQuery** sur le
projet. Sans cela l'export échoue silencieusement.

Tables produites : `searchdata_site_impression` (agrégé par site) et
`searchdata_url_impression` (par URL — c'est celle qui sert).

### Requêtes utiles

**Fruits mûrs — positions 4 à 20, hors requêtes de marque :**

```sql
SELECT
  query AS requete,
  SUM(impressions) AS impressions,
  SUM(clicks) AS clics,
  ROUND(SUM(clicks) / NULLIF(SUM(impressions), 0) * 100, 2) AS ctr_pct,
  ROUND(SUM(sum_position) / NULLIF(SUM(impressions), 0) + 1, 1) AS position_moyenne
FROM `PROJET.searchconsole.searchdata_url_impression`
WHERE data_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 28 DAY)
  AND NOT REGEXP_CONTAINS(LOWER(query), r'linq\s?folio|lin\s?qfolio')
GROUP BY requete
HAVING position_moyenne BETWEEN 4 AND 20 AND impressions >= 100
ORDER BY impressions DESC
LIMIT 50
```

**Cannibalisation — deux pages sur la même requête :**

```sql
WITH par_page AS (
  SELECT query, url,
         SUM(impressions) AS impressions,
         SUM(clicks) AS clics,
         ROUND(SUM(sum_position) / NULLIF(SUM(impressions), 0) + 1, 1) AS position
  FROM `PROJET.searchconsole.searchdata_url_impression`
  WHERE data_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 28 DAY)
  GROUP BY query, url
)
SELECT query AS requete,
       COUNT(*) AS pages_en_concurrence,
       STRING_AGG(FORMAT('%s (pos %.1f, %d clics)', url, position, clics), ' · '
                  ORDER BY impressions DESC) AS detail
FROM par_page
WHERE position <= 20
GROUP BY requete
HAVING pages_en_concurrence > 1
ORDER BY pages_en_concurrence DESC, requete
```

**Marque contre hors-marque, le seul suivi qui mesure le SEO :**

```sql
SELECT
  data_date AS jour,
  IF(REGEXP_CONTAINS(LOWER(query), r'linq\s?folio|lin\s?qfolio'), 'marque', 'hors marque') AS type,
  SUM(impressions) AS impressions,
  SUM(clicks) AS clics
FROM `PROJET.searchconsole.searchdata_url_impression`
WHERE data_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY)
GROUP BY jour, type
ORDER BY jour DESC, type
```

---

## 8. Vérification

Le lendemain de l'activation :

1. BigQuery → le dataset `analytics_<ID>` existe et contient une table
   `events_YYYYMMDD`
2. La requête 5.1 renvoie des acceptations. Elle ne doit contenir **que** des
   acceptations : voir un refus ici signifierait que GA4 mesure sans accord,
   ce qui serait un défaut de conformité, pas une bonne surprise
3. Les totaux du tableau 5.8 sont cohérents entre les deux couches
4. Sous **Détails d'exécution**, vérifier les octets facturés : une requête sur
   28 jours doit rester en mégaoctets

Sept jours après, épingler les requêtes utiles en **vues enregistrées**, et
brancher Looker Studio dessus plutôt que sur le connecteur GA4 — mêmes
chiffres, sans échantillonnage.
