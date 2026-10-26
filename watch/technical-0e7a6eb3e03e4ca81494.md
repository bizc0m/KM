# oiffile

## Statut

actif

## Tags

#python

## Intérêts

Lire des images OIF/OIB avec Python. Extraire données et métadonnées. Convertir OIB en OIF.

## Identité

- Dépôt principal : https://github.com/cgohlke/oiffile

## Métadonnées

- Nature : À vérifier
- OS : À vérifier
- Licence : BSD-3-Clause
- Tarification : À vérifier
- Accès : À vérifier
- Preuve : https://github.com/cgohlke/oiffile


## Ontologie

- Version : 1.1
- Identifiants : domain.media.image compatibility.language.python source.noteplan source.github source.x lifecycle.active
- Sujets : Audio, vidéo et création > Images et graphisme
- Compatibilités : Langages > Python
- Provenance : NotePlan Calendar ; GitHub ; X / Twitter
- État : Actif

## Sources

- https://github.com/cgohlke/oiffile
- https://x.com/i/status/2056514018135642189

## Traçabilité

- Origine : NotePlan
- Identifiant source : 0e7a6eb3e03e4ca81494e9c301c7fd9ba7bf3853ba7e815dfa76eb8ca7e8258d
- Politique : technical-only-2026-10-17
- Lecture KM : 2026-10-21
- Résumé automatique local ; les affirmations restent attribuées aux sources.

## Capacités documentées

- Lecture d'images et métadonnées OIF et OIB.
- Format OIF multi-fichier avec données et paramètres.
- Format OIB contient OIF et données dans un seul fichier.
- Lecture via Python.

## Usages documentés

- python -m pip install -U "oiffile[all]"
- image = imread('test.oib')
- with OifFile('test.oib') as oib: ...
- oib2oif('test.oib', location=tempdir)

## Limites

- Nécessite Python 3.12.10, 3.13.16, 3.14.8, 3.15.0
- Nécessite numpy 2.5.4
- Nécessite tifffile 2026.10.15

## Qualification

- Méthode : analyse locale de la page propre au dépôt, sans contenu des pages filles.
- Source : https://github.com/cgohlke/oiffile
- Analyse source : 2026-10-26T00:11:57.906Z
- Relecture humaine : non ; les affirmations restent à vérifier dans la source.
