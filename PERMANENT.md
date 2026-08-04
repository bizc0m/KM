# 🔒 PERMANENT - Modules & Configurations au Démarrage

**Configuration définitive pour tous les lancements**

---

## 🚀 MODULES ACTIFS AU DÉMARRAGE

### 1. **RTK (Rust Token Killer)** ✅
- **Version:** v0.40.0
- **Location:** `/Users/JOB/.local/bin/rtk`
- **Status:** Active & Permanent
- **Purpose:** Reduce token usage 60-90%, 89% noise removal
- **Activation:** Automatique - zero config
- **Install Date:** 2026-05-17

### 2. **Optimizer Prompt** ✅
- **File:** `/Users/JOB/###DEV/Claude/optimizer-prompt.md`
- **Status:** Active & Permanent
- **Purpose:** Token optimization, minimal questions, auto-mode decisions
- **Activation:** SessionStart hook
- **Mode:** Ultra-low token consumption

### 3. **Agents System** ✅
- **Count:** 179 agents
- **Location:** `/Users/JOB/###DEV/Claude/#agents/`
- **Status:** Active & Permanent
- **Categories:** 18 (engineering, design, marketing, finance, etc.)
- **Activation:** Via `agents-list`, `agents-find`, `km-add` commands
- **Quick Access:** `/agents-<category>/<agent-name>`

### 4. **KM System (Knowledge Management)** ✅
- **Pattern:** `##KM <URL>`
- **Location:** `/Users/JOB/###DEV/Claude/KM/`
- **Status:** Active & Permanent
- **Features:**
  - Auto-document URLs with keywords
  - 3-line format (summary + keywords)
  - Async processing
  - Hook-based detection
- **Files:**
  - `KM-CLAUDE.md` - Main index
  - `RESOURCES.md` - Auto-documented links
  - `km-add.sh` - Core script

### 5. **Working Directory** ✅
- **Path:** `/Users/JOB/###DEV/Claude`
- **Status:** Permanent (shell alias)
- **Alias:** `claude` → cd to this directory
- **Config:** `~/.zshrc`

---

## ⚙️ PERMANENT CONFIGURATIONS

### Shell Aliases (Permanent)
```bash
claude              # → /Users/JOB/###DEV/Claude
claude-dev         # → Launch with agents
agents-list        # → List all 179 agents
agents-find        # → Quick search agents
agent              # → Load specific agent
km-add             # → Manual KM document
```

### Hooks (Permanent)
| Event | Action | File |
|-------|--------|------|
| SessionStart | Show "##KM Pattern Active" | `.claude/settings.json` |
| UserPromptSubmit | Auto-detect `##KM URL` | `.claude/settings.json` |
| SessionStart | RTK auto-activation | System-wide |

### Environment Variables
```
KM_DIR=/Users/JOB/###DEV/Claude/KM
KM_SCRIPT=/Users/JOB/###DEV/Claude/KM/km-add.sh
```

---

## 📋 STARTUP SEQUENCE

### Phase 1: Shell Init
```
1. ~/.zshrc loads
2. Aliases configured (claude, agents-*, km-add)
3. RTK available in PATH (/Users/JOB/.local/bin/rtk)
```

### Phase 2: Claude Code Session
```
1. SessionStart hook fires
2. "##KM Pattern Active" message displayed
3. Optimizer prompt ready
4. 179 agents accessible
5. KM system listening for ##KM patterns
```

### Phase 3: User Interaction
```
- ##KM <URL> → Auto-document
- /agent <name> → Load agent
- agents-list → View all agents
- km-add <url> → Manual document
```

---

## 🎯 USAGE QUICK REF

| Need | Command |
|------|---------|
| Change to work dir | `claude` |
| List agents | `agents-list` |
| Find agent | `agents-find "keyword"` |
| Load agent | `agent engineering/senior-dev` |
| Document URL | `##KM <URL>` or `km-add <URL>` |
| View KM index | `cat KM/KM-CLAUDE.md` |
| View resources | `cat KM/RESOURCES.md` |

---

## 📊 STATS

- **Agents:** 179 (18 categories)
- **Resources Documented:** 3+ (RTK, agency-agents, others)
- **Permanent Aliases:** 5
- **Permanent Hooks:** 2
- **Token Optimization:** RTK (60-90% reduction)

---

**Last Updated:** 2026-05-17 07:10
**Status:** All systems active & permanent ✅
