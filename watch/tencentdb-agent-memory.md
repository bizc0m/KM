# TencentDB Agent Memory - Local Agent Memory

## Type

Veille Raindrop KM Monitor / memoire long terme pour agents IA.

## Tags

#agents, #memory, #vector-search, #local-first, #github, #sensible

## Appel canonique

`watch:tencentdb-agent-memory`

## Sources
- Repo GitHub : `https://github.com/TencentCloud/TencentDB-Agent-Memory`

Lecture KM : 2026-07-11

Source Raindrop :

- titre : `TencentCloud/TencentDB-Agent-Memory: TencentDB Agent Memory delivers fully local long-term memory for AI Agents via a 4-tier progressive pipeline, with zero external API dependencies.`
- date : 2026-07-11T09:07:49.887Z
- domaine : `github.com`
- auteur/source : `source-raindrop-anonymisee`
- tags detectes : aucun tag Raindrop

Source GitHub publique :

- depot : `TencentCloud/TencentDB-Agent-Memory`
- licence : NOASSERTION
- etoiles relevees : 8404
- topics releves : agent, ai-agent, embedding, llm, local-first, long-term-memory, memory, vector-search
- derniere activite relevee : 2026-07-11T11:20:49Z

Source Raindrop secondaire dedupliquee :

- date : 2026-08-07T19:19:38.301Z
- titre : `Repositorio:`
- source sociale : [https://x.com/franpradasai/status/2085663764100337989?s=12](https://x.com/franpradasai/status/2085663764100337989?s=12)
- lien resolu : `https://github.com/TencentCloud/TencentDB-Agent-Memory`
- decision : pas de nouvelle fiche, deja couvert par `watch:tencentdb-agent-memory`.

## Metadata GitHub publique

Releve API GitHub : 2026-08-21

- repo : `TencentCloud/TencentDB-Agent-Memory`
- URL : `https://github.com/TencentCloud/TencentDB-Agent-Memory`
- description : TencentDB Agent Memory is a team-level memory hub for AI Agents — turning conversations, docs, and code into four reusable memory assets (Chat Memory, Skill, LLM-Wiki, Code-Graph) that are governed, shared, and equipped across agents and frameworks.
- licence : NOASSERTION
- etoiles relevees : 23563
- topics releves : agent, ai-agent, embedding, llm, local-first, long-term-memory, memory, openclaw-plugin, vector-search
- derniere activite relevee : 2026-08-15T10:06:58Z
- archived : non
- fork : non

Note : metadata volatile, a reverifier avant decision produit ou execution locale.

## Resume court

TencentDB Agent Memory - Local Agent Memory is a KM watch item classified as Veille Raindrop KM Monitor / memoire long terme pour agents IA. The final source is preserved in the fiche and must be verified before product use, public reuse or operational integration.

## Classification

`sensible`

Raison : la memoire agentique peut stocker contexte projet, secrets, donnees personnelles ou traces de travail. Le caractere local-first reduit certains risques mais ne supprime pas le besoin de hygiene.

## Usage KM

- Comparer avec les besoins de memoire durable Codex / Cursor / Claude.
- Identifier des patterns de retention, eviction et recherche vectorielle.
- Alimenter les garde-fous "ne pas memoriser secrets".

## Risque d'abus possible

| Risque | Description | Classement |
| --- | --- | --- |
| Retention sensible | memorisation durable de secrets ou donnees client | sensible |
| Reidentification | embeddings et traces peuvent exposer contexte prive | sensible |
| Licence | licence GitHub non affirmee par l'API publique au moment du releve | a verifier |

## Garde-fous

- Ne jamais indexer secrets, tokens, emails prives ou donnees personnelles inutiles.
- Prevoir purge, chiffrement et scope projet avant toute adoption.
- Verifier licence et architecture avant usage produit.

## Relations

- `watch:ahora-puedes-darle-memoria-infinita-a-claude-codex-y-cursor`
- `watch:acaban-de-darle-memoria-infinita-a-claude-codex-y-cursor`
- `process:km-auto-operating-prompt-v1.0`

## Changelog

### v0.1 - 2026-07-11

- Objectif : integrer le nouveau signal TencentDB Agent Memory depuis Raindrop KM Monitor.
- Fichiers touches : `watch/tencentdb-agent-memory.md`, `watch/index.md`, `index.md`, `km/history.md`.
- Risques : memoire persistante, embeddings, secrets et donnees personnelles.
- Rollback possible : supprimer cette fiche et retirer les lignes d'index.

### v0.2 - 2026-08-09

- Objectif : rattacher la source sociale Raindrop `Repositorio:` resolue vers le meme depot.
- Fichiers touches : `watch/tencentdb-agent-memory.md`.
- Risques : aucun nouveau risque au-dela de la memoire agentique deja classee sensible.
- Rollback possible : retirer le bloc `Source Raindrop secondaire dedupliquee`.
