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

## Changelog

### v0.1 - 2026-05-19

- Objectif : unifier KM sous `###DEV/KM`.
- Fichiers touches : `README.md`, `km/index.md`, `km/history.md`, `sources.md`, `resources/`, `themes/`, `process/`, `archive/claude-km/`.
- Risques : copies dupliquees avec anciens emplacements.
- Rollback possible : supprimer `###DEV/KM` et garder les sources historiques.
