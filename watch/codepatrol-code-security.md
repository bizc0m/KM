# CodePatrol - Code Security Watch

## Type

Veille outils dev/security / code review et SAST.

## Tags

code-security, sast, code-review, vulnerability-scanning, appsec, devtools, sensitive, to-verify

## Appel canonique

`watch:codepatrol-code-security`

## Sources

- URL fournie : `https://codepatrol-2.polsia.app/`
- Source secondaire trouvee : `https://sourceforge.net/software/product/CodePatrol/`

Lecture : 2026-05-22

## Statut verification

`a verifier`

L'URL fournie n'a pas donne de contenu exploitable dans la lecture actuelle. Les resultats publics associent le nom CodePatrol a un outil de revue de code automatisee orientee securite, SAST, scan de vulnerabilites et agregation de resultats.

## Resume court

CodePatrol semble designer une famille/outillage de code security : revue automatisee, SAST, scan de vulnerabilites, alerting et consolidation de resultats. L'URL exacte fournie doit etre re-verifiee avant integration technique ou recommandation.

## Usage utile

- Surveiller les outils SAST et code review securite.
- Comparer avec CodeQL, Semgrep, Checkmarx, Veracode, Codacy ou plateformes AI-native AppSec.
- Inspirer un flux KM de verification de projets : secrets, vulnerabilites, dependances, IaC, qualite code.
- Relier aux guardrails agents avant execution ou publication de code.

## Usage abusif possible

| Risque | Description | Classement |
| --- | --- | --- |
| Upload code prive | envoyer un repo sensible vers un SaaS non verifie | sensible critique |
| Secrets exposure | scan d'un repo contenant tokens, credentials ou donnees client | sensible critique |
| False confidence | croire qu'un scan SAST remplace audit humain ou tests dynamiques | sensible |
| Supply chain | installer un outil ou plugin non verifie dans CI/CD | sensible |

## Garde-fous

- Ne pas connecter de repo prive avant verification du fournisseur, des conditions et du traitement des donnees.
- Scanner localement ou sur repo test quand possible.
- Ne jamais uploader secrets, `.env`, dumps, logs ou donnees personnelles.
- Verifier provenance, integrations, permissions GitHub/GitLab et politique de retention.
- Traiter les resultats comme signal, pas comme preuve absolue.

## Relations

- `watch:ai-open-source-tools-inventory`
- `watch:red-team-risk-tools-watch`
- `process:ai-tools`
- `theme:charte-ia`

## Decision KM

Garder en veille `sensible` avec statut `a verifier`. Pas `#ROUGE` par defaut car l'usage principal est defensif/code security. Devient `#ROUGE` seulement si l'outil sert a exfiltrer du code, collecter secrets ou scanner des repos sans autorisation.

## Changelog

### v0.1 - 2026-05-22

- Objectif : integrer l'URL `codepatrol-2.polsia.app` en veille code security.
- Fichiers touches : `watch/codepatrol-code-security.md`, `watch/index.md`, `index.md`, `process/AI-Tools.md`, `km/history.md`.
- Risques : source directe non exploitable, confusion possible avec autres produits CodePatrol.
- Rollback possible : supprimer cette fiche et retirer les lignes d'index.
