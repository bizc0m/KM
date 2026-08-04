# NightCrawl - Bots Telegram et Discord gratuits

## Reponse courte

Oui, on peut faire un bot Telegram et un bot Discord gratuit avec des fonctions utiles.

Dans la logique Night Intel, les bots ne doivent pas etre seulement des robots de notification. Ils doivent agir comme des canaux de transmission : signaux courts, alertes rares, information utile, ton mysterieux mais lisible.

Interface associee :

- `nightcrawl-bot.html` : ecran dedie au bot et aux transmissions.
- `nightcrawl-scan.html` : ecran dedie au scan des events, signaux et validations.

## Fonctions possibles

Commandes communes :

- `/start` : presentation rapide.
- `/help` : liste des commandes.
- `/dj david guetta` : prochaine date connue pour un DJ.
- `/watch miss monique` : ajoute un DJ a la watchlist.
- `/unwatch miss monique` : retire un DJ.
- `/watchlist` : affiche les DJs suivis.
- `/top30` : affiche les 30 DJs principaux et leur prochaine date.
- `/near annecy` : dates proches d'une ville.
- `/weekend` : sorties du week-end.
- `/new` : nouvelles dates detectees depuis le dernier scan.
- `/source songkick martin garrix` : ouvre la source connue.
- `/signal annecy` : resume le signal nightlife d'une ville.
- `/pulse geneva` : affiche chaleur, mouvement, evenements et lieux actifs.
- `/cell paris` : informations sur un City Node.
- `/role scout` : explique ou active un role contributeur.
- `/drop` : propose une contribution courte : lieu, event, mood ou anomalie.
- `/dates miss monique` : affiche toutes les dates connues d'un artiste.
- `/checkin event_id` : declare une presence a un event.
- `/points` : affiche points, statut et historique de presence.

Fonctions Discord :

- webhook hebdomadaire dans un salon ;
- commandes slash `/dj`, `/top30`, `/near`, `/watch` ;
- commandes slash `/signal`, `/pulse`, `/cell`, `/drop` ;
- role optionnel `NightCrawl Alerts` ;
- message embed avec date, ville, salle, prix et lien.

Fonctions Telegram :

- bot prive ou groupe ;
- alertes push ;
- boutons inline "Billets", "Source", "Suivre DJ" ;
- boutons inline "Signal", "Pulse", "Drop", "Validate" ;
- message court optimise mobile.

## Ton des messages

Eviter :

- "Bonjour, voici votre recap evenementiel."
- "Nouvelle fonctionnalite disponible."
- "Invite tes amis pour gagner des points."

Preferer :

- "SIGNAL DETECTE - Geneva - 3 nouvelles pulsations."
- "CITY NODE Annecy - chaleur en hausse vendredi."
- "ANOMALIE CLUB - source faible - validation requise."
- "RADAR: Miss Monique apparait dans la fenetre Europe."

## Points de presence

Le systeme de points doit recompenser la presence reelle et la qualite du signal, pas le spam.

Base proposee :

- club : 40 points ;
- festival : 70 points ;
- arena : 90 points ;
- rare signal : 120 points.

Bonus possibles :

- QR code sur place ;
- geofence ;
- photo horodatee ;
- validation par Operator ;
- contribution Scout utile apres l'event.

Usage des points :

- reputation ;
- statut ;
- acces ;
- credibilite locale ;
- priorite de validation.

Eviter :

- argent direct ;
- crypto prematuree ;
- referral agressif ;
- points faciles sans presence reelle.

## Architecture gratuite

Option 1 - simple et robuste :

- script Python local ;
- base SQLite ;
- Discord webhook ;
- Telegram Bot API ;
- lancement manuel ou cron.

Option 2 - automatique gratuite :

- GitHub Actions 1 fois par semaine ;
- fichier JSON genere ;
- envoi Telegram/Discord ;
- dashboard statique GitHub Pages.

Option 3 - bot toujours allume :

- petit serveur Node.js ou Python ;
- hebergement gratuit avec limites ;
- stockage SQLite ou fichier JSON ;
- plus fragile si l'hebergeur dort.

## Variables secretes

```env
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
DISCORD_WEBHOOK_URL=
NIGHTCRAWL_CITY=Annecy
NIGHTCRAWL_RADIUS_KM=250
```

## Priorite de build

1. Dashboard statique + donnees exemple.
2. JSON unique `events.json`.
3. Alerte Discord webhook.
4. Alerte Telegram.
5. Watchlist par DJ.
6. Scraper/API source par source.
7. Dedupe + historique hebdomadaire.
8. Commandes Signal/Pulse/Cell.
9. Contributions Scout avec validation Operator.

## Limites

- Telegram et Discord sont gratuits pour ces usages.
- Les APIs ou sites sources peuvent imposer limites, blocages ou conditions.
- Pour un bot 24/7, il faut un hebergement ; gratuit possible, mais pas toujours stable.
- Le risque principal est de faire du theatre sans valeur. Les bots doivent aider a decouvrir, sortir, se connecter et comprendre la ville.
