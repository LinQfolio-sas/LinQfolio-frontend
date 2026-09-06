# Mesure d'audience — lot 1

Deux couches, deux régimes juridiques. Ce que le code fait, et ce qui reste à
faire à la main.

## L'architecture en une phrase

**Des compteurs internes agrégés mesurent tout le monde sans consentement,
parce qu'ils ne conservent rien ; Google Analytics mesure le comportement des
seules personnes qui l'acceptent, parce qu'il conserve.**

| | Compteurs internes | Google Analytics 4 |
|---|---|---|
| Consentement | non requis | **obligatoire** |
| Écrit sur le terminal | rien | `_ga`, `_ga_<ID>` |
| Identifiant | aucun | client id, session id |
| Destinataire | notre DynamoDB (Irlande) | Google Ireland |
| Couverture | 100 % des visites | les consentants |
| Granularité | totaux journaliers | parcours, séquences, durées |
| Stockage | `linqfolio-audience` | propriété GA4 + BigQuery |

Le premier donne le dénominateur, le second le comportement. Aucun des deux ne
suffit seul : sans compteurs, on ignore quelle fraction du public GA4 décrit ;
sans GA4, on ne sait rien de ce que les gens font.

## Ce que le code fait

| Fichier | Rôle |
|---|---|
| `lib/audience/metrics.ts` | Vocabulaire fermé de la mesure interne, validation, clés de compteurs |
| `lib/audience/beacon.ts` | Envoi `sendBeacon`, classement du canal et de l'appareil côté navigateur |
| `lib/audience/store.ts` | Incréments DynamoDB (`ADD`), aucune lecture |
| `app/api/audience/route.ts` | Route publique : allowlist stricte, filtre de robots, limitation de débit |
| `lib/analytics/config.ts` | Identifiant GA4, lecture/écriture du consentement, échéance de six mois |
| `lib/analytics/consent-script.ts` | Script ES5 du `<head>` : amorce GA4 **si et seulement si** l'accord existe |
| `lib/analytics/track.ts` | Noms d'événements et paramètres typés, table des types de page, compteurs |
| `lib/analytics/events.ts` | Gestes partagés (clic store, bascule de langue) |
| `lib/analytics/ConsentContext.tsx` | Décision, chargement conditionnel de gtag.js, purge des cookies au retrait |
| `components/ConsentBanner.tsx` | La question, posée une fois |
| `components/ConsentPreferences.tsx` | Le retrait, sur `/cookies` |
| `components/Telemetry.tsx` | Défilement, sections, temps passé — vers les deux couches |

---

## Pourquoi GA4 ne mesure que les consentants

La CNIL admet une mesure d'audience **sans consentement** à quatre conditions
cumulatives : finalité unique, résultats strictement anonymes, périmètre limité
au seul éditeur, **aucune transmission à un tiers**.

Google Analytics ne remplit pas la quatrième, et ne figure pas sur la liste des
solutions que la CNIL a exemptées. Son mode consentement « avancé » — qui
envoie des mesures sans cookie en cas de refus — n'y change rien : les données
partent quand même chez Google. **Ce mode a donc été retiré.**

Conséquence dans le code : sans accord enregistré, `CONSENT_INIT_SCRIPT` ne
crée même pas `window.gtag`. Ce n'est pas un drapeau qu'un appel pourrait
oublier de consulter — c'est l'absence de la fonction qui rend `track()`
inerte. Aucun événement ne peut donc s'accumuler dans une file que gtag.js
rejouerait si la personne acceptait plus tard.

### L'ordre d'exécution, qui reste la vraie contrainte

`gtag('consent', …)` doit être dans `dataLayer` **avant** que gtag.js ne
s'exécute. D'où le découpage :

1. `CONSENT_INIT_SCRIPT`, inline dans le `<head>` du layout — exécuté pendant
   l'analyse du document
2. `<Script src="…/gtag/js">` rendu par `ConsentProvider`, uniquement si
   l'instantané vaut `granted`

Pour une acceptation donnée en cours de visite, `activateGtag()` met les mêmes
commandes en file avant que la balise ne soit rendue au tour suivant.

---

## La couche interne, exemptée

### Ce qui est compté

| Famille de compteurs | Écrit quand |
|---|---|
| `views#<page_type>` | chaque page vue |
| `channel#<canal>` | chaque page vue — `qr`, `social`, `search`, `email`, `referral`, `direct` |
| `device#<appareil>` | chaque page vue — `mobile`, `tablet`, `desktop` |
| `qr#<qr_id>` | page vue avec un identifiant de support imprimé |
| `scroll90#<page_type>` | passage du palier 90 % |
| `store#<placement>#<store>` | clic vers une boutique |
| `newsletter#success` | inscription réussie |
| `banner#shown` / `banner#accept` / `banner#decline` | affichage et réponse au bandeau |

`banner#accept / banner#shown` **est** le taux d'acceptation. C'est la seule
source possible : un refus ne produit rien dans GA4, par construction.

### Les invariants à ne pas casser

Ces cinq points sont ce qui place la route dans l'exemption. Les perdre ne
provoquerait aucune erreur visible — seulement une politique devenue fausse.

1. **Aucune écriture sur le terminal.** Pas de cookie, pas de `localStorage`,
   pas même de `sessionStorage`.
2. **Aucun identifiant.** Ni visiteur, ni session, ni empreinte. Ajouter un id
   de session, même éphémère, ferait basculer le dispositif sous consentement.
3. **Aucune ligne individuelle.** La table ne contient que des `ADD`. Écrire un
   événement par visite, même sans identifiant, redeviendrait un journal.
4. **Aucun texte libre.** Tout est validé contre les listes de
   `lib/audience/metrics.ts`. Le client décrit ce qui s'est passé ; le serveur
   choisit ce qui est écrit.
5. **Aucun tiers.** Les compteurs restent sur notre infrastructure.

Le contournement tentant à refuser : « juste un id de session pour compter les
visiteurs uniques ». Ce serait la fin de l'exemption, pour un chiffre que GA4
donne déjà sur les consentants.

### Provisionnement

Table DynamoDB `linqfolio-audience` et politique IAM : voir
[audience-dynamodb.md](audience-dynamodb.md).

---

## Les douze événements

| Événement | Où | Paramètres |
|---|---|---|
| `store_click` | `Hero`, `Cta` | `store`, `placement`, `lang`, `time_to_click_s`, `scroll_depth_at_click`, `sections_seen` |
| `cta_view` | `Telemetry` via `data-cta` | `placement`, `time_to_view_s`, `scroll_depth_at_view` |
| `newsletter_start` | `Footer` | `form_source`, `lang` |
| `newsletter_success` | `Footer` | `form_source`, `lang`, `is_returning`, `time_to_submit_s`, `attempts` |
| `newsletter_error` | `Footer` | `form_source`, `error_code`, `attempts` |
| `newsletter_abandon` | `Footer` | `form_source`, `time_in_field_s`, `had_input` |
| `qr_landing` | `Telemetry` | `qr_id`, `qr_placement`, `page_path` |
| `scroll_milestone` | `Telemetry` | `percent` (25/50/75/90) |
| `section_view` | `Telemetry` via `data-section` | `section_id`, `time_to_view_s`, `scroll_depth_at_view` |
| `section_dwell` | `Telemetry` via `data-section` | `section_id`, `dwell_s` |
| `consent_update` | `ConsentContext` | `consent_choice`, `time_to_choice_s` |
| `lang_switch` | `LanguageToggle` | `from_lang`, `to_lang`, `page_path` |

Tous portent en plus `page_type`, ajouté automatiquement par `track()`.

### Ajouter une section au suivi

Poser `data-section="<identifiant>"` sur l'élément. Rien d'autre. Un CTA
s'annonce avec `data-cta="<emplacement>"`, sur le conteneur des boutons.

## À créer dans GA4, à la main, AVANT le premier déploiement

Les dimensions et métriques personnalisées **ne sont pas rétroactives** : un
paramètre envoyé avant d'être déclaré n'apparaît nulle part et ne sera jamais
récupérable. C'est la seule étape irréversible du lot.

### Dimensions personnalisées — portée Événement
`Admin → Définitions personnalisées → Dimensions personnalisées`

| Nom affiché | Paramètre |
|---|---|
| Type de page | `page_type` |
| Emplacement | `placement` |
| Section | `section_id` |
| Langue affichée | `lang` |
| Store | `store` |
| Source formulaire | `form_source` |
| Code erreur | `error_code` |
| Abonné existant | `is_returning` |
| Saisie commencée | `had_input` |
| ID QR code | `qr_id` |
| Support QR code | `qr_placement` |
| Palier de défilement | `percent` |
| Choix consentement | `consent_choice` |
| Langue quittée | `from_lang` |
| Langue choisie | `to_lang` |
| Chemin de page | `page_path` |

`content_group` est renseigné à chaque page vue avec la même valeur que
`page_type`. C'est une dimension GA4 native : **rien à déclarer** pour elle.

> Il n'y a pas de dimension `consent_state` : dans GA4, tout le monde a
> consenti. Le taux d'acceptation se lit dans les compteurs internes.

### Métriques personnalisées — portée Événement, unité « Standard » (secondes pour les durées)

| Nom affiché | Paramètre | Unité |
|---|---|---|
| Temps avant clic | `time_to_click_s` | Secondes |
| Profondeur au clic | `scroll_depth_at_click` | Standard |
| Sections vues | `sections_seen` | Standard |
| Temps avant affichage | `time_to_view_s` | Secondes |
| Profondeur à l'affichage | `scroll_depth_at_view` | Standard |
| Temps passé | `dwell_s` | Secondes |
| Temps avant envoi | `time_to_submit_s` | Secondes |
| Temps dans le champ | `time_in_field_s` | Secondes |
| Tentatives | `attempts` | Standard |
| Temps de décision | `time_to_choice_s` | Secondes |

### Événements clés
`Admin → Événements clés` : `store_click`, `newsletter_success`, `qr_landing`.

Ne **pas** marquer le `click` automatique de la mesure améliorée : il se
déclenche aussi sur les liens store et compterait double.

### Mesure améliorée
`Admin → Flux de données → Web → Mesure améliorée`

- Garder : pages vues, clics sortants, téléchargements de fichiers
- **Désactiver : interactions avec formulaire** (`form_start` / `form_submit`)
  feraient doublon avec `newsletter_start` / `newsletter_success`
- Le `scroll` natif (90 % seulement) peut rester : `scroll_milestone` est plus
  fin, les deux ne se gênent pas

### Export BigQuery
Comme les dimensions, **l'export n'est pas rétroactif** : à activer le même
jour, même sans usage immédiat. Procédure complète dans
[bigquery.md](bigquery.md).

## Recette

### La couche interne

1. `NEXT_PUBLIC_AUDIENCE_ENABLED=1` et la table provisionnée
2. Ouvrir une page, onglet **Réseau** : un `POST /api/audience` en `204`
3. Vérifier dans DynamoDB que `views#home` du jour a augmenté de 1
4. **Sans avoir répondu au bandeau** : `document.cookie` est vide de `_ga`,
   `window.gtag` est `undefined`, et le compteur monte quand même
5. Envoyer un corps invalide et vérifier le rejet :
   `curl -X POST /api/audience -d '{"event":"pwned"}'` → `400`, rien d'écrit

### La couche GA4

6. `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX`, `GA4 → Admin → DebugView`
7. **Sans avoir répondu** : onglet Réseau, aucune requête vers
   `googletagmanager.com`. C'est le point de conformité le plus important — si
   une requête part avant le clic, tout le reste est faux.
8. `Refuser` → toujours aucune requête vers Google, jamais de `_ga`
9. `Accepter` → gtag.js se charge, `_ga` et `_ga_<ID>` apparaissent,
   `consent_update` part
10. Défiler, cliquer un bouton store → `store_click` avec `sections_seen`
    rempli
11. `/cookies` → `Refuser` → les cookies `_ga` disparaissent immédiatement,
    sans rechargement

En développement, chaque événement est affiché en console
(`[analytics]` pour GA4, `[audience]` pour les compteurs) et rien n'est envoyé.
