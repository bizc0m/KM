# Cloudflare Agentic Inbox

## Type

Veille outil IA / client email agentique self-hosted.

## Tags

## Métadonnées

- Nature : À vérifier
- OS : À vérifier
- Licence : À vérifier
- Tarification : À vérifier
- Accès : À vérifier
- Preuve : À vérifier

## Intérêts

Gère les emails via Cloudflare Workers avec isolation par boîte aux lettres et stockage R2


## Ontologie

- Version : 1.1
- Identifiants : domain.ai.agents domain.communication domain.infrastructure.database source.github source.x lifecycle.review
- Sujets : Intelligence artificielle > Agents IA ; Communication et publication ; Infrastructure > Bases de données
- Provenance : GitHub ; X / Twitter
- État : À vérifier

## Sources

- https://github.com/cloudflare/agentic-inbox
- https://x.com/i/status/2057512199912923177

## Metadata GitHub publique

Releve API GitHub : 2026-08-21

- repo : `cloudflare/agentic-inbox`
- URL : `https://github.com/cloudflare/agentic-inbox`
- description : A self-hosted email client with an AI agent, running entirely on Cloudflare Workers
- licence : Apache-2.0
- etoiles relevees : 6899
- derniere activite relevee : 2026-04-23T21:04:17Z
- archived : non
- fork : non

Note : metadata volatile, a reverifier avant decision produit ou execution locale.

### v0.1 - 2026-06-24

- Objectif : integrer Agentic Inbox depuis Raindrop KM Monitor.
- Risques : donnees email et actions agentiques.

## Identité

- Dépôt principal : https://github.com/cloudflare/agentic-inbox

## Capacités documentées

- Permet d'envoyer et recevoir des emails via Cloudflare Email Routing
- Chaque boîte aux lettres est isolée dans un Durable Object avec SQLite
- Utilise R2 pour stocker les pièces jointes
- Intègre un agent IA pour lire, chercher et rédiger des réponses

## Usages documentés

- Déployer sur Cloudflare
- Configurer Cloudflare Access
- Activer Email Routing
- Créer une boîte aux lettres

## Limites

- Requiert un compte Cloudflare avec un domaine
- Nécessite Email Routing et Email Service activés
- Exige Workers AI pour l'agent IA

## Qualification

- Méthode : analyse locale de la page propre au dépôt, sans contenu des pages filles.
- Source : https://github.com/cloudflare/agentic-inbox
- Analyse source : 2026-10-19T21:33:03.052Z
- Relecture humaine : non ; les affirmations restent à vérifier dans la source.
