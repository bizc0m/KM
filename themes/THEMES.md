# Themes - NightIntel

## Role

Index central des themes transversaux utilises par les projets `*-NightIntel`.

Regle : un theme = un document `.md` dedie. Les projets ne recopient pas tout le theme ; ils pointent vers lui et documentent seulement l'application specifique au projet.

Documents ressources : voir `../resources/RESOURCES.md`.

## Ordre logique

| Ordre | Theme | Document | Statut | Role |
| --- | --- | --- | --- | --- |
| 1 | Night Intel global | `night-intel.md` | v0.1-cadrage | Mission, principes, IA, propagation, anti-derive |
| 2 | Charte IA | `charte-ia.md` | v0.1-cadrage | Relation avec les IA, regles operationnelles, limites |
| 3 | PACTIA | `pactia.md` | v0.1-cadrage | Transformer les chats projet en themes documentes avec lien, resume, fonction, points et concepts |

## Regles de suivi

- Toute nouvelle idee transversale doit etre ajoutee dans un theme, pas directement dans un projet.
- Toute idee projet doit pointer vers le theme parent si elle depend d'un principe global.
- Tout nouveau theme doit avoir : role, principes, decisions, changelog, risques, rollback.
- Toute modification importante doit etre datee dans le changelog du theme.
- Si un theme devient trop large, le scinder en themes plus precis.
- Les documents sources et appels canoniques doivent etre ajoutes dans `../resources/RESOURCES.md`.

## Themes a creer si besoin

| Theme candidat | Raison | Statut |
| --- | --- | --- |
| Privacy & Consent | Regles opt-in, donnees, secrets, export | a creer si plusieurs projets |
| Gamification & Aura | Scores, XP, badges, seuils explicites | a creer avant implementation |
| City Intelligence | Signal, Pulse, Cell, heat, mood, movement | a creer si plusieurs projets l'utilisent |
| Data Sources & Scraping | APIs, scraping, limites, attribution | a creer avant automatisation |
| Bots & Transmissions | Telegram, Discord, ton, cadence | a creer si reutilise hors NightCrawl |
| Intelligence Dashboard UI | Heatmap, score, source atlas, action panels, dashboard SaaS | candidat depuis `resource:nocturne-intel/noctintel-pro-dashboard-chat` |
| No Regression & Agent Safety | Protocoles anti-casse, verification, handoff, tests, Git et limites d'action agent | candidat depuis `resource:noregression/noregression-chat` |
| Nightlife Radar OSINT | Radar multi-villes, events, venues, sources, love signals et cartographie nightlife | candidat depuis `resource:codex5/chat-summary` |
| Gamification Privacy Guardrails | XP, Aura, badges, missions, privacy-first, anti dark-patterns | candidat depuis `resource:nightlife-3darons/product-guardrails` |
| AI Flourishing | PACTE_IA, visions multi-IA, audit ethique, agency humaine | candidat depuis `resource:pacte-visia/pacte-visia-summary` |

## Changelog

### v0.1-cadrage - 2026-05-16

- Objectif : creer l'index central des themes.
- Fichiers touches : `themes/THEMES.md`, `themes/night-intel.md`, `themes/charte-ia.md`, `NightCrawl/NightCrawl-NightIntel.md`.
- Risques : certains themes candidats ne sont pas encore separes.
- Rollback possible : revenir a un document global unique.

### v0.2-pactia - 2026-05-16

- Objectif : ajouter le theme PACTIA demande.
- Fichiers touches : `themes/THEMES.md`, `themes/pactia.md`.
- Ajout : theme de documentation des chats avec lien source, resume, fonction, 10 points et concepts associes.
- Risques : lien chat a renseigner manuellement.
- Rollback possible : retirer `pactia.md` et la ligne PACTIA de cet index.

### v0.3-resources - 2026-05-16

- Objectif : ajouter un index ressources pour unifier noms et appels.
- Fichiers touches : `themes/THEMES.md`, `../resources/RESOURCES.md`, `../resources/nightcrawl/*.md`.
- Risques : duplication entre ressources et originaux.
- Rollback possible : supprimer `../resources/`.

### v0.4-codex5-candidat - 2026-05-16

- Objectif : ajouter le theme candidat Nightlife Radar OSINT issu de la ressource CODEX5.
- Fichiers touches : `themes/THEMES.md`, `../resources/codex5/chat-summary.md`.
- Risques : theme encore large, a scinder plus tard entre data, gamification et UX radar.
- Rollback possible : retirer la ligne candidate.

### v0.4-nightlife-guardrails-candidate - 2026-05-16

- Objectif : proposer le theme transversal `Gamification Privacy Guardrails`.
- Fichiers touches : `themes/THEMES.md`, `../resources/RESOURCES.md`, `../resources/nightlife-3darons/*`.
- Source : `resource:nightlife-3darons/product-guardrails`.
- Risques : theme encore candidat, a separer seulement si reutilise hors NightLife.
- Rollback possible : retirer la ligne candidate.

### v0.5-ai-flourishing-candidate - 2026-05-16

- Objectif : proposer le theme transversal `AI Flourishing`.
- Fichiers touches : `themes/THEMES.md`, `../resources/RESOURCES.md`, `../resources/pacte-visia/*`.
- Source : `resource:pacte-visia/pacte-visia-summary`.
- Risques : theme encore candidat, a separer seulement si reutilise hors PACTE_IA.
- Rollback possible : retirer la ligne candidate.

### v0.4-noregression-candidat - 2026-05-16

- Objectif : proposer le theme transversal No Regression & Agent Safety.
- Source : `resource:noregression/noregression-chat`.
- Risques : a formaliser en theme dedie seulement si plusieurs projets le reutilisent.
- Rollback possible : retirer la ligne candidate et ce changelog.

