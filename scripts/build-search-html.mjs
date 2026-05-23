import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url)).replace(/\/$/, "");
const outputFile = join(root, "search.html");
const includeDirs = ["km", "watch", "themes", "process"];
const includeFiles = ["README.md", "index.md", "sources.md"];

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    return entry.isFile() && entry.name.endsWith(".md") ? [fullPath] : [];
  });
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

function inferType(relativePath) {
  if (relativePath.startsWith("watch/")) return "watch";
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
  if (/a verifier|à vérifier|to-verify/i.test(content)) return "a verifier";
  if (/sensible|sensitive/i.test(content)) return "sensible";
  return "actif";
}

function riskScore(item) {
  if (item.status === "#ROUGE") return 98;
  if (item.status === "a verifier") return 74;
  if (item.status === "sensible") return 58;
  if (item.type === "process") return 36;
  return 22;
}

function maturityScore(item) {
  if (item.status === "actif") return 86;
  if (item.status === "sensible") return 64;
  if (item.status === "a verifier") return 38;
  return 30;
}

function extractItem(filePath) {
  const path = relative(root, filePath);
  const content = readFileSync(filePath, "utf8");
  const title = firstMatch(content, /^#\s+(.+)$/m) || path;
  const canonical = firstMatch(content, /## Appel canonique\s+`([^`]+)`/i)
    || firstMatch(content, /`\s*([a-z]+:[^`]+)\s*`/i);
  const type = cleanText(sectionText(content, "Type").split("\n")[0] || inferType(path)).slice(0, 80);
  const bucket = inferType(path);
  const tags = sectionText(content, "Tags")
    .split(/,|\n/)
    .map((tag) => cleanText(tag))
    .filter(Boolean)
    .slice(0, 12);
  const status = inferStatus(content);
  const summary = cleanText(sectionText(content, "Resume court") || sectionText(content, "Role") || content).slice(0, 520);
  const relations = sectionText(content, "Relations")
    .split("\n")
    .map((line) => cleanText(line))
    .filter(Boolean)
    .slice(0, 10);
  const body = cleanText(content).slice(0, 14000);

  const item = {
    id: path.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, ""),
    title,
    canonical,
    type,
    bucket,
    tags,
    status,
    path,
    github: `https://github.com/bizc0m/KM/blob/main/${path}`,
    summary,
    relations,
    body
  };
  item.risk = riskScore(item);
  item.maturity = maturityScore(item);
  return item;
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
<title>KM Lens Observatory</title>
<style>
*,*::before,*::after{box-sizing:border-box}
:root{
  --ink:#151515;--muted:#64615b;--dim:#8f8a82;--line:#d8d3c8;--paper:#f3f0e8;--panel:#fffefb;--soft:#ebe6dc;
  --red:#e50000;--red-soft:#fff0ef;--gold:#8b6914;--green:#1b7d49;--blue:#245f8f;--purple:#6d3ea0;
  --shadow:4px 4px 0 rgba(229,0,0,.22);--shadow-strong:7px 7px 0 rgba(21,21,21,.12)
}
html,body{height:100%}
body{margin:0;font-family:Inter,Arial,Helvetica,sans-serif;background:var(--paper);color:var(--ink);overflow:hidden}
button,input,select{font:inherit}button{cursor:pointer}
.app{height:100vh;display:grid;grid-template-rows:auto auto auto 1fr auto}
.topbar{min-height:62px;background:var(--panel);border-bottom:3px solid var(--ink);display:flex;align-items:center;gap:16px;padding:10px 18px}
.brandblock{min-width:270px}.brand{font-size:21px;font-weight:950;text-transform:uppercase;line-height:.92;display:flex;align-items:flex-end;gap:8px;flex-wrap:wrap}.brand span{color:var(--red)}.version-badge{border:1px solid var(--ink);background:var(--red);color:#fff;font-size:10px;font-weight:950;line-height:1;padding:4px 6px;text-transform:uppercase}
.subtitle{font-size:10px;text-transform:uppercase;letter-spacing:.12em;color:var(--muted);font-weight:850;margin-top:5px}.topspacer{flex:1}
.btn{border:1px solid var(--line);background:#fff;color:var(--ink);padding:7px 10px;font-size:10px;font-weight:900;text-transform:uppercase;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:30px}.btn:hover{background:var(--ink);border-color:var(--ink);color:#fff}.btn.dark{background:var(--ink);color:#fff;border-color:var(--ink)}.btn.red{background:var(--red);color:#fff;border-color:var(--red)}.btn.ai{border-color:#b8cce0;background:#eef4fb;color:var(--blue)}
.statsline{display:grid;grid-template-columns:minmax(420px,1.1fr) minmax(0,1.5fr);gap:1px;background:var(--ink);border-bottom:2px solid var(--ink)}
.top-ingest{background:#fbfaf6;padding:8px 14px;display:grid;grid-template-columns:minmax(0,1fr) 86px 74px;gap:6px}.top-ingest input,.top-ingest select{border:1px solid var(--line);background:#fff;color:var(--ink);padding:7px 8px;font-size:11px;min-width:0}
.statsbar{display:grid;grid-template-columns:repeat(5,1fr);gap:1px;background:var(--ink)}.stat{background:#fbfaf6;padding:8px 12px;display:flex;align-items:center;justify-content:space-between;gap:10px}.stat b{font-size:18px;line-height:1;font-weight:950}.stat span{font-size:9px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);font-weight:900}
.topic-rail{display:flex;gap:6px;flex-wrap:wrap;align-items:flex-start;overflow:visible;padding:8px 12px;border-bottom:2px solid var(--ink);background:#fbfaf6}.topic{white-space:nowrap;border:1px solid var(--line);background:#fff;padding:6px 8px;font-size:10px;font-weight:900;text-transform:uppercase}.topic.active{background:var(--ink);border-color:var(--ink);color:#fff}
.workspace{min-height:0;display:grid;grid-template-columns:minmax(390px,1.16fr) minmax(390px,.94fr) minmax(350px,.92fr);gap:12px;padding:12px}
.col{min-height:0;background:var(--panel);border:2px solid var(--ink);box-shadow:var(--shadow);display:flex;flex-direction:column}.col>header{min-height:43px;border-bottom:2px solid var(--ink);display:flex;align-items:center;justify-content:space-between;gap:10px;padding:0 12px}
h2{font-size:13px;font-weight:950;text-transform:uppercase;margin:0}.headnote{font-size:10px;color:var(--muted);font-weight:900;text-transform:uppercase}.scroll{overflow:auto;padding:12px;min-height:0}
.feed-tools{display:grid;grid-template-columns:90px 90px minmax(0,1fr);gap:7px;margin-bottom:10px}.feed-tools select,.feed-tools input{border:1px solid var(--line);background:#fff;padding:8px;font-size:11px;min-width:0}.article-status{border:1px solid var(--line);background:#fbfaf6;padding:7px 8px;margin:0 0 10px;font-size:10px;font-weight:900;text-transform:uppercase;color:var(--muted);display:flex;justify-content:space-between;gap:10px}
.news-card{display:grid;grid-template-columns:22px 1fr;gap:10px;border:1px solid var(--line);border-left:4px solid var(--line);background:#fff;padding:11px;margin-bottom:10px;transition:.12s}.news-card:hover{box-shadow:0 2px 12px rgba(0,0,0,.08);transform:translateY(-1px)}.news-card.active{border-left-color:var(--red);outline:2px solid rgba(229,0,0,.2)}.news-card.selected{background:#fff8e8}
.check{width:16px;height:16px;border:2px solid var(--line);display:flex;align-items:center;justify-content:center;margin-top:2px}.selected .check{background:var(--gold);border-color:var(--gold)}.selected .check::after{content:"✓";color:#fff;font-size:10px;font-weight:900}
.meta{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:6px}.tag{font-size:9px;text-transform:uppercase;font-weight:900;padding:3px 6px;border:1px solid var(--line);background:var(--soft)}.tag.hot{background:var(--red-soft);border-color:#edb8b8;color:#8f0000}.tag.ai{background:#eef4fb;border-color:#b8cce0;color:var(--blue)}.tag.warn{background:#fff6dd;border-color:#e6cf89;color:#6f5100}
.news-title{font-size:17px;line-height:1.18;font-weight:950;margin:0 0 6px;cursor:pointer}.news-title:hover{color:var(--red)}.excerpt{font-size:12px;line-height:1.5;color:#333;margin:0 0 8px}.source-strip{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin:0 0 8px;font-size:9px;font-weight:900;text-transform:uppercase;color:var(--muted)}.source-strip a,.source-strip span{border:1px solid var(--line);background:#fbfbf8;color:var(--ink);padding:4px 6px;text-decoration:none;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.rating-line{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:5px;align-items:stretch}.rating-strip{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin:0;min-width:0}.rating-pill{border:1px solid var(--line);background:#fbfbf8;padding:5px 4px;text-align:center;min-width:0}.rating-pill b{display:block;font-size:8px;text-transform:uppercase;color:rgba(21,21,21,.72);line-height:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.rating-pill span{font-size:15px;line-height:1.15;font-weight:950;color:var(--ink)}.total-pill{background:var(--ink);border-color:var(--ink)}.total-pill b,.total-pill span{color:#fff}
.iconbtn{width:auto;min-width:27px;height:100%;min-height:31px;border:1px solid var(--line);background:#fff;color:var(--muted);font-size:10px;font-weight:950;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;padding:0 7px}.iconbtn:hover{background:var(--ink);color:#fff}
.detail-title{border:1px solid var(--line);background:#fff;padding:14px;margin-bottom:12px;box-shadow:var(--shadow-strong)}.titleline{display:flex;align-items:flex-start;gap:12px}.detail-title h1{font-size:27px;line-height:1.05;font-weight:950;flex:1;margin:0}.scorebox{min-width:86px;border:2px solid var(--ink);text-align:center;padding:8px;background:#fbfbf8}.scorebox b{display:block;font-size:29px;line-height:1;color:var(--red)}.scorebox span{font-size:9px;text-transform:uppercase;font-weight:900;color:var(--muted)}.detail-title p{font-size:13px;line-height:1.5;color:#333;margin:10px 0 0}.detail-actions{display:flex;gap:6px;flex-wrap:wrap;margin-top:12px}
.section-title{font-size:10px;font-weight:950;text-transform:uppercase;color:var(--muted);border-bottom:1px solid var(--line);padding-bottom:7px;margin:0 0 9px}.axis-strip{display:grid;grid-template-columns:repeat(2,1fr);gap:6px;margin-bottom:12px}.axis-tile{border:1px solid var(--line);background:#fff;padding:8px}.axis-tile b{display:block;font-size:9px;text-transform:uppercase;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.bar{height:7px;background:var(--soft);position:relative;margin:7px 0}.bar::after{content:"";position:absolute;left:50%;top:-3px;width:2px;height:13px;background:var(--ink)}.fill{position:absolute;top:0;height:100%;background:var(--red)}.axis-tile span{font-size:13px;font-weight:950}.pos{color:var(--green)}.neg{color:var(--red)}.mid{color:#aa7100}
.heatmap{display:grid;grid-template-columns:96px repeat(4,1fr);border:1px solid var(--line);background:#fff;margin-bottom:12px}.heatmap div{min-height:31px;border-right:1px solid var(--line);border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:center;padding:4px;font-size:10px;font-weight:950;text-align:center}.heatmap .label{justify-content:flex-start;text-align:left;color:var(--muted);background:#fbfbf8}.heatmap .cell.hot{background:var(--red);color:#fff}.heatmap .cell.warm{background:#fff2ce}.heatmap .cell.cool{background:#eef4fb;color:var(--blue)}
.note,.tension,.cluster{border:1px solid var(--line);background:#fff;padding:10px;margin-bottom:8px}.tension{border-left:5px solid var(--red)}.note strong,.tension strong{display:block;font-size:11px;text-transform:uppercase;margin-bottom:5px}.note p,.tension p{font-size:12px;line-height:1.42;color:#333;margin:0}.cluster{display:flex;justify-content:space-between;gap:8px;font-size:12px}.cluster b{text-transform:uppercase}.cluster span{color:var(--muted)}
.brief-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin-bottom:10px}.brief{border:1px solid var(--line);background:#fbfbf8;padding:7px;min-width:0}.brief b{display:block;font-size:8px;text-transform:uppercase;color:var(--muted);margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.brief span{display:block;font-size:12px;font-weight:950;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.toast{position:fixed;right:18px;top:78px;background:#fff;border:1px solid var(--line);border-left:4px solid var(--blue);padding:10px 13px;font-size:11px;box-shadow:0 4px 18px rgba(0,0,0,.12);z-index:20;display:none}.toast.on{display:block}
.footer{border-top:2px solid var(--line);background:#fff;color:var(--muted);font-size:10px;display:flex;justify-content:space-between;gap:12px;padding:8px 14px}.footer b{color:var(--ink)}
mark{background:rgba(229,0,0,.12);color:inherit;padding:0 2px}
@media(max-width:1240px){body{overflow:auto}.app{height:auto;min-height:100vh}.workspace{grid-template-columns:1fr}.col{min-height:520px}.axis-strip{grid-template-columns:repeat(2,1fr)}}
@media(max-width:720px){.topbar,.footer{height:auto;align-items:flex-start;flex-direction:column;padding:10px 12px}.brandblock{min-width:0}.statsline{grid-template-columns:1fr}.statsbar{grid-template-columns:1fr 1fr}.top-ingest{grid-template-columns:1fr}.workspace{padding:8px}.feed-tools{grid-template-columns:1fr}.rating-strip,.axis-strip{grid-template-columns:1fr 1fr}.brief-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.heatmap{grid-template-columns:88px repeat(4,72px);overflow:auto}.titleline{flex-direction:column}.scorebox{width:100%}}
</style>
</head>
<body>
<main class="app">
  <div class="topbar">
    <div class="brandblock"><div class="brand"><span>KM</span> Lens Observatory <b class="version-badge">v1.0</b></div><div class="subtitle">Knowledge search · risk map · standalone cartography</div></div>
    <div class="topspacer"></div>
    <div class="tool-actions"><button class="btn" id="copySelection">Copier selection</button><button class="btn" id="exportSelection">Export .md</button><button class="btn dark" id="exportJson">JSON</button></div>
  </div>
  <section class="statsline">
    <div class="top-ingest">
      <input id="search" placeholder="Chercher appel, outil, tag, risque, source...">
      <button class="btn red" id="clearSearch">Effacer</button>
      <select id="sort"><option value="risk">Risque</option><option value="title">Titre</option><option value="type">Type</option></select>
    </div>
    <div class="statsbar" id="statsbar"></div>
  </section>
  <div class="topic-rail" id="topics"></div>
  <section class="workspace">
    <aside class="col">
      <header><h2>Corpus</h2><span class="headnote" id="feedCount"></span></header>
      <div class="scroll">
        <div class="feed-tools">
          <select id="statusFilter"><option value="all">Tous statuts</option><option value="#ROUGE">#ROUGE</option><option value="sensible">Sensible</option><option value="a verifier">A verifier</option><option value="actif">Actif</option></select>
          <select id="typeFilter"><option value="all">Tous types</option><option value="watch">Watch</option><option value="theme">Themes</option><option value="process">Process</option><option value="km">KM</option></select>
          <input id="tagFilter" placeholder="Filtre tag exact ou partiel">
        </div>
        <div class="article-status" id="articleStatus"></div>
        <div id="feed"></div>
      </div>
    </aside>
    <section class="col">
      <header><h2>Analysis</h2><span class="headnote">fiche active</span></header>
      <div class="scroll">
        <div id="detail"></div>
        <h3 class="section-title">Cartographie statut / type</h3>
        <div class="heatmap" id="heatmap"></div>
        <h3 class="section-title">Axes KM</h3>
        <div class="axis-strip" id="axes"></div>
        <h3 class="section-title">Relations</h3>
        <div id="relations"></div>
      </div>
    </section>
    <aside class="col">
      <header><h2>Synthesis</h2><span class="headnote">risques & actions</span></header>
      <div class="scroll">
        <div class="brief-grid" id="briefGrid"></div>
        <section class="note" id="focus"></section>
        <h3 class="section-title">Tensions</h3>
        <div id="tensions"></div>
        <h3 class="section-title">Clusters proches</h3>
        <div id="clusters"></div>
        <section class="note"><strong>Regle privacy</strong><p>Le front n'indexe pas resources/, archive/ ou inbox/. Regenerer seulement apres nettoyage privacy.</p></section>
      </div>
    </aside>
  </section>
  <footer class="footer"><span><b>KM Lens</b> · HTML autonome · index embarque depuis Markdown nettoye</span><span>${index.length} fiches · ${generatedAt}</span></footer>
</main>
<div class="toast" id="toast"></div>
<script>
const KM_INDEX=${JSON.stringify(index)};
let activeId=KM_INDEX[0]?.id||"", topic="Tous", selected=new Set();
const byId=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
const norm=s=>String(s??"").toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g,"");
function toast(msg){const t=byId("toast");t.textContent=msg;t.classList.add("on");setTimeout(()=>t.classList.remove("on"),1600)}
function statusClass(s){return s==="#ROUGE"?"hot":s==="a verifier"?"warn":s==="sensible"?"ai":""}
function semClass(v){return v>=80?"hot":v>=55?"warm":"cool"}
function klass(v){return v>55?"neg":v>35?"mid":"pos"}
function sign(v){return String(Math.round(v))}
function scoreText(item){return item.status==="#ROUGE"?"INTERNE":item.status==="a verifier"?"VERIFY":item.status==="sensible"?"WATCH":"OK"}
function itemTerms(item){return norm([item.title,item.canonical,item.type,item.bucket,item.status,item.tags.join(" "),item.summary,item.body].join(" "))}
function queryTerms(){return norm(byId("search").value).split(/\\s+/).filter(Boolean)}
function scoreItem(item,terms){if(!terms.length)return 1;const hay=itemTerms(item);let score=0;for(const term of terms){if(!hay.includes(term))return 0;if(norm(item.title).includes(term))score+=9;if(norm(item.canonical).includes(term))score+=8;if(norm(item.tags.join(" ")).includes(term))score+=5;if(norm(item.summary).includes(term))score+=2;score++}return score}
function filteredItems(){
  const terms=queryTerms(), status=byId("statusFilter").value, type=byId("typeFilter").value, tag=norm(byId("tagFilter").value), sort=byId("sort").value;
  let rows=KM_INDEX.map(item=>({item,score:scoreItem(item,terms)})).filter(row=>row.score>0).map(row=>row.item);
  rows=rows.filter(item=>topic==="Tous"||item.bucket===topic);
  rows=rows.filter(item=>status==="all"||item.status===status);
  rows=rows.filter(item=>type==="all"||item.bucket===type);
  rows=rows.filter(item=>!tag||norm(item.tags.join(" ")).includes(tag)||norm(item.type).includes(tag));
  rows.sort((a,b)=>sort==="title"?a.title.localeCompare(b.title):sort==="type"?a.bucket.localeCompare(b.bucket)||a.title.localeCompare(b.title):b.risk-a.risk||a.title.localeCompare(b.title));
  return rows;
}
function activeItem(){return KM_INDEX.find(item=>item.id===activeId)||filteredItems()[0]||KM_INDEX[0]}
function renderStats(){
  const red=KM_INDEX.filter(i=>i.status==="#ROUGE").length, sens=KM_INDEX.filter(i=>i.status==="sensible").length, ver=KM_INDEX.filter(i=>i.status==="a verifier").length, watch=KM_INDEX.filter(i=>i.bucket==="watch").length;
  byId("statsbar").innerHTML=\`<div class="stat"><span>Fiches</span><b>\${KM_INDEX.length}</b></div><div class="stat"><span>Watch</span><b>\${watch}</b></div><div class="stat"><span>#ROUGE</span><b>\${red}</b></div><div class="stat"><span>Sensibles</span><b>\${sens}</b></div><div class="stat"><span>A verifier</span><b>\${ver}</b></div>\`;
}
function renderTopics(){
  const topics=["Tous",...new Set(KM_INDEX.map(i=>i.bucket))];
  byId("topics").innerHTML=topics.map(t=>\`<button class="topic \${t===topic?"active":""}" data-topic="\${esc(t)}">\${esc(t)}</button>\`).join("");
}
function highlight(text){
  let safe=esc(text);
  for(const term of queryTerms()){if(term.length<2)continue;safe=safe.replace(new RegExp(term.replace(/[.*+?^\\$\\{\\}()|[\\]\\\\]/g,"\\\\$&"),"ig"),m=>\`<mark>\${m}</mark>\`)}
  return safe;
}
function cardHtml(item){
  const active=item.id===activeId, sel=selected.has(item.id);
  return \`<article class="news-card \${active?"active":""} \${sel?"selected":""}" data-id="\${esc(item.id)}">
    <div class="check" data-action="select" title="Selectionner"></div><div>
    <div class="meta"><span class="tag \${statusClass(item.status)}">\${esc(item.status)}</span><span class="tag ai">\${esc(item.bucket)}</span>\${item.tags.slice(0,3).map(t=>\`<span class="tag">\${highlight(t)}</span>\`).join("")}</div>
    <h3 class="news-title" data-action="open">\${highlight(item.title)}</h3>
    <p class="excerpt">\${highlight(item.summary)}</p>
    <div class="source-strip"><span>\${esc(item.canonical||"sans appel canonique")}</span><a href="\${esc(item.github)}" target="_blank" rel="noopener noreferrer">GITHUB</a></div>
    <div class="rating-line"><div class="rating-strip"><div class="rating-pill"><b>Risque</b><span>\${item.risk}</span></div><div class="rating-pill"><b>Maturite</b><span>\${item.maturity}</span></div><div class="rating-pill"><b>Tags</b><span>\${item.tags.length}</span></div><div class="rating-pill total-pill"><b>Statut</b><span>\${scoreText(item)}</span></div></div><button class="iconbtn" data-action="copy">MD</button></div>
    </div></article>\`;
}
function renderFeed(){
  const rows=filteredItems();
  if(!rows.some(i=>i.id===activeId)&&rows[0])activeId=rows[0].id;
  byId("feedCount").textContent=\`\${rows.length} resultats\`;
  byId("articleStatus").innerHTML=\`<span>\${rows.length} fiches visibles</span><span>\${selected.size} selectionnees</span>\`;
  byId("feed").innerHTML=rows.map(cardHtml).join("")||\`<section class="note"><strong>Aucun resultat</strong><p>Vide la recherche ou change les filtres.</p></section>\`;
}
function axisTile(label,value,mode="risk"){
  const left=value<50?value:50, width=Math.abs(value-50);
  return \`<div class="axis-tile"><b>\${esc(label)}</b><div class="bar"><span class="fill" style="left:\${left}%;width:\${width}%;background:\${mode==="risk"?"var(--red)":"var(--green)"}"></span></div><span class="\${klass(value)}">\${sign(value)}</span></div>\`;
}
function renderHeatmap(item){
  const byBucket=["watch","theme","process","km"].map(b=>KM_INDEX.filter(i=>i.bucket===b));
  byId("heatmap").innerHTML=\`<div class="label">Axe</div><div>Watch</div><div>Themes</div><div>Process</div><div>KM</div>
    <div class="label">Volume</div>\${byBucket.map(list=>\`<div class="cell \${semClass(list.length*9)}">\${list.length}</div>\`).join("")}
    <div class="label">Risque moy.</div>\${byBucket.map(list=>{const v=list.length?Math.round(list.reduce((s,i)=>s+i.risk,0)/list.length):0;return \`<div class="cell \${semClass(v)}">\${v}</div>\`}).join("")}
    <div class="label">Actif</div>\${byBucket.map(list=>\`<div class="cell cool">\${list.filter(i=>i.status==="actif").length}</div>\`).join("")}
    <div class="label">Focus</div>\${byBucket.map(list=>\`<div class="cell \${item&&list.some(i=>i.id===item.id)?"hot":"cool"}">\${item&&list.some(i=>i.id===item.id)?"ON":"-"}</div>\`).join("")}\`;
}
function renderDetail(){
  const item=activeItem(); if(!item)return;
  byId("detail").innerHTML=\`<section class="detail-title"><div class="titleline"><h1>\${esc(item.title)}</h1><div class="scorebox"><b>\${item.risk}</b><span>risk</span></div></div><p>\${esc(item.summary)}</p><div class="detail-actions"><a class="btn dark" href="\${esc(item.github)}" target="_blank" rel="noopener noreferrer">GitHub</a><button class="btn" id="copyActive">Copier MD</button><button class="btn red" id="selectActive">Selection</button></div></section>\`;
  byId("axes").innerHTML=[
    axisTile("Risque / Defense",item.risk,"risk"),
    axisTile("Maturite / A verifier",item.maturity,"maturity"),
    axisTile("Densite tags",Math.min(100,item.tags.length*12),"maturity"),
    axisTile("Relations",Math.min(100,item.relations.length*15),"maturity")
  ].join("");
  byId("relations").innerHTML=(item.relations.length?item.relations:[item.canonical,item.path].filter(Boolean)).map((r,i)=>\`<div class="cluster"><b>Relation \${i+1}</b><span>\${esc(r)}</span></div>\`).join("");
  renderHeatmap(item); renderSynthesis(item);
}
function renderSynthesis(item){
  const rows=filteredItems(), avg=rows.length?Math.round(rows.reduce((s,i)=>s+i.risk,0)/rows.length):0;
  byId("briefGrid").innerHTML=\`<div class="brief"><b>Visible</b><span>\${rows.length}</span></div><div class="brief"><b>Risk avg</b><span>\${avg}</span></div><div class="brief"><b>Active</b><span>\${esc(item.status)}</span></div><div class="brief"><b>Bucket</b><span>\${esc(item.bucket)}</span></div>\`;
  byId("focus").innerHTML=\`<strong>Lecture KM</strong><p>\${item.status==="#ROUGE"?"Interne defense uniquement. Ne pas transformer en tutoriel ni workflow public.":item.status==="a verifier"?"Source a re-verifier avant recommandation ou integration technique.":item.status==="sensible"?"Utilisable avec garde-fous privacy, consentement et secrets.":"Fiche active exploitable comme reference KM."}</p>\`;
  byId("tensions").innerHTML=[\`<div class="tension"><strong>Privacy</strong><p>Verifier absence de secrets, chemins personnels et donnees privees avant export.</p></div>\`,\`<div class="tension"><strong>Propagation</strong><p>Les fiches sensibles ou #ROUGE restent veille interne, pas recommandation publique.</p></div>\`].join("");
  const near=KM_INDEX.filter(i=>i.id!==item.id&&(i.bucket===item.bucket||i.status===item.status)).slice(0,4);
  byId("clusters").innerHTML=near.map((n,i)=>\`<div class="cluster"><b>Cluster \${i+1}</b><span>\${esc(n.title)}</span><span>\${esc(n.status)}</span></div>\`).join("");
}
function itemMarkdown(item){return \`## \${item.title}\\n\\n- Appel: \${item.canonical||"n/a"}\\n- Statut: \${item.status}\\n- Type: \${item.type}\\n- Fichier: \${item.path}\\n- GitHub: \${item.github}\\n\\n\${item.summary}\\n\`}
function download(name,text){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type:"text/plain"}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}
async function copy(text){await navigator.clipboard.writeText(text)}
function renderAll(){renderStats();renderTopics();renderFeed();renderDetail()}
document.addEventListener("click",e=>{
  const topicBtn=e.target.closest(".topic"); if(topicBtn){topic=topicBtn.dataset.topic;renderAll();return}
  const card=e.target.closest(".news-card");
  if(card&&e.target.dataset.action==="select"){selected.has(card.dataset.id)?selected.delete(card.dataset.id):selected.add(card.dataset.id);renderAll();return}
  if(card&&e.target.dataset.action==="copy"){const item=KM_INDEX.find(i=>i.id===card.dataset.id);copy(itemMarkdown(item)).then(()=>toast("Fiche copiee"));return}
  if(card&&(e.target.dataset.action==="open"||!e.target.closest("a,button,.check"))){activeId=card.dataset.id;history.replaceState(null,"",\`#fiche=\${activeId}\`);renderAll();return}
  if(e.target.id==="copyActive"){copy(itemMarkdown(activeItem())).then(()=>toast("Fiche active copiee"));return}
  if(e.target.id==="selectActive"){const id=activeItem().id;selected.has(id)?selected.delete(id):selected.add(id);renderAll();return}
});
["search","sort","statusFilter","typeFilter","tagFilter"].forEach(id=>byId(id).addEventListener("input",renderAll));
byId("clearSearch").onclick=()=>{byId("search").value="";byId("tagFilter").value="";renderAll();byId("search").focus()};
byId("copySelection").onclick=()=>{const items=KM_INDEX.filter(i=>selected.has(i.id));copy("# KM Lens selection\\n\\n"+(items.length?items:[activeItem()]).map(itemMarkdown).join("\\n")).then(()=>toast("Selection copiee"))};
byId("exportSelection").onclick=()=>{const items=KM_INDEX.filter(i=>selected.has(i.id));download("km-lens-selection.md","# KM Lens selection\\n\\n"+(items.length?items:[activeItem()]).map(itemMarkdown).join("\\n"))};
byId("exportJson").onclick=()=>download("km-lens-index.json",JSON.stringify(KM_INDEX,null,2));
const hash=new URLSearchParams(location.hash.replace(/^#/,""));if(hash.get("fiche")&&KM_INDEX.some(i=>i.id===hash.get("fiche")))activeId=hash.get("fiche");
renderAll();
</script>
</body>
</html>
`;

writeFileSync(outputFile, html);
console.log(`Wrote ${outputFile} with ${index.length} indexed documents.`);
