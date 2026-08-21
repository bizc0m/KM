# Twitter RSS Monitoring

## Type

Veille process / source monitoring.

## Tags

#rss, #twitter, #x, #monitoring, #nitter, #openrss, #social-watch, #privacy

## Appel canonique

`watch:twitter-rss-monitoring`

## Source

Article : `Keeping Up With Twitter Via RSS Feeds`

URL : `https://ohmypizza.com/2023/04/keeping-up-with-twitter-via-rss`

Auteur : Scott Yoshinaga

Date source : 2023-04-20

Lecture KM : 2026-05-22

## Metadata GitHub publique

Releve API GitHub : 2026-08-21

- repo : `zedeus/nitter`
- URL : `https://github.com/zedeus/nitter`
- description : Alternative Twitter front-end
- licence : AGPL-3.0
- etoiles relevees : 13467
- topics releves : nim, privacy, self-hosted, twitter, x
- derniere activite relevee : 2026-08-19T01:16:29Z
- archived : non
- fork : non

Note : metadata volatile, a reverifier avant decision produit ou execution locale.

## Resume court

Twitter RSS Monitoring is a KM watch item classified as Veille process / source monitoring. The final source is preserved in the fiche and must be verified before product use, public reuse or operational integration.

## Outils cites

| Outil | URL | Usage | Statut |
| --- | --- | --- | --- |
| Nitter | `https://nitter.net/<username>` | consulter un compte Twitter via interface alternative et recuperer un RSS | verifie partiel 2026-05-22, service/instances instables |
| OpenRSS | `https://openrss.org/twitter.com/<username>` | generer un flux RSS depuis un compte Twitter public | verifie source officielle 2026-05-22 |

## Nitter - verification officielle

Sources :

- Instance : `https://nitter.net/`
- Repo : `https://github.com/zedeus/nitter`

Verification 2026-05-22 :

- `https://nitter.net/` repond, mais la page chargee est minimale.
- Repo GitHub verifie via GitHub API : `zedeus/nitter`.
- Licence GitHub : AGPL-3.0.
- Repo non archive au moment de la verification.
- Dernier push lu via GitHub API : 2026-04-16.

Notes de contexte :

- Nitter est un frontend alternatif Twitter/X centre privacy/performance.
- Le projet a connu une forte instabilite apres les changements d'acces de Twitter/X.
- Plusieurs sources publiques indiquent que les instances et le RSS peuvent etre instables ou desactives selon les periodes.
- A utiliser comme source de veille opportuniste, pas comme infrastructure fiable de production.

## OpenRSS - verification officielle

Source officielle : `https://openrss.org/`

Guides / conditions lues :

- `https://openrss.org/guides/how-to-use-an-open-rss-feed`
- `https://openrss.org/terms`

Points verifies :

- Page racine relue le 2026-05-22 depuis le lot fourni.
- OpenRSS permet d'ajouter `openrss.org/` devant une URL pour obtenir un flux RSS quand la page est supportee.
- Le service annonce des flux sans algorithmes de recommandation.
- Le service indique retirer certains scripts, tracking links et contenus invasifs des flux.
- OpenRSS est presente comme organisation nonprofit 501(c)(3).
- Usage annonce : personnel, informatif, non commercial.
- Les conditions demandent de limiter la frequence des requetes.
- Les conditions interdisent l'usage illegal, le contournement de restrictions, l'acces a du contenu payant, l'espionnage, le harcelement et le monitoring de contenu non public.

## Usage utile

- Veille sobre sur comptes publics.
- Centraliser des sources X dans un lecteur RSS.
- Reduire l'exposition a l'interface addictive de X.
- Surveiller les comptes source utiles pour KM sans connexion directe a X.
- Alimenter une veille manuelle non intrusive.

## Usage abusif possible

| Risque | Description | Classement |
| --- | --- | --- |
| Surveillance abusive | suivre systematiquement une personne sans cadre legitime | #ROUGE si cible personne privee |
| Scraping agressif | multiplier flux et requetes au-dela d'une veille raisonnable | sensible ; #ROUGE si automatisation furtive ou massive |
| Contournement plateforme | utiliser des services alternatifs pour contourner limites/API sans respecter conditions | sensible |
| Profilage | croiser flux publics pour profiler une personne ou un groupe | sensible ; #ROUGE si ciblage individuel non consenti |

## Garde-fous

- Utiliser uniquement des comptes publics et pertinents pour la veille.
- Ne pas suivre de personnes privees sans raison legitime.
- Ne pas stocker donnees personnelles issues de flux.
- Ne pas automatiser a grande echelle.
- Respecter les limites des services tiers et les conditions applicables.
- Preferer la veille thematique aux listes nominatives.
- Usage OpenRSS : personnel, non commercial, frequence raisonnable.
- Ne pas redistribuer les flux OpenRSS dans une app publique ou payante sans verifier les conditions.
- Usage Nitter : limiter a une veille manuelle ou faible frequence ; ne pas dependra d'instances publiques pour un produit.

## Relations

- `watch:x-source-authors-log`
- `watch:ai-open-source-tools-watch`
- `watch:red-team-risk-tools-watch`
- `process:km-auto-operating-prompt-v1.0`

## Decision KM

Garder comme process de veille utile, mais classer les usages de surveillance/profilage en `#ROUGE`.

## Rollback

Supprimer `watch/twitter-rss-monitoring.md` et retirer les lignes correspondantes de `index.md`, `watch/index.md`, `km/history.md`.

## Changelog

### v0.1 - 2026-05-22

- Objectif : integrer la methode RSS pour suivre Twitter/X dans KM.
- Fichiers touches : `watch/twitter-rss-monitoring.md`, `watch/index.md`, `index.md`, `km/history.md`.
- Risques : usage abusif possible pour surveillance ou scraping.
- Rollback possible : supprimer cette fiche et retirer les lignes d'index.

### v0.2 - 2026-05-22

- Objectif : verifier la source officielle OpenRSS et ajouter les limites d'usage.
- Fichiers touches : `watch/twitter-rss-monitoring.md`, `km/history.md`.
- Risques : conditions OpenRSS variables dans le temps.
- Rollback possible : retirer le bloc `OpenRSS - verification officielle`.

### v0.3 - 2026-05-22

- Objectif : verifier Nitter et ajouter le statut d'instabilite.
- Fichiers touches : `watch/twitter-rss-monitoring.md`, `km/history.md`.
- Risques : instances Nitter variables, RSS parfois indisponible.
- Rollback possible : retirer le bloc `Nitter - verification officielle`.

### v0.4 - 2026-05-22

- Objectif : resserrer la classification `#ROUGE` aux abus offensifs directs.
- Fichiers touches : `watch/twitter-rss-monitoring.md`.
- Risques : usage de veille pouvant deriver en surveillance.
- Rollback possible : revenir a v0.3.

### v0.5 - 2026-05-22

- Objectif : confirmer `https://openrss.org/` comme source directe du nouveau lot.
- Fichiers touches : `watch/twitter-rss-monitoring.md`, `km/history.md`.
- Risques : conditions et disponibilite variables.
- Rollback possible : retirer la mention de relecture.
