# KM Search v2 - Doc de travail autonome pour Chat/GPT

## Objectif

Continuer seul les retouches de l'interface KM Search et/ou les mises a jour de fiches KM, sans inventer de donnees et sans push non autorise.

## Chemin

Depot local :

`/Users/JOB/#DEV/06-km/KM`

Dashboard v2 attendu :

`search-v2.html`

Generateur a modifier :

`scripts/build-search-v1.12-html.mjs`

Script maintenance fiches/topics :

`scripts/km-update-github-topics.mjs`

Commande de build :

`node scripts/build-search-v1.12-html.mjs`

Commande topics :

`node scripts/km-update-github-topics.mjs`

## Regles

- Modifier le generateur, pas le HTML final a la main.
- Ne pas supprimer de fiche Markdown sans demande explicite.
- Pour retirer une fiche de l'interface, l'exclure du dashboard via le generateur.
- Ne pas toucher aux liens, actions, filtres ou contenus des fiches sauf demande explicite.
- Pour les topics GitHub, utiliser uniquement les topics reels renvoyes par GitHub.
- Si un depot GitHub renvoie 404 ou erreur API, le signaler en `A_VERIFIER`; ne pas inventer.
- Ne jamais stocker tokens, emails prives, secrets, chemins personnels exposables ou contenu copyright complet.
- Toujours verifier dans le navigateur local apres build.
- Ne pas faire de `git push` sans demande explicite.

## Etat v2 attendu

- Page principale : `search-v2.html`.
- Titre et badge : `KM Search v2`.
- Le bouton RSS orange avec symbole RSS est a cote du numero de version.
- Chaque carte affiche :
  - titre,
  - type,
  - description courte limitee a deux lignes,
  - ligne de liens : `GITHUB`, puis `WEB` si disponible, puis `ORIGINE`, puis `FICHE`,
  - fonction,
  - tags cliquables,
  - topics GitHub cliquables si disponibles.
- Aucun bouton visible `SELECTION`.
- Aucun libelle visible `FICHE GITHUB`.
- DemoForge est masque du dashboard, mais `watch/demoforge-scene.md` reste conserve.
- Le prefixe `Veille Raindrop KM Monitor` ne doit plus apparaitre dans les fiches ni dans le HTML.
- Les fiches avec `Type` vide doivent avoir un type minimal deduit des tags existants seulement.
- Les topics GitHub doivent etre affiches en liens cliquables vers `https://github.com/topics/<topic>`.

## Etat fiches/topics attendu

- Les dossiers publies sont parcourus depuis `km.config.json`.
- `scripts/km-update-github-topics.mjs` nettoie le prefixe Raindrop, corrige les `Type` vides et ajoute/actualise `## Topics GitHub`.
- Dernier controle connu : 153 fiches visibles, 51 fiches avec `## Topics GitHub`, 54 types vides corriges.
- Depots a verifier vus en 404 GitHub :
  - `cheahjs/free-llm-api-resources`
  - `zlh-428/open-maestri`

## Verification minimale

Apres build, controler :

```bash
node --check scripts/build-search-v1.12-html.mjs
node --check scripts/km-update-github-topics.mjs
node scripts/km-update-github-topics.mjs
node scripts/build-search-v1.12-html.mjs
rg -n "FICHE GITHUB|SELECTION|TYPE ## Tags|Veille Raindrop KM Monitor|Topics releves:" search-v2.html
```

Puis ouvrir :

`http://127.0.0.1:8789/search-v2.html`

Verifier visuellement :

- `v2` visible dans le header.
- RSS orange a cote de `v2`.
- Description presente sur les cartes.
- DemoForge absent de la liste.
- Les tags filtrent la liste au clic.
- Les topics GitHub sont cliquables.
- Aucun `TYPE ## Tags` n'apparait.
- Aucun ancien `FICHE GITHUB` ou `SELECTION` n'apparait.

## Etat Git connu

Etat connu au 2026-09-04 sur `Mac-001.lan` :

- branche : `main`
- remote : `https://github.com/bizc0m/KM.git`
- etat : `ahead 1, behind 10`
- risque : push direct bloque/risque de conflit tant que le remote n'est pas integre proprement.

Avant commit :

```bash
git status --short --branch
git diff --stat
```

Committer uniquement les fichiers du perimetre dashboard.

## Prompt pret a coller

Utiliser aussi le fichier :

`km/km-search-v2-gpt-prompt.md`
