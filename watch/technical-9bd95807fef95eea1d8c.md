# MoneyPrinter : Outil d'automatisation de création de YouTube Shorts

## Statut

actif

## Tags

#generation-video, #generation-images

## Intérêts

Crée automatiquement des vidéos YouTube Shorts avec MoviePy.


## Ontologie

- Version : 1.1
- Identifiants : domain.media.video domain.media.image capability.automation capability.generate.video capability.generate.image source.noteplan source.x source.github lifecycle.active
- Sujets : Audio, vidéo et création > Vidéo ; Audio, vidéo et création > Images et graphisme
- Fonctions : Automatiser des actions ; Générer des contenus > Générer une vidéo ; Générer des contenus > Générer une image
- Provenance : NotePlan Calendar ; X / Twitter ; GitHub
- État : Actif

## Métadonnées

- Nature : À vérifier
- OS : À vérifier
- Licence : MIT
- Tarification : À vérifier
- Accès : À vérifier
- Preuve : https://github.com/FujiwaraChoki/MoneyPrinter

## Sources

- https://x.com/i/status/2056509860162756860
- https://github.com/fujiwarachoki/moneyprinter
- https://trendshift.io/repositories/7545
- https://raw.githubusercontent.com/FujiwaraChoki/MoneyPrinter/main/setup.sh
- https://raw.githubusercontent.com/FujiwaraChoki/MoneyPrinter/main/docs/quickstart.md
- https://raw.githubusercontent.com/FujiwaraChoki/MoneyPrinter/main/docs/configuration.md
- https://raw.githubusercontent.com/FujiwaraChoki/MoneyPrinter/main/docs/architecture.md
- https://raw.githubusercontent.com/FujiwaraChoki/MoneyPrinter/main/docs/docker.md
- https://raw.githubusercontent.com/FujiwaraChoki/MoneyPrinter/main/docs/testing.md

## Traçabilité

- Origine : NotePlan
- Identifiant source : dace9fac82c83d2b91d6a3d7d9eebde6858f83313c5423686026fe99c99b0c10
- Politique : technical-only-2026-10-17
- Lecture KM : 2026-10-19
- Résumé automatique local ; les affirmations restent attribuées aux sources.

## Exploration des liens

- Configuration : depth3-per-tool-v2 ; profondeur 3, maximum 120 pages par tweet.
- Liens distincts recensés : 30.
- Pages lues, tweet compris : 14.
- Sources techniques analysées : 8.
- Sources à vérifier : 6 ; analyses non terminées : 0 ; erreurs du modèle : 0.
- Liens non lus : 16 (profondeur : 0, budget de pages : 0, délai : 0, erreurs : 16).
- Pages résumées sur extrait : 0.
- Éléments exclus : 1 ; doublons ignorés : 0.
- Couverture complète : non ; limites ou sources non accessibles détaillées ci-dessus.

### MoneyPrinter : Outil d'automatisation de création de YouTube Shorts

Outil d'automatisation de création de YouTube Shorts via MoviePy.

- Génère des scripts et métadonnées via des modèles Ollama.
- Utilise une file d'attente basée sur une base de données pour le traitement.
- Requiert l'installation de TikTok session ID.
- Dépend de ImageMagick et playsound pour le traitement vidéo.

Source : https://github.com/fujiwarachoki/moneyprinter ; niveau 1.

### Automatisation de la création de YouTube Shorts avec MoviePy

Le projet FujiwaraChoki/MoneyPrinter permet d'automatiser la création de vidéos YouTube Shorts à l'aide de MoviePy.

- Crée des vidéos YouTube Shorts automatiquement
- Utilise MoviePy pour la génération vidéo
- Automatise la production de contenus courts
- Intégre des outils de traitement vidéo

Source : https://trendshift.io/repositories/7545 ; niveau 2.

### Script d'installation pour MoneyPrinter

Script Bash pour préparer l'environnement local avec vérification des dépendances et configuration de l'environnement.

- Vérifie la présence de python3 version 3.11+
- Configure DATABASE_URL vers SQLite dans .env
- Installe les dépendances Python avec uv sync
- Propose de télécharger le modèle Ollama llama3.1:8b

Source : https://raw.githubusercontent.com/FujiwaraChoki/MoneyPrinter/main/setup.sh ; niveau 2.

### Configuration et exécution de MoneyPrinter

Outil permettant de générer des vidéos via un modèle Ollama.

- Permet de générer des vidéos à partir d'un sujet et d'un modèle Ollama.
- Exige une configuration d'environnement avec des clés et variables d'environnement.
- Utilise des outils comme uv, FFmpeg et ImageMagick.
- Requiert un serveur Ollama et un modèle préchargé.

Source : https://raw.githubusercontent.com/FujiwaraChoki/MoneyPrinter/main/docs/quickstart.md ; niveau 2.

### Configuration de MoneyPrinter

Configuration de MoneyPrinter via fichier .env avec variables requises et optionnelles.

- Définit les variables requises pour la configuration de MoneyPrinter.
- Spécifie les clés API nécessaires pour les services externes.
- Permet la configuration optionnelle de Ollama et ImageMagick.
- Utilise une base de données SQLite par défaut si non définie.

Source : https://raw.githubusercontent.com/FujiwaraChoki/MoneyPrinter/main/docs/configuration.md ; niveau 2.

### Architecture de file d'attente basée sur la base de données

Système de génération utilisant une file d'attente gérée par une base de données pour assurer la fiabilité et la scalabilité.

- Soumission des requêtes de génération par l'interface frontend.
- Validation des entrées et enfilement des tâches via l'API Flask.
- Traitement des tâches par le worker avec mise à jour de l'état dans la base de données.
- Suivi des événements et des artefacts via la base de données PostgreSQL.

Source : https://raw.githubusercontent.com/FujiwaraChoki/MoneyPrinter/main/docs/architecture.md ; niveau 2.

### Docker Compose pour MoneyPrinter

Docker Compose déploie l'application MoneyPrinter avec ses dépendances.

- Docker Compose déploie frontend, API, worker et Postgres.
- Configuration requise dans le fichier .env pour les clés.
- Connexion à Ollama via URL configurable.
- Commande pour lancer les services Docker.

Source : https://raw.githubusercontent.com/FujiwaraChoki/MoneyPrinter/main/docs/docker.md ; niveau 2.

### Tests pour MoneyPrinter

Documentation des tests et dépendances pour le projet MoneyPrinter.

- Installe les dépendances de test avec uv sync --group dev
- Exécute tous les tests avec uv run pytest
- Exécute un test de fichier avec uv run pytest tests/test_repository.py
- Exécute un test spécifique avec uv run pytest tests/test_repository.py::test_create_job_persists_payload_and_queued_event

Source : https://raw.githubusercontent.com/FujiwaraChoki/MoneyPrinter/main/docs/testing.md ; niveau 2.
