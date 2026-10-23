# Publication KM

Le M2 collecte et analyse les sources. Le Mac de publication récupère uniquement le KM_INDEX filtré du viewer M2 par SSH, puis applique de nouveau le filtre public, dédoublonne les dépôts identifiés et reconstruit le site dans un checkout isolé.

Commande : `node scripts/km-publish-m2.mjs`.

La tâche locale `com.bizc0m.km-public-publisher` s'exécute chaque heure et au chargement. Elle nécessite ce Mac connecté, un accès SSH au M2 et l'authentification GitHub déjà configurée. Le M2 seul ne pousse pas GitHub : son Git système est actuellement bloqué par la licence Xcode. Aucun accord de licence n'est accepté automatiquement.

État : `~/Library/Application Support/KM/public-publisher/status.json`. Une erreur bloque la publication ; elle n'est pas annoncée comme réussie. Le checkout doit rester propre ; en cas d'échec après import, examiner ses changements avant relance.

Les caches NotePlan, journaux et données brutes ne sont jamais ajoutés à Git. L'index machine `public/index.json` omet les corps et traces. `public/catalog/index.html` et `index.md` donnent accès aux sujets et sous-sujets contenant des fiches. Les références existantes restent disponibles.

Le bouton « Copier le prompt KM » inclut les URL publiques des index et la vue filtrée courante, sans démarrer de modèle ni installer de dépendance.

Export du 23 octobre : 676 entrées M2 ; 661 acceptées par le filtre d'import ; 660 retenues par le générateur ; 658 après fusion de deux doublons confirmés avec sauvegarde et redirections. Ces chiffres ne sont pas une validation sémantique exhaustive.

Vérification navigateur : six rendus (toutes les fiches, agent, pdf, Whisper, aucun résultat, toutes) entre 10,5 et 30,6 ms sur le navigateur de contrôle. Cette mesure instrumente renderAll uniquement, pas le chargement réseau ni tous les appareils.
