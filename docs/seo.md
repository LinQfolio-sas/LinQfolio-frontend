# Référencement — état des lieux et suite

Ce que le code fait déjà, ce qui reste à faire à la main, et ce qu'on peut
raisonnablement viser.

## L'essentiel en une phrase

**La refonte changeait toutes les adresses indexées et supprimait l'anglais du
web ; le code répare les deux, mais rien ne remplacera l'absence de Search
Console et l'inexistence de la marque comme entité aux yeux de Google.**

## 1. La migration

L'ancien site rangeait le français sous `/fr` et le juridique sous `/legal`.
Celui-ci met le français à la racine. Les seize adresses connues des moteurs
changeaient donc toutes en même temps.

| Ancienne adresse | Nouvelle | Traitement |
|---|---|---|
| `/fr` | `/` | 308 |
| `/fr/about` | `/a-propos` | 308 |
| `/fr/faq` | `/faq` | 308 |
| `/fr/blog` | `/blog` | 308 |
| `/fr/blog/comment-fonctionne-reading-dna` | `/blog/comment-fonctionne-le-reading-dna` | 308 |
| `/fr/blog/pourquoi-trois-livres-inscription-linqfolio` | `/blog/trois-livres-a-l-inscription` | 308 |
| `/legal/privacy` `/terms` `/cookies` `/notices` | `/confidentialite` `/cgu` `/cookies` `/mentions-legales` | 308 |
| `/en` `/en/about` `/en/faq` `/en/blog` | inchangées | **aucun** |
| `/en/blog/how-the-reading-dna-works` | inchangée | **aucun** |
| `/en/blog/why-three-books-on-signup` | `/en/blog` | 308, faute de traduction |

Les cinq adresses anglaises conservées ne coûtent rien parce qu'elles n'ont
pas bougé : l'article anglais garde son ancien slug par la clé `slug` de son
en-tête, et non par une redirection. Une redirection évitée vaut toujours
mieux qu'une redirection bien faite.

La table vit dans [`next.config.ts`](../next.config.ts). Elle se supprime le
jour où Search Console ne signale plus aucune arrivée sur les anciennes
adresses — comptez un an, pas un trimestre.

## 2. L'anglais existe enfin

Il était intégralement écrit — accueil, à propos, FAQ, quatre pages légales,
un article — et intégralement invisible : les deux langues partageaient une
seule adresse, le HTML servi était toujours français, et le basculement se
jouait dans `localStorage`. Aucun moteur n'a jamais lu un mot d'anglais sur ce
site.

Le français vit maintenant à la racine, l'anglais sous `/en`, chacun avec son
`<html lang>` posé par le serveur. Cela impose deux layouts racine —
`app/(fr)/layout.tsx` et `app/en/layout.tsx` — parce qu'un seul ne peut pas
servir deux valeurs de `lang`.

La table des routes est dans [`lib/seo.ts`](../lib/seo.ts). Ajouter une page,
c'est ajouter une ligne : le plan du site, les `hreflang`, les fils d'Ariane et
les liens internes en découlent tous.

**Piège à connaître** : Google ignore un jeu de `hreflang` entier dès qu'une
page ne renvoie pas vers celles qui la citent. La réciprocité est ici acquise
par construction, les deux langues lisant la même ligne de `ROUTES` — ne la
contournez pas en écrivant un `alternates` à la main dans une page.

## 3. Les données structurées

Trois nœuds permanents dans [`lib/schema.ts`](../lib/schema.ts) — l'organisation,
le site, l'application — que chaque page cite par `@id` au lieu de les
redécrire. S'y ajoutent selon la page : `WebPage`, `BreadcrumbList`, `FAQPage`
(29 questions par langue), `BlogPosting`, `Blog`.

L'organisation porte la raison sociale, l'adresse du siège et le SIRET. Ce
n'est pas de la décoration juridique : cherché aujourd'hui, « LinQfolio »
ramène Linqto et Linfolio, pas nous. Un nom seul ne distingue pas une marque
d'un mot qui lui ressemble ; une personne morale identifiable, si.

Deux choses volontairement absentes, à ne pas « corriger » :

- **`aggregateRating`** — tant qu'on n'a pas de vraies notes à déclarer, en
  inventer est une violation des consignes, sanctionnée par la perte de tous
  les résultats enrichis du domaine.
- **`SearchAction`** — la recherche de la FAQ est locale à la page et n'a pas
  d'URL. Déclarer une boîte de recherche qui ne répond pas est un bon moyen de
  la faire retirer.

## 4. Ce qu'il reste à faire à la main

### Search Console — bloquant

Rien ne se pilote sans. GA4 dit ce que font les visiteurs une fois arrivés ;
seul Search Console dit **par quelle requête** ils sont arrivés, et à quelle
position. Sans lui, aucune des décisions plus bas ne peut être prise sur autre
chose qu'une intuition.

1. Créer une propriété de type **Domaine** (pas « Préfixe d'URL ») sur
   `linqfolio.com`, et la vérifier par enregistrement DNS `TXT`. Elle couvre
   alors `http`, `https`, `www` et tous les sous-domaines d'un coup, et elle
   survit aux refontes.
   À défaut d'accès à la zone DNS, poser le jeton dans
   `GOOGLE_SITE_VERIFICATION` : les deux layouts racine émettent alors la
   balise. C'est un pis-aller — une balise disparaît avec le gabarit qui la
   portait.
2. Soumettre `https://linqfolio.com/sitemap.xml`.
3. Faire la même chose sur **Bing Webmaster Tools**, qui alimente aussi
   ChatGPT Search et Copilot.
4. Attendre. Les données de position n'apparaissent qu'après quelques jours et
   ne veulent rien dire avant plusieurs semaines.

### Après le déploiement

- Vérifier les seize redirections en production (`curl -sI`), pas seulement en
  local.
- Dans Search Console, surveiller « Pages » → « Non indexée » pendant un mois :
  c'est là que se voient les erreurs de migration.
- Contrôler le rapport « Ciblage international » : il signale les `hreflang`
  non réciproques.
- Passer une page de chaque type au **test des résultats enrichis** de Google.

### Fiches des stores

Le titre App Store est aujourd'hui « LinQfolio » seul. Apple accorde trente
caractères, et c'est le signal de recherche le plus lourd de la fiche : neuf
sont utilisés. Gleeph écrit « Gleeph - Réseau social du livre ». Le sous-titre
(trente caractères de plus) et les cent caractères de mots-clés méritent le
même soin. Ce chantier ne se fait pas dans ce dépôt, mais il pèse autant que
tout ce qui précède.

## 5. Ce qu'on peut viser, et ce qu'on ne peut pas

Le terrain français est tenu par **Babelio** (plus d'un million de membres,
quinze ans d'ancienneté), **Booknode** (autant), **Gleeph** (couvert par la
presse professionnelle) et **Relit**, concurrent direct sur l'échange
géolocalisé, qui range déjà sur « meilleure application partage de livre ».

Viser la première place sur « réseau social lecteurs » contre Babelio n'est pas
un objectif de trimestre, et le prétendre ferait perdre un an à courir après la
mauvaise chose. Ce qui est réellement gagnable :

| Cible | Pourquoi elle est atteignable | Horizon |
|---|---|---|
| La marque : « LinQfolio », « LinQfolio app », « LinQfolio avis » | Personne d'autre ne la revendique. Aujourd'hui Google propose Linqto : c'est un problème d'entité, pas de concurrence. | 1–3 mois |
| « Reading DNA » et ses formulations | Terme qui nous appartient, zéro concurrence, et déjà un article de fond qui l'explique. | 3–6 mois |
| Longue traîne de la FAQ | Vingt-neuf questions par langue, formulées comme les gens les posent. Chacune est une porte d'entrée. | 3–6 mois |
| Le marché anglophone | Il partait de zéro puisque l'anglais n'était pas indexé. Tout gain y est net. | 6–12 mois |
| Les comparatifs | Cinq listicles ranguent déjà sur nos requêtes cibles. Y **figurer** coûte infiniment moins cher que les dépasser. C'est du relationnel presse, pas du netlinking. | continu |

### Le contenu qui manque

Par ordre de rendement décroissant :

1. **Traduire `trois-livres-a-l-inscription`.** L'adresse anglaise existait et
   était indexée ; elle redirige aujourd'hui faute de texte. C'est le seul
   article du site à avoir perdu une page.
2. **Une page dédiée au Reading DNA**, distincte de l'article. L'article
   explique comment ça marche ; une page produit répond à « qu'est-ce que
   c'est ». Ce sont deux intentions de recherche, et aujourd'hui aucune page
   ne porte la seconde.
3. **Un comparatif honnête** du type « échanger ses livres : les applications
   françaises comparées ». C'est exactement le format qui range sur nos
   requêtes, et le nôtre a l'avantage de pouvoir être écrit par des gens qui
   connaissent le sujet. Il doit citer les concurrents et dire où ils sont
   meilleurs, sans quoi personne ne le lira ni ne le liera.
4. **Des pages de villes**, si et seulement si l'échange géolocalisé a une
   masse critique réelle quelque part. Écrites à la main pour deux ou trois
   villes. Générées par gabarit pour trente, elles seraient désindexées comme
   contenu sans valeur ajoutée — c'est le piège classique du référencement
   programmatique sur un service qui démarre.

### Avant toute optimisation de page

Une règle, à appliquer dès que Search Console aura des données : **vérifier
qu'une page ne prend pas la requête d'une autre**. Deux pages du site classées
sur la même requête, aux mêmes positions, avec des clics partagés, se font
concurrence et perdent toutes les deux. La règle pratique : la page qui a le
plus d'impressions sur une requête la possède ; aucune autre ne doit reprendre
son mot-clé principal dans son `<title>` ou son `<h1>`.

## 6. Les limites connues du code

- **Les images** sont servies en `<img>` brut, sans `next/image` : ni
  dimensionnement adaptatif, ni format négocié. Le linter le signale à dix
  endroits. C'est le principal levier restant sur le LCP, donc sur les Core Web
  Vitals.
- **Aucun `next/link`** : toute la navigation est en `<a href>`. Sans effet sur
  l'indexation — un lien reste un lien — mais chaque navigation recharge la
  page.
- **La bascule de langue depuis un article** mène au journal, pas à l'article
  traduit : les slugs diffèrent d'une langue à l'autre et le composant, rendu
  dans la barre de navigation, ne les connaît pas. Le `hreflang` du `<head>`,
  lui, pointe bien vers la traduction — Google est donc correctement informé,
  c'est le lecteur qui fait un détour.
- **Le `<h1>` de l'accueil** ne contient pas de mot-clé, par choix : la
  formule porte l'identité, le `<title>` porte la requête. Si les positions
  stagnent sur les requêtes génériques à six mois, c'est le premier arbitrage
  à rouvrir.
