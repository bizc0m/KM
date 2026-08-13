# Red Team Risk Tools Watch

## Type

Veille outils sensibles `#ROUGE`.

## Tags

#rouge, #dual-use, #offensive-risk, #osint, #anti-detection, #privacy, #threat-intelligence

## Appel canonique

`watch:red-team-risk-tools-watch`

## Role

Centraliser les outils offensifs, abusables ou a double usage pour les connaitre, les surveiller et s'en proteger.

`#ROUGE` signifie : a connaitre en interne pour defense, audit, hygiene, threat intelligence et prevention, mais pas a diffuser publiquement ni transformer en tutoriel operationnel.

## Regles #ROUGE

- Recuperer les outils offensifs au lieu de les ignorer.
- Les classer clairement `#ROUGE`.
- Distinguer usage legitime defensif et usage abusif.
- Ne pas fournir de mode d'emploi offensif.
- Ne pas fournir de payload, procedure d'exploitation, contournement, ciblage ou automatisation abusive.
- Ne pas stocker de donnees personnelles extraites par ces outils.
- Ne pas integrer dans un projet sans cadrage explicite.

## Outils / familles classes #ROUGE

Critere strict : `#ROUGE` uniquement si l'outil facilite directement un usage offensif, furtif, intrusif ou d'abus a grande echelle.

| Outil / famille | Usage defensif legitime | Usage abusif possible | Diffusion |
| --- | --- | --- | --- |
| Camofox Browser | tester detection bot sur ses propres services | contournement anti-bot, scraping furtif, fraude plateformes | #ROUGE non public |
| Vehicle Search Tools | investigation autorisee, verification defensive | doxxing, stalking, identification de particuliers via plaques/VIN | #ROUGE non public |
| Image OSINT tools | verification source image, threat intel, fact-checking | geolocalisation abusive, identification non consentie | #ROUGE non public |
| Playwright MCP | tests QA, accessibilite, verification UI | automatisation d'actions non autorisees, scraping abusif | #ROUGE si cible externe |
| n8n | automatisation interne | spam, exfiltration, scraping automatise | #ROUGE si connecteurs sensibles |
| FreeLLMAPI / ARGO / LibreChat | self-host, privacy, experimentation controlee | fuite secrets, contournement conditions, agent non supervise | #ROUGE si secrets/comptes tiers |
| PentestGPT | lab autorise, CTF, evaluation defensive d'agents de pentest | reconnaissance, exploitation, post-exploitation et privilege escalation non autorisees | #ROUGE non public |
| PromptSpy / AI Android malware | threat intelligence, sensibilisation mobile, detection defensive | malware adaptatif, spyware Android, persistance et evasion mobile | #ROUGE non public |
| CyberStrike | lab autorise, evaluation defensive d'agents de red team IA | automatisation de reconnaissance, pentest et chainage offensif | #ROUGE non public |
| MalwareSourceCode | reverse engineering et detection en environnement isole | reutilisation, adaptation ou diffusion de code malware | #ROUGE non public |
| GoSearch digital footprint | audit de sa propre exposition publique, sensibilisation privacy | doxxing, stalking, correlation de comptes et collecte de donnees personnelles | #ROUGE non public |
| GhostTrack | audit de sa propre exposition publique, sensibilisation privacy | doxxing, stalking, correlation telephone/username/IP | #ROUGE non public |
| Reverse Skill / hacker skills | threat intelligence, lab autorise, audit de skills agents | reverse non autorise, automatisation de taches offensives par agent | #ROUGE non public |
| Serus dark web leak search | audit de ses propres comptes ou domaine autorise | recherche de donnees compromises, doxxing, credential abuse | #ROUGE non public |
| IG-Detective Instagram OSINT | investigation autorisee et sensibilisation privacy | enumeration de contacts, geolocalisation, contournement et ciblage de profils | #ROUGE non public |
| Aliens_eye AI OSINT | audit de sa propre exposition publique, veille privacy autorisee | correlation de comptes, doxxing, stalking et ciblage de personnes | #ROUGE non public |
| Pentagi autonomous pentest agents | evaluation en lab isole et autorise, threat intelligence defensive | reconnaissance, exploitation et chainage de penetration testing non autorises | #ROUGE non public |

## Sensible mais pas #ROUGE par defaut

| Outil / famille | Pourquoi sensible | Classement |
| --- | --- | --- |
| Voicebox / Pipecat / Whisper | voix, transcription, consentement | sensible |
| ViMax / OpenShorts / Hyperframes | generation media, risque deepfake selon contenu | sensible |
| Agentic Inbox | email, validation humaine requise | sensible |
| Claude Ads | manipulation publicitaire possible selon usage | sensible |
| AutoHedge / Vibe-Trading / Fincept Terminal | risque financier | sensible finance |
| Twitter RSS / Nitter / OpenRSS | veille publique pouvant deriver en surveillance | sensible |
| Orbit / social planning | tracking relationnel possible si non consenti | sensible |

## Garde-fous generaux

- Usage uniquement autorise, defensif ou educatif.
- Validation humaine obligatoire pour toute action externe.
- Aucune diffusion publique de procedure offensive.
- Aucune collecte de personnes privees.
- Aucune execution sur cible tierce sans autorisation.
- Journaliser les sources, pas les donnees sensibles.

## Relations

- `watch:ai-open-source-tools-inventory`
- `watch:osint-tools-watch`
- `watch:tool-project-fit-scan`
- `process:km-auto-operating-prompt-v1.0`
- `theme:charte-ia`

## Changelog

### v0.1 - 2026-05-22

- Objectif : creer une veille `#ROUGE` pour les outils offensifs ou abusables.
- Fichiers touches : `watch/red-team-risk-tools-watch.md`, `watch/ai-open-source-tools-inventory.md`, `process/km-auto-operating-prompt-v1.0.md`, `index.md`, `watch/index.md`, `km/history.md`.
- Risques : dual-use ; ne pas transformer en tutoriel.
- Rollback possible : supprimer cette fiche et retirer les lignes d'index.

### v0.2 - 2026-05-22

- Objectif : resserrer `#ROUGE` aux risques offensifs directs et sortir les risques contextuels en `sensible`.
- Fichiers touches : `watch/red-team-risk-tools-watch.md`, `watch/ai-open-source-tools-inventory.md`, `process/km-auto-operating-prompt-v1.0.md`.
- Risques : reclassification a maintenir selon usage reel.
- Rollback possible : revenir a v0.1.

### v0.3 - 2026-05-22

- Objectif : ajouter PentestGPT en `#ROUGE` strict.
- Fichiers touches : `watch/red-team-risk-tools-watch.md`, `watch/pentestgpt-autonomous-pentest.md`, `watch/ai-open-source-tools-inventory.md`.
- Risques : outil directement offensif si mal utilise.
- Rollback possible : retirer la ligne PentestGPT et la fiche dediee.

### v0.4 - 2026-05-23

- Objectif : ajouter PromptSpy / AI Android malware comme menace `#ROUGE`.
- Fichiers touches : `watch/red-team-risk-tools-watch.md`, `watch/promptspy-ai-android-malware.md`, `index.md`, `watch/index.md`, `km/history.md`.
- Risques : source secondaire non verifiee ; ne pas transformer en tutoriel malware.
- Rollback possible : retirer la ligne PromptSpy et la fiche dediee.

### v0.5 - 2026-06-24

- Objectif : ajouter CyberStrike et MalwareSourceCode comme sources `#ROUGE`.
- Fichiers touches : `watch/red-team-risk-tools-watch.md`, `watch/cyberstrike-ai-red-team-agent.md`, `watch/vxunderground-malware-source-code.md`, `index.md`, `watch/index.md`, `km/history.md`.
- Risques : agents offensifs et code malware directement abusables.
- Rollback possible : retirer les lignes et les deux fiches dediees.

### v0.6 - 2026-06-24

- Objectif : ajouter GoSearch digital footprint comme source `#ROUGE` privacy.
- Fichiers touches : `watch/red-team-risk-tools-watch.md`, `watch/gosearch-digital-footprint-search.md`, `index.md`, `watch/index.md`, `km/history.md`.
- Risques : doxxing, stalking et collecte de donnees personnelles.
- Rollback possible : retirer la ligne GoSearch et la fiche dediee.

### v0.7 - 2026-06-28

- Objectif : ajouter Serus et IG-Detective comme sources `#ROUGE` privacy/OSINT.
- Fichiers touches : `watch/red-team-risk-tools-watch.md`, `watch/serus-dark-web-leak-search.md`, `watch/ig-detective-instagram-osint-suite.md`, `index.md`, `watch/index.md`, `km/history.md`.
- Risques : donnees compromises, credential abuse, doxxing, enumeration de contacts et contournement.
- Rollback possible : retirer les deux lignes et les fiches dediees.

### v0.8 - 2026-06-29

- Objectif : ajouter Aliens_eye comme source `#ROUGE` privacy/OSINT.
- Fichiers touches : `watch/red-team-risk-tools-watch.md`, `watch/aliens-eye-ai-osint-platform.md`, `index.md`, `watch/index.md`, `km/history.md`.
- Risques : correlation de comptes, doxxing et ciblage de personnes.
- Rollback possible : retirer la ligne Aliens_eye et la fiche dediee.

### v0.9 - 2026-07-11

- Objectif : ajouter Pentagi comme source `#ROUGE` d'agents de penetration testing autonomes.
- Fichiers touches : `watch/red-team-risk-tools-watch.md`, `watch/pentagi-autonomous-pentest-agents.md`, `index.md`, `watch/index.md`, `km/history.md`.
- Risques : automatisation offensive directement abusable.
- Rollback possible : retirer la ligne Pentagi et la fiche dediee.
