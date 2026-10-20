# KM — consignes de travail

- NotePlan : lire Calendar uniquement. Exclure les contenus personnels, intimes, sexuels et les secrets. Ne pas enregistrer de notes brutes dans les journaux.
- Explorer tous les liens utiles, articles X et tweets cités compris, jusqu’à trois niveaux ; conserver les limites de pages, erreurs et éléments non lus dans les compteurs.
- Une fiche par outil identifié ; dédoublonner par dépôt canonique. Enrichir une fiche existante en conservant ses sources et son origine. Un annuaire n’est pas chaque outil qu’il cite.
- Texte visible : intérêt pratique uniquement, français naturel, style télégraphique, 6 à 15 mots. Action concrète et résultat utile, exclusivement documentés. Aucun nom d’outil, publicité, chiffre promotionnel, bénéfice vague ou phrase tronquée. À défaut : « Intérêt à vérifier ».
- Appliquer les corrections aux fiches existantes et aux générations futures. Sauvegarder avant les migrations et les fusions.
- Distinguer notes lues, notes productrices identifiées, liens, outils uniques, fiches créées/enrichies, rejets, doublons, blocages et attente. Ne jamais présenter le ratio fiches/notes comme un taux de conversion des notes.
- Vérifier de bout en bout : source, extraction, fiche, index et affichage navigateur. Un HTTP 200 ne confirme pas le contenu visible.
- Annoncer séparément installé, en cours et terminé. Donner les preuves et limites ; ne pas annoncer une collecte complète si le rapport indique une couverture partielle.
- Après une correction autorisée, exécuter les tests pertinents, commiter et pousser sur la branche de travail GitHub ; ne pas fusionner dans main sans demande. Rapporter le hash et distinguer le déploiement M2 du push GitHub.
- Continuer les opérations déjà autorisées sans redemander confirmation ; ne pas supprimer de contenu utilisateur ni publier de données privées.
- Hashtags : 2 à 4 tags précis quand les sources le permettent ; fonction, usage et compatibilité utile. Réutiliser le vocabulaire existant et harmoniser ses variantes. Pas de #technique, #informatique, #github, #raindrop ni tags publicitaires ou issus de texte parasite. Ne pas inventer des tags pour atteindre un quota. Garder le statut de risque séparé du classement fonctionnel.
- Ontologie : `km.ontology.json` est le référentiel des sujets, fonctions, compatibilités, risques, provenance et état. Préserver des identifiants stables et un héritage sans cycles. Une provenance GitHub n’est pas un sujet de développement ; un langage n’est pas un système compatible ; un sujet de sécurité n’est pas une qualification offensive. Les fiches sans sujet établi sont « À qualifier ». Tout changement doit s’appliquer au générateur, aux fiches existantes et aux filtres de KM via le module partagé.

- Cartes : afficher les mots-clés précis finaux, sans les catégories parentes ni les chemins complets. La hiérarchie reste accessible dans les filtres. Conserver les hashtags précis existants avant les nouvelles déductions, y compris lors de l’enrichissement d’une fiche. Couleurs déterministes par famille dans `scripts/km-keywords.mjs` ; aucun classement par sous-chaîne vague. Les topics GitHub restent des métadonnées distinctes.

- Dépôts GitHub : un fork vérifié appartient au projet source (`source.full_name`), pas à un nouvel outil. Résoudre les forks avant publication ; conserver les références lors des fusions sauvegardées. Ne pas explorer les pages GitHub fork/network/stargazers/contributeurs comme des catalogues d’outils. Les alias vérifiés sont dans `km.repository-aliases.json`.

- Métadonnées : Nature, Thème, Fonction, OS, Licence, Tarification et Accès sont des axes indépendants. Palette historique par domaine dans `km.colors.json` : thèmes et mots-clés précis colorés ; nature, OS, licence, tarification et accès neutres. Ne pas déduire une licence libre ou la gratuité de GitHub, ni un OS d’un langage. Conserver les métadonnées lors de l’enrichissement ; les informations sans preuve restent « À vérifier ».

- Règle de base obligatoire : `km/couleurs-et-pertinence.md`. La couleur sert au repérage du domaine, jamais à noter la qualité. Un tag visible doit être étayé, utile pour sélectionner une ressource et non redondant. Ne pas supprimer les couleurs historiques lors des évolutions du viewer.

- Résultats de recherche : titre, liens principaux, intérêt concret et mots-clés précis colorés uniquement. Ne pas y afficher la ligne de nature/thème/OS/licence ni les inconnues « Nature à vérifier » ou « Non précisée ». Ces métadonnées restent dans la fiche et les filtres. Ne pas répéter un hashtag sous forme de catégorie supplémentaire.

- Titre des résultats : nom du projet seulement, sans sous-titre descriptif ni slogan ; conserver le titre complet dans la fiche et la recherche. L’intérêt doit ajouter une fonction concrète ; ne pas remplacer un intérêt absent par le type ou par le titre. Masquer les phrases génériques plutôt que fabriquer un bénéfice.

- Abréviations : convention dans `km/couleurs-et-pertinence.md` (IA, LLM, CLI, API, SDK, OS, App, Dev, Docs, Cyber, OSINT, TTS, STT et libellés courts). Conserver les identifiants et la couleur du concept complet. L’intégration de la règle ne vaut pas autorisation de modifier l’affichage.
