# Alook - AI Workforce Collaboration

## Type

Veille Raindrop KM Monitor / orchestration d'agents collaboratifs.

## Tags

#agents, #multi-agent, #email, #memory, #collaboration, #github, #sensible

## Appel canonique

`watch:alook-ai-workforce-collaboration`

## Sources
- Repo GitHub : `https://github.com/alookai/alook`

Lecture KM : 2026-07-11

Source Raindrop :

- titre : `alookai/alook: The collaboration layer for your AI workforce. Run your personal AI company.`
- date : 2026-07-11T09:02:54.802Z
- domaine : `github.com`
- auteur/source : `source-raindrop-anonymisee`
- tags detectes : aucun tag Raindrop

Source GitHub publique :

- depot : `alookai/alook`
- licence : Apache-2.0
- etoiles relevees : 864
- topics releves : agent-automation, ai-agents, ai-collaboration, ai-memory, autonomous-agents, claude-code, codex, multi-agent
- derniere activite relevee : 2026-07-11T11:00:26Z

## Metadata GitHub publique

Releve API GitHub : 2026-08-21

- repo : `alookai/alook`
- URL : `https://github.com/alookai/alook`
- description : Rooms for people and agents.
- licence : Apache-2.0
- etoiles relevees : 1157
- topics releves : agent-automation, agent-orchestration, agent-workflow, ai-agents, ai-collaboration, ai-memory, ai-workforce, autonomous-agents, claude-code, claude-code-skills, codex, coding-agent, multi-agent, multiple-agent, one-person-business, one-person-company, one-person-team, opencode, solopreneur
- derniere activite relevee : 2026-08-21T08:52:36Z
- archived : non
- fork : non

Note : metadata volatile, a reverifier avant decision produit ou execution locale.

## Resume court

Alook - AI Workforce Collaboration is a KM watch item classified as Veille Raindrop KM Monitor / orchestration d'agents collaboratifs. The final source is preserved in the fiche and must be verified before product use, public reuse or operational integration.

## Classification

`sensible`

Raison : orchestration multi-agents avec email et memoire. Risque de fuite de contexte, actions externes non supervisees et automatisation de workflows metier.

## Usage KM

- Comparer aux patterns internes d'orchestration d'agents.
- Surveiller les integrations Codex / Claude Code / OpenCode.
- Extraire des garde-fous pour email, memoire et delegation multi-agents.

## Risque d'abus possible

| Risque | Description | Classement |
| --- | --- | --- |
| Email agentique | envoi ou lecture de messages sans validation suffisante | sensible |
| Memoire partagee | retention de contexte projet, comptes ou donnees personnelles | sensible |
| Actions autonomes | delegation multi-agent difficile a auditer | sensible |

## Garde-fous

- Ne pas connecter a email, comptes ou secrets sans sandbox et validation humaine.
- Journaliser les actions d'agents et limiter les permissions par role.
- Verifier les flux de memoire avant adoption.

## Relations

- `watch:agency-agents-ai-agency`
- `watch:cloudflare-agentic-inbox`
- `watch:nousresearch-hermes-agent`

## Changelog

### v0.1 - 2026-07-11

- Objectif : integrer le nouveau signal Alook depuis Raindrop KM Monitor.
- Fichiers touches : `watch/alook-ai-workforce-collaboration.md`, `watch/index.md`, `index.md`, `km/history.md`.
- Risques : agents autonomes, email, memoire et actions externes.
- Rollback possible : supprimer cette fiche et retirer les lignes d'index.
