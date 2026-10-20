# Configuration de Plausible Community Edition avec Docker Compose

## Statut

actif

## Tags

## Intérêts

Démarre Plausible avec Docker Compose pour hébergement local.

## Métadonnées

- Nature : À vérifier
- OS : À vérifier
- Licence : MIT
- Tarification : À vérifier
- Accès : À vérifier
- Preuve : https://github.com/plausible/community-edition


## Ontologie

- Version : 1.1
- Identifiants : domain.infrastructure.deployment source.noteplan source.github source.x lifecycle.active
- Sujets : Infrastructure > Déploiement et hébergement
- Provenance : NotePlan Calendar ; GitHub ; X / Twitter
- État : Actif

## Sources

- https://github.com/plausible/community-edition
- https://x.com/i/status/2055532691706265605

## Traçabilité

- Origine : NotePlan
- Identifiant source : cf13d710b766f0f10a319593a8610fa540b82c25e1cf17fff33fb59c01bbad51
- Politique : technical-only-2026-10-17
- Lecture KM : 2026-10-20
- Résumé automatique local ; les affirmations restent attribuées aux sources.

## Identité

- Dépôt principal : https://github.com/plausible/community-edition

## Capacités documentées

- Permet d'héberger Plausible sans dépendance externe.
- Exige Docker et Docker Compose installés.
- Nécessite un CPU compatible SSE 4.2 ou NEON.
- Recommande au moins 2 Go de RAM.

## Usages documentés

- Cloner le dépôt GitHub
- Créer un fichier .env avec BASE_URL et SECRET_KEY_BASE
- Configurer les ports HTTP et HTTPS dans compose.override.yml
- Lancer docker compose up -d

## Limites

- Requiert un domaine avec DNS valide pour Let's Encrypt
- Compatibilité CPU spécifique pour ClickHouse

## Qualification

- Méthode : analyse locale de la page propre au dépôt, sans contenu des pages filles.
- Source : https://github.com/plausible/community-edition
- Analyse source : 2026-10-20T06:03:25.863Z
- Relecture humaine : non ; les affirmations restent à vérifier dans la source.
