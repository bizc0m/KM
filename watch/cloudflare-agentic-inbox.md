# Cloudflare Agentic Inbox

## Type

Veille outil IA / client email agentique self-hosted.

## Tags

agent, email, cloudflare-workers, self-hosted, privacy-sensitive, github

## Appel canonique

`watch:cloudflare-agentic-inbox`

## Sources

- Raindrop KM Monitor : `https://arno-vltn.raindrop.page/km-monitor-71629567`
- Repo GitHub : `https://github.com/cloudflare/agentic-inbox`

Lecture KM : 2026-06-24

Source Raindrop :

- titre : `cloudflare/agentic-inbox: A self-hosted email client with an AI agent, running entirely on Cloudflare Workers`
- date : 2026-06-24T16:27:28.892Z
- domaine : `github.com`
- auteur/source : `arnaud-velten`
- tags detectes : aucun tag Raindrop

## Resume court

Agentic Inbox est un client email self-hosted avec agent IA, deploye sur Cloudflare Workers. La valeur KM est la veille sur les interfaces email agentiques et les patterns de validation humaine.

## Classification

`sensible`

Raison : l'outil touche aux emails, aux donnees personnelles et a l'action agentique. Il n'est pas offensif par nature, mais doit rester cadre.

## Usage KM

- Suivre les patterns d'inbox agentique.
- Comparer self-hosting, validation humaine et surface de donnees.
- Identifier les garde-fous utiles pour agents connectes a une messagerie.

## Risque d'abus possible

| Risque | Description | Classement |
| --- | --- | --- |
| Donnees email | exposition de messages, contacts ou pieces jointes | sensible |
| Action agentique | envoi ou tri automatique sans validation suffisante | sensible |
| Secrets | mauvaise gestion de tokens ou credentials email | sensible |

## Garde-fous

- Ne pas connecter a une boite reelle sans audit.
- Ne pas stocker d'emails prives dans KM.
- Validation humaine obligatoire avant envoi ou action irreversible.

## Relations

- `watch:nanoclaw-personal-agent`
- `watch:red-team-risk-tools-watch`
- `watch:ai-open-source-tools-inventory`

## Changelog

### v0.1 - 2026-06-24

- Objectif : integrer Agentic Inbox depuis Raindrop KM Monitor.
- Fichiers touches : `watch/cloudflare-agentic-inbox.md`, `watch/index.md`, `index.md`, `km/history.md`.
- Risques : donnees email et actions agentiques.
- Rollback possible : supprimer cette fiche et retirer les lignes d'index.
