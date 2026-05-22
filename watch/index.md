# Watch Index

## Role

Index des sources de veille transversales KM.

## Sources

| Appel | Source | Usage | Statut |
| --- | --- | --- | --- |
| `watch:ai-trending` | `ai-trending.md` | Radar outils IA, tendances GitHub, agents, LLM, RAG, devtools | actif |
| `watch:ai-open-source-tools-watch` | `ai-open-source-tools-watch.md` | Lot X : outils IA/open source, alternatives SaaS, agents, OSINT, local-first | actif |
| `watch:ai-open-source-tools-inventory` | `ai-open-source-tools-inventory.md` | Inventaire detaille : 32 outils nommes uniques extraits du lot X | actif |
| `watch:osint-tools-watch` | `osint-tools-watch.md` | Outils OSINT sensibles : vehicle search, VIN, plaques, historiques vehicules | actif |
| `watch:x-source-authors-log` | `x-source-authors-log.md` | Log des auteurs X utilises comme sources de veille | actif |
| `watch:tool-project-fit-scan` | `tool-project-fit-scan.md` | Matrice outil -> projet utile apres scan local | actif |
| `watch:red-team-risk-tools-watch` | `red-team-risk-tools-watch.md` | Veille `#ROUGE` outils offensifs, abusables ou dual-use | actif |
| `watch:twitter-rss-monitoring` | `twitter-rss-monitoring.md` | Methode RSS pour suivre comptes Twitter/X publics avec garde-fous | actif |
| `watch:inspiration-competitors-tools` | `inspiration-competitors-tools-watch.md` | Sites inspirants, concurrents et outils a surveiller | actif |
| `watch:open-source-saas-alternatives-nicos-ai` | `open-source-saas-alternatives-nicos-ai.md` | Lot nicos_ai : alternatives open source SaaS, dedup et risques | actif |
| `watch:free-llm-api-resources` | `free-llm-api-resources.md` | Fournisseurs LLM gratuits/trials, limites et garde-fous | actif |
| `watch:awesome-free-llm-apis` | `awesome-free-llm-apis.md` | Liste de providers LLM free tier / OpenAI-compatible, cles API et limites | actif |
| `watch:vibeshit-vibe-coding-directory` | `vibeshit-vibe-coding-directory.md` | Annuaire vibe coding : outils IA, agents, LLM, devtools et tendances | actif |
| `watch:agentsview-session-intelligence` | `agentsview-session-intelligence.md` | Outil local-first pour recherche, analytics et couts des sessions agents IA | actif |
| `watch:nanoclaw-personal-agent` | `nanoclaw-personal-agent.md` | Agent IA personnel multi-canaux, containerise, avec vault credentials | actif |
| `watch:autoresearchclaw-autonomous-research` | `autoresearchclaw-autonomous-research.md` | Agent de recherche autonome idee -> papier, avec experiments, citations et HITL | actif |

## Regles

- Une source de veille ne va pas dans un projet produit par defaut.
- Si une veille devient utile a un projet, creer une relation depuis la fiche projet.
- Verifier date, source et volatilite avant decision produit.
- En mode automatique, choisir le slug canonique, creer la fiche, puis mettre a jour `../index.md`.

## Changelog

### v0.2 - 2026-05-22

- Objectif : ajouter le lot X `ai-open-source-tools-watch`.
- Fichiers touches : `watch/index.md`, `watch/ai-open-source-tools-watch.md`, `index.md`.
- Risques : claims externes non verifies.
- Rollback possible : retirer la ligne et supprimer la fiche.

### v0.3 - 2026-05-22

- Objectif : ajouter `osint-tools-watch` depuis Cyb Detective.
- Fichiers touches : `watch/index.md`, `watch/osint-tools-watch.md`, `index.md`.
- Risques : outils vehicle-search privacy-sensitive.
- Rollback possible : retirer la ligne et supprimer la fiche.

### v0.4 - 2026-05-22

- Objectif : ajouter `vibeshit-vibe-coding-directory`.
- Fichiers touches : `watch/index.md`, `watch/vibeshit-vibe-coding-directory.md`, `index.md`.
- Risques : claims externes et outils dual-use a verifier.
- Rollback possible : retirer la ligne et supprimer la fiche.

### v0.5 - 2026-05-22

- Objectif : ajouter `agentsview-session-intelligence`.
- Fichiers touches : `watch/index.md`, `watch/agentsview-session-intelligence.md`, `index.md`, `watch/ai-open-source-tools-inventory.md`.
- Risques : historiques agents sensibles.
- Rollback possible : retirer la ligne et supprimer la fiche.

### v0.6 - 2026-05-22

- Objectif : ajouter `nanoclaw-personal-agent`.
- Fichiers touches : `watch/index.md`, `watch/nanoclaw-personal-agent.md`, `index.md`, `watch/ai-open-source-tools-inventory.md`, `process/AI-Tools.md`.
- Risques : messagerie automatisee, credentials et donnees personnelles.
- Rollback possible : retirer la ligne et supprimer la fiche.

### v0.7 - 2026-05-22

- Objectif : ajouter `autoresearchclaw-autonomous-research`.
- Fichiers touches : `watch/index.md`, `watch/autoresearchclaw-autonomous-research.md`, `index.md`, `watch/ai-open-source-tools-inventory.md`, `process/AI-Tools.md`.
- Risques : claims scientifiques, citations, couts API et publication non verifiee.
- Rollback possible : retirer la ligne et supprimer la fiche.

### v0.8 - 2026-05-22

- Objectif : ajouter `awesome-free-llm-apis`.
- Fichiers touches : `watch/index.md`, `watch/awesome-free-llm-apis.md`, `index.md`, `watch/ai-open-source-tools-inventory.md`, `process/AI-Tools.md`.
- Risques : providers variables, cles API, conditions d'usage et donnees tiers.
- Rollback possible : retirer la ligne et supprimer la fiche.

### v0.1 - 2026-05-19

- Objectif : creer l'index de veille KM.
- Risques : sources externes variables.
- Rollback possible : supprimer `watch/`.
