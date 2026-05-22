# KM Global Index

## Role

Index global de la base KM.

Tout ajout KM doit mettre a jour cet index, puis l'index specialise concerne.

## Entrees principales

| Appel | Fichier | Type | Tags | Statut |
| --- | --- | --- | --- | --- |
| `km:index` | `km/index.md` | index | km | actif |
| `km:history` | `km/history.md` | historique | km, changelog | actif |
| `watch:index` | `watch/index.md` | index | veille | actif |
| `watch:ai-trending` | `watch/ai-trending.md` | veille | ia, github, trending | actif |
| `watch:ai-open-source-tools-watch` | `watch/ai-open-source-tools-watch.md` | veille | ia, open-source, devtools, saas, osint | actif |
| `watch:ai-open-source-tools-inventory` | `watch/ai-open-source-tools-inventory.md` | inventaire | ia, tools, github, inventory | actif |
| `watch:osint-tools-watch` | `watch/osint-tools-watch.md` | veille | osint, vehicle-search, privacy-sensitive | actif |
| `watch:x-source-authors-log` | `watch/x-source-authors-log.md` | source-log | x, authors, watch | actif |
| `watch:tool-project-fit-scan` | `watch/tool-project-fit-scan.md` | matrice | tools, project-fit, km | actif |
| `watch:red-team-risk-tools-watch` | `watch/red-team-risk-tools-watch.md` | veille | #ROUGE, dual-use, risk | actif |
| `watch:twitter-rss-monitoring` | `watch/twitter-rss-monitoring.md` | veille | rss, twitter, x, monitoring | actif |
| `watch:inspiration-competitors-tools` | `watch/inspiration-competitors-tools-watch.md` | veille | inspiration, competitors, tools | actif |
| `watch:open-source-saas-alternatives-nicos-ai` | `watch/open-source-saas-alternatives-nicos-ai.md` | veille | open-source, saas, tools | actif |
| `watch:free-llm-api-resources` | `watch/free-llm-api-resources.md` | veille | llm, api, providers | actif |
| `watch:awesome-free-llm-apis` | `watch/awesome-free-llm-apis.md` | veille | llm, api, free-tier, providers | actif |
| `watch:vibeshit-vibe-coding-directory` | `watch/vibeshit-vibe-coding-directory.md` | veille | vibe-coding, ia, agents, devtools | actif |
| `watch:agentsview-session-intelligence` | `watch/agentsview-session-intelligence.md` | veille | agents, sessions, analytics, local-first | actif |
| `watch:nanoclaw-personal-agent` | `watch/nanoclaw-personal-agent.md` | veille | agents, messaging, containers, credentials | actif |
| `watch:autoresearchclaw-autonomous-research` | `watch/autoresearchclaw-autonomous-research.md` | veille | research-agent, papers, citations, experiments | actif |
| `watch:pentestgpt-autonomous-pentest` | `watch/pentestgpt-autonomous-pentest.md` | veille | #ROUGE, pentest, autonomous-agent, offensive-risk | interne |
| `watch:codepatrol-code-security` | `watch/codepatrol-code-security.md` | veille | code-security, sast, appsec, to-verify | a verifier |
| `theme:index` | `themes/THEMES.md` | index | themes | actif |
| `resource:index` | `resources/RESOURCES.md` | index | ressources | actif |
| `process:km-resource-import-prompt` | `process/km-resource-import-prompt.md` | process | km, import | actif |
| `process:km-auto-operating-prompt-v1.0` | `process/km-auto-operating-prompt-v1.0.md` | process | km, prompt, v1.0 | actif |
| `process:ai-tools` | `process/AI-Tools.md` | process | ia, outils | actif |

## Regle automatique

Quand le contenu est clair, KM choisit automatiquement le nom canonique en kebab-case, cree la fiche, met a jour l'index global, puis met a jour l'index specialise.

Si le contenu est ambigu, sensible ou risque de casser une structure existante, le lot va dans `inbox/`.

## Changelog

### v0.1 - 2026-05-22

- Objectif : ajouter un index global KM et activer le mode automatique.
- Fichiers touches : `index.md`, `watch/index.md`, `watch/ai-open-source-tools-watch.md`, `process/km-resource-import-prompt.md`.
- Risques : classement automatique imparfait.
- Rollback possible : retirer les lignes ajoutees et revenir au prompt avec validation.

### v0.2 - 2026-05-22

- Objectif : ajouter la veille OSINT vehicule avec garde-fous privacy.
- Fichiers touches : `index.md`, `watch/index.md`, `watch/osint-tools-watch.md`, `km/history.md`.
- Risques : sujet privacy-sensitive.
- Rollback possible : retirer l'entree `watch:osint-tools-watch`.

### v0.3 - 2026-05-22

- Objectif : ajouter le prompt KM automatique complet v1.0.
- Fichiers touches : `process/km-auto-operating-prompt-v1.0.md`, `index.md`, `km/history.md`.
- Risques : prompt large a maintenir.
- Rollback possible : retirer l'entree et revenir a `process/km-resource-import-prompt`.

### v0.4 - 2026-05-22

- Objectif : ajouter la source de veille Vibe Shit.
- Fichiers touches : `watch/vibeshit-vibe-coding-directory.md`, `watch/index.md`, `index.md`, `km/history.md`.
- Risques : claims externes variables, certains outils potentiellement dual-use.
- Rollback possible : retirer l'entree `watch:vibeshit-vibe-coding-directory`.

### v0.5 - 2026-05-22

- Objectif : ajouter AgentsView.
- Fichiers touches : `watch/agentsview-session-intelligence.md`, `watch/index.md`, `index.md`, `watch/ai-open-source-tools-inventory.md`, `km/history.md`.
- Risques : lecture d'historiques agents sensibles.
- Rollback possible : retirer l'entree `watch:agentsview-session-intelligence`.

### v0.6 - 2026-05-22

- Objectif : ajouter NanoClaw.
- Fichiers touches : `watch/nanoclaw-personal-agent.md`, `watch/index.md`, `index.md`, `watch/ai-open-source-tools-inventory.md`, `process/AI-Tools.md`, `km/history.md`.
- Risques : messagerie automatisee, credentials et donnees personnelles.
- Rollback possible : retirer l'entree `watch:nanoclaw-personal-agent`.

### v0.7 - 2026-05-22

- Objectif : ajouter AutoResearchClaw.
- Fichiers touches : `watch/autoresearchclaw-autonomous-research.md`, `watch/index.md`, `index.md`, `watch/ai-open-source-tools-inventory.md`, `process/AI-Tools.md`, `km/history.md`.
- Risques : claims scientifiques, citations, couts API et publication non verifiee.
- Rollback possible : retirer l'entree `watch:autoresearchclaw-autonomous-research`.

### v0.8 - 2026-05-22

- Objectif : ajouter Awesome Free LLM APIs.
- Fichiers touches : `watch/awesome-free-llm-apis.md`, `watch/index.md`, `index.md`, `watch/ai-open-source-tools-inventory.md`, `process/AI-Tools.md`, `km/history.md`.
- Risques : providers variables, cles API, conditions d'usage et donnees tiers.
- Rollback possible : retirer l'entree `watch:awesome-free-llm-apis`.

### v0.9 - 2026-05-22

- Objectif : ajouter PentestGPT en veille `#ROUGE`.
- Fichiers touches : `watch/pentestgpt-autonomous-pentest.md`, `watch/red-team-risk-tools-watch.md`, `watch/index.md`, `index.md`, `watch/ai-open-source-tools-inventory.md`, `process/AI-Tools.md`, `km/history.md`.
- Risques : outil offensif directement operationnel.
- Rollback possible : retirer l'entree `watch:pentestgpt-autonomous-pentest`.

### v1.0 - 2026-05-22

- Objectif : traiter le lot OpenRSS, LLM APIs, CodePatrol et NanoClaw FR.
- Fichiers touches : `watch/codepatrol-code-security.md`, `watch/twitter-rss-monitoring.md`, `watch/nanoclaw-personal-agent.md`, `watch/free-llm-api-resources.md`, `watch/awesome-free-llm-apis.md`, `watch/index.md`, `index.md`, `process/AI-Tools.md`, `km/history.md`.
- Risques : CodePatrol source directe non exploitable.
- Rollback possible : retirer l'entree `watch:codepatrol-code-security` et les changelogs de lot.
