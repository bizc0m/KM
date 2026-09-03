# NotePlan KM Indexing Workflow

Type: process
Statut: ACTIF
Date integration: 2026-09-01
Origine: NotePlan Calendar 2026-08-30

## Resume
Idee de workflow pour indexer NotePlan dans KM : prompt, sujet, deeplink, statut, vue/scoring, detection des elements deja traites, et reimport controle.

## Fonction
- Scanner les notes NotePlan recentes.
- Extraire liens, prompts, taches et idees.
- Dedoublonner avec les fiches KM.
- Produire fiches Markdown quand utile.
- Marquer les elements comme traites dans un log.

## Champs recommandes
- source_note
- date_note
- deeplink
- sujet
- statut
- scoring
- projet
- action_recommandee

## Risques
- Notes privees : scan explicite seulement.
- TCC macOS : privilegier snapshot temporaire autorise.
- Ne jamais integrer liens medicaux, secrets, tokens ou identifiants.

## Tags
#KM #NOTEPLAN #WORKFLOW #INDEX #PRIVACY
