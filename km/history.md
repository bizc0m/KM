# KM History

## Historique

| Date | Action | Fichiers touches | Risques | Rollback |
| --- | --- | --- | --- | --- |
| 2026-05-19 | Creation racine KM canonique | `README.md`, `km/`, `resources/`, `themes/`, `process/`, `watch/`, `inbox/`, `archive/` | Duplication temporaire | Supprimer `###DEV/KM` |
| 2026-05-19 | Copie des ressources CODEX | `resources/` | Divergence si anciennes sources evoluent | Resynchroniser depuis `CODEX/resources/` |
| 2026-05-19 | Copie des themes CODEX | `themes/` | Divergence si anciens themes evoluent | Resynchroniser depuis `CODEX/themes/` |
| 2026-05-19 | Archivage Claude KM | `archive/claude-km/` | Archive non dedupliquee | Retirer l'archive |
| 2026-05-19 | Copie des process | `process/` | Chemins personnels a nettoyer avant export | Remplacer par placeholders |
| 2026-05-19 | Creation veille IA | `watch/index.md`, `watch/ai-trending.md` | Source externe volatile | Supprimer `watch/ai-trending.md` |
| 2026-05-22 | Activation KM automatique + index global | `index.md`, `process/km-resource-import-prompt.md` | Classement automatique imparfait | Revenir au prompt v0.2 |
| 2026-05-22 | Integration lot X outils IA/open source | `watch/ai-open-source-tools-watch.md`, `watch/index.md`, `process/AI-Tools.md` | Claims non verifies, OSINT sensible, finance sensible | Supprimer la fiche et retirer les lignes d'index |
| 2026-05-22 | Integration veille OSINT vehicule | `watch/osint-tools-watch.md`, `watch/index.md`, `index.md` | Donnees vehicules privacy-sensitive | Supprimer la fiche et retirer les lignes d'index |
| 2026-05-22 | Inventaire detaille des outils du lot X | `watch/ai-open-source-tools-inventory.md`, `watch/index.md`, `index.md` | Outils non verifies, certains liens manquants | Supprimer la fiche et retirer les lignes d'index |
| 2026-05-22 | Verification liens et log auteurs X | `watch/ai-open-source-tools-inventory.md`, `watch/osint-tools-watch.md`, `watch/x-source-authors-log.md` | Metadonnees X/GitHub variables | Revenir aux fiches v0.2 |
| 2026-05-22 | Scan fit outils/projets | `watch/tool-project-fit-scan.md`, `watch/index.md`, `index.md` | Scan rapide README/index, pas audit complet | Supprimer la fiche et retirer les lignes d'index |
| 2026-05-22 | Prompt KM automatique complet v1.0 | `process/km-auto-operating-prompt-v1.0.md`, `index.md` | Prompt large a maintenir | Revenir a `process/km-resource-import-prompt.md` |
| 2026-05-22 | Classification #ROUGE outils dual-use | `watch/red-team-risk-tools-watch.md`, `watch/ai-open-source-tools-inventory.md`, `process/km-auto-operating-prompt-v1.0.md` | Risque de diffusion offensive | Retirer la fiche #ROUGE et les sections associees |
| 2026-05-22 | Resserrage #ROUGE aux offensifs directs | `watch/red-team-risk-tools-watch.md`, `watch/ai-open-source-tools-inventory.md`, `watch/twitter-rss-monitoring.md`, `watch/inspiration-competitors-tools-watch.md`, `process/km-auto-operating-prompt-v1.0.md` | Sous-classer un outil dual-use | Revenir aux classifications precedentes |
| 2026-05-22 | Methode Twitter/X via RSS | `watch/twitter-rss-monitoring.md`, `watch/index.md`, `index.md` | Risque surveillance/scraping si abus | Supprimer la fiche et retirer les lignes d'index |
| 2026-05-22 | Verification OpenRSS officielle | `watch/twitter-rss-monitoring.md` | Conditions service variables | Retirer le bloc verification OpenRSS |
| 2026-05-22 | Verification Nitter officielle | `watch/twitter-rss-monitoring.md` | Instances/RSS instables | Retirer le bloc verification Nitter |
| 2026-05-22 | Veille inspirations/concurrents/outils | `watch/inspiration-competitors-tools-watch.md`, `watch/index.md`, `index.md` | Risque de copier au lieu d'analyser | Supprimer la fiche et retirer les lignes d'index |
| 2026-05-22 | Ajout Oh My Pizza source veille | `watch/inspiration-competitors-tools-watch.md` | Source personnelle, pas reference officielle | Retirer l'entree Oh My Pizza |
| 2026-05-22 | Integration lot nicos_ai alternatives SaaS | `watch/open-source-saas-alternatives-nicos-ai.md`, `watch/ai-open-source-tools-inventory.md`, `watch/x-source-authors-log.md` | Claims promotionnels, usages sensibles | Supprimer la fiche et retirer les lignes d'index |
| 2026-05-22 | Integration free LLM API resources | `watch/free-llm-api-resources.md`, `watch/index.md`, `index.md` | Providers/limites variables, donnees tiers | Supprimer la fiche et retirer les lignes d'index |

## Notes

Les anciens emplacements restent sources historiques tant que la migration n'est pas terminee.
