# Types de ressources et couleurs — proposition UX

Les types sont des catégories sœurs : un LLM n’est pas le parent d’un service, d’un outil ou d’un skill. L’arbre décrit la nature ; les hashtags décrivent l’usage.

- Ressource
  - Modèle — violet #5B3FA8, fond #F2EEFA
    - LLM (texte et code)
    - Multimodal (image, audio, vidéo)
    - Embedding et reranking
  - Service — bleu #245C92, fond #EDF4FA
    - API hébergée
    - Application web / SaaS
    - Passerelle de modèles
  - Outil — vert pétrole #17645C, fond #ECF6F3
    - Application bureau
    - CLI
    - Bibliothèque / SDK
    - Extension / plugin
    - Serveur MCP
  - Skill — ocre #805B16, fond #FAF3E5
    - Skill individuel
    - Collection de skills
  - Agent — indigo #40519A, fond #EFF1FA
    - Agent spécialisé
    - Système multi-agents
  - Documentation — gris #505862, fond #F1F2F4
    - Guide / tutoriel
    - Article / publication scientifique
    - Catalogue / benchmark

Sur une carte : un badge de type coloré ; 2 à 4 mots-clés précis neutres. Sous-type final visible (ex. « CLI », « Collection de skills »), ascendance dans les filtres. Couleur toujours accompagnée d’un libellé. Rouge réservé au risque ou à une erreur. GitHub, Site et Source sont des actions neutres ; aucune couleur de sujet déduite de leur provenance.

Exemples : Claude = Modèle > LLM ; API Anthropic = Service > API hébergée ; Ollama = Outil > CLI ; Anthropic Cybersecurity Skills = Skill > Collection de skills. Une fiche peut avoir une nature principale et des relations vers d’autres ressources ; ne pas confondre API hébergée et modèle servi. Ces exemples définissent la taxonomie, sans certifier les propriétés de chaque fiche existante.

État : axes Nature, Thème, Fonction, OS, Licence, Tarification et Accès intégrés au générateur et aux fiches. Nature et OS/licence en métadonnées neutres ; thème coloré ; hashtags d’usage neutres. Les topics GitHub restent dans la fiche détaillée. Les données non étayées restent « À vérifier ». « Non précisée » signifie que GitHub ne fournit pas de licence SPDX reconnue, pas que le projet est libre ou propriétaire.

Le référentiel des natures et des axes techniques est `km.resources.json`, celui des thèmes et fonctions est `km.ontology.json`. Les licences vérifiées comportent une URL de preuve. Les champs inconnus ne sont pas complétés par déduction du prix, du langage ou du domaine GitHub. Le traitement futur conserve les métadonnées et utilise la licence renvoyée par l’API GitHub lorsque disponible.
