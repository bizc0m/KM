# KM Bridge

Plugin NotePlan local pour importer des fiches KM depuis le presse-papiers.

## Commandes

- `/km fiche` : ajoute une fiche KM nettoyee dans la note active.
- `/km action` : ajoute une fiche KM avec checklist.
- `/km inbox` : ajoute une fiche dans une section `KM A traiter`.
- `/km clean` : nettoie la fiche et remet le resultat dans le presse-papiers.

## Flux recommande

1. Dans le dashboard KM, copier une fiche ou une selection Markdown.
2. Ouvrir une note NotePlan.
3. Lancer `/km fiche` ou `/km action`.

## Format produit

```markdown
# Titre

## Fonction
export conversations ChatGPT, PDF, Markdown

## Sources
- Source: https://...
- Post Twitter: https://x.com/...
- Repo GitHub: https://github.com/...

## Topics GitHub
#chatgpt #pdf #export

## Action
- [ ] Tester
- [ ] Classer
- [ ] Garder / ignorer
```
