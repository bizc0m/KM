# KM Resource Import Prompt

```text
Lis d'abord tous les chats/documents/fichiers fournis.

Objectif :
transformer automatiquement le contenu utile en fiches Markdown structurees dans `###DEV/KM/`, avec index global et index specialise.

Mode automatique :
- si le contenu est clair, choisir directement le meilleur slug en kebab-case ;
- creer la fiche sans attendre validation ;
- mettre a jour `###DEV/KM/index.md` ;
- mettre a jour l'index specialise concerne ;
- journaliser l'ajout dans l'historique si important.

Si le contenu est ambigu, sensible, contradictoire ou risque de casser une structure existante :
- placer une fiche temporaire dans `###DEV/KM/inbox/` ;
- indiquer les 3 options de classement ;
- marquer `statut: a cadrer`.

kebab-case :
- minuscules uniquement ;
- mots separes par tirets `-` ;
- pas d'espace, pas de `_`, pas de majuscule.
Exemple : `urgence-lol-design-reference`.

Routage :
- fiche KM generale : `###DEV/KM/km/`
- veille externe : `###DEV/KM/watch/`
- document source : `###DEV/KM/resources/`
- theme transversal : `###DEV/KM/themes/`
- process ou prompt : `###DEV/KM/process/`
- doute / attente : `###DEV/KM/inbox/`

La fiche doit contenir :
- titre ;
- type ;
- tags ;
- relations ;
- source ;
- date ;
- usage ;
- projet lie si pertinent ;
- themes lies ;
- appels canoniques ;
- resume court ;
- decisions ;
- risques ;
- statut deduplication ;
- rollback ;
- historique.

Format des appels :
- fiche KM : `km:<fichier-sans-extension>`
- ressource : `resource:<dossier>/<fichier-sans-extension>`
- theme : `theme:<nom-du-theme>`
- process : `process:<nom-du-process>`
- veille : `watch:<nom-du-watch>`

Regles privacy :
- ne pas exposer nom reel, email, compte, token, cle API, identifiant prive ;
- ne pas exposer de chemin personnel dans les fichiers exportables ;
- remplacer les chemins personnels par placeholders ;
- ne jamais stocker de secret en clair ;
- pour OSINT, respecter privacy-first, pas de doxxing, pas de surveillance abusive.

Regles versioning :
- ne jamais ecraser une version stable ;
- garder les originaux ;
- documenter date, objectif, fichiers touches, risques, rollback.
```

## Usage

Appel process : `process:km-resource-import-prompt`

Chemin cible : `###DEV/KM/process/km-resource-import-prompt.md`

## Changelog

### v0.3 - 2026-05-22

- Objectif : passer KM en mode automatique avec index global.
- Fichiers touches : `process/km-resource-import-prompt.md`, `index.md`, `watch/index.md`.
- Risques : classement automatique imparfait.
- Rollback : revenir a la version v0.2 avec validation avant creation.

### v0.2 - 2026-05-19

- Objectif : migrer le prompt vers la racine canonique KM.
- Fichiers touches : `process/km-resource-import-prompt.md`, `km/index.md`, `km/history.md`.
- Risques : chemins personnels a remplacer avant export public.
- Rollback : revenir a la version dans `#process`.

### v0.1 - 2026-05-18

- Objectif : formaliser le prompt KM pour importer chats/documents.
- Risques : le chemin personnel doit etre remplace par placeholder avant export public.
- Rollback : supprimer ce fichier du dossier `#process`.
