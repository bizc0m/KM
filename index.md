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
| `watch:vibeshit-vibe-coding-directory` | `watch/vibeshit-vibe-coding-directory.md` | veille | vibe-coding, ia, agents, devtools | actif |
| `watch:agentsview-session-intelligence` | `watch/agentsview-session-intelligence.md` | veille | agents, sessions, analytics, local-first | actif |
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
