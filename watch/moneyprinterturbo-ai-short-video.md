# MoneyPrinterTurbo - AI Short Video Generator

## Type

Veille outils IA / generation automatique de shorts video.

## Tags

ai-video, shortvideo, tiktok, automation, llm, moviepy, python, content-generation, social-media, sensitive

## Appel canonique

`watch:moneyprinterturbo-ai-short-video`

## Sources

- Repo : `https://github.com/harry0703/MoneyPrinterTurbo`

Lecture : 2026-05-25

Verification GitHub API :

- repo : `harry0703/MoneyPrinterTurbo`
- description : utilise les LLM IA pour generer des videos courtes en un clic
- stars lus : 58078
- forks lus : 8407
- langage principal : Python
- licence : MIT
- archived : false
- issues ouvertes lues : 2
- creation lue : 2024-03-11
- dernier push lu : 2026-05-25
- topics lus : ai, automation, chatgpt, moviepy, python, shortvideo, tiktok

## Resume court

MoneyPrinterTurbo est un outil open source de generation automatique de videos courtes avec IA. Le projet vise des workflows de type script, assets, montage et export video, avec un positionnement fort sur les formats courts et TikTok.

## Usage utile

- Prototyper une chaine de production de shorts IA.
- Tester un pipeline contenu RS avec validation humaine.
- Etudier une architecture Python/MoviePy pour montage automatise.
- Produire des demos internes ou variations de formats courts.
- Alimenter le futur framework RS comme brique de generation, pas comme publication automatique.

## Usage abusif possible

| Risque | Description | Classement |
| --- | --- | --- |
| Spam video | production massive de contenus bas qualite ou dupliques | sensible ; #ROUGE si manipulation coordonnee |
| Desinformation | generation de videos trompeuses, sorties de contexte ou non signalees | sensible ; #ROUGE si campagne malveillante |
| Impersonation | imitation d'une personne, marque ou voix sans consentement | #ROUGE |
| Copyright | reutilisation d'assets, musiques, images ou scripts non autorises | sensible |
| Platform abuse | contournement de limites ou conditions des plateformes sociales | sensible ; #ROUGE si automatisation abusive |

## Garde-fous

- Validation humaine avant toute publication.
- Pas d'usurpation d'identite, voix, image ou marque.
- Sources, assets et musiques avec droits clairs.
- Signalement du contenu genere par IA quand requis.
- Pas de publication massive non sollicitee.
- Pas de donnees personnelles dans prompts, assets, logs ou exports.

## Relations

- `watch:ai-open-source-tools-inventory`
- `watch:inspiration-competitors-tools`
- `watch:twitter-rss-monitoring`
- `watch:red-team-risk-tools-watch`

## Fit projets

| Projet | Fit | Raison |
| --- | --- | --- |
| Gestionnaire RS Framework | fort | brique de generation de shorts avec moderation humaine |
| DemoForge | moyen | production de videos demo courtes pour prototypes |
| KM | moyen | outil a suivre pour veille automation contenu et risques RS |

## Decision KM

Garder en veille `sensible`, pas `#ROUGE` par defaut. Basculer en `#ROUGE` uniquement pour usurpation, manipulation coordonnee, spam massif, desinformation ou contournement abusif de plateforme.

## Changelog

### v0.1 - 2026-05-25

- Objectif : integrer `MoneyPrinterTurbo` comme outil de generation de shorts IA utile au framework RS.
- Fichiers touches : `watch/moneyprinterturbo-ai-short-video.md`, `watch/index.md`, `index.md`, `km/history.md`, `scripts/build-search-v1.10-html.mjs`, `search-v1.10.html`.
- Risques : spam video, impersonation, copyright, desinformation et automation abusive.
- Rollback possible : supprimer cette fiche et retirer les lignes d'index.
