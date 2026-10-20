# Twitter RSS Monitoring

## Type

Veille process / source monitoring.

## Tags

#inference-locale, #extraction-web, #rss, #twitter

## Source

Article : `Keeping Up With Twitter Via RSS Feeds`

URL : `https://ohmypizza.com/2023/04/keeping-up-with-twitter-via-rss`

Auteur : Scott Yoshinaga

Date source : 2023-04-20

## Metadata GitHub publique

Releve API GitHub : 2026-08-21

- repo : `zedeus/nitter`
- URL : `https://github.com/zedeus/nitter`
- description : Alternative Twitter front-end
- licence : AGPL-3.0
- etoiles relevees : 13467
- derniere activite relevee : 2026-08-19T01:16:29Z
- archived : non
- fork : non

Note : metadata volatile, a reverifier avant decision produit ou execution locale.

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

### v0.1 - 2026-05-22

- Objectif : integrer la methode RSS pour suivre Twitter/X dans KM.
- Risques : usage abusif possible pour surveillance ou scraping.

### v0.2 - 2026-05-22

- Objectif : verifier la source officielle OpenRSS et ajouter les limites d'usage.
- Risques : conditions OpenRSS variables dans le temps.

### v0.3 - 2026-05-22

- Objectif : verifier Nitter et ajouter le statut d'instabilite.
- Risques : instances Nitter variables, RSS parfois indisponible.

### v0.4 - 2026-05-22

- Objectif : resserrer la classification `#ROUGE` aux abus offensifs directs.
- Risques : usage de veille pouvant deriver en surveillance.

### v0.5 - 2026-05-22

- Objectif : confirmer `https://openrss.org/` comme source directe du nouveau lot.
- Risques : conditions et disponibilite variables.

## Métadonnées

- Nature : À vérifier
- OS : À vérifier
- Licence : À vérifier
- Tarification : À vérifier
- Accès : À vérifier
- Preuve : À vérifier

## Ontologie

- Version : 1.1
- Identifiants : domain.ai.llm domain.data.web capability.scraping compatibility.deployment.local compatibility.protocol.rss risk.sensitive
- Sujets : Intelligence artificielle > Modèles de langage ; Données et connaissances > Collecte web
- Fonctions : Extraire des données web
- Compatibilités : Exécution > Exécution locale ; Protocoles > RSS
- Risques : Risque signalé

## Sources

- https://ohmypizza.com/2023/04/keeping-up-with-twitter-via-rss
- https://github.com/zedeus/nitter
- https://nitter.net/
- https://openrss.org/twitter.com/
- https://openrss.org/
- https://openrss.org/guides/how-to-use-an-open-rss-feed
- https://openrss.org/terms
