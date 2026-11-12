# BindWeave

## Statut

actif

## Tags

#generation-video

## Intérêts

Fonction · Non établi par la source
Avantages · Non établi par la source
Gain · Non établi par la source

## Identité

- Dépôt principal : https://github.com/bytedance/bindweave

## Métadonnées

- Nature : À vérifier
- OS : À vérifier
- Licence : Apache-2.0
- Tarification : À vérifier
- Accès : À vérifier
- Preuve : https://github.com/bytedance/BindWeave


## Ontologie

- Version : 1.1
- Identifiants : domain.media.video capability.generate.video source.noteplan source.github source.x lifecycle.active
- Sujets : Audio, vidéo et création > Vidéo
- Fonctions : Générer des contenus > Générer une vidéo
- Provenance : NotePlan Calendar ; GitHub ; X / Twitter
- État : Actif

## Sources

- https://github.com/bytedance/bindweave
- https://x.com/i/status/2115634257314107707
- https://x.com/i/status/2114672104021148033
- https://raw.githubusercontent.com/bytedance/bindweave/HEAD/assets/bindweave_demo.gif
- https://raw.githubusercontent.com/bytedance/bindweave/HEAD/README.md

## Traçabilité

- Origine : NotePlan
- Identifiant source : fa71f92dbb3617f853df313fcfee761741a5136314c10a3c7cb0f821280cd1eb
- Politique : technical-only-2026-10-17
- Lecture KM : 2026-11-12
- Résumé automatique local ; les affirmations restent attribuées aux sources.

## Aperçus

![BindWeave Video Generation Demo](https://raw.githubusercontent.com/bytedance/bindweave/HEAD/assets/bindweave_demo.gif)

[Origine](https://raw.githubusercontent.com/bytedance/bindweave/HEAD/README.md)

## Capacités documentées

- Génère des vidéos cohérentes sur sujet à partir de prompts uniques ou multiples.
- Utilise un modèle MLLM-DiT couplant un modèle de langage multimodal et un transformateur de diffusion.
- Intègre des informations multimodales via l'ancrage d'entités et l'alignement de représentations.

## Usages documentés

- bash scripts/prompt_refine.sh
- git switch feature_extraction
- bash scripts/hiddenstates_extraction.sh
- git switch infer
- pip install "huggingface_hub[cli]"
- huggingface-cli download Wan-AI/Wan2.1-I2V-14B-720P-Diffusers --local-dir ./pretrained_model/wanx/Wan2.1-I2V-14B-720P-Diffusers
- huggingface-cli download ByteDance/BindWeave --local-dir ./BindWeave_14B
- python convert_ckpt.py --source_path ./BindWeave_14B/ --target_path ./BindWeave_14B/ --mode convert_to_mm
- bash script/inference_s2v.sh

## Limites

- Dépend du modèle Wan2.1-I2V-14B-720P-Diffusers.
- Requiert des prétraitements et des scripts spécifiques pour chaque workflow.
- Nécessite des ressources de calcul importantes pour la génération vidéo.

## Qualification

- Méthode : analyse locale de la page propre au dépôt, sans contenu des pages filles.
- Source : https://github.com/bytedance/bindweave
- Analyse source : 2026-11-12T16:20:36.270Z
- Relecture humaine : non ; les affirmations restent à vérifier dans la source.
