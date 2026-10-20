# MoneyPrinter : Outil d'automatisation de création de YouTube Shorts

## Statut

actif

## Tags

#generation-video

## Intérêts

Génère automatiquement des scripts pour des vidéos YouTube Shorts.

## Métadonnées

- Nature : À vérifier
- OS : À vérifier
- Licence : MIT
- Tarification : À vérifier
- Accès : À vérifier
- Preuve : https://github.com/FujiwaraChoki/MoneyPrinter


## Ontologie

- Version : 1.1
- Identifiants : domain.media.video domain.infrastructure.database capability.automation capability.generate.video source.noteplan source.x source.github lifecycle.active
- Sujets : Audio, vidéo et création > Vidéo ; Infrastructure > Bases de données
- Fonctions : Automatiser des actions ; Générer des contenus > Générer une vidéo
- Provenance : NotePlan Calendar ; X / Twitter ; GitHub
- État : Actif

## Sources

- https://github.com/fujiwarachoki/moneyprinter
- https://x.com/i/status/2056509860162756860
- https://post-bridge.com/?ref=moneyprinter
- https://raw.githubusercontent.com/FujiwaraChoki/MoneyPrinter/HEAD/setup.sh
- https://raw.githubusercontent.com/FujiwaraChoki/MoneyPrinter/HEAD/docs/quickstart.md
- https://raw.githubusercontent.com/FujiwaraChoki/MoneyPrinter/HEAD/docs/configuration.md
- https://raw.githubusercontent.com/FujiwaraChoki/MoneyPrinter/HEAD/docs/architecture.md
- https://raw.githubusercontent.com/FujiwaraChoki/MoneyPrinter/HEAD/docs/docker.md
- https://raw.githubusercontent.com/FujiwaraChoki/MoneyPrinter/HEAD/docs/testing.md
- https://producthunt.com/products/post-bridge
- https://post-bridge.com/
- https://x.com/i/status/2090141578597716106
- https://producthunt.com/products/post-bridge/launches/post-bridge?comment=4028700
- https://producthunt.com/products/post-bridge/reviews
- https://producthunt.com/products/post-bridge/launches/post-bridge?comment=4028583
- https://post-bridge.com/twitter-x
- https://post-bridge.com/linkedin
- https://post-bridge.com/facebook
- https://post-bridge.com/tiktok
- https://post-bridge.com/youtube
- https://post-bridge.com/bluesky
- https://post-bridge.com/threads
- https://post-bridge.com/pinterest
- https://post-bridge.com/google-business
- https://youtube.com/howyoutubeworks/copyright
- https://star-history.com/blog/how-to-use-github-star-history
- https://github.com/star-history/star-history
- https://star-history.com/debpalash/voicestudio
- https://star-history.com/boykopovar/anyps5
- https://star-history.com/nationalsecurityagency/ghidra
- https://star-history.com/ifixai-ai/ifixai
- https://chromewebstore.google.com/detail/star-history/iijibbcdddbhokfepbblglfgdglnccfn?ucbcb=1
- https://star-history.com/blog/output
- https://bytebase.com/
- https://dify.ai/
- https://coderabbit.ai/?dub_id=lMfusglZOn4vS82u&ref=star-history

## Traçabilité

- Origine : NotePlan
- Identifiant source : dace9fac82c83d2b91d6a3d7d9eebde6858f83313c5423686026fe99c99b0c10
- Politique : technical-only-2026-10-17
- Lecture KM : 2026-10-20
- Résumé automatique local ; les affirmations restent attribuées aux sources.

## Exploration des liens

- Configuration : depth3-per-tool-v2 ; profondeur 3, maximum 120 pages par tweet.
- Liens distincts recensés : 1420.
- Pages lues, tweet compris : 77.
- Sources techniques analysées : 35.
- Sources à vérifier : 42 ; analyses non terminées : 0 ; erreurs du modèle : 0.
- Liens non lus : 1283 (profondeur : 1272, budget de pages : 0, délai : 0, erreurs : 11).
- Pages résumées sur extrait : 1.
- Éléments exclus : 61 ; doublons ignorés : 0.
- Couverture complète : non ; limites ou sources non accessibles détaillées ci-dessus.

### MoneyPrinter : Outil d'automatisation de création de YouTube Shorts

MoneyPrinter automatise la création de YouTube Shorts via un sujet vidéo.

- Génère des scripts et métadonnées via des modèles Ollama.
- Utilise une file d'attente basée sur une base de données pour le traitement.
- Requiert Ollama et des modèles préchargés.
- Intègre des outils comme ImageMagick et playsound.

Source : https://github.com/fujiwarachoki/moneyprinter ; niveau 1.

### Post Bridge - Outil de planification de publication sociale

Post Bridge permet de publier simultanément sur plusieurs plateformes sociales depuis un seul dashboard. Il simplifie la gestion des comptes et optimise le temps de publication.

- Publication simultanée sur 10 plateformes sociales
- Planification de publications avec personnalisation par plateforme
- Gestion centralisée de comptes personnels et professionnels
- Interface intuitive sans courbe d'apprentissage

Source : https://post-bridge.com/?ref=moneyprinter ; niveau 2.

### Script d'installation pour MoneyPrinter

Script Bash pour préparer l'environnement local avec vérification des dépendances et configuration de l'environnement.

- Vérifie la présence de python3 version 3.11+
- Configure DATABASE_URL vers SQLite dans .env
- Installe les dépendances Python avec uv sync
- Propose de télécharger le modèle Ollama llama3.1:8b

Source : https://raw.githubusercontent.com/FujiwaraChoki/MoneyPrinter/HEAD/setup.sh ; niveau 2.

### Configuration et exécution de MoneyPrinter

Outil permettant de générer des vidéos via un modèle Ollama.

- Permet de générer des vidéos à partir d'un sujet et d'un modèle Ollama.
- Exige une configuration d'environnement avec des clés et variables d'environnement.
- Utilise des outils comme uv, FFmpeg et ImageMagick.
- Requiert un serveur Ollama et un modèle préchargé.

Source : https://raw.githubusercontent.com/FujiwaraChoki/MoneyPrinter/HEAD/docs/quickstart.md ; niveau 2.

### Configuration de MoneyPrinter

Configuration de MoneyPrinter via fichier .env avec variables requises et optionnelles.

- Définit les variables requises pour la configuration de MoneyPrinter.
- Spécifie les clés API nécessaires pour les services externes.
- Permet la configuration optionnelle de Ollama et ImageMagick.
- Utilise une base de données SQLite par défaut si non définie.

Source : https://raw.githubusercontent.com/FujiwaraChoki/MoneyPrinter/HEAD/docs/configuration.md ; niveau 2.

### Architecture de file d'attente basée sur la base de données

Système de génération utilisant une file d'attente gérée par une base de données pour assurer la fiabilité et la scalabilité.

- Soumission des requêtes de génération par l'interface frontend.
- Validation des entrées et enfilement des tâches via l'API Flask.
- Traitement des tâches par le worker avec mise à jour de l'état dans la base de données.
- Suivi des événements et des artefacts via la base de données PostgreSQL.

Source : https://raw.githubusercontent.com/FujiwaraChoki/MoneyPrinter/HEAD/docs/architecture.md ; niveau 2.

### Docker Compose pour MoneyPrinter

Docker Compose déploie l'application MoneyPrinter avec ses dépendances.

- Docker Compose déploie frontend, API, worker et Postgres.
- Configuration requise dans le fichier .env pour les clés.
- Connexion à Ollama via URL configurable.
- Commande pour lancer les services Docker.

Source : https://raw.githubusercontent.com/FujiwaraChoki/MoneyPrinter/HEAD/docs/docker.md ; niveau 2.

### Tests pour MoneyPrinter

Documentation des tests et dépendances pour le projet MoneyPrinter.

- Installe les dépendances de test avec uv sync --group dev
- Exécute tous les tests avec uv run pytest
- Exécute un test de fichier avec uv run pytest tests/test_repository.py
- Exécute un test spécifique avec uv run pytest tests/test_repository.py::test_create_job_persists_payload_and_queued_event

Source : https://raw.githubusercontent.com/FujiwaraChoki/MoneyPrinter/HEAD/docs/testing.md ; niveau 2.

### Post Bridge - Outil de planification sociale

Post Bridge permet d'envoyer des publications sur 10 plateformes sociales depuis un seul endroit.

- Permet d'envoyer des publications sur 10 plateformes sociales.
- Facilite la gestion de plusieurs comptes simultanément.
- Permet d'éditer des contenus par plateforme.
- Intègre des outils de publication via API et CLI.

Source : https://producthunt.com/products/post-bridge ; niveau 3.

### Post Bridge - Outil de planification de publication sociale

Post Bridge permet de publier simultanément sur plusieurs plateformes sociales depuis un seul dashboard. Il simplifie la gestion des comptes et optimise le temps de publication.

- Publication simultanée sur 10 plateformes sociales
- Planification de publications avec personnalisation par plateforme
- Gestion centralisée de comptes personnels et professionnels
- Interface intuitive sans courbe d'apprentissage

Source : https://post-bridge.com ; niveau 3.

### Post-bridge MCP Feature

Utilisateur souligne simplicité, rapidité et utilité de la fonction MCP dans Post-bridge après 8 mois d'utilisation.

- Utilisateur utilise Post-bridge depuis plus de 8 mois
- Post-bridge est décrit comme plus simple et plus rapide
- La fonction MCP est présentée comme utile
- Aucune information technique détaillée sur MCP ou fonctionnalités spécifiques

Source : https://x.com/i/status/2090141578597716106 ; niveau 3.

### Post Bridge - Outil de planification sociale

Post Bridge permet d'envoyer des publications sur 10 plateformes sociales depuis un seul endroit.

- Permet d'envoyer des publications sur 10 plateformes sociales.
- Fonctionnalité de planification des publications.
- Possibilité de personnaliser les contenus par plateforme.
- Intégration d'un API pour les agents d'IA.

Source : https://producthunt.com/products/post-bridge/launches/post-bridge?comment=4028700 ; niveau 3.

### Post Bridge : outil de planification de publications sociales

Post Bridge permet d'envoyer des publications sur 10 plateformes sociales depuis un seul endroit.

- Permet d'envoyer des publications sur 10 plateformes sociales.
- Fonctionnalité de planification des publications.
- Possibilité de personnaliser les contenus par plateforme.
- Intégration d'un API pour les agents d'intelligence artificielle.

Source : https://producthunt.com/products/post-bridge/reviews ; niveau 3.

### Post Bridge - Outil de planification sociale

Post Bridge permet d'envoyer des publications sur 10 plateformes sociales depuis un seul endroit.

- Permet d'envoyer des publications sur 10 plateformes sociales.
- Fonctionnalité de planification des publications.
- Possibilité de personnaliser les contenus par plateforme.
- Intégration d'un API pour les agents d'IA.

Source : https://producthunt.com/products/post-bridge/launches/post-bridge?comment=4028583 ; niveau 3.

### PostBridge - Outil de planification de publications sociales

PostBridge permet de planifier des publications sur plusieurs plateformes sociales simultanément, simplifiant la gestion du contenu.

- Planification de publications sur Twitter/X, Instagram, LinkedIn, Facebook, TikTok, YouTube, Bluesky, Threads, Pinterest, Google Business.
- Création et gestion d'un contenu unique pour plusieurs plateformes en une seule fois.
- Possibilité de visualiser et d'éditer les publications planifiées et passées.
- Soutien pour jusqu'à 15 comptes connectés avec un abonnement mensuel.
- Possibilité de publier des vidéos, images, textes, carrousels et reels.
- Pas de perte de portée liée à l'utilisation de l'outil.
- Annulation à tout moment sans engagement.
- Refund possible dans les 7 jours après paiement.

Source : https://post-bridge.com/twitter-x ; niveau 3.

### PostBridge - Outil de planification de publications sociales

PostBridge permet de planifier des publications sur plusieurs réseaux sociaux simultanément.

- Planification de publications sur plusieurs plateformes en une seule fois
- Gestion centralisée des contenus et des publications programmées
- Création de contenus avec des modèles viraux prédéfinis
- Sauvegarde du temps grâce à l'automatisation des publications

Source : https://post-bridge.com/linkedin ; niveau 3.

### PostBridge - Outil de planification de publications sociales

Outil de planification de publications sociales permettant de programmer des contenus sur plusieurs plateformes.

- Planifie des publications sur plusieurs réseaux sociaux simultanément.
- Permet de gérer et d'éditer des publications programmées.
- Facilite la gestion de plusieurs comptes sociaux.
- Simplifie la création de contenus avec des modèles prédéfinis.

Source : https://post-bridge.com/facebook ; niveau 3.

### PostBridge - Outil de planification de publications sociales

PostBridge permet de planifier des publications sur plusieurs plateformes sociales simultanément, optimisant le temps et la gestion du contenu.

- Planification de publications sur plusieurs plateformes en une seule fois
- Gestion centralisée des contenus publiés et planifiés
- Création de contenus avec des modèles viraux prédéfinis
- Sauvegarde du temps grâce à l'automatisation des publications

Source : https://post-bridge.com/tiktok ; niveau 3.

### PostBridge - Outil de planification de contenu social

Outil de planification de contenu social permettant de publier sur plusieurs plateformes simultanément.

- Planifie des publications sur plusieurs réseaux sociaux en un clic
- Facilite la gestion de contenu avec un seul point d'accès
- Permet de publier des vidéos, images et textes sur diverses plateformes
- Optimise le temps de travail en réduisant les tâches répétitives

Source : https://post-bridge.com/youtube ; niveau 3.

### PostBridge - Outil de planification de publications sociales

PostBridge permet de planifier des publications sur plusieurs plateformes sociales simultanément, simplifiant la gestion du contenu.

- Planification de publications sur plusieurs plateformes en une seule fois
- Gestion centralisée des contenus publiés et planifiés
- Création de contenus avec des modèles viraux prédéfinis
- Sauvegarde du temps grâce à l'automatisation des publications

Source : https://post-bridge.com/bluesky ; niveau 3.

### PostBridge - Outil de planification de publications sociales

PostBridge permet de planifier des publications sur plusieurs plateformes sociales simultanément.

- Planification de publications sur plusieurs réseaux sociaux en une seule fois.
- Gestion centralisée des contenus et des publications programmées.
- Support pour plus de 10 plateformes sociales.
- Sauvegarde du temps grâce à l'automatisation des tâches de publication.

Source : https://post-bridge.com/threads ; niveau 3.

### PostBridge - Outil de planification de publications sociales

PostBridge permet de planifier des publications sur plusieurs plateformes sociales simultanément.

- Planifie des publications sur 10 plateformes sociales.
- Gère des contenus vidéo, image, texte et carrousels.
- Permet de créer et de gérer des publications en un seul endroit.
- Sauvegarde jusqu'à 8 heures par semaine.


Source : https://post-bridge.com/pinterest ; niveau 3.

### PostBridge - Outil de planification de publications Google Business

PostBridge permet de planifier des publications sur Google Business et d'autres réseaux sociaux pour optimiser la visibilité et gagner du temps.

- Planifie des publications sur Google Business et plusieurs réseaux sociaux simultanément.
- Permet d'envoyer le même message sur plusieurs plateformes en un clic.
- Facilite la gestion des contenus et des publications programmées.
- Simplifie la publication régulière pour maintenir une présence active.
- Aide à éviter la surcharge d'informations en centralisant les publications.
- Réduit le temps consacré à la gestion des réseaux sociaux.
- Permet de publier des vidéos, images, textes et carrousels.
- Offre des modèles prédéfinis pour créer rapidement du contenu viral.
- Facilite la gestion de plusieurs comptes sans partager de mots de passe.
- S'adapte aux petites entreprises grâce à un prix abordable.
- Permet de publier en continu sans limite de nombre de publications.
- S'assure que les publications ont le même impact que les publications manuelles.
- Facilite la gestion d'une activité marketing individuelle sans complexité de gestion d'équipe.

Source : https://post-bridge.com/google-business ; niveau 3.

### Outils de gestion des droits d'auteur sur YouTube

YouTube propose des outils pour protéger les droits d'auteur et gérer les contenus en ligne.

- Formulaire Web permet d'envoyer des demandes de suppression de contenus en ligne.
- Copyright Match Tool alerte sur des vidéos similaires ou identiques déjà en ligne.
- Content ID permet de définir des règles pour gérer les contenus reproduits.
- Formulaire Web permet d'empêcher automatiquement la remise en ligne de contenus supprimés.

Source : https://youtube.com/howyoutubeworks/copyright ; niveau 3.

### Star History : Outil d'analyse des évolutions des étoiles GitHub

Star History permet d'analyser l'évolution des étoiles d'un projet GitHub.

- Analyse l'évolution des étoiles d'un projet GitHub.
- Affiche la croissance des étoiles au fil des années.
- Supporte plusieurs formats d'entrée pour ajouter des dépôts.
- Permet de comparer plusieurs dépôts dans un même graphique.

Source : https://star-history.com/blog/how-to-use-github-star-history ; niveau 3.

### Star History - GitHub Star History Graph

Outil permettant de visualiser l'historique des étoiles GitHub sous forme de graphique.

- Affiche l'historique des étoiles d'un dépôt GitHub.
- Génère un graphique en temps réel.
- Permet d'embedder le graphique dans un README GitHub.
- Supporte plusieurs modes de visualisation basés sur la date ou le chronologie.

Source : https://github.com/star-history/star-history ; niveau 3.

### VoiceStudio

Outil open source pour la synthèse vocale et la création de voix.

- Permet la clonage de voix
- Conçu comme alternative à ElevenLabs
- Supporte la conception de voix
- Fournit des fonctionnalités de dubbing vidéo

Source : https://star-history.com/debpalash/voicestudio ; niveau 3.

### AnyPS5 - Outil de portage d'exécutables PS5 vers Linux et Windows

AnyPS5 est un outil permettant de porter automatiquement les exécutables PlayStation 5 vers Linux et Windows.

- Permet le portage automatique des exécutables PS5 vers Linux et Windows
- Implémente une solution en C++ sous licence GPL-2.0

Source : https://star-history.com/boykopovar/anyps5 ; niveau 3.

### Ghidra

Outil de reverse engineering développé par la NSA.

- Analyse de code exécutable sans modification.
- Support multi-plateformes via Java.
- Documentation complète et communautaire active.
- Intégration de scripts pour automatisation.

Source : https://star-history.com/nationalsecurityagency/ghidra ; niveau 3.

### iFixAi - Outils d'audit indépendant des agents IA

iFixAi est un projet o
