import { mkdirSync, readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = process.env.KM_ROOT
  ? resolve(process.env.KM_ROOT)
  : fileURLToPath(new URL("..", import.meta.url)).replace(/\/$/, "");
const config = JSON.parse(readFileSync(join(root, "km.config.json"), "utf8"));
const ontology = JSON.parse(readFileSync(join(root, "km.ontology.json"), "utf8"));
const version = config.project?.version || "1.12";
const outputFile = join(root, config.dashboard?.mainOutput || `search-v${version}.html`);
const shareOutputDir = join(root, config.dashboard?.shareOutputDir || "public");
const folderConfigs = (config.folders || []).filter((folder) => folder.publishable);
const includeDirs = folderConfigs.map((folder) => folder.path);
const includeFiles = [];
const globalIndexFile = join(root, "index.md");
const privatePublicExcludedPaths = new Set([
  "watch/tool-project-fit-scan.md",
  "watch/index.md",
  "resources/RESOURCES.md"
]);
const internalPattern = new RegExp(`\\b(${(config.dashboard?.hiddenTextPatterns || []).join("|")})\\b`, "i");
const hiddenSections = new Set([...(config.dashboard?.hiddenSections || []), "Resume court"]);
const hiddenSectionPattern = new RegExp(`^##\\s+(${[...hiddenSections].map((x) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`, "i");
const folderByPath = new Map(folderConfigs.map((folder) => [folder.path, folder]));
const themeConfigs = config.themes || [];
const themeById = new Map(themeConfigs.map((theme) => [theme.id, theme]));
const conceptById = new Map((ontology.concepts || []).map((concept) => [concept.id, concept]));
const aliasToConcept = new Map();

function normalizeTag(value) {
  const raw = String(value || "").trim();
  const prefixed = raw.startsWith("#") ? raw : `#${raw}`;
  return prefixed
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

for (const concept of ontology.concepts || []) {
  for (const alias of concept.aliases || []) aliasToConcept.set(normalizeTag(alias), concept.id);
}

function indexedMarkdownPaths() {
  const content = readFileSync(globalIndexFile, "utf8");
  return new Set(
    [...content.matchAll(/`\s*([^`]+\.md)\s*`/g)]
      .map((match) => match[1].trim())
      .filter((path) => includeDirs.some((dir) => path === `${dir}/index.md` || path.startsWith(`${dir}/`)))
  );
}

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.isFile() && entry.name.endsWith(".md") ? [full] : [];
  });
}

function section(content, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = content.match(new RegExp(`## ${escaped}\\n+([\\s\\S]*?)(\\n## |$)`, "i"));
  return match ? match[1].trim() : "";
}

function first(content, pattern) {
  const match = content.match(pattern);
  return match ? match[1].trim() : "";
}

function clean(value) {
  return String(value || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[>*_|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function looksNonEnglish(value) {
  const text = String(value || "");
  return /[\u4e00-\u9fff]|[ÇçĞğİıŞşÜüÖö¿¡]|[àâäéèêëîïôöùûüÿœæÀÂÄÉÈÊËÎÏÔÖÙÛÜŸŒÆ]|(?:\b(?:ve|gibi|kullanarak|istiyor|ancak|ücretli|açık|kaynak|repositorio|gratis|codigo|puedes|cherche|façon|métier|développeur|donné|mémoire|outil|veille|présenté|données|sécurité|source|résume|gratuit|completamente|funciona|estrellas|código|bukan|karena|malem|gue|nyadar)\b)/i.test(text);
}

function isGeneratedSummary(title, value) {
  const text = clean(value);
  if (!text) return false;
  const escapedTitle = clean(title).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^${escapedTitle}\\s+est une fiche KM\\b`, "i").test(text)
    || /\best une fiche KM\b.*\bSource finale conservee dans la fiche\.?$/i.test(text);
}

function githubDescription(content) {
  const match = String(content || "").match(/^\s*-\s*description\s*:\s*(.+)$/im);
  return match ? clean(match[1]) : "";
}

function typeSummary(type) {
  let text = clean(type)
    .replace(/^veille\s+/i, "")
    .replace(/^raindrop km monitor\s*\/?\s*/i, "")
    .replace(/^strategic\s+/i, "")
    .replace(/^(outils?|outil|liens utilisateur|ressource longue|ressource|source sociale|#rouge)\s*(ia|ai)?\s*\/?\s*/i, "")
    .replace(/\bwatch\b/ig, "")
    .replace(/\bsignal\b/ig, "")
    .replace(/\s+\/\s+/g, " / ")
    .replace(/\s+([.,;:])/g, "$1")
    .replace(/[.。]+$/g, "")
    .trim();
  if (!text || /^(raindrop km monitor|watch signal)$/i.test(text)) return "";
  const lower = text.toLowerCase();
  if (/contexte codebase|codebase/.test(lower) && /agents? de code|coding agents?/.test(lower)) return "fournit le contexte codebase aux agents de code";
  if (/agent de developpement|ai driven development|software-development/.test(lower)) return "automatise le developpement avec un agent IA";
  if (/governance.*public policy|public policy.*governance/.test(lower)) return "suit les signaux de gouvernance IA et politique publique";
  if (/export/.test(lower)) return text;
  if (/orchestration|multi-agent|multi-agents/.test(lower)) return "orchestre des agents IA";
  if (/annuaire|directory|awesome/.test(lower)) return "recense et classe des ressources";
  if (/bibliotheque|framework|library/.test(lower)) return "fournit une base technique reusable";
  if (/agent\s+(personnel|autonome|ia)/.test(lower)) return "automatise des taches avec un agent IA";
  if (/recherche|research/.test(lower)) return "automatise la recherche et la synthese";
  if (/scraping|extraction/.test(lower)) return "extrait des donnees depuis des sources web ou documents";
  return text;
}

function englishSummary(title, ...candidates) {
  for (const candidate of candidates) {
    const text = clean(candidate);
    if (text && !isGeneratedSummary(title, text)) return text.slice(0, 520);
  }
  return "";
}

function publicDetail(content) {
  let hidden = false;
  return content
    .split("\n")
    .filter((line) => {
      if (/^##\s+/.test(line)) hidden = hiddenSectionPattern.test(line);
      if (hidden || internalPattern.test(line)) return false;
      if (/^Lecture(?: KM)?\s*:/i.test(line)) return false;
      if (/^Source Raindrop\s*:/i.test(line)) return false;
      if (/^\s*`?sensible`?\s*$/i.test(line)) return false;
      if (/^Raison\s*:/i.test(line)) return false;
      return true;
    })
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 18000);
}

function integrationDate(content) {
  return first(content, /Lecture(?: KM)?\s*:\s*(\d{4}-\d{2}-\d{2})/i)
    || first(content, /### v[^\n]*?-\s*(\d{4}-\d{2}-\d{2})/i)
    || first(content, /(\d{4}-\d{2}-\d{2})/);
}

function publicGithub(content) {
  const urls = [...content.matchAll(/https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+/g)].map((m) => m[0]);
  return urls.find((url) => !/github\.com\/bizc0m\//i.test(url)) || "";
}

function cleanUrl(url) {
  return String(url || "")
    .split("](").pop()
    .replace(/[)\].,;:]+$/, "");
}

function canonicalSourceUrl(url) {
  try {
    const parsed = new URL(cleanUrl(url));
    parsed.hash = "";
    for (const key of [...parsed.searchParams.keys()]) {
      if (/^(utm_|fbclid|gclid|yclid|mc_|mcp_token|token|auth|signature|expires)$/i.test(key)) {
        parsed.searchParams.delete(key);
      }
    }
    parsed.hostname = parsed.hostname.toLowerCase().replace(/^www\./, "");
    if (parsed.hostname === "twitter.com") parsed.hostname = "x.com";
    parsed.pathname = parsed.pathname.replace(/\/+$/, "");
    return parsed.toString().replace(/\/$/, "").toLowerCase();
  } catch {
    return cleanUrl(url).replace(/\/$/, "").toLowerCase();
  }
}

function publicSourceUrl(content) {
  const urls = [...content.matchAll(/https?:\/\/[^\s`<>"']+/g)].map((m) => cleanUrl(m[0]));
  return urls.find((url) => !/github\.com\/bizc0m\//i.test(url) && !/localhost|127\.0\.0\.1/i.test(url)) || "";
}

function publicSources(content) {
  const seen = new Set();
  return [...String(content || "").matchAll(/https?:\/\/[^\s`<>"']+/g)]
    .map((m) => cleanUrl(m[0]))
    .filter((url) => !/github\.com\/bizc0m\//i.test(url) && !/localhost|127\.0\.0\.1/i.test(url))
    .filter((url) => {
      const canonical = canonicalSourceUrl(url);
      return !seen.has(canonical) && seen.add(canonical);
    })
    .slice(0, 8)
    .map((url) => ({
      url,
      kind: /(?:^|\/\/)(?:www\.)?(?:x|twitter)\.com\//i.test(url) ? "social" : /github\.com\/[^/]+\/[^/]+/i.test(url) ? "github" : "source",
      label: /(?:^|\/\/)(?:www\.)?(?:x|twitter)\.com\//i.test(url) ? "Post Twitter" : /github\.com\/[^/]+\/[^/]+/i.test(url) ? "Repo GitHub" : "Source"
    }));
}

const themeRouting = config.themeRouting || {};
const folderThemeDefaults = themeRouting.folderDefaults || {};
const fileThemeOverrides = themeRouting.fileOverrides || {};
const knownThemeIds = new Set(themeConfigs.map((theme) => theme.id));

function validTheme(id) {
  return knownThemeIds.has(String(id || "")) ? String(id) : "";
}

function themeOf(title, tags, type, fallback = "tool") {
  const text = `${title} ${tags.join(" ")} ${type}`.toLowerCase();
  const tagText = tags.join(" ").toLowerCase();
  const rules = [
    ["governance", /ai-governance|governance|public-policy|policy|summit|trust|switzerland|geneva/],
    ["security", /#rouge|pentest|red-?team|offensive|malware|exploit|vulnerability|security-automation/],
    ["osint", /osint|threat|recon|footprint|intelligence|factchecking/],
    ["media", /media|video|image|design|ui-design|wireframe|prototype|creative-ai|remotion|shortvideo/],
    ["llm", /(?:^|[#\\s-])(llm|api|openai|provider|inference|gemini|gpt|free-tier)(?:$|[#\\s-])/],
    ["dev", /github|repo|codebase|coding|devtools|editor|codex|claude-code|opencode|rust|python|typescript/],
    ["privacy", /privacy|local-first|tracking|analytics|session-intelligence|depin|encrypted/],
    ["research", /research|paper|citation|scientific|wiki|academic/],
    ["source", /rss|source|authors|monitoring|twitter|\\bx\\b|openrss|raindrop/],
    ["finance", /finance|trading|hedge|polymarket/],
    ["agent", /#agent|#agents|personal-agent|autonomous-agent|coding-agents|research-agent|ai-companion|multi-agent|orchestration|workflow|workflows|automation|mcp/],
    ["watchlist", /directory|watchlist|inspiration|competitor|vibe/]
  ];
  for (const [id, pattern] of rules) if (pattern.test(tagText)) return id;
  for (const [id, pattern] of rules) if (pattern.test(text)) return id;
  return validTheme(fallback) || "tool";
}

function conceptAncestors(id) {
  const ids = [];
  let current = conceptById.get(id);
  while (current?.parent) {
    ids.push(current.parent);
    current = conceptById.get(current.parent);
  }
  return ids;
}

function conceptsOf(tags, status, theme) {
  const ids = new Set();
  for (const value of [...tags, status, theme]) {
    const conceptId = aliasToConcept.get(normalizeTag(value));
    if (conceptId === "risk.sensitive") continue;
    if (!conceptId) continue;
    ids.add(conceptId);
    for (const parent of conceptAncestors(conceptId)) ids.add(parent);
  }
  return [...ids].map((id) => ({
    id,
    label: conceptById.get(id)?.label || id,
    parent: conceptById.get(id)?.parent || null
  })).filter((concept) => !/sensible|sensitive/i.test(concept.label));
}

function bucketOf(path) {
  const folder = includeDirs.find((dir) => path === `${dir}/index.md` || path.startsWith(`${dir}/`));
  if (folder) return folderByPath.get(folder)?.id || folder;
  return "document";
}

function folderMeta(path) {
  const folderPath = includeDirs.find((dir) => path === `${dir}/index.md` || path.startsWith(`${dir}/`));
  return folderByPath.get(folderPath) || { id: bucketOf(path), label: bucketOf(path), publishable: true, shareable: true };
}

function statusOf(content, folder) {
  const explicit = [section(content, "Type"), section(content, "Tags"), section(content, "Classification")].join("\n");
  if (/#ROUGE/i.test(explicit)) return "#ROUGE";
  if (/#?a[-_ ]?verifier|à vérifier|#?to-verify/i.test(explicit)) return "a verifier";
  if (/sensible|sensitive/i.test(explicit)) return "sensible";
  if (/#?actif|active/i.test(explicit)) return "actif";
  if (/a verifier|à vérifier|to-verify/i.test(content)) return "a verifier";
  if (/risques?\s*:|secrets?|tokens?|donnees? privees?|privacy|autonomous|automation|agent|mcp|scraping|osint|cache|memory|codebase|credentials?|workflow/i.test(content)) {
    return "sensible";
  }
  if (folder?.defaultClassification) return folder.defaultClassification;
  return "actif";
}

function displayTags(tags) {
  return tags.filter((tag) => !/^#?(watch|sensible|sensitive|a-verifier|to-verify|actif|active|export)$/i.test(tag));
}

function githubTopicsFrom(content) {
  const topics = new Set();
  const addList = (value) => {
    for (const topic of String(value || "").split(",")) {
      const cleanTopic = clean(topic).toLowerCase();
      if (!cleanTopic || cleanTopic === "aucun topic public") continue;
      if (/^https?:\/\//.test(cleanTopic)) continue;
      topics.add(cleanTopic);
    }
  };
  let tableHeaders = [];
  for (const line of content.split("\n")) {
    const bullet = line.match(/topics releves\s*:\s*(.+)$/i);
    if (bullet) addList(bullet[1]);
    if (/^\|(.+)\|$/.test(line) && !/^\|\s*-/.test(line)) {
      const cells = line.slice(1, -1).split("|").map((cell) => cell.trim());
      if (!tableHeaders.length) {
        tableHeaders = cells.map((cell) => normalizeTag(cell).replace(/^#/, ""));
        continue;
      }
      const index = tableHeaders.findIndex((header) => header === "topics-releves");
      if (index >= 0) addList(cells[index]);
    } else if (!/^\|/.test(line)) {
      tableHeaders = [];
    }
  }
  return [...topics].sort();
}

function itemFrom(file) {
  const path = relative(root, file);
  const content = readFileSync(file, "utf8");
  const folder = folderMeta(path);
  if (privatePublicExcludedPaths.has(path)) return null;
  if (internalPattern.test(path)) return null;
  const title = first(content, /^#\s+(.+)$/m) || path;
  const status = statusOf(content, folder);
  const tags = section(content, "Tags")
    .split(/,|\n/)
    .map(clean)
    .filter(Boolean)
    .map((tag) => /^#?privacy-sensitive$/i.test(tag) ? "#privacy" : tag)
    .filter((tag) => !(status === "#ROUGE" && /^#?rouge$/i.test(tag)))
    .filter((tag) => !/^#?(sensible|sensitive|a-verifier|to-verify|actif|active|export)$/i.test(tag))
    .filter((tag) => !/sensitive/i.test(tag))
    .slice(0, 12);
  const raw = publicDetail(content);
  const type = section(content, "Type");
  const summary = englishSummary(title, typeSummary(type), section(content, "Role"));
  const folderFallback = validTheme(folderThemeDefaults[folder.id]) || validTheme(folderThemeDefaults[folder.path]) || "tool";
  const theme = validTheme(fileThemeOverrides[path]) || themeOf(title, tags, section(content, "Type"), folderFallback);
  return {
    id: path.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, ""),
    title,
    canonical: "",
    type: clean(type.split("\n")[0] || bucketOf(path)).slice(0, 90),
    bucket: bucketOf(path),
    folder: folder.id,
    folderLabel: folder.label || folder.id,
    publishable: Boolean(folder.publishable),
    shareable: Boolean(folder.shareable),
    tags,
    status,
    path,
    repoUrl: `https://github.com/bizc0m/KM/blob/main/${path}`,
    sourceUrl: publicSourceUrl(content),
    sources: publicSources(content),
    github: publicGithub(content),
    githubTopics: githubTopicsFrom(content),
    summary,
    relations: [],
    raw,
    integratedAt: integrationDate(content),
    theme,
    themeLabel: themeById.get(theme)?.label || theme,
    concepts: conceptsOf(tags, status, theme)
  };
}

const indexedPaths = indexedMarkdownPaths();
const files = [
  ...includeFiles.map((file) => join(root, file)).filter((file) => statSync(file, { throwIfNoEntry: false })),
  ...includeDirs.flatMap((dir) => walk(join(root, dir)))
].filter((file) => indexedPaths.has(relative(root, file)));
const dateValue = (item) => Date.parse(item.integratedAt || "") || 0;
const index = files.map(itemFrom).filter(Boolean).sort((a, b) =>
  dateValue(b) - dateValue(a) || (a.canonical || a.title).localeCompare(b.canonical || b.title)
);
const latestIndexedDate = index
  .map((item) => item.integratedAt)
  .filter(Boolean)
  .sort()
  .at(-1);
const generatedAt = process.env.KM_BUILD_TIMESTAMP || `donnees ${latestIndexedDate || "n/a"}`;

function htmlEscape(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function slugSafe(value) {
  return String(value || "all")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "all";
}

function globalMenu(current = "", prefix = "") {
  const items = [
    ["index", "Accueil", `${prefix}index.html`],
    ["search", "Recherche", `${prefix}search-v1.12.html`],
    ["watch", "Watch", `${prefix}public/folders/watch.html`],
    ["resources", "Resources", `${prefix}public/folders/resources.html`],
    ["books", "Books", `${prefix}public/folders/books.html`],
    ["kprompt", "Kprompt", `${prefix}kprompt.html`],
    ["app", "App locale", "http://127.0.0.1:8767/"]
  ];
  return `<nav class="global-menu" aria-label="Menu principal">${items.map(([id, label, href]) => `<a class="${id === current ? "active" : ""}" href="${htmlEscape(href)}">${htmlEscape(label)}</a>`).join("")}</nav>`;
}

function breadcrumb(items) {
  return `<nav class="breadcrumb" aria-label="Fil d'ariane">${items.map((item, index) => index === items.length - 1 ? `<span>${htmlEscape(item.label)}</span>` : `<a href="${htmlEscape(item.href)}">${htmlEscape(item.label)}</a>`).join("<b>/</b>")}</nav>`;
}

function sharePage(title, subtitle, rows) {
  const lower = title.toLowerCase();
  const current = lower.includes("watch") ? "watch" : lower.includes("resources") ? "resources" : lower.includes("books") ? "books" : "search";
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${htmlEscape(title)}</title>
<style>
body{margin:0;font-family:Inter,Arial,sans-serif;background:#f3f0e8;color:#151515}
header{position:sticky;top:0;background:#fffefb;border-bottom:3px solid #151515;padding:18px 22px;z-index:2}
.global-menu{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin:0 0 10px}.global-menu a{border:1px solid #d8d3c8;background:#fff;color:#151515;padding:7px 9px;font-size:10px;font-weight:950;text-transform:uppercase;text-decoration:none}.global-menu a:hover,.global-menu a.active{background:#151515;border-color:#151515;color:#fff}
.breadcrumb{display:flex;gap:7px;flex-wrap:wrap;align-items:center;margin:0 0 10px;font-size:11px;font-weight:900;text-transform:uppercase;color:#64615b}.breadcrumb a{color:#151515;text-decoration:none}.breadcrumb b{color:#b0a99c}
h1{font-size:28px;line-height:1;margin:0 0 5px;text-transform:uppercase}p{margin:0;color:#64615b}
main{max-width:1120px;margin:0 auto;padding:18px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:10px}
article{background:#fff;border:1px solid #d8d3c8;border-left:4px solid #151515;padding:12px}
h2{font-size:17px;line-height:1.18;margin:0 0 8px}
.meta{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:8px}
.tag{font-size:10px;font-weight:900;text-transform:uppercase;border:1px solid #d8d3c8;background:#ebe6dc;padding:4px 6px}
.hot{background:#fff0ef;color:#8f0000;border-color:#edb8b8}
.summary{font-size:13px;line-height:1.45;color:#333;margin:0 0 10px}
a{color:#0b5cad;font-weight:800}
</style>
</head>
<body>
<header>${globalMenu(current, "../../")}${breadcrumb([{ label: "KM", href: "../../index.html" }, { label: "Exports publics", href: "../../index.html" }, { label: title }])}<h1>${htmlEscape(title)}</h1><p>${htmlEscape(subtitle)} · ${rows.length} fiches · ${generatedAt}</p></header>
<main><section class="grid">
${rows.map((item) => `<article>
<h2>${htmlEscape(item.title)}</h2>
<div class="meta">${item.status === "#ROUGE" ? `<span class="tag hot">${htmlEscape(item.status)}</span>` : ""}<span class="tag">${htmlEscape(item.folderLabel)}</span><span class="tag">#${htmlEscape(item.theme)}</span></div>
<p class="summary">${htmlEscape(item.summary)}</p>
<a href="../../${htmlEscape(item.path)}">Ouvrir la fiche</a>
</article>`).join("\n")}
</section></main>
</body>
</html>`;
}

function writeSharePages(rows) {
  const published = rows.filter((item) => item.publishable && item.shareable);
  const written = [];
  mkdirSync(join(shareOutputDir, "themes"), { recursive: true });
  mkdirSync(join(shareOutputDir, "folders"), { recursive: true });
  for (const theme of themeConfigs) {
    const subset = published.filter((item) => item.theme === theme.id);
    const file = join(shareOutputDir, "themes", `${slugSafe(theme.id)}.html`);
    writeFileSync(file, sharePage(`Theme ${theme.label || theme.id}`, "Vue KM partageable par theme", subset), "utf8");
    written.push(relative(root, file));
  }
  for (const folder of folderConfigs.filter((item) => item.shareable)) {
    const subset = published.filter((item) => item.folder === folder.id);
    if (!subset.length) continue;
    const file = join(shareOutputDir, "folders", `${slugSafe(folder.id)}.html`);
    writeFileSync(file, sharePage(`Dossier ${folder.label || folder.id}`, folder.role || "Vue KM partageable par dossier", subset), "utf8");
    written.push(relative(root, file));
  }
  return written;
}

const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>KM Search v1.12</title>
<style>
*,*::before,*::after{box-sizing:border-box}
:root{--ink:#151515;--muted:#64615b;--line:#d8d3c8;--paper:#f3f0e8;--panel:#fffefb;--soft:#ebe6dc;--red:#e50000;--red-soft:#fff0ef;--blue:#245f8f;--gold:#8b6914;--shadow:4px 4px 0 rgba(229,0,0,.22);--shadow-strong:7px 7px 0 rgba(21,21,21,.12)}
html,body{height:100%}body{margin:0;font-family:Inter,Arial,Helvetica,sans-serif;background:var(--paper);color:var(--ink);overflow:hidden}button,input,select{font:inherit}button{cursor:pointer}
.app{height:100vh;display:grid;grid-template-rows:auto auto auto 1fr auto}.global-menu{display:flex;gap:6px;flex-wrap:wrap;align-items:center;padding:7px 10px;background:#fff;border-bottom:1px solid var(--line)}.global-menu a{border:1px solid var(--line);background:#fff;color:var(--ink);padding:6px 8px;font-size:9px;font-weight:950;text-transform:uppercase;text-decoration:none}.global-menu a:hover,.global-menu a.active{background:var(--ink);border-color:var(--ink);color:#fff}.breadcrumb{display:flex;gap:7px;flex-wrap:wrap;align-items:center;padding:6px 10px;background:#fbfaf6;border-bottom:2px solid var(--ink);font-size:10px;font-weight:900;text-transform:uppercase;color:var(--muted)}.breadcrumb a{color:var(--ink);text-decoration:none}.breadcrumb b{color:#b0a99c}.crumb-action{border:0;background:transparent;color:var(--ink);font-size:10px;font-weight:950;text-transform:uppercase;padding:0;text-decoration:underline;text-underline-offset:2px}.topbar{min-height:38px;background:var(--panel);border-bottom:3px solid var(--ink);display:grid;grid-template-columns:minmax(210px,max-content) minmax(0,1fr) max-content;align-items:center;gap:8px;padding:5px 10px}.brandblock{min-width:0;align-self:center;display:grid;grid-template-columns:max-content max-content;align-items:end;gap:8px}.brand{font-size:18px;font-weight:950;text-transform:uppercase;line-height:.92;display:flex;align-items:flex-end;gap:6px;white-space:nowrap}.brand span{color:var(--red)}.version-badge{border:1px solid var(--ink);background:var(--red);color:#fff;font-size:9px;font-weight:950;line-height:1;padding:3px 5px;text-transform:uppercase}.subtitle{font-size:8px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);font-weight:850;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.tool-actions{display:flex;align-items:center;gap:4px;justify-content:flex-end;justify-self:end;flex-wrap:wrap}
.btn{border:1px solid var(--line);background:#fff;color:var(--ink);padding:5px 8px;font-size:9px;font-weight:900;text-transform:uppercase;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:5px;min-height:26px;white-space:nowrap}.btn:hover{background:var(--ink);border-color:var(--ink);color:#fff}.btn.dark{background:var(--ink);color:#fff;border-color:var(--ink)}.btn.red{background:var(--red);color:#fff;border-color:var(--red)}.icon-btn{width:30px;min-width:30px;height:28px;padding:0}.icon-btn svg{width:15px;height:15px;stroke:currentColor;stroke-width:2.4;fill:none;stroke-linecap:round;stroke-linejoin:round;display:block}
.statsbar{display:flex;align-items:center;gap:1px;background:var(--ink);border:1px solid var(--ink);min-width:0;overflow:hidden}.stat{background:#fbfaf6;padding:3px 6px;display:flex;align-items:baseline;justify-content:center;gap:4px;min-width:0}.stat.danger{background:var(--red);color:#fff}.stat.danger span{color:#fff}.stat b{font-size:12px;line-height:1;font-weight:950}.stat span{font-size:7px;text-transform:uppercase;letter-spacing:.03em;color:var(--muted);font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.topic-rail{display:flex;gap:4px;flex-wrap:wrap;align-items:flex-start;padding:5px 10px;border-bottom:2px solid var(--ink);background:#fbfaf6}.topic{white-space:nowrap;border:1px solid var(--line);background:#fff;padding:4px 7px;font-size:9px;font-weight:900;text-transform:uppercase}.topic.active{background:var(--ink);border-color:var(--ink);color:#fff}
.workspace{min-height:0;display:grid;grid-template-columns:minmax(390px,.92fr) minmax(520px,1.08fr);gap:10px;padding:10px}.workspace.fiche-collapsed{grid-template-columns:1fr}.workspace.fiche-collapsed #ficheCol{display:none}.col{min-height:0;background:var(--panel);border:2px solid var(--ink);box-shadow:var(--shadow);display:flex;flex-direction:column}.col>header{min-height:34px;border-bottom:2px solid var(--ink);display:flex;align-items:center;justify-content:space-between;gap:8px;padding:0 10px}.collapse-tab{position:fixed;right:12px;top:106px;z-index:30;display:none}.collapse-tab.on{display:inline-flex}h2{font-size:12px;font-weight:950;text-transform:uppercase;margin:0}.headnote{font-size:9px;color:var(--muted);font-weight:900;text-transform:uppercase}.scroll{overflow:auto;padding:10px;min-height:0}
.feed-tools{position:sticky;top:0;z-index:8;display:grid;grid-template-columns:minmax(220px,1.4fr) minmax(120px,.8fr) 76px 86px 108px 100px 100px 116px;gap:7px;margin:-10px -10px 10px;padding:10px;background:var(--panel);border-bottom:2px solid var(--ink)}.feed-tools select,.feed-tools input{border:1px solid var(--line);background:#fff;padding:8px;font-size:11px;min-width:0}.feed-tools #search{border:2px solid var(--ink);font-size:13px;font-weight:900}.article-status{border:1px solid var(--line);background:#fbfaf6;padding:7px 8px;margin:0 0 10px;font-size:10px;font-weight:900;text-transform:uppercase;color:var(--muted);display:flex;justify-content:space-between;gap:10px}
.news-card{display:grid;grid-template-columns:22px 1fr;gap:10px;border:1px solid var(--line);border-left:4px solid var(--line);background:#fff;padding:11px;margin-bottom:10px;transition:.12s}.news-card:hover{box-shadow:0 2px 12px rgba(0,0,0,.08);transform:translateY(-1px)}.news-card.active{border-left-color:var(--red);outline:2px solid rgba(229,0,0,.2)}.news-card.selected{background:#fff8e8}.check{width:16px;height:16px;border:2px solid var(--line);display:flex;align-items:center;justify-content:center;margin-top:2px}.selected .check{background:var(--gold);border-color:var(--gold)}.selected .check::after{content:"✓";color:#fff;font-size:10px;font-weight:900}
.meta{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:6px}.tag{font-size:9px;text-transform:uppercase;font-weight:900;padding:3px 6px;border:1px solid var(--line);background:var(--soft);line-height:1.15}.tag-btn{appearance:none;border-radius:0;cursor:pointer}.tag-btn:hover{background:var(--ink)!important;border-color:var(--ink)!important;color:#fff!important}.tag.hot{background:var(--red-soft);border-color:#edb8b8;color:#8f0000}.tag.warn{background:#ff8a00;border-color:#b85f00;color:#1d1200}.tag.security{background:#fff0ef;border-color:#edb8b8;color:#8f0000}.tag.osint{background:#ffe9d6;border-color:#e2a66f;color:#7a3f00}.tag.source{background:#fff6dd;border-color:#e6cf89;color:#6f5100}.tag.dev{background:#eef4fb;border-color:#b8cce0;color:#245f8f}.tag.llm{background:#f0ecff;border-color:#c9baf0;color:#4d348f}.tag.agent{background:#eaf7f4;border-color:#a8d8cd;color:#145f52}.tag.research{background:#edf3ff;border-color:#b9c9ee;color:#244678}.tag.privacy{background:#eef7ee;border-color:#bad8ba;color:#225522}.tag.finance{background:#f8efdc;border-color:#d2b06a;color:#6a4a08}.tag.watchlist{background:#f2edf8;border-color:#c8b6da;color:#573273}.tag.media{background:#ffeef6;border-color:#e2adca;color:#8a2557}.tag.tool{background:#f0f0f0;border-color:#cfcfcf;color:#333}.tag.github-link{background:var(--ink)!important;color:#fff!important;border-color:var(--ink)!important;text-decoration:none}.tag.github-topic{background:#eef4fb!important;border-color:#b8cce0!important;color:#245f8f!important;text-decoration:none}
.title-row{display:flex;align-items:center;gap:8px;margin:0 0 6px}.title-row .date-chip{flex:0 0 auto;margin:0}.news-title{font-size:17px;line-height:1.18;font-weight:950;margin:0;cursor:pointer}.news-title:hover{color:var(--red)}.source-strip{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin:0 0 8px;font-size:9px;font-weight:900;text-transform:uppercase;color:var(--muted)}.source-strip a,.source-strip span{border:1px solid var(--line);background:#fbfbf8;color:var(--ink);padding:4px 6px;text-decoration:none;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.info-line{display:flex;align-items:flex-start;gap:7px;flex-wrap:wrap;margin-top:7px}.info-label{font-size:9px;font-weight:950;text-transform:uppercase;border:1px solid var(--ink);background:var(--ink);color:#fff;padding:3px 6px;line-height:1.15}.info-text{font-size:12px;line-height:1.35;font-weight:750;color:#222}.card-actions{display:flex;gap:6px;flex-wrap:wrap;margin-top:9px}
.detail-title{border:1px solid var(--line);background:#fff;padding:14px;margin-bottom:12px;box-shadow:var(--shadow-strong)}.eyebrow{display:inline-flex;border:1px solid var(--ink);background:var(--ink);color:#fff;font-size:9px;font-weight:950;text-transform:uppercase;padding:4px 6px;margin:0 0 8px}.titleline{display:flex;align-items:flex-start;gap:12px}.detail-title h1{font-size:27px;line-height:1.05;font-weight:950;flex:1;margin:0}.statusbox{min-width:106px;border:2px solid var(--ink);text-align:center;padding:8px;background:#fbfbf8}.statusbox b{display:block;font-size:14px;line-height:1.1;color:var(--red);text-transform:uppercase}.statusbox span{font-size:9px;text-transform:uppercase;font-weight:900;color:var(--muted)}.detail-title p{font-size:13px;line-height:1.5;color:#333;margin:10px 0 0}.detail-actions{display:flex;gap:6px;flex-wrap:wrap;margin-top:12px}.section-title{font-size:10px;font-weight:950;text-transform:uppercase;color:var(--muted);border-bottom:1px solid var(--line);padding-bottom:7px;margin:0 0 9px}
.index-grid{display:grid;grid-template-columns:118px repeat(4,1fr);border:1px solid var(--line);background:#fff;margin-bottom:12px}.index-grid div{min-height:31px;border-right:1px solid var(--line);border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:center;padding:4px;font-size:10px;font-weight:950;text-align:center}.index-grid .label{justify-content:flex-start;text-align:left;color:var(--muted);background:#fbfbf8}.index-grid .cell.hot{background:var(--red);color:#fff}.index-grid .cell.warm{background:#fff2ce}.index-grid .cell.cool{background:#eef4fb;color:var(--blue)}
.note,.cluster{border:1px solid var(--line);background:#fff;padding:10px;margin-bottom:8px}.note strong{display:block;font-size:11px;text-transform:uppercase;margin-bottom:5px}.note p{font-size:12px;line-height:1.42;color:#333;margin:0}.cluster{display:flex;justify-content:space-between;gap:8px;font-size:12px}.cluster b{text-transform:uppercase}.cluster span{color:var(--muted);overflow-wrap:anywhere}.brief-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin-bottom:10px}.brief{border:1px solid var(--line);background:#fbfbf8;padding:7px;min-width:0}.brief b{display:block;font-size:8px;text-transform:uppercase;color:var(--muted);margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.brief span{display:block;font-size:12px;font-weight:950;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.detail-body{border:1px solid var(--line);background:#fff;padding:14px;margin-bottom:12px;font-size:13px;line-height:1.5;color:#222}.detail-body h1,.detail-body h2,.detail-body h3{font-weight:950;line-height:1.12;margin:12px 0 8px}.detail-body h1{font-size:22px}.detail-body h2{font-size:17px;border-bottom:1px solid var(--line);padding-bottom:5px}.detail-body h3{font-size:14px}.detail-body p{margin:0 0 9px}.detail-body ul{margin:0 0 10px 18px;padding:0}.detail-body li{margin:4px 0}.detail-body code{background:#f3f0e8;border:1px solid var(--line);padding:1px 4px}.detail-body a{color:#0b5cad;font-weight:800;text-decoration:underline;text-underline-offset:2px}.detail-body a.github-topic{display:inline-block;border:1px solid #b8cce0;background:#eef4fb;color:#245f8f;padding:1px 5px;margin:1px 2px 1px 0;text-decoration:none;font-size:11px;font-weight:900}.detail-body table{width:100%;border-collapse:collapse;margin:8px 0 12px;font-size:11px}.detail-body th,.detail-body td{border:1px solid var(--line);padding:5px;text-align:left;vertical-align:top}.date-chip{display:inline-flex;border:1px solid var(--line);background:#fbfbf8;color:var(--muted);font-size:10px;font-weight:900;text-transform:uppercase;padding:4px 6px;margin-bottom:7px}
.toast{position:fixed;right:18px;top:78px;background:#fff;border:1px solid var(--line);border-left:4px solid var(--blue);padding:10px 13px;font-size:11px;box-shadow:0 4px 18px rgba(0,0,0,.12);z-index:20;display:none}.toast.on{display:block}.footer{border-top:2px solid var(--line);background:#fff;color:var(--muted);font-size:10px;display:flex;justify-content:space-between;gap:12px;padding:8px 14px}.footer b{color:var(--ink)}mark{background:rgba(229,0,0,.12);color:inherit;padding:0 2px}
@media(max-width:1240px){.topbar{grid-template-columns:1fr max-content}.statsbar{grid-column:1/2;grid-row:2}.subtitle{display:none}.workspace{grid-template-columns:minmax(300px,.9fr) minmax(360px,1.1fr);gap:10px;padding:10px}.feed-tools{grid-template-columns:minmax(160px,1fr) 72px 88px 106px}.feed-tools input:last-child{grid-column:1/-1}}@media(max-width:760px){body{overflow:auto}.app{height:auto;min-height:100vh}.topbar,.footer{height:auto;align-items:stretch;padding:8px 10px}.global-menu{padding:8px 10px}.global-menu a{flex:1 1 auto}.brandblock{min-width:0}.statsbar{grid-column:auto;grid-row:auto;display:grid;grid-template-columns:1fr 1fr}.workspace{grid-template-columns:1fr;padding:8px}.workspace:not(.fiche-collapsed) aside.col{display:none}.col{min-height:520px}.feed-tools{grid-template-columns:1fr}.feed-tools input:last-child{grid-column:auto}.brief-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.index-grid{grid-template-columns:100px repeat(4,72px);overflow:auto}.titleline{flex-direction:column}.statusbox{width:100%}}
</style>
</head>
<body>
<main class="app">
  ${globalMenu("search")}
  <div class="topbar"><div class="brandblock"><div class="brand"><span>KM</span> Search <b class="version-badge">v1.12</b></div><div class="subtitle">Recherche · Watch · RSS/Raindrop · fiches Markdown</div></div><div class="statsbar" id="statsbar"></div><div class="tool-actions"><button class="btn dark icon-btn" id="navHome" aria-label="Home" title="Home"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11l9-8 9 8"></path><path d="M5 10v10h14V10"></path><path d="M9 20v-6h6v6"></path></svg></button><button class="btn icon-btn" id="navBack" aria-label="Retour" title="Retour"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6"></path></svg></button><button class="btn icon-btn" id="navForward" aria-label="Avancer" title="Avancer"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"></path></svg></button><a class="btn dark" href="search-v1.12.html">Recherche</a><button class="btn" id="watchShortcut">Watch</button><a class="btn" href="${config.sources?.raindropPublicPage || "#"}" target="_blank" rel="noopener noreferrer">Raindrop</a><a class="btn" href="${config.sources?.raindropFeedFallback || "#"}" target="_blank" rel="noopener noreferrer">RSS</a><a class="btn" href="kprompt.html">Kprompt</a><a class="btn" href="http://127.0.0.1:8767/">Veille locale</a><button class="btn dark" id="toggleFicheTop">Afficher fiche</button><button class="btn" id="copyShare">Copier lien</button><button class="btn" id="copySelection">Copier selection</button><button class="btn" id="exportSelection">Export .md</button><button class="btn dark" id="exportJson">JSON</button></div></div>
  <div class="breadcrumb" id="breadcrumb"></div>
  <div class="topic-rail" id="topics"></div>
  <section class="workspace fiche-collapsed" id="workspace">
    <aside class="col"><div class="scroll"><div class="feed-tools"><input id="search" type="search" autocomplete="off" placeholder="Rechercher dans toutes les fiches"><input id="tagFilter" placeholder="Filtre tag/topic"><button class="btn red" id="clearSearch">Effacer</button><select id="sort"><option value="date">Date recente</option><option value="status">Risque</option><option value="title">Titre</option><option value="type">Type</option></select><select id="statusFilter"><option value="all">Tous</option><option value="#ROUGE">#ROUGE</option><option value="sensible">Sensible</option><option value="a verifier">A verifier</option><option value="actif">Actif</option></select><select id="folderFilter"></select><select id="themeFilter"></select><select id="conceptFilter"></select></div><div class="article-status" id="articleStatus"></div><div id="feed"></div></div></aside>
    <section class="col" id="ficheCol"><div class="scroll"><div id="detail"></div></div></section>
  </section>
  <button class="btn dark collapse-tab on" id="openFiche">Fiche</button>
  <footer class="footer"><span><b>KM Search v1.12</b> · HTML autonome · vue publique nettoyee</span><span>${index.length} fiches · ${generatedAt}</span></footer>
</main>
<div class="toast" id="toast"></div>
<script>
const KM_INDEX=${JSON.stringify(index)};
const KM_CONFIG=${JSON.stringify({
  folders: folderConfigs.map(({ id, label, role, publishable, shareable }) => ({ id, label, role, publishable, shareable })),
  themes: themeConfigs.map(({ id, label }) => ({ id, label })),
  concepts: (ontology.concepts || []).filter(({ id, label }) => id !== "risk.sensitive" && !/sensible|sensitive/i.test(label)).map(({ id, label, parent }) => ({ id, label, parent }))
})};
let activeId=KM_INDEX[0]?.id||"", topic="Tous", selected=new Set();
const byId=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
const norm=s=>String(s??"").toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g,"");
function loadSelection(){try{return JSON.parse(localStorage.getItem("kmSearchSelectionV112")||"[]").filter(id=>KM_INDEX.some(item=>item.id===id))}catch{return[]}}
function saveSelection(){try{localStorage.setItem("kmSearchSelectionV112",JSON.stringify([...selected]))}catch{}}
function toast(msg){const t=byId("toast");t.textContent=msg;t.classList.add("on");setTimeout(()=>t.classList.remove("on"),1600)}
function isSensitiveStatus(s){return s==="#ROUGE"}
function statusLabel(s){return s}
function statusClass(s){return s==="#ROUGE"?"hot":s==="a verifier"?"warn":s==="sensible"?"warn":""}
function statusRank(v){return v==="#ROUGE"?0:v==="sensible"?1:v==="a verifier"?2:v==="actif"?3:4}
function dateRank(item){return Date.parse(item.integratedAt||"")||0}
function itemTerms(item){return norm([item.title,item.type,item.bucket,item.status,item.tags.join(" "),item.githubTopics?.join(" "),item.concepts.map(c=>c.label).join(" "),item.summary,item.raw].join(" "))}
function tokensOf(value){return norm(value).split(/[^a-z0-9]+/).filter(Boolean)}
function hasToken(value,term){return tokensOf(value).includes(term)}
function fieldScore(value,term,weight){const text=norm(value);if(!text)return 0;if(hasToken(text,term))return weight;if(term.length>3&&text.includes(term))return Math.max(1,Math.round(weight*.25));return 0}
function queryTerms(){return norm(byId("search").value).split(/\\s+/).filter(Boolean)}
function searchScore(item,terms){if(!terms.length)return 1;let total=0;for(const term of terms){let score=0;score+=fieldScore(item.title,term,100);score+=fieldScore(item.tags.join(" "),term,80);score+=fieldScore((item.githubTopics||[]).join(" "),term,80);score+=fieldScore(item.type,term,45);score+=fieldScore(item.themeLabel+" "+item.folderLabel+" "+item.status,term,35);score+=fieldScore(item.concepts.map(c=>c.label).join(" "),term,30);score+=fieldScore(item.summary,term,20);score+=fieldScore(item.raw,term,6);if(!score)return 0;total+=score}return total}
function filteredItems(){const terms=queryTerms(), status=byId("statusFilter").value, folder=byId("folderFilter").value, theme=byId("themeFilter").value, concept=byId("conceptFilter").value, tag=norm(byId("tagFilter").value), sort=byId("sort").value;let rows=KM_INDEX.map(item=>({...item,_score:searchScore(item,terms)})).filter(item=>item._score>0);rows=rows.filter(item=>topic==="Tous"||item.theme===topic);rows=rows.filter(item=>folder==="all"||item.folder===folder);rows=rows.filter(item=>theme==="all"||item.theme===theme);rows=rows.filter(item=>concept==="all"||item.concepts.some(c=>c.id===concept));rows=rows.filter(item=>status==="all"||item.status===status);rows=rows.filter(item=>!tag||hasToken(item.tags.join(" "),tag)||hasToken((item.githubTopics||[]).join(" "),tag)||norm(item.type).includes(tag)||norm(item.theme).includes(tag)||norm(item.folderLabel).includes(tag)||norm(item.concepts.map(c=>c.label).join(" ")).includes(tag));rows.sort((a,b)=>terms.length?b._score-a._score||dateRank(b)-dateRank(a)||a.title.localeCompare(b.title):sort==="title"?a.title.localeCompare(b.title):sort==="type"?a.theme.localeCompare(b.theme)||a.title.localeCompare(b.title):sort==="status"?statusRank(a.status)-statusRank(b.status)||a.title.localeCompare(b.title):dateRank(b)-dateRank(a)||a.title.localeCompare(b.title));return rows}
function activeItem(){return KM_INDEX.find(item=>item.id===activeId)||filteredItems()[0]||KM_INDEX[0]}
function highlight(text){let safe=esc(text);for(const term of queryTerms()){if(term.length<2)continue;safe=safe.replace(new RegExp(term.replace(/[.*+?^\\$\\{\\}()|[\\]\\\\]/g,"\\\\$&"),"ig"),m=>"<mark>"+m+"</mark>")}return safe}
function themeOfTag(tag,fallback){const text=norm(tag);if(/rouge|pentest|red|offensive|security/.test(text))return"security";if(/osint|threat|image|vehicle/.test(text))return"osint";if(/source|rss|x|twitter|monitor/.test(text))return"source";if(/github|code|dev|editor|coding/.test(text))return"dev";if(/llm|api|openai|provider/.test(text))return"llm";if(/agent|automation|ia|ai/.test(text))return"agent";if(/research|paper|citation/.test(text))return"research";if(/privacy|local|session|analytics/.test(text))return"privacy";if(/finance|trading/.test(text))return"finance";if(/directory|watch|inspiration|competitor|vibe/.test(text))return"watchlist";if(/media|video|voice|design/.test(text))return"media";return fallback||"tool"}
function inlineMd(text){const tick=String.fromCharCode(96);const links=[];let safe=esc(text).replace(new RegExp("\\\\[([^\\\\]]+)\\\\]\\\\((https?:\\\\/\\\\/[^)]+)\\\\)","g"),(_,label,url)=>{const id="@@LINK"+links.length+"@@";links.push('<a href="'+url+'" target="_blank" rel="noopener noreferrer">'+label+'</a>');return id});safe=safe.replace(new RegExp("(https?:\\\\/\\\\/[^\\\\s<]+)","g"),'<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>').replace(new RegExp(tick+"([^"+tick+"]+)"+tick,"g"),"<code>$1</code>");links.forEach((link,i)=>{safe=safe.replace("@@LINK"+i+"@@",link)});return safe}
function markdown(md){const lines=String(md||"").split("\\n");let out="", inList=false, inTable=false, tableHeaders=[];const close=()=>{if(inList){out+="</ul>";inList=false}if(inTable){out+="</tbody></table>";inTable=false;tableHeaders=[]}};for(const line of lines){if(/^\\|(.+)\\|$/.test(line)&&!/^\\|\\s*-/.test(line)){const cells=line.slice(1,-1).split("|").map(c=>c.trim());let isHeader=false;if(!inTable){close();tableHeaders=cells.map(c=>norm(c));out+="<table><tbody>";inTable=true;isHeader=true}out+="<tr>"+cells.map((c,i)=>"<td>"+(isHeader?inlineMd(c):inlineMdWithContext(c,/topics releves/.test(tableHeaders[i]||"")?"github-topic-list":""))+"</td>").join("")+"</tr>";continue}if(/^\\|\\s*-/.test(line))continue;if(inTable&&!/^\\|/.test(line))close();if(/^###\\s+/.test(line)){close();out+="<h3>"+inlineMd(line.replace(/^###\\s+/,""))+"</h3>";continue}if(/^##\\s+/.test(line)){close();out+="<h2>"+inlineMd(line.replace(/^##\\s+/,""))+"</h2>";continue}if(/^#\\s+/.test(line)){close();out+="<h1>"+inlineMd(line.replace(/^#\\s+/,""))+"</h1>";continue}if(/^[-*]\\s+/.test(line)){if(!inList){close();out+="<ul>";inList=true}out+="<li>"+inlineMdWithContext(line.replace(/^[-*]\\s+/,""),"")+"</li>";continue}if(!line.trim()){close();continue}close();out+="<p>"+inlineMdWithContext(line,"")+"</p>"}close();return out}
function renderStats(){const red=KM_INDEX.filter(i=>i.status==="#ROUGE").length, sen=KM_INDEX.filter(i=>i.status==="sensible").length, ver=KM_INDEX.filter(i=>i.status==="a verifier").length, watch=KM_INDEX.filter(i=>i.folder==="watch").length, resources=KM_INDEX.filter(i=>i.folder==="resources").length;byId("statsbar").innerHTML='<div class="stat"><span>Fiches</span><b>'+KM_INDEX.length+'</b></div><div class="stat"><span>Watch</span><b>'+watch+'</b></div><div class="stat danger"><span>#ROUGE</span><b>'+red+'</b></div><div class="stat"><span>Sensible</span><b>'+sen+'</b></div><div class="stat"><span>A verifier</span><b>'+ver+'</b></div><div class="stat"><span>Resources</span><b>'+resources+'</b></div>'}
function conceptDepth(c){let n=0,p=c.parent;while(p){n++;p=(KM_CONFIG.concepts.find(x=>x.id===p)||{}).parent}return n}
function renderFilters(){const folder=byId("folderFilter").value||"all", theme=byId("themeFilter").value||"all", concept=byId("conceptFilter").value||"all";byId("folderFilter").innerHTML='<option value="all">Tous dossiers</option>'+KM_CONFIG.folders.map(f=>'<option value="'+esc(f.id)+'" '+(folder===f.id?'selected':'')+'>'+esc(f.label)+'</option>').join("");byId("themeFilter").innerHTML='<option value="all">Tous themes</option>'+KM_CONFIG.themes.map(t=>'<option value="'+esc(t.id)+'" '+(theme===t.id?'selected':'')+'>'+esc(t.label)+'</option>').join("");byId("conceptFilter").innerHTML='<option value="all">Toute ontologie</option>'+KM_CONFIG.concepts.map(c=>'<option value="'+esc(c.id)+'" '+(concept===c.id?'selected':'')+'>'+esc(".".repeat(conceptDepth(c))+c.label)+'</option>').join("")}
function renderTopics(){const themes=[...new Set(KM_INDEX.map(i=>i.theme))].filter(Boolean);const topics=["Tous",...themes];byId("topics").innerHTML=topics.map(t=>'<button class="topic '+(t===topic?"active":"")+'" data-topic="'+esc(t)+'">'+esc(t==="Tous"?"Tous":(KM_CONFIG.themes.find(x=>x.id===t)?.label||t))+'</button>').join("")}
function renderBreadcrumb(){const item=activeItem();const parts=['<a href="index.html">KM</a>','<a href="search-v1.12.html">Recherche</a>'];if(item){parts.push('<button class="crumb-action" data-crumb-folder="'+esc(item.folder)+'">'+esc(item.folderLabel||item.folder)+'</button>');parts.push('<span>'+esc(item.title)+'</span>')}else{parts.push('<span>Aucune fiche</span>')}byId("breadcrumb").innerHTML=parts.join("<b>/</b>")}
function tagButton(label,cls){return '<button type="button" class="tag tag-btn '+esc(cls||"")+'" data-action="tag" data-tag="'+esc(label)+'">'+highlight(label)+'</button>'}
function sameTagTheme(tag,theme){const a=norm(tag).replace(/^#/,"").replace(/s$/,""),b=norm(theme).replace(/s$/,"");return a===b}
function githubTopicUrl(topic){return "https://github.com/topics/"+encodeURIComponent(String(topic||"").trim().toLowerCase())}
function topicLinks(text){return String(text||"").split(",").map(topic=>topic.trim()).filter(Boolean).map(topic=>/^aucun topic public$/i.test(topic)?esc(topic):'<a class="github-topic" href="'+githubTopicUrl(topic)+'" target="_blank" rel="noopener noreferrer">'+esc(topic)+'</a>').join(", ")}
function inlineMdWithContext(text,context){if(context==="github-topic-list")return topicLinks(text);if(/topics releves\\s*:/i.test(String(text||""))){const parts=String(text||"").split(/(topics releves\\s*:)/i);if(parts.length>=3)return inlineMd(parts[0]+parts[1]+" ")+topicLinks(parts.slice(2).join("").trim())}return inlineMd(text)}
function githubTopicChips(item,limit){return (item.githubTopics||[]).slice(0,limit||8).map(topic=>'<a class="tag github-topic" href="'+githubTopicUrl(topic)+'" target="_blank" rel="noopener noreferrer">'+esc(topic)+'</a>').join("")}
function displayConcepts(item){const broad=new Set(["Domaines","IA","Capacites","Risques","Cycle de vie"]);return item.concepts.filter(c=>c.parent&&!broad.has(c.label)&&c.label!==item.themeLabel&&c.label!==statusLabel(item.status)).slice(0,4)}
function sourceButtons(item,mode){const seen=new Set();const out=['<a class="'+(mode==="tag"?"tag github-link":"btn dark")+'" href="'+esc(item.repoUrl)+'" target="_blank" rel="noopener noreferrer">Fiche GitHub</a>'];const add=(label,url,primary)=>{const key=norm(url).replace(/\\/$/,"");if(!url||seen.has(key))return;seen.add(key);out.push('<a class="'+(mode==="tag"?(primary?"tag github-link":"tag"):"btn")+'" href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">'+esc(label)+'</a>')};add("Repo GitHub",item.github,true);(item.sources||[]).forEach(source=>add(source.label,source.url,source.kind==="github"));return out.join("")}
function sourceLinks(item){return sourceButtons(item,"tag")}
function cardSocialSources(item){const seen=new Set();const links=(item.sources||[]).filter(source=>source.kind==="social").map(source=>{const key=norm(source.url).replace(/\\/$/,"");if(!source.url||seen.has(key))return"";seen.add(key);return '<a class="tag source" href="'+esc(source.url)+'" target="_blank" rel="noopener noreferrer">Post Twitter</a>'}).join("");return links?'<div class="source-strip card-source-strip">'+links+'</div>':""}
function visibleTags(item){return item.tags.filter(t=>norm(t)!=="#watch"&&norm(t)!=="watch"&&!/^#?(sensible|sensitive|export)$/i.test(t)&&!sameTagTheme(t,item.theme)&&!(isSensitiveStatus(item.status)&&/^#?rouge$/i.test(t)))}
function isGenericKeyword(value){const key=norm(value).replace(/^#/,"").replace(/s$/,"");return /^(ai|ia|agent|artificial-intelligence|tool|utilitaire|outil|tools|veille|source|github|repo|actif|active|open-source|developer-tool|dev-tool|software|app|application)$/.test(key)}
function keywordChips(item,limit){const seen=new Set(), chips=[];const addTag=(label,cls)=>{const key=norm(label).replace(/^#/,"");if(!key||seen.has(key))return;seen.add(key);chips.push(tagButton(label,cls||themeOfTag(label,item.theme)))};const addTopic=topic=>{const key=norm(topic);if(!key||seen.has(key))return;seen.add(key);chips.push('<a class="tag github-topic" href="'+githubTopicUrl(topic)+'" target="_blank" rel="noopener noreferrer">'+esc(topic)+'</a>')};addTag("#"+item.theme,item.theme);(item.githubTopics||[]).forEach(addTopic);visibleTags(item).forEach(tag=>addTag(tag,themeOfTag(tag,item.theme)));displayConcepts(item).forEach(c=>addTag(c.label,item.theme));return chips.slice(0,limit||12).join("")}
function topicChips(item,limit){const seen=new Set(), chips=[];const addTopic=topic=>{const key=norm(topic).replace(/^#/,"");if(!key||seen.has(key)||isGenericKeyword(topic))return;seen.add(key);chips.push('<a class="tag github-topic" href="'+githubTopicUrl(topic)+'" target="_blank" rel="noopener noreferrer">'+esc(topic)+'</a>')};(item.githubTopics||[]).forEach(addTopic);return chips.slice(0,limit||12).join("")}
function functionKeywords(item){const text=norm(item.summary+" "+item.type+" "+item.title);const chips=[];const seen=new Set();const add=(label,cls)=>{const key=norm(label).replace(/^#/,"");if(!key||seen.has(key)||isGenericKeyword(label))return;seen.add(key);chips.push(tagButton(label,cls||themeOfTag(label,item.theme)))};if(/export/.test(text))add("export","source");if(/chatgpt|conversation/.test(text))add(/chatgpt/.test(text)?"chatgpt":"conversations","llm");if(/multi-format|pdf|markdown|json|csv/.test(text)){if(/pdf/.test(text))add("pdf","dev");if(/markdown/.test(text))add("markdown","dev");if(/json/.test(text))add("json","dev");if(/multi-format/.test(text))add("multi-format","dev")}if(/codebase|contexte/.test(text))add("contexte-codebase","dev");if(/agents? de code|coding-agents/.test(text))add("agents-code","agent");if(/gouvernance|governance/.test(text))add("gouvernance-ia","governance");if(/politique publique|public-policy|policy/.test(text))add("politique-publique","governance");if(/developpement|development|coding/.test(text))add("developpement","dev");if(/automat|workflow/.test(text))add("automatisation","agent");if(/orchestr|multi-agent/.test(text))add("orchestration","agent");if(/recherche|research/.test(text))add("recherche","research");if(/synthese|summary/.test(text))add("synthese","research");if(/scraping|extraction|extract/.test(text))add("extraction","dev");if(/memoire|memory/.test(text))add("memoire","agent");if(/osint|intelligence|threat/.test(text))add("investigation","osint");if(/video|image|media/.test(text))add("generation-media","media");if(/browser|web/.test(text))add("web","source");if(/document|pdf/.test(text))add("documents","dev");if(/agent/.test(text)&&!seen.has("agents-code")&&!seen.has("orchestration"))add("agent-ia","agent");if(!chips.length)visibleTags(item).filter(tag=>!isGenericKeyword(tag)).slice(0,4).forEach(tag=>add(tag,themeOfTag(tag,item.theme)));return chips.slice(0,6).join("")}
function functionLine(item){const chips=functionKeywords(item);return chips?'<div class="info-line"><span class="info-label">Fonction</span>'+chips+'</div>':""}
function topicsLine(item,limit){const chips=topicChips(item,limit);return chips?'<div class="info-line"><span class="info-label">Topics</span>'+chips+'</div>':""}
function statusBadge(item){return item.status==="#ROUGE"?tagButton(statusLabel(item.status),statusClass(item.status)):""}
function cardActions(item){return '<div class="card-actions">'+sourceButtons(item,"button")+'<button class="btn red" data-action="select">Selection</button></div>'}
function cardHtml(item){const active=item.id===activeId, sel=selected.has(item.id);return '<article class="news-card '+(active?"active":"")+' '+(sel?"selected":"")+'" data-id="'+esc(item.id)+'"><div class="check" data-action="select" title="Selectionner"></div><div><div class="title-row">'+statusBadge(item)+'<a class="tag github-link" href="'+esc(item.repoUrl)+'" target="_blank" rel="noopener noreferrer">Fiche GitHub</a><h3 class="news-title" data-action="open">'+highlight(item.title)+'</h3></div>'+cardSocialSources(item)+functionLine(item)+topicsLine(item,12)+cardActions(item)+'</div></article>'}
function renderFeed(){const rows=filteredItems();if(!rows.some(i=>i.id===activeId)&&rows[0])activeId=rows[0].id;const feedCount=byId("feedCount");if(feedCount)feedCount.textContent=rows.length+" resultats";byId("articleStatus").innerHTML="<span>"+rows.length+" fiches visibles</span><span>"+selected.size+" selectionnees</span>";byId("feed").innerHTML=rows.map(cardHtml).join("")||'<section class="note"><strong>Aucun resultat</strong><p>Vide la recherche ou change les filtres.</p></section>'}
function editUrl(item){return "http://127.0.0.1:8767/edit?path="+encodeURIComponent(item.path)}
async function archiveActive(){const item=activeItem();if(!item||!confirm("Archiver cette fiche ?"))return;const res=await fetch("http://127.0.0.1:8767/api/archive-fiche",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({path:item.path})});const json=await res.json();if(!json.ok){toast(json.error||"Archive impossible");return}toast("Fiche archivee");setTimeout(()=>location.reload(),900)}
function renderDetail(){const item=activeItem();if(!item)return;byId("detail").innerHTML='<section class="detail-title"><span class="eyebrow">Fiche</span><div class="titleline"><h1>'+esc(item.title)+'</h1></div><div class="source-strip"><span>'+esc(item.integratedAt||"date n/a")+'</span>'+sourceLinks(item)+'<span>'+esc(item.path)+'</span><span>'+esc(item.themeLabel)+'</span></div>'+functionLine(item)+topicsLine(item,24)+'<div class="detail-actions"><button class="btn dark" id="toggleFiche">Toutes les fiches</button><a class="btn" href="'+esc(editUrl(item))+'">Modifier</a><button class="btn" id="archiveActive">Archiver</button><a class="btn" href="'+esc(item.path)+'" target="_blank" rel="noopener noreferrer">Ouvrir .md</a><button class="btn" id="copyActive">Copier MD</button><button class="btn red" id="selectActive">Selection</button></div></section><section class="detail-body">'+markdown(item.raw||"")+'</section>'}
function itemMarkdown(item){return "## "+item.title+"\\n\\n- Type: "+item.type+"\\n\\n"+(item.raw||item.summary)+"\\n"}
function exportMarkdown(items){const rows=items.length?items:[activeItem()];const chapter=rows.map(item=>"- "+item.title+(item.summary?" : "+item.summary.replace(/\\s+/g," ").trim():"")).join("\\n");return "# KM Search v1.12 selection\\n\\n## Chapitrage\\n\\n"+chapter+"\\n\\n## Fiches\\n\\n"+rows.map(itemMarkdown).join("\\n")}
function download(name,text){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type:"text/plain"}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}
async function copy(text){await navigator.clipboard.writeText(text)}
function currentShareUrl(){const params=new URLSearchParams();const q=byId("search").value.trim(), folder=byId("folderFilter").value, theme=byId("themeFilter").value, concept=byId("conceptFilter").value, status=byId("statusFilter").value, tag=byId("tagFilter").value.trim();if(q)params.set("q",q);if(folder&&folder!=="all")params.set("folder",folder);if(theme&&theme!=="all")params.set("theme",theme);if(concept&&concept!=="all")params.set("concept",concept);if(status&&status!=="all")params.set("status",status);if(tag)params.set("tag",tag);if(activeItem())params.set("fiche",activeItem().id);return location.href.split("#")[0]+"#"+params.toString()}
function renderAll(){renderStats();renderFilters();renderTopics();renderFeed();renderDetail();renderBreadcrumb()}
function setFicheCollapsed(collapsed){byId("workspace").classList.toggle("fiche-collapsed",collapsed);byId("openFiche").classList.toggle("on",collapsed);const top=byId("toggleFicheTop");if(top)top.textContent=collapsed?"Afficher fiche":"Toutes les fiches";if(collapsed)setTimeout(()=>byId("search")?.focus(),0)}
function resetHomeState(){topic="Tous";byId("search").value="";byId("tagFilter").value="";byId("sort").value="date";byId("statusFilter").value="all";byId("folderFilter").value="all";byId("themeFilter").value="all";byId("conceptFilter").value="all";activeId=KM_INDEX[0]?.id||"";setFicheCollapsed(true);renderAll();byId("search").focus()}
function goHome(){history.pushState(null,"",location.href.split("#")[0]);resetHomeState();toast("Accueil KM")}
function toggleSelection(id){selected.has(id)?selected.delete(id):selected.add(id);saveSelection();renderAll()}
function applyHashState(){const raw=location.hash.replace(/^#/,"");const hash=new URLSearchParams(raw);if(!raw){resetHomeState();return}if(hash.get("q")!==null)byId("search").value=hash.get("q")||"";if(hash.get("status"))byId("statusFilter").value=hash.get("status");if(hash.get("tag")!==null)byId("tagFilter").value=hash.get("tag")||"";renderFilters();if(hash.get("folder"))byId("folderFilter").value=hash.get("folder");if(hash.get("theme"))byId("themeFilter").value=hash.get("theme");if(hash.get("concept"))byId("conceptFilter").value=hash.get("concept");if(hash.get("fiche")&&KM_INDEX.some(i=>i.id===hash.get("fiche"))){activeId=hash.get("fiche");setFicheCollapsed(false)}renderAll()}
document.addEventListener("click",e=>{if(e.target.id==="toggleFiche"||e.target.id==="toggleFicheHeader"||e.target.id==="toggleFicheTop"){const collapsed=!byId("workspace").classList.contains("fiche-collapsed");setFicheCollapsed(collapsed);toast(collapsed?"Liste affichee":"Fiche ouverte");return}if(e.target.id==="openFiche"){setFicheCollapsed(false);toast("Fiche ouverte");return}const tagBtn=e.target.closest('[data-action="tag"]');if(tagBtn){byId("tagFilter").value=tagBtn.dataset.tag||"";renderAll();toast("Tag filtre: "+(tagBtn.dataset.tag||""));return}const topicBtn=e.target.closest(".topic");if(topicBtn){topic=topicBtn.dataset.topic;renderAll();return}const card=e.target.closest(".news-card");if(card&&e.target.dataset.action==="select"){toggleSelection(card.dataset.id);return}if(card&&(e.target.dataset.action==="open"||!e.target.closest("a,button,.check"))){activeId=card.dataset.id;setFicheCollapsed(false);history.pushState(null,"","#fiche="+activeId);renderAll();return}if(e.target.id==="archiveActive"){archiveActive();return}if(e.target.id==="copyActive"){copy(itemMarkdown(activeItem())).then(()=>toast("Fiche active copiee"));return}if(e.target.id==="selectActive"){toggleSelection(activeItem().id);return}});
["search","sort","statusFilter","folderFilter","themeFilter","conceptFilter","tagFilter"].forEach(id=>["input","change","search","keyup"].forEach(evt=>byId(id).addEventListener(evt,renderAll)));
byId("clearSearch").onclick=()=>{byId("search").value="";byId("tagFilter").value="";renderAll();byId("search").focus()};
byId("copySelection").onclick=()=>{const items=KM_INDEX.filter(i=>selected.has(i.id));copy(exportMarkdown(items)).then(()=>toast("Selection copiee"))};
byId("exportSelection").onclick=()=>{const items=KM_INDEX.filter(i=>selected.has(i.id));download("km-search-v1.12-selection.md",exportMarkdown(items))};
byId("exportJson").onclick=()=>download("km-search-v1.12-index.json",JSON.stringify(KM_INDEX,null,2));
byId("copyShare").onclick=()=>copy(currentShareUrl()).then(()=>toast("Lien de vue copie"));
byId("watchShortcut").onclick=()=>{topic="Tous";byId("folderFilter").value="watch";byId("themeFilter").value="all";byId("conceptFilter").value="all";renderAll();toast("Watch affiche");byId("search").focus()};
byId("breadcrumb").addEventListener("click",e=>{const btn=e.target.closest("[data-crumb-folder]");if(!btn)return;byId("folderFilter").value=btn.dataset.crumbFolder;renderAll()});
byId("navBack").onclick=()=>history.back();
byId("navForward").onclick=()=>history.forward();
byId("navHome").onclick=goHome;
document.addEventListener("keydown",e=>{const t=e.target;if(e.key!=="Backspace"||t?.matches?.("input,textarea,select,[contenteditable=true]"))return;e.preventDefault();history.back()});
window.addEventListener("popstate",applyHashState);
window.addEventListener("hashchange",applyHashState);
selected=new Set(loadSelection());
applyHashState();
</script>
</body>
</html>`;

writeFileSync(outputFile, html);
const sharePages = writeSharePages(index);
console.log(`Wrote ${outputFile} with ${index.length} indexed documents.`);
console.log(`Wrote ${sharePages.length} share pages under ${relative(root, shareOutputDir)}.`);
