# PromptZero : Proxy API anonymisant les données sensibles

## Statut

actif

## Tags

#pentest, #anonymisation

## Intérêts

Anonymise les données sensibles avant transmission

## Métadonnées

- Nature : À vérifier
- OS : À vérifier
- Licence : Non précisée
- Tarification : À vérifier
- Accès : À vérifier
- Preuve : https://github.com/openbashok/promptzero


## Ontologie

- Version : 1.1
- Identifiants : domain.privacy domain.security.testing capability.security.pentest capability.privacy.anonymize source.noteplan source.x source.github lifecycle.active
- Sujets : Cybersécurité > Protection des données ; Cybersécurité > Tests de sécurité
- Fonctions : Tester la sécurité ; Anonymiser
- Provenance : NotePlan Calendar ; X / Twitter ; GitHub
- État : Actif

## Sources

- https://github.com/openbashok/promptzero
- https://x.com/i/status/2056582001147228359
- https://raw.githubusercontent.com/openbashok/promptzero/HEAD/examples/poc/README.md
- https://raw.githubusercontent.com/openbashok/promptzero/HEAD/examples/pentest_report/sample_findings.json
- https://djangoproject.com/
- https://trypyramid.com/
- https://bottlepy.org/docs/dev
- https://tornadoweb.org/en/stable
- https://fastapi.tiangolo.com/
- https://en.wikipedia.org/wiki/Tkinter
- https://pygobject.gnome.org/
- https://wiki.qt.io/Qt_for_Python
- https://kivy.org/
- https://dearpygui.readthedocs.io/en/latest
- https://scikit-learn.org/
- https://huggingface.co/docs/transformers/index
- https://scipy.org/
- https://pandas.pydata.org/
- https://ipython.org/
- https://buildbot.net/
- https://trac.edgewall.org/
- https://roundup-tracker.org/
- https://openstack.org/
- https://xon.sh/

## Traçabilité

- Origine : NotePlan
- Identifiant source : 20ce7a20ba8fb1a8e8d32aba833d4d35fae14c05c136de0085ff7e861bad9ffd
- Politique : technical-only-2026-10-17
- Lecture KM : 2026-10-23
- Résumé automatique local ; les affirmations restent attribuées aux sources.

## Exploration des liens

- Configuration : depth3-per-tool-v2 ; profondeur 3, maximum 120 pages par tweet.
- Liens distincts recensés : 1334.
- Pages lues, tweet compris : 43.
- Sources techniques analysées : 24.
- Sources à vérifier : 16 ; analyses non terminées : 0 ; erreurs du modèle : 2.
- Liens non lus : 1254 (profondeur : 1240, budget de pages : 0, délai : 0, erreurs : 14).
- Pages résumées sur extrait : 1.
- Éléments exclus : 39 ; doublons ignorés : 0.
- Couverture complète : non ; limites ou sources non accessibles détaillées ci-dessus.

### PromptZero : Architecture Zero Trust pour les prompts LLM

PromptZero est un proxy local qui applique les principes Zero Trust aux interactions avec les modèles LLM. Il détecte et remplace les données sensibles avant de les envoyer, puis restaure les valeurs réelles dans les réponses.

- Protection des données sensibles avant l'envoi vers un API non contrôlé
- Remplacement des adresses IP, noms d'hôtes, emails et autres données par des valeurs synthétiques
- Restauration des données réelles dans les réponses reçues
- Utilisation de normes RFC pour les valeurs synthétiques

Source : https://github.com/openbashok/promptzero ; niveau 1.

### PromptZero - Démonstration de la sanitisation des données

PromptZero démontre la capacité à filtrer les données sensibles avant leur transmission à un modèle d'IA, en utilisant des jeux de données fictifs.

- Fournit des jeux de données fictifs pour tester la sanitisation.
- Montre la séparation entre données réelles et données fictives.
- Utilise des scripts pour générer des rapports visuels et des analyses.
- Permet de vérifier la sécurité des données avant leur traitement par un modèle d'IA.

Source : https://raw.githubusercontent.com/openbashok/promptzero/HEAD/examples/poc/README.md ; niveau 2.

### Vulnérabilités critiques dans le système de Nexabank

Audit de sécurité interne et externe révèle plusieurs vulnérabilités critiques dans les systèmes de Nexabank, incluant des vulnérabilités de type injection SQL, exécution de code à distance et escalade de privilèges. Les impacts incluent la compromission complète de l'infrastructure et la fuite de données sensibles.

- Bypass d'authentification via vulnérabilité CVE-2024-21762 permettant l'exécution de code avec privilèges root
- Injection SQL dans le portail client exposant 142 000 enregistrements de clients
- Escalade de privilèges via AS-REP Roasting avec compromission complète de l'AD
- Exposition d'API interne sans authentification avec fuite de 2,1 millions de transactions

Source : https://raw.githubusercontent.com/openbashok/promptzero/HEAD/examples/pentest_report/sample_findings.json ; niveau 2.

### Django

Django est un framework Python pour développer des applications web rapidement. Il favorise la conception propre et pragmatique. Il gère les tâches complexes de développement web. Il permet de créer des applications sans réinventer le rouage.

- Django est un framework Python pour le développement web.
- Django encourage un design propre et pragmatique.
- Django gère les tâches complexes de développement web.
- Django permet de créer des applications sans réinventer le rouage.

Source : https://djangoproject.com ; niveau 3.

### Pyramid

Framework Python pour développer des applications web. Permet de démarrer petit et d'élargir progressivement. Offre des outils pour gérer les templates, bases de données et sécurité. Facilite la création d'applications complexes.

- Framework Python pour développer des applications web.
- Permet de démarrer avec un exemple minimal et d'élargir progressivement.
- Fournit des outils pour gérer les templates, bases de données et sécurité.
- Facilite la création d'applications complexes avec des extensions.
- Supporte les versions compatibles de Python.
- Permet l'intégration de systèmes de formulaires et de bases de données.
- Possède une documentation et des ressources étendues.

Source : https://trypyramid.com ; niveau 3.

### Bottle

Framework web Python léger. Gestion des routes. Templates intégrés. Serveur intégré. Support WSGI. Exemple Hello World.

- Framework web Python léger
- Gestion des routes avec URLs dynamiques
- Templates intégrés et support de mako, jinja2
- Serveur HTTP intégré et support WSGI
- Exemple Hello World fourni

Source : https://bottlepy.org/docs/dev ; niveau 3.

### Tornado Web Server

Tornado est un framework web Python avec une bibliothèque réseau asynchrone. Il permet de gérer des connexions simultanées. Il est adapté aux applications nécessitant des connexions longues. Il intègre asyncio depuis la version 5.0.

- Tornado est un framework web Python.
- Tornado inclut une bibliothèque réseau asynchrone.
- Tornado gère des connexions simultanées.
- Tornado est adapté aux applications avec connexions longues.
- Tornado intègre asyncio depuis la version 5.0.

Source : https://tornadoweb.org/en/stable ; niveau 3.

### FastAPI

Framework Python performant pour les APIs. Base sur type hints. Documentation interactive. Compatible OpenAPI.

- Framework Python pour créer des APIs performantes
- Utilise des type hints standards Python
- Génère automatiquement des docs interactives via Swagger UI et ReDoc
- Compatibilité avec les standards OpenAPI et JSON Schema

Source : https://fastapi.tiangolo.com ; niveau 3.

### Tkinter

Tkinter est l'interface Python standard pour Tk. Il est inclus avec Python. Il permet de créer des interfaces graphiques.

- Tkinter est un module Python pour créer des interfaces graphiques.
- Tkinter est inclus dans les installations standard de Python.
- Tkinter utilise Tcl/Tk pour la création des widgets.
- Tkinter permet de créer des applications avec des widgets comme les boutons et les fenêtres.

Source : https://en.wikipedia.org/wiki/Tkinter ; niveau 3.

### PyGObject

PyGObject permet d'utiliser des bibliothèques GObject en Python. Il s'agit d'une liaison Python pour GObject. Il fonctionne sur Linux, Windows et macOS. Il est compatible Python 3.9 et PyPy3.

- PyGObject permet d'utiliser des bibliothèques GObject en Python.
- PyGObject sert de liaison Python pour GObject.
- PyGObject fonctionne sur Linux, Windows et macOS.
- PyGObject est compatible Python 3.9 et PyPy3.

Source : https://pygobject.gnome.org ; niveau 3.

### Qt for Python

Portage de PySide vers Qt. Développement commencé en 2015. Version officielle Qt 5.12 en 2018. Version Qt6 en 2020.

- Portage de PySide vers Qt 5.3, 5.4 et 5.5 en 2016.
- Version Qt 5.12 officielle en décembre 2018.
- Version Qt6 disponible en décembre 2020.
- Ne supporte plus Python 2.7 à partir de Qt6.

Source : https://wiki.qt.io/Qt_for_Python ; niveau 3.

### Kivy

Kivy est un framework Python pour le développement d'applications GUI multiplateformes. Il permet de créer des applications visuellement attrayantes sur plusieurs systèmes d'exploitation. Kivy est open source et distribué sous licence MIT. Il est maintenu par une communauté et des contributeurs.

- Kivy permet de développer des applications GUI multiplateformes.
- Kivy fonctionne sur Android, iOS, Linux, macOS et Windows.
- Kivy est open source et sous licence MIT.
- Kivy est maintenu par une communauté et des contributeurs.

Source : https://kivy.org ; niveau 3.

### Dear PyGui

Dear PyGui est un toolkit GUI pour Python basé sur Dear ImGui. Il permet de créer des interfaces graphiques dynamiques et performantes. Il inclut des éléments classiques de GUI et des outils pour visualiser des données. Il s'adapte à divers domaines comme la science, l'ingénierie et le jeu.

- Dear PyGui est un toolkit GUI pour Python.
- Il s'appuie sur Dear ImGui pour sa réalisation.
- Il permet de créer des interfaces graphiques dynamiques et performantes.
- Il inclut des outils pour visualiser des données et des ressources.

Source : https://dearpygui.readthedocs.io/en/latest ; niveau 3.

### scikit-learn

Documentation pour l'apprentissage automatique en Python version 0.16.1.

- Documentation officielle de scikit-learn version 0.16.1
- Présente des outils d'apprentissage automatique en Python
- Fournit des exemples et explications techniques
- Destinée aux développeurs et chercheurs en IA

Source : https://scikit-learn.org ; niveau 3.

### Transformers

Framework pour modèles ML textuel, visuel, audio, multimodal. Centralise la définition des modèles. Compatible avec divers frameworks et moteurs d'inférence.

- Modèle de référence pour les modèles ML avancés
- Compatibilité avec plusieurs frameworks d'entraînement
- Support pour divers moteurs d'inférence
- Accès à plus d'un million de modèles sur Hugging Face Hub

Source : https://huggingface.co/docs/transformers/index ; niveau 3.

### SciPy

SciPy fournit des algorithmes pour l'optimisation, l'intégration et la résolution d'équations. Les algorithmes sont applicables à divers domaines. SciPy étend NumPy avec des structures de données spécialisées. Les implémentations sont optimisées en C et C++.

- SciPy fournit des algorithmes pour l'optimisation, l'intégration, l'interpolation, les problèmes d'éigenvalues, les équations algébriques, les équations différentielles, la statistique et d'autres classes de problèmes.
- Les algorithmes et structures de données de SciPy sont applicables à divers domaines.
- SciPy étend NumPy avec des outils supplémentaires pour le calcul d'arrays et des structures de données spécialisées comme les matrices creuses et les arbres k-dimensionnels.
- SciPy encapsule des implémentations optimisées en langages bas-niveau comme C et C++.

Source : https://scipy.org ; niveau 3.

### pandas

Librairie Python pour l'analyse et la manipulation de données.

- Analyse de données en Python
- Manipulation de données structurées
- Outil open source
- Support des structures de données complexes

Source : https://pandas.pydata.org ; niveau 3.

### IPython

IPython offre un environnement interactif pour le calcul, avec complétion intelligente, commandes magiques et intégration système.

- IPython fournit un shell interactif avancé.
- IPython inclut un noyau Jupyter pour des environnements web.
- IPython permet l'exécution de commandes système via !.
- IPython propose des outils pour le calcul parallèle et distribué.

Source : https://ipython.org ; niveau 3.

### Buildbot

Buildbot automatise les builds, tests et déploiements. Il gère des workflows complexes. Il intègre des systèmes de version. Il permet des exécutions distribuées.

- Automatise builds, tests et déploiements.
- Gère des workflows complexes.
- Intègre des systèmes de version.
- Permet des exécutions distribuées.

Source : https://buildbot.net ; niveau 3.

### Trac

Trac est un outil de gestion de projet avec wiki et suivi des bugs. Il intègre Subversion et Git. Il permet de créer des liens entre tâches et commits. Il affiche un chronologie des événements.

- Trac est un outil de gestion de projet avec wiki et suivi des bugs.
- Trac intègre Subversion et Git.
- Trac permet de créer des liens entre tâches et commits.
- Trac affiche un chronologie des événements.

Source : https://trac.edgewall.org ; niveau 3.

### Roundup Issue Tracker

Système de suivi des problèmes avec interface web et CLI. Support Python 3.10+. Mise à jour 2.6.0 avec protections CSRF. Gestion des accès et historique des changements.

- Système de suivi des problèmes avec interface web et CLI
- Support Python 3.10+
- Mise à jour 2.6.0 avec protections CSRF
- Gestion des accès et historique des changements

Source : https://roundup-tracker.org ; niveau 3.

### OpenStack

Infrastructure cloud open source gérant calcul, stockage et réseau. Gère des ressources massives via API ou dashboard. Fournit orchestration et haute disponibilité. Déployé à l'échelle mondiale.

- OpenStack gère des pools de ressources calcul, stockage et réseau.
- OpenStack est utilisé pour des infrastructures cloud à l'échelle mondiale.
- OpenStack fournit des services d'orchestration et de gestion de disponibilité.
- OpenStack est déployé dans des environnements publics et on-premises.

Source : https://openstack.org ; niveau 3.

### Xonsh

Xonsh est un shell basé sur Python. Il fonctionne sur plusieurs plateformes. Il combine Python et des commandes shell. Il permet l'intégration de bibliothèques Python.

- Xonsh est un shell basé sur Python
- Xonsh fonctionne sur Linux, macOS, Windows, Android
- Xonsh combine Python avec des commandes shell
- Xonsh permet l'intégration de bibliothèques Python

Source : https://xon.sh ; niveau 3.
