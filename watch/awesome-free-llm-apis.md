# Awesome Free LLM APIs

## Type

Veille outils IA / ressources API LLM gratuites.

## Tags

llm, api, free-tier, providers, inference, openai-compatible, ai-tools, sensitive

## Appel canonique

`watch:awesome-free-llm-apis`

## Sources

- Repo : `https://github.com/mnfst/awesome-free-llm-apis`

Lecture : 2026-05-22

Verification GitHub API :

- repo : `mnfst/awesome-free-llm-apis`
- description : list of permanent free LLM API keys
- stars lus : 4477
- forks lus : 430
- licence : CC0-1.0
- archived : false
- dernier push lu : 2026-05-22

## Resume court

Liste de fournisseurs LLM avec tiers gratuits permanents ou credits gratuits. Le README indique que les endpoints sont majoritairement compatibles avec le SDK OpenAI, sauf mention contraire, et pointe vers les pages de creation de cles API.

Exemples visibles au moment de la lecture :

- AI21 Labs
- Aion Labs
- Alibaba Cloud Model Studio
- Cohere
- DeepSeek
- Google Gemini
- Mistral AI
- xAI
- Z AI
- Cerebras
- Cloudflare Workers AI
- GitHub Models
- Groq
- Hugging Face
- Kilo Code

## Usage utile

- Comparer providers LLM gratuits ou trial.
- Identifier les bases URL OpenAI-compatible.
- Prototyper sans exposer une cle principale.
- Alimenter un routeur LLM interne avec limites documentees.
- Croiser avec `watch:free-llm-api-resources`.

## Usage abusif possible

| Risque | Description | Classement |
| --- | --- | --- |
| Abuse quotas | creation de comptes ou automatisation pour contourner les limites | sensible ; #ROUGE si abus organise |
| Donnees sensibles | envoi de secrets, prompts prives ou donnees personnelles a des providers tiers | sensible |
| Terms mismatch | usage commercial ou production alors que le free tier l'interdit | sensible |
| Provider volatile | limites, regions, prix et politiques data peuvent changer vite | sensible |
| Key leakage | cles API copiees dans repo, logs ou prompts | sensible critique |

## Garde-fous

- Verifier chaque provider a la source officielle avant usage.
- Ne jamais stocker de cle API en clair.
- Documenter region, limite, cout reel, politique data et usage autorise.
- Ne pas contourner quotas, paywalls ou conditions commerciales.
- Preferer comptes/projets separes pour prototypes.
- Ne pas envoyer de donnees personnelles ou confidentielles a un provider gratuit non audite.

## Relations

- `watch:free-llm-api-resources`
- `watch:ai-open-source-tools-inventory`
- `watch:red-team-risk-tools-watch`
- `process:ai-tools`

## Decision KM

Garder comme source sœur de `watch:free-llm-api-resources`. Classification `sensible`, pas `#ROUGE` par defaut. Devient `#ROUGE` seulement en cas d'abus de quotas, contournement de conditions, collecte non legitime de cles ou usage de providers non autorises.

## Changelog

### v0.1 - 2026-05-22

- Objectif : integrer `mnfst/awesome-free-llm-apis`.
- Fichiers touches : `watch/awesome-free-llm-apis.md`, `watch/index.md`, `index.md`, `watch/ai-open-source-tools-inventory.md`, `process/AI-Tools.md`, `km/history.md`.
- Risques : providers variables, conditions d'usage, cles API, donnees envoyees a tiers.
- Rollback possible : supprimer cette fiche et retirer les lignes d'index.

### v0.2 - 2026-05-22

- Objectif : confirmer que le lien du nouveau lot est un doublon deja indexe.
- Fichiers touches : `watch/awesome-free-llm-apis.md`, `km/history.md`.
- Risques : aucun changement fonctionnel.
- Rollback possible : retirer ce changelog.
