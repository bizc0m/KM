# Aider AI Pair Programming

## Type

Veille outil IA / pair programming terminal.

## Tags

coding, pair-programming, terminal, agent, github

## Appel canonique

`watch:aider-ai-pair-programming`

## Sources

- Raindrop KM Monitor : `https://arno-vltn.raindrop.page/km-monitor-71629567`
- Repo GitHub : `https://github.com/Aider-AI/aider`

Lecture KM : 2026-06-24

Source Raindrop :

- titre : `Aider-AI/aider: aider is AI pair programming in your terminal`
- date : 2026-06-24T16:23:55.339Z
- domaine : `github.com`
- auteur/source : `arnaud-velten`
- tags detectes : aucun tag Raindrop

## Resume court

Aider est un outil de pair programming IA en terminal. La fiche suit les interfaces de modification code via LLM et leurs garde-fous.

## Classification

`actif`

Raison : outil de developpement ; risques lies a la configuration projet et aux secrets, pas a un usage offensif direct dans le signal.

## Usage KM

- Comparer les agents de code en terminal.
- Evaluer les workflows de patch, review et commit.
- Identifier les bonnes pratiques pour limiter la fuite de contexte.

## Risque d'abus possible

| Risque | Description | Classement |
| --- | --- | --- |
| Secrets | inclusion involontaire de fichiers sensibles dans le contexte | sensible |
| Modifications non relues | patchs appliques sans verification | sensible |
| Dependances | commandes ou installations non auditees | sensible |

## Garde-fous

- Exclure secrets et fichiers prives.
- Relire les diffs avant commit.
- Tester sur branche ou sandbox.

## Relations

- `watch:ccgui-mossx-vibecoding-editor`
- `watch:openhands-ai-development`
- `process:km-systematic-fiche-pipeline`

## Changelog

### v0.1 - 2026-06-24

- Objectif : integrer Aider depuis Raindrop KM Monitor.
- Fichiers touches : `watch/aider-ai-pair-programming.md`, `watch/index.md`, `index.md`, `km/history.md`.
- Risques : contexte code et secrets.
- Rollback possible : supprimer cette fiche et retirer les lignes d'index.
