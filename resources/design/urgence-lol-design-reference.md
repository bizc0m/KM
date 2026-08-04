# Urgence LOL Design Reference

## Fiche ressource

- Statut : v0.1-reference
- Appel canonique : `resource:design/urgence-lol-standalone-charte`
- Fichier complet : `urgence-lol-standalone-charte.html`
- Taille : 1862354 octets
- SHA-256 : `9342156e05a6b60893294dc023ea7ead35d6b64b423e674a9f70dc2345465f5e`
- Role : reference visuelle complete pour appliquer le design Urgence.LOL / Night-Intel a d'autres prompts ou projets.

## C'est quoi

Ce fichier est une application HTML autonome servant de charte visuelle executable.

Il contient :

- design system Nocturne / Night-Intel ;
- interface sombre radar ;
- typographies embarquees ;
- couleurs neon controlees ;
- composants de navigation, topbar, sidebar, cards, bottom rail ;
- etats responsive mobile/tablette ;
- ecran secret `Night-Intel Vault` ;
- logique UI embarquee.

## Signature design

- Fond : noir profond `#07070B`.
- Typo : mono technique + sans moderne.
- Accent principal : pink neon / urgence.
- Accents secondaires : acid green, electric blue, blood red.
- Forme : radar, terminal, classified interface, nightlife intelligence.
- Rythme : dense, compact, mobile-first, peu de decoration gratuite.
- Ambiance : Night-Intel, signal, urgence utile, secret accessible.

## Comment l'appeler

Dans un prompt, utiliser :

`resource:design/urgence-lol-standalone-charte`

Puis demander explicitement :

- lire la ressource design ;
- ne pas copier le HTML complet sauf demande ;
- extraire les tokens visuels et patterns UI ;
- appliquer le style au nouveau projet ;
- garder privacy-first et opt-in ;
- verifier mobile.

## Prompt reutilisable

```text
Utilise la reference design `resource:design/urgence-lol-standalone-charte`.

Objectif :
appliquer la direction visuelle Urgence.LOL / Night-Intel au projet courant sans recopier aveuglement le HTML complet.

Contraintes design :
- fond noir profond proche `#07070B` ;
- interface dense, lisible, radar / terminal / classified system ;
- accents neon controles : pink urgence, acid green, electric blue, blood red ;
- typographie technique : mono pour signaux, labels, metadata ; sans moderne pour contenu ;
- cards compactes, bords courts, grilles nettes, pas de hero marketing ;
- navigation topbar/sidebar/bottom rail si utile ;
- mobile-first, safe-area iPhone, aucun chevauchement ;
- boutons d'urgence visibles mais non anxiogenes ;
- aucune mecanique humiliante, punitive ou degradante ;
- geoloc/photo/check-in seulement opt-in ;
- scores, badges, XP/Aura avec seuils explicites si utilises.

Methode :
1. Lire la ressource HTML complete comme reference visuelle.
2. Extraire seulement les patterns utiles : couleurs, typo, spacing, composants, responsive.
3. Adapter au contexte du projet au lieu de cloner toute l'interface.
4. Documenter les fichiers modifies et les risques.
5. Verifier rendu desktop + mobile.

Ne pas exposer de chemin personnel, token, email, identifiant ou URL privee.
```

## Regles

- Le HTML complet reste conserve tel quel dans `urgence-lol-standalone-charte.html`.
- Cette fiche sert d'appel court et de prompt.
- Pour une implementation, extraire les patterns utiles au lieu de dupliquer tout le bundle.
- Si le HTML source change, mettre a jour taille, hash et changelog.

## Changelog

### v0.1-reference - 2026-05-16

- Objectif : conserver le fichier HTML complet et fournir un appel design reutilisable.
- Source : fichier local fourni par l'utilisateur.
- Fichiers touches : `resources/design/urgence-lol-standalone-charte.html`, `resources/design/urgence-lol-design-reference.md`, `resources/RESOURCES.md`.
- Risques : le HTML est un bundle lourd, mieux comme reference que comme composant source.
- Rollback possible : supprimer `resources/design/` et retirer les references de `RESOURCES.md`.
