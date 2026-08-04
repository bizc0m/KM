# OpenHands - AI Driven Development

## Type

Veille outil IA / agent de developpement.

## Tags

agent, coding, software-development, automation, github, sensible

## Appel canonique

`watch:openhands-ai-development`

## Sources

- Raindrop KM Monitor : `https://arno-vltn.raindrop.page/km-monitor-71629567`
- Repo GitHub : `https://github.com/OpenHands/OpenHands`

Lecture KM : 2026-06-24

Source Raindrop :

- titre : `OpenHands/OpenHands: OpenHands: AI-Driven Development`
- date : 2026-06-24T16:25:14.160Z
- domaine : `github.com`
- auteur/source : `arnaud-velten`
- tags detectes : aucun tag Raindrop

## Resume court

OpenHands est un agent de developpement logiciel. La fiche suit les outils capables de lire, modifier et executer du code dans un workflow agentique.

## Classification

`sensible`

Raison : agent de code avec execution et acces projet potentiels ; risque surtout lie aux secrets, aux modifications non controlees et a la supply chain.

## Usage KM

- Comparer les agents de developpement autonomes.
- Identifier les besoins sandbox, permission et revue.
- Suivre les integrations avec environnements de dev.

## Risque d'abus possible

| Risque | Description | Classement |
| --- | --- | --- |
| Secrets projet | lecture ou exposition de variables, tokens ou fichiers prives | sensible |
| Modifications non validees | changements code ou commandes sans revue | sensible |
| Supply chain | installation ou execution de dependances non auditees | sensible |

## Garde-fous

- Execution en sandbox ou repo de test.
- Pas de secrets dans l'environnement de test.
- Revue humaine avant merge, commit ou deploiement.

## Relations

- `watch:agentsview-session-intelligence`
- `watch:ccgui-mossx-vibecoding-editor`
- `watch:nanoclaw-personal-agent`

## Changelog

### v0.1 - 2026-06-24

- Objectif : integrer OpenHands depuis Raindrop KM Monitor.
- Fichiers touches : `watch/openhands-ai-development.md`, `watch/index.md`, `index.md`, `km/history.md`.
- Risques : agent code sensible.
- Rollback possible : supprimer cette fiche et retirer les lignes d'index.
