# CC-GUI / MossX - VibeCoding Editor

## Type

Veille outils IA / editeur vibe coding multi-engine.

## Tags

vibe-coding, ai-editor, developer-tools, claude-code, codex, opencode, gemini, multi-engine, sensitive, to-verify

## Appel canonique

`watch:ccgui-mossx-vibecoding-editor`

## Sources

- Page Vibe Shit : `https://vibeshit.org/product/ccgui`
- Site associe : `https://www.mossx.ai/`

Lecture : 2026-05-22

## Statut verification

`a verifier`

La page Vibe Shit annonce un lien GitHub et un auteur `zhukunpenglinyutong`, mais le repo visible n'a pas ete confirme via GitHub API au moment de la verification. Le site MossX est lisible et presente un portail vibe coding open source avec support Claude Code, Codex, Cursor/VSCode, AI workflows, MCP Market et Skills Market.

## Resume court

CC-GUI / MossX est presente comme un editeur/portail vibe coding open source multi-engine, proche d'une alternative Cursor. La page Vibe Shit cite Claude Code, Codex, OpenCode et Gemini, avec panels developpeur : chat canvas, terminal, gestion Git, kanban et memoire IA.

## Usage utile

- Comparer les interfaces AI coding : Cursor, Claude Code GUI, Codex, OpenCode, Gemini.
- Surveiller les patterns UI pour agents de code : terminal, git, kanban, memoire, workflows.
- Inspirer des outils internes de pilotage agents et revue de plans.
- Identifier les risques d'integration multi-provider et multi-agent dans un IDE.

## Usage abusif possible

| Risque | Description | Classement |
| --- | --- | --- |
| Code disclosure | envoyer code prive ou prompts sensibles a des providers non verifies | sensible |
| Key leakage | stocker cles API / tokens dans config, logs ou plugins | sensible critique |
| Tool execution | laisser un agent modifier fichiers, git ou terminal sans validation | sensible |
| Supply chain | installer plugins, MCP ou skills non audites | sensible |
| False authority | UI professionnelle pouvant masquer des claims non verifies | sensible |

## Garde-fous

- Verifier repo, licence, permissions et modele de securite avant usage.
- Ne pas ouvrir de repo sensible dans un editeur non audite.
- Ne pas stocker secrets en clair dans l'outil.
- Desactiver execution terminal/git automatique sans validation humaine.
- Tester uniquement sur repo sandbox avant integration.
- Auditer MCP, skills et plugins ajoutes.

## Relations

- `watch:vibeshit-vibe-coding-directory`
- `watch:agentsview-session-intelligence`
- `watch:nanoclaw-personal-agent`
- `watch:ai-open-source-tools-inventory`
- `process:ai-tools`
- `theme:charte-ia`

## Decision KM

Garder en veille `sensible` avec statut `a verifier`. Pas `#ROUGE` par defaut, car l'usage annonce est developpeur/IDE. Devient `#ROUGE` seulement si l'outil facilite execution non autorisee, exfiltration de code/secrets ou installation de composants malveillants.

## Changelog

### v0.1 - 2026-05-22

- Objectif : integrer `ccgui` depuis Vibe Shit comme editeur vibe coding multi-engine.
- Fichiers touches : `watch/ccgui-mossx-vibecoding-editor.md`, `watch/index.md`, `index.md`, `watch/ai-open-source-tools-inventory.md`, `process/AI-Tools.md`, `km/history.md`.
- Risques : repo GitHub non confirme, plugins/MCP/skills a auditer.
- Rollback possible : supprimer cette fiche et retirer les lignes d'index.
