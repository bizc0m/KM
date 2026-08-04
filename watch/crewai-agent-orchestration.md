# CrewAI - Agent Orchestration

## Type

Veille framework IA / orchestration multi-agents.

## Tags

agents, orchestration, workflows, automation, github

## Appel canonique

`watch:crewai-agent-orchestration`

## Sources

- Raindrop KM Monitor : `https://arno-vltn.raindrop.page/km-monitor-71629567`
- Repo GitHub : `https://github.com/crewaiinc/crewai`

Lecture KM : 2026-06-24

Source Raindrop :

- titre : `crewAIInc/crewAI: Framework for orchestrating role-playing, autonomous AI agents. By fostering collaborative intelligence, CrewAI empowers agents to work together seamlessly, tackling complex tasks.`
- date : 2026-06-24T16:24:56.066Z
- domaine : `github.com`
- auteur/source : `arnaud-velten`
- tags detectes : aucun tag Raindrop

## Resume court

CrewAI est un framework d'orchestration d'agents autonomes. La fiche suit les patterns multi-agents, roles, workflows et coordination.

## Classification

`actif`

Raison : framework agentique generaliste ; les risques dependent des outils et donnees connectes.

## Usage KM

- Cartographier les frameworks multi-agents.
- Comparer roles, delegation et orchestration.
- Identifier les besoins de supervision et journalisation.

## Risque d'abus possible

| Risque | Description | Classement |
| --- | --- | --- |
| Actions externes | agents connectes a outils tiers sans validation | sensible |
| Donnees sensibles | propagation de secrets ou donnees projet entre agents | sensible |
| Automation abusive | scraping, spam ou workflows non autorises selon outils | #ROUGE si abus externe |

## Garde-fous

- Scopes d'outils minimaux.
- Journalisation des actions agentiques.
- Validation humaine pour actions externes.

## Relations

- `watch:nanoclaw-personal-agent`
- `watch:autoresearchclaw-autonomous-research`
- `watch:red-team-risk-tools-watch`

## Changelog

### v0.1 - 2026-06-24

- Objectif : integrer CrewAI depuis Raindrop KM Monitor.
- Fichiers touches : `watch/crewai-agent-orchestration.md`, `watch/index.md`, `index.md`, `km/history.md`.
- Risques : orchestration agentique dual-use.
- Rollback possible : supprimer cette fiche et retirer les lignes d'index.
