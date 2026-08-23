import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = process.env.KM_ROOT
  ? resolve(process.env.KM_ROOT)
  : fileURLToPath(new URL("..", import.meta.url)).replace(/\/$/, "");

const sourceHtml = readFileSync(join(root, "search-v1.12.html"), "utf8");
const match = sourceHtml.match(/const KM_INDEX=([\s\S]*?);\nconst KM_CONFIG=/);
if (!match) throw new Error("KM_INDEX not found in search-v1.12.html");

const sourceIndex = JSON.parse(match[1]);
const kmIndex = sourceIndex.map((item) => ({
  id: item.id,
  kind: "fiche",
  promptFolder: "fiches",
  title: item.title || item.path,
  summary: item.summary || item.type || "",
  type: item.type || "",
  status: item.status || "",
  theme: item.theme || "",
  themeLabel: item.themeLabel || item.theme || "",
  folder: item.folder || "",
  folderLabel: item.folderLabel || item.folder || "",
  path: item.path,
  repoUrl: item.repoUrl,
  sourceUrl: item.sourceUrl || item.github || "",
  tags: (item.tags || []).slice(0, 10),
  topics: (item.githubTopics || []).slice(0, 12),
  integratedAt: item.integratedAt || ""
}));

const promptsRoot = join(root, "prompts");
mkdirSync(promptsRoot, { recursive: true });

function clean(value) {
  return String(value || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[>*_|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function walkMarkdown(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return walkMarkdown(full);
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

function promptItem(file) {
  const path = relative(root, file);
  const relPrompt = relative(promptsRoot, file);
  const content = readFileSync(file, "utf8");
  const parts = relPrompt.split("/");
  const folder = parts.slice(0, -1).join("/") || "prompts";
  const title = first(content, /^#\s+(.+)$/m) || parts.at(-1).replace(/\.md$/, "");
  const tags = section(content, "Tags")
    .split(/,|\n/)
    .map(clean)
    .filter(Boolean)
    .slice(0, 12);
  return {
    id: `prompt-${relPrompt.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")}`,
    kind: "prompt",
    promptFolder: folder,
    title,
    summary: clean(section(content, "Usage") || section(content, "Objectif") || content).slice(0, 260),
    type: clean(section(content, "Type") || "Prompt"),
    status: "prompt",
    theme: "prompt",
    themeLabel: "Prompt",
    folder: "prompts",
    folderLabel: "Prompts",
    path,
    repoUrl: path,
    sourceUrl: "",
    tags,
    topics: [],
    prompt: content.trim(),
    integratedAt: ""
  };
}

const promptIndex = walkMarkdown(promptsRoot).map(promptItem);
const index = [...promptIndex, ...kmIndex];

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function safeJson(value) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Kprompt</title>
<style>
*,*::before,*::after{box-sizing:border-box}
:root{--ink:#151515;--muted:#66615a;--line:#d7d0c4;--paper:#f4f1ea;--panel:#fffefa;--soft:#ebe6dc;--red:#d90000;--blue:#245f8f}
body{margin:0;min-height:100vh;background:var(--paper);color:var(--ink);font-family:Arial,Helvetica,sans-serif}
button,input,select,textarea{font:inherit}button{cursor:pointer}
.top{position:sticky;top:0;z-index:5;background:var(--panel);border-bottom:3px solid var(--ink);display:grid;grid-template-columns:220px 1fr auto;gap:12px;align-items:center;padding:10px 12px}
.brand{font-size:22px;font-weight:950;text-transform:uppercase;line-height:1}.brand span{color:var(--red)}
.sub{font-size:10px;font-weight:900;text-transform:uppercase;color:var(--muted)}
.stats{display:flex;gap:1px;background:var(--ink);border:1px solid var(--ink);width:max-content}.stat{background:#fff;padding:5px 8px;font-size:10px;font-weight:900;text-transform:uppercase}.stat b{font-size:14px}
.actions{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}.btn{border:1px solid var(--line);background:#fff;color:var(--ink);padding:7px 9px;font-size:10px;font-weight:950;text-transform:uppercase;text-decoration:none}.btn:hover{background:var(--ink);border-color:var(--ink);color:#fff}.btn.dark{background:var(--ink);border-color:var(--ink);color:#fff}.btn.red{background:var(--red);border-color:var(--red);color:#fff}
.grid{display:grid;grid-template-columns:minmax(320px,.95fr) minmax(340px,1fr) minmax(360px,1.05fr);gap:10px;padding:10px;height:calc(100vh - 61px)}
.panel{min-height:0;background:var(--panel);border:2px solid var(--ink);box-shadow:4px 4px 0 rgba(217,0,0,.18);display:flex;flex-direction:column}
.panel header{min-height:38px;border-bottom:2px solid var(--ink);display:flex;align-items:center;justify-content:space-between;gap:8px;padding:0 10px}
h1,h2,h3,p{margin:0}h2{font-size:12px;font-weight:950;text-transform:uppercase}.note{font-size:9px;font-weight:900;text-transform:uppercase;color:var(--muted)}
.scroll{min-height:0;overflow:auto;padding:10px}.tools{position:sticky;top:0;background:var(--panel);border-bottom:2px solid var(--ink);display:grid;gap:7px;margin:-10px -10px 10px;padding:10px}.tools input,.tools select,.compose input,.compose select,.compose textarea{border:1px solid var(--line);background:#fff;padding:8px;font-size:12px}.tools input{border:2px solid var(--ink);font-weight:900}
.row{display:grid;grid-template-columns:1fr 1fr;gap:7px}.meta{display:flex;justify-content:space-between;gap:8px;border:1px solid var(--line);background:#fbfaf6;padding:7px 8px;margin-bottom:10px;font-size:10px;font-weight:900;text-transform:uppercase;color:var(--muted)}
.card{border:1px solid var(--line);border-left:4px solid var(--line);background:#fff;padding:10px;margin-bottom:8px}.card.active{border-left-color:var(--red);outline:2px solid rgba(217,0,0,.14)}.card.selected{background:#fff8e2}.card h3{font-size:15px;line-height:1.2;margin:0 0 6px}.card h3 button{border:0;background:transparent;text-align:left;padding:0;font:inherit;font-weight:950}.card p{font-size:12px;line-height:1.4;color:#333}.chips{display:flex;gap:5px;flex-wrap:wrap;margin:0 0 7px}.chip{border:1px solid var(--line);background:var(--soft);padding:3px 6px;font-size:9px;font-weight:950;text-transform:uppercase}.chip.red{background:#fff0ef;border-color:#e6b2b2;color:#8f0000}.chip.blue{background:#edf4fb;border-color:#b7cce0;color:var(--blue)}
.detail-title{border:1px solid var(--line);background:#fff;padding:12px;margin-bottom:10px;box-shadow:5px 5px 0 rgba(21,21,21,.1)}.detail-title h1{font-size:24px;line-height:1.08;margin-bottom:8px}.detail-title p{font-size:13px;line-height:1.45;color:#333}.detail-list{border:1px solid var(--line);background:#fff;padding:12px;font-size:12px;line-height:1.5}.detail-list div{margin-bottom:8px;overflow-wrap:anywhere}.detail-list b{display:block;text-transform:uppercase;font-size:10px;color:var(--muted)}
.compose{display:grid;gap:8px}.compose textarea{min-height:74px;resize:vertical}.output{border:2px solid var(--ink);background:#fff;min-height:360px;padding:12px;white-space:pre-wrap;overflow:auto;font:12px/1.45 Menlo,Consolas,monospace}
.empty{border:1px solid var(--line);background:#fff;padding:14px;font-size:13px;color:var(--muted)}.toast{position:fixed;right:18px;top:72px;background:#fff;border:1px solid var(--line);border-left:4px solid var(--blue);padding:10px 12px;font-size:12px;display:none}.toast.on{display:block}
@media(max-width:1100px){.top{grid-template-columns:1fr}.grid{height:auto;grid-template-columns:1fr}.panel{min-height:420px}.stats{width:auto;overflow:auto}.actions{justify-content:flex-start}}@media(max-width:620px){.row{grid-template-columns:1fr}}
</style>
</head>
<body>
<header class="top">
  <div><div class="brand"><span>K</span>prompt</div><div class="sub">Prompts · dossiers · fiches KM</div></div>
  <div class="stats" id="stats"></div>
  <div class="actions">
    <a class="btn" href="search-v1.12.html">KM Search</a>
    <a class="btn" href="kprompt-index.json">JSON</a>
    <button class="btn dark" id="copyBtn">Copier prompt</button>
    <button class="btn red" id="downloadBtn">Export .md</button>
  </div>
</header>
<main class="grid">
  <section class="panel">
    <header><h2>Recherche</h2><span class="note" id="count"></span></header>
    <div class="scroll">
      <div class="tools">
        <input id="q" type="search" autocomplete="off" placeholder="chercher agent, osint, llm, github...">
        <div class="row">
          <select id="promptFolder"></select>
          <select id="kind"><option value="all">Tout</option><option value="prompt">Prompts</option><option value="fiche">Fiches KM</option></select>
        </div>
        <div class="row">
          <select id="theme"></select>
          <select id="status"><option value="all">Tous statuts</option><option value="prompt">Prompt</option><option value="#ROUGE">#ROUGE</option><option value="sensible">Sensible</option><option value="a verifier">A verifier</option><option value="actif">Actif</option></select>
        </div>
      </div>
      <div class="meta"><span id="visible"></span><span id="selected"></span></div>
      <div id="feed"></div>
    </div>
  </section>
  <section class="panel">
    <header><h2>Fiche active</h2><span class="note" id="path"></span></header>
    <div class="scroll" id="detail"></div>
  </section>
  <section class="panel">
    <header><h2>Prompt</h2><span class="note">selection KM</span></header>
    <div class="scroll compose">
      <div class="row">
        <select id="mode"><option value="dev">Dev</option><option value="veille">Veille</option><option value="audit">Audit</option><option value="synthese">Synthese</option><option value="agent">Agent</option></select>
        <select id="depth"><option value="compact">Compact</option><option value="normal">Normal</option></select>
      </div>
      <input id="objective" placeholder="Objectif">
      <textarea id="constraints" placeholder="Contraintes / format attendu"></textarea>
      <pre class="output" id="prompt"></pre>
    </div>
  </section>
</main>
<div class="toast" id="toast"></div>
<script type="application/json" id="data">${safeJson(index)}</script>
<script>
(function(){
  "use strict";
  var ITEMS = JSON.parse(document.getElementById("data").textContent);
  var selected = {};
  var activeId = ITEMS[0] ? ITEMS[0].id : "";
  var modes = {
    dev: "Tu es agent dev. Utilise le contexte KM, puis propose l'action minimale, les risques et les tests.",
    veille: "Tu es analyste veille. Classe les signaux, dedoublonne et propose les prochaines fiches utiles.",
    audit: "Tu es auditeur. Cherche contradictions, manques, risques et actions correctives.",
    synthese: "Tu produis une synthese courte, sourcee et exploitable.",
    agent: "Tu prepares un agent : mission, contexte, outils, limites, checkpoints et definition de fini."
  };
  function el(id){ return document.getElementById(id); }
  function esc(v){ return String(v == null ? "" : v).replace(/[&<>"']/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]; }); }
  function norm(v){ return String(v == null ? "" : v).toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g,""); }
  function tokenText(item){ return norm([item.title,item.summary,item.type,item.status,item.themeLabel,item.folderLabel,item.promptFolder,item.tags.join(" "),item.topics.join(" "),item.prompt].join(" ")); }
  function score(item, terms){
    if(!terms.length) return 1;
    var text = tokenText(item);
    for(var i=0;i<terms.length;i++){ if(text.indexOf(terms[i]) < 0) return 0; }
    var s = 0;
    terms.forEach(function(t){
      if(norm(item.title).indexOf(t) >= 0) s += 50;
      if(norm(item.tags.join(" ")).indexOf(t) >= 0) s += 30;
      if(norm(item.topics.join(" ")).indexOf(t) >= 0) s += 25;
      if(norm(item.summary).indexOf(t) >= 0) s += 12;
      s += 1;
    });
    return s;
  }
  function terms(){ return norm(el("q").value).split(/\\s+/).filter(Boolean); }
  function filtered(){
    var ts = terms(), theme = el("theme").value, status = el("status").value, kind = el("kind").value, promptFolder = el("promptFolder").value;
    return ITEMS.map(function(item){ return Object.assign({_score: score(item, ts)}, item); })
      .filter(function(item){ return item._score > 0; })
      .filter(function(item){ return kind === "all" || item.kind === kind; })
      .filter(function(item){ return promptFolder === "all" || item.promptFolder === promptFolder; })
      .filter(function(item){ return theme === "all" || item.theme === theme; })
      .filter(function(item){ return status === "all" || item.status === status; })
      .sort(function(a,b){ return b._score - a._score || String(b.integratedAt).localeCompare(String(a.integratedAt)) || a.title.localeCompare(b.title); })
      .slice(0, 30);
  }
  function chip(text, cls){ return '<span class="chip '+(cls||"")+'">'+esc(text)+'</span>'; }
  function statusClass(value){ return value === "#ROUGE" ? "red" : "blue"; }
  function selectedCount(){ return Object.keys(selected).length; }
  function selectedItems(){
    var rows = ITEMS.filter(function(item){ return selected[item.id]; });
    return rows.length ? rows : filtered().slice(0, 5);
  }
  function itemPrompt(item){
    if(item.kind === "prompt") return "- prompt: "+item.title+"\\n  dossier: "+item.promptFolder+"\\n  chemin: "+item.path+"\\n  contenu:\\n"+String(item.prompt || "").split("\\n").map(function(line){return "    "+line;}).join("\\n");
    var lines = ["- titre: "+item.title, "  statut: "+item.status, "  theme: "+item.themeLabel, "  fiche: "+item.repoUrl];
    if(item.sourceUrl) lines.push("  source: "+item.sourceUrl);
    lines.push("  resume: "+(item.summary || item.type || "").replace(/\\s+/g," ").trim());
    if(el("depth").value === "normal"){
      if(item.tags.length) lines.push("  tags: "+item.tags.join(", "));
      if(item.topics.length) lines.push("  topics: "+item.topics.join(", "));
    }
    return lines.join("\\n");
  }
  function buildPrompt(){
    var rows = selectedItems();
    return "# Kprompt\\n\\n" +
      modes[el("mode").value] + "\\n\\n" +
      "## Objectif\\n" + (el("objective").value.trim() || "Analyse ces fiches KM et propose la prochaine action utile.") + "\\n\\n" +
      "## Contraintes\\n" + (el("constraints").value.trim() || "Reponse courte, factuelle, avec liens vers fiches et sources. Ne pas inventer.") + "\\n\\n" +
      "## Prompts et contexte\\n" + rows.map(itemPrompt).join("\\n\\n") + "\\n\\n" +
      "## Sortie attendue\\n- Synthese utile\\n- Points importants\\n- Risques ou limites\\n- Actions suivantes\\n- Sources utilisees";
  }
  function activeItem(){ return ITEMS.find(function(item){ return item.id === activeId; }) || filtered()[0] || ITEMS[0]; }
  function renderStats(){
    var prompts = ITEMS.filter(function(item){ return item.kind === "prompt"; }).length;
    var fiches = ITEMS.filter(function(item){ return item.kind === "fiche"; }).length;
    var red = ITEMS.filter(function(item){ return item.status === "#ROUGE"; }).length;
    el("stats").innerHTML = '<div class="stat"><b>'+prompts+'</b> prompts</div><div class="stat"><b>'+fiches+'</b> fiches</div><div class="stat"><b>'+red+'</b> #ROUGE</div><div class="stat"><b>'+selectedCount()+'</b> selection</div>';
  }
  function renderFilters(){
    var seen = {};
    var themes = ITEMS.map(function(item){ return [item.theme, item.themeLabel]; }).filter(function(row){ if(!row[0] || seen[row[0]]) return false; seen[row[0]] = true; return true; }).sort(function(a,b){ return a[1].localeCompare(b[1]); });
    seen = {};
    var folders = ITEMS.map(function(item){ return item.promptFolder; }).filter(function(folder){ if(!folder || seen[folder]) return false; seen[folder] = true; return true; }).sort();
    el("theme").innerHTML = '<option value="all">Tous themes</option>' + themes.map(function(row){ return '<option value="'+esc(row[0])+'">'+esc(row[1])+'</option>'; }).join("");
    el("promptFolder").innerHTML = '<option value="all">Tous dossiers</option>' + folders.map(function(folder){ return '<option value="'+esc(folder)+'">'+esc(folder)+'</option>'; }).join("");
  }
  function renderFeed(){
    var rows = filtered();
    if(rows.length && !rows.some(function(item){ return item.id === activeId; })) activeId = rows[0].id;
    el("count").textContent = rows.length + " visibles";
    el("visible").textContent = rows.length + " resultats";
    el("selected").textContent = selectedCount() + " selectionnees";
    el("feed").innerHTML = rows.map(function(item){
      return '<article class="card '+(item.id===activeId?'active ':'')+(selected[item.id]?'selected':'')+'" data-id="'+esc(item.id)+'">' +
        '<div class="chips">'+chip(item.kind)+chip(item.status,statusClass(item.status))+chip(item.promptFolder||item.themeLabel)+chip(item.folderLabel)+'</div>' +
        '<h3><button data-open="'+esc(item.id)+'">'+esc(item.title)+'</button></h3>' +
        '<p>'+esc(item.summary || item.type)+'</p>' +
        '<div class="actions" style="justify-content:flex-start;margin-top:8px"><button class="btn red" data-select="'+esc(item.id)+'">Selection</button><a class="btn" href="'+esc(item.repoUrl)+'">Fiche</a></div>' +
      '</article>';
    }).join("") || '<div class="empty">Aucun resultat.</div>';
  }
  function renderDetail(){
    var item = activeItem();
    if(!item) return;
    el("path").textContent = item.path;
    el("detail").innerHTML = '<section class="detail-title"><h1>'+esc(item.title)+'</h1><p>'+esc(item.summary || item.type)+'</p><div class="chips">'+chip(item.kind)+chip(item.status,statusClass(item.status))+chip(item.promptFolder||item.themeLabel)+item.tags.slice(0,6).map(function(t){return chip(t)}).join("")+'</div></section>' +
      '<section class="detail-list"><div><b>Fiche</b><a href="'+esc(item.repoUrl)+'">'+esc(item.repoUrl)+'</a></div>' +
      (item.sourceUrl ? '<div><b>Source</b><a href="'+esc(item.sourceUrl)+'">'+esc(item.sourceUrl)+'</a></div>' : '') +
      '<div><b>Dossier</b>'+esc(item.promptFolder || "-")+'</div><div><b>Tags</b>'+esc(item.tags.join(", ") || "-")+'</div><div><b>Topics</b>'+esc(item.topics.join(", ") || "-")+'</div>' +
      (item.prompt ? '<div><b>Prompt</b><pre>'+esc(item.prompt)+'</pre></div>' : '') + '</section>';
  }
  function renderAll(){ renderStats(); renderFeed(); renderDetail(); el("prompt").textContent = buildPrompt(); }
  document.addEventListener("click", function(event){
    var open = event.target.getAttribute("data-open");
    var select = event.target.getAttribute("data-select");
    if(open){ activeId = open; renderAll(); }
    if(select){ selected[select] ? delete selected[select] : selected[select] = true; renderAll(); }
  });
  ["q","promptFolder","kind","theme","status","mode","depth","objective","constraints"].forEach(function(id){
    el(id).addEventListener("input", renderAll);
    el(id).addEventListener("change", renderAll);
  });
  el("copyBtn").addEventListener("click", function(){
    var text = buildPrompt();
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(function(){ flash("Prompt copie"); });
    } else {
      window.prompt("Copier le prompt", text);
    }
  });
  el("downloadBtn").addEventListener("click", function(){
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([buildPrompt()], { type: "text/markdown" }));
    a.download = "kprompt.md";
    a.click();
    setTimeout(function(){ URL.revokeObjectURL(a.href); }, 400);
  });
  function flash(text){ var box = el("toast"); box.textContent = text; box.className = "toast on"; setTimeout(function(){ box.className = "toast"; }, 1200); }
  renderFilters();
  renderAll();
})();
</script>
</body>
</html>`;

writeFileSync(join(root, "kprompt-index.json"), `${JSON.stringify(index, null, 2)}\n`, "utf8");
writeFileSync(join(root, "kprompt.html"), html, "utf8");
console.log(`Wrote kprompt.html with ${promptIndex.length} prompts and ${kmIndex.length} KM fiches.`);
console.log("Open kprompt.html directly; no server required.");
