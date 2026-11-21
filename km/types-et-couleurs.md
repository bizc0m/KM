# Types, thèmes et couleurs

La règle de base est `km/couleurs-et-pertinence.md`. La palette historique par domaine est définie dans `km.colors.json`. Les propositions antérieures de couleur par nature ou de hashtags gris sont abandonnées.

## Axes indépendants

- Nature : Modèle (LLM, multimodal, embedding) ; Service (API hébergée, application web, passerelle) ; Outil (bureau, mobile, CLI, SDK, extension, MCP) ; Skill (individuel ou collection) ; Agent (spécialisé ou multi-agents) ; Documentation (guide, article, catalogue).
- Thème : domaine d’usage et sous-thème dans `km.ontology.json`.
- Fonction : action réellement documentée dans ce même référentiel.
- OS : macOS, Windows, Linux, iOS/iPadOS, Android.
- Licence : identifiant SPDX lorsqu’il est reconnu ; « Non précisée » si GitHub ne fournit pas d’identifiant reconnu ; « À vérifier » si non contrôlée.
- Tarification : gratuit, freemium, payant, à l’usage, essai gratuit ; indépendant de la licence.
- Accès : navigateur, application native, terminal, auto-hébergement.

Sur une carte : mots-clés précis et thème colorés par domaine ; nature, OS et licence neutres. Les chemins complets et critères détaillés restent dans les filtres et la fiche. Les topics GitHub restent des métadonnées de provenance dans la fiche.

Les informations non étayées restent « À vérifier ». Une licence du code associé ne garantit pas la licence d’un modèle, d’un service ni de ses dépendances. Ne pas déduire le prix de la licence, ni un OS du langage de programmation. Conserver les preuves et les métadonnées lors des enrichissements.

Référentiels partagés : `km.resources.json` pour les natures et axes techniques ; `km.ontology.json` pour les thèmes et fonctions ; `km.colors.json` pour la palette.

- Résultats de recherche : titre, liens principaux, intérêt concret et mots-clés précis colorés uniquement. Ne pas y afficher la ligne de nature/thème/OS/licence ni les inconnues « Nature à vérifier » ou « Non précisée ». Ces métadonnées restent dans la fiche et les filtres. Ne pas répéter un hashtag sous forme de catégorie supplémentaire.
