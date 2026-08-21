# Sort Priority - /tri

Plugin NotePlan local. Commande unique :

- `/tri`

Action : trie uniquement la note ouverte, sans argument, par priorité héritée :

`!!!` -> `!!` -> `!` -> normal -> racines terminées `[x]`

La logique métier vit dans `src/core` et n'importe aucune API NotePlan. L'API réutilisable est :

```ts
import { smartSortMarkdown } from './src/core'

smartSortMarkdown(markdown)
```

## Build

```sh
npm install
npm test
npm run build
```

## Installation NotePlan

Copier `dist/plugin.json`, `dist/script.js` et `dist/README.md` dans :

```text
~/Library/Containers/co.noteplan.NotePlan-setapp/Data/Library/Application Support/co.noteplan.NotePlan-setapp/Plugins/av.sort-today-tasks/
```

Et, si présent :

```text
~/Library/Containers/co.noteplan.NotePlan3/Data/Library/Application Support/co.noteplan.NotePlan3/Plugins/av.sort-today-tasks/
```

Relancer NotePlan, puis lancer `/tri`.

## Note Folding

La documentation publique de l'API Plugin NotePlan vérifiée le 2026-08-20 expose `Editor.content`, les paragraphes et les notes, mais pas d'état explicite `collapsed/expanded` modifiable par plugin. Smart Sort préserve donc strictement la structure Markdown, l'indentation et les blocs qui permettent le folding naturel de NotePlan.

## Règle de priorité

Les priorités sont reconnues uniquement comme tokens séparés `!`, `!!`, `!!!` hors URLs, hors inline code et hors fenced code blocks. En cas d'ambiguïté, Smart Sort ignore le signal plutôt que de réordonner agressivement.
