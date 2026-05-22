# AI Tools

## MavKa Bot

URL : https://github.com/MozgAI/MavKa

Resume en 3 lignes :
MavKa est un bot IA personnel dans Telegram, auto-heberge sur ton ordinateur.
Il combine chat, voix, analyse d'images, recherche web, memoire persistante et agent de code local.
Il permet de choisir plusieurs fournisseurs IA comme DeepSeek, OpenAI, Claude, Kimi ou Groq.

Avantages principaux :
- Usage direct depuis Telegram.
- Installation rapide via script.
- Open source, licence MIT.
- Choix du fournisseur IA, donc moins de dependance a une seule plateforme.
- Cout potentiellement bas avec DeepSeek.
- Fonctions utiles : voix, vision, recherche web, memoire, actions sur fichiers locaux.

Reference future :
MavKa = assistant IA Telegram + terminal + memoire + multi-fournisseurs IA.

## Parallel Code

URL : https://github.com/johannesjo/parallel-code

Resume en 3 lignes :
Parallel Code permet de lancer plusieurs agents de code IA en parallele sur une meme base de code.
Il supporte Claude Code, Codex, Gemini et Copilot CLI.
Chaque agent travaille dans son propre git worktree pour comparer les resultats sans melanger les modifications.

Avantages principaux :
- Test rapide de plusieurs agents IA sur la meme tache.
- Isolation des changements avec git worktrees.
- Comparaison facile des solutions produites.
- Compatible avec plusieurs CLI IA populaires.
- Utile pour prototypage, refactor, correction de bug et benchmark d'agents.

Reference future :
Parallel Code = orchestration multi-agents IA + worktrees Git + comparaison de solutions.

## Claw Code

URL repo officiel : https://github.com/instructkr/claw-code
URL repo actuel : https://github.com/ultraworkers/claw-code
Site : https://claw-code.codes

Resume en 3 lignes :
Claw Code est un framework open source d'agent de code IA inspire de l'architecture Claude Code.
Le projet utilise principalement Rust, avec un CLI `claw` a compiler depuis les sources.
Il sert a tester, executer et structurer des workflows d'agent de code avec sessions, outils, permissions et MCP.

Avantages principaux :
- Open source et inspectable.
- Base Rust orientee performance.
- CLI local pour workflows d'agent de code.
- Documentation dediee : architecture, outils, commandes, memoire, permissions et MCP.
- Utile pour comprendre ou experimenter une architecture type Claude Code.

Reference future :
Claw Code = framework open source d'agent de code IA + CLI Rust + architecture type Claude Code.

## ClawBot Cloud

URL : https://cloud.clawbot.ai/?utm_source=clawcodes

Resume en 3 lignes :
ClawBot Cloud est une plateforme cloud pour deployer un agent OpenClaw sans maintenance locale.
L'agent est annonce comme disponible 24/7 et accessible depuis des plateformes de chat.
Le site propose un assistant de configuration avec choix automatique du modele, connexion d'un canal et deploiement.

Avantages principaux :
- Pas d'installation locale lourde.
- Agent cloud toujours en ligne.
- Configuration guidee en 3 etapes.
- Modeles integres : Claude, GPT, Gemini, Grok, Kimi, Qwen et autres.
- Utile pour tester OpenClaw rapidement sans gerer serveur, uptime ou maintenance.

Reference future :
ClawBot Cloud = version hebergee d'agent OpenClaw + 24/7 + zero maintenance locale.

## RTK - Rust Token Killer

URL site : https://www.rtk-ai.app/
URL repo : https://github.com/rtk-ai/rtk

Resume en 3 lignes :
RTK est un outil CLI open source en Rust qui compresse les sorties de commandes avant qu'elles entrent dans le contexte d'un agent IA.
Il reduit le bruit des commandes comme git status, git diff, grep, find, ls, pytest, cargo test ou npm test.
Il fonctionne avec Claude Code, Cursor, Aider, Gemini CLI, OpenAI Codex, Cline, Windsurf et GitHub Copilot.

Avantages principaux :
- Reduit fortement les tokens inutiles dans les sessions de coding IA.
- Ameliore la qualite du contexte donne au modele.
- Allonge les sessions avant saturation du contexte.
- Peut reduire les couts API sur les workflows tres CLI.
- Open source, MIT, local-first, sans compte ni cle API.
- Installation simple via Homebrew, script curl, Cargo ou binaires precompiles.

Reference future :
RTK = compresseur de sorties terminal pour agents IA + economie de tokens + meilleur contexte.

## CloakBrowser

URL : https://github.com/CloakHQ/CloakBrowser

Resume en 3 lignes :
CloakBrowser est un Chromium modifie au niveau source pour automatisation web stealth.
Il se presente comme remplacement Playwright/Puppeteer avec API proche et binaires auto-telecharges.
Il vise les tests d'automatisation, fingerprinting, profils persistants et compatibilite agents IA/browser automation.

Avantages principaux :
- Remplacement rapide de Playwright/Puppeteer.
- Patches Chromium source-level, pas seulement injection JS.
- Support Python et JavaScript.
- Profils persistants, proxy, timezone/locale.
- Utile pour tests anti-bot defensifs et QA d'automatisation, a utiliser legalement.

Reference future :
CloakBrowser = Chromium stealth + Playwright/Puppeteer drop-in + tests anti-detection.

## AiToEarn

URL : https://github.com/yikart/AiToEarn

Resume en 3 lignes :
AiToEarn est une collection de ressources autour de l'usage de l'IA pour creer des revenus.
Le repo sert surtout de repertoire d'idees, outils, workflows et opportunites IA.
Il est utile comme veille business IA plus que comme outil technique unique.

Avantages principaux :
- Source d'inspiration pour monetisation IA.
- Liste centralisee d'idees et ressources.
- Utile pour veille marche et brainstorming.
- Bon point de depart pour trouver des niches IA.
- A verifier au cas par cas avant investissement de temps ou argent.

Reference future :
AiToEarn = repertoire d'idees pour gagner avec l'IA + veille opportunites.

## agentmemory

URL : https://github.com/rohitg00/agentmemory

Resume en 3 lignes :
agentmemory fournit une memoire persistante pour agents de code IA.
L'objectif est de conserver contexte, decisions et preferences entre sessions.
Le projet cible les agents coding et se base sur des benchmarks d'usage reel.

Avantages principaux :
- Memoire persistante entre sessions.
- Meilleure continuite pour agents de code.
- Peut reduire les repetitions de contexte.
- Utile pour grands projets ou travail long.
- Oriente benchmarks et comparaison pratique.

Reference future :
agentmemory = memoire persistante pour agents coding + contexte long terme.

## UI-TARS Desktop

URL : https://github.com/bytedance/UI-TARS-desktop

Resume en 3 lignes :
UI-TARS Desktop est une stack open source d'agent IA multimodal pour ordinateur.
Elle relie modeles IA, perception d'interface et infrastructure agent pour agir sur des UI.
Le projet vise les workflows desktop ou l'agent observe, raisonne et interagit avec l'ecran.

Avantages principaux :
- Agent multimodal open source.
- Oriente controle d'interface graphique.
- Utile pour automatisation desktop.
- Base ByteDance, avec ambition stack complete.
- Bon candidat pour experimenter agents visuels.

Reference future :
UI-TARS Desktop = agent multimodal desktop + vision UI + automatisation ecran.

## 9Router

URL : https://github.com/decolua/9router

Resume en 3 lignes :
9Router est un routeur local/API pour connecter outils de coding IA a de nombreux fournisseurs et modeles.
Il supporte Claude Code, Codex, Cursor, Cline, Copilot, OpenClaw et autres via endpoint compatible.
Il ajoute fallback automatique, suivi de quotas et economie de tokens via RTK.

Avantages principaux :
- Centralise plusieurs fournisseurs IA.
- Fallback automatique si quota ou limite.
- Compatible avec beaucoup de CLI coding.
- Economie de tokens avec RTK.
- Dashboard local et endpoint OpenAI-compatible.

Reference future :
9Router = routeur IA multi-fournisseurs + fallback + economie tokens pour coding agents.

## DeepSeek-TUI

URL : https://github.com/Hmbown/DeepSeek-TUI

Resume en 3 lignes :
DeepSeek-TUI est un agent de code en terminal pour les modeles DeepSeek.
Il propose une interface TUI pour travailler dans le shell avec assistance IA.
Il est utile pour coding agent leger, local dans le terminal, centre sur DeepSeek.

Avantages principaux :
- Interface terminal simple.
- Oriente modeles DeepSeek.
- Utile pour coding agent sans IDE lourd.
- Bon pour workflows shell.
- Alternative specialisee aux gros assistants de code.

Reference future :
DeepSeek-TUI = agent coding terminal + DeepSeek + interface TUI.

## AI-Trader

URL : https://github.com/HKUDS/AI-Trader

Resume en 3 lignes :
AI-Trader est un projet de recherche/outil autour du trading automatise par agents IA.
Il vise des workflows agent-native pour analyse, decision et execution de trading.
Usage a traiter comme experimental et risque, pas comme conseil financier.

Avantages principaux :
- Exemple d'architecture agentique appliquee au trading.
- Utile pour recherche, backtesting et experimentation.
- Montre comment structurer decisions et actions de marche.
- Peut inspirer des agents financiers internes.
- Attention forte : risque financier, validation et conformite obligatoires.

Reference future :
AI-Trader = agent IA de trading automatise + recherche + risque eleve.

## Skills by Matt Pocock

URL : https://github.com/mattpocock/skills

Resume en 3 lignes :
Ce repo contient des skills pratiques pour ingenieurs, issus d'une configuration Claude.
Il sert de bibliotheque de procedures et prompts reutilisables pour developpement logiciel.
Il est utile pour standardiser la maniere dont un agent IA execute certaines taches techniques.

Avantages principaux :
- Skills prets a adapter.
- Oriente pratiques d'ingenierie reelles.
- Bon modele pour creer ses propres skills.
- Ameliore coherence des workflows agents.
- Utile avec Claude Code et autres agents compatibles skills.

Reference future :
Skills = bibliotheque de workflows/prompts techniques pour agents IA.

## SuperSplat

URL : https://github.com/playcanvas/supersplat
Demo : https://superspl.at/editor

Resume en 3 lignes :
SuperSplat est un editeur open source de 3D Gaussian Splats.
Il permet d'inspecter, editer, optimiser et publier des scenes 3D splat dans le navigateur.
Il est construit avec des technologies web et peut etre utilise sans installation via la demo.

Avantages principaux :
- Editeur 3DGS gratuit et open source.
- Fonctionne dans le navigateur.
- Utile pour visualisation, nettoyage et optimisation de splats.
- Base PlayCanvas, WebGL/WebGPU.
- Bon outil pour pipelines IA 3D, scan, photogrammetrie et scenes immersives.

Reference future :
SuperSplat = editeur web 3D Gaussian Splat + optimisation + publication.

## Hysteria

URL : https://github.com/apernet/hysteria

Resume en 3 lignes :
Hysteria est un proxy rapide et resistant a la censure.
Le projet vise les connexions reseau performantes dans des environnements contraints.
Il peut servir d'infrastructure proxy pour developpement, reseau ou acces distant legitime.

Avantages principaux :
- Proxy performant.
- Oriente resistance aux restrictions reseau.
- Projet mature et tres suivi.
- Utile pour infrastructure, tests reseau et acces distant.
- A utiliser selon les lois et politiques reseau applicables.

Reference future :
Hysteria = proxy rapide + resistance censure + infrastructure reseau.

## GitHub Spec Kit

URL : https://github.com/github/spec-kit
Source : https://x.com/nicos_ai/status/2056478886280753455

Resume en 3 lignes :
Spec Kit est un toolkit open source de GitHub pour faire du spec-driven development avec des agents IA.
Il force l'agent a produire une specification, clarifier les manques, planifier et decouper les taches avant de coder.
Il s'integre a des agents comme Claude Code, Codex, Cursor, Copilot, Gemini CLI et autres.

Avantages principaux :
- Reduit le vibe coding vague.
- Structure le flux : constitution, specification, clarification, plan, tasks, implementation.
- Ameliore la previsibilite des agents de code.
- Compatible avec plusieurs outils IA.
- Utile pour projets complexes ou multi-agents.

Reference future :
Spec Kit = workflow spec-first pour agents IA + planification avant code.

## agency-agents

URL : https://github.com/msitarzewski/agency-agents
Source : https://x.com/NFTCPS/status/2056188353490595903

Resume en 3 lignes :
agency-agents est une bibliotheque de roles d'agents IA specialises.
Elle contient des personas et processus pour des profils comme CEO, avocat, developpeur, growth hacker ou experts metier.
Les roles peuvent etre utilises dans Claude Code, Cursor ou d'autres agents pour simuler une equipe virtuelle.

Avantages principaux :
- Grande collection de roles prets a reutiliser.
- Utile pour brainstorming, revue, strategie et execution.
- Transforme un agent generaliste en conseiller specialise.
- Peut servir de base pour composer une equipe multi-agents.
- Format simple a adapter.

Reference future :
agency-agents = bibliotheque de personas experts pour agents IA.

## Streambert

URL : https://github.com/truelockmc/streambert
Source : https://x.com/sukh_saroy/status/2056368727684452809

Resume en 3 lignes :
Streambert est une application desktop Electron pour chercher, streamer et telecharger films, series et anime.
Elle utilise TMDB pour les metadonnees, AniList pour l'anime et des sources tierces pour les contenus.
Le projet est open source GPL-3.0, mais son usage depend fortement du cadre legal local.

Avantages principaux :
- Application desktop cross-platform.
- Interface unique pour films, series et anime.
- Telechargements multithread, sous-titres et suivi de bibliotheque.
- Zero publicite et zero tracking selon le projet.
- Attention : risque legal eleve selon les sources de contenu utilisees.

Reference future :
Streambert = app desktop media streaming/download + sources tierces + verifier legalite.

## freeLLMAPI

URL : https://github.com/tashfeenahmed/freellmapi
Source : https://x.com/david_attisaas/status/2056343039183147440

Resume en 3 lignes :
freeLLMAPI est un projet GitHub partage comme API gratuite pour modeles LLM.
La promesse est de simplifier l'acces a des modeles sans configuration lourde.
La valeur exacte depend du README, des limites et de la stabilite du service.

Avantages principaux :
- Point d'entree rapide pour tester des appels LLM.
- Utile pour prototypes et experimentation.
- Peut reduire la friction d'integration.
- A verifier : limites, couts caches, securite et disponibilite.
- Ne pas utiliser en production sans audit.

Reference future :
freeLLMAPI = API LLM gratuite pour tests rapides, a verifier avant usage serieux.

## OpenWA

URL : https://github.com/rmyndharis/OpenWA
Source : https://x.com/_guillecasaus/status/2056316078888820874

Resume en 3 lignes :
OpenWA est une passerelle WhatsApp API open source et self-hosted.
Elle vise messages, multimedia, webhooks, multi-compte et dashboard de gestion.
Elle sert d'alternative controlee aux plateformes WhatsApp/API payantes ou verrouillees.

Avantages principaux :
- Self-hosted, moins de vendor lock-in.
- API pour messages, medias et webhooks.
- Dashboard pour sessions et cles API.
- Potentiel multi-compte.
- A verifier contre les conditions WhatsApp avant usage commercial.

Reference future :
OpenWA = API WhatsApp self-hosted + webhooks + dashboard.

## yt-dlp

URL : https://github.com/yt-dlp/yt-dlp
Source : https://x.com/HowToAI_/status/2056497305780457685

Resume en 3 lignes :
yt-dlp est un CLI open source pour telecharger videos, audio, sous-titres et metadonnees depuis de nombreuses plateformes.
C'est un fork actif de youtube-dl avec support et correctifs frequents.
Il sert aux usages d'archivage, extraction media et workflows automatises.

Avantages principaux :
- Support tres large de sites.
- CLI scriptable et robuste.
- Gestion formats, playlists, sous-titres et metadonnees.
- Utile pour workflows data/video et archivage legitime.
- Attention aux droits d'auteur et conditions des plateformes.

Reference future :
yt-dlp = CLI media download/archivage + formats + sous-titres.

## OpenCut

URL repo : https://github.com/opencut-app/opencut
URL site : https://opencut.io/
Source : https://x.com/KanikaBK/status/2056412075434659960

Resume en 3 lignes :
OpenCut est un editeur video open source presente comme alternative a CapCut.
Il vise le montage sans watermark, sans abonnement et avec meilleure confidentialite.
Le projet cible web, desktop et mobile selon la documentation du repo.

Avantages principaux :
- Gratuit et open source.
- Pas de watermark annonce.
- Alternative a CapCut.
- Orientation privacy-first.
- Utile pour createurs qui veulent eviter abonnements et tracking.

Reference future :
OpenCut = editeur video open source type CapCut + sans watermark.

## OSINT Cabal Live Center

URL : https://osintcabal.org/livecenter/
Source : https://x.com/cyb_detective/status/2056325264246706649

Resume en 3 lignes :
OSINT Cabal Live Center regroupe des versions web de plusieurs outils OSINT en ligne.
Il reference des outils comme Ghunt, Holehe, BlackBird et autres.
Il sert a lancer rapidement des recherches OSINT sans installer chaque CLI localement.

Avantages principaux :
- Acces web a plusieurs outils OSINT.
- Gain de temps pour investigations rapides.
- Utile pour SOCMINT, reconnaissance et verification.
- Evite une partie de l'installation locale.
- A utiliser legalement et avec prudence sur les donnees personnelles.

Reference future :
OSINT Cabal Live Center = hub web d'outils OSINT.

## MoneyPrinter

URL : https://github.com/FujiwaraChoki/MoneyPrinter
Source : https://x.com/tom_doerr/status/2056509860162756860

Resume en 3 lignes :
MoneyPrinter automatise la creation de YouTube Shorts a partir de sujets video.
Le projet utilise MoviePy pour generer des videos courtes.
Il sert de base pour pipelines de contenu automatise.

Avantages principaux :
- Automatise une partie de la production Shorts.
- Utile pour prototypage de chaines video.
- Base Python/film generation scriptable.
- Peut servir de demo de pipeline contenu IA.
- Attention : qualite, droits media et spam platform policy.

Reference future :
MoneyPrinter = generation automatisee de YouTube Shorts.

## free-claude-code

URL : https://github.com/Alishahryar1/free-claude-code
Source : https://x.com/dr_cintas/status/2056077614113325373

Resume en 3 lignes :
free-claude-code est un proxy Anthropic-compatible pour utiliser Claude Code avec d'autres providers.
Il route les appels Claude Code vers NVIDIA NIM, Kimi, OpenRouter, DeepSeek, LM Studio, llama.cpp, Ollama et autres.
Il garde le client Claude Code tout en changeant le backend modele.

Avantages principaux :
- Proxy drop-in pour Claude Code.
- Plusieurs backends gratuits, locaux ou payants.
- Streaming, tool use et model routing.
- Admin UI locale.
- Utile pour reduire couts ou tester des modeles alternatifs.

Reference future :
free-claude-code = proxy Claude Code vers NVIDIA NIM/local/OpenRouter/autres.

## Open-Generative-AI

URL : https://github.com/Anil-matcha/Open-Generative-AI
Source : https://x.com/InduTripat82427/status/2056408789327462486

Resume en 3 lignes :
Open-Generative-AI est un studio open source pour generation image et video.
Il se presente comme alternative a Higgsfield, Freepik AI, Krea AI et OpenArt, avec acces a de nombreux modeles.
Il vise des workflows creatifs avec Flux, Kling, Sora, Veo et modeles similaires selon le projet.

Avantages principaux :
- Studio image/video open source.
- Nombreux modeles regroupes.
- Utile pour experimentation creative.
- Peut s'integrer a des workflows Claude Code/Codex via skills.
- A verifier : dependances externes, couts API et droits d'usage des modeles.

Reference future :
Open-Generative-AI = studio open source image/video multi-modeles.

## Superpowers

URL : https://github.com/obra/superpowers
Source : https://x.com/arceyul/status/2056108436224430139

Resume en 3 lignes :
Superpowers est un framework de skills et methodologie pour agents de code.
Il impose brainstorming, specification, plan, TDD, subagents, review et finalisation.
Il fonctionne avec Claude Code, Codex, Cursor, Gemini CLI, OpenCode, Copilot CLI et autres.

Avantages principaux :
- Discipline les agents avec un processus senior.
- Met l'accent sur TDD red/green.
- Supporte subagents et git worktrees.
- Compatible multi-agents/outils.
- Utile pour reduire hallucinations, code mort et derive de contexte.

Reference future :
Superpowers = skills + workflow TDD pour agents coding.

## ViMax

URL : https://github.com/HKUDS/ViMax
Source : https://x.com/NFTCPS/status/2056190651939848534

Resume en 3 lignes :
ViMax est un systeme multi-agent pour generation video a partir d'idee, script ou roman.
Le projet vise coordination de roles comme realisateur, scenariste et producteur.
Il cherche a produire des videos avec narration, personnages et scenes coherentes.

Avantages principaux :
- Workflow video multi-agent.
- Utile pour prototypage de films courts ou scenes narratives.
- Peut transformer texte long en pipeline video.
- Projet de recherche/creation a surveiller.
- A verifier : qualite reelle, couts modeles et licences media.

Reference future :
ViMax = multi-agent video generation depuis idee/script/roman.

## J.A.R.V.I.S

URL : https://github.com/GauravSingh9356/J.A.R.V.I.S
Source : https://x.com/tom_doerr/status/2056514018135642189

Resume en 3 lignes :
J.A.R.V.I.S est un assistant personnel Python avec OCR et controle vocal.
Il peut ouvrir des sites, rechercher, lire des informations, gerer des taches et utiliser des APIs.
Le projet sert de base d'assistant desktop/terminal extensible.

Avantages principaux :
- Assistant Python facile a inspecter.
- OCR et commandes vocales.
- Automatisation web et recherche.
- Bon exemple pedagogique d'assistant personnel.
- A moderniser avant usage production.

Reference future :
J.A.R.V.I.S = assistant Python vocal + OCR + automatisation web.

## Open Design

URL : https://github.com/nexu-io/open-design
Source : https://x.com/tuturetom/status/2056258502050357334

Resume en 3 lignes :
Open Design est une alternative open source orientee Claude Design.
Le projet integre des templates, skills et design systems pour generer des interfaces par prompt.
Il vise la creation rapide de designs et prototypes web.

Avantages principaux :
- Templates et design systems prets a l'emploi.
- Workflow design par prompt.
- Open source.
- Utile pour prototypage UI rapide.
- Bon candidat pour agents frontend/design.

Reference future :
Open Design = alternative open source Claude Design + templates + skills UI.

## ip.guide

URL : https://ip.guide
Source : https://x.com/midudev/status/2056030422778196039

Resume en 3 lignes :
ip.guide est une API gratuite pour obtenir la localisation d'une adresse IP.
Elle est presentee comme illimitee et sans logs par le post source.
Elle fonctionne depuis JavaScript, Python, PHP ou tout langage capable d'appeler une API HTTP.

Avantages principaux :
- API simple pour geolocalisation IP.
- Pas de SDK obligatoire.
- Utile pour prototypes, enrichissement logs et outils reseau.
- A verifier : limites, precision, politique de logs et conditions.
- Ne pas utiliser pour decisions sensibles sans validation.

Reference future :
ip.guide = API geolocalisation IP gratuite/simple.

## Postiz

URL repo : https://github.com/gitroomhq/postiz-app
URL site : https://postiz.com

Resume en 3 lignes :
Postiz est un outil open source de planification et gestion social media avec fonctions IA.
Il permet de programmer des posts, collaborer en equipe, analyser le travail et automatiser via API.
Il supporte de nombreuses plateformes comme X, LinkedIn, TikTok, Facebook, Reddit, Bluesky, Mastodon, Slack et Discord.

Avantages principaux :
- Alternative open source a Buffer, Hypefury ou Twitter Hunter.
- Version self-hosted disponible.
- API publique, SDK Node, node n8n et integration Make.com.
- Adapté aux workflows d'agents et automatisations.
- Licence AGPL-3.0, donc verifier les obligations si usage commercial.

Reference future :
Postiz = social media scheduler open source + IA + API + self-hosted.

## GrowChief

URL repo : https://github.com/growchief/growchief
URL site : https://growchief.com

Resume en 3 lignes :
GrowChief est un outil open source d'automatisation social media oriente outreach.
Il permet de creer des workflows pour interagir avec des comptes sociaux : demandes de connexion, follow-up messages, etc.
Il est pense pour s'integrer a n8n, Make, Zapier et autres workflows API.

Avantages principaux :
- Alternative open source a Phantombuster, Expandi, Zopto, LinkedIn Helper ou Meet Alfred.
- Oriente prospection et outreach.
- Compatible API et automatisations no-code.
- Peut servir de brique growth automation.
- Attention : respecter les limites plateformes et eviter le spam.

Reference future :
GrowChief = social outreach automation open source + workflows + n8n/API.

## Social-Media-Automation

URL : https://github.com/vasani-arpit/Social-Media-Automation

Resume en 3 lignes :
Social-Media-Automation est un projet pour automatiser l'activite sur plusieurs reseaux sociaux.
L'objectif est de rester actif sur plusieurs plateformes sans actions manuelles permanentes.
Le repo semble plus ancien/experimental que Postiz ou GrowChief, donc a traiter comme reference technique.

Avantages principaux :
- Exemple simple d'automatisation multi-reseaux.
- Utile pour comprendre les patterns de scripts social media.
- Peut inspirer des workflows personnels.
- Moins adapte comme base production sans audit.
- Attention aux conditions d'utilisation des plateformes.

Reference future :
Social-Media-Automation = scripts/reference d'automatisation social media, a auditer avant usage.

## Lot X - AI Open Source Tools Watch

Source KM : `###DEV/KM/watch/ai-open-source-tools-watch.md`
Sources X : lot fourni le 2026-05-22

Resume en 3 lignes :
Lot de veille sur outils IA/open source : alternatives SaaS, agents vocaux, video IA, RAG local, MCP, OSINT image et devtools.
Le lot contient 10 liens fournis, dont 9 uniques apres deduplication.
Les outils sont a verifier avant integration, surtout finance, OSINT et redirection de trafic IA.

Outils et themes reperes :
- Pipecat : framework Python pour agents vocaux temps reel.
- ARGO : alternative locale/open source a Manus, avec RAG, Ollama et MCP.
- ViMax : generation de courts films depuis idee, prompt ou texte long.
- Spacesuit : canvas/adaptive workspace multiplateforme.
- Cal.com, Plausible, Ghost, n8n, Supabase, Medusa, AppFlowy, Coolify, Listmonk : alternatives open source monetisables.
- OpenScreen, Voicebox, OpenShorts, FreeLLMAPI, Playwright MCP, Vibe-Trading, Cal.com, Whisper, Postiz, Vaultwarden : alternatives SaaS citees dans le lot.
- Image OSINT tools : utile mais sensible, usage strictement privacy-first.
- Redirection Claude Code vers fournisseurs gratuits : a verifier pour securite, legalite, conditions d'usage et secrets.

Reference future :
Lot X = watch IA open source/devtools, a convertir en fiches individuelles apres verification des repos.

## NanoClaw

URL site : https://nanoclaw.dev/
URL repo : https://github.com/nanocoai/nanoclaw
Source KM : `watch:nanoclaw-personal-agent`

Resume en 3 lignes :
NanoClaw est un agent IA personnel open source, leger, containerise et multi-canaux.
Il connecte des agents a WhatsApp, Telegram, Slack, Discord, Teams, Matrix, GitHub, Linear, email et autres canaux.
Il met en avant l'isolation par conteneur, les skills installables et un vault de credentials pour eviter les secrets en clair dans l'agent.

Avantages principaux :
- Architecture simple et auditable : host Node, conteneurs par agent group, SQLite par session.
- Fit fort pour bots de transmission, briefings, jobs planifies et assistants personnels.
- Compatible logique privacy-first si chaque canal est opt-in.
- Licence MIT, repo actif, forte traction GitHub.
- Sensible : messagerie automatisee, credentials, prompts et donnees personnelles.

Reference future :
NanoClaw = agent personnel message-first + containers + skills + credential vault.

## AutoResearchClaw

URL repo : https://github.com/aiming-lab/AutoResearchClaw
Source KM : `watch:autoresearchclaw-autonomous-research`

Resume en 3 lignes :
AutoResearchClaw est un agent de recherche autonome qui transforme une idee en papier academique.
Il combine recherche bibliographique, generation d'experiences, analyse, citations, LaTeX, revue multi-agent et modes human-in-the-loop.
Il est utile comme reference d'architecture agentique longue, mais sensible car il peut produire des claims scientifiques qui doivent etre verifies.

Avantages principaux :
- Pipeline idee -> papier avec artifacts, citations et experiences.
- Modes full-auto et co-pilot / human-in-the-loop.
- Mecanismes annonces de verification de citations, revue multi-agent et anti-fabrication.
- Compatible OpenClaw et agents CLI.
- Sensible : publication non verifiee, couts API, execution d'experiences et confiance excessive dans les outputs.

Reference future :
AutoResearchClaw = agent de recherche autonome + HITL + verification claims/citations + outputs academiques.

## Awesome Free LLM APIs

URL repo : https://github.com/mnfst/awesome-free-llm-apis
Source KM : `watch:awesome-free-llm-apis`

Resume en 3 lignes :
Awesome Free LLM APIs liste des providers LLM avec tiers gratuits permanents ou credits gratuits.
La source documente notamment des endpoints OpenAI-compatible, pages de cles API, limites, contextes et conditions par provider.
Elle complete `watch:free-llm-api-resources` mais doit etre verifiee provider par provider avant usage.

Avantages principaux :
- Utile pour prototypage LLM, tests de routage et comparaison de providers.
- Donne des bases URL et contraintes visibles rapidement.
- Licence CC0-1.0, repo actif.
- Sensible : cles API, quotas, conditions d'usage, region, politique data.
- Pas `#ROUGE` par defaut ; `#ROUGE` seulement si abus de quotas, contournement ou providers non legitimes.

Reference future :
Awesome Free LLM APIs = annuaire providers LLM free tier + endpoints OpenAI-compatible + limites a verifier.
