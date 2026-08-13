# Resources - NightIntel

## Role

Index central des documents ressources utilises par les projets et themes NightIntel.

Regle : les ressources gardent les sources lisibles et nommees de facon stable. Les projets et themes pointent vers ces ressources au lieu de multiplier les noms differents.

## Nommage canonique

- Dossiers : kebab-case.
- Fichiers : kebab-case `.md`.
- Nom court d'appel : `resource:<dossier>/<fichier-sans-extension>`.
- Les anciens noms restent comme sources historiques, mais les nouveaux appels utilisent les noms canoniques.

## Ressources NightCrawl

| Appel canonique | Fichier ressource | Source originale | Usage |
| --- | --- | --- | --- |
| `resource:nightcrawl/readme` | `nightcrawl/readme.md` | `NightCrawl/README.md` | Vue generale projet |
| `resource:nightcrawl/product-synthesis` | `nightcrawl/product-synthesis.md` | `NightCrawl/NIGHTCRAWL_SYNTHESIS.md` | Synthese produit |
| `resource:nightcrawl/bots-telegram-discord` | `nightcrawl/bots-telegram-discord.md` | `NightCrawl/BOT_TELEGRAM_DISCORD_SPEC.md` | Spec bots |
| `resource:nightcrawl/night-intel-protocol-source` | `nightcrawl/night-intel-protocol-source.md` | `NightCrawl/NIGHT_INTEL_PROTOCOL.md` | Source historique du theme Night Intel |

## Ressources themes

| Appel canonique | Fichier | Usage |
| --- | --- | --- |
| `theme:index` | `../themes/THEMES.md` | Ordre logique des themes |
| `theme:night-intel` | `../themes/night-intel.md` | Theme global Night Intel |
| `theme:charte-ia` | `../themes/charte-ia.md` | Relation avec les IA |
| `theme:pactia` | `../themes/pactia.md` | Documentation des chats et pactes de travail |

## Ressources design

| Appel canonique | Fichier ressource | Source originale | Usage |
| --- | --- | --- | --- |
| `resource:design/urgence-lol-standalone-charte` | `design/urgence-lol-standalone-charte.html` | fichier HTML fourni | Charte visuelle executable complete |
| `resource:design/urgence-lol-design-reference` | `design/urgence-lol-design-reference.md` | fiche creee | Prompt et regles d'application design |

## Ressources Nocturne Intel

| Appel canonique | Fichier ressource | Source originale | Usage | Risques |
| --- | --- | --- | --- | --- |
| `resource:nocturne-intel/noctintel-pro-dashboard-chat` | `nocturne-intel/noctintel-pro-dashboard-chat.md` | Chat Codex sanitise, 2026-05-16 | Continuer le dashboard NoctIntel Pro, scoring, heatmap, sources, UI | Derive visuelle, confusion score/source, liens externes variables |

## Ressources CODEX5

| Appel canonique | Fichier ressource | Source originale | Date | Usage | Risques |
| --- | --- | --- | --- | --- | --- |
| `resource:codex5/chat-summary` | `codex5/chat-summary.md` | Chat Codex sanitise | 2026-05-16 | Synthese d'integration future Urgence V5 / Nightlife Radar | Synthese non exhaustive, verifier avant implementation |
| `resource:codex5/doc-tech` | `codex5/doc-tech.md` | Wiki technique genere depuis le contexte projet | 2026-05-15 | Documentation contributeur / interne | Peut necessiter mise a jour selon code courant |
| `resource:codex5/doc-web` | `codex5/doc-web.md` | Wiki utilisateur genere depuis le contexte projet | 2026-05-15 | Documentation joueur / externe | Vocabulaire a relire avant publication |
| `resource:codex5/doc` | `codex5/doc.zip` | Archive des deux docs wiki | 2026-05-16 | Paquet transportable pour import wiki | Archive a regénérer si docs changent |

## Ressources NightLife

| Appel canonique | Fichier ressource | Source originale | Usage | Risques |
| --- | --- | --- | --- | --- |
| `resource:nightlife-3darons/resource-summary` | `nightlife-3darons/resource-summary.md` | Chat NightLife V6 et docs consolides, 2026-05-16 | Resume canonique, themes, usages, risques | Duplication avec originaux projet |
| `resource:nightlife-3darons/ideas-queue` | `nightlife-3darons/ideas-queue.md` | `V6_IDEAS_QUEUE.md` | Queue d'idees arbitrees NightLife V6 | Peut devenir obsolete si non resynchronise |
| `resource:nightlife-3darons/integration-plan` | `nightlife-3darons/integration-plan.md` | `V6_INTEGRATION_PLAN.md` | Lots et priorites d'integration | Trop large si utilise comme spec finale |
| `resource:nightlife-3darons/product-guardrails` | `nightlife-3darons/product-guardrails.md` | `V6_PRODUCT_GUARDRAILS.md` | Regles privacy, equite, anti dark-patterns | Doit rester prioritaire sur gamification |
| `resource:nightlife-3darons/pseudo-market` | `nightlife-3darons/pseudo-market.md` | `V6_PSEUDO_MARKET.md` | Cadrage bourse pseudo et garde-fous | Eviter usernames reels et speculation |

## Ressources Pacte Visia

| Appel canonique | Fichier ressource | Source originale | Usage | Risques |
| --- | --- | --- | --- | --- |
| `resource:pacte-visia/readme` | `pacte-visia/readme.md` | Repo `bizc0m/PACTE_IA`, 2026-05-16 | Vue generale PACTE_IA | Source projet evolutive |
| `resource:pacte-visia/pacte-ia` | `pacte-visia/pacte-ia.md` | Repo `bizc0m/PACTE_IA`, 2026-05-16 | Cadre ethique principal, 4 piliers | Rester testable, eviter manifeste non-operatoire |
| `resource:pacte-visia/vision-claude` | `pacte-visia/vision-claude.md` | Repo `bizc0m/PACTE_IA`, 2026-05-16 | Vision Claude pour meta-charte | Ne pas traiter comme autorite morale finale |
| `resource:pacte-visia/vision-codex` | `pacte-visia/vision-codex.md` | Repo `bizc0m/PACTE_IA`, 2026-05-16 | Vision Codex, execution et systematisation | Vision locale non substituable au choix humain |
| `resource:pacte-visia/vision-gpt` | `pacte-visia/vision-gpt.md` | Repo `bizc0m/PACTE_IA`, 2026-05-16 | Vision GPT, critique et operabilite | Risque de sur-structuration |
| `resource:pacte-visia/vision-perplexity` | `pacte-visia/vision-perplexity.md` | Repo `bizc0m/PACTE_IA`, 2026-05-16 | Vision Perplexity, recherche et synthese | Verifier sources avant usage public |
| `resource:pacte-visia/prompt-perplexity-vision` | `pacte-visia/prompt-perplexity-vision.md` | Repo `bizc0m/PACTE_IA`, 2026-05-16 | Prompt de collecte de vision IA | Adapter avant reutilisation hors contexte |
| `resource:pacte-visia/pacte-visia-summary` | `pacte-visia/pacte-visia-summary.md` | Fiche creee, 2026-05-16 | Resume, usages, themes, risques | Synthese, pas source primaire |

## Ressources NOREGRESSION

| Appel canonique | Fichier ressource | Source originale | Date | Usage | Risques |
| --- | --- | --- | --- | --- | --- |
| `resource:noregression/noregression-chat` | `noregression/noregression-chat.md` | Chat Codex sanitise | 2026-05-16 | Protocole anti-regression, revue codebase, verification avant Git/push | Synthese non exhaustive, a adapter hors contexte projet |

## Ressources veille externe

| Appel canonique | Fichier ressource | Source originale | Date | Usage | Risques |
| --- | --- | --- | --- | --- | --- |
| `resource:global-network-sex-work-projects-resources` | `global-network-sex-work-projects-resources.md` | Raindrop KM Monitor / NSWP | 2026-06-27 | Ressources droits humains et politiques publiques a verifier avant citation | Sujet sensible, verification directe limitee par 429 |
| `resource:llm-wiki-karpathy` | `llm-wiki-karpathy.md` | Raindrop KM Monitor / GitHub Gist | 2026-06-27 | Ressource longue de reference LLM a relire avant extraction | Contenu long a verifier, ne pas recopier completement |

## Regles d'appel

- Pour citer une ressource dans un projet : utiliser l'appel canonique + chemin relatif.
- Pour integrer une idee depuis une ressource : ajouter une ligne dans la queue projet ou theme.
- Pour modifier une ressource copiee : verifier si la source originale doit aussi etre mise a jour.
- Ne pas stocker de secret, token, email ou identifiant prive dans `resources/`.
- Ne pas exposer de chemin personnel dans les exports.

## Decisions

| Date | Decision | Raison | Impact | Rollback |
| --- | --- | --- | --- | --- |
| 2026-05-16 | Creer `resources/` | Unifier les documents sources | Appels plus stables | Revenir aux chemins projet originaux |
| 2026-05-16 | Copier les docs NightCrawl en noms canoniques | Garder les originaux intacts | Moins de confusion entre anciens noms | Supprimer `resources/nightcrawl/` |
| 2026-05-16 | Introduire `resource:*` et `theme:*` | Normaliser les references | Documentation plus facile a reprendre | Utiliser uniquement les chemins relatifs |
| 2026-05-16 | Ajouter `resources/nightlife-3darons/` | Centraliser le cadrage NightLife V6 | Integration future plus simple | Supprimer le dossier et les lignes NightLife |
| 2026-05-16 | Ajouter `resources/pacte-visia/` | Centraliser PACTE_IA et visions multi-IA | Base future pour meta-charte et protocoles IA | Supprimer le dossier et les lignes Pacte Visia |

## Changelog

### v0.1-cadrage - 2026-05-16

- Objectif : centraliser les documents ressources et normaliser les appels.
- Fichiers touches : `resources/RESOURCES.md`, `resources/nightcrawl/*.md`, `themes/THEMES.md`, `NightCrawl/NightCrawl-NightIntel.md`.
- Risques : duplication avec les sources originales.
- Rollback possible : supprimer le dossier `resources/` et revenir aux documents projet.

### v0.2-design-reference - 2026-05-16

- Objectif : ajouter la charte HTML Urgence.LOL / Night-Intel comme reference design complete.
- Fichiers touches : `resources/RESOURCES.md`, `resources/design/urgence-lol-standalone-charte.html`, `resources/design/urgence-lol-design-reference.md`.
- Risques : HTML lourd, a utiliser comme reference visuelle plutot que composant brut.
- Rollback possible : supprimer `resources/design/`.

### v0.3-nocturne-intel - 2026-05-16

- Objectif : ajouter une ressource de synthese sanitisee pour les iterations NoctIntel Pro.
- Fichiers touches : `resources/RESOURCES.md`, `resources/nocturne-intel/noctintel-pro-dashboard-chat.md`.
- Risques : document de synthese, pas une copie exhaustive du chat.
- Rollback possible : supprimer `resources/nocturne-intel/` et cette entree d'index.

### v0.4-codex5 - 2026-05-16

- Objectif : ajouter une ressource CODEX5 pour integration future Urgence V5 / Nightlife Radar.
- Fichiers touches : `resources/RESOURCES.md`, `resources/codex5/*.md`, `resources/codex5/doc.zip`.
- Risques : synthese non exhaustive et informations a reverifier avant usage public.
- Rollback possible : supprimer `resources/codex5/` et cette entree d'index.

### v0.4-nightlife-3darons - 2026-05-16

- Objectif : ajouter les notes NightLife V6 comme ressource canonique.
- Fichiers touches : `resources/RESOURCES.md`, `resources/nightlife-3darons/*`.
- Risques : duplication avec les originaux projet, donnees a resynchroniser si la queue evolue.
- Rollback possible : supprimer `resources/nightlife-3darons/` et les lignes NightLife de cet index.

### v0.5-pacte-visia - 2026-05-16

- Objectif : ajouter les documents PACTE_IA et visions IA comme ressource transversale.
- Fichiers touches : `resources/RESOURCES.md`, `resources/pacte-visia/*.md`, `themes/THEMES.md`.
- Risques : documents de vision a transformer en protocoles testables avant usage decisionnel.
- Rollback possible : supprimer `resources/pacte-visia/` et les lignes Pacte Visia de cet index.

### v0.4-noregression - 2026-05-16

- Objectif : ajouter une ressource sanitisee sur les consignes anti-regression et la gouvernance d'agents Codex.
- Fichiers touches : `resources/RESOURCES.md`, `resources/noregression/noregression-chat.md`, `themes/THEMES.md`.
- Risques : document de synthese, pas une copie exhaustive du chat.
- Rollback possible : supprimer `resources/noregression/` et cette entree d'index.
