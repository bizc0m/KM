# Reprise incrémentale NotePlan

Installation du 28 octobre 2026.

## Sélection

Le lecteur parcourt les métadonnées Calendar mais ouvre uniquement les notes dans la fenêtre dernier succès moins 24 heures, les anciennes notes modifiées dans cette fenêtre et les identifiants en attente. Les empreintes évitent de réanalyser une note déjà terminée. Sans marqueur fiable, un premier passage constitue la référence ; le manifeste évite ensuite de rouvrir les notes déjà terminées et inchangées même si des échecs empêchent encore d'avancer le marqueur global.

`noteplan-cursor.json` conserve le dernier scan entièrement traité et les notes en reprise. Le marqueur n'avance pas sur un traitement partiel. Il concerne l'ingestion NotePlan, pas une validation humaine du contenu ni une confirmation de publication GitHub. Le succès de publication est suivi séparément par le publisher.

## Retour vers NotePlan

Le retour utilise `writeback-cursor.json` : fenêtre d'un jour, métadonnées et empreinte des dépendances KM. Une ancienne note est réexaminée quand l'état de ses sources change. Les tâches entièrement traitées sont cochées avec `#km-fait`, sans lien KM ajouté. Les anciens liens générés sous ce marqueur sont retirés avec sauvegarde. Les sections techniques admissibles sont triées ; les contenus ambigus restent inchangés.

## Rapport utile et privé

Chaque modification est conservée dans `noteplan-writeback-history.jsonl`. Les créations et enrichissements futurs sont journalisés dans `fiche-events.jsonl` après écriture et indexation de la fiche. Le retour les consigne dans Notes/Rapports KM.md, par date et exécution, avec les noms et liens des fiches, les éléments cochés, les agendas triés et les sources à reprendre. Aucun contenu brut de note n'est publié. Les exécutions sans changement ni nouveau blocage n'ajoutent pas de doublon dans la note.

La note de rapport reste hors Calendar. Les titres permettent le pliage NotePlan ; l'état replié de l'interface n'est pas forcé par le script ni garanti synchronisé entre appareils.

## Robustesse

Sauvegardes privées, relecture avant écriture, contrôle après écriture, détection des conflits disque. Limite de trois secondes pour les principales lectures de fichier du retour, budget global de 90 secondes et délai de 120 secondes imposé par l'appelant. Un fichier bloqué n'autorise pas l'avancement du marqueur du retour. Les modifications non enregistrées dans l'éditeur NotePlan ne peuvent pas être verrouillées par ces contrôles disque.

La réconciliation globale des liens est retirée de chaque cycle automatique et reste disponible comme maintenance explicite. La chaîne existante sur le M2 reste planifiée à 02:30, 08:30, 14:30 et 20:30, heure locale. La publication filtrée GitHub reste assurée chaque heure par le Mac relais connecté au M2 ; cette dépendance demeure.

## Contrôle réel

Premier retour : 515 notes ouvertes pour constituer la référence, un ancien lien généré retiré, cinq attentes consignées. Passage suivant : 3 notes ouvertes, 512 non relues, aucun changement agenda. La collecte historique reste partielle tant que ses sources en reprise n'ont pas abouti.
