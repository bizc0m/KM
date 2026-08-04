# TencentDB Agent Memory - Local Agent Memory

## Type

Veille Raindrop KM Monitor / memoire long terme pour agents IA.

## Tags

raindrop-km-monitor, agents, memory, vector-search, local-first, github, sensible

## Appel canonique

`watch:tencentdb-agent-memory`

## Sources

- Raindrop KM Monitor : `https://arno-vltn.raindrop.page/km-monitor-71629567`
- Repo GitHub : `https://github.com/TencentCloud/TencentDB-Agent-Memory`

Lecture KM : 2026-07-11

Source Raindrop :

- titre : `TencentCloud/TencentDB-Agent-Memory: TencentDB Agent Memory delivers fully local long-term memory for AI Agents via a 4-tier progressive pipeline, with zero external API dependencies.`
- date : 2026-07-11T09:07:49.887Z
- domaine : `github.com`
- auteur/source : `arnaud-velten`
- tags detectes : aucun tag Raindrop

Source GitHub publique :

- depot : `TencentCloud/TencentDB-Agent-Memory`
- licence : NOASSERTION
- etoiles relevees : 8404
- topics releves : agent, ai-agent, embedding, llm, local-first, long-term-memory, memory, vector-search
- derniere activite relevee : 2026-07-11T11:20:49Z

## Resume court

Projet TencentCloud pour memoire long terme locale d'agents IA via pipeline progressif et recherche vectorielle, sans dependance API externe annoncee. Utile pour comparer les architectures de memoire agentique et les risques de persistance.

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
