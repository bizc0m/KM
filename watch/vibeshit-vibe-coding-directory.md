# Vibe Shit - Vibe Coding Directory

## Type

Veille outils IA / annuaire projets vibe coding.

## Tags

vibe-coding, ai-tools, agents, llm, devtools, directory, inspiration, sensitive

## Appel canonique

`watch:vibeshit-vibe-coding-directory`

## Source

Site : `https://vibeshit.org/`

Lecture : 2026-05-22

## Resume court

Annuaire de projets "vibe coding" proche d'un Product Hunt specialise IA/devtools. Le site liste des projets avec titre, description courte, tags, agents/LLM associes, votes, dates et tendances.

Exemples visibles au moment de la lecture :

- LLMs from Scratch
- Claude Gateway
- HyperFrames
- GLM-OCR
- PaddleOCR
- ShadowBroker
- Free LLM API Resources
- Rapid-MLX
- Social Auto Upload
- LibreChat
- Cua
- Roo Code
- vLLM
- OpenSRE

## Usage utile

- Reperer rapidement des outils IA, agents, devtools et projets open source.
- Alimenter `watch:ai-open-source-tools-inventory`.
- Identifier des inspirations UI/produit pour KM, NightIntel et outils internes.
- Suivre les tendances vibe coding sans dependre uniquement de X/GitHub trending.

## Usage abusif possible

| Risque | Description | Classement |
| --- | --- | --- |
| Hype non verifiee | descriptions courtes pouvant amplifier des claims produit | sensible |
| Outils dual-use | certains projets peuvent toucher OSINT, automation, remote access ou scraping | sensible ; #ROUGE seulement si offensif direct |
| Copie non critique | recopier des idees sans verification ni attribution | sensible |
| Envoi de donnees tiers | tester des services externes avec donnees privees ou secrets | sensible |

## Garde-fous

- Verifier chaque outil a la source officielle avant integration.
- Ne pas importer de claims comme faits sans verification.
- Ne pas stocker tokens, prompts confidentiels ou donnees personnelles dans des tests.
- Classer `#ROUGE` uniquement les outils directement offensifs ou abusables operationnellement.
- Garder l'attribution de la source et du projet original.

## Relations

- `watch:ai-open-source-tools-inventory`
- `watch:free-llm-api-resources`
- `watch:inspiration-competitors-tools`
- `watch:red-team-risk-tools-watch`
- `process:ai-tools`

## Decision KM

Garder comme source de veille et d'inspiration. Ne pas la traiter comme source d'autorite ; chaque outil extrait doit avoir sa propre verification.

## Changelog

### v0.1 - 2026-05-22

- Objectif : integrer `https://vibeshit.org/` comme source de veille vibe coding.
- Fichiers touches : `watch/vibeshit-vibe-coding-directory.md`, `watch/index.md`, `index.md`, `km/history.md`.
- Risques : annuaire externe, claims variables, presence possible d'outils dual-use.
- Rollback possible : supprimer cette fiche et retirer les lignes d'index.
