# sdtfile

## Statut

actif

## Tags

#compression-images, #python

## Intérêts

Lire des fichiers SDT avec des données compressées. Accéder aux métadonnées et images.

## Identité

- Dépôt principal : https://github.com/cgohlke/sdtfile

## Métadonnées

- Nature : À vérifier
- OS : À vérifier
- Licence : BSD-3-Clause
- Tarification : À vérifier
- Accès : À vérifier
- Preuve : https://github.com/cgohlke/sdtfile


## Ontologie

- Version : 1.1
- Identifiants : domain.media.image capability.edit.image compatibility.language.python source.noteplan source.github source.x lifecycle.active
- Sujets : Audio, vidéo et création > Images et graphisme
- Fonctions : Compresser une image
- Compatibilités : Langages > Python
- Provenance : NotePlan Calendar ; GitHub ; X / Twitter
- État : Actif

## Sources

- https://github.com/cgohlke/sdtfile
- https://x.com/i/status/2056514018135642189

## Traçabilité

- Origine : NotePlan
- Identifiant source : 892f655e8727d581afe8cb980c31211e36ab581f3a5988f0116b2513ad63ad52
- Politique : technical-only-2026-10-17
- Lecture KM : 2026-10-21
- Résumé automatique local ; les affirmations restent attribuées aux sources.

## Capacités documentées

- Lecture de fichiers SDT contenant des données de comptage de photons.
- Gestion de données compressées avec LZ4 ou ZIP.
- Interface Python pour accéder aux métadonnées et données.
- Support des formats FCS et MCS pour les mesures.
- Traitement des fichiers avec des blocs de données variables.
- Gestion des erreurs et avertissements pour des tailles de blocs inattendues.

## Usages documentés

- python -m pip install -U sdtfile[all]
- from sdtfile import SdtFile
- sdt = SdtFile('image.sdt')
- image = sdt.data[0]

## Limites

- Requiert Python 3.12.10 ou supérieur.
- Dépend de Numpy et Imagecodecs/Lz4 pour la compression.
- Ne supporte pas les données Flow.
- Fonctionne sur des fichiers SDT avec structure standard.

## Qualification

- Méthode : analyse locale de la page propre au dépôt, sans contenu des pages filles.
- Source : https://github.com/cgohlke/sdtfile
- Analyse source : 2026-10-24T05:00:50.120Z
- Relecture humaine : non ; les affirmations restent à vérifier dans la source.
