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

État : sources supplémentaires retirées des cartes ; palette et hiérarchie ci-dessus proposées pour la prochaine migration du référentiel.
