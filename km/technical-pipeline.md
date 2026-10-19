# Veille KM technique — M2

Mise en place le 17 octobre 2026. Le M2 exécute la collecte et construit `search-v2.html` dans `/Users/JOB/#DEV/06-km/KM`. Les fichiers déjà présents sur le M2 ont été conservés ; les index des deux copies ont été réunis. Cette installation ne configure pas de synchronisation permanente M2/M5 et ne publie pas sur GitHub.

## Sources et cadence

- Raindrop : collection publique KM Monitor, données structurées de chaque page, pagination et vérification du nombre d'identifiants distincts par rapport au total annoncé. RSS complémentaire, jamais utilisé comme preuve d'exhaustivité.
- NotePlan : **Calendar uniquement**, éléments nouveaux ou modifiés suivis par empreinte de contenu. Le dossier Notes est exclu. Le premier passage peut parcourir tout l'historique accessible. Les notes brutes ne sont pas exportées. Les blocs mixtes sont séparés avant le filtre ; les dossiers personnels et contenus exclus sont ignorés. Les captures Calendar sans lien exigent une note entière sans contenu exclu et des passages techniques validés.
- Horaires du M2 : 02:30, 08:30, 14:30, 20:30. NotePlan est parcouru au plus une fois toutes les 20 heures, donc normalement une fois par jour. Si le scan est incomplet, il reprend au passage suivant.
- 80 nouvelles sources maximum par lot ; le service enchaîne les lots de rattrapage sans attendre le prochain horaire. Les sources temporairement inaccessibles attendent au moins cinq heures avant une nouvelle tentative. Un verrou empêche les exécutions concurrentes. Les sources temporairement indisponibles ou ambiguës restent à réessayer, sans fiche inventée.

## Traitement

Le collecteur lit réellement les sources publiques. Les dépôts GitHub utilisent les métadonnées et le README ; les liens X utilisent le service public FxTwitter, puis tous les liens du tweet, avec exploration des sources techniques jusqu’à trois niveaux. L'indisponibilité de ce service ou d'une page laisse la source en attente. Aucune connexion à un compte X n'est configurée.

Ollama, sur le M2 (`qwen3:8b`), décide si la source est exclusivement technique et en extrait un titre, un résumé et des faits attribués. Le résultat doit respecter un schéma et passer un second filtre déterministe. Une décision ambiguë n'entre pas dans les fiches. Les affirmations sont relevées dans les sources ; elles ne constituent pas une validation indépendante de leurs promesses.

Sont exclus : contenus BDSM/sexuels, contexte intime ou personnel, coordonnées et secrets détectés. Le classement automatique n'est pas une garantie parfaite : des faux positifs/négatifs restent possibles. Le filtre du générateur s'applique aussi aux anciennes fiches affichées. Les anciennes sources originales ne sont pas supprimées.

Les fiches admises sont écrites dans `watch/technical-<empreinte>.md` avec sources, politique et date. Les index sont actualisés, puis le dashboard et ses vues publiques sont reconstruits. Le vérificateur contrôle ensuite chaque fiche générée dans les deux index et dans le HTML, avec détection des doublons par dépôt source. Le rapport est conservé dans `~/Library/Application Support/KM/pipeline/placement.json`. Les états stockent des empreintes et des statuts ; aucune copie des notes, noms de fichiers privés ni extraits exclus n'y est enregistrée. Les URL de sources sont publiées uniquement dans les fiches admises. Les téléchargements refusent les destinations locales/privées, les ports inhabituels et les contenus volumineux.

## Services et état

Trois LaunchAgents dans `~/Library/LaunchAgents/` :

- `com.bizc0m.km-technical-pipeline` : collecte et reconstruction.
- `com.bizc0m.km-technical-server` : dashboard en lecture seule, lié à `127.0.0.1:8766`.
- `com.bizc0m.km-technical-health` : contrôle chaque heure et notification si aucun passage entièrement réussi depuis 24 heures.

Le premier service signale aussi les changements d'état problématiques par notification macOS, sans répéter un problème inchangé. Les notifications dépendent des autorisations macOS. L'état reste disponible dans `~/Library/Application Support/KM/pipeline/status.json`, `progress.json`, `health.txt` et les journaux des services. Une absence d'accès NotePlan donne explicitement `NOTEPLAN_PERMISSION_DENIED` ; Raindrop continue.

Ouvrir sur le M2 : `http://127.0.0.1:8766/search-v2.html`. État lisible et progression : `http://127.0.0.1:8766/status`. Le serveur n'expose ni la configuration ni les notes sources. La session utilisateur doit être ouverte ; le Mac endormi ne garantit pas les horaires exacts et les tâches reprennent selon launchd.

## Commandes

```sh
cd '/Users/JOB/#DEV/06-km/KM'
/opt/homebrew/bin/node --test tests/technical-policy.test.mjs
/opt/homebrew/bin/node scripts/km-verify-placement.mjs
/opt/homebrew/bin/node scripts/km-technical-pipeline.mjs
bash scripts/km-technical-install.sh
launchctl kickstart gui/$(id -u)/com.bizc0m.km-technical-pipeline
```

Pour un emplacement NotePlan différent, définir `NOTEPLAN_ROOT` dans l'environnement du LaunchAgent. Une autorisation macOS requise doit être accordée dans la session M2 : aucune modification de la base de confidentialité du système n'est effectuée par ces scripts.

## Sauvegarde et retour arrière

Sauvegardes initiales : `~/Library/Application Support/KM/backups/m2-before-pipeline-20261017.tgz` sur M2 et `m5-before-pipeline-20261017.tgz` sur M5. Le diff Git original du M2 est conservé dans le même dossier. Ne pas les publier : elles peuvent contenir des sources privées originales.

Pour arrêter : `launchctl bootout gui/$(id -u)/com.bizc0m.km-technical-pipeline` puis arrêter de même les services `server` et `health`. Déplacer leurs plists hors de `~/Library/LaunchAgents/` pour empêcher leur rechargement à la prochaine session. Examiner les sauvegardes avant toute restauration afin de préserver les fiches ajoutées depuis l'installation.

Les scripts de déploiement serveur ont été réalignés sur v2 avec contrôle de checksum, sauvegardes distinctes et remplacement de fichier atomique. Le serveur distant était inaccessible pendant l'installation : aucune publication distante ni activation de ses minuteurs n'a été vérifiée. La publication des vues secondaires et le retour arrière automatique d'une publication complète restent à traiter avant de réactiver une publication serveur régulière.

## Accès NotePlan corrigé le 17 octobre

Après confirmation explicite, le réglage Session à distance « Accorder aux utilisateurs distants accès à ensemble du disque » a été activé dans la session graphique du M2. La lecture SSH réelle a réussi : 1 434 notes, aucune erreur de lecture.

Le LaunchAgent définit désormais `KM_NOTEPLAN_SSH=1` : seul le lecteur isolé NotePlan passe par SSH vers `JOB@127.0.0.1`, avec la clé existante `~/.ssh/id_ed25519_atn_core`, déjà autorisée. Aucun nouveau couple de clés ni nouvel utilisateur autorisé ne sont créés. La connexion reste locale au M2. Le filtrage est effectué avant le retour des segments techniques au processus principal ; aucun export des notes brutes.

Deux premières fiches NotePlan ont été créées et contrôlées dans watch, les deux index et le dashboard, qui comptait alors 248 fiches (76 nouvelles fiches techniques, dont 2 NotePlan). Le rattrapage se poursuit en arrière-plan.

## Périmètre restreint à Calendar

À la demande explicite de utilisateur, seul le dossier Calendar est désormais parcouru. Le dossier Notes ne sert plus de source. Le cache de dernier scan quotidien a été invalidé et le traitement relancé. Les fiches déjà créées ne sont pas supprimées rétroactivement. Un test ajoute une note technique dans Notes et vérifie son exclusion.

## Exploration X reconfigurée

Version `depth3-all-links-v1` : le tweet est le niveau zéro. Tous ses liens sont recensés, les liens directs lus en priorité (niveau un), puis les liens utiles des pages techniques aux niveaux deux et trois. Les redirections HTTP ne consomment pas de niveau supplémentaire. Les boucles et variantes X/Twitter sont dédupliquées. Les pages non techniques, privées ou sexuelles sont exclues ; les pages avec des liens techniques peuvent servir de relais.

Budget par tweet : 120 pages maximum et 180 secondes de collecte réseau (une requête déjà commencée peut finir après ce délai). Le temps de classement Ollama vient ensuite et dépend du nombre de pages. Les pages dépassant le budget ou la profondeur restent explicitement signalées, ainsi que les erreurs. Chaque page technique est analysée séparément ; les pages de plus de 18 000 caractères sont traitées sur un extrait et marquées comme telles. Les résumés et faits validés des sources liées sont ajoutés dans la fiche, avec leurs URL et profondeur.

La section Exploration des liens donne les compteurs de couverture. Le cache privé `pipeline/crawls/` conserve les URL publiques du graphe, les statuts et les résumés techniques validés, sans texte brut des pages ni des notes. Les décisions réutilisables sont associées à une empreinte de contenu. Les résumés des sources ambiguës ne sont pas conservés.

La nouvelle version force le retraitement des tweets déjà traités avec la limite de trois liens. Les notes Calendar contenant des tweets sont réexaminées, et priorisées. Les fiches existantes sont enrichies à leur emplacement ; elles ne sont pas supprimées. Le dashboard est reconstruit et le placement vérifié après chaque fiche créée ou enrichie.

Tests : `node --test tests/technical-policy.test.mjs tests/source-crawl.test.mjs`, dont un graphe de 30 liens directs, trois niveaux, une boucle, les budgets, le cache et les index de fiches existantes.

### Fiches par outil

Depuis `depth3-per-tool-v2`, les articles X sont lus avec leurs blocs de texte et leurs liens développés. Les dépôts GitHub validés par le modèle local produisent chacun une fiche ; un dépôt déjà associé à une fiche enrichit celle-ci en conservant ses sources et son origine. Les pages README ou issues ne créent pas de nouveaux outils. Les listes de plusieurs dépôts ne deviennent pas propriétaires de tous les projets cités. La profondeur reste limitée à trois niveaux et 120 pages ; les limites et erreurs restent visibles.

Le retraitement ciblé `node scripts/km-process-tweet.mjs URL` écrit son avancement dans `~/Library/Application Support/KM/pipeline/tweet-tools-report.json`. Il doit tourner avec le LaunchAgent de collecte arrêté pour éviter les écritures concurrentes. Une nouvelle fiche issue d’un lien fourni directement est marquée `Origine : X`, et non NotePlan. Le compteur `created` mesure des fichiers créés, pas des notes Calendar converties.

### Contrôle et publication

Les règles permanentes sont dans `AGENTS.md`. `node scripts/km-coverage.mjs` distingue les fiches des notes Calendar lues et indique explicitement que l’attribution historique aux notes est partielle. Les nouveaux traitements mémorisent les fichiers liés à chaque note. Un changement de version d’extraction invalide les empreintes de lecture des notes pour retraiter l’existant, sans supprimer les fiches ni leurs sources.

Après validation, pousser le code sur la branche de travail GitHub et rapporter son commit. Le rapport de déploiement doit distinguer le code installé sur M2, l’état du traitement et le code effectivement poussé. Les données privées, caches et sauvegardes ne doivent jamais être ajoutés à Git.

### Hashtags précis

La taxonomie partagée `scripts/km-tags.mjs` est utilisée par la génération, le tableau KM et la migration `node scripts/km-retag.mjs`. Elle harmonise les alias, retire les catégories génériques et tags parasites, puis retient jusqu’à quatre fonctions/compatibilités documentées. Les titres, résumés et faits de la fiche servent de contexte ; les URL et les pages annexes sont exclues pour éviter de récupérer leurs technologies. La migration sauvegarde les originaux et utilise les anciens résumés sauvegardés pour les fiches qui n’affichent désormais qu’un intérêt court. Les fiches insuffisamment documentées peuvent garder moins de deux tags. Les statuts de risque sont conservés séparément.

### Exécution automatique sur le M2

Le LaunchAgent lance `km-technical-run.mjs` à 02:30, 08:30, 14:30 et 20:30. Ce point d’entrée attend la fin d’un retraitement ciblé de tweet, évite les migrations concurrentes, normalise les hashtags existants, reconstruit et vérifie KM, puis lance la collecte. Toute fiche créée ou enrichie passe déjà par la taxonomie partagée dans `addFiche`. Un contrôle de couverture termine l’exécution. L’état des étapes est enregistré dans `pipeline/automation-status.json` ; aucun nouveau service récurrent n’est ajouté.

Le bilan de reprise, les correctifs de redirection, la fusion réversible, le rapprochement Calendar et la procédure de récupération sont documentés dans [reprise-m2-2026-10-19.md](reprise-m2-2026-10-19.md). Les fusions et le rapprochement des liens sont exécutés avant la collecte par le point d’entrée automatique.
