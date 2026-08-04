# !!!! Nightlife

Consolidation des idees issues du chat et des documents `DOC_TECH.md` / `DOC_WEB.md`.

Date : 2026-05-15 14:44:07 CEST
Projet : Urgence GlouGlou / Urgence V5 Nightlife Radar

## Regles durables

- Toujours positif, utile, inclusif.
- Aucune mecanique humiliante, raciste, punitive ou degradante.
- Toutes les mecaniques doivent etre pensees pour etre equitables.
- Les seuils de gains, scores, badges et progression doivent etre explicites.
- Les actions sensibles doivent etre volontaires, opt-in et privacy-first.
- Night Agent utilise des missions, pas des bounties.
- Bounty est reserve a une autre classe.

## CoreLoop principal

1. Choisir une ville ou utiliser la geoloc.
2. Recevoir 4 lieux proches via Urgence GlouGlou ou 4 events proches via Urgence Party.
3. Filtrer selon distance, date, prix, score, ambiance, mixite ou ouverture.
4. Agir : sortir, sauvegarder, partager, verifier, confirmer ou signaler.
5. Gagner de la confiance, des badges, de l'XP/Aura ou une reconnaissance positive.
6. Ameliorer la base pour les prochains utilisateurs.

## Synthese conservee

Cette source etablit les modules et garde-fous suivants:

- Urgence GlouGlou: radar de 4 lieux proches, fallback Annecy Gare SNCF, decision rapide.
- Urgence Party: radar de 4 events proches, priorite futur/actif, source obligatoire.
- World Love Radar: carte monde nightlife positive, signaux VIBE/SAFE/SHARE/MATCH/CARE.
- Scan de zone: lieux, events, sources, score, distance, pas, cache local, persistance DB future.
- Cartographe Nightlife: role agent pour enrichir villes, quartiers, zones, lieux et events.
- Arbres de competences: Eclaireur, Archiviste, Gardien, Messager, Barde, Stratege, Oracle.
- Missions Night Agent: verifier site, corriger lien, completer fiche, confirmer horaire, ajouter source, detecter doublon, valider zone.
- Builds: role + badges + filtres + strategie de sortie + type ville + type mission.
- Badges positifs: Eclaireur, Archiviste, Gardien, Source fiable, Zone verifiee, Premier signal utile, Correction confirmee, Contribution rare.
- Avatars: progression valorisante sans degradation des visiteurs ou gratuits.
- Artistes/images: marketplace d'assets avec attribution, licence et revenus clairs.
- Urgence PIPI: toilettes proches, filtres utiles, score confiance, signalement sans jugement.
- Urgence Capote: points prevention/achat discrets, privacy-first, ton neutre.
- Equite: zones denses/rares, nouveaux/experts, geoloc refusee/acceptee, terrain/verification.
- Dark patterns a eviter: streak punitif, badge de honte, avatar degradant, geoloc forcee, photo obligatoire, score opaque, FOMO artificiel, comparaison agressive.

## Priorites d'implementation

1. Stabiliser Urgence GlouGlou et Urgence Party : 4 resultats proches fiables.
2. Clarifier les missions Night Agent.
3. Formaliser XP/Aura/badges/scores sans confusion.
4. Ajouter seuils equitables par zone.
5. Ajouter privacy/opt-in sur geoloc, photo, check-in.
6. Brancher les idees Urgence PIPI et Urgence Capote comme modules futurs.
7. Ajouter marketplace artistes plus tard, apres stabilisation data.

## A ne pas faire maintenant

- Ajouter trop de features avant stabilisation beta.
- Melanger bounty et mission.
- Rendre le systeme socialement punitif.
- Forcer la geoloc.
- Creer des scores invisibles ou incomprehensibles.
- Ouvrir la monetisation sans licence claire.
