# edge-tts

## Statut

actif

## Tags

#synthese-vocale, #python

## Intérêts

Convertir du texte en parole parlée MP3 avec sous-titres SRT via Microsoft Edge.

## Identité

- Dépôt principal : https://github.com/rany2/edge-tts

## Métadonnées

- Nature : À vérifier
- OS : À vérifier
- Licence : À vérifier
- Tarification : À vérifier
- Accès : À vérifier
- Preuve : À vérifier


## Ontologie

- Version : 1.1
- Identifiants : domain.media.audio.voice capability.voice.synthesize compatibility.language.python source.noteplan source.github source.x lifecycle.active
- Sujets : Audio, vidéo et création > Audio > Voix
- Fonctions : Traitement de la voix > Synthétiser une voix
- Compatibilités : Langages > Python
- Provenance : NotePlan Calendar ; GitHub ; X / Twitter
- État : Actif

## Sources

- https://github.com/rany2/edge-tts
- https://x.com/i/status/2058253217335501272

## Traçabilité

- Origine : NotePlan
- Identifiant source : fb7d8c0c8a030338b784a14a5a02c26982aa2757a78885e5b0de73ea3c37f5bb
- Politique : technical-only-2026-10-17
- Lecture KM : 2026-10-24
- Résumé automatique local ; les affirmations restent attribuées aux sources.

## Capacités documentées

- Permet d'utiliser le service TTS de Microsoft Edge via Python.
- Génère des fichiers audio et sous-titres à partir de texte.
- Fournit des commandes pour jouer directement les fichiers audio.
- Supporte le changement de voix, de débit, de volume et de ton.
- Exige l'installation de mpv pour la lecture audio.
- Intégré dans plusieurs projets et exemples.
- Fournit une liste des voix disponibles.
- Ne supporte pas les balises SSML personnalisées.
- Affiche une barre de progression lors de la génération audio.
- Utilisation possible via un module Python directement.
- Fournit des exemples d'utilisation dans le dépôt.
- Intégré dans des projets comme hass-edge-tts et podcastfy.

## Usages documentés

- edge-tts --text "Hello, world!" --write-media hello.mp3 --write-subtitles hello.srt
- edge-playback --text "Hello, world!"

## Limites

- Exige mpv pour la lecture audio.
- Ne supporte pas les balises SSML personnalisées.
- Fonctionne uniquement avec les options de voix et de paramètres audio définies.
- Nécessite une connexion internet pour utiliser le service TTS.
- Ne fonctionne pas avec des redirections stderr.
- Nécessite pip ou pipx pour l'installation.

## Qualification

- Méthode : analyse locale de la page propre au dépôt, sans contenu des pages filles.
- Source : https://github.com/rany2/edge-tts
- Analyse source : 2026-10-24T09:53:46.843Z
- Relecture humaine : non ; les affirmations restent à vérifier dans la source.
