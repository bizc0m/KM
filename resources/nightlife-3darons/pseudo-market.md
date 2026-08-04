# V6 - Bourse Pseudo

Date: 15/05/2026
Projet: Nightlife

## Objectif

Creer une bourse de pseudos fictifs, stylises et notables pour Nightlife V6.

## Donnees recuperees

- Source officielle prenoms: INSEE, fichier des prenoms, paru le 09/07/2025.
- Couverture: prenoms attribues en France entre 1900 et 2024.
- Fichier brut local: `v6_queue/data/firstnames_insee_2024.csv`
- Fichier normalise local: `v6_queue/data/names_market_seed.csv`

Source web:
- https://www.insee.fr/fr/statistiques/8595130

## Regles pseudos

- Ne pas aspirer de usernames reels.
- Generer des pseudos fictifs depuis des briques lexicales.
- Eviter les pseudos qui imitent une personne publique existante.
- Bloquer insultes, haine, doxxing, marques protegees et termes sensibles.
- Garder une traçabilite: pseudo = composant + style + score + date.

## Types de pseudos

- `night`: nocturne, club, city, neon, moon, shadow.
- `agent`: alias, ghost, cipher, signal, cover, trace.
- `dj`: sound, bass, pulse, set, mix, wave.
- `social`: crew, link, vibe, friend, orbit.
- `lux`: velvet, gold, private, lounge, halo.
- `underground`: bunker, tunnel, warehouse, basement.

## Score de valeur

Score initial sur 100:
- rarete: 25
- lisibilite: 20
- memorisation: 20
- coherence Nightlife: 20
- potentiel social: 10
- disponibilite interne: 5

## Mecanique possible

- reservation de pseudo
- enchere symbolique non financiere
- gain via contribution qualite
- echange limite entre membres verifies
- edition saisonniere de pseudos rares
- pseudos lies a badges ou scenes locales

## Garde-fous

- Pas de pay-to-win.
- Pas de speculation financiere reelle.
- Pas d'exploitation de donnees personnelles.
- Pas de classement humiliant des personnes.
- Moderation obligatoire avant pseudos publics premium.
