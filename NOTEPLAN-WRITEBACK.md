# Retour KM vers NotePlan

Installé le 26 octobre 2026 sur le M2, dans la chaîne technique existante.

- Calendar uniquement ; fichiers réguliers Markdown ou texte, archives et pièces jointes exclues. Aucun déplacement entre notes ou dates.
- Marquer uniquement une tâche ouverte `[ ]` dont chaque URL dispose d'un état KM `done` et de fiches existantes. Une exploration incomplète ou un enfant ouvert empêche le marquage du parent. Les associations globales note → fiches ne suffisent pas.
- Ajouter les liens des fiches et `#km-fait`. Les URLs du viewer KM ne sont pas réingérées par la collecte.
- Trier les sections techniques homogènes : `!!!`, `!!`, `!`, sans priorité, puis tâches principales faites. Une sous-tâche faite ne remonte pas la priorité du parent. Les enfants restent avec leur parent.
- Garder les sections contenant du texte indépendant à leur place ; les notes avec blocs de code ou contenu exclu restent inchangées. Les éléments sans URL ne sont pas cochés automatiquement, faute d'une association assez précise avec une tâche.
- Sauvegarde privée avant chaque écriture, double contrôle du contenu courant et relecture après remplacement atomique. Ce contrôle réduit les conflits disque ; il ne verrouille pas l'éditeur NotePlan ni ses modifications encore non enregistrées.
- Simulation : `node scripts/km-noteplan-writeback.mjs`. Application : ajouter `--apply`. Reconstruction : `npm run km:writeback:build`.
- Le wrapper exécute le retour avant et après la collecte. Pendant les longues collectes, un contrôle est effectué au prochain checkpoint, au plus une fois toutes les cinq minutes. Un échec du retour est signalé dans progress.json sans interrompre la collecte.
- Rapports privés : `~/Library/Application Support/KM/pipeline/noteplan-writeback*.json`. Sauvegardes : `~/Library/Application Support/KM/backups/noteplan-writeback-*`. Aucun contenu de note ni nom de fichier source dans les rapports publics.

Première application : 514 notes examinées, 5 notes modifiées, 1 tâche cochée, 0 conflit détecté. Simulation immédiatement suivante : 0 changement proposé. Ces compteurs ne signifient pas que tous les éléments historiquement associés à une fiche peuvent être cochés : les preuves insuffisantes restent ouvertes.
