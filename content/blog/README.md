# Ajouter un article au journal

Un fichier Markdown = un article. Rien d'autre à enregistrer : la page
`/blog` et la page de l'article se construisent toutes seules au build.

**Aucune image à fournir.** La couverture du livre est dessinée en CSS à
partir de la rubrique, avec la reliure, le dos et la tranche de pages du
design system. Les illustrations de personnages sont réservées au Hero de
la page d'accueil : ne les reprenez pas ici.

## 1. Créer le fichier

Nommez-le `mon-article.fr.md` (le nom avant `.fr` devient l'URL :
`/blog/mon-article`). Pour la version anglaise, ajoutez `mon-article.en.md`
à côté, avec exactement le même nom de base.

Si une seule langue existe, elle est servie aux deux publics, avec une
mention qui le signale.

## 2. Remplir l'en-tête

```markdown
---
title: "Le titre de l'article"
excerpt: "Deux phrases qui donnent envie de cliquer. Visible sur /blog."
rubric: lecture
date: 2026-08-28
author: "L'équipe LinQfolio"
authorRole: "Rédaction"
featured: false
---

Le texte de l'article commence ici.
```

| Champ        | Obligatoire | Détail                                                        |
| ------------ | ----------- | ------------------------------------------------------------- |
| `title`      | oui         | Sans titre, l'article est ignoré (pratique pour un brouillon). Il est composé sur la couverture du livre : visez 8 mots au maximum. |
| `date`       | oui         | Format `AAAA-MM-JJ`. Trie le journal, du plus récent au plus ancien. |
| `excerpt`    | recommandé  | Résumé affiché à la une et dans « Lire aussi ».                |
| `rubric`     | recommandé  | `lecture`, `communaute`, `coulisses` ou `produit`. Défaut : `lecture`. Détermine la reliure. |
| `author`     | recommandé  | Signature, imprimée en bas de la couverture.                   |
| `authorRole` | non         | Ex. « Rédaction », « Produit ». Visible sur la page de l'article. |
| `featured`   | non         | `true` place l'article à la une, avec le signet. Le plus récent gagne. |
| `minutes`    | non         | Impose un temps de lecture (ex. `6`) au lieu du calcul automatique. |
| `note`       | non         | À la une uniquement : la note manuscrite épinglée sur le livre. Une poignée de mots. |

Le temps de lecture est calculé automatiquement (200 mots/minute, arrondi
au supérieur). Ne le saisissez que si vous voulez imposer une valeur
précise, avec `minutes`.

## 3. Écrire

Markdown courant : `##` et `###` pour les intertitres, `**gras**`,
`*italique*`, `[lien](https://…)`, `> citation`, listes à puces ou
numérotées, `---` pour un filet, `![alt](/chemin.webp)` pour une image.

Deux détails maison :

- `--` entouré d'espaces devient un tiret cadratin (—).
- Les espaces avant `? ! ; :`, à l'intérieur des guillemets `« »` et dans
  les milliers (`40 000`) deviennent des espaces fines insécables.

## 4. Les blocs éditoriaux

Trois blocs vont au-delà du Markdown courant. Ils s'ouvrent et se ferment
par une ligne `:::`.

### L'encart d'Octave

```markdown
:::octave
Demandez-moi mes vingt livres préférés et on se reparle au prochain
Salon du Livre.
:::
```

La signature « Octave · le hibou éditorialiste » et le hibou sont ajoutés
automatiquement : n'écrivez que la réplique.

### Le radar Reading DNA

```markdown
:::radar
style: 63
rythme: 47
structure: 40
thèmes: 47
complexité: 47
caption: La légende sous la figure.
:::
```

Une ligne par dimension, de 3 à 8 axes, valeurs de 0 à 100. Chaque valeur
est écrite à côté de son axe, donc rien n'est caché derrière la courbe.

### La rangée de chiffres

```markdown
:::stats
meter: 87 | Compatibilité d'un livre
tile: Recommandations | alignées sur vos goûts
tile: Mystery Book | défi quotidien | ?
caption: La légende sous la figure.
:::
```

`meter:` est un pourcentage : il reçoit une jauge (piste claire,
remplissage violet), comme la progression de lecture dans l'app. `tile:`
prend un titre, un sous-titre, et un signe facultatif en troisième champ.
N'utilisez `meter:` que pour un vrai ratio — un libellé n'est pas un
chiffre.

## 5. Vérifier

```bash
npm run dev   # puis http://localhost:3000/blog
```

## Ajouter une rubrique

Une seule ligne dans [`lib/blog/rubrics.ts`](../../lib/blog/rubrics.ts) :
un identifiant, un dégradé de reliure, une teinte, un libellé FR et EN.
Les dégradés n'utilisent que des tokens existants (`--violet`, `--plum`,
`--glow`, `--lilac`, l'or `#e2b04a`) : n'introduisez pas de couleur neuve.
Ajoutez `tone: "light"` pour une reliure claire, qui passe le texte en encre.
Le filtre de la page `/blog` se met à jour tout seul.
