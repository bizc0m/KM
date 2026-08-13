# Changelog

## v0.3 - 2026-08-13

Objectif : stabiliser KM Search avec titres anglais propres, statut sensible fusionne et notes de corpus depliables.

Fichiers touches :
- `scripts/build-search-v1.12-html.mjs`
- `search-v1.12.html`
- `public/`
- fiches `watch/` et `resources/` dont le titre a ete nettoye en anglais
- `watch/geneva-ai-summit-2027-strategic-direction.md`
- `index.md`

Changements :
- titres source/dashboard nettoyes et traduits en anglais ;
- `#ROUGE` et `sensible` fusionnes en affichage public `Sensible` rouge ;
- badge `Watch` retire de l'interface ;
- resume non anglais masque par un resume anglais neutre dans le dashboard ;
- carte active depliable avec date, chemin, theme, concepts, statut, resume et actions ;
- source finale conservee dans les fiches.

Risques :
- certains resumes automatiques restent volontairement generiques si la source originale n'est pas en anglais ;
- les statuts internes `#ROUGE` restent dans les fichiers pour conserver la classification de risque.

Rollback possible :
- revenir au commit precedent ou au tag Git `v0.2` si disponible ;
- sinon restaurer `scripts/build-search-v1.12-html.mjs`, `search-v1.12.html`, `public/` et les titres de fiches depuis Git.
