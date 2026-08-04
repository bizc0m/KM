# n8n Workflow Automation

## Type

Veille outil / automatisation workflows.

## Tags

automation, workflows, integrations, ai, self-hosted, github, sensible

## Appel canonique

`watch:n8n-workflow-automation`

## Sources

- Raindrop KM Monitor : `https://arno-vltn.raindrop.page/km-monitor-71629567`
- Repo GitHub : `https://github.com/n8n-io/n8n`

Lecture KM : 2026-06-24

Source Raindrop :

- titre : `n8n-io/n8n: Fair-code workflow automation platform with native AI capabilities. Combine visual building with custom code, self-host or cloud, 400+ integrations.`
- date : 2026-06-24T16:23:44.143Z
- domaine : `github.com`
- auteur/source : `arnaud-velten`
- tags detectes : aucun tag Raindrop

## Resume court

n8n est une plateforme d'automatisation de workflows avec integrations et capacites IA. Elle etait deja citee dans les inventaires KM ; cette fiche dediee centralise le suivi.

## Classification

`sensible`

Raison : automatisation puissante avec connecteurs ; `#ROUGE` seulement si connectee a secrets, donnees sensibles, spam, exfiltration ou scraping abusif.

## Usage KM

- Suivre les outils d'orchestration workflow.
- Comparer self-hosting, connecteurs, logs et validation humaine.
- Evaluer les usages internes autorises.

## Risque d'abus possible

| Risque | Description | Classement |
| --- | --- | --- |
| Exfiltration | workflows connectes a donnees sensibles ou comptes tiers | #ROUGE si abus |
| Spam | automatisation de messages ou outreach non consenti | #ROUGE si abus |
| Secrets | stockage de credentials dans workflows | sensible |

## Garde-fous

- Segmentation des credentials et scopes minimaux.
- Logs et revues avant activation de workflows externes.
- Pas de scraping, spam ou exfiltration non autorises.

## Relations

- `watch:open-source-saas-alternatives-nicos-ai`
- `watch:ai-open-source-tools-inventory`
- `watch:red-team-risk-tools-watch`

## Changelog

### v0.1 - 2026-06-24

- Objectif : creer une fiche dediee n8n depuis Raindrop KM Monitor.
- Fichiers touches : `watch/n8n-workflow-automation.md`, `watch/index.md`, `index.md`, `km/history.md`.
- Risques : connecteurs, secrets, exfiltration si mal cadres.
- Rollback possible : supprimer cette fiche et retirer les lignes d'index.
