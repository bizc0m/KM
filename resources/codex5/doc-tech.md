# CDD Urgence V5 15-May DOC_TECH

- Nom du projet : CDD / Urgence V5 - Nightlife Radar
- Date de génération : 15 May 2026
- Version suggérée : v5.10
- Changements majeurs : stabilisation V5 beta, radar monde, endpoints multi-villes, données nightlife, gamification love, documentation de coordination.
- Statut : complète les précédentes docs et sert de base wiki contributeur.

# Concepts détectés
- #CoreLoop : choisir une ville, consulter les lieux/events, agir ou contribuer.
- #Action : ouvrir un dashboard, filtrer, cliquer un lieu, envoyer du love, scanner une zone.
- #Feedback : scores, distances, badges, feed live, listes filtrées, statuts de scan.
- #Progression : points, missions, validations, contribution aux données.
- #Reward : Aura, Karma, visibilité, badges, accès à des vues mieux renseignées.
- #Engagement : radar live, love signals, missions Night Agent, contribution communautaire.
- #Rule : sources vérifiées, schémas stables, pas de doublons, données datées.
- #State : ville sélectionnée, filtre actif, utilisateur connecté, scan prêt, fallback local.
- #Trigger : géolocalisation, clic ville, refresh, contribution, validation, deploy beta.

# Vue d’ensemble
- Objectif du système : aider à trouver rapidement où sortir, quoi faire et quels lieux/events sont pertinents selon la ville.
- Type de projet : plateforme nightlife gamifiée, dashboard data, radar mondial et outil OSINT léger.
- Logique globale : agréger des sources nightlife, normaliser events/venues/sources, afficher des vues par ville, puis encourager la contribution utile.

# Mécaniques
- Radar ville : centrale. Affiche events, lieux, scores, quartiers, sources.
- Urgence GlouGlou : centrale. Propose rapidement des lieux proches ou pertinents.
- Party : centrale. Liste les événements actifs ou à venir.
- World Love Radar : centrale. Visualise les hotspots mondiaux et signaux de love.
- Scan de zone : support. Génère une vue locale à partir d’une position.
- Sources scraping : support. Registre de sources et vérification des URLs.
- Gamification : secondaire. Points, missions, badges, validation et love signals.
- Agents/documentation : support. Coordonne les chats, règles, schémas et handoffs.

# Boucles et systèmes de gamification
- Core loop : choisir ville -> voir lieux/events -> filtrer -> cliquer/agir -> recevoir feedback.
- Reward loop : contribuer/valider/scanner -> points ou statut -> meilleure donnée -> reconnaissance.
- Progression loop : missions régulières -> score utilisateur -> accès/visibilité -> plus d’impact.
- Points : Karma, Aura, points de contribution, streaks potentiels.
- Engagement : radar live, feed love, badges, Night Agents, challenges personnels.

# Logique interne
- Une ville doit exister dans `backend/cities/*.json`.
- Les vues front consomment des champs stables : events, venues, radars, districts, vibe_colors, version.
- Les events passés peuvent être masqués sauf cas de vue historique.
- Les endpoints multi-villes sont servis localement et en beta via `/api/cities/:cityId/*`.
- Les sources doivent conserver un lien source.
- Les changements structurants vont dans `AGENTS.md`, `progress.md`, `SYNC.md`, `SCHEMA.md` ou docs dédiées.

# Architecture simplifiée
- Inputs : fichiers ville JSON, sources scraping, géoloc, clics utilisateur, registres docs.
- Process : normalisation, scoring, filtrage, déduplication, fallback local, rendu React.
- Outputs : dashboards ville, GlouGlou, Party, World Radar, APIs JSON, rapports docs.

# Cas d’usage
- Un utilisateur ouvre `/party`, filtre les événements futurs et clique une billetterie.
- Un utilisateur ouvre `/urgence-glouglou` pour trouver quatre lieux proches.
- Un contributeur ajoute une ville dans `backend/cities`, puis vérifie `/api/cities/:cityId/events`.
- Un admin consulte `/scraping` et teste les URLs sources.
- Un utilisateur explore `/world-radar`, clique Seoul ou Saint-Étienne et ouvre le dashboard ville.

# Analyse qualité des mécaniques

| Mécanique | Clarté | Profondeur | Rétention | Satisfaction | Coût implémentation | Risque confusion | Score global |
|---|---:|---:|---:|---:|---:|---:|---:|
| Radar ville | 4 | 4 | 4 | 4 | 3 | 2 | 3.5 |
| Urgence GlouGlou | 4 | 3 | 4 | 4 | 3 | 3 | 3.5 |
| Party | 4 | 3 | 4 | 4 | 3 | 3 | 3.5 |
| World Love Radar | 3 | 4 | 5 | 4 | 4 | 3 | 3.8 |
| Scan de zone | 3 | 4 | 3 | 4 | 4 | 3 | 3.5 |
| Scraping sources | 3 | 5 | 3 | 3 | 5 | 4 | 3.8 |
| Gamification love | 3 | 4 | 5 | 4 | 4 | 4 | 4.0 |
| Coordination agents | 4 | 4 | 3 | 3 | 2 | 2 | 3.0 |

# Dark patterns
- Love score : risque moyen. Peut devenir une métrique sociale opaque. Alternative : expliquer les signaux et permettre de désactiver l’affichage.
- Streaks/missions : risque moyen. Peut pousser à revenir sans vraie valeur. Alternative : missions utiles, non pénalisantes.
- Classements premium : risque faible à moyen. Peut créer une hiérarchie artificielle. Alternative : indiquer les critères et garder des filtres neutres.
- Géolocalisation : risque moyen. Donnée sensible. Alternative : fallback manuel, consentement clair, pas de tracking inutile.
- Notifications futures : risque moyen. Éviter pression abusive et messages trompeurs.

# Mapping MTG / game theory

| Mécanique | Archétype MTG | Principe game theory | Effet comportemental | Synergies |
|---|---|---|---|---|
| Urgence GlouGlou | Tempo | stratégie dominante | décision rapide | géoloc, scores, horaires |
| Party | Aggro | information incomplète | passer vite à l’action | events, sources, filtres |
| World Love Radar | Swarm | coopération | sentiment collectif mondial | love signals, villes, gamification |
| Scan de zone | Control | réduction d’incertitude | sécuriser son choix | carte, lieux, sources |
| Night Agents | Value | incitation | enrichir la base | points, validation, QA |
| Premium tags | Midrange | asymétrie d’information | cibler des lieux haut de gamme | filtres, dashboard mondial |

# Documentation des fonctionnalités (synthèse interne)

| Fonctionnalité | À quoi ça sert ? | Comment s'en servir ? | Type d’utilisateur | Importance |
|---|---|---|---|---|
| Dashboard ville | Voir la scène nightlife locale | Ouvrir `/annecy`, `/seoul`, `/saint-etienne` | joueur | essentielle |
| Party | Trouver les soirées à venir | Ouvrir `/party`, filtrer, cliquer un event | joueur | essentielle |
| Urgence GlouGlou | Trouver vite un lieu proche | Ouvrir `/urgence-glouglou`, choisir un spot | joueur | essentielle |
| World Love Radar | Explorer les hotspots mondiaux | Ouvrir `/world-radar`, cliquer une ville | joueur | utile |
| Command Map | Variante carte stratégique | Basculer dans le radar monde | joueur | utile |
| Scan de zone | Générer une zone locale | Entrer GPS ou utiliser géoloc | contributeur | utile |
| Scraping sources | Tester les sources nightlife | Ouvrir `/scraping`, lancer un probe URL | admin | essentielle |
| QA Center | Vérifier routes et endpoints | Ouvrir `/qa`, lancer contrôles | admin | utile |
| Versions | Suivre l’historique | Ouvrir `/versions` | contributeur | utile |
| Schéma DB | Normaliser Event/Venue/Source | Lire `SCHEMA.md` et `backend/schema.sql` | contributeur | essentielle |
| Cartographe Nightlife | Ajouter villes/vues cohérentes | Lire `AGENTS.md`, respecter les champs | contributeur | essentielle |
| SYNC inter-chat | Éviter conflits entre chats | Lire/mettre à jour `SYNC.md` | contributeur | essentielle |
| Gamification love | Récompenser signaux utiles | Envoyer love, valider, contribuer | joueur | utile |
| Premium tag | Identifier lieux très prisés | Filtrer premium/prenium dans radar | joueur | optionnelle |
