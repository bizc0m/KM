# OSIRIS — Open Source Intelligence Platform

**URL:** https://osirisai.live/
**Découvert:** 2026-05-25

## Description

Dashboard OSINT tout-en-un avec live tracking et data layers multiples :

**Aviation** — Vols commerciaux, privés, jets privés, militaires
**Maritime & Space** — Naval (49), Satellites
**Surveillance** — CCTV (3.428 caméras), Live News (25), SIGINT RSS (40)
**Natural Hazards** — Séismes (24h), feux actifs, météo sévère
**Threats & Infra** — Installations nucléaires, incidents globaux, GPS jamming
**Markets & Intel** — Indices, défense, énergie, commodities, crypto
**SIGINT Feed** — Fil d'actualités OSINT temps réel

## Régions préréglées
Global, Europe, Middle East, East Asia, Americas, Ukraine, Africa, SE Asia, Arctic, India, Australia, Sudan

## Format
Web app (SPA) — style "poste de commandement" avec carte interactive

## Utilité LA MEUTE
- ⚡ Surveillance temps réel (aviation, maritime, sigint)
- 🔥 Threat monitoring (incidents, nucléaire, jamming)
- 🌍 Coverage globale avec presets régionaux
- 📡 Complémentaire aux autres sources OSINT

## Tags

#`osint`-`surveillance`-`tracking`-`intelligence`-`realtime`-`cctv`-`aviation`-`sigint`

## Détails techniques (après investigation)

**GitHub:** https://github.com/simplifaisoul/osiris
**⭐ 3k stars · 593 forks · 102 commits · MIT License**
**Créateur:** simplifaisoul (soulsimplifai@gmail.com)
**Support:** Ko-Fi → https://ko-fi.com/osirisai (Goal $5k)
**Discord:** Oui, communauté active
**Deployment:** Vercel + Docker (image GHCR ~220MB)

## Tech Stack
- Next.js 16 (App Router, Turbopack, TypeScript 5)
- MapLibre GL JS (WebGL — rendu GPU)
- Framer Motion, Lucide React
- Multi-stage node:22-alpine Docker

## Sources de données
- **Aviation:** OpenSky Network
- **CCTV:** TfL, WSDOT, Caltrans, NYC DOT, VicRoads
- **Séismes:** USGS Earthquake API
- **Incendies:** NASA FIRMS
- **Météo:** NASA EONET
- **Espace:** NOAA SWPC, N2YO
- **Cyber:** NVD, scanner custom
- **News:** 25+ broadcasters (NBC, CBS, BBC, Al Jazeera, France 24, NHK...)

## Fonctionnalités intégrées (RECON Toolkit)
- Port Scanner (TCP connect + fingerprinting)
- DNS Lookup (A, AAAA, MX, NS, TXT, CNAME)
- WHOIS domain/IP
- SSL/TLS certificate inspector
- IP Intelligence (geo, ASN, threat reputation)
- Vulnerability Scanner (CVE lookup NVD)

## Notes
- Fonctionne sans API keys (publique, keyless pour les sources core)
- RECON scanner nécessite SCANNER_URL/SCANNER_KEY
- Dernier commit fait avec Gemini CLI
- Projet open source actif (issues/PRs récentes)
- PR #171 (Telegram OSINT feed) revertée — à investiguer

## Potentiel LA MEUTE
- Auto-hébergement possible (Docker)
- Intégration avec notre IRC/agents possible
- Source de contexte géopolitique temps réel
- Peut être forkée et customisée pour nos besoins
- Discord communautaire → veille et networking

## Metadata GitHub publique

Releve API GitHub : 2026-08-21

- repo : `simplifaisoul/osiris`
- URL : `https://github.com/simplifaisoul/osiris`
- description : Open Source Global Intelligence Platform - Real-Time OSINT Dashboard - A Palantir Alternative -                            2nZNHm3Lr9umG3DVrzYwHgktwkuKuJRXqqRqs3ewpump
- licence : MIT
- etoiles relevees : 7790
- topics releves : aucun topic public
- derniere activite relevee : 2026-08-21T03:39:30Z
- archived : non
- fork : non

Note : metadata volatile, a reverifier avant decision produit ou execution locale.
