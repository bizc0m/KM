# Nightlife V6 - Integration Plan

Date import: 15/05/2026 14:22 CEST
Projet: Nightlife

## Objectif V6

Structurer Nightlife V6 autour de quatre piliers:

1. Lexique nuit / fete / amitie pour recherche, tags et UX.
2. Narration "sortie = mission" inspiree cinema / espionnage.
3. Visualisation carte/globe gamifiee pour lieux, scenes et signaux.
4. Donnees lexicales prenoms pour parsing prudent des corpus.
5. NyxConomy: reputation, contribution, clubs-territoires et pont reel/virtuel.
6. Bourse pseudo: identites fictives, prenoms autorises, rarete et moderation.
7. Garde-fous produit: equite, privacy-first, anti dark-patterns, missions non humiliantes.

## Lot 1 - Nettoyage et assets contenu

Statut: pret
Priorite: 1

Actions:
- extraire un lexique propre depuis `champ_semantique_nuit_fete_amitie.md`
- supprimer repetitions et termes faibles
- produire `v6_queue/V6_LEXICON_NIGHTLIFE_FR_EN.md`
- classer les termes par: nuit, fete, amitie, lieux, ambiance, actions
- ajouter colonnes: FR, EN, proximite, registre, usage app

Critere de fin:
Lexique exploitable par code ou contenu sans nettoyage manuel.

## Lot 2 - Direction produit / moodboard

Statut: pret
Priorite: 1

Actions:
- produire `v6_queue/V6_MOODBOARD.md`
- extraire les principes qui marchent:
  - la nuit transforme
  - le secret cree la tension
  - la fete est un seuil social
  - l'identite peut etre instable
- extraire les anti-patterns:
  - neon decoratif
  - gadget sans dilemme
  - alcool/defonce comme moteur central

Critere de fin:
Une page de direction utilisable avant refonte UI.

## Lot 3 - Mode mission

Statut: a designer
Priorite: 2

Actions:
- definir un modele simple `Mission`
- champs possibles: titre, lieu, heure, objectif, signaux, risque, confiance, tags, notes
- relier avec existant: radar, sources, scan, lieux
- prototype UI: carte mission + timeline nocturne

Critere de fin:
Une maquette ou composant integrable dans V6.

## Lot 4 - Carte / globe gamifie

Statut: recherche technique
Priorite: 2

Actions:
- tester `cobe` ou `three-globe` pour prototype rapide
- garder CesiumJS comme option si besoin geospatial lourd
- definir donnees minimales: points, arcs, intensite, categorie, confiance
- prevoir fallback 2D si WebGL non disponible

Critere de fin:
Un prototype qui affiche points nightlife + interactions simples.

## Lot 5 - Prenoms / parsing

Statut: a cadrer
Priorite: 3

Actions:
- telecharger ou importer une base de prenoms autorisee
- nettoyer accents / casse / doublons
- produire un fichier local `v6_queue/data/firstnames_seed.csv`
- utiliser seulement pour aide au parsing, jamais pour profilage sensible automatique

Critere de fin:
Un referentiel lexical local, documente, reversible.

## Lot 6 - NyxConomy / reputation contributive

Statut: pret a specifier
Priorite: 1

Actions:
- definir `Insider Level`
- definir signaux qualite: review, photo validee, micro-reportage, playlist, vote argumente
- definir garde-fous: anti-bot, anti-clan, transparence, ponderation qualitative
- eviter tout achat direct de prestige

Critere de fin:
Un modele de reputation V6 clair, non toxique, testable.

## Lot 7 - Clubs-territoires / Night Explorer

Statut: a designer
Priorite: 2

Actions:
- modeliser `ClubTerritory` et `NightRoute`
- relier clubs, villes, scenes, evenements, DJs
- integrer a la future carte/globe V6
- ajouter progression: XP culturelle, badges geographiques, reputation locale

Critere de fin:
Un schema de donnees + une premiere maquette de progression.

## Lot 8 - Pont reel / virtuel

Statut: a cadrer juridiquement
Priorite: 2

Actions:
- specifier check-ins QR sans collecte excessive
- definir tickets / contenus debloques
- cadrer partenaires clubs et ambassadeurs locaux
- lister contraintes vie privee, marques, moderation

Critere de fin:
Un protocole d'integration reel/virtuel prudent avant dev.

## Lot 9 - Bourse pseudo

Statut: amorce data creee
Priorite: 1

Actions:
- utiliser `v6_queue/data/firstnames_insee_2024.csv` comme base prenoms officielle
- utiliser `v6_queue/data/pseudo_components_seed.csv` pour generer des pseudos fictifs
- definir un score pseudo: rarete, lisibilite, memorisation, coherence Nightlife
- ajouter une blacklist moderation
- creer une fonction de generation reversible et traçable

Critere de fin:
Un generateur de pseudos V6 qui ne depend pas de usernames reels.

## Lot 10 - Guardrails et core loop

Statut: prioritaire
Priorite: 1

Actions:
- appliquer `v6_queue/V6_PRODUCT_GUARDRAILS.md`
- verifier que GlouGlou et Party retournent 4 resultats proches fiables
- documenter fallback Annecy Gare SNCF
- separer clairement missions Night Agent et bounties
- rendre explicites XP, Aura, badges, scores et seuils
- ajouter opt-in sur geoloc, photo et check-in

Critere de fin:
Chaque mecanique V6 respecte les garde-fous avant ajout de features.

## Backlog integre

- QV6-001 Lexique bilingue nightlife
- QV6-002 ADN narratif cinema
- QV6-003 Mode mission / profil / cypher
- QV6-004 Visualisation monde gamifie
- QV6-005 Base prenoms / extraction identite
- QV6-006 Bibliotheque inspirations films / series
- QV6-007 NyxConomy / clubs comme territoires culturels
- QV6-008 Insider Level et contribution qualite
- QV6-009 Night Assets sans pay-to-win
- QV6-010 Night Explorer / carte mondiale des scenes
- QV6-011 DJs, curation et Talent Radar
- QV6-012 Pont reel / virtuel
- QV6-013 Bourse pseudo / prenoms
- QV6-014 Regles durables / anti dark-patterns
- QV6-015 Core loop Urgence GlouGlou / Urgence Party
- QV6-016 Arbres de competences Nightlife
- QV6-017 Missions Night Agent
- QV6-018 Modules futurs Urgence PIPI / Urgence Capote
- QV6-019 Marketplace artistes / assets visuels
- QV6-020 Equite des scores par zone

## Prochaine action recommandee

Generer `v6_queue/V6_REPUTATION_MODEL.md`, car la NyxConomy depend d'un modele sain avant toute mecanique economique.
