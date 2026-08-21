# AgentsView - Session Intelligence

## Type

Veille outils IA / intelligence de sessions agents.

## Tags

#agents, #coding-agents, #session-intelligence, #local-first, #search, #analytics, #token-costs, #devtools, #sensitive

## Appel canonique

`watch:agentsview-session-intelligence`

## Sources

- Site : `https://www.agentsview.io/`
- Repo : `https://github.com/kenn-io/agentsview`

Lecture : 2026-05-22

Verification GitHub API :

- repo : `kenn-io/agentsview`
- description : local-first session intelligence and analytics for coding agents
- stars lus : 1087
- forks lus : 139
- licence : MIT
- archived : false
- dernier push lu : 2026-05-22

## Metadata GitHub publique

Releve API GitHub : 2026-08-21

- repo : `kenn-io/agentsview`
- URL : `https://github.com/kenn-io/agentsview`
- description : Local-first session search, analytics, insights, and token use statistics for coding agents, supporting Claude Code, Codex, and more than 20 other agents.
- licence : MIT
- etoiles relevees : 5187
- topics releves : aucun topic public
- derniere activite relevee : 2026-08-21T02:37:06Z
- archived : non
- fork : non

Note : metadata volatile, a reverifier avant decision produit ou execution locale.

## Resume court

AgentsView - Session Intelligence is a KM watch item classified as Veille outils IA / intelligence de sessions agents. The final source is preserved in the fiche and must be verified before product use, public reuse or operational integration.

## Usage utile

- Rechercher dans les anciennes sessions Codex/Claude/Cursor.
- Retrouver une decision, une erreur ou un prompt sans relire manuellement les chats.
- Mesurer couts/tokens et usage par agent/projet.
- Alimenter KM avec des resumes de sessions, apres nettoyage privacy.
- Comparer l'activite agents par projet.

## Usage abusif possible

| Risque | Description | Classement |
| --- | --- | --- |
| Exposition de prompts | les sessions peuvent contenir secrets, chemins locaux, donnees personnelles ou contexte client | sensible |
| Sync distante | PostgreSQL sync peut sortir les historiques du poste local | sensible |
| Partage d'archives | import/export de chats peut diffuser images, prompts ou tool calls sensibles | sensible |
| Monitoring humain | usage en equipe pouvant surveiller les pratiques individuelles sans consentement clair | sensible |

## Garde-fous

- Garder l'usage local-first par defaut.
- Ne pas pousser la base SQLite, exports ou historiques bruts dans Git.
- Nettoyer secrets, chemins personnels, noms et donnees sensibles avant toute fiche KM.
- Activer la sync distante seulement avec consentement, auth et perimetre clair.
- Ne jamais exposer l'interface au reseau sans authentification.

## Relations

- `watch:vibeshit-vibe-coding-directory`
- `watch:ai-open-source-tools-inventory`
- `process:km-auto-operating-prompt-v1.0`
- `process:ai-tools`
- `theme:charte-ia`

## Fit projets

| Projet | Fit | Raison |
| --- | --- | --- |
| KM | fort | retrouver, analyser et transformer les sessions agents en fiches |
| NightIntel | moyen | audit des decisions IA et documentation des iterations |
| outils internes | fort | suivi couts/tokens, recherche multi-agent, reprise de contexte |

## Decision KM

Garder comme outil prioritaire a tester localement. Classification `sensible`, pas `#ROUGE` par defaut.

## Changelog

### v0.1 - 2026-05-22

- Objectif : integrer `AgentsView` comme outil de session intelligence pour agents IA.
- Fichiers touches : `watch/agentsview-session-intelligence.md`, `watch/index.md`, `index.md`, `watch/ai-open-source-tools-inventory.md`, `km/history.md`.
- Risques : historiques de sessions potentiellement sensibles.
- Rollback possible : supprimer cette fiche et retirer les lignes d'index.
