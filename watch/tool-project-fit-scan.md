# Tool Project Fit Scan

## Type

Matrice KM outil -> projet.

## Tags

#km, #tools, #project-fit, #nightintel, #demoforge, #pacte-ia, #privacy

## Appel canonique

`watch:tool-project-fit-scan`

## Sources

- `watch:ai-open-source-tools-inventory`
- `watch:osint-tools-watch`
- `PROJECTS_INDEX.md`
- README et index projet lus le 2026-05-22

## Resume court

Tool Project Fit Scan is a KM watch item classified as Matrice KM outil -> projet. The final source is preserved in the fiche and must be verified before product use, public reuse or operational integration.

## Projets scannes

| Projet | Chemin | Role lu | Statut |
| --- | --- | --- | --- |
| NightLife V6 | `CODEX/NightLife` | app Night Intel avec routes radar, globe, recruitment, city | actif |
| NightLife V5 | `CODEX/NightLifeV5` | projet principal NightLife historique | actif / a ne pas toucher sans cadrage |
| Nocturne Intel | `CODEX/Nocturne-Intel` | dashboard intelligence nightlife, collecteur RSS JSONL | source de verite |
| NightCrawl | `CODEX/NightCrawl` | radar culturel nightlife, bots Telegram/Discord, scans ville | archive / ressource |
| Tracker URL Resolver | `CODEX/tracker-url-resolver` | resolver URL, nettoyage tracking, pro scan | utilitaire candidat |
| DemoForge Clean | `Projets/Demoforge-clean` | outils HTML visuels : shader, ANSI motion, CNC studio | actif propre |
| PACTE_IA | `PACTE_IA` | cadre ethique IA, docs, protocoles, audits | actif |
| croKETT | `CODEX/croKETT` | clone Biscuit / share actionable approach | actif leger |
| Annecy Intel | `Projets/Annecy-Intel`, `Projets/BANANE` | versions HTML Annecy Intel | archive / produit local |
| KM | `KM` | knowledge management, ressources, watch, process | actif |

## Recommandations prioritaires

| Projet | Outils utiles | Priorite | Pourquoi | Risques / garde-fous |
| --- | --- | --- | --- | --- |
| Nocturne Intel | `Plausible Analytics`, `Listmonk`, `Tracker URL Resolver`, `playwright-mcp` | haute | analytics privacy-first, newsletter/veille, nettoyage liens, tests dashboard | pas de tracking caché, opt-in analytics |
| NightLife V6/V5 | `Cal.com`, `Postiz`, `playwright-mcp`, `Whisper`, `OpenShorts` | moyenne | events/booking, diffusion sociale, tests UI, transcription d'events, shorts promotionnels | opt-in, pas de scraping privé, pas d'autopost sans validation |
| NightCrawl | `Postiz`, `Listmonk`, `playwright-mcp`, `Pipecat` | moyenne | transmissions bot/social, newsletter radar, verification pages, possible agent vocal | bots non intrusifs, cadence explicite |
| DemoForge Clean | `Hyperframes`, `Penpot`, `OpenScreen`, `OpenShorts`, `Voicebox` | haute | video demos, design open source, capture ecran, shorts, voix locale | voix uniquement consentie, assets propres/licences |
| PACTE_IA | `LibreChat`, `Agentic Inbox`, `Pipecat`, `AppFlowy` | moyenne | interface multi-IA, inbox agentique, conversations vocales, workspace docs | ne pas melanger intime/public, privacy stricte |
| croKETT | `AppFlowy`, `Spacesuit`, `Cal.com`, `Vaultwarden` | basse/moyenne | inspiration workspace/share action, scheduling, secrets | ne pas stocker secrets en clair |
| Tracker URL Resolver | `playwright-mcp`, `Camofox Browser` | moyenne/sensible | resolution dynamique et pages JS | Camofox uniquement pour tests legitimes, pas de contournement abusif |
| Annecy Intel | `Plausible Analytics`, `Listmonk`, `Postiz`, `OpenScreen` | moyenne | mesure privacy-first, diffusion locale, captures demo | opt-in, pas de donnees perso |
| KM | `AppFlowy`, `LibreChat`, `Agentic Inbox`, `Vaultwarden` | moyenne | organisation docs, interface chat, tri inbox, protection secrets | exports sans chemins personnels |

## Outils a ne pas integrer sans cadrage

| Outil | Raison | Decision |
| --- | --- | --- |
| `AutoHedge` | finance/trading autonome | a cadrer, pas d'usage produit |
| `Vibe-Trading` | finance/trading, risque de conseil financier | a cadrer, veille seulement |
| `Fincept Terminal` | finance terminal | a cadrer, veille seulement |
| `Camofox Browser` | anti-detection / spoofing | usage limite tests legitimes, pas de contournement abusif |
| Vehicle Search Tools | plaques/VIN, donnees personnelles possibles | privacy-sensitive, veille seulement |
| Claude Code redirect repo | securite/secrets/conditions d'usage | attendre identification + audit |

## Quick wins

1. `playwright-mcp` pour tests UI NightLife, Nocturne Intel et DemoForge.
2. `OpenScreen` pour creer des demos courtes des interfaces.
3. `Plausible Analytics` pour analytics privacy-first sur pages publiques.
4. `Postiz` pour planifier des posts de demo, validation manuelle obligatoire.
5. `Hyperframes` pour generer des videos DemoForge / NightIntel reproductibles.
6. `Vaultwarden` pour hygiene secrets, hors repo.

## Relations KM

- `watch:ai-open-source-tools-inventory`
- `watch:osint-tools-watch`
- `watch:x-source-authors-log`
- `process:ai-tools`
- `theme:charte-ia`

## Changelog

### v0.1 - 2026-05-22

- Objectif : scanner les projets locaux et proposer les outils utiles par projet.
- Fichiers touches : `watch/tool-project-fit-scan.md`, `watch/index.md`, `index.md`, `km/history.md`.
- Risques : scan rapide base sur README/index, pas audit complet du code.
- Rollback possible : supprimer cette fiche et retirer les lignes d'index.
