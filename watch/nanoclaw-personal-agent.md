# NanoClaw - Personal AI Agent

## Type

Veille outils IA / agent personnel multi-canaux.

## Tags

ai-agent, personal-agent, messaging, containers, claude-agent-sdk, credential-vault, local-first, automation, sensitive

## Appel canonique

`watch:nanoclaw-personal-agent`

## Sources

- Page Vibe Shit : `https://vibeshit.org/product/nanoclaw`
- Site : `https://nanoclaw.dev/`
- Repo : `https://github.com/nanocoai/nanoclaw`

Lecture : 2026-05-22

Verification GitHub API :

- repo : `nanocoai/nanoclaw`
- description : lightweight alternative to OpenClaw running in containers, with messaging apps, memory and scheduled jobs
- stars lus : 29269
- forks lus : 12855
- licence : MIT
- archived : false
- dernier push lu : 2026-05-20

## Resume court

NanoClaw est un agent IA personnel open source, leger et personnalisable. Il connecte un agent a des canaux de messagerie comme WhatsApp, Telegram, Slack, Discord, Microsoft Teams, Matrix, GitHub, Linear, email et autres.

Le projet met en avant une architecture simple : un host Node, des conteneurs par groupe d'agents, deux bases SQLite par session, des skills installables a la demande et une isolation des credentials via Agent Vault.

## Usage utile

- Construire un assistant personnel message-first.
- Tester des agents par canal avec isolation forte.
- Relier messagerie, jobs planifies, memoire et providers IA.
- Inspirer les workflows NightIntel de transmission, bots et operations locales.
- Etudier une architecture agent simple, auditable et containerisee.

## Usage abusif possible

| Risque | Description | Classement |
| --- | --- | --- |
| Automation messaging | envoi de messages automatises non consentis ou spam multi-canaux | sensible ; #ROUGE si spam/phishing |
| Credential routing | mauvaise configuration du vault ou exposition de providers | sensible |
| Workspace mounts | montage de dossiers contenant secrets ou donnees personnelles | sensible |
| Agent impersonation | bot qui parle comme une personne sans signalement clair | sensible |
| Scheduled tasks | jobs recurrents pouvant surveiller ou contacter sans opt-in | sensible ; #ROUGE si surveillance abusive |

## Garde-fous

- Usage opt-in sur chaque canal de messagerie.
- Aucun secret en clair dans repo, logs ou sessions.
- Monter seulement les dossiers necessaires dans les conteneurs.
- Distinguer clairement agent, humain et automatisation.
- Desactiver tout broadcast, scraping ou contact massif non sollicite.
- Auditer chaque skill installe avant usage.

## Relations

- `watch:agentsview-session-intelligence`
- `watch:vibeshit-vibe-coding-directory`
- `watch:ai-open-source-tools-inventory`
- `watch:red-team-risk-tools-watch`
- `process:ai-tools`
- `theme:charte-ia`

## Fit projets

| Projet | Fit | Raison |
| --- | --- | --- |
| KM | moyen | assistant de capture/reprise via messagerie, a cadrer privacy |
| NightIntel | fort | bots de transmission, cellules locales, alertes et briefings opt-in |
| NightCrawl | fort | agent operationnel de collecte/validation avec canaux separes |
| outils internes | fort | assistant personnel multi-agent avec isolation |

## Decision KM

Garder comme source prioritaire a surveiller. Classification `sensible`, pas `#ROUGE` par defaut. Devient `#ROUGE` uniquement si usage de spam, phishing, surveillance abusive, credential abuse ou contournement de consentement.

## Changelog

### v0.1 - 2026-05-22

- Objectif : integrer `NanoClaw` comme agent personnel multi-canaux.
- Fichiers touches : `watch/nanoclaw-personal-agent.md`, `watch/index.md`, `index.md`, `watch/ai-open-source-tools-inventory.md`, `process/AI-Tools.md`, `km/history.md`.
- Risques : messagerie automatisee, credentials, prompts et donnees personnelles.
- Rollback possible : supprimer cette fiche et retirer les lignes d'index.

### v0.2 - 2026-05-22

- Objectif : ajouter la page Vibe Shit comme source annuaire.
- Fichiers touches : `watch/nanoclaw-personal-agent.md`, `process/AI-Tools.md`, `km/history.md`.
- Risques : page annuaire externe variable.
- Rollback possible : retirer la ligne `Page Vibe Shit`.
