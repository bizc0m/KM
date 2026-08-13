# Changelog

## v0.5 - 2026-08-13

Objectif : rendre l'acces GitHub visible directement dans la colonne corpus.

Fichiers touches :
- `scripts/build-search-v1.12-html.mjs`
- `search-v1.12.html`
- `public/`

Changements :
- bouton `GitHub` ajoute sur chaque ligne titre de fiche ;
- lien `GitHub` pointe vers la fiche Markdown correspondante dans le repo ;
- lien `GitHub source` conserve le repo externe quand une source GitHub est detectee ;
- lien `Source` conserve l'URL finale non GitHub.

Risques :
- GitHub Pages publique renvoie encore 404 tant que Pages n'est pas activee/configuree pour ce repo.

Rollback possible :
- revenir au commit precedent `80c987d`.

## v0.4 - 2026-08-13

Objectif : pousser le nettoyage complet des fiches KM et stabiliser le routage des themes.

Fichiers touches :
- `km.config.json`
- `scripts/build-search-v1.12-html.mjs`
- `search-v1.12.html`
- `public/`
- fiches `watch/`, `resources/`, `km/` et `process/`

Changements :
- anciens prefixes parasites de capture supprimes des fiches et du dashboard ;
- source personnelle Raindrop anonymisee ;
- titres et resumes courts normalises en anglais dans l'affichage ;
- themes dashboard resserres pour eviter le classement massif en `Agents IA` ;
- pages publiques de themes regenerees.

Risques :
- certaines fiches restent `a_verifier` quand la source complete n'a pas ete relue ;
- les fichiers internes conservent la classification sensible pour le suivi KM.

Rollback possible :
- revenir au commit precedent `b40b23e` ou au tag Git `v0.3`.

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
