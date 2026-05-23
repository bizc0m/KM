# Red Team Risk Tools Watch

## Type

Veille outils sensibles `#ROUGE`.

## Tags

#ROUGE, dual-use, offensive-risk, osint, anti-detection, privacy, threat-intelligence

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
