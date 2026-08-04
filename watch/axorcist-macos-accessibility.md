# AXorcist macOS Accessibility

## Type

Veille Raindrop KM Monitor / bibliotheque Swift pour macOS Accessibility.

## Tags

raindrop-km-monitor, macos, accessibility, swift, ui-automation, agents, sensible

## Appel canonique

`watch:axorcist-macos-accessibility`

## Sources

- Raindrop KM Monitor : `https://arno-vltn.raindrop.page/km-monitor-71629567`
- Source finale : `https://github.com/openclaw/AXorcist`

Lecture KM : 2026-08-03

Source Raindrop :

- titre : `AXorcist - Swift wrapper for macOS Accessibility-chainable, fuzzy-matched queries that read, click, and inspect any UI. The power of Swift compels your UI to obey!`
- date : 2026-08-03T09:33:21.787Z
- domaine : `github.com`
- auteur/source : `openclaw`
- tags detectes : aucun tag Raindrop

Resolution :

- URL canonique nettoyee : `https://github.com/openclaw/AXorcist`
- Verification HEAD directe : HTTP 200.

## Resume court

Wrapper Swift pour interroger, lire, cliquer et inspecter des interfaces macOS via Accessibility. Signal important pour agents desktop, automatisation UI et tests d'apps natives.

## Classification

`sensible`

Raison : l'API Accessibility peut agir sur des applications locales et lire des contenus UI. Elle n'est pas offensive par nature, mais exige un cadrage strict des permissions.

## Usage KM

- Suivre les briques techniques pour agents macOS et controles UI.
- Evaluer l'ergonomie de requetes Accessibility chainables et fuzzy-matched.
- Comparer aux approches Computer Use, AXSelectedText et automatisation native.

## Risque d'abus possible

Lecture de donnees visibles dans des apps, clics non voulus, automatisation d'interfaces sensibles et confusion entre test UI autorise et controle d'applications reelles.

## Points a controler

- Tester uniquement dans un environnement local controle.
- Verifier les permissions Accessibility accordees a l'app hote.
- Eviter toute capture ou stockage de donnees UI privees.

## Relations

- `watch:index`
- `watch:browser-use-web-automation`
- `watch:openhands-ai-development`

## Changelog

### v0.1 - 2026-08-03

- Objectif : integrer la nouveaute Raindrop KM Monitor `AXorcist`.
- Fichiers touches : `watch/axorcist-macos-accessibility.md`, `watch/index.md`, `index.md`, `km/history.md`.
- Risques : lecture et controle d'interfaces locales via Accessibility.
- Rollback possible : supprimer cette fiche et retirer les lignes d'index.
