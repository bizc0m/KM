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

## Traçabilité

- Origine : NotePlan
- Identifiant source : 20ce7a20ba8fb1a8e8d32aba833d4d35fae14c05c136de0085ff7e861bad9ffd
- Politique : technical-only-2026-10-17
- Lecture KM : 2026-10-25
- Résumé automatique local ; les affirmations restent attribuées aux sources.

## Exploration des liens

- Configuration : depth3-per-tool-v2 ; profondeur 3, maximum 120 pages par tweet.
- Liens distincts recensés : 18.
- Pages lues, tweet compris : 4.
- Sources techniques analysées : 4.
- Sources à vérifier : 0 ; analyses non terminées : 0 ; erreurs du modèle : 0.
- Liens non lus : 13 (profondeur : 0, budget de pages : 0, délai : 0, erreurs : 13).
- Pages résumées sur extrait : 1.
- Éléments exclus : 2 ; doublons ignorés : 0.
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
