# CONET - Privacy DePIN Network

## Type

Veille infra privacy / DePIN / reseau decentralise.

## Tags

privacy, depin, crypto, wallet-address, decentralized-network, encrypted-routing, vpn-alternative, tokenomics, sensitive, to-verify

## Appel canonique

`watch:conet-privacy-depin-network`

## Sources

- Site officiel : `https://conet.network/`
- Documentation officielle : `https://doceng.conet.network/`
- Introduction docs : `https://doceng.conet.network/welcome-to-conet/introduction`
- Fonctionnement docs : `https://doceng.conet.network/core-technology/how-conet-works-decentralized-private-and-secure`
- Silent Pass : `https://conet.network/silent-pass/`
- Privacy policy : `https://conet.network/privacy-cookies/`

Lecture KM : 2026-05-25

## Resume court

CONET se presente comme une infrastructure DePIN orientee privacy. Le projet affirme remplacer les adresses IP par des adresses wallet chiffrees comme identifiants reseau, faire transiter des messages chiffrés via des noeuds, et recompenser des noeuds/miners pour le relais de paquets.

Ces promesses doivent rester classees comme claims projet tant qu'il n'y a pas d'audit technique independant, de verification code/source, de test reseau et de cadre legal clair pour l'exploitation de noeuds.

## Verification source

| Point | Observation | Statut |
| --- | --- | --- |
| Site officiel | `conet.network` accessible et coherent avec docs | verifie source officielle |
| Docs | `doceng.conet.network` decrit DePIN, wallet address et relay encrypted data | verifie source officielle |
| Privacy policy | annonce peu ou pas de donnees personnelles, Google Analytics avec IP anonymisee | a auditer |
| GitHub | lien officiel non confirme dans cette passe | a verifier |
| Tokenomics | modele crypto/mining present dans l'ecosysteme | sensible |

## Usage utile

- Veille sur infrastructures privacy alternatives.
- Comparer DePIN, VPN, Tor-like routing, relay networks et wallet identity.
- Comprendre les promesses de reseaux sans IP visible.
- Evaluer une piste anti-censure dans un cadre legal.
- Alimenter KM sur privacy tech, crypto infra et risques de relais.

## Usage abusif possible

| Risque | Description | Classement |
| --- | --- | --- |
| Relay abuse | faire transiter du trafic tiers illegal ou non maitrise via un noeud | sensible ; #ROUGE si facilite abus externe |
| Overclaim privacy | croire a un anonymat complet sans audit ni modele de menace | sensible |
| Crypto speculation | achat token/mining motive par rendement non verifie | sensible finance |
| Juridiction | responsabilite legale variable selon pays et type de trafic relaye | sensible |
| Contournement | usage pour contourner restrictions sans cadre legitime | sensible ; #ROUGE si usage illegal |
| Metadata leakage | fuite possible via endpoint, wallet, analytics, app, bridges ou erreurs de config | sensible |

## Garde-fous

- Ne pas traiter les claims d'anonymat comme prouves.
- Ne pas lancer de noeud public sans analyse legale.
- Ne pas engager d'argent sans audit tokenomics et risque finance.
- Tester seulement en lab avec trafic controle.
- Documenter le modele de menace : qui voit quoi, a quel niveau, avec quels logs.
- Verifier code, clients, smart contracts, bridge, analytics et conditions d'usage.
- Ne jamais relayer de trafic tiers non maitrise pour un projet public.

## Questions d'audit

1. Quel repo GitHub officiel correspond au client, aux noeuds et aux smart contracts ?
2. Les clients sont-ils open source et reproductibles ?
3. Qui controle les super nodes / guardians / bootstrap nodes ?
4. Quels logs existent cote app, noeuds, analytics, wallet et infra cloud ?
5. Que signifie exactement "no IP" dans le modele de menace ?
6. Quel risque juridique pour l'operateur d'un noeud ?
7. Le token est-il necessaire a l'usage ou seulement a l'incitation ?

## Relations

- `watch:twitter-rss-monitoring`
- `watch:osint-tools-watch`
- `watch:red-team-risk-tools-watch`
- `watch:ai-open-source-tools-inventory`

## Fit projets

| Projet | Fit | Raison |
| --- | --- | --- |
| KM | fort | veille privacy infra et DePIN |
| PACTE_IA | moyen | sujet gouvernance, autonomie, infrastructures alternatives |
| NightIntel | faible/moyen | possible inspiration privacy, pas d'integration avant audit |

## Decision KM

Garder comme veille `sensible / a verifier`. Pas `#ROUGE` par defaut. Devient `#ROUGE` seulement si l'usage vise contournement illegal, relais abusif, anonymisation d'abus ou diffusion operationnelle non cadre.

## Changelog

### v0.1 - 2026-05-25

- Objectif : integrer CONET comme veille privacy DePIN apres demande utilisateur.
- Fichiers touches : `watch/conet-privacy-depin-network.md`, `watch/index.md`, `index.md`, `km/history.md`, `search-v1.10.html`.
- Risques : claims privacy non audites, crypto/tokenomics, responsabilite de relais, confusion anonymat reel/promis.
- Rollback possible : supprimer cette fiche et retirer les lignes d'index.
