# NightCrawl - Synthese du document

## Ce que je comprends

Le document propose de transformer une simple liste de sites DJ en outil NightLife :

- suivre n'importe quel DJ ;
- surveiller les dates de concerts, clubs et festivals ;
- afficher les 30 plus grands DJs avec leur prochaine date et leur prochain lieu ;
- centraliser les sources : Songkick, Bandsintown, Resident Advisor, Shotgun, DICE, DJ Mag, Live Nation, Fnac Spectacles, InfoConcert, Skiddle ;
- organiser les dates par DJ, region, ville, salle, prix, source et lien de billetterie ;
- envoyer une alerte hebdomadaire quand une nouvelle date apparait ;
- ajouter des bots Telegram et Discord pour recevoir les alertes et interroger les dates.

Avec le protocole Night Intel, le projet change de niveau : il ne doit pas etre seulement un dashboard de dates DJ. Il doit devenir une couche d'intelligence culturelle, un radar de signaux nocturnes et une cartographie emotionnelle des villes.

Mission centrale :

MAKE THE INVISIBLE VISIBLE.

Tagline candidate :

Render the chaos legible.

## Ce qu'on peut faire pour NightCrawl

NightCrawl peut devenir un radar NightLife gratuit ou quasi gratuit :

1. Dashboard local ou web
   - recherche par DJ, ville, pays, salle, source ;
   - Top 30 DJs avec prochaine date connue ;
   - filtres Europe, France, Suisse, Annecy, Lyon, Geneve, Paris ;
   - liens directs vers billetterie officielle.

2. Pipeline de donnees
   - import manuel JSON/CSV au depart ;
   - collecte semi-automatique via pages publiques ;
   - stockage SQLite gratuit ;
   - snapshots hebdomadaires ;
   - detection des nouvelles dates.

3. Alertes
   - Discord webhook gratuit ;
   - Telegram bot gratuit ;
   - message hebdomadaire ;
   - commandes a la demande.

4. Extension locale Annecy / Geneve / Lyon
   - focus clubs, festivals, salles ;
   - tri par distance ;
   - alertes "ce week-end" ;
   - watchlist personnelle de DJs.

5. Couche Night Intel
   - City Nodes : Paris, Berlin, Tokyo, Geneva, Annecy, Lyon ;
   - mood signals : heat, movement, density, social energy ;
   - roles : Scout, Operator, Curator, Signal Keeper, City Node, Architect ;
   - propagation : QR codes, stickers, maps, projections, screenshots, radar animations ;
   - filtre produit : chaque fonction doit augmenter la decouverte, l'appartenance ou l'intensite emotionnelle.

6. Presence Points
   - chaque fiche artiste doit afficher toutes les dates connues ;
   - chaque event peut rapporter des points si la presence est verifiee ;
   - club : 40, festival : 70, arena : 90, rare signal : 120 ;
   - validation possible par QR code, geofence, photo horodatee ou Operator ;
   - les points servent au statut, a la reputation et a l'acces, pas a une economie speculative.

## Sources prioritaires

Sources a brancher en premier :

- Songkick : tres bon pour artistes internationaux et tournees.
- Bandsintown : bon pour alertes artistes et dates futures.
- Shotgun : tres utile pour clubbing Europe/France.
- DICE : utile pour concerts et clubs urbains.
- Resident Advisor : tres bon pour techno/club culture, mais scraping plus fragile.
- Live Nation / Fnac / Ticketmaster : utile pour les grosses dates officielles.
- DJ Mag : utile pour Top DJs, actus, classement, contexte.

## Attention

Il faut eviter un scraping agressif. Le mode propre :

- preferer API officielle quand disponible ;
- limiter la frequence ;
- garder les liens vers les sources ;
- ne pas recopier massivement les contenus ;
- utiliser le dashboard comme index et systeme d'alerte.

## Version gratuite realiste

Oui, on peut faire une version gratuite :

- dashboard HTML local : gratuit ;
- SQLite : gratuit ;
- cron local ou GitHub Actions : gratuit selon limites ;
- Telegram bot : gratuit ;
- Discord webhook ou bot : gratuit ;
- hebergement possible : GitHub Pages pour dashboard statique, ou Render/Fly/Cloudflare avec limites gratuites selon disponibilite.

Le point payant potentiel n'est pas le bot, mais l'hebergement permanent si on veut un service toujours en ligne.

## Direction produit Night Intel

Ne pas communiquer comme une app startup. Communiquer comme :

- une transmission ;
- une anomalie ;
- une couche cachee ;
- un systeme classe ;
- un mouvement culturel.

Priorite initiale :

- DJs ;
- photographes ;
- bartenders ;
- organisateurs ;
- explorateurs nightlife ;
- etudiants avec portee sociale ;
- curateurs culturels ;
- operateurs locaux.

Golden question avant chaque ajout :

Est-ce que cette fonction augmente l'intensite emotionnelle, ameliore la decouverte, renforce l'appartenance, amplifie l'experience de la ville ou rend l'invisible visible ?

Si non : rejeter ou simplifier.
