# CyberStrike - AI Red Team Agent

## Type

Veille `#ROUGE` / agent IA offensif de red team.

## Tags

#ROUGE, pentest, red-team, offensive-security, mitre-attack, autonomous-agent, security-benchmarks, github

## Appel canonique

`watch:cyberstrike-ai-red-team-agent`

## Sources

- Raindrop KM Monitor : `https://arno-vltn.raindrop.page/km-monitor-71629567`
- Repo GitHub : `https://github.com/CyberStrikeus/CyberStrike`
- Source X secondaire : `https://x.com/dinosn/status/2070446054701490193`

Lecture KM : 2026-06-24

Source Raindrop :

- titre : `CyberStrikeus/CyberStrike: AI-powered offensive security agent with 7,300+ actionable security skills. Autonomous pentesting powered by MITRE ATT&CK (2,000+ Atomic tests), CIS Benchmarks (1,500+ controls), OWASP, NIST. Lazy-loading, zero context pollution. Your AI red team.`
- date : 2026-06-24T05:52:53.350Z
- domaine : `github.com`
- auteur/source : `arnaud-velten`
- tags detectes : aucun tag Raindrop

Source Raindrop secondaire :

- titre : post X reprenant la description CyberStrike avec lien `t.co`
- date : 2026-06-27T11:15:59.835Z
- domaine : `x.com`
- auteur/source : `dinosn`
- resolution : `https://t.co/IMTnJF3pht` -> `https://github.com/CyberStrikeus/CyberStrike`

## Resume court

CyberStrike est un agent de securite offensive presente comme capable d'automatiser du pentest et de charger des competences liees a MITRE ATT&CK, CIS Benchmarks, OWASP et NIST.

## Classification

`#ROUGE`

Raison : l'outil facilite directement des usages offensifs et d'automatisation de red team. Il doit rester une source de veille defensive, sans mode d'emploi ni procedure operationnelle.

## Usage KM

- Suivre l'evolution des agents de pentest autonomes.
- Comparer les promesses de couverture MITRE / benchmarks avec les risques reels.
- Alimenter la veille interne sur l'automatisation offensive par IA.

## Usage defensif legitime

- Etude en laboratoire isole et autorise.
- Threat intelligence sur les capacites d'agents offensifs.
- Benchmark defensif, detection, journalisation et containment.

## Usage abusif possible

| Risque | Description | Classement |
| --- | --- | --- |
| Recon non autorisee | automatisation de collecte sur cibles tierces | #ROUGE |
| Exploitation | aide a l'enchainement d'actions offensives | #ROUGE |
| Abaissement de barriere | usage par profils non qualifies contre des systemes reels | #ROUGE |

## Garde-fous

- Ne pas fournir de commandes, payloads, procedures ou chaines d'exploitation.
- Ne pas tester sur cible externe sans autorisation ecrite.
- Ne pas connecter a des secrets, comptes, VPN ou reseaux reels sans cadrage.
- Ne pas integrer dans un produit public.

## Relations

- `watch:red-team-risk-tools-watch`
- `watch:pentestgpt-autonomous-pentest`
- `watch:ai-open-source-tools-inventory`

## Decision KM

Garder en veille `#ROUGE` interne.

## Changelog

### v0.1 - 2026-06-24

- Objectif : integrer CyberStrike depuis Raindrop KM Monitor.
- Fichiers touches : `watch/cyberstrike-ai-red-team-agent.md`, `watch/index.md`, `watch/red-team-risk-tools-watch.md`, `index.md`, `km/history.md`.
- Risques : agent offensif directement abusable.
- Rollback possible : supprimer cette fiche et retirer les lignes d'index.

### v0.2 - 2026-06-27

- Objectif : ajouter le signal X secondaire detecte dans Raindrop, deduplique vers le repo existant.
- Fichiers touches : `watch/cyberstrike-ai-red-team-agent.md`, `km/history.md`.
- Risques : doublon de source offensive ; pas de nouveau mode d'emploi stocke.
- Rollback possible : retirer la source secondaire et ce changelog.
