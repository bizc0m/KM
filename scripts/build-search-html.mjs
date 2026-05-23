import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url)).replace(/\/$/, "");
const outputFile = join(root, "search.html");
const includeDirs = ["km", "watch", "themes", "process"];
const includeFiles = ["README.md", "index.md", "sources.md"];

function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(fullPath));
    if (entry.isFile() && entry.name.endsWith(".md")) files.push(fullPath);
  }
  return files;
}

function firstMatch(content, pattern) {
  const match = content.match(pattern);
  return match ? match[1].trim() : "";
}

function sectionText(content, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`## ${escaped}\\n+([\\s\\S]*?)(\\n## |$)`, "i");
  const match = content.match(pattern);
  return match ? match[1].trim() : "";
}

function cleanText(value) {
  return value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[>#*_|\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractItem(filePath) {
  const relativePath = relative(root, filePath);
  const content = readFileSync(filePath, "utf8");
  const title = firstMatch(content, /^#\s+(.+)$/m) || relativePath;
  const canonical = firstMatch(content, /## Appel canonique\s+`([^`]+)`/i)
    || firstMatch(content, /`\s*([a-z]+:[^`]+)\s*`/i);
  const type = cleanText(sectionText(content, "Type").split("\n")[0] || inferType(relativePath));
  const tagsSection = sectionText(content, "Tags");
  const tags = tagsSection
    .split(/,|\n/)
    .map((tag) => cleanText(tag))
    .filter(Boolean)
    .slice(0, 12);
  const status = inferStatus(content);
  const summary = cleanText(sectionText(content, "Resume court") || sectionText(content, "Role") || content)
    .slice(0, 420);
  const body = cleanText(content).slice(0, 12000);

  return {
    title,
    canonical,
    type,
    tags,
    status,
    path: relativePath,
    github: `https://github.com/bizc0m/KM/blob/main/${relativePath}`,
    summary,
    body
  };
}

function inferType(relativePath) {
  if (relativePath.startsWith("watch/")) return "veille";
  if (relativePath.startsWith("themes/")) return "theme";
  if (relativePath.startsWith("process/")) return "process";
  if (relativePath.startsWith("km/")) return "km";
  return "document";
}

function inferStatus(content) {
  const typeSection = sectionText(content, "Type");
  const tagsSection = sectionText(content, "Tags");
  const classificationSection = sectionText(content, "Classification");
  if (
    /#ROUGE/i.test(typeSection)
    || /#ROUGE/i.test(tagsSection)
    || /`#ROUGE`|^#ROUGE$/im.test(classificationSection)
  ) return "#ROUGE";
  if (/a verifier|à vérifier/i.test(content)) return "a verifier";
  if (/sensible/i.test(content)) return "sensible";
  return "actif";
}

const markdownFiles = [
  ...includeFiles.map((file) => join(root, file)).filter((file) => statSync(file, { throwIfNoEntry: false })),
  ...includeDirs.flatMap((dir) => walk(join(root, dir)))
];

const index = markdownFiles
  .map(extractItem)
  .sort((a, b) => (a.canonical || a.title).localeCompare(b.canonical || b.title));

const generatedAt = new Date().toISOString();
const html = `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>KM Search</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #0d0f12;
      --panel: #15181d;
      --panel-soft: #1b2027;
      --text: #f2f4f7;
      --muted: #9aa4b2;
      --line: #2a313a;
      --accent: #6ee7b7;
      --warn: #f6c75c;
      --red: #ff6b6b;
      --blue: #7db7ff;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: var(--bg);
      color: var(--text);
      letter-spacing: 0;
    }
    main {
      width: min(1180px, calc(100vw - 32px));
      margin: 0 auto;
      padding: 28px 0 40px;
    }
    header {
      display: grid;
      gap: 10px;
      margin-bottom: 18px;
    }
    h1 {
      margin: 0;
      font-size: clamp(28px, 4vw, 46px);
      line-height: 1;
    }
    .meta {
      color: var(--muted);
      font-size: 14px;
    }
    .searchbar {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 10px;
      margin: 18px 0 12px;
    }
    input, select, button {
      border: 1px solid var(--line);
      background: var(--panel);
      color: var(--text);
      border-radius: 8px;
      font: inherit;
    }
    input {
      min-height: 48px;
      padding: 0 14px;
      font-size: 17px;
      outline: none;
    }
    input:focus { border-color: var(--accent); }
    button {
      min-height: 48px;
      padding: 0 14px;
      cursor: pointer;
    }
    .filters {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 18px;
    }
    .chip {
      border: 1px solid var(--line);
      background: var(--panel);
      color: var(--muted);
      padding: 8px 10px;
      border-radius: 999px;
      cursor: pointer;
      user-select: none;
      font-size: 14px;
    }
    .chip.active {
      color: #06110d;
      background: var(--accent);
      border-color: var(--accent);
    }
    .layout {
      display: grid;
      grid-template-columns: 260px 1fr;
      gap: 16px;
      align-items: start;
    }
    aside, .results {
      border: 1px solid var(--line);
      background: var(--panel);
      border-radius: 8px;
    }
    aside { padding: 14px; position: sticky; top: 16px; }
    .stat {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 9px 0;
      border-bottom: 1px solid var(--line);
      color: var(--muted);
      font-size: 14px;
    }
    .stat:last-child { border-bottom: 0; }
    .stat strong { color: var(--text); }
    .results { overflow: hidden; }
    .result {
      padding: 16px;
      border-bottom: 1px solid var(--line);
      display: grid;
      gap: 10px;
    }
    .result:last-child { border-bottom: 0; }
    .result h2 {
      margin: 0;
      font-size: 18px;
      line-height: 1.25;
    }
    .result a { color: var(--text); text-decoration: none; }
    .result a:hover { color: var(--accent); }
    .summary { color: var(--muted); line-height: 1.55; }
    .badges {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      align-items: center;
    }
    .badge {
      color: var(--muted);
      background: var(--panel-soft);
      border: 1px solid var(--line);
      border-radius: 999px;
      padding: 4px 8px;
      font-size: 12px;
    }
    .badge.red { color: #250707; background: var(--red); border-color: var(--red); }
    .badge.warn { color: #201600; background: var(--warn); border-color: var(--warn); }
    .badge.blue { color: #06111f; background: var(--blue); border-color: var(--blue); }
    .path {
      color: var(--muted);
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 12px;
      overflow-wrap: anywhere;
    }
    mark {
      background: rgba(110, 231, 183, .22);
      color: inherit;
      padding: 0 2px;
      border-radius: 3px;
    }
    @media (max-width: 760px) {
      main { width: min(100vw - 20px, 680px); padding-top: 18px; }
      .layout { grid-template-columns: 1fr; }
      aside { display: none; }
      .searchbar { grid-template-columns: 1fr; }
      .filters { overflow-x: auto; flex-wrap: nowrap; padding-bottom: 2px; }
      .chip { white-space: nowrap; }
    }
  </style>
</head>
<body>
  <main>
    <header>
      <h1>KM Search</h1>
      <div class="meta">${index.length} fiches indexees · genere le ${generatedAt} · source bizc0m/KM</div>
    </header>
    <section class="searchbar">
      <input id="query" type="search" placeholder="Rechercher un appel, outil, tag, risque, source..." autocomplete="off" autofocus>
      <button id="clear" type="button">Effacer</button>
    </section>
    <nav class="filters" aria-label="Filtres">
      <span class="chip active" data-filter="all">Tout</span>
      <span class="chip" data-filter="watch/">Watch</span>
      <span class="chip" data-filter="themes/">Themes</span>
      <span class="chip" data-filter="process/">Process</span>
      <span class="chip" data-filter="#ROUGE">#ROUGE</span>
      <span class="chip" data-filter="sensible">Sensible</span>
      <span class="chip" data-filter="a verifier">A verifier</span>
    </nav>
    <section class="layout">
      <aside>
        <div class="stat"><span>Resultats</span><strong id="count">0</strong></div>
        <div class="stat"><span>#ROUGE</span><strong id="redCount">0</strong></div>
        <div class="stat"><span>Sensibles</span><strong id="sensitiveCount">0</strong></div>
        <div class="stat"><span>A verifier</span><strong id="verifyCount">0</strong></div>
      </aside>
      <section class="results" id="results" aria-live="polite"></section>
    </section>
  </main>
  <script>
    const KM_INDEX = ${JSON.stringify(index)};
    const state = { query: "", filter: "all" };
    const queryInput = document.getElementById("query");
    const resultsEl = document.getElementById("results");
    const countEl = document.getElementById("count");
    const redCountEl = document.getElementById("redCount");
    const sensitiveCountEl = document.getElementById("sensitiveCount");
    const verifyCountEl = document.getElementById("verifyCount");

    function normalize(value) {
      return value.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "");
    }

    function scoreItem(item, terms) {
      if (!terms.length) return 1;
      const haystack = normalize([item.title, item.canonical, item.type, item.status, item.tags.join(" "), item.summary, item.body].join(" "));
      let score = 0;
      for (const term of terms) {
        if (!haystack.includes(term)) return 0;
        if (normalize(item.title).includes(term)) score += 8;
        if (normalize(item.canonical || "").includes(term)) score += 7;
        if (normalize(item.tags.join(" ")).includes(term)) score += 4;
        if (normalize(item.summary).includes(term)) score += 2;
        score += 1;
      }
      return score;
    }

    function matchesFilter(item) {
      if (state.filter === "all") return true;
      if (state.filter.endsWith("/")) return item.path.startsWith(state.filter);
      if (state.filter === "#ROUGE") return item.status === "#ROUGE" || item.tags.includes("#ROUGE");
      if (state.filter === "sensible") return normalize(item.status).includes("sensible") || item.body.toLowerCase().includes("sensible");
      if (state.filter === "a verifier") return normalize(item.status).includes("verifier") || item.tags.includes("to-verify");
      return true;
    }

    function highlight(text, terms) {
      let safe = String(text || "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char]));
      for (const term of terms) {
        if (!term) continue;
        const escaped = term.replace(/[.*+?^\\$\\{\\}()|[\\]\\\\]/g, "\\\\$&");
        safe = safe.replace(new RegExp(escaped, "ig"), (match) => "<mark>" + match + "</mark>");
      }
      return safe;
    }

    function badgeClass(status) {
      if (status === "#ROUGE") return "red";
      if (normalize(status).includes("verifier")) return "warn";
      if (normalize(status).includes("sensible")) return "blue";
      return "";
    }

    function render() {
      const terms = normalize(state.query).split(/\\s+/).filter(Boolean);
      const rows = KM_INDEX
        .map((item) => ({ item, score: scoreItem(item, terms) }))
        .filter((row) => row.score > 0 && matchesFilter(row.item))
        .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
        .slice(0, 80);

      countEl.textContent = rows.length;
      redCountEl.textContent = KM_INDEX.filter((item) => item.status === "#ROUGE").length;
      sensitiveCountEl.textContent = KM_INDEX.filter((item) => normalize(item.status).includes("sensible")).length;
      verifyCountEl.textContent = KM_INDEX.filter((item) => normalize(item.status).includes("verifier")).length;

      if (!rows.length) {
        resultsEl.innerHTML = '<article class="result"><h2>Aucun resultat</h2><p class="summary">Essaie un appel canonique, un tag, un outil ou un risque.</p></article>';
        return;
      }

      resultsEl.innerHTML = rows.map(({ item }) => {
        const tags = item.tags.slice(0, 8).map((tag) => '<span class="badge">' + highlight(tag, terms) + '</span>').join("");
        return '<article class="result">'
          + '<h2><a href="' + item.github + '" target="_blank" rel="noreferrer">' + highlight(item.title, terms) + '</a></h2>'
          + '<div class="badges">'
          + '<span class="badge ' + badgeClass(item.status) + '">' + item.status + '</span>'
          + (item.canonical ? '<span class="badge">' + highlight(item.canonical, terms) + '</span>' : "")
          + '<span class="badge">' + highlight(item.type, terms) + '</span>'
          + tags
          + '</div>'
          + '<p class="summary">' + highlight(item.summary, terms) + '</p>'
          + '<div class="path">' + item.path + '</div>'
          + '</article>';
      }).join("");
    }

    queryInput.addEventListener("input", (event) => {
      state.query = event.target.value;
      render();
    });
    document.getElementById("clear").addEventListener("click", () => {
      state.query = "";
      queryInput.value = "";
      queryInput.focus();
      render();
    });
    document.querySelectorAll(".chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        document.querySelectorAll(".chip").forEach((node) => node.classList.remove("active"));
        chip.classList.add("active");
        state.filter = chip.dataset.filter;
        render();
      });
    });
    render();
  </script>
</body>
</html>
`;

writeFileSync(outputFile, html);
console.log(`Wrote ${outputFile} with ${index.length} indexed documents.`);
