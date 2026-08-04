# Auto Company Autonomous AI Company

## Type

Veille Raindrop KM Monitor / orchestration multi-agents autonome.

## Tags

raindrop-km-monitor, agents, autonomous-company, codex-cli, claude-code, daemon, sensible

## Appel canonique

`watch:auto-company-autonomous-ai-company`

## Sources

- Raindrop KM Monitor : `https://arno-vltn.raindrop.page/km-monitor-71629567`
- Source finale : `https://github.com/MaxMiksa/Auto-Company`
- Metadata GitHub API : `https://api.github.com/repos/MaxMiksa/Auto-Company`

Lecture KM : 2026-07-22

Source Raindrop :

- titre : `MaxMiksa/Auto-Company: An auto-company works for 24/7 on your own PC - Windows/Linux/macOS.`
- date : 2026-07-22T13:24:04.972Z
- domaine : `github.com`
- auteur/source : `arnaud-velten`
- tags detectes : `LLM`, `Company`, `Auto`

Resolution :

- URL canonique resolue directement vers le depot GitHub public.
- Verification GitHub API : depot `MaxMiksa/Auto-Company`, langage principal Python, branche par defaut `main`, non archive, non desactive.
- Description API : `An auto-company works for 24/7 on your own PC - Windows/Linux/macOS.`

## Resume court

Depot open source qui orchestre une equipe d'agents IA via Claude Code ou Codex CLI pour fonctionner en boucle continue sur macOS, Windows/WSL ou Linux, avec memoire de consensus, logs, dashboard local et workflows produit/code/deploiement/marketing.

## Classification

`sensible`

Raison : l'outil peut executer des agents en continu sur une machine locale, manipuler des depots, lancer des commandes et consommer des quotas LLM. Aucune capacite offensive directe n'a ete identifiee dans la fiche source, donc le classement reste sensible.

## Usage KM

- Suivre les patterns d'orchestration d'agents longue duree et de memoire consensus en fichier Markdown.
- Comparer les garde-fous de boucles autonomes avec les pratiques Codex/Claude locales.
- Alimenter la veille sur les "AI companies" locales, les daemons agentiques et les dashboards d'observabilite.

## Risque d'abus possible

Risque eleve de derive operationnelle si lance sans cadrage : commandes locales non surveillees, propagation d'erreurs en boucle, consommation de credits, modification de code, automatisation marketing non validee et exposition potentielle de secrets presents dans l'environnement.

## Points a controler

- Auditer les scripts de daemon, les droits shell, les appels CLI et les garde-fous avant execution locale.
- Verifier le modele de permission Codex/Claude utilise par defaut et les chemins lus/ecrits.
- Tester dans un depot sandbox avant toute connexion a des comptes, tokens, projets clients ou workflows de publication.

## Garde-fous

- Ne pas lancer avec des tokens de production ni dans un repertoire contenant des donnees privees.
- Ne pas activer de boucle 24/7 sans supervision, limites de cout et rollback clair.
- Ne pas utiliser pour publication, vente ou prospection automatisee sans validation humaine.

## Relations

- `watch:index`
- `watch:alook-ai-workforce-collaboration`
- `watch:agency-agents-ai-agency`
- `watch:claude-code-ya-es-potente-solo`

## Changelog

### v0.1 - 2026-07-22

- Objectif : integrer la nouveaute Raindrop KM Monitor `MaxMiksa/Auto-Company`.
- Fichiers touches : `watch/auto-company-autonomous-ai-company.md`, `watch/index.md`, `index.md`, `km/history.md`.
- Risques : boucle agentique autonome, commandes locales, quotas LLM, secrets et publication automatique a cadrer.
- Rollback possible : supprimer cette fiche et retirer les lignes d'index.
