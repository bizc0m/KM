# 🧠 Knowledge Management - Claude Notes

**Base de connaissances personnelle | Mise à jour: 2026-05-17**

---

## 📑 INDEX RAPIDE

- [🔧 Tech Stack](#tech-stack)
- [🚀 Projets](#projets)
- [💡 Patterns & Solutions](#patterns--solutions)
- [⚡ Quick Refs](#quick-refs)
- [📚 Resources](#resources)

---

## 🔧 TECH STACK

### Environnement
- **OS:** macOS Sonnet (Darwin 25.3.0)
- **Shell:** zsh
- **Claude Code:** Haiku 4.5
- **Workspace:** `/Users/JOB/###DEV/Claude`

### Outils Installés
- **Agents:** 179 agents (agency-agents repo)
- **Optimizer:** optimizer-prompt.md (token optimization)
- **Projects:** night-intel (Cloudflare Workers + Supabase)

### Stack par Projet
- **night-intel:** Hono + Cloudflare Workers + Supabase + Upstash Redis

---

## 🚀 PROJETS

### night-intel (Parrall/Test)
```
Type: Crowdsourced nightlife intelligence platform
Stack: Cloudflare Workers + Hono + TypeScript
DB: Supabase
Cache: Upstash Redis

Scripts:
- npm run dev:workers      → Dev workers locally
- npm run dev:frontend     → Dev frontend
- npm run deploy           → Build + deploy

Status: [En cours]
```

### Claude Projects
- **Claude Code:** Main workspace
- **#agents/:** 179 agent files organized by category
- **KM/:** Knowledge management (ce fichier!)

---

## 💡 PATTERNS & SOLUTIONS

### Token Optimization
**File:** `optimizer-prompt.md`
- Zero questions inutiles
- Réponses ultra-courtes (1-2 phrases)
- Code hyper-optimisé (no comments sauf si crucial)
- Auto-mode ON (décisions sans demander)

### Alias & Shortcuts
```bash
claude                    # Alias → cd /Users/JOB/###DEV/Claude && claude
claude-dev              # Launch with agents
agents-list             # List all 179 agents
agents-find "keyword"   # Quick search
agent category/name     # Load specific agent
```

### Directory Structure
```
/Users/JOB/###DEV/Claude/
├── #agents/          (179 agents organized by category)
├── KM/              (Knowledge management)
├── CLAUDE.md        (Project instructions)
├── optimizer-prompt.md
└── agents-loader.sh
```

---

## ⚡ QUICK REFS

### Commands
```bash
# Working directory (permanent alias)
claude          # cd to /Users/JOB/###DEV/Claude

# Git
git status
git add .
git commit -m "message"

# Agents
agents-list
agents-find "backend"

# Node/npm (for night-intel)
npm run dev:workers
npm run build:workers
npm run deploy
```

### File Locations
- **Agents:** `/Users/JOB/###DEV/Claude/#agents/`
- **Optimizer:** `/Users/JOB/###DEV/Claude/optimizer-prompt.md`
- **Projects:** `/Users/JOB/###DEV/Parrall/Test/`

---

## 📚 RESOURCES

### External Repos
- **agency-agents:** https://github.com/msitarzewski/agency-agents
  - 179 agents across 18 categories
  - Updated: May 16, 2026

### Internal Configs
- **Settings:** `~/.claude/settings.json`
- **Aliases:** `~/.zshrc` (claude, claude-dev, agents-*)
- **Project Settings:** `/Users/JOB/###DEV/Claude/.claude/settings.json`

---

## 📝 NOTES SECTION

### Session Notes - [2026-05-17]
- ✅ Configured default working directory → `/Users/JOB/###DEV/Claude`
- ✅ Installed 179 agents from agency-agents repo
- ✅ Created optimizer-prompt.md for token optimization
- ✅ Set up auto-loader aliases (agents-list, agents-find, etc.)
- ✅ Created KM directory for knowledge management

### TODO
- [ ] Test night-intel deployment
- [ ] Explore specialized agents category
- [ ] Document custom agents if creating any
- [ ] Set up auto-memory consolidation

---

## 🔗 LINKS & REFERENCES

| Type | Reference | Location |
|------|-----------|----------|
| Agents | agency-agents repo | `/tmp/agency-agents/` |
| Config | Claude Code settings | `~/.claude/settings.json` |
| Aliases | Shell aliases | `~/.zshrc` |
| Optimizer | Token optimization | `KM-CLAUDE.md` (this file) |

---

**Last updated:** 2026-05-17 | **Status:** Active
