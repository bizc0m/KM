#!/usr/bin/env node
import { createServer } from "node:http";
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { constants } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import os from "node:os";

const execFileAsync = promisify(execFile);
const APP_ROOT = fileURLToPath(new URL("..", import.meta.url)).replace(/\/$/, "");
const CONFIG_DIR = join(os.homedir(), ".km-monitor");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");
const DEFAULT_PORT = Number(process.env.KM_LOCAL_APP_PORT || 8767);
const HOST = process.env.KM_LOCAL_APP_HOST || "127.0.0.1";

const defaultConfig = {
  kmRoot: APP_ROOT,
  dashboard: "search-v1.12.html",
  sources: {
    rss: [],
    twitter: [],
    reddit: []
  }
};

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body)
  });
  res.end(body);
}

function sendHtml(res, body) {
  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    "Content-Length": Buffer.byteLength(body)
  });
  res.end(body);
}

async function exists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function readConfig() {
  await mkdir(CONFIG_DIR, { recursive: true });
  try {
    return { ...defaultConfig, ...JSON.parse(await readFile(CONFIG_FILE, "utf8")) };
  } catch {
    await writeConfig(defaultConfig);
    return { ...defaultConfig };
  }
}

async function writeConfig(config) {
  await mkdir(dirname(CONFIG_FILE), { recursive: true });
  await writeFile(CONFIG_FILE, `${JSON.stringify(config, null, 2)}\n`, "utf8");
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

async function validateKmRoot(kmRoot) {
  const root = resolve(kmRoot);
  const required = ["km.config.json", "watch", "resources"];
  const missing = [];
  for (const name of required) {
    if (!(await exists(join(root, name)))) missing.push(name);
  }
  return { root, ok: missing.length === 0, missing };
}

async function chooseFolder() {
  const script = 'POSIX path of (choose folder with prompt "Choisir le dossier KM qui stocke les fiches")';
  const { stdout } = await execFileAsync("osascript", ["-e", script], { timeout: 120000 });
  return stdout.trim().replace(/\/$/, "");
}

async function runNodeScript(scriptName, kmRoot) {
  const scriptPath = join(APP_ROOT, "scripts", scriptName);
  const result = await execFileAsync(process.execPath, [scriptPath], {
    cwd: kmRoot,
    env: { ...process.env, KM_ROOT: kmRoot },
    timeout: 300000,
    maxBuffer: 1024 * 1024 * 5
  });
  return {
    stdout: result.stdout.slice(-8000),
    stderr: result.stderr.slice(-8000)
  };
}

function html(config) {
  const sourceRows = (type) => (config.sources?.[type] || [])
    .map((url) => `<li><span>${escapeHtml(url)}</span></li>`)
    .join("") || "<li class=\"muted\">Aucune source</li>";
  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>KM Monitor Local</title>
  <style>
    :root{font-family:Arial,sans-serif;color:#161616;background:#f7f5ef}
    body{margin:0;padding:24px}
    main{max-width:920px;margin:0 auto}
    header{display:flex;gap:12px;align-items:center;justify-content:space-between;margin-bottom:20px}
    h1{font-size:28px;margin:0}
    h2{font-size:18px;margin:24px 0 10px}
    button,a.button{border:2px solid #151515;background:#151515;color:#fff;font-weight:800;padding:10px 14px;text-decoration:none;cursor:pointer}
    button.secondary,a.secondary{background:#fff;color:#151515}
    input,textarea{box-sizing:border-box;width:100%;border:2px solid #d8d2c6;background:#fff;padding:10px;font:inherit}
    textarea{min-height:90px;resize:vertical}
    .panel{border:2px solid #d8d2c6;background:#fff;padding:16px;margin:14px 0}
    .row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
    .path{font-family:Menlo,monospace;font-size:13px;background:#f1eee7;padding:10px;overflow:auto}
    .muted{color:#666}
    .status{white-space:pre-wrap;font-family:Menlo,monospace;font-size:12px;background:#111;color:#f5f5f5;padding:12px;min-height:80px}
    ul{padding-left:18px}
  </style>
</head>
<body>
<main>
  <header>
    <h1>KM Monitor Local</h1>
    <a class="button secondary" href="http://127.0.0.1:8766/${escapeHtml(config.dashboard || "search-v1.12.html")}">Dashboard</a>
  </header>

  <section class="panel">
    <h2>Dossier des fiches</h2>
    <div class="path" id="kmRoot">${escapeHtml(config.kmRoot)}</div>
    <div class="row" style="margin-top:12px">
      <button id="chooseRoot">Choisir dossier</button>
      <button class="secondary" id="validateRoot">Verifier</button>
    </div>
  </section>

  <section class="panel">
    <h2>Sources</h2>
    <label>RSS</label>
    <textarea id="rss" placeholder="Une URL RSS par ligne">${escapeHtml((config.sources?.rss || []).join("\\n"))}</textarea>
    <label>Twitter / X</label>
    <textarea id="twitter" placeholder="Une liste, un profil ou un post par ligne">${escapeHtml((config.sources?.twitter || []).join("\\n"))}</textarea>
    <label>Reddit</label>
    <textarea id="reddit" placeholder="Un subreddit, thread ou flux par ligne">${escapeHtml((config.sources?.reddit || []).join("\\n"))}</textarea>
    <div class="row" style="margin-top:12px">
      <button id="saveSources">Enregistrer</button>
    </div>
  </section>

  <section class="panel">
    <h2>Actions</h2>
    <div class="row">
      <button id="build">Build dashboard</button>
      <button class="secondary" id="ingest">Ingest Raindrop</button>
    </div>
  </section>

  <section class="panel">
    <h2>Sources actives</h2>
    <strong>RSS</strong><ul>${sourceRows("rss")}</ul>
    <strong>Twitter / X</strong><ul>${sourceRows("twitter")}</ul>
    <strong>Reddit</strong><ul>${sourceRows("reddit")}</ul>
  </section>

  <section class="panel">
    <h2>Log</h2>
    <div class="status" id="status">Pret.</div>
  </section>
</main>
<script>
const statusEl = document.getElementById("status");
const kmRootEl = document.getElementById("kmRoot");
function lines(id){return document.getElementById(id).value.split("\\n").map(x=>x.trim()).filter(Boolean)}
function setStatus(value){statusEl.textContent = typeof value === "string" ? value : JSON.stringify(value,null,2)}
async function api(path, body){
  setStatus("Execution...");
  const res = await fetch(path,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body||{})});
  const json = await res.json();
  setStatus(json);
  if(json.config?.kmRoot) kmRootEl.textContent = json.config.kmRoot;
  return json;
}
document.getElementById("chooseRoot").onclick = () => api("/api/choose-root");
document.getElementById("validateRoot").onclick = () => api("/api/validate-root");
document.getElementById("saveSources").onclick = () => api("/api/save-sources",{sources:{rss:lines("rss"),twitter:lines("twitter"),reddit:lines("reddit")}});
document.getElementById("build").onclick = () => api("/api/build");
document.getElementById("ingest").onclick = () => api("/api/ingest-raindrop");
</script>
</body>
</html>`;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const server = createServer(async (req, res) => {
  try {
    const config = await readConfig();
    if (req.method === "GET" && req.url === "/") return sendHtml(res, html(config));
    if (req.method === "GET" && req.url === "/api/config") return sendJson(res, 200, { ok: true, config });
    if (req.method !== "POST") return sendJson(res, 404, { ok: false, error: "not_found" });

    if (req.url === "/api/choose-root") {
      const picked = await chooseFolder();
      const validation = await validateKmRoot(picked);
      const next = { ...config, kmRoot: validation.root };
      await writeConfig(next);
      return sendJson(res, validation.ok ? 200 : 422, { ok: validation.ok, config: next, validation });
    }

    if (req.url === "/api/validate-root") {
      const validation = await validateKmRoot(config.kmRoot);
      return sendJson(res, validation.ok ? 200 : 422, { ok: validation.ok, config, validation });
    }

    if (req.url === "/api/save-sources") {
      const body = await readBody(req);
      const next = {
        ...config,
        sources: {
          rss: body.sources?.rss || [],
          twitter: body.sources?.twitter || [],
          reddit: body.sources?.reddit || []
        }
      };
      await writeConfig(next);
      return sendJson(res, 200, { ok: true, config: next });
    }

    if (req.url === "/api/build") {
      const validation = await validateKmRoot(config.kmRoot);
      if (!validation.ok) return sendJson(res, 422, { ok: false, validation });
      const result = await runNodeScript("build-search-v1.12-html.mjs", validation.root);
      return sendJson(res, 200, { ok: true, action: "build", ...result });
    }

    if (req.url === "/api/ingest-raindrop") {
      const validation = await validateKmRoot(config.kmRoot);
      if (!validation.ok) return sendJson(res, 422, { ok: false, validation });
      const ingest = await runNodeScript("km-raindrop-rss-ingest.mjs", validation.root);
      const build = await runNodeScript("build-search-v1.12-html.mjs", validation.root);
      return sendJson(res, 200, { ok: true, action: "ingest-raindrop", ingest, build });
    }

    return sendJson(res, 404, { ok: false, error: "not_found" });
  } catch (error) {
    return sendJson(res, 500, { ok: false, error: error.message });
  }
});

server.listen(DEFAULT_PORT, HOST, () => {
  console.log(`KM Monitor Local: http://${HOST}:${DEFAULT_PORT}`);
});
