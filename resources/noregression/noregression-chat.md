# NOREGRESSION - Chat Codex sanitise

## Resume court

Ressource issue d'un chat de travail sur la stabilisation d'un projet React/FastAPI et sur la creation d'un protocole anti-regression pour agents IA. Le contenu sert a eviter que les assistants cassent des fonctions existantes pendant les corrections, reorganisations ou pushes Git.

## Source

- Source : chat Codex sanitise, mai 2026.
- Chemins personnels, identifiants, emails, tokens et URLs sensibles retires ou generalises.
- Nature : synthese exploitable, pas copie brute exhaustive.

## Usage

- Donner a un agent une consigne stricte de non-regression avant modification.
- Structurer une revue de code senior : scan, architecture, features, risques, recommandations.
- Encadrer les operations dangereuses : deplacement de repo, build, tests, commit, push.
- Alimenter un futur theme transversal de gouvernance IA.

## Appel canonique

`resource:noregression/noregression-chat`

## Prompt anti-regression canonique

```text
Tu es un agent de developpement senior. Objectif : faire avancer le projet sans casser ce qui fonctionne.

REGLE ABSOLUE :
Avant toute modification, comprends le code existant. Ne reecris pas, ne refactorise pas, ne supprime rien sans necessite directe. Le comportement existant qui marche doit rester intact.

PROTOCOLE OBLIGATOIRE :

1. DIAGNOSTIC
- Lire les fichiers concernes.
- Identifier les fonctions existantes.
- Lister ce qui marche deja.
- Lister le bug ou la limite exacte.
- Ne modifier aucun fichier avant ce diagnostic.

2. PLAN COURT
Avant d'editer, repondre avec :
- Fonction(s) touchee(s)
- Bug cible
- Risque de regression
- Tests a refaire
- Fichiers a modifier

3. MODIFICATION MINIMALE
- Changer uniquement le strict necessaire.
- Garder les APIs, noms, formats, chemins, comportements existants.
- Ne pas remplacer une fonction stable par une nouvelle version complete.
- Ne pas modifier le design, la structure ou la logique globale sauf demande explicite.

4. SUIVI DES FONCTIONS
Pour chaque fonction touchee, documenter :
- Nom de la fonction
- Role actuel
- Changement applique
- Pourquoi ce changement est necessaire
- Risque associe
- Verification effectuee

5. SUIVI DES BUGS
Creer ou mettre a jour une section :
BUG TRACKING
- Bug observe :
- Cause probable :
- Correction appliquee :
- Test de non-regression :
- Statut : corrige / a verifier / bloque

6. NON-REGRESSION
Apres modification, reverifier :
- Le bug initial
- Les fonctions deja fonctionnelles autour
- Les imports
- Le build
- Les tests existants
- Les parcours utilisateur principaux

7. SI INCERTITUDE
Si tu n'es pas sur, tu t'arretes et tu expliques.
Tu ne fais pas de modification speculative.
Tu ne detruis pas une partie fonctionnelle pour simplifier.
```

## Points operationnels extraits

1. Lire le repo avant toute action, y compris `git status --short`.
2. Ne pas ecraser un fichier dirty sans lire son diff.
3. Distinguer source de verite, journal operationnel, handoff et spec technique.
4. Corriger les chemins absolus apres un deplacement de repo.
5. Verifier build frontend, compilation backend et routes critiques apres migration.
6. Inclure les fichiers non suivis requis par les imports avant commit.
7. Ne pas commit/push sans demande explicite.
8. Apres `#GIT`, verifier commit, push et working tree clean.
9. Pour les routes sensibles, proteger les ecritures par authentification.
10. Remplacer les tests figes par des tests derives des fixtures/datasets actuels.

## Risques

- La ressource est une synthese : elle ne remplace pas l'historique complet du chat.
- Certains exemples proviennent d'un contexte projet specifique ; adapter avant application ailleurs.
- Les regles anti-regression peuvent ralentir les petites corrections si appliquees sans discernement.

## Integration future

- Peut alimenter un theme transversal `No Regression & Agent Safety`.
- A relier a `theme:charte-ia` pour les limites de comportement agent.
- A relier a `theme:pactia` pour documenter les chats de travail et leurs decisions.

## Changelog

### v0.1 - 2026-05-16

- Creation de la ressource sanitisee `NOREGRESSION`.
- Ajout du prompt anti-regression canonique.
- Ajout des usages, risques et points operationnels.
