# macUSB Bootable USB Creator macOS

## Type

Veille Raindrop KM Monitor / outil macOS.

## Tags

raindrop-km-monitor, macos, usb, bootable-media, recovery, actif

## Appel canonique

`watch:macusb-bootable-usb-creator-macos`

## Sources

- Raindrop KM Monitor : `https://arno-vltn.raindrop.page/km-monitor-71629567`
- Source finale : `https://www.macusb.app/`

Lecture KM : 2026-08-03

Source Raindrop :

- titre : `macUSB - The all-in-one USB creator for Mac`
- date : 2026-08-03T18:00:55.785Z
- domaine : `macusb.app`
- auteur/source : `arnaud-velten`
- tags detectes : aucun tag Raindrop
- note Raindrop : aucune

Resolution :

- URL canonique nettoyee : `https://www.macusb.app/`
- Verification HEAD directe : HTTP 200, serveur GitHub Pages, `last-modified` 2026-07-12.
- Signal secondaire `/feed` : `lastBuildDate` 2026-08-03 18:01:09 UTC.

## Resume court

Application macOS qui propose un flux guide pour creer des supports USB bootables, notamment pour installation, recovery ou scenarios de maintenance.

## Classification

`actif`

Raison : outil utilitaire macOS sans capacite offensive directe identifiee. Le risque vient surtout de la manipulation de supports bootables et de disques.

## Usage KM

- Suivre comme outil macOS potentiel pour creation de media USB bootables et workflows de recovery.
- Comparer l'ergonomie avec les outils natifs ou CLI pour installation et depannage.
- Verifier signature, distribution et modele de confiance avant usage sur poste principal.

## Risque d'abus possible

Creation de media bootables pouvant effacer un volume par erreur, installer une image non fiable ou servir de vecteur de persistence/boot externe si l'image source est malveillante.

## Points a controler

- Verifier la provenance de l'application et des images ISO/DMG utilisees.
- Tester sur support USB dedie avant usage production.
- Confirmer les permissions macOS, la signature de l'app et la politique de mise a jour.

## Garde-fous

- Ne pas stocker d'images disque, captures contenant volumes personnels, chemins locaux ou medias bootables dans le KM.
- Ne pas utiliser avec des images systeme non verifiees.

## Relations

- `watch:index`
- `watch:neodisk-macos-disk-visualizer`

## Changelog

### v0.1 - 2026-08-03

- Objectif : integrer la nouveaute Raindrop KM Monitor `macUSB`.
- Fichiers touches : `watch/macusb-bootable-usb-creator-macos.md`, `watch/index.md`, `index.md`, `km/history.md`.
- Risques : effacement de disque, media bootable non fiable, confiance dans un outil tiers.
- Rollback possible : supprimer cette fiche et retirer les lignes d'index.
