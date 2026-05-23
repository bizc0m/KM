# KM

## Role

Racine canonique du Knowledge Management.

KM sert a centraliser les fiches, ressources, themes, process, veille et archives utiles aux projets sans melanger les projets produit avec les documents transversaux.

## Structure

| Dossier | Role | Appel |
| --- | --- | --- |
| `km/` | Fiches Markdown structurees issues de `#km` | `km:<slug>` |
| `resources/` | Documents sources et references canoniques | `resource:<dossier>/<fichier>` |
| `themes/` | Themes transversaux | `theme:<slug>` |
| `process/` | Prompts, procedures, outils IA | `process:<slug>` |
| `watch/` | Veille et radars | `watch:<slug>` |
| `inbox/` | Zone temporaire avant tri | `inbox:<slug>` |
| `archive/` | Anciennes bases KM conservees | `archive:<slug>` |

## Regles

- Ne pas supprimer les anciens emplacements sans validation.
- Copier d'abord, dedupliquer ensuite.
- Toute fiche `#km` va dans `km/`.
- Tout document source va dans `resources/`.
- Tout principe transversal va dans `themes/`.
- Toute procedure ou prompt reutilisable va dans `process/`.
- Toute veille externe va dans `watch/`.
- Aucun secret, token, email, identifiant prive ou chemin personnel dans les exports publics.

## Appels canoniques

- Fiche KM : `km:<slug>`
- Ressource : `resource:<dossier>/<fichier-sans-extension>`
- Theme : `theme:<slug>`
- Process : `process:<slug>`
- Veille : `watch:<slug>`

## Front recherche

- Fichier : `search.html`
- Usage : ouvrir directement le fichier dans un navigateur.
- Regeneration : `node scripts/build-search-html.mjs`
- Principe : HTML autonome avec index embarque depuis `km/`, `watch/`, `themes/`, `process/` et les index racine.
- Garde-fou : ne pas indexer `resources/`, `archive/` ou `inbox/` avant nettoyage privacy.

## Versions front recherche

| Version | Fichier | Generateur | Statut |
| --- | --- | --- | --- |
| v1.1 | `search.html` | `scripts/build-search-html.mjs` | stable |
| v1.3 | `search-v1.3.html` | `scripts/build-search-v1.3-html.mjs` | +0.2, version separee |
| v1.4 | `search-v1.4.html` | `scripts/build-search-v1.4-html.mjs` | zones longues retirees |
| v1.5 | `search-v1.5.html` | `scripts/build-search-v1.5-html.mjs` | corpus simplifie, fiche detaillee |
| v1.6 | `search-v1.6.html` | `scripts/build-search-v1.6-html.mjs` | vue publique nettoyee |
| v1.7 | `search-v1.7.html` | `scripts/build-search-v1.7-html.mjs` | vue publique deux colonnes avec viewer Markdown |
| v1.8 | `search-v1.8.html` | `scripts/build-search-v1.8-html.mjs` | tags thematiques, date inline, liens cliquables |

## Changelog

### v0.1 - 2026-05-19

- Objectif : unifier KM sous `###DEV/KM`.
- Fichiers touches : `README.md`, `km/index.md`, `km/history.md`, `sources.md`, `resources/`, `themes/`, `process/`, `archive/claude-km/`.
- Risques : copies dupliquees avec anciens emplacements.
- Rollback possible : supprimer `###DEV/KM` et garder les sources historiques.

### v0.2-search - 2026-05-23

- Objectif : ajouter un front autonome de recherche KM.
- Fichiers touches : `search.html`, `scripts/build-search-html.mjs`, `README.md`.
- Risques : index embarque a regenerer apres nouveaux ajouts KM.
- Rollback possible : supprimer `search.html` et `scripts/build-search-html.mjs`.

### v0.3-search-v1.3 - 2026-05-23

- Objectif : creer une version +0.2 du front sans ecraser la version stable.
- Fichiers touches : `search-v1.3.html`, `scripts/build-search-v1.3-html.mjs`, `README.md`.
- Risques : deux versions a maintenir si le schema KM change.
- Rollback possible : supprimer `search-v1.3.html` et `scripts/build-search-v1.3-html.mjs`.

### v0.4-search-v1.4 - 2026-05-23

- Objectif : retirer les zones longues floutees de l'interface et de l'index embarque.
- Fichiers touches : `search-v1.4.html`, `scripts/build-search-v1.4-html.mjs`, `README.md`.
- Risques : recherche moins exhaustive car elle ne parcourt plus le corps complet des fiches Markdown.
- Rollback possible : revenir a `search-v1.3.html` ou supprimer `search-v1.4.html` et son generateur.

### v0.5-search-v1.5 - 2026-05-23

- Objectif : simplifier les cartes Corpus et remettre la fiche detaillee dans la colonne Fiche.
- Fichiers touches : `search-v1.5.html`, `scripts/build-search-v1.5-html.mjs`, `README.md`.
- Risques : la colonne Fiche expose plus de contenu Markdown dans l'HTML autonome ; verifier privacy avant partage.
- Rollback possible : revenir a `search-v1.4.html` ou supprimer `search-v1.5.html` et son generateur.

### v0.6-search-v1.6 - 2026-05-23

- Objectif : produire une vue publique nettoyee sans references repo prive, Charte IA ou projets internes visibles.
- Fichiers touches : `search-v1.6.html`, `scripts/build-search-v1.6-html.mjs`, `README.md`.
- Risques : detail Markdown filtre, donc certaines lignes sources ne sont pas affichees dans cette vue.
- Rollback possible : revenir a `search-v1.5.html` ou supprimer `search-v1.6.html` et son generateur.

### v0.7-search-v1.7 - 2026-05-23

- Objectif : retirer la colonne Index, clarifier Corpus et afficher les fiches via un viewer Markdown.
- Fichiers touches : `search-v1.7.html`, `scripts/build-search-v1.7-html.mjs`, `README.md`.
- Risques : rendu Markdown volontairement simple, sans parser complet.
- Rollback possible : revenir a `search-v1.6.html` ou supprimer `search-v1.7.html` et son generateur.

### v0.8-search-v1.8 - 2026-05-23

- Objectif : aligner date/titre, ajouter 12 themes couleurs et rendre les liens HTML cliquables dans la fiche.
- Fichiers touches : `search-v1.8.html`, `scripts/build-search-v1.8-html.mjs`, `README.md`.
- Risques : classification couleur automatique imparfaite selon les tags.
- Rollback possible : revenir a `search-v1.7.html` ou supprimer `search-v1.8.html` et son generateur.
