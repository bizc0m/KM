# Sources configurables

La configuration active est `/Users/JOB/#DEV/06-km/KM/sources.md` sur le M2. Le service la relit au début de chaque cycle de 08:00 et 12:00. La page http://127.0.0.1:8766/sources édite exactement ce fichier via le tunnel SSH local vers le M2. L'ancienne documentation de migration est conservée dans sources-historique.md.

Une section `## Nom unique` par source. Champs : Type (RSS, Raindrop, NotePlan), Actif (oui/non), URL pour RSS/Raindrop, Périmètre : Calendar pour NotePlan, Thèmes indicatifs facultatifs. Les exemples en commentaires HTML sont ignorés. Les thèmes ne forcent pas le classement et ne contournent pas le filtre technique.

La page permet d'ajouter un flux au Markdown, de tester RSS ou Atom sans l'activer et d'enregistrer. Une source est suspendue par Actif : non, supprimée en retirant sa section. Les modifications directes du fichier sur le M2 sont prises en compte au même titre que la page. La copie du dépôt sur un autre Mac n'est pas la configuration active du M2 ; ne pas l'écraser lors des déploiements.

Les doublons, champs inconnus, types non pris en charge, adresses locales, identifiants et jetons dans les URL sont refusés. Le téléchargement contrôle aussi la résolution DNS et les redirections. Les enregistrements ont une sauvegarde privée et une version de contrôle ; l'API locale refuse les écritures depuis une autre origine.

La collecte RSS utilise les liens des articles, pas le texte du flux comme preuve suffisante pour créer une fiche. Les pages suivent ensuite le traitement technique habituel, le dédoublonnage et les limites d'exploration existantes. Les erreurs d'un flux sont conservées dans source-status.json et n'empêchent pas la lecture des autres flux. Aucun nouveau flux d'exemple n'est activé.

Le serveur reste lié à 127.0.0.1. Le tunnel local `com.bizc0m.km-dashboard-tunnel` permet d'ouvrir la page sur ce Mac et se reconnecte après une interruption. L'interface de modification ne fonctionne pas sur GitHub Pages ; le bouton Sources y reste masqué. Les compteurs par source sont alimentés aux prochains cycles ; le test du flux est immédiat.
