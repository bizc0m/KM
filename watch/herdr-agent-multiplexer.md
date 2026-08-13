# Herdr Multiplexer

## Type

Veille Raindrop KM Monitor / orchestration agents terminal.

## Tags

#agents, #terminal, #orchestration, #cli, #sensible

## Appel canonique

`watch:herdr-agent-multiplexer`

## Sources
- Source finale : `https://github.com/herdrdev/herdr`

Lecture KM : 2026-08-09

Source Raindrop :

- titre : `herdrdev/herdr`
- date : 2026-08-07T11:56:59.848Z
- domaine : `github.com`
- auteur/source : `herdrdev`
- tags detectes : aucun tag Raindrop
- note Raindrop : `agent multiplexer that lives in your terminal`

## Resume court

Herdr Multiplexer is a KM watch item classified as Veille Raindrop KM Monitor / orchestration agents terminal. The final source is preserved in the fiche and must be verified before product use, public reuse or operational integration.

## Classification

`sensible`

Raison : outil de pilotage d'agents dans un terminal local ; pas de capacite offensive directe identifiee, mais exposition potentielle du shell, du code, des secrets et des permissions machine.

## Usage KM

- Suivre comme reference d'interface terminal pour coordination multi-agents.
- Comparer avec Open Maestri, Claude Code, Codex CLI et autres orchestrateurs locaux.
- Evaluer seulement dans un repertoire sandbox sans secrets.

## Risque d'abus possible

Execution de commandes non controlees, diffusion de contexte repo prive, lecture de fichiers sensibles ou confusion entre plusieurs agents actifs.

## Points a controler

- Permissions shell et isolation de workspace.
- Modele de logs et conservation des prompts.
- Licence, maturite du projet et limites des commandes deleguees.

## Relations

- `watch:open-maestri-macos-agent-orchestration`
- `watch:macos26-agent-desktop-harness`
- `watch:claude-task-master-ai-task-management`

## Changelog

### v0.1 - 2026-08-09

- Objectif : integrer la nouveaute Raindrop KM Monitor `herdrdev/herdr`.
- Fichiers touches : `watch/herdr-agent-multiplexer.md`, `watch/index.md`, `index.md`, `km/history.md`.
- Risques : shell local, agents concurrents, secrets et contexte repo.
- Rollback possible : supprimer cette fiche et retirer les lignes d'index.
