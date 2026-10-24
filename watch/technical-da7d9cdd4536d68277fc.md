# lfdfiles

## Statut

actif

## Tags

#python

## Intérêts

Convertir des fichiers expérimentaux en formats compatibles.

## Identité

- Dépôt principal : https://github.com/cgohlke/lfdfiles

## Métadonnées

- Nature : À vérifier
- OS : À vérifier
- Licence : BSD-3-Clause
- Tarification : À vérifier
- Accès : À vérifier
- Preuve : https://github.com/cgohlke/lfdfiles


## Ontologie

- Version : 1.1
- Identifiants : domain.unclassified compatibility.language.python source.noteplan source.github source.x lifecycle.active
- Sujets : À qualifier
- Compatibilités : Langages > Python
- Provenance : NotePlan Calendar ; GitHub ; X / Twitter
- État : Actif

## Sources

- https://github.com/cgohlke/lfdfiles
- https://x.com/i/status/2056514018135642189

## Traçabilité

- Origine : NotePlan
- Identifiant source : da7d9cdd4536d68277fc2bbed15d9ae7bfc12392241fd3d3d779fc0138395a21
- Politique : technical-only-2026-10-17
- Lecture KM : 2026-10-21
- Résumé automatique local ; les affirmations restent attribuées aux sources.

## Capacités documentées

- Outil Python pour gérer des formats de fichiers expérimentaux.
- Supporte des formats comme SimFCS, CCP4, Vaa3D, Bio-Rad PIC, ISS Vista, FlimFast.
- Permet la lecture, l'écriture et la conversion de fichiers.
- Fournit un script console pour l'utilisation.
- Utilise des bibliothèques comme NumPy et Tifffile.

## Usages documentés

- python -m pip install -U "lfdfiles[all]"
- python -m lfdfiles --help
- with BioradPic(TEMP / '_biorad.pic') as f: f.asarray()

## Limites

- Requiert Python 3.12.10, 3.13.16, 3.14.8, 3.15.0 64-bit.
- Dépend de NumPy 2.5.4, Tifffile 2026.9.20, Matplotlib 3.11.2 (optionnel).
- API instable, risque de changements entre versions.
- Pas de documentation officielle pour certains formats.
- Fonctionne principalement via la réingénierie des fichiers existants.

## Qualification

- Méthode : analyse locale de la page propre au dépôt, sans contenu des pages filles.
- Source : https://github.com/cgohlke/lfdfiles
- Analyse source : 2026-10-24T05:00:50.120Z
- Relecture humaine : non ; les affirmations restent à vérifier dans la source.
