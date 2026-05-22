# AutoResearchClaw - Autonomous Research Agent

## Type

Veille outils IA / agent de recherche autonome.

## Tags

research-agent, autonomous-research, papers, citations, experiments, openclaw, multi-agent, scientific-writing, sensitive

## Appel canonique

`watch:autoresearchclaw-autonomous-research`

## Sources

- Repo : `https://github.com/aiming-lab/AutoResearchClaw`
- Papier arXiv cite par le repo : `AutoResearchClaw: Self-Reinforcing Autonomous Research with Human-AI Collaboration`

Lecture : 2026-05-22

Verification GitHub API :

- repo : `aiming-lab/AutoResearchClaw`
- description : fully autonomous and self-evolving research from idea to paper
- stars lus : 12498
- forks lus : 1463
- licence : MIT
- archived : false
- dernier push lu : 2026-05-22

## Resume court

AutoResearchClaw est un pipeline agentique qui transforme une idee de recherche en papier academique avec litterature, experiences, analyses, citations, LaTeX et revue multi-agent. Le projet supporte un mode autonome et des modes human-in-the-loop/co-pilot.

Le README annonce une pipeline de recherche multi-etapes, recherche bibliographique via sources academiques, verification de citations, execution d'experiences en sandbox, generation de graphiques, revue multi-agent et integration OpenClaw / agents CLI compatibles.

## Usage utile

- Prototyper des workflows de recherche scientifique assistes par IA.
- Etudier une architecture agentique longue, versionnee et human-in-the-loop.
- Tester des mecanismes anti-hallucination : verification de citations, coherence papier/preuves, revue multi-agent.
- Inspirer KM pour transformer une idee en dossier structure, avec decisions, preuves et rollback.
- Evaluer des garde-fous pour agents autonomes.

## Usage abusif possible

| Risque | Description | Classement |
| --- | --- | --- |
| Papiers non verifies | generation de contenu academique qui peut sembler credible sans validation humaine | sensible |
| Citation laundering | produire une bibliographie ou des claims qui donnent une fausse autorite | sensible |
| API keys | configuration de providers LLM et couts pouvant exposer secrets ou budgets | sensible |
| Execution d'experiences | code genere et execute en sandbox, risques de dependances ou donnees non controlees | sensible |
| Publication automatique | diffusion de papier, resultats ou claims sans revue humaine | sensible |

## Garde-fous

- Toujours garder un mode human-in-the-loop pour toute sortie publique.
- Ne jamais publier un papier, claim ou resultat sans revue humaine et verification source.
- Ne pas stocker de cles API en clair dans config, repo, logs ou artifacts.
- Auditer les experiences generees avant execution hors sandbox.
- Distinguer clairement brouillon IA, resultat verifie et publication.
- Journaliser topic, sources, hypotheses, decisions, couts et rollback.

## Relations

- `watch:nanoclaw-personal-agent`
- `watch:agentsview-session-intelligence`
- `watch:vibeshit-vibe-coding-directory`
- `watch:ai-open-source-tools-inventory`
- `process:ai-tools`
- `theme:charte-ia`

## Fit projets

| Projet | Fit | Raison |
| --- | --- | --- |
| KM | fort | pipeline idee -> dossier verifie, avec historique et preuves |
| PACTE_IA | fort | utile pour comparer visions IA, audit et claims |
| NightIntel | moyen | inspiration pour agents d'analyse, mais pas pour publication automatique |
| outils internes | fort | architecture agentique longue, human-in-the-loop et verification |

## Decision KM

Garder comme source prioritaire de veille agentique. Classification `sensible`, pas `#ROUGE` par defaut. Devient `#ROUGE` seulement si l'outil est utilise pour fabriquer ou diffuser volontairement des papiers, preuves, citations ou claims trompeurs.

## Changelog

### v0.1 - 2026-05-22

- Objectif : integrer `AutoResearchClaw` comme agent de recherche autonome.
- Fichiers touches : `watch/autoresearchclaw-autonomous-research.md`, `watch/index.md`, `index.md`, `watch/ai-open-source-tools-inventory.md`, `process/AI-Tools.md`, `km/history.md`.
- Risques : generation de claims scientifiques, couts API, execution d'experiences, citations et publication non verifiee.
- Rollback possible : supprimer cette fiche et retirer les lignes d'index.
