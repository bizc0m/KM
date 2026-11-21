# Prompt GPT - KM Search v2 / fiches KM

Tu travailles sur le repo KM `https://github.com/bizc0m/KM` ou sur son checkout local `/Users/JOB/#DEV/06-km/KM` si disponible.

Objectif : maintenir les fiches Markdown KM et la page `search-v2.html` sans inventer de donnees, sans casser les liens, sans push non autorise.

Contexte actuel :
- Dashboard principal : `search-v2.html`.
- Generateur : `scripts/build-search-v1.12-html.mjs`.
- Maintenance fiches/topics : `scripts/km-update-github-topics.mjs`.
- Config : `km.config.json`.
- Dossiers principaux : `watch/`, `resources/`, `books/`, `km/`.
- DemoForge doit rester conserve en Markdown mais masque du dashboard public.

Regles strictes :
- Ne modifie pas les donnees source, URLs, actions, filtres, classifications ou contenu des fiches hors demande explicite.
- Ne supprime pas de fiche sauf demande explicite.
- Ne fais pas de `git push`, `git pull`, `merge`, `rebase`, `reset`, `clean` sans autorisation explicite.
- Ne stocke jamais secrets, tokens, emails prives, chemins personnels exposables, donnees personnelles inutiles, ni contenu copyright complet.
- Ne classe `#ROUGE` que pour les outils offensifs ou abusables directement. Sinon utiliser `sensible`, `a verifier` ou `actif`.
- Si une information n'est pas verifiee, marque-la `A_VERIFIER`.

Taches a effectuer :
1. Verifier l'etat du repo :
   - `pwd`
   - `hostname`
   - `git status --short --branch`
   - `git remote -v`
   - `git branch --show-current`
   - `git log -5 --oneline --decorate`
2. Nettoyer les fiches :
   - supprimer toute occurrence de `Veille Raindrop KM Monitor` et `Veille Raindrop KM Monitor /`;
   - verifier qu'aucun rendu `TYPE ## Tags` ne subsiste;
   - corriger les `Type` vides uniquement depuis les tags existants, sans source externe inventee.
3. Topics GitHub :
   - pour chaque URL `https://github.com/owner/repo`, interroger GitHub;
   - recuperer uniquement les topics reels du depot;
   - creer ou mettre a jour une section `## Topics GitHub`;
   - format attendu :

```markdown
## Topics GitHub

- Repo : `https://github.com/owner/repo`
- Topics releves : topic-a, topic-b, topic-c
```

   - si GitHub renvoie 404 ou erreur API, ne pas inventer : lister le depot en `A_VERIFIER`.
4. Dashboard :
   - reconstruire avec `node scripts/build-search-v1.12-html.mjs`;
   - ne pas modifier `search-v2.html` a la main sauf urgence documentee.
5. Verification :
   - `node --check scripts/build-search-v1.12-html.mjs`
   - `node --check scripts/km-update-github-topics.mjs`
   - `node scripts/km-update-github-topics.mjs`
   - `node scripts/build-search-v1.12-html.mjs`
   - `rg -n "FICHE GITHUB|SELECTION|TYPE ## Tags|Veille Raindrop KM Monitor|Topics releves:" search-v2.html`
   - ouvrir `http://127.0.0.1:8789/search-v2.html`
   - verifier visuellement : `KM Search v2`, 153 fiches, descriptions sur deux lignes, tags cliquables, topics GitHub cliquables, aucun `FICHE GITHUB`, aucun `SELECTION`, DemoForge absent.

Rapport final attendu :
- fichiers modifies;
- nombre de fiches traitees;
- nombre de fiches avec topics GitHub;
- depots en `A_VERIFIER`;
- dashboard regenere;
- tests/controles reels effectues;
- etat Git;
- confirmer qu'aucun push n'a ete fait sauf autorisation explicite.
