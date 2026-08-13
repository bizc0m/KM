# Firecrawl PDF Inspector

## Type

Veille Raindrop KM Monitor / bibliotheque extraction PDF.

## Tags

#pdf, #rust, #extraction, #document-ai, #sensible

## Appel canonique

`watch:firecrawl-pdf-inspector`

## Sources
- Source finale : `https://github.com/firecrawl/pdf-inspector`

Lecture KM : 2026-08-09

Source Raindrop :

- titre : `firecrawl/pdf-inspector`
- date : 2026-08-07T09:46:07.704Z
- domaine : `github.com`
- auteur/source : `firecrawl`
- tags detectes : aucun tag Raindrop
- note Raindrop : inspection, classification et extraction texte PDF en Rust.

## Resume court

Firecrawl PDF Inspector is a KM watch item classified as Veille Raindrop KM Monitor / bibliotheque extraction PDF. The final source is preserved in the fiche and must be verified before product use, public reuse or operational integration.

## Classification

`sensible`

Raison : composant technique d'inspection documentaire sans capacite offensive directe identifiee, mais les corpus PDF peuvent contenir donnees personnelles, contrats, factures, secrets ou contenu copyright.

## Usage KM

- Evaluer pour pipelines d'ingestion PDF et tri OCR.
- Comparer aux outils locaux de parsing PDF et aux scripts documentaires.
- Tester sur documents publics ou fixtures avant usage sur corpus prive.

## Risque d'abus possible

Extraction non autorisee de documents tiers, fuite de contenu confidentiel dans les logs ou envoi de fichiers prives vers une chaine de traitement non auditee.

## Points a controler

- Licence, dependances Rust et performances sur gros PDF.
- Gestion des PDF malformes ou hostiles.
- Absence d'envoi reseau implicite dans les usages locaux.

## Relations

- `resource:index`
- `process:km-systematic-fiche-pipeline`

## Changelog

### v0.1 - 2026-08-09

- Objectif : integrer la nouveaute Raindrop KM Monitor `firecrawl/pdf-inspector`.
- Fichiers touches : `watch/firecrawl-pdf-inspector.md`, `watch/index.md`, `index.md`, `km/history.md`.
- Risques : documents confidentiels, logs, PDF malformes.
- Rollback possible : supprimer cette fiche et retirer les lignes d'index.
