# Purge 2026-09-09

Backup complet avant purge:

- `/private/tmp/km-before-purge-2026-09-09.tgz`

## Gardes

- `search-v1.12.html` conserve comme derniere version stable v1.
- `search-v2.html` conserve comme version active.
- Les logs dates suivis par Git restent en place.

## Deplaces

### Vieux dashboards

- `search-v1.3.html` a `search-v1.11.html` vers `html/`

### Fiches sorties de la consultation active

- `watch/demoforge-scene.md` vers `removed-watch/`
- `watch/acaban-de-darle-memoria-infinita-a-claude-codex-y-cursor.md` vers `duplicates/`
- `resources/pacte-visia/readme.md` vers `duplicates/pacte-visia-readme.md`

### Temporaires

- `logs/km-local-app.log` vers `logs/`

## Notes

- La source du doublon Infinite Memory archive a ete ajoutee dans la fiche conservee:
  `watch/ahora-puedes-darle-memoria-infinita-a-claude-codex-y-cursor.md`
- Aucun `git reset`, `git clean`, `pull`, `merge`, `rebase` ou `push` pendant cette purge.
