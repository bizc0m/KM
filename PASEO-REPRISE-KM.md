# KM — reprise et exploitation depuis Paseo sur le M2

Tu travailles directement sur le M2, dans /Users/JOB/#DEV/06-km/KM. Pilote la veille KM et termine son cycle de bout en bout. Lis AGENTS.md et les règles du projet. N'annonce jamais « réparé » sur la seule base d'un changement de code.

## Priorité : nouveautés puis marquage

1. Vérifie les processus et verrous par PID, les derniers rapports, la date de dernière collecte et celle des données publiques. Si un traitement est actif, suis-le jusqu'à sa fin avec des attentes bornées et contrôles espacés ; ne lance jamais une seconde collecte concurrente. Ne termine pas ta tâche au seul motif que le processus est actif : surveiller son achèvement fait partie du travail. Un diagnostic avec suivi restant ne constitue pas une exécution réussie. Un verrou dont le processus est mort doit être traité comme périmé.
2. Exécute le cycle scripts/km-technical-run.mjs avec KM_ROOT, KM_PIPELINE_DATA et KM_NOTEPLAN_SSH=1, PATH incluant /opt/homebrew/bin. Le modèle de traitement reste local sur le M2. La collecte des nouveautés doit commencer avant les migrations facultatives et avant l'écriture NotePlan. Ne laisse jamais réécriture ou marquage bloquer l'alimentation.
3. Sources : sources.md, NotePlan Calendar uniquement et sources publiques activées. Lis depuis le dernier marqueur réussi avec un jour de recouvrement ; inclus les notes anciennes modifiées et les éléments en attente. Ne saute pas les journées manquantes et ne rescannes pas tout l'agenda sans nécessité établie. Contenu technique uniquement ; exclus personnel, intime, sexuel et secrets. Aucun contenu brut NotePlan dans GitHub, les messages ou les journaux.
4. Explore les liens utiles jusqu'à trois niveaux ; conserve les erreurs et les liens non lus dans les compteurs. Une fiche par produit, fusion des forks vérifiés et conservation des sources. Description en trois lignes télégraphiques, chacune de 3 à 12 mots : Fonction · / Avantages · / Gain ·. Gain concret, aucun bénéfice inventé. Jusqu'à deux aperçus produit documentés, avec origine ; ni logos ni badges en guise de capture. Palette et mots-clés historiques conservés. Informations connues en colonnes ; inconnues masquées.
5. Reconstruis l'index et le viewer, vérifie la présence des nouvelles fiches et l'affichage. Déclenche ou vérifie le publisher existant sur le Mac de publication ; il importe seulement les données filtrées du M2. Ne suppose pas Git utilisable sur le M2 et n'accepte pas de licence système. Ne publie jamais des fichiers privés pour contourner le publisher. Si la machine de publication est inaccessible, conserve un état « publication en attente » avec la raison.
6. Après production réellement achevée, coche chaque élément traité dans Calendar avec [x] #KM-OK. Jamais une note entière si elle contient encore des éléments en attente. Une source inaccessible ou une exploration incomplète reste en attente. Conserve les anciens #km-fait pour compatibilité ; aucun ajout massif de liens KM dans l'agenda. Sauvegarde et compare le contenu avant écriture ; ne remplace pas une modification concurrente. Une panne NotePlan ne doit pas interrompre la création et la publication des fiches.
7. Si le cycle échoue, relève l'étape et la cause précise, corrige dans le périmètre autorisé, teste et vérifie une vraie exécution. Commit et push sur codex/km-technical-pipeline ; aucune fusion dans main. Ne détruis aucune donnée. Rapporte séparément installé, en cours, terminé et en attente.

## Rapport et alertes

Sauve un rapport local daté dans Library/Application Support/KM/pipeline, sans notes brutes : notes lues, liens, fiches créées/enrichies, doublons, rejets, erreurs, éléments marqués, dates couvertes, publication réellement vérifiée. Signale dans Paseo tout échec, blocage, absence de nouveauté due à une panne, collecte en retard ou publication en attente, avec prochaine action concrète. Ne considère pas une notification macOS tentée comme une alerte reçue. Reste silencieux pour un passage sans changement ni incident. Ne prétends jamais qu'une tâche est terminée si le processus travaille encore.

## Cadence

Deux passages seulement : 08:00 et 12:00, Europe/Zurich. Paseo est le déclencheur ; l'ancien déclencheur launchd du pipeline doit rester désactivé pour éviter les doublons. Le serveur du viewer et le publisher restent disponibles. Lors de la reprise initiale, vérifie aussi ce transfert du déclenchement et l'absence de double exécution.

## Accès NotePlan vérifié

Le reader et le writeback doivent utiliser le même accès SSH local autorisé via scripts/km-noteplan-command.mjs lorsque KM_NOTEPLAN_SSH=1. Le 11 novembre, un test réel a confirmé trois éléments marqués #KM-OK et zéro conflit. Ce résultat ne prouve pas la complétude de toute la collecte. Les notes récentes passent en premier ; les anciennes restent dans la file de rattrapage.
