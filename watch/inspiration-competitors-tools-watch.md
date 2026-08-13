# Inspiration Competitors Tools Watch

## Type

Veille inspirations / concurrents / outils.

## Tags

#inspiration, #competitors, #tools, #product-watch, #social-planning, #nightintel, #privacy

## Appel canonique

`watch:inspiration-competitors-tools`

## Role

Centraliser les sites inspirants, concurrents, references produit et outils potentiellement utiles aux projets.

Objectif : veiller sans copier. Extraire les patterns utiles, les risques, les garde-fous et les opportunites d'integration.

## Regles

- Distinguer : inspiration, concurrent, outil utilisable, source technique.
- Ajouter l'URL, la date de lecture, le role, les projets lies, les risques.
- Ne pas copier l'identite visuelle ou le wording d'un concurrent.
- Identifier l'usage abusif possible quand l'outil touche social, data, OSINT, IA, tracking ou automation.
- Classer `#ROUGE` si l'outil peut servir a surveillance, scraping abusif, contournement, manipulation ou fuite de donnees.

## Index veille

| Nom | URL | Type | Projets lies | Usage utile | Risques | Statut |
| --- | --- | --- | --- | --- | --- | --- |
| Orbit | `https://weorbit.org/` | inspiration / concurrent social planning | NightLife, NightCrawl, Annecy Intel | coordination sorties, cercles, RSVP, nudges doux, privacy calendar | pression sociale, sur-notification, tracking relationnel | a suivre |
| Oh My Pizza! | `https://ohmypizza.com/` | inspiration / source veille personnelle | KM, Night Intel, NightLife | veille culturelle, curation apps/musique/tech, patterns blog personnel | source personnelle, a ne pas traiter comme reference officielle | a suivre |

## Fiche courte - Orbit

### Resume

Orbit aide des groupes d'amis a trouver des disponibilites communes via calendrier, cercles, nudges et RSVP.

### Patterns utiles

- Disponibilite calendrier sans partager les titres d'evenements.
- Cercles sociaux par groupe/vibe.
- Nudges automatiques mais limites.
- RSVP simple.
- Ton ludique sans culpabilisation.

### Liens projets

- NightLife : organiser sorties, groupes, RSVP, opt-in calendrier.
- NightCrawl : cercles de veille / transmissions de groupe.
- Annecy Intel : coordination locale et sorties.

### Garde-fous

- Geoloc/calendrier toujours opt-in.
- Pas de score de popularite sociale.
- Pas de penalite si refus ou absence.
- Cadence de nudges explicite et configurable.
- Pas de partage des titres d'evenements.

### Usage abusif possible

| Risque | Description | Classement |
| --- | --- | --- |
| Tracking relationnel | mesurer qui voit qui et a quelle frequence | sensible |
| Pression sociale | relancer trop souvent les personnes moins presentes | sensible |
| Profilage social | inferer habitudes, groupes ou disponibilites | sensible ; #ROUGE si ciblage/stalking non consenti |

## Fiche courte - Oh My Pizza!

### Resume

Blog personnel de Scott Yoshinaga avec archives, updates, posts culturels et notes pratiques. Source deja utile via l'article sur Twitter/X via RSS.

### Patterns utiles

- Curation personnelle claire.
- Articles longs avec liens sortants.
- Archive simple.
- Melange culture, apps, musique et petites trouvailles web.
- Bon modele de source de veille humaine, non algorithmique.

### Liens projets

- KM : source de veille et methode de curation.
- Night Intel / NightLife : veille culturelle et signaux faibles.
- Inspiration contenu : formats listes, favoris annuels, liens outils.

### Usage abusif possible

| Risque | Description | Classement |
| --- | --- | --- |
| Surinterpretation | traiter un blog personnel comme source officielle | faible |
| Copie de contenu | reprendre la curation ou le texte sans attribution | sensible |
| Tracking culturel individuel | profiler les gouts d'une personne a partir de ses archives | sensible ; #ROUGE si harcelement/ciblage non consenti |

### Garde-fous

- Citer comme source personnelle.
- Ne pas copier le wording ou les listes entieres.
- Extraire des patterns et liens, pas l'identite personnelle.
- Verifier les outils cites via sources primaires.

## Prochaines actions

1. Ajouter les prochaines references inspirantes dans ce fichier.
2. Creer une fiche dediee seulement si une reference devient structurante.
3. Relier aux themes privacy, social planning, Night Intel.

## Relations

- `watch:tool-project-fit-scan`
- `watch:red-team-risk-tools-watch`
- `theme:charte-ia`
- `process:km-auto-operating-prompt-v1.0`

## Changelog

### v0.1 - 2026-05-22

- Objectif : creer un fichier de veille pour sites inspirants, concurrents et outils.
- Fichiers touches : `watch/inspiration-competitors-tools-watch.md`, `watch/index.md`, `index.md`, `km/history.md`.
- Risques : ne pas copier les concurrents, seulement analyser les patterns.
- Rollback possible : supprimer cette fiche et retirer les lignes d'index.

### v0.2 - 2026-05-22

- Objectif : ajouter `ohmypizza.com` comme source inspirante de veille personnelle.
- Fichiers touches : `watch/inspiration-competitors-tools-watch.md`, `km/history.md`.
- Risques : source personnelle, a ne pas traiter comme reference officielle.
- Rollback possible : retirer l'entree Oh My Pizza.

### v0.3 - 2026-05-22

- Objectif : resserrer `#ROUGE` aux abus offensifs directs et classer le reste en sensible.
- Fichiers touches : `watch/inspiration-competitors-tools-watch.md`.
- Risques : social planning et blogs personnels restent privacy-sensitive.
- Rollback possible : revenir a v0.2.
