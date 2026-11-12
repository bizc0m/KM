# LTX-Video

## Statut

actif

## Tags

#generation-video, #generation-images, #python

## Intérêts

Intérêt à vérifier

## Identité

- Dépôt principal : https://github.com/konakona666/ltx-video

## Métadonnées

- Nature : À vérifier
- OS : À vérifier
- Licence : À vérifier
- Tarification : À vérifier
- Accès : À vérifier
- Preuve : À vérifier


## Ontologie

- Version : 1.1
- Identifiants : domain.media.video domain.media.image capability.generate.video capability.generate.image compatibility.language.python source.noteplan source.github source.x lifecycle.active
- Sujets : Audio, vidéo et création > Vidéo ; Audio, vidéo et création > Images et graphisme
- Fonctions : Générer des contenus > Générer une vidéo ; Générer des contenus > Générer une image
- Compatibilités : Langages > Python
- Provenance : NotePlan Calendar ; GitHub ; X / Twitter
- État : Actif

## Sources

- https://github.com/konakona666/ltx-video
- https://x.com/i/status/2115634257314107707

## Traçabilité

- Origine : NotePlan
- Identifiant source : ce7290d953bccb2d84d854cedbc460f18079b74642f54bc35e7a6e31ca149ae3
- Politique : technical-only-2026-10-17
- Lecture KM : 2026-11-12
- Résumé automatique local ; les affirmations restent attribuées aux sources.

## Capacités documentées

- Adaptation 8bit de LTXVideo
- Accélération jusqu'à 3X sur GPU NVIDIA ADA
- Génère vidéos 720x480x121 en moins d'une minute
- Support Python 3.10.12, CUDA 12.6, PyTorch 2.5.1

## Usages documentés

- python inference.py --low_vram --transformer_type=q8_kernels --ckpt_dir 'PATH' --prompt "PROMPT" --height HEIGHT --width WIDTH --num_frames NUM_FRAMES --seed SEED

## Limites

- Requiert GPU NVIDIA ADA ou RTX 4060 avec 8GB VRAM
- Supporte uniquement des résolutions divisibles par 32 et des nombres de frames divisibles par 8 + 1

## Qualification

- Méthode : analyse locale de la page propre au dépôt, sans contenu des pages filles.
- Source : https://github.com/konakona666/ltx-video
- Analyse source : 2026-11-12T13:09:56.531Z
- Relecture humaine : non ; les affirmations restent à vérifier dans la source.
