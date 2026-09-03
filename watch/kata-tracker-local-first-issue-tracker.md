# Kata Tracker Local-First Issue Tracker

## Type

Veille Raindrop KM Monitor / outil issue tracking local-first pour humains et agents de code.

## Tags

#issue-tracking, #agents, #local-first, #project-management, #devtools

## Appel canonique

`watch:kata-tracker-local-first-issue-tracker`

## Sources

- Source Raindrop : `KM Monitor public feed`
- URL finale verifiee : `https://www.katatracker.com/`
- Domaine : `katatracker.com`
- Curateur Raindrop : `KM Monitor`
- Date Raindrop : `2026-08-27T12:36:43.532Z`

## Resume court

Kata se presente comme un issue tracker leger, local-first, concu pour des humains et des agents de code. Le signal est pertinent pour suivre les outils de coordination projet ou les workflows ou des agents IA manipulent des tickets locaux.

## Usage KM

- Evaluer si l'outil peut remplacer ou completer un backlog local pour projets Codex/Claude/agents.
- Comparer l'ergonomie avec NotePlan, GitHub Issues, Linear, Todoist/TickTick et les fichiers Markdown locaux.
- Verifier le format de stockage local, l'export, l'integration Git et la maniere dont les agents lisent/modifient les tickets.

## Risque d'abus possible

- `sensible` : un issue tracker local peut contenir objectifs projet, clients, secrets accidentels, chemins locaux ou contexte proprietaire.
- Risque d'injection indirecte si des agents executent des consignes trouvees dans des tickets sans validation humaine.
- Pas de classification `#ROUGE` : l'item n'est pas un outil offensif directement abusable d'apres la source publique consultee.

## Classification

`actif`

## A verifier

- Modele de donnees exact : fichiers locaux, base embarquee ou service cloud.
- Licence, prix, possibilite d'export et compatibilite multi-machine.
- Comportement avec des agents de code : permissions, journalisation, conflits, rollback.

## Relations

- `watch:index`
- `km:history`

## Changelog

### v0.1 - 2026-08-27

- Objectif : integrer la nouveaute Raindrop KM Monitor `kata`.
- Fichiers touches : `watch/kata-tracker-local-first-issue-tracker.md`, `watch/index.md`, `index.md`, `km/history.md`.
- Risques : tickets locaux sensibles, injection de consignes pour agents, compatibilite multi-machine a verifier.
- Rollback possible : supprimer cette fiche et retirer les lignes d'index.
