# NotePlan MCP Server

## Type

Veille Raindrop KM Monitor / connecteur MCP pour notes, taches et calendrier.

## Tags

#noteplan, #mcp, #notes, #tasks, #calendar, #agents, #sensible

## Appel canonique

`watch:noteplan-mcp-server`

## Sources
- Source finale : `https://help.noteplan.co/article/277-how-to-install-the-noteplan-mcp-server`

Lecture KM : 2026-08-03

Source Raindrop :

- titre : `How to Install the NotePlan MCP Server`
- date : 2026-08-03T10:26:09.151Z
- domaine : `help.noteplan.co`
- auteur/source : `source-raindrop-anonymisee`
- tags detectes : aucun tag Raindrop

## Resume court

NotePlan MCP Server is a KM watch item classified as Veille Raindrop KM Monitor / connecteur MCP pour notes, taches et calendrier. The final source is preserved in the fiche and must be verified before product use, public reuse or operational integration.

## Classification

`sensible`

Raison : connecteur agentique vers donnees personnelles, planning et taches. Le risque principal porte sur permissions, confidentialite des notes et actions calendar/task non desirees.

## Usage KM

- Evaluer l'integration NotePlan dans les workflows agents locaux.
- Comparer avec les connecteurs Obsidian, Raindrop et autres outils KM.
- Definir les permissions minimales avant usage operationnel.

## Risque d'abus possible

Exposition de notes privees, modification de taches ou rappels, fuite de contexte personnel vers un client IA, et actions automatisees sur calendrier sans validation.

## Points a controler

- Verifier le modele de permissions MCP et les scopes exposes.
- Tester uniquement sur un coffre ou calendrier de test.
- Ne jamais stocker de notes, evenements prives ou chemins personnels dans cette fiche.

## Relations

- `watch:index`
- `watch:obsidian-web-clipper`
- `watch:awesome-mcp-servers`

## Changelog

### v0.1 - 2026-08-03

- Objectif : integrer la nouveaute Raindrop KM Monitor `How to Install the NotePlan MCP Server`.
- Fichiers touches : `watch/noteplan-mcp-server.md`, `watch/index.md`, `index.md`, `km/history.md`.
- Risques : donnees personnelles NotePlan, calendrier, taches et permissions MCP.
- Rollback possible : supprimer cette fiche et retirer les lignes d'index.
