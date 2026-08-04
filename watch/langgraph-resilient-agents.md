# LangGraph - Resilient Agents

## Type

Veille framework IA / agents resilients.

## Tags

agents, langchain, graph, workflows, state, github

## Appel canonique

`watch:langgraph-resilient-agents`

## Sources

- Raindrop KM Monitor : `https://arno-vltn.raindrop.page/km-monitor-71629567`
- Repo GitHub : `https://github.com/langchain-ai/langgraph`

Lecture KM : 2026-06-24

Source Raindrop :

- titre : `langchain-ai/langgraph`
- date : 2026-06-24T16:23:02.647Z
- domaine : `github.com`
- auteur/source : `arnaud-velten`
- tags detectes : aucun tag Raindrop

## Resume court

LangGraph est un framework pour construire des agents resilients et stateful. La fiche suit les patterns graphes, etats, reprises et workflows agentiques.

## Classification

`actif`

Raison : framework d'orchestration agentique sans signal offensif direct ; les risques dependent des outils branches.

## Usage KM

- Suivre les architectures agentiques stateful.
- Comparer graphes, checkpoints et workflows.
- Identifier les patterns utiles pour agents robustes.

## Risque d'abus possible

| Risque | Description | Classement |
| --- | --- | --- |
| Outils connectes | risques herites des actions externes branchees | sensible |
| Memoire | stockage d'etats contenant donnees sensibles | sensible |
| Autonomie | boucles agentiques non supervisees | sensible |

## Garde-fous

- Scopes d'outils limites.
- Journalisation et arrets de securite.
- Eviter secrets et donnees personnelles dans les checkpoints.

## Relations

- `watch:crewai-agent-orchestration`
- `watch:nanoclaw-personal-agent`
- `watch:autoresearchclaw-autonomous-research`

## Changelog

### v0.1 - 2026-06-24

- Objectif : integrer LangGraph depuis Raindrop KM Monitor.
- Fichiers touches : `watch/langgraph-resilient-agents.md`, `watch/index.md`, `index.md`, `km/history.md`.
- Risques : agents stateful et outils connectes.
- Rollback possible : supprimer cette fiche et retirer les lignes d'index.
