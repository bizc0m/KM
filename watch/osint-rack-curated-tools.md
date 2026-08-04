# The OSINT Rack - Curated Intelligence Tools

## Type

Veille OSINT / annuaire d'outils d'investigation.

## Tags

osint, threat-intelligence, investigation, curated-tools, privacy-sensitive, a-verifier

## Appel canonique

`watch:osint-rack-curated-tools`

## Sources

- Raindrop KM Monitor : `https://arno-vltn.raindrop.page/km-monitor-71629567`
- Site : `https://osintrack.com/`

Lecture KM : 2026-06-24

Source Raindrop :

- titre : `The OSINT Rack | Curated Intelligence Tools`
- date : 2026-06-24T05:51:13.768Z
- domaine : `osintrack.com`
- auteur/source : `arnaud-velten`
- tags detectes : aucun tag Raindrop

## Resume court

The OSINT Rack est un annuaire public d'outils OSINT pour investigateurs et professionnels securite. La valeur KM est le reperage et la categorisation ; le contenu doit etre verifie avant usage.

## Classification

`sensible`

Raison : OSINT utile pour veille et investigations legitimes, mais certains outils peuvent toucher a la vie privee, au doxxing ou a la surveillance abusive selon usage.

## Usage KM

- Source de veille pour identifier des categories d'outils OSINT.
- Point d'entree pour cartographier les familles utiles en threat intelligence.
- Reserve d'outils a verifier un par un avant toute recommandation.

## Risque d'abus possible

| Risque | Description | Classement |
| --- | --- | --- |
| Vie privee | identification ou correlation de personnes sans base legitime | sensible |
| Doxxing | usage d'outils d'investigation contre des particuliers | sensible |
| Donnees variables | sources externes non auditees et potentiellement obsoletes | a verifier |

## Garde-fous

- Ne pas stocker de donnees personnelles extraites.
- Verifier chaque outil avant integration dans une fiche dediee.
- Limiter l'usage aux cadres defensifs, recherches legitimes et investigations autorisees.

## Relations

- `watch:osint-tools-watch`
- `watch:red-team-risk-tools-watch`
- `watch:ai-open-source-tools-inventory`

## Prochaines actions

1. Auditer les categories et isoler les outils a risque.
2. Creer des fiches dediees uniquement pour les outils utiles et licites.

## Changelog

### v0.1 - 2026-06-24

- Objectif : integrer The OSINT Rack depuis Raindrop KM Monitor.
- Fichiers touches : `watch/osint-rack-curated-tools.md`, `watch/index.md`, `index.md`, `km/history.md`.
- Risques : outils OSINT sensibles et non verifies.
- Rollback possible : supprimer cette fiche et retirer les lignes d'index.
