# Ontologie KM et classement automatique

## Référentiel unique

`km.ontology.json`, version 1.0, contient 149 concepts identifiés, leurs libellés, parents, synonymes et règles textuelles explicites. `scripts/km-ontology.mjs` valide l’unicité des identifiants, l’existence des parents et l’absence de cycles. Il est partagé par la génération, le reclassement des fichiers existants et la construction de KM Search.

Les six dimensions sont indépendantes :

- **Sujets** : de quoi parle la fiche.
- **Fonctions** : ce que permet l’outil.
- **Compatibilités** : langages, systèmes, formats, protocoles, intégrations et modes d’exécution explicitement documentés.
- **Risques** : signalements explicites, séparés des sujets de cybersécurité.
- **Provenance** : origine NotePlan Calendar, Raindrop, X et liens GitHub réellement présents.
- **État** : actif ou à vérifier.

Un lien GitHub ne classe pas automatiquement la fiche en développement logiciel. Un sujet « analyse de logiciels malveillants » n’implique pas un risque offensif. La présence de Python n’implique ni macOS ni compatibilité M2. NotePlan cité comme outil n’implique pas une origine NotePlan : la provenance vient de la traçabilité.

## Hiérarchie des sujets

Exemples de chemins :

- Intelligence artificielle → Agents IA → Mémoire des agents.
- Intelligence artificielle → Agents IA → Orchestration des agents.
- Intelligence artificielle → Modèles de langage.
- Audio, vidéo et création → Audio → Voix.
- Audio, vidéo et création → Audio → Identification audio.
- Cybersécurité → Sécurité web.
- Cybersécurité → Renseignement en sources ouvertes.
- Développement logiciel → Paquets et dépendances.
- Infrastructure → Déploiement et hébergement.
- Données et connaissances → Documents.
- Analyse financière → Marchés prédictifs.

Une fiche peut avoir plusieurs sujets pertinents. Elle hérite de tous leurs parents : sélectionner « Audio » retrouve aussi les fiches « Identification audio » et « Voix ».

## Synonymes et classement

`memory`, `long-term-memory`, `mémoire-agents` et `context-engineering` convergent vers le concept de mémoire des agents lorsque ces étiquettes sont présentes. Les anciens alias des fonctions et les libellés français sont disponibles pour la recherche. Les identifiants restent stables quand un libellé est amélioré.

Le classement utilise les hashtags précis et les informations du titre, de l’intérêt, du résumé ou des faits disponibles. Les liens des sources et les pages annexes ne deviennent pas des mots-clés de sujet. Les métadonnées d’une classification établie à partir de faits plus détaillés sont conservées lorsque le texte visible est raccourci.

Les concepts canoniques et chemins lisibles sont enregistrés sous `## Ontologie` dans chaque fichier concerné. Cette section est cachée du texte de fiche affiché ; les sujets sont présentés sous forme de chemins cliquables et de filtres. Les risques et la provenance sont recalculés depuis leurs données dédiées, sans hériter d’un ancien signalement devenu faux.

Un sujet insuffisamment établi reçoit **À qualifier**. Un tag inconnu reste signalé dans le rapport privé, sans être transformé arbitrairement en concept. L’absence de fonction ou de compatibilité connue reste une absence ; aucun quota ne force des assertions.

## Filtres dans KM Search

Trois filtres indépendants et combinables sont visibles : **Sujet**, **Fonction**, **Compatibilité**. Les parents et sous-domaines sont affichés avec leurs chemins complets. Le filtrage par statut et par dossier reste distinct.

Exemple testé dans le navigateur : sujet « Audio » + fonction « Identifier un enregistrement » + compatibilité « Python » retrouve Chromaprint. Les trois valeurs sont conservées dans l’URL et après rechargement. La recherche textuelle profite aussi des synonymes de concepts.

## Intégration au M2

À chaque lancement du service existant, après fusion des doublons et normalisation des hashtags, `km-classify-fiches.mjs` reclasse les fichiers existants et produit `pipeline/ontology-report.json`. Puis KM est reconstruit et le placement vérifié. Les nouvelles fiches passent directement par la même ontologie dans `addFiche`.

Les fichiers modifiés par une migration sont sauvegardés dans `~/Library/Application Support/KM/backups/ontology-*`. Le reclassement n’efface ni les intérêts ni les liens sources. Le lecteur NotePlan reste limité à Calendar et ne persiste pas de notes brutes.

Commandes, depuis `/Users/JOB/#DEV/06-km/KM` sur le M2 :

```sh
/opt/homebrew/bin/node scripts/km-classify-fiches.mjs
/opt/homebrew/bin/node scripts/build-search-v1.12-html.mjs
/opt/homebrew/bin/node scripts/km-verify-placement.mjs
/opt/homebrew/bin/node scripts/km-coverage.mjs
```

Ne pas lancer une migration manuelle pendant les écritures du collecteur ; utiliser normalement le LaunchAgent et son point d’entrée `km-technical-run.mjs`. Pour une intervention, arrêter ce service avant de modifier les fichiers, puis le relancer.

## État initial vérifié le 19 octobre 2026 à 17 h 38, Paris

456 fichiers Markdown ont été réévalués, y compris des documents historiques non publiés. Parmi les 421 fiches visibles, 48 sont marquées **À qualifier**, dont 21 fiches générées. Les 240 fiches générées restent présentes dans les index et le tableau. Ces populations sont différentes : les rapports ne doivent pas confondre fichiers parcourus, fiches visibles, notes Calendar et outils uniques.

Les tags historiques non couverts par les synonymes sont conservés comme mots-clés et signalés dans le rapport. Ils ne prouvent pas une attribution de sujet. La validation sémantique complète des fiches à qualifier reste à faire à partir de sources suffisantes.

## Évolution du référentiel

Pour ajouter un sujet : choisir son parent, un identifiant stable, un libellé clair et des synonymes réellement équivalents. Pour une fonction ou une compatibilité, utiliser la dimension correspondante. Les règles textuelles doivent correspondre à des termes explicites du contenu ; éviter les correspondances trop larges.

Lancer `npm run km:technical:test`, déployer le JSON et les modules ensemble sur le M2, reclasser et reconstruire KM, vérifier les filtres dans le navigateur, puis commiter et pousser le code et la documentation. Ne pas pousser les rapports privés ni les sauvegardes.

30 tests couvrent notamment les cycles et parents, les synonymes, l’héritage, l’indépendance des dimensions, la conservation des classifications, la génération du tableau et ses trois contrôles. Le cumul de filtres et sa persistance ont aussi été vérifiés réellement dans le navigateur.

## Viewer publié sur GitHub Pages

Le site `https://bizc0m.github.io/KM/search-v2.html` publie le snapshot filtré des fiches du M2 depuis la branche `codex/km-technical-pipeline`. Le viewer et ses liens de fiches utilisent cette même branche ; `main` n’est pas fusionnée automatiquement. `public/snapshot.json` indique la date et le nombre de fiches de la dernière publication. Le site est un snapshot, pas un accès direct aux fichiers privés du M2.

La commande `node scripts/km-import-public-snapshot.mjs CHEMIN_JSON` importe uniquement les fiches de la vue publique filtrée. Ne pas utiliser une exportation brute NotePlan. Reconstruire et vérifier KM, puis pousser les Markdown importés, leurs index et les HTML produits ensemble. Aucune sauvegarde ni cache du M2 n’est publié.

- Cartes : afficher les mots-clés précis finaux, sans les catégories parentes ni les chemins complets. La hiérarchie reste accessible dans les filtres. Conserver les hashtags précis existants avant les nouvelles déductions, y compris lors de l’enrichissement d’une fiche. Couleurs déterministes par famille dans `scripts/km-keywords.mjs` ; aucun classement par sous-chaîne vague. Les topics GitHub restent des métadonnées distinctes.
