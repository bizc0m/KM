# OSINT Tools Watch

## Type

Veille OSINT transversale.

## Tags

osint, vehicle-search, vin, license-plate, threat-intelligence, privacy-sensitive

## Source

Post X public fourni le 2026-05-22.

Lecture effectuee via FxTwitter API publique, sans compte X.

## Appel canonique

`watch:osint-tools-watch`

## Relations

- `watch:ai-open-source-tools-watch`
- `theme:charte-ia`

## Resume court

Le post reference une section "Vehicle Search Tools" du repo GitHub `awesome-hacker-search-engines`, avec des outils de recherche de plaques, VIN et historiques de vehicules.

Source citee par le post :
`https://github.com/edoardottt/awesome-hacker-search-engines#vehicle`

Verification :

- Repo verifie via GitHub API : `https://github.com/edoardottt/awesome-hacker-search-engines`
- Statut : accessible.
- Licence GitHub : MIT.
- Garde-fou : ne pas extraire ni stocker de donnees personnelles vehicules dans KM.

## Sources lues

| Date post | Auteur | URL | Sujet | Statut |
| --- | --- | --- | --- | --- |
| 2026-05-21 | `cyb_detective` | `https://x.com/cyb_detective/status/2057462395568558157` | Vehicle Search Tools : license plate search, VIN check, vehicle history records | sensible |

## Arbitrage

| Element | Decision | Raison |
| --- | --- | --- |
| Vehicle search OSINT | garder avec prudence | utile pour veille OSINT, mais donnees potentiellement personnelles |
| Plaques / VIN / historique vehicule | a cadrer | risque privacy, stalking, doxxing, usage abusif |
| Repo awesome-hacker-search-engines | garder comme source | index public, a verifier avant utilisation |

## Garde-fous

- Usage uniquement defensif, recherche legitime, audit, investigation autorisee ou apprentissage.
- Pas de doxxing, stalking, surveillance abusive ou identification de particuliers sans base legitime.
- Ne pas stocker plaques, VIN, noms, adresses ou resultats personnels dans KM.
- Verifier legalite locale avant usage de tout outil lie aux vehicules.

## Risques

- Outils externes variables.
- Donnees vehicules possiblement personnelles.
- Resultats pouvant etre faux, obsoletes ou hors cadre legal selon pays.

## Prochaines actions

1. Verifier le repo GitHub source avant integration.
2. Extraire uniquement les categories utiles et licites.
3. Creer une fiche dediee si un outil devient actionnable.

## Changelog

### v0.1 - 2026-05-22

- Objectif : integrer automatiquement le lien Cyb Detective dans KM Watch.
- Fichiers touches : `watch/osint-tools-watch.md`, `watch/index.md`, `index.md`, `km/history.md`.
- Risques : sujet privacy-sensitive.
- Rollback possible : supprimer cette fiche et retirer les lignes d'index.

### v0.2 - 2026-05-22

- Objectif : verifier le repo source Vehicle Search Tools.
- Fichiers touches : `watch/osint-tools-watch.md`.
- Risques : contenu privacy-sensitive.
- Rollback possible : retirer le bloc Verification.
