# Prompt Cache - Semantic LLM Cache

## Type

Veille liens utilisateur / cache semantique LLM.

## Tags

#llm, #cache, #cost-optimization, #semantic-search, #proxy, #sensible

## Appel canonique

`watch:prompt-cache-semantic-llm-cache`

## Sources

- Repo GitHub : `https://github.com/messkan/prompt-cache`
- Source sociale : `https://x.com/tom_doerr/status/2087156753204973610?s=12`

Lecture KM : 2026-08-12

Source sociale :

- titre lu : reduction des couts LLM par cache semantique intelligent
- date : 2026-08-11T12:38:42Z
- auteur/source : `tom_doerr`
- lien resolu : `https://github.com/messkan/prompt-cache`

Verification GitHub API :

- repo : `messkan/prompt-cache`
- description : proxy LLM en Go pour cache semantique, optimisation couts et reponses rapides
- etoiles relevees : 357
- forks releves : 37
- licence : MIT
- archived : false
- dernier push lu : 2026-08-11T16:47:43Z
- topics releves : ai, cache, claude, cost-optimization, go, langchain, llm, middleware, openai, performance, rag, semantic-search

## Resume court

Prompt Cache - Semantic LLM Cache is a KM watch item classified as Veille liens utilisateur / cache semantique LLM. The final source is preserved in the fiche and must be verified before product use, public reuse or operational integration.

## Classification

`sensible`

Raison : un cache LLM peut conserver prompts, reponses, contexte projet, fragments de code, donnees client ou informations confidentielles.

## Usage KM

- Evaluer comme brique locale de reduction de couts LLM.
- Comparer avec gateway, memoisation applicative et caches RAG.
- Tester uniquement sur prompts factices avant tout usage projet.

## Risque d'abus possible

| Risque | Description | Classement |
| --- | --- | --- |
| Retention de prompts | stockage durable de prompts ou reponses contenant donnees privees | sensible |
| Collision semantique | reutilisation d'une reponse proche mais fausse pour un autre contexte | sensible |
| Observabilite | proxy place entre app et fournisseur LLM, donc point de collecte central | sensible |

## Garde-fous

- Ne jamais cacher secrets, tokens, emails prives, donnees personnelles ou briefs clients non nettoyes.
- Prevoir TTL, purge, chiffrement et separation par projet/utilisateur.
- Verifier precision du matching avant usage en production.

## Relations

- `watch:agentsview-session-intelligence`
- `watch:tencentdb-agent-memory`
- `watch:graft-codebase-context-for-coding-agents`

## Changelog

### v0.1 - 2026-08-12

- Objectif : integrer le lien X fourni et le depot resolu `messkan/prompt-cache`.
- Fichiers touches : `watch/prompt-cache-semantic-llm-cache.md`, `watch/index.md`, `index.md`, `km/history.md`, `search-v1.11.html`.
- Risques : cache de prompts, contexte prive, collisions semantiques et logs.
- Rollback possible : supprimer cette fiche et retirer les lignes d'index.
