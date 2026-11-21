# Règle de base — couleurs et pertinence d’usage

La palette historique du viewer (commit `99654d5`, 13 août 2026) est le défaut du projet. `km.colors.json` est sa source unique ; `scripts/km-keywords.mjs` affecte une famille aux mots-clés et aux sujets. Le générateur produit les styles depuis ce référentiel. Ne pas neutraliser les mots-clés ni remplacer la palette lors d’une évolution des métadonnées.

## Sens des couleurs

- Violet : LLM et API IA.
- Vert turquoise : agents et automatisation.
- Bleu : développement et code.
- Bleu ardoise : recherche et connaissances.
- Rose : création, image, vidéo, audio et voix.
- Orange doux : OSINT et reconnaissance.
- Rouge pâle : domaine cybersécurité, sans qualification offensive implicite.
- Vert : confidentialité et protection des données.
- Doré : finance.
- Jaune pâle : sources, RSS et veille.
- Mauve : catalogues, inspiration et listes de suivi.
- Gris : nature, OS, licence, tarification, accès ou domaine non établi.

Les statuts restent distincts : `#ROUGE` pour un risque explicitement établi, orange vif pour une vérification requise. Une couleur thématique ne constitue ni un score de qualité, ni une garantie, ni une alerte. Conserver le libellé lisible sans perception des couleurs. GitHub/Site/Source sont des actions, pas des domaines ; les topics GitHub dans le détail gardent leur présentation de provenance.

## Pertinence d’usage

Un mot-clé visible doit satisfaire ces trois conditions :

1. Être étayé par la source propre à la ressource, sans emprunter les caractéristiques des outils cités ou des dépendances.
2. Aider à sélectionner la ressource pour une tâche concrète : fonction, domaine précis ou compatibilité utile.
3. Apporter une information distincte : ne pas répéter le titre, un autre tag ou une catégorie générale sans précision.

Exemples : `#transcription` aide à sélectionner une fonction ; `#hors-ligne` est utile si documenté ; `#technique` et `#informatique` n’aident pas à choisir. `#skills-agents` décrit une famille mais ne suffit pas à expliquer l’intérêt d’une collection de cybersécurité : conserver ses fonctions établies et son domaine.

Une couleur n’autorise jamais à inventer un tag. Conserver les mots-clés précis existants ; harmoniser les variantes ; afficher deux à quatre tags seulement si justifiés. Une affectation inconnue ou ambiguë reste grise. Les métadonnées de licence/OS sont séparées et leurs inconnues ne changent pas le statut global.

L’intérêt décrit en 6 à 15 mots l’action utile et son résultat, documentés. Exemple : « Transcrire des entretiens localement et distinguer les intervenants » si ces fonctions sont attestées. Ne pas substituer « puissant », « professionnel », « innovant » ou « en temps réel » à une fonction vérifiée. Aucune note numérique de pertinence n’est déduite de la couleur.

## Application et limites

La règle s’applique au pipeline, aux fiches existantes, au viewer M2 et à la publication GitHub. Les tests doivent couvrir la stabilité des familles, la palette historique, l’affichage coloré des mots-clés, les métadonnées neutres et la séparation avec les risques. Le contrôle automatique filtre les tags génériques et les doublons ; il ne certifie pas à lui seul la pertinence sémantique de toutes les anciennes fiches.

- Résultats de recherche : titre, liens principaux, intérêt concret et mots-clés précis colorés uniquement. Ne pas y afficher la ligne de nature/thème/OS/licence ni les inconnues « Nature à vérifier » ou « Non précisée ». Ces métadonnées restent dans la fiche et les filtres. Ne pas répéter un hashtag sous forme de catégorie supplémentaire.

- Titre des résultats : nom du projet seulement, sans sous-titre descriptif ni slogan ; conserver le titre complet dans la fiche et la recherche. L’intérêt doit ajouter une fonction concrète ; ne pas remplacer un intérêt absent par le type ou par le titre. Masquer les phrases génériques plutôt que fabriquer un bénéfice.

## Abréviations et libellés courts — règle permanente

- Intelligence artificielle → IA ; modèle de langage → LLM ; ligne de commande → CLI ; interface de programmation → API ; bibliothèque de développement → SDK ; système d’exploitation → OS.
- Application → App ; développement → Dev ; documentation → Docs ; cybersécurité → Cyber ; recherche en sources ouvertes → OSINT ; synthèse vocale → TTS ; reconnaissance vocale → STT.
- Libellés de sélection courts : Compétences des agents → Skills ; Mémoire des agents → Mémoire ; Orchestration des agents → Orchestration ; Recherche documentaire → Recherche ; Génération d’images → Images ; Génération vidéo → Vidéo.
- « Collection de skills » peut se lire « Skills » dans un libellé compact. Conserver la distinction individuel/collection dans la fiche et les filtres. Ne pas créer de nouvelles métadonnées sur la carte pour afficher ces abréviations.
- Fournir le libellé complet en infobulle et dans le nom accessible. Les identifiants, valeurs de filtrage, hashtags canoniques et chemins de hiérarchie restent stables : seul le libellé visible change lors d’une implémentation explicitement demandée.
- Conserver tels quels les noms des projets, MIT, Apache-2.0, macOS, Windows et Linux. Éviter les abréviations inventées comme « Coll. sk. » ou « Rech. doc. ». Ne pas couper les phrases d’intérêt en abréviations.
- Une abréviation conserve exactement la famille de couleur du concept complet : LLM/API IA violet ; Dev bleu ; Skills/Mémoire/Orchestration des agents vert turquoise ; Recherche bleu ardoise ; Images/Vidéo/TTS/STT rose ; OSINT orange doux ; Cyber rouge pâle. App, OS, licence, prix et accès restent gris. API générale de développement : bleu, sans la confondre avec une API IA.
- La palette immuable par défaut est `km.colors.json` (texte, fond et bordure) ; ne pas créer une nouvelle couleur pour une abréviation. « Cyber » rouge pâle ne signifie pas statut `#ROUGE`.
- Implémentation du 20 octobre 2026 : `km.labels.json` et `scripts/km-labels.mjs` associent les libellés courts aux noms complets ; les boutons gardent les hashtags canoniques dans `data-tag`, avec infobulle et nom accessible complets. Les options hiérarchiques gardent leurs identifiants et leurs chemins complets accessibles. Les natures restent distinctes dans le détail et les filtres. API générique est bleue ; API accompagnée d’une classification LLM ou de tags explicites LLM/fournisseurs est violette. Aucun titre, source ni donnée de fiche réécrit.
