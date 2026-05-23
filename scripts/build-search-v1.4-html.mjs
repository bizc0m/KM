import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url)).replace(/\/$/, "");
const outputFile = join(root, "search-v1.4.html");
const includeDirs = ["km", "watch", "themes", "process"];
const includeFiles = ["README.md", "index.md", "sources.md"];

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
    .replace(/[>#*_|\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function bucketOf(path) {
  if (path.startsWith("watch/")) return "watch";
  if (path.startsWith("themes/")) return "theme";
  if (path.startsWith("process/")) return "process";
  if (path.startsWith("km/")) return "km";
  return "document";
}

function statusOf(content) {
  const explicit = [section(content, "Type"), section(content, "Tags"), section(content, "Classification")].join("\n");
  if (/#ROUGE/i.test(explicit)) return "#ROUGE";
  if (/a verifier|à vérifier|to-verify/i.test(content)) return "a verifier";
  if (/sensible|sensitive/i.test(content)) return "sensible";
  return "actif";
}

function itemFrom(file) {
  const path = relative(root, file);
  const content = readFileSync(file, "utf8");
  const title = first(content, /^#\s+(.+)$/m) || path;
  const canonical = first(content, /## Appel canonique\s+`([^`]+)`/i)
    || first(content, /`\s*([a-z]+:[^`]+)\s*`/i);
  const tags = section(content, "Tags").split(/,|\n/).map(clean).filter(Boolean).slice(0, 12);
  const relations = section(content, "Relations").split("\n").map(clean).filter(Boolean).slice(0, 12);
  return {
    id: path.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, ""),
    title,
    canonical,
    type: clean(section(content, "Type").split("\n")[0] || bucketOf(path)).slice(0, 90),
    bucket: bucketOf(path),
    tags,
    status: statusOf(content),
    path,
    github: `https://github.com/bizc0m/KM/blob/main/${path}`,
    relations
  };
}

const files = [
  ...includeFiles.map((file) => join(root, file)).filter((file) => statSync(file, { throwIfNoEntry: false })),
  ...includeDirs.flatMap((dir) => walk(join(root, dir)))
];
const index = files.map(itemFrom).sort((a, b) => (a.canonical || a.title).localeCompare(b.canonical || b.title));
const generatedAt = new Date().toISOString();

const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>KM Search v1.4</title>
<style>
*,*::before,*::after{box-sizing:border-box}
:root{--ink:#151515;--muted:#64615b;--line:#d8d3c8;--paper:#f3f0e8;--panel:#fffefb;--soft:#ebe6dc;--red:#e50000;--red-soft:#fff0ef;--blue:#245f8f;--gold:#8b6914;--shadow:4px 4px 0 rgba(229,0,0,.22);--shadow-strong:7px 7px 0 rgba(21,21,21,.12)}
html,body{height:100%}body{margin:0;font-family:Inter,Arial,Helvetica,sans-serif;background:var(--paper);color:var(--ink);overflow:hidden}button,input,select{font:inherit}button{cursor:pointer}
.app{height:100vh;display:grid;grid-template-rows:auto auto auto 1fr auto}.topbar{min-height:62px;background:var(--panel);border-bottom:3px solid var(--ink);display:flex;align-items:center;gap:16px;padding:10px 18px}.brandblock{min-width:270px}.brand{font-size:21px;font-weight:950;text-transform:uppercase;line-height:.92;display:flex;align-items:flex-end;gap:8px;flex-wrap:wrap}.brand span{color:var(--red)}.version-badge{border:1px solid var(--ink);background:var(--red);color:#fff;font-size:10px;font-weight:950;line-height:1;padding:4px 6px;text-transform:uppercase}.subtitle{font-size:10px;text-transform:uppercase;letter-spacing:.12em;color:var(--muted);font-weight:850;margin-top:5px}.topspacer{flex:1}
.btn{border:1px solid var(--line);background:#fff;color:var(--ink);padding:7px 10px;font-size:10px;font-weight:900;text-transform:uppercase;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:30px}.btn:hover{background:var(--ink);border-color:var(--ink);color:#fff}.btn.dark{background:var(--ink);color:#fff;border-color:var(--ink)}.btn.red{background:var(--red);color:#fff;border-color:var(--red)}
.statsline{display:grid;grid-template-columns:minmax(420px,1.1fr) minmax(0,1.5fr);gap:1px;background:var(--ink);border-bottom:2px solid var(--ink)}.top-ingest{background:#fbfaf6;padding:8px 14px;display:grid;grid-template-columns:minmax(0,1fr) 86px 74px;gap:6px}.top-ingest input,.top-ingest select{border:1px solid var(--line);background:#fff;color:var(--ink);padding:7px 8px;font-size:11px;min-width:0}.statsbar{display:grid;grid-template-columns:repeat(5,1fr);gap:1px;background:var(--ink)}.stat{background:#fbfaf6;padding:8px 12px;display:flex;align-items:center;justify-content:space-between;gap:10px}.stat b{font-size:18px;line-height:1;font-weight:950}.stat span{font-size:9px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);font-weight:900}
.topic-rail{display:flex;gap:6px;flex-wrap:wrap;align-items:flex-start;padding:8px 12px;border-bottom:2px solid var(--ink);background:#fbfaf6}.topic{white-space:nowrap;border:1px solid var(--line);background:#fff;padding:6px 8px;font-size:10px;font-weight:900;text-transform:uppercase}.topic.active{background:var(--ink);border-color:var(--ink);color:#fff}
.workspace{min-height:0;display:grid;grid-template-columns:minmax(390px,1.12fr) minmax(390px,.88fr);gap:12px;padding:12px}.col{min-height:0;background:var(--panel);border:2px solid var(--ink);box-shadow:var(--shadow);display:flex;flex-direction:column}.col>header{min-height:43px;border-bottom:2px solid var(--ink);display:flex;align-items:center;justify-content:space-between;gap:10px;padding:0 12px}h2{font-size:13px;font-weight:950;text-transform:uppercase;margin:0}.headnote{font-size:10px;color:var(--muted);font-weight:900;text-transform:uppercase}.scroll{overflow:auto;padding:12px;min-height:0}
.feed-tools{display:grid;grid-template-columns:90px 90px minmax(0,1fr);gap:7px;margin-bottom:10px}.feed-tools select,.feed-tools input{border:1px solid var(--line);background:#fff;padding:8px;font-size:11px;min-width:0}.article-status{border:1px solid var(--line);background:#fbfaf6;padding:7px 8px;margin:0 0 10px;font-size:10px;font-weight:900;text-transform:uppercase;color:var(--muted);display:flex;justify-content:space-between;gap:10px}
.news-card{display:grid;grid-template-columns:22px 1fr;gap:10px;border:1px solid var(--line);border-left:4px solid var(--line);background:#fff;padding:11px;margin-bottom:10px;transition:.12s}.news-card:hover{box-shadow:0 2px 12px rgba(0,0,0,.08);transform:translateY(-1px)}.news-card.active{border-left-color:var(--red);outline:2px solid rgba(229,0,0,.2)}.news-card.selected{background:#fff8e8}.check{width:16px;height:16px;border:2px solid var(--line);display:flex;align-items:center;justify-content:center;margin-top:2px}.selected .check{background:var(--gold);border-color:var(--gold)}.selected .check::after{content:"✓";color:#fff;font-size:10px;font-weight:900}
.meta{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:6px}.tag{font-size:9px;text-transform:uppercase;font-weight:900;padding:3px 6px;border:1px solid var(--line);background:var(--soft)}.tag.hot{background:var(--red-soft);border-color:#edb8b8;color:#8f0000}.tag.ai{background:#eef4fb;border-color:#b8cce0;color:var(--blue)}.tag.warn{background:#fff6dd;border-color:#e6cf89;color:#6f5100}
.news-title{font-size:17px;line-height:1.18;font-weight:950;margin:0 0 8px;cursor:pointer}.news-title:hover{color:var(--red)}.source-strip{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin:0 0 8px;font-size:9px;font-weight:900;text-transform:uppercase;color:var(--muted)}.source-strip a,.source-strip span{border:1px solid var(--line);background:#fbfbf8;color:var(--ink);padding:4px 6px;text-decoration:none;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.rating-line{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:5px;align-items:stretch}.rating-strip{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;margin:0;min-width:0}.rating-pill{border:1px solid var(--line);background:#fbfbf8;padding:5px 4px;text-align:center;min-width:0}.rating-pill b{display:block;font-size:8px;text-transform:uppercase;color:rgba(21,21,21,.72);line-height:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.rating-pill span{font-size:13px;line-height:1.15;font-weight:950;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.total-pill{background:var(--ink);border-color:var(--ink)}.total-pill b,.total-pill span{color:#fff}.iconbtn{width:auto;min-width:27px;height:100%;min-height:31px;border:1px solid var(--line);background:#fff;color:var(--muted);font-size:10px;font-weight:950;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;padding:0 7px}.iconbtn:hover{background:var(--ink);color:#fff}
.detail-title{border:1px solid var(--line);background:#fff;padding:14px;margin-bottom:12px;box-shadow:var(--shadow-strong)}.titleline{display:flex;align-items:flex-start;gap:12px}.detail-title h1{font-size:27px;line-height:1.05;font-weight:950;flex:1;margin:0}.statusbox{min-width:106px;border:2px solid var(--ink);text-align:center;padding:8px;background:#fbfbf8}.statusbox b{display:block;font-size:14px;line-height:1.1;color:var(--red);text-transform:uppercase}.statusbox span{font-size:9px;text-transform:uppercase;font-weight:900;color:var(--muted)}.detail-actions{display:flex;gap:6px;flex-wrap:wrap;margin-top:12px}.section-title{font-size:10px;font-weight:950;text-transform:uppercase;color:var(--muted);border-bottom:1px solid var(--line);padding-bottom:7px;margin:0 0 9px}
.index-grid{display:grid;grid-template-columns:118px repeat(4,1fr);border:1px solid var(--line);background:#fff;margin-bottom:12px}.index-grid div{min-height:31px;border-right:1px solid var(--line);border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:center;padding:4px;font-size:10px;font-weight:950;text-align:center}.index-grid .label{justify-content:flex-start;text-align:left;color:var(--muted);background:#fbfbf8}.index-grid .cell.hot{background:var(--red);color:#fff}.index-grid .cell.warm{background:#fff2ce}.index-grid .cell.cool{background:#eef4fb;color:var(--blue)}
.note,.cluster{border:1px solid var(--line);background:#fff;padding:10px;margin-bottom:8px}.note strong{display:block;font-size:11px;text-transform:uppercase;margin-bottom:5px}.note p{font-size:12px;line-height:1.42;color:#333;margin:0}.cluster{display:flex;justify-content:space-between;gap:8px;font-size:12px}.cluster b{text-transform:uppercase}.cluster span{color:var(--muted);overflow-wrap:anywhere}.brief-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin-bottom:10px}.brief{border:1px solid var(--line);background:#fbfbf8;padding:7px;min-width:0}.brief b{display:block;font-size:8px;text-transform:uppercase;color:var(--muted);margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.brief span{display:block;font-size:12px;font-weight:950;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.toast{position:fixed;right:18px;top:78px;background:#fff;border:1px solid var(--line);border-left:4px solid var(--blue);padding:10px 13px;font-size:11px;box-shadow:0 4px 18px rgba(0,0,0,.12);z-index:20;display:none}.toast.on{display:block}.footer{border-top:2px solid var(--line);background:#fff;color:var(--muted);font-size:10px;display:flex;justify-content:space-between;gap:12px;padding:8px 14px}.footer b{color:var(--ink)}mark{background:rgba(229,0,0,.12);color:inherit;padding:0 2px}
@media(max-width:1240px){body{overflow:auto}.app{height:auto;min-height:100vh}.workspace{grid-template-columns:1fr}.col{min-height:520px}}@media(max-width:720px){.topbar,.footer{height:auto;align-items:flex-start;flex-direction:column;padding:10px 12px}.brandblock{min-width:0}.statsline{grid-template-columns:1fr}.statsbar{grid-template-columns:1fr 1fr}.top-ingest{grid-template-columns:1fr}.workspace{padding:8px}.workspace>.col:first-child{display:none}.feed-tools{grid-template-columns:1fr}.rating-strip{grid-template-columns:1fr 1fr}.titleline{flex-direction:column}.statusbox{width:100%}}
</style>
</head>
<body>
<main class="app">
  <div class="topbar"><div class="brandblock"><div class="brand"><span>KM</span> Search <b class="version-badge">v1.4</b></div><div class="subtitle">Recherche · index · fiches Markdown</div></div><div class="topspacer"></div><div class="tool-actions"><button class="btn" id="copySelection">Copier selection</button><button class="btn" id="exportSelection">Export .md</button><button class="btn dark" id="exportJson">JSON</button></div></div>
  <section class="statsline"><div class="top-ingest"><input id="search" placeholder="Chercher appel, outil, tag, source..."><button class="btn red" id="clearSearch">Effacer</button><select id="sort"><option value="status">Statut</option><option value="title">Titre</option><option value="type">Type</option></select></div><div class="statsbar" id="statsbar"></div></section>
  <div class="topic-rail" id="topics"></div>
  <section class="workspace">
    <aside class="col"><header><h2>Corpus</h2><span class="headnote" id="feedCount"></span></header><div class="scroll"><div class="feed-tools"><select id="statusFilter"><option value="all">Tous statuts</option><option value="#ROUGE">#ROUGE</option><option value="sensible">Sensible</option><option value="a verifier">A verifier</option><option value="actif">Actif</option></select><select id="typeFilter"><option value="all">Tous types</option><option value="watch">Watch</option><option value="theme">Themes</option><option value="process">Process</option><option value="km">KM</option></select><input id="tagFilter" placeholder="Filtre tag"></div><div class="article-status" id="articleStatus"></div><div id="feed"></div></div></aside>
    <section class="col"><header><h2>Fiche</h2><span class="headnote">contenu KM</span></header><div class="scroll"><div id="detail"></div><h3 class="section-title">Relations</h3><div id="relations"></div></div></section>
  </section>
  <footer class="footer"><span><b>KM Search v1.4</b> · HTML autonome · index embarque depuis Markdown nettoye</span><span>${index.length} fiches · ${generatedAt}</span></footer>
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
function statusRank(v){return {"#ROUGE":0,"a verifier":1,"sensible":2,"actif":3}[v]??4}
function itemTerms(item){return norm([item.title,item.canonical,item.type,item.bucket,item.status,item.tags.join(" "),item.relations.join(" "),item.path].join(" "))}
function queryTerms(){return norm(byId("search").value).split(/\\s+/).filter(Boolean)}
function matchesQuery(item,terms){if(!terms.length)return 1;const hay=itemTerms(item);for(const term of terms){if(!hay.includes(term))return 0}return 1}
function filteredItems(){const terms=queryTerms(), status=byId("statusFilter").value, type=byId("typeFilter").value, tag=norm(byId("tagFilter").value), sort=byId("sort").value;let rows=KM_INDEX.filter(item=>matchesQuery(item,terms)>0);rows=rows.filter(item=>topic==="Tous"||item.bucket===topic);rows=rows.filter(item=>status==="all"||item.status===status);rows=rows.filter(item=>type==="all"||item.bucket===type);rows=rows.filter(item=>!tag||norm(item.tags.join(" ")).includes(tag)||norm(item.type).includes(tag));rows.sort((a,b)=>sort==="title"?a.title.localeCompare(b.title):sort==="type"?a.bucket.localeCompare(b.bucket)||a.title.localeCompare(b.title):statusRank(a.status)-statusRank(b.status)||a.title.localeCompare(b.title));return rows}
function activeItem(){return KM_INDEX.find(item=>item.id===activeId)||filteredItems()[0]||KM_INDEX[0]}
function highlight(text){let safe=esc(text);for(const term of queryTerms()){if(term.length<2)continue;safe=safe.replace(new RegExp(term.replace(/[.*+?^\\$\\{\\}()|[\\]\\\\]/g,"\\\\$&"),"ig"),m=>"<mark>"+m+"</mark>")}return safe}
function renderStats(){const red=KM_INDEX.filter(i=>i.status==="#ROUGE").length, sens=KM_INDEX.filter(i=>i.status==="sensible").length, ver=KM_INDEX.filter(i=>i.status==="a verifier").length, watch=KM_INDEX.filter(i=>i.bucket==="watch").length;byId("statsbar").innerHTML='<div class="stat"><span>Fiches</span><b>'+KM_INDEX.length+'</b></div><div class="stat"><span>Watch</span><b>'+watch+'</b></div><div class="stat"><span>#ROUGE</span><b>'+red+'</b></div><div class="stat"><span>Sensibles</span><b>'+sens+'</b></div><div class="stat"><span>A verifier</span><b>'+ver+'</b></div>'}
function renderTopics(){const topics=["Tous",...new Set(KM_INDEX.map(i=>i.bucket))];byId("topics").innerHTML=topics.map(t=>'<button class="topic '+(t===topic?"active":"")+'" data-topic="'+esc(t)+'">'+esc(t)+'</button>').join("")}
function cardHtml(item){const active=item.id===activeId, sel=selected.has(item.id);return '<article class="news-card '+(active?"active":"")+' '+(sel?"selected":"")+'" data-id="'+esc(item.id)+'"><div class="check" data-action="select" title="Selectionner"></div><div><div class="meta"><span class="tag '+statusClass(item.status)+'">'+esc(item.status)+'</span><span class="tag ai">'+esc(item.bucket)+'</span>'+item.tags.slice(0,3).map(t=>'<span class="tag">'+highlight(t)+'</span>').join("")+'</div><h3 class="news-title" data-action="open">'+highlight(item.title)+'</h3><div class="source-strip"><span>'+esc(item.canonical||"sans appel canonique")+'</span><a href="'+esc(item.github)+'" target="_blank" rel="noopener noreferrer">GITHUB</a></div><div class="rating-line"><div class="rating-strip"><div class="rating-pill"><b>Statut</b><span>'+esc(item.status)+'</span></div><div class="rating-pill"><b>Type</b><span>'+esc(item.bucket)+'</span></div><div class="rating-pill total-pill"><b>Tags</b><span>'+item.tags.length+'</span></div></div><button class="iconbtn" data-action="copy">MD</button></div></div></article>'}
function renderFeed(){const rows=filteredItems();if(!rows.some(i=>i.id===activeId)&&rows[0])activeId=rows[0].id;byId("feedCount").textContent=rows.length+" resultats";byId("articleStatus").innerHTML="<span>"+rows.length+" fiches visibles</span><span>"+selected.size+" selectionnees</span>";byId("feed").innerHTML=rows.map(cardHtml).join("")||'<section class="note"><strong>Aucun resultat</strong><p>Vide la recherche ou change les filtres.</p></section>'}
function renderDetail(){const item=activeItem();if(!item)return;byId("detail").innerHTML='<section class="detail-title"><div class="titleline"><h1>'+esc(item.title)+'</h1><div class="statusbox"><b>'+esc(item.status)+'</b><span>statut</span></div></div><div class="detail-actions"><a class="btn dark" href="'+esc(item.github)+'" target="_blank" rel="noopener noreferrer">GitHub</a><button class="btn" id="copyActive">Copier MD</button><button class="btn red" id="selectActive">Selection</button></div></section>';byId("relations").innerHTML=(item.relations.length?item.relations:[item.canonical,item.path].filter(Boolean)).map((r,i)=>'<div class="cluster"><b>Relation '+(i+1)+'</b><span>'+esc(r)+'</span></div>').join("")}
function itemMarkdown(item){return "## "+item.title+"\\n\\n- Appel: "+(item.canonical||"n/a")+"\\n- Statut: "+item.status+"\\n- Type: "+item.type+"\\n- Fichier: "+item.path+"\\n- GitHub: "+item.github+"\\n"}
function download(name,text){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([text],{type:"text/plain"}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}
async function copy(text){await navigator.clipboard.writeText(text)}
function renderAll(){renderStats();renderTopics();renderFeed();renderDetail()}
document.addEventListener("click",e=>{const topicBtn=e.target.closest(".topic");if(topicBtn){topic=topicBtn.dataset.topic;renderAll();return}const card=e.target.closest(".news-card");if(card&&e.target.dataset.action==="select"){selected.has(card.dataset.id)?selected.delete(card.dataset.id):selected.add(card.dataset.id);renderAll();return}if(card&&e.target.dataset.action==="copy"){const item=KM_INDEX.find(i=>i.id===card.dataset.id);copy(itemMarkdown(item)).then(()=>toast("Fiche copiee"));return}if(card&&(e.target.dataset.action==="open"||!e.target.closest("a,button,.check"))){activeId=card.dataset.id;history.replaceState(null,"","#fiche="+activeId);renderAll();return}if(e.target.id==="copyActive"){copy(itemMarkdown(activeItem())).then(()=>toast("Fiche active copiee"));return}if(e.target.id==="selectActive"){const id=activeItem().id;selected.has(id)?selected.delete(id):selected.add(id);renderAll();return}});
["search","sort","statusFilter","typeFilter","tagFilter"].forEach(id=>byId(id).addEventListener("input",renderAll));
byId("clearSearch").onclick=()=>{byId("search").value="";byId("tagFilter").value="";renderAll();byId("search").focus()};
byId("copySelection").onclick=()=>{const items=KM_INDEX.filter(i=>selected.has(i.id));copy("# KM Search v1.4 selection\\n\\n"+(items.length?items:[activeItem()]).map(itemMarkdown).join("\\n")).then(()=>toast("Selection copiee"))};
byId("exportSelection").onclick=()=>{const items=KM_INDEX.filter(i=>selected.has(i.id));download("km-search-v1.4-selection.md","# KM Search v1.4 selection\\n\\n"+(items.length?items:[activeItem()]).map(itemMarkdown).join("\\n"))};
byId("exportJson").onclick=()=>download("km-search-v1.4-index.json",JSON.stringify(KM_INDEX,null,2));
const hash=new URLSearchParams(location.hash.replace(/^#/,""));if(hash.get("fiche")&&KM_INDEX.some(i=>i.id===hash.get("fiche")))activeId=hash.get("fiche");renderAll();
</script>
</body>
</html>`;

writeFileSync(outputFile, html);
console.log(`Wrote ${outputFile} with ${index.length} indexed documents.`);
