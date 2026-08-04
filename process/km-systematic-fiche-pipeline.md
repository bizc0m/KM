# KM Systematic Fiche Pipeline

## Type

Process KM.

## Tags

km, ingestion, fiche, automation, dashboard

## Résumé court

Toute entrée doit devenir une fiche Markdown normalisée avant d'apparaître dans KM Search.

## Règle maître

Pas de fiche = pas de dashboard.

## Commande

```bash
./km-add.sh --type watch --url "https://example.com" --tags "outil,veille"
```

Livre depuis photo lue par agent :

```bash
./km-add.sh --type book --title "Titre du livre" --source "photo utilisateur, image non stockee" --summary "Résumé court" --tags "livre,theme"
```

Rouge :

```bash
./km-add.sh --type rouge --title "Nom outil" --url "https://example.com" --tags "#ROUGE,security" --summary "Veille defensive uniquement."
```

## Sorties

- fiche `.md` dans le bon dossier ;
- `index.md` mis à jour ;
- index spécialisé mis à jour si applicable ;
- `km/history.md` mis à jour si présent ;
- dashboard reconstruit ;
- DB chiffrée reconstruite si `KM_DB_PASSWORD` est défini.

## Classification

- `actif` : public possible ;
- `a verifier` : visible avec prudence ;
- `sensible` : visible interne seulement ;
- `#ROUGE` : à connaître pour défense, pas à diffuser en public ;
- `privé` : hors dashboard public.

## Garde-fous

- Ne pas stocker photo brute.
- Ne pas stocker PDF/livre complet.
- Ne pas stocker secrets, tokens, emails privés ou chemins personnels exportables.
- Les fiches `#ROUGE` doivent rester séparées ou chiffrées.

## Historique

### v0.1 - 2026-06-24

- Objectif : rendre la création de fiche systématique.
- Fichiers touchés : `scripts/km-add.mjs`, `km-add.sh`, `process/km-systematic-fiche-pipeline.md`.
- Risques : build public encore limité à `watch/` dans la version actuelle.
- Rollback possible : supprimer le script et restaurer l'ancien `km-add.sh`.
