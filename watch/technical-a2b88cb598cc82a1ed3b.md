# Lucam

## Statut

actif

## Tags

#python

## Intérêts

Permet d'acquérir des images avec une caméra Lumenera via Python.

## Identité

- Dépôt principal : https://github.com/cgohlke/lucam

## Métadonnées

- Nature : À vérifier
- OS : À vérifier
- Licence : À vérifier
- Tarification : À vérifier
- Accès : À vérifier
- Preuve : À vérifier


## Ontologie

- Version : 1.1
- Identifiants : domain.media.image compatibility.language.python source.noteplan source.github source.x lifecycle.active
- Sujets : Audio, vidéo et création > Images et graphisme
- Compatibilités : Langages > Python
- Provenance : NotePlan Calendar ; GitHub ; X / Twitter
- État : Actif

## Sources

- https://github.com/cgohlke/lucam
- https://x.com/i/status/2056514018135642189

## Traçabilité

- Origine : NotePlan
- Identifiant source : a2b88cb598cc82a1ed3b32aaee873c93525a417acca6d4b33ab21bc7892d6178
- Politique : technical-only-2026-10-17
- Lecture KM : 2026-10-21
- Résumé automatique local ; les affirmations restent attribuées aux sources.

## Capacités documentées

- Lucam est une bibliothèque Python pour interagir avec la caméra Lumenera.
- Lucam fournit une interface bas niveau via ctypes et une interface objet.
- Lucam utilise des images de type numpy.array.
- Lucam nécessite Python 3.7 et Numpy 1.15.

## Usages documentés

- from lucam import Lucam
- camera = Lucam()
- image = camera.TakeSnapshot()
- camera.SaveImage(image, 'test.tif')
- camera.CameraClose()

## Limites

- Fonctionne uniquement sous Windows.
- Testé uniquement avec la caméra Lu165M.
- Pas de support pour Python 2.7 et 3.5.

## Qualification

- Méthode : analyse locale de la page propre au dépôt, sans contenu des pages filles.
- Source : https://github.com/cgohlke/lucam
- Analyse source : 2026-10-22T01:54:07.762Z
- Relecture humaine : non ; les affirmations restent à vérifier dans la source.
