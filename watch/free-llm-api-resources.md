# Free LLM API Resources

## Type

Veille outils IA / ressources API.

## Tags

llm, api, free-tier, inference, providers, ai-tools, sensitive

## Appel canonique

`watch:free-llm-api-resources`

## Source

Repo : `https://github.com/cheahjs/free-llm-api-resources`

Auteur repo : `cheahjs`

Lecture : 2026-05-22

Verification GitHub API :

- repo : `cheahjs/free-llm-api-resources`
- description : list of free LLM inference resources accessible via API
- stars lus : 22013
- forks lus : 2246
- licence : NOASSERTION
- archived : false
- dernier push lu : 2026-05-22

## Resume court

Liste maintenue de fournisseurs donnant un acces gratuit ou des credits d'essai pour inference LLM via API.

Le README precise :

- ne pas abuser des services ;
- les services non legitimes, par exemple reverse-engineering de chatbots existants, sont explicitement exclus.

## Fournisseurs principaux cites

### Free providers

- OpenRouter
- Google AI Studio
- NVIDIA NIM
- Mistral La Plateforme
- Mistral Codestral
- HuggingFace Inference Providers
- Vercel AI Gateway
- OpenCode Zen
- Cerebras
- Groq
- Cohere
- GitHub Models
- Cloudflare Workers AI

### Providers avec credits d'essai

- Fireworks
- Baseten
- Nebius
- Novita
- AI21
- Upstage
- NLP Cloud
- Alibaba Cloud Model Studio
- Modal
- Inference.net
- Hyperbolic
- SambaNova Cloud
- Scaleway Generative APIs

## Usage utile

- Comparer les fournisseurs LLM gratuits ou trial.
- Prototyper sans exposer de cle principale.
- Identifier des alternatives temporaires pour tests.
- Alimenter `process:ai-tools`.
- Completer `watch:ai-open-source-tools-inventory`.

## Usage abusif possible

| Risque | Description | Classement |
| --- | --- | --- |
| Abuse quotas | multiplier comptes/requetes pour contourner les limites | sensible ; #ROUGE si automatisation abusive |
| Fuite donnees | envoyer secrets, donnees privees ou prompts sensibles a des providers gratuits | sensible |
| Terms bypass | utiliser des routes gratuites pour contourner conditions commerciales | sensible |
| Non legitimate providers | utiliser services reverse-engineeres ou non autorises | #ROUGE |

## Garde-fous

- Respecter limites et conditions de chaque fournisseur.
- Ne pas envoyer secrets, tokens, donnees personnelles ou prompts confidentiels.
- Verifier la politique d'entrainement des donnees.
- Ne pas automatiser de contournement de quotas.
- Preferer fournisseurs officiels et documentes.
- Documenter provider, modele, limites, usage et cout reel avant integration.

## Relations

- `watch:ai-open-source-tools-inventory`
- `watch:red-team-risk-tools-watch`
- `process:ai-tools`
- `process:km-auto-operating-prompt-v1.0`

## Decision KM

Garder comme ressource utile et sensible. Pas `#ROUGE` par defaut car la source exclut les providers non legitimes et demande de ne pas abuser.

## Changelog

### v0.1 - 2026-05-22

- Objectif : integrer le repo `cheahjs/free-llm-api-resources`.
- Fichiers touches : `watch/free-llm-api-resources.md`, `watch/index.md`, `index.md`, `km/history.md`.
- Risques : limites/providers variables, donnees envoyees a tiers.
- Rollback possible : supprimer cette fiche et retirer les lignes d'index.
