#!/usr/bin/env node
import { createServer } from "node:http";
import { readFile, writeFile, mkdir, access, rename, readdir, stat } from "node:fs/promises";
import { constants } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
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
  noteplanPath: "/Users/JOB/Library/Containers/co.noteplan.NotePlan-setapp/Data/Library/Application Support/co.noteplan.NotePlan-setapp/Calendar",
  noteplanInboxRoot: "/Users/JOB/Library/Containers/co.noteplan.NotePlan-setapp/Data/Library/Application Support/co.noteplan.NotePlan-setapp/Notes/## KM",
  noteplanProject: "DEV",
  bookInboxPath: join(APP_ROOT, "books", "_inbox"),
  sources: {
    rss: [],
    twitter: [],
    reddit: []
  }
};

function parseKeyValueLines(value) {
  return String(value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .reduce((acc, line) => {
      const match = line.match(/^([^:=]+)\s*[:=]\s*(.+)$/);
      if (!match) return acc;
      acc[match[1].trim()] = match[2].trim();
      return acc;
    }, {});
}

function keyValueLines(value) {
  return Object.entries(value || {})
    .map(([key, val]) => `${key}=${val}`)
    .join("\n");
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(status, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body)
  });
  res.end(body);
}

function sendHtml(res, body) {
  res.writeHead(200, {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "text/html; charset=utf-8",
    "Content-Length": Buffer.byteLength(body)
  });
  res.end(body);
}

async function sendFile(res, filePath, contentType = "text/html; charset=utf-8") {
  const body = await readFile(filePath);
  res.writeHead(200, {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": contentType,
    "Content-Length": body.length
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

async function readProjectConfig(kmRoot) {
  return JSON.parse(await readFile(join(resolve(kmRoot), "km.config.json"), "utf8"));
}

async function writeProjectConfig(kmRoot, projectConfig) {
  await writeFile(join(resolve(kmRoot), "km.config.json"), `${JSON.stringify(projectConfig, null, 2)}\n`, "utf8");
}

function safeMarkdownPath(kmRoot, requestedPath) {
  const root = resolve(kmRoot);
  const raw = String(requestedPath || "").replace(/^\/+/, "");
  if (!raw.endsWith(".md")) throw new Error("Fiche Markdown requise.");
  const full = resolve(root, raw);
  const rel = relative(root, full);
  if (rel.startsWith("..") || rel.startsWith("/") || rel.includes("\0")) throw new Error("Chemin fiche invalide.");
  return { root, full, rel };
}

function safeReadableRoot(requestedPath) {
  const root = resolve(String(requestedPath || "").trim());
  if (!root || root === "/") throw new Error("Path NotePlan invalide.");
  return root;
}

function isoDay(value) {
  const text = String(value || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error("Date invalide, format attendu YYYY-MM-DD.");
  return text;
}

function dateFromFilename(name) {
  const compact = String(name).match(/(^|[^\d])(\d{4})(\d{2})(\d{2})([^\d]|$)/);
  if (compact) return `${compact[2]}-${compact[3]}-${compact[4]}`;
  const dashed = String(name).match(/(^|[^\d])(\d{4})-(\d{2})-(\d{2})([^\d]|$)/);
  if (dashed) return `${dashed[2]}-${dashed[3]}-${dashed[4]}`;
  return "";
}

async function walkMarkdown(dir, limit = 2000) {
  const out = [];
  async function walk(current) {
    if (out.length >= limit) return;
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
      const full = join(current, entry.name);
      if (entry.isDirectory()) await walk(full);
      if (entry.isFile() && entry.name.endsWith(".md")) out.push(full);
      if (out.length >= limit) return;
    }
  }
  await walk(dir);
  return out;
}

async function walkImages(path, limit = 200) {
  const root = resolve(path);
  const rootStat = await stat(root);
  const images = [];
  const imagePattern = /\.(jpe?g|png|heic|heif|tiff?|webp)$/i;
  async function walk(current) {
    if (images.length >= limit) return;
    const entries = await readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
      const full = join(current, entry.name);
      if (entry.isDirectory()) await walk(full);
      if (entry.isFile() && imagePattern.test(entry.name)) images.push(full);
      if (images.length >= limit) return;
    }
  }
  if (rootStat.isFile()) {
    if (!imagePattern.test(root)) throw new Error("Image attendue : jpg, png, heic, tiff ou webp.");
    return [root];
  }
  await walk(root);
  return images;
}

function extractUrls(content) {
  const urls = new Set();
  const pattern = /https?:\/\/[^\s<>)\]]+/g;
  for (const match of String(content || "").matchAll(pattern)) {
    urls.add(match[0].replace(/[`"']+$/g, "").replace(/[.,;:!?]+$/, ""));
  }
  return [...urls];
}

function canonicalUrl(url) {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    parsed.hostname = parsed.hostname.toLowerCase().replace(/^www\./, "");
    if (parsed.hostname === "twitter.com") parsed.hostname = "x.com";
    for (const key of [...parsed.searchParams.keys()]) {
      if (/^utm_/i.test(key) || /^(fbclid|gclid|yclid|mc_cid|mc_eid|s)$/i.test(key)) parsed.searchParams.delete(key);
    }
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return String(url || "").trim();
  }
}

async function existingKmUrls(kmRoot) {
  const root = resolve(kmRoot);
  const files = [];
  for (const folder of ["watch", "resources", "km"]) {
    const full = join(root, folder);
    if (await exists(full)) files.push(...await walkMarkdown(full, 5000));
  }
  const urls = new Map();
  for (const file of files) {
    const rel = relative(root, file);
    const content = await readFile(file, "utf8");
    for (const url of extractUrls(content)) {
      const key = canonicalUrl(url);
      if (!urls.has(key)) urls.set(key, []);
      urls.get(key).push(rel);
    }
  }
  return urls;
}

function classifyCandidate(url) {
  let domain = "";
  try { domain = new URL(url).hostname.replace(/^www\./, ""); } catch {}
  const lower = url.toLowerCase();
  const targetFolder = /paper|pdf|docs|book|arxiv|github\.com\/[^/]+\/[^/]+\/blob/i.test(lower) ? "resources" : "watch";
  let classification = "a verifier";
  if (/github\.com|x\.com|twitter\.com|rss|feed|docs|arxiv|paper|pdf/i.test(lower)) classification = "sensible";
  if (/exploit|malware|phishing|pentest|redteam|c2|payload|ransomware/i.test(lower)) classification = "#ROUGE";
  return { domain, targetFolder, classification };
}

function noteplanScope(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return { scope: "autre", keepForWatch: false, reason: "url invalide" };
  }
  const domain = parsed.hostname.replace(/^www\./, "").toLowerCase();
  const text = `${domain} ${parsed.pathname}`.toLowerCase();
  if (/^(127\.0\.0\.1|localhost)$/.test(domain) || /\.local$|\.ts\.net$/.test(domain)) {
    return { scope: "local", keepForWatch: false, reason: "lien local/dev" };
  }
  if (/^(chatgpt\.com|claude\.ai|perplexity\.ai|mail\.google\.com|gmail\.com)$/.test(domain)) {
    return { scope: "conversation-privee", keepForWatch: false, reason: "conversation ou compte prive" };
  }
  if (/apple\.com\/.*vieworder|app\.notion\.com|ksuite\.infomaniak\.com|debank\.com\/profile|societe\.com|service-public\.fr|legalstart\.fr/.test(text)) {
    return { scope: "perso-admin", keepForWatch: false, reason: "admin/perso probable" };
  }
  if (/x\.com|twitter\.com|github\.com|gitlab\.com|huggingface\.co|arxiv\.org|paperswithcode\.com|reddit\.com|news\.ycombinator\.com|producthunt\.com/.test(domain)) {
    return { scope: "veille", keepForWatch: true, reason: "domaine veille/source" };
  }
  if (/(ai|agent|llm|mcp|osint|cyber|security|github|open-source|opensource|rss|feed|scrap|automation|workflow|prompt|claude|chatgpt|codex|research|paper|tool|devtool|macos|accessibility)/.test(text)) {
    return { scope: "veille", keepForWatch: true, reason: "mot-cle veille" };
  }
  if (/youtube\.com|youtu\.be|medium\.com|substack\.com|patreon\.com/.test(domain)) {
    return { scope: "contenu", keepForWatch: false, reason: "contenu a confirmer" };
  }
  return { scope: "autre", keepForWatch: false, reason: "hors veille par defaut" };
}

function sourceKindFromHeading(heading) {
  const key = String(heading || "").toLowerCase();
  if (/x|twitter/.test(key)) return "x";
  if (/github|git/.test(key)) return "github";
  if (/reddit/.test(key)) return "reddit";
  if (/resource|ressource|docs|paper|book/.test(key)) return "resources";
  if (/ignore|ignorer/.test(key)) return "ignore";
  if (/article|doc|web/.test(key)) return "articles";
  return "inbox";
}

function extractInboxEntries(content) {
  const entries = [];
  let heading = "Inbox";
  for (const line of String(content || "").split("\n")) {
    const h = line.match(/^##\s+(.+?)\s*$/);
    if (h) {
      heading = h[1].trim();
      continue;
    }
    for (const url of extractUrls(line)) entries.push({ url, heading, sourceKind: sourceKindFromHeading(heading) });
  }
  return entries;
}

async function scanProjectInbox({ inboxRoot, project, kmRoot, scope = "watch" }) {
  const root = safeReadableRoot(inboxRoot);
  const cleanProject = String(project || "DEV").trim() || "DEV";
  const inboxFile = join(root, cleanProject, "Inbox.md");
  if (!(await exists(inboxFile))) throw new Error(`Inbox projet introuvable: ${inboxFile}`);
  const content = await readFile(inboxFile, "utf8");
  const kmUrls = await existingKmUrls(kmRoot);
  const candidates = new Map();
  for (const entry of extractInboxEntries(content)) {
    if (entry.sourceKind === "ignore") continue;
    const canonical = canonicalUrl(entry.url);
    const scoped = noteplanScope(canonical);
    if (scope === "watch" && !scoped.keepForWatch && entry.sourceKind === "inbox") continue;
    const duplicatePaths = kmUrls.get(canonical) || [];
    const meta = classifyCandidate(canonical);
    const targetFolder = entry.sourceKind === "resources" ? "resources" : meta.targetFolder;
    const current = candidates.get(canonical) || {
      url: entry.url,
      canonical,
      domain: meta.domain,
      scope: scoped.scope,
      reason: entry.sourceKind === "inbox" ? scoped.reason : `chapitre ${entry.heading}`,
      sourceKind: entry.sourceKind,
      project: cleanProject,
      targetFolder,
      classification: meta.classification,
      duplicate: duplicatePaths.length > 0,
      duplicatePaths,
      notes: []
    };
    current.notes.push({ path: `${cleanProject}/Inbox.md#${entry.heading}`, date: new Date().toISOString().slice(0, 10) });
    candidates.set(canonical, current);
  }
  const rows = [...candidates.values()].sort((a, b) => Number(a.duplicate) - Number(b.duplicate) || a.sourceKind.localeCompare(b.sourceKind) || a.domain.localeCompare(b.domain));
  return {
    ok: true,
    mode: "dry-run",
    source: "project-inbox",
    scope,
    project: cleanProject,
    noteplanPath: inboxFile,
    range: { start: "inbox", end: "inbox" },
    notesRead: 1,
    notes: [{ path: `${cleanProject}/Inbox.md`, date: "inbox", urls: rows.length }],
    urlsFound: rows.length,
    duplicates: rows.filter((item) => item.duplicate).length,
    newCandidates: rows.filter((item) => !item.duplicate).length,
    candidates: rows,
    next: "Aucune injection effectuee. Valider explicitement avant creation de fiches."
  };
}

function slugify(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90) || "noteplan-url";
}

function bookSlug(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90) || "livre-a-verifier";
}

function compactText(value, limit = 800) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, limit);
}

function titleFromUrl(url) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    const tail = parsed.pathname.split("/").filter(Boolean).slice(-2).join(" ");
    const raw = `${host} ${tail || ""}`.trim();
    return raw
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
      .slice(0, 140);
  } catch {
    return String(url || "NotePlan URL").slice(0, 140);
  }
}

async function uniqueMarkdownPath(root, folder, slug) {
  let current = slug;
  let counter = 2;
  while (true) {
    const rel = `${folder}/${current}.md`;
    const full = join(root, rel);
    if (!(await exists(full))) return { rel, full, slug: current };
    current = `${slug}-${counter}`;
    counter += 1;
  }
}

function appendUniqueText(content, line) {
  return content.includes(line) ? content : `${content.replace(/\s*$/, "\n")}${line}\n`;
}

async function appendUniqueFile(file, line) {
  const content = await readFile(file, "utf8").catch(() => "");
  const next = appendUniqueText(content, line);
  if (next !== content) await writeFile(file, next, "utf8");
}

function noteplanFicheMarkdown(item, target, date) {
  const notes = item.notes.map((note) => `- ${note.date} : \`${note.path}\``).join("\n");
  const tags = [
    "#noteplan",
    "#url",
    item.domain === "x.com" ? "#x" : "",
    item.domain === "github.com" ? "#github" : "",
    item.classification === "a verifier" ? "#a-verifier" : "",
    item.classification === "#ROUGE" ? "#ROUGE" : ""
  ].filter(Boolean).join(", ");
  return `# ${titleFromUrl(item.canonical)}

## Type

Veille NotePlan / lien extrait automatiquement.

## Tags

${tags}

## Appel canonique

\`${target.folder}:${target.slug}\`

## Source

URL : \`${item.canonical}\`

Domaine : ${item.domain || "inconnu"}

## Projet

${item.project || "Non renseigne"}

## Notes NotePlan

${notes}

## Resume court

Lien extrait de NotePlan sur la periode scannee. Contexte source a verifier avant usage KM.

## Usage KM

- Creer un point d'entree KM depuis les notes quotidiennes.
- Reprendre le lien, verifier la source, puis completer titre, auteur/source et resume si utile.
- Garder cette fiche comme brouillon de veille tant que la source n'est pas qualifiee.

## Risque d'abus possible

- Classification automatique imparfaite.
- Ne pas executer de code, scripts, payloads ou outils externes depuis cette fiche.
- Ne pas stocker de contenu complet tiers, secrets, emails prives ou donnees personnelles inutiles.

## Classification

${item.classification}

## Relations

- \`source:noteplan\`
${item.project ? `- \`projet:${item.project}\`` : ""}

## Historique

### v0.1 - ${date}

- Objectif : injection depuis scan NotePlan apres validation utilisateur.
- Fichiers touches : \`${target.rel}\`, \`index.md\`${target.folder === "watch" ? ", `watch/index.md`" : ""}.
- Rollback possible : supprimer cette fiche et retirer les lignes d'index.
`;
}

async function commandAvailable(command) {
  try {
    await execFileAsync("which", [command], { timeout: 10000 });
    return true;
  } catch {
    return false;
  }
}

async function ocrImage(imagePath) {
  const visionScript = join(APP_ROOT, "scripts", "km-ocr-vision.swift");
  if (await exists(visionScript) && await commandAvailable("swift")) {
    try {
      const result = await execFileAsync("swift", [visionScript, imagePath], {
        timeout: 120000,
        maxBuffer: 1024 * 1024 * 2
      });
      return { available: true, engine: "macos-vision", text: result.stdout, stderr: result.stderr };
    } catch (error) {
      if (!(await commandAvailable("tesseract"))) {
        return { available: false, engine: "macos-vision", text: error.stdout || "", stderr: error.stderr || error.message };
      }
    }
  }
  if (!(await commandAvailable("tesseract"))) {
    return { available: false, engine: "none", text: "", stderr: "OCR indisponible" };
  }
  try {
    const result = await execFileAsync("tesseract", [imagePath, "stdout", "-l", "fra+eng"], {
      timeout: 120000,
      maxBuffer: 1024 * 1024 * 2
    });
    return { available: true, engine: "tesseract", text: result.stdout, stderr: result.stderr };
  } catch (error) {
    return { available: true, engine: "tesseract", text: error.stdout || "", stderr: error.stderr || error.message };
  }
}

function extractIsbn(text) {
  const candidates = String(text || "").match(/(?:ISBN(?:-1[03])?[:\s]*)?(97[89][-\s]?)?\d[-\s]?\d{2,5}[-\s]?\d{2,7}[-\s]?[\dXx]/g) || [];
  for (const candidate of candidates) {
    const compact = candidate.replace(/^ISBN(?:-1[03])?[:\s]*/i, "").replace(/[-\s]/g, "").toUpperCase();
    if (/^(97[89])?\d{9}[\dX]$/.test(compact)) return compact;
  }
  return "";
}

async function fetchJson(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: { "Accept": "application/json", "User-Agent": "KM-Local-App/1.0" }
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function lookupOpenLibraryByIsbn(isbn) {
  const cleanIsbn = String(isbn || "").replace(/[-\s]/g, "").toUpperCase();
  if (!/^(97[89])?\d{9}[\dX]$/.test(cleanIsbn)) return null;
  const work = await fetchJson(`https://openlibrary.org/isbn/${encodeURIComponent(cleanIsbn)}.json`);
  if (!work) return { isbn: cleanIsbn, found: false, provider: "openlibrary" };
  const authorNames = [];
  for (const author of (work.authors || []).slice(0, 4)) {
    const key = author?.key;
    if (!key) continue;
    const authorData = await fetchJson(`https://openlibrary.org${key}.json`);
    if (authorData?.name) authorNames.push(authorData.name);
  }
  return {
    isbn: cleanIsbn,
    found: true,
    provider: "openlibrary",
    title: compactText(work.title || "", 180),
    subtitle: compactText(work.subtitle || "", 180),
    authors: [...new Set(authorNames)],
    publishers: (work.publishers || []).slice(0, 4).map((value) => compactText(value, 120)).filter(Boolean),
    publishDate: compactText(work.publish_date || "", 80),
    pages: work.number_of_pages || "",
    languages: (work.languages || []).map((lang) => String(lang.key || "").replace("/languages/", "")).filter(Boolean),
    openLibraryUrl: `https://openlibrary.org/isbn/${cleanIsbn}`
  };
}

function mergeBookReference(fields, reference) {
  if (!reference?.found) return { ...fields, reference: reference || null };
  const titleParts = [reference.title, reference.subtitle].filter(Boolean);
  return {
    ...fields,
    title: fields.title && fields.title !== basename(fields.imagePath || "").replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ")
      ? fields.title
      : compactText(titleParts.join(" - ") || fields.title, 180),
    author: fields.author || reference.authors.join(", "),
    source: fields.source || reference.openLibraryUrl || "photo locale non stockee",
    reference
  };
}

function extractBookFields({ imagePath, ocrText, title = "", author = "", isbn = "", source = "", tags = "" }) {
  const lines = String(ocrText || "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && line.length >= 3 && !/^isbn\b/i.test(line))
    .slice(0, 8);
  const inferredTitle = title || lines[0] || basename(imagePath).replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
  const inferredAuthor = author || lines.find((line, index) => index > 0 && !/\d{4}|edition|publisher|isbn/i.test(line)) || "";
  const cleanTags = String(tags || "livre, photo, ocr, km")
    .split(",")
    .map((tag) => bookSlug(tag.trim()))
    .filter(Boolean);
  return {
    imagePath,
    title: compactText(inferredTitle, 160),
    author: compactText(inferredAuthor, 120),
    isbn: compactText(isbn || extractIsbn(ocrText), 32),
    source: compactText(source || "photo locale non stockee", 220),
    tags: [...new Set(cleanTags)],
    ocrPreview: compactText(ocrText, 1200)
  };
}

async function existingBookKeys(kmRoot) {
  const root = resolve(kmRoot);
  const files = [];
  for (const folder of ["books", "resources", "km"]) {
    const full = join(root, folder);
    if (await exists(full)) files.push(...await walkMarkdown(full, 5000));
  }
  const keys = new Map();
  for (const file of files) {
    const rel = relative(root, file);
    const content = await readFile(file, "utf8");
    for (const isbn of String(content).match(/\b(?:97[89])?\d{9}[\dX]\b/gi) || []) {
      const key = `isbn:${isbn.toUpperCase()}`;
      if (!keys.has(key)) keys.set(key, []);
      keys.get(key).push(rel);
    }
    const heading = firstMarkdownHeading(content);
    if (heading) {
      const key = `title:${bookSlug(heading)}`;
      if (!keys.has(key)) keys.set(key, []);
      keys.get(key).push(rel);
    }
  }
  return keys;
}

function firstMarkdownHeading(content) {
  return String(content || "").match(/^#\s+(.+)$/m)?.[1]?.trim() || "";
}

async function scanBookPhotos({ bookPath, kmRoot, title = "", author = "", isbn = "", source = "", tags = "" }) {
  const root = safeReadableRoot(bookPath);
  const images = await walkImages(root);
  const keys = await existingBookKeys(kmRoot);
  const candidates = [];
  let ocrAvailable = null;
  for (const imagePath of images) {
    const ocr = await ocrImage(imagePath);
    ocrAvailable = ocr.available;
    let fields = extractBookFields({
      imagePath,
      ocrText: ocr.text,
      title: images.length === 1 ? title : "",
      author: images.length === 1 ? author : "",
      isbn: images.length === 1 ? isbn : "",
      source: images.length === 1 ? source : "",
      tags
    });
    const reference = await lookupOpenLibraryByIsbn(fields.isbn);
    fields = mergeBookReference(fields, reference);
    const fileTitle = basename(imagePath).replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
    if (!title && reference?.found && (!fields.title || fields.title === fileTitle)) {
      fields.title = compactText([reference.title, reference.subtitle].filter(Boolean).join(" - "), 180);
    }
    if (!author && reference?.found && reference.authors.length) fields.author = compactText(reference.authors.join(", "), 180);
    const titleKey = `title:${bookSlug(fields.title)}`;
    const isbnKey = fields.isbn ? `isbn:${fields.isbn}` : "";
    const duplicatePaths = [...new Set([...(isbnKey ? keys.get(isbnKey) || [] : []), ...(keys.get(titleKey) || [])])];
    candidates.push({
      imagePath,
      imageName: basename(imagePath),
      title: fields.title,
      author: fields.author,
      isbn: fields.isbn,
      source: fields.source,
      reference: fields.reference,
      tags: fields.tags,
      ocrAvailable: ocr.available,
      ocrEngine: ocr.engine || "",
      ocrWarning: ocr.stderr ? compactText(ocr.stderr, 300) : "",
      ocrPreview: fields.ocrPreview,
      duplicate: duplicatePaths.length > 0,
      duplicatePaths,
      classification: "a verifier",
      targetFolder: "books"
    });
  }
  return {
    ok: true,
    mode: "dry-run",
    source: "books-photo",
    bookPath: root,
    imagesFound: images.length,
    ocrAvailable: Boolean(ocrAvailable),
    duplicates: candidates.filter((item) => item.duplicate).length,
    newCandidates: candidates.filter((item) => !item.duplicate).length,
    candidates,
    next: "Aucune injection effectuee. Corriger titre/auteur/ISBN si besoin puis injecter."
  };
}

function bookFicheMarkdown(item, target, date) {
  const tags = item.tags.map((tag) => `#${tag}`).join(", ");
  const sourceLine = item.source || "photo locale non stockee";
  const ref = item.reference || {};
  const referenceLines = ref?.found ? [
    `- Provider : ${ref.provider}`,
    `- URL reference : ${ref.openLibraryUrl}`,
    `- Titre reference : ${ref.title || "A verifier"}`,
    ref.subtitle ? `- Sous-titre : ${ref.subtitle}` : "",
    ref.authors?.length ? `- Auteur(s) reference : ${ref.authors.join(", ")}` : "",
    ref.publishers?.length ? `- Editeur(s) : ${ref.publishers.join(", ")}` : "",
    ref.publishDate ? `- Date publication : ${ref.publishDate}` : "",
    ref.pages ? `- Pages : ${ref.pages}` : "",
    ref.languages?.length ? `- Langue(s) : ${ref.languages.join(", ")}` : ""
  ].filter(Boolean).join("\n") : "- Reference externe : A verifier";
  return `# ${item.title}

## Type

Fiche synthese livre depuis photo / OCR.

## Tags

${tags}

## Appel canonique

\`${target.canonical}\`

## Donnees bibliographiques

- Titre : ${item.title}
- Auteur/source : ${item.author || "A verifier"}
- ISBN : ${item.isbn || "A verifier"}
- Date d'integration : ${date}
- Source : ${sourceLine}
- Image locale analysee : ${item.imageName} (non stockee dans KM)

## Reference conservee

${referenceLines}

## Synthese

Livre identifie depuis une photo locale. Cette fiche conserve la reference bibliographique exploitable et sert de point d'entree pour une future note de lecture.

### Ce qui est etabli

- Titre detecte ou renseigne : ${item.title}
- Auteur detecte ou renseigne : ${item.author || "A verifier"}
- ISBN detecte ou renseigne : ${item.isbn || "A verifier"}
- Reference externe : ${ref?.found ? "trouvee" : "non confirmee"}

### A completer apres lecture

- These du livre.
- Idees fortes.
- Concepts reutilisables.
- Liens avec projets KM.

## Usage KM

- Indexer le livre sans copier le contenu sous copyright.
- Relier ensuite aux projets, concepts, notes de lecture et ressources.
- Completer par une synthese originale apres lecture.

## Extrait OCR court

${item.ocrPreview || "OCR indisponible ou non exploitable. Completer manuellement depuis la couverture/page ISBN."}

## Risque d'abus possible

- ISBN ou auteur mal detecte si la photo est floue.
- Ne pas stocker de scan, photo brute, PDF complet ou longs passages sous copyright.
- Verifier les metadonnees avant usage public.

## Classification

a verifier

## Relations

- \`source:photo-livre\`
- \`bucket:books\`
${item.isbn ? `- \`isbn:${item.isbn}\`` : ""}
${ref?.openLibraryUrl ? `- \`reference:${ref.openLibraryUrl}\`` : ""}

## Historique

### v0.1 - ${date}

- Objectif : creation depuis onglet Books / Photo.
- Fichiers touches : \`${target.rel}\`, \`books/index.md\`, \`index.md\`.
- Rollback possible : supprimer cette fiche et retirer les lignes d'index.
`;
}

async function ensureMarkdownIndex(path, title) {
  if (await exists(path)) return;
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `# ${title}

| Appel | Fichier | Type | Tags | Statut |
| --- | --- | --- | --- | --- |
`, "utf8");
}

async function ingestBookPhotos({ bookPath, kmRoot, title = "", author = "", isbn = "", source = "", tags = "" }) {
  const report = await scanBookPhotos({ bookPath, kmRoot, title, author, isbn, source, tags });
  const root = resolve(kmRoot);
  const date = new Date().toISOString().slice(0, 10);
  await ensureMarkdownIndex(join(root, "books", "index.md"), "Books Index");
  const created = [];
  const skipped = [];
  for (const item of report.candidates) {
    if (item.duplicate) {
      skipped.push({ title: item.title, isbn: item.isbn, reason: "duplicate", duplicatePaths: item.duplicatePaths });
      continue;
    }
    const slug = bookSlug(`${item.title} ${item.author || ""}`);
    const target = await uniqueMarkdownPath(root, "books", slug);
    target.folder = "books";
    target.canonical = `book:${target.slug}`;
    await mkdir(dirname(target.full), { recursive: true });
    await writeFile(target.full, bookFicheMarkdown(item, target, date), "utf8");
    const tagsText = item.tags.join(", ");
    const globalLine = `| \`${target.canonical}\` | \`${target.rel}\` | book-photo | ${tagsText} | a verifier |`;
    await appendUniqueFile(join(root, "index.md"), globalLine);
    await appendUniqueFile(join(root, "books", "index.md"), globalLine);
    if (await exists(join(root, "km", "history.md"))) {
      const historyLine = `| ${date} | Creation fiche ${target.canonical} depuis photo livre | ${target.rel}, books/index.md, index.md | OCR/metadonnees a verifier ; photo brute non stockee | Supprimer la fiche et retirer les lignes d'index |`;
      await appendUniqueFile(join(root, "km", "history.md"), historyLine);
    }
    created.push({ path: target.rel, canonical: target.canonical, title: item.title, isbn: item.isbn, classification: "a verifier" });
  }
  const searchBuild = await runNodeScript("build-search-v1.12-html.mjs", root);
  const kpromptBuild = await runNodeScript("build-kprompt-html.mjs", root);
  return {
    ok: true,
    action: "books-photo-ingest",
    bookPath: report.bookPath,
    created,
    skipped,
    totalCandidates: report.candidates.length,
    searchBuild,
    kpromptBuild
  };
}

async function ingestNotePlan({ noteplanPath, startDate, endDate, kmRoot, scope = "watch", sourceMode = "calendar", inboxRoot = "", project = "" }) {
  const report = sourceMode === "inbox"
    ? await scanProjectInbox({ inboxRoot, project, kmRoot, scope })
    : await scanNotePlan({ noteplanPath, startDate, endDate, kmRoot, scope });
  const root = resolve(kmRoot);
  const date = new Date().toISOString().slice(0, 10);
  const created = [];
  const skipped = [];
  for (const item of report.candidates) {
    if (item.duplicate) {
      skipped.push({ url: item.canonical, reason: "duplicate", duplicatePaths: item.duplicatePaths });
      continue;
    }
    const folder = item.targetFolder === "resources" ? "resources" : "watch";
    const slug = slugify(`${item.domain} ${new URL(item.canonical).pathname || ""}`);
    const target = await uniqueMarkdownPath(root, folder, slug);
    target.folder = folder;
    await mkdir(dirname(target.full), { recursive: true });
    await writeFile(target.full, noteplanFicheMarkdown(item, target, date), "utf8");
    const canonical = `${folder}:${target.slug}`;
    const tags = folder === "watch" ? "noteplan, url, watch" : "noteplan, url, resources";
    const globalLine = `| \`${canonical}\` | \`${target.rel}\` | veille-noteplan | ${tags} | ${item.classification} |`;
    await appendUniqueFile(join(root, "index.md"), globalLine);
    if (folder === "watch") await appendUniqueFile(join(root, "watch", "index.md"), globalLine);
    if (await exists(join(root, "km", "history.md"))) {
      const historyLine = `| ${date} | Creation fiche ${canonical} depuis NotePlan | ${target.rel}, index.md | ${item.classification} | Supprimer la fiche et retirer les lignes d'index |`;
      await appendUniqueFile(join(root, "km", "history.md"), historyLine);
    }
    created.push({ path: target.rel, canonical, url: item.canonical, classification: item.classification });
  }
  const searchBuild = await runNodeScript("build-search-v1.12-html.mjs", root);
  const kpromptBuild = await runNodeScript("build-kprompt-html.mjs", root);
  return {
    ok: true,
    action: "noteplan-ingest",
    noteplanPath: report.noteplanPath,
    range: report.range,
    created,
    skipped,
    totalCandidates: report.candidates.length,
    searchBuild,
    kpromptBuild
  };
}

async function scanNotePlan({ noteplanPath, startDate, endDate, kmRoot, scope = "watch" }) {
  const root = safeReadableRoot(noteplanPath);
  const start = isoDay(startDate);
  const end = isoDay(endDate);
  if (start > end) throw new Error("La date de debut doit etre avant la date de fin.");
  const rootStat = await stat(root);
  const files = rootStat.isFile() ? [root] : await walkMarkdown(root);
  const kmUrls = await existingKmUrls(kmRoot);
  const notes = [];
  const candidates = new Map();
  for (const file of files) {
    const info = await stat(file);
    const fileDate = dateFromFilename(basename(file)) || info.mtime.toISOString().slice(0, 10);
    if (fileDate < start || fileDate > end) continue;
    const content = await readFile(file, "utf8");
    const rel = relative(root, file) || basename(file);
    const urls = extractUrls(content);
    notes.push({ path: rel, date: fileDate, urls: urls.length });
    for (const url of urls) {
      const canonical = canonicalUrl(url);
      const scoped = noteplanScope(canonical);
      if (scope === "watch" && !scoped.keepForWatch) continue;
      const duplicatePaths = kmUrls.get(canonical) || [];
      const meta = classifyCandidate(canonical);
      const current = candidates.get(canonical) || {
        url,
        canonical,
        domain: meta.domain,
        scope: scoped.scope,
        reason: scoped.reason,
        targetFolder: meta.targetFolder,
        classification: meta.classification,
        duplicate: duplicatePaths.length > 0,
        duplicatePaths,
        notes: []
      };
      current.notes.push({ path: rel, date: fileDate });
      candidates.set(canonical, current);
    }
  }
  const rows = [...candidates.values()].sort((a, b) => Number(a.duplicate) - Number(b.duplicate) || a.domain.localeCompare(b.domain) || a.canonical.localeCompare(b.canonical));
  return {
    ok: true,
    mode: "dry-run",
    scope,
    noteplanPath: root,
    range: { start, end },
    notesRead: notes.length,
    notes,
    urlsFound: rows.length,
    duplicates: rows.filter((item) => item.duplicate).length,
    newCandidates: rows.filter((item) => !item.duplicate).length,
    candidates: rows,
    next: "Aucune injection effectuee. Valider explicitement avant creation de fiches."
  };
}

function safeStaticPath(kmRoot, requestedPath) {
  const root = resolve(kmRoot);
  const raw = String(requestedPath || "").replace(/^\/+/, "");
  if (!/\.(html|json)$/i.test(raw)) throw new Error("Fichier non servi.");
  const full = resolve(root, raw);
  const rel = relative(root, full);
  if (rel.startsWith("..") || rel.startsWith("/") || rel.includes("\0")) throw new Error("Chemin statique invalide.");
  return { full, rel };
}

function appMenu(current = "app") {
  const items = [
    ["index", "Accueil", "/index.html"],
    ["search", "Recherche", "/search-v1.12.html"],
    ["watch", "Watch", "/public/folders/watch.html"],
    ["resources", "Resources", "/public/folders/resources.html"],
    ["books", "Books", "/public/folders/books.html"],
    ["kprompt", "Kprompt", "/kprompt.html"],
    ["app", "App locale", "/"]
  ];
  return `<nav class="global-menu" aria-label="Menu principal">${items.map(([id, label, href]) => `<a class="${id === current ? "active" : ""}" href="${escapeHtml(href)}">${escapeHtml(label)}</a>`).join("")}</nav>`;
}

function appBreadcrumb(items) {
  return `<nav class="breadcrumb" aria-label="Fil d'ariane">${items.map((item, index) => index === items.length - 1 ? `<span>${escapeHtml(item.label)}</span>` : `<a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`).join("<b>/</b>")}</nav>`;
}

function editHtml(filePath, content) {
  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Modifier fiche KM</title>
  <style>
    :root{font-family:Arial,sans-serif;color:#161616;background:#f7f5ef}
    body{margin:0;padding:0 18px 18px}
    main{max-width:1120px;margin:0 auto}
    .global-menu{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin:0 -18px 0;padding:7px 18px;background:#fff;border-bottom:1px solid #d8d2c6}.global-menu a{border:1px solid #d8d2c6;background:#fff;color:#151515;padding:6px 8px;font-size:9px;font-weight:950;text-transform:uppercase;text-decoration:none}.global-menu a:hover,.global-menu a.active{background:#151515;border-color:#151515;color:#fff}
    .breadcrumb{display:flex;gap:7px;flex-wrap:wrap;align-items:center;margin:0 -18px 14px;padding:6px 18px;background:#fbfaf6;border-bottom:2px solid #151515;font-size:10px;font-weight:900;text-transform:uppercase;color:#666}.breadcrumb a{color:#151515;text-decoration:none}.breadcrumb b{color:#b0a99c}
    header{display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap;margin-bottom:12px}
    h1{font-size:22px;line-height:1.15;margin:0}
    .path{font-family:Menlo,monospace;font-size:12px;background:#fff;border:1px solid #d8d2c6;padding:8px;overflow:auto;margin-bottom:10px}
    textarea{box-sizing:border-box;width:100%;min-height:70vh;border:2px solid #151515;background:#fff;padding:12px;font:13px/1.45 Menlo,Consolas,monospace;resize:vertical}
    button,a{border:2px solid #151515;background:#151515;color:#fff;font-weight:900;padding:9px 12px;text-decoration:none;cursor:pointer;font-size:12px;text-transform:uppercase}
    .secondary{background:#fff;color:#151515}
    .danger{background:#e50000;border-color:#e50000}
    .row{display:flex;gap:8px;flex-wrap:wrap}
    .status{white-space:pre-wrap;font-family:Menlo,monospace;font-size:12px;background:#111;color:#fff;padding:10px;margin-top:10px;min-height:42px}
  </style>
</head>
<body>
${appMenu("app")}
${appBreadcrumb([{ label: "KM", href: "/index.html" }, { label: "App locale", href: "/" }, { label: "Edition" }, { label: filePath }])}
<main>
  <header>
    <h1>Modifier fiche KM</h1>
    <div class="row">
      <a class="secondary" href="/search-v1.12.html">KM</a>
      <a class="secondary" href="/kprompt.html">Kprompt</a>
      <a href="/">Veille</a>
      <button id="save">Enregistrer</button>
      <button class="danger" id="archive">Archiver</button>
    </div>
  </header>
  <div class="path" id="path">${escapeHtml(filePath)}</div>
  <textarea id="content">${escapeHtml(content)}</textarea>
  <div class="status" id="status">Pret.</div>
</main>
<script>
const path=${JSON.stringify(filePath)};
const statusEl=document.getElementById("status");
function setStatus(value){statusEl.textContent=typeof value==="string"?value:JSON.stringify(value,null,2)}
async function post(url,body){
  setStatus("Execution...");
  const res=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
  const json=await res.json();
  setStatus(json);
  return json;
}
document.getElementById("save").onclick=async()=>post("/api/save-fiche",{path,content:document.getElementById("content").value});
document.getElementById("archive").onclick=async()=>{
  if(!confirm("Archiver cette fiche ?"))return;
  const json=await post("/api/archive-fiche",{path});
  if(json.ok) setTimeout(()=>location.href="/",800);
};
</script>
</body>
</html>`;
}

async function chooseFolder() {
  const script = 'POSIX path of (choose folder with prompt "Choisir le dossier KM qui stocke les fiches")';
  const { stdout } = await execFileAsync("osascript", ["-e", script], { timeout: 120000 });
  return stdout.trim().replace(/\/$/, "");
}

async function chooseNotePlanFolder() {
  const script = 'POSIX path of (choose folder with prompt "Choisir le dossier NotePlan a scanner")';
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

async function appendLog(message, kmRoot = APP_ROOT) {
  const day = new Date().toISOString().slice(0, 10);
  const hhmm = new Date().toISOString().slice(11, 16);
  const logDir = join(resolve(kmRoot), "logs");
  const file = join(logDir, `${day}.log`);
  await mkdir(logDir, { recursive: true });
  const prior = await readFile(file, "utf8").catch(() => "");
  await writeFile(file, `${prior}[${hhmm}] ${message}\n`, "utf8");
}

function html(config) {
  const sourceRows = (type) => (config.sources?.[type] || [])
    .map((url) => `<li><span>${escapeHtml(url)}</span></li>`)
    .join("") || "<li class=\"muted\">Aucune source</li>";
  const projectConfig = config.projectConfig || {};
  const themes = projectConfig.themes || [];
  const folders = projectConfig.folders || [];
  const routing = projectConfig.themeRouting || {};
  const themeLegend = themes.map((theme) => `${theme.id} = ${theme.label}`).join(" · ");
  const folderLegend = folders.map((folder) => `${folder.id} (${folder.path})`).join(" · ");
  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>KM Monitor Local</title>
  <style>
    :root{font-family:Arial,sans-serif;color:#161616;background:#f7f5ef}
    body{margin:0;padding:0 24px 24px}
    main{max-width:920px;margin:0 auto}
    .global-menu{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin:0 -24px 0;padding:7px 24px;background:#fff;border-bottom:1px solid #d8d2c6}.global-menu a{border:1px solid #d8d2c6;background:#fff;color:#151515;padding:6px 8px;font-size:9px;font-weight:950;text-transform:uppercase;text-decoration:none}.global-menu a:hover,.global-menu a.active{background:#151515;border-color:#151515;color:#fff}
    .breadcrumb{display:flex;gap:7px;flex-wrap:wrap;align-items:center;margin:0 -24px 18px;padding:6px 24px;background:#fbfaf6;border-bottom:2px solid #151515;font-size:10px;font-weight:900;text-transform:uppercase;color:#666}.breadcrumb a{color:#151515;text-decoration:none}.breadcrumb b{color:#b0a99c}
    header{display:flex;gap:12px;align-items:center;justify-content:space-between;margin-bottom:20px}
    h1{font-size:28px;margin:0}
    h2{font-size:18px;margin:24px 0 10px}
    button,a.button{border:2px solid #151515;background:#151515;color:#fff;font-weight:800;padding:10px 14px;text-decoration:none;cursor:pointer}
    button.secondary,a.secondary{background:#fff;color:#151515}
    input,textarea{box-sizing:border-box;width:100%;border:2px solid #d8d2c6;background:#fff;padding:10px;font:inherit}
    input[type="date"]{min-width:170px}
    textarea{min-height:90px;resize:vertical}
    .panel{border:2px solid #d8d2c6;background:#fff;padding:16px;margin:14px 0}
    .tabs{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 14px}.tab{border:2px solid #151515;background:#fff;color:#151515;font-weight:900;padding:10px 14px;text-transform:uppercase}.tab.active{background:#151515;color:#fff}.tab-panel[hidden]{display:none}
    .row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
    .range{display:grid;grid-template-columns:repeat(2,minmax(170px,1fr)) 1fr auto;gap:10px;align-items:end}
    .field{display:grid;gap:5px;min-width:0}.field label{font-size:11px;font-weight:900;text-transform:uppercase;color:#666}
    .path{font-family:Menlo,monospace;font-size:13px;background:#f1eee7;padding:10px;overflow:auto}
    .muted{color:#666}
    .status{white-space:pre-wrap;font-family:Menlo,monospace;font-size:12px;background:#111;color:#f5f5f5;padding:12px;min-height:80px}.status a{color:#9bd3ff;font-weight:900}
    ul{padding-left:18px}
    @media(max-width:760px){.range{grid-template-columns:1fr}.tabs .tab{flex:1 1 auto}}
  </style>
</head>
<body>
${appMenu("app")}
${appBreadcrumb([{ label: "KM", href: "/index.html" }, { label: "App locale" }])}
<main>
  <header>
    <h1>KM Monitor Local</h1>
    <div class="row">
      <a class="button secondary" href="/${escapeHtml(config.dashboard || "search-v1.12.html")}">KM</a>
      <a class="button secondary" href="/kprompt.html">Kprompt</a>
      <a class="button" href="/">Veille</a>
    </div>
  </header>

  <nav class="tabs" aria-label="Onglets app">
    <button class="tab active" data-tab="veille" type="button">Veille</button>
    <button class="tab" data-tab="noteplan" type="button">NotePlan</button>
    <button class="tab" data-tab="books" type="button">Books / Photo</button>
  </nav>

  <div class="tab-panel" id="tab-veille">
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
    <h2>Themes dossiers / fiches</h2>
    <p class="muted">Themes disponibles : ${escapeHtml(themeLegend || "aucun")}</p>
    <p class="muted">Dossiers : ${escapeHtml(folderLegend || "aucun")}</p>
    <label>Themes par dossier</label>
    <textarea id="folderThemes" placeholder="watch=tool&#10;resources=research">${escapeHtml(keyValueLines(routing.folderDefaults))}</textarea>
    <label>Themes forces par fiche</label>
    <textarea id="fileThemes" placeholder="watch/ma-fiche.md=dev">${escapeHtml(keyValueLines(routing.fileOverrides))}</textarea>
    <div class="row" style="margin-top:12px">
      <button id="saveThemes">Enregistrer themes</button>
      <button class="secondary" id="reloadThemes">Recharger</button>
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
  </div>

  <div class="tab-panel" id="tab-noteplan" hidden>
  <section class="panel">
    <h2>NotePlan dry-run</h2>
    <p class="muted">Scan uniquement. Aucune fiche creee, aucun index modifie.</p>
    <div class="range" style="margin-top:12px">
      <div class="field">
        <label for="noteplanMode">Source</label>
        <select id="noteplanMode"><option value="inbox">Inbox projet</option><option value="calendar">Calendar periode</option></select>
      </div>
      <div class="field">
        <label for="noteplanProject">Projet KM</label>
        <select id="noteplanProject"><option value="DEV">DEV</option><option value="Mirae">Mirae</option><option value="NightIntel">NightIntel</option></select>
      </div>
      <div class="field">
        <label for="noteplanInboxRoot">Root Inbox</label>
        <input id="noteplanInboxRoot" value="${escapeHtml(config.noteplanInboxRoot || defaultConfig.noteplanInboxRoot)}">
      </div>
      <div class="field">
        <label for="noteplanScope">Portee</label>
        <select id="noteplanScope"><option value="watch">Veille uniquement</option><option value="all">Tous les liens</option></select>
      </div>
      <div class="field">
        <label for="noteplanPath">Path Calendar</label>
        <input id="noteplanPath" value="${escapeHtml(config.noteplanPath || defaultConfig.noteplanPath)}" placeholder="/Users/JOB/Library/Containers/.../Calendar">
      </div>
      <button class="secondary" id="chooseNotePlanPath" type="button">Choisir</button>
      <div class="field">
        <label for="noteplanStart">Debut</label>
        <input id="noteplanStart" type="date">
      </div>
      <div class="field">
        <label for="noteplanEnd">Fin</label>
        <input id="noteplanEnd" type="date">
      </div>
      <button id="scanNotePlan" type="button">Scanner</button>
      <button class="secondary" id="ingestNotePlan" type="button">Injecter les nouveaux</button>
    </div>
  </section>
  <section class="panel">
    <h2>Rapport avant injection</h2>
    <div class="status" id="noteplanReport">Pret. Donne un path NotePlan, choisis une periode, puis scanne.</div>
  </section>
  </div>

  <div class="tab-panel" id="tab-books" hidden>
  <section class="panel">
    <h2>Books / Photo dry-run</h2>
    <p class="muted">Analyse une photo ou un dossier d'images. Les photos ne sont pas copiees dans KM.</p>
    <div class="field" style="margin-top:12px">
      <label for="bookPath">Path photo ou dossier</label>
      <input id="bookPath" value="${escapeHtml(config.bookInboxPath || defaultConfig.bookInboxPath)}" placeholder="/Users/JOB/.../books/_inbox">
    </div>
    <div class="range" style="margin-top:12px">
      <div class="field">
        <label for="bookTitle">Titre manuel</label>
        <input id="bookTitle" placeholder="Optionnel, utile si OCR absent">
      </div>
      <div class="field">
        <label for="bookAuthor">Auteur manuel</label>
        <input id="bookAuthor" placeholder="Optionnel">
      </div>
      <div class="field">
        <label for="bookIsbn">ISBN manuel</label>
        <input id="bookIsbn" placeholder="Optionnel">
      </div>
      <div class="field">
        <label for="bookTags">Tags</label>
        <input id="bookTags" value="livre, photo, ocr, km">
      </div>
    </div>
    <div class="field" style="margin-top:12px">
      <label for="bookSource">Source / contexte</label>
      <input id="bookSource" placeholder="photo locale non stockee">
    </div>
    <div class="row" style="margin-top:12px">
      <button id="scanBooks" type="button">Scanner photo</button>
      <button class="secondary" id="ingestBooks" type="button">Injecter livres</button>
    </div>
  </section>
  <section class="panel">
    <h2>Rapport Books avant injection</h2>
    <div class="status" id="booksReport">Pret. Donne une photo ou un dossier, scanne, puis injecte uniquement si le rapport est correct.</div>
  </section>
  </div>
</main>
<script>
const statusEl = document.getElementById("status");
const noteplanReportEl = document.getElementById("noteplanReport");
const booksReportEl = document.getElementById("booksReport");
const kmRootEl = document.getElementById("kmRoot");
function lines(id){return document.getElementById(id).value.split("\\n").map(x=>x.trim()).filter(Boolean)}
function keyvals(id){return Object.fromEntries(document.getElementById(id).value.split("\\n").map(x=>x.trim()).filter(Boolean).map(line=>line.split(/[=:]/)).filter(parts=>parts.length>=2).map(parts=>[parts.shift().trim(),parts.join("=").trim()]).filter(([k,v])=>k&&v))}
function setStatus(value){statusEl.textContent = typeof value === "string" ? value : JSON.stringify(value,null,2)}
function escHtml(value){return String(value == null ? "" : value).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]})}
function renderNotePlanReport(json){
  if(!json || typeof json !== "object") return escHtml(json || "");
  if(json.action === "noteplan-ingest"){
    var created = json.created || [], skipped = json.skipped || [];
    return [
      "<strong>INJECTION NOTEPLAN</strong>",
      "Periode: " + escHtml((json.range && json.range.start) || "-") + " -> " + escHtml((json.range && json.range.end) || "-"),
      "Candidats: " + escHtml(json.totalCandidates || 0),
      "Fiches creees: " + created.length,
      "Doublons ignores: " + skipped.length,
      created.length ? "\\nFICHES CREEES\\n" + created.map(function(item){return "- <a href=\\"/" + escHtml(item.path) + "\\" target=\\"_blank\\">" + escHtml(item.path) + "</a> | " + escHtml(item.classification) + " | " + escHtml(item.url)}).join("\\n") : "\\nAUCUNE FICHE CREEE. La liste Search ne change pas.",
      skipped.length ? "\\nDOUBLONS\\n" + skipped.map(function(item){return "- " + escHtml(item.url) + " -> " + escHtml((item.duplicatePaths || []).join(", "))}).join("\\n") : "",
      '\\n<a href="/search-v1.12.html">Ouvrir Search</a> · <a href="/public/folders/watch.html">Ouvrir Watch</a>'
    ].filter(Boolean).join("\\n");
  }
  if(json.mode === "dry-run"){
    var candidates = json.candidates || [];
    return [
      "<strong>SCAN NOTEPLAN DRY-RUN</strong>",
      "Source: " + escHtml(json.source || "calendar"),
      "Projet: " + escHtml(json.project || "-"),
      "Notes lues: " + escHtml(json.notesRead || 0),
      "Portee: " + escHtml(json.scope || "watch"),
      "URLs trouvees: " + escHtml(json.urlsFound || 0),
      "Nouveaux candidats: " + escHtml(json.newCandidates || 0),
      "Doublons: " + escHtml(json.duplicates || 0),
      candidates.length ? "\\nCANDIDATS\\n" + candidates.slice(0,80).map(function(item){return "- " + escHtml(item.duplicate ? "DOUBLON" : "NOUVEAU") + " | " + escHtml(item.scope || "-") + " | " + escHtml(item.reason || "-") + " | " + escHtml(item.classification) + " | " + escHtml(item.targetFolder) + " | " + escHtml(item.canonical)}).join("\\n") : "\\nAucun lien trouve sur cette periode."
    ].join("\\n");
  }
  return escHtml(JSON.stringify(json,null,2));
}
function setNotePlanReport(value){noteplanReportEl.innerHTML = renderNotePlanReport(value)}
function renderBooksReport(json){
  if(!json || typeof json !== "object") return escHtml(json || "");
  if(json.action === "books-photo-ingest"){
    var created = json.created || [], skipped = json.skipped || [];
    return [
      "<strong>INJECTION BOOKS / PHOTO</strong>",
      "Source: " + escHtml(json.bookPath || "-"),
      "Candidats: " + escHtml(json.totalCandidates || 0),
      "Fiches creees: " + created.length,
      "Doublons ignores: " + skipped.length,
      created.length ? "\\nFICHES CREEES\\n" + created.map(function(item){return "- <a href=\\"/edit?path=" + encodeURIComponent(item.path) + "\\" target=\\"_blank\\">" + escHtml(item.path) + "</a> | " + escHtml(item.title) + " | ISBN " + escHtml(item.isbn || "A_VERIFIER")}).join("\\n") : "\\nAUCUNE FICHE CREEE.",
      skipped.length ? "\\nDOUBLONS\\n" + skipped.map(function(item){return "- " + escHtml(item.title || item.isbn || "-") + " -> " + escHtml((item.duplicatePaths || []).join(", "))}).join("\\n") : "",
      '\\n<a href="/search-v1.12.html">Ouvrir Search</a>'
    ].filter(Boolean).join("\\n");
  }
  if(json.mode === "dry-run" && json.source === "books-photo"){
    var candidates = json.candidates || [];
    return [
      "<strong>SCAN BOOKS / PHOTO DRY-RUN</strong>",
      "Path: " + escHtml(json.bookPath || "-"),
      "Images trouvees: " + escHtml(json.imagesFound || 0),
      "OCR local: " + escHtml(json.ocrAvailable ? "actif" : "indisponible"),
      "Nouveaux candidats: " + escHtml(json.newCandidates || 0),
      "Doublons: " + escHtml(json.duplicates || 0),
      candidates.length ? "\\nCANDIDATS\\n" + candidates.slice(0,80).map(function(item){var ref=item.reference&&item.reference.found?(" | ref " + item.reference.provider):" | ref A_VERIFIER";return "- " + escHtml(item.duplicate ? "DOUBLON" : "NOUVEAU") + " | " + escHtml(item.imageName) + " | " + escHtml(item.ocrEngine || "ocr") + " | " + escHtml(item.title) + " | " + escHtml(item.author || "Auteur A_VERIFIER") + " | ISBN " + escHtml(item.isbn || "A_VERIFIER") + escHtml(ref) + (item.ocrWarning ? " | " + escHtml(item.ocrWarning) : "")}).join("\\n") : "\\nAucune image exploitable."
    ].join("\\n");
  }
  return escHtml(JSON.stringify(json,null,2));
}
function setBooksReport(value){booksReportEl.innerHTML = renderBooksReport(value)}
async function api(path, body){
  setStatus("Execution...");
  const res = await fetch(path,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body||{})});
  const json = await res.json();
  setStatus(json);
  if(json.config?.kmRoot) kmRootEl.textContent = json.config.kmRoot;
  return json;
}
function today(){return new Date().toISOString().slice(0,10)}
function setDefaultDates(){const end=today();const d=new Date(end+"T00:00:00");d.setDate(d.getDate()-7);document.getElementById("noteplanEnd").value=end;document.getElementById("noteplanStart").value=d.toISOString().slice(0,10)}
document.querySelectorAll("[data-tab]").forEach(btn=>btn.onclick=()=>{document.querySelectorAll("[data-tab]").forEach(item=>item.classList.toggle("active",item===btn));document.querySelectorAll(".tab-panel").forEach(panel=>panel.hidden=panel.id!=="tab-"+btn.dataset.tab)});
document.getElementById("chooseRoot").onclick = () => api("/api/choose-root");
document.getElementById("validateRoot").onclick = () => api("/api/validate-root");
document.getElementById("saveSources").onclick = () => api("/api/save-sources",{sources:{rss:lines("rss"),twitter:lines("twitter"),reddit:lines("reddit")}});
document.getElementById("saveThemes").onclick = () => api("/api/save-themes",{themeRouting:{folderDefaults:keyvals("folderThemes"),fileOverrides:keyvals("fileThemes")}});
document.getElementById("reloadThemes").onclick = () => location.reload();
document.getElementById("build").onclick = () => api("/api/build");
document.getElementById("ingest").onclick = () => api("/api/ingest-raindrop");
document.getElementById("scanNotePlan").onclick = async () => {
  setNotePlanReport("Scan NotePlan...");
  const res = await fetch("/api/noteplan-scan",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sourceMode:document.getElementById("noteplanMode").value,project:document.getElementById("noteplanProject").value,inboxRoot:document.getElementById("noteplanInboxRoot").value,noteplanPath:document.getElementById("noteplanPath").value,scope:document.getElementById("noteplanScope").value,startDate:document.getElementById("noteplanStart").value,endDate:document.getElementById("noteplanEnd").value})});
  const json = await res.json();
  setNotePlanReport(json);
};
document.getElementById("ingestNotePlan").onclick = async () => {
  if(!confirm("Injecter les nouveaux candidats NotePlan dans KM ? Les doublons seront ignores.")) return;
  setNotePlanReport("Injection NotePlan...");
  const res = await fetch("/api/noteplan-ingest",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sourceMode:document.getElementById("noteplanMode").value,project:document.getElementById("noteplanProject").value,inboxRoot:document.getElementById("noteplanInboxRoot").value,noteplanPath:document.getElementById("noteplanPath").value,scope:document.getElementById("noteplanScope").value,startDate:document.getElementById("noteplanStart").value,endDate:document.getElementById("noteplanEnd").value})});
  const json = await res.json();
  setNotePlanReport(json);
};
document.getElementById("chooseNotePlanPath").onclick = async () => {
  setNotePlanReport("Selection dossier NotePlan...");
  const res = await fetch("/api/choose-noteplan-root",{method:"POST",headers:{"Content-Type":"application/json"},body:"{}"});
  const json = await res.json();
  if(json.ok) document.getElementById("noteplanPath").value = json.noteplanPath;
  setNotePlanReport(json);
};
function bookPayload(){
  return {
    bookPath: document.getElementById("bookPath").value,
    title: document.getElementById("bookTitle").value,
    author: document.getElementById("bookAuthor").value,
    isbn: document.getElementById("bookIsbn").value,
    source: document.getElementById("bookSource").value,
    tags: document.getElementById("bookTags").value
  };
}
document.getElementById("scanBooks").onclick = async () => {
  setBooksReport("Scan Books / Photo...");
  const res = await fetch("/api/books-scan",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(bookPayload())});
  const json = await res.json();
  setBooksReport(json);
};
document.getElementById("ingestBooks").onclick = async () => {
  if(!confirm("Injecter ces livres dans KM ? Les photos ne seront pas copiees.")) return;
  setBooksReport("Injection Books / Photo...");
  const res = await fetch("/api/books-ingest",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(bookPayload())});
  const json = await res.json();
  setBooksReport(json);
};
setDefaultDates();
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
    if (req.method === "OPTIONS") return sendJson(res, 200, { ok: true });
    try {
      config.projectConfig = await readProjectConfig(config.kmRoot);
    } catch {}
    const url = new URL(req.url || "/", `http://${HOST}:${DEFAULT_PORT}`);
    if (req.method === "GET" && url.pathname === "/") return sendHtml(res, html(config));
    if (req.method === "GET" && /\.(html|json)$/i.test(url.pathname)) {
      const staticFile = safeStaticPath(config.kmRoot, decodeURIComponent(url.pathname));
      const contentType = staticFile.rel.endsWith(".json") ? "application/json; charset=utf-8" : "text/html; charset=utf-8";
      return sendFile(res, staticFile.full, contentType);
    }
    if (req.method === "GET" && url.pathname === "/edit") {
      const fiche = safeMarkdownPath(config.kmRoot, url.searchParams.get("path"));
      return sendHtml(res, editHtml(fiche.rel, await readFile(fiche.full, "utf8")));
    }
    if (req.method === "GET" && url.pathname === "/api/config") return sendJson(res, 200, { ok: true, config });
    if (req.method !== "POST") return sendJson(res, 404, { ok: false, error: "not_found" });

    if (url.pathname === "/api/choose-root") {
      const picked = await chooseFolder();
      const validation = await validateKmRoot(picked);
      const next = { ...config, kmRoot: validation.root };
      await writeConfig(next);
      return sendJson(res, validation.ok ? 200 : 422, { ok: validation.ok, config: next, validation });
    }

    if (url.pathname === "/api/validate-root") {
      const validation = await validateKmRoot(config.kmRoot);
      return sendJson(res, validation.ok ? 200 : 422, { ok: validation.ok, config, validation });
    }

    if (url.pathname === "/api/save-sources") {
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

    if (url.pathname === "/api/save-themes") {
      const body = await readBody(req);
      const validation = await validateKmRoot(config.kmRoot);
      if (!validation.ok) return sendJson(res, 422, { ok: false, validation });
      const projectConfig = await readProjectConfig(validation.root);
      const themeIds = new Set((projectConfig.themes || []).map((theme) => theme.id));
      const cleanRouting = {
        folderDefaults: Object.fromEntries(
          Object.entries(body.themeRouting?.folderDefaults || {}).filter(([, theme]) => themeIds.has(theme))
        ),
        fileOverrides: Object.fromEntries(
          Object.entries(body.themeRouting?.fileOverrides || {}).filter(([, theme]) => themeIds.has(theme))
        )
      };
      projectConfig.themeRouting = cleanRouting;
      await writeProjectConfig(validation.root, projectConfig);
      const result = await runNodeScript("build-search-v1.12-html.mjs", validation.root);
      return sendJson(res, 200, { ok: true, action: "save-themes", themeRouting: cleanRouting, build: result });
    }

    if (url.pathname === "/api/save-fiche") {
      const body = await readBody(req);
      const validation = await validateKmRoot(config.kmRoot);
      if (!validation.ok) return sendJson(res, 422, { ok: false, validation });
      const fiche = safeMarkdownPath(validation.root, body.path);
      await writeFile(fiche.full, String(body.content || "").replace(/\s*$/, "\n"), "utf8");
      const build = await runNodeScript("build-search-v1.12-html.mjs", validation.root);
      return sendJson(res, 200, { ok: true, action: "save-fiche", path: fiche.rel, build });
    }

    if (url.pathname === "/api/archive-fiche") {
      const body = await readBody(req);
      const validation = await validateKmRoot(config.kmRoot);
      if (!validation.ok) return sendJson(res, 422, { ok: false, validation });
      const fiche = safeMarkdownPath(validation.root, body.path);
      const day = new Date().toISOString().slice(0, 10);
      const archiveDir = join(validation.root, "archive", day);
      await mkdir(archiveDir, { recursive: true });
      const target = join(archiveDir, basename(fiche.full));
      await rename(fiche.full, target);
      const build = await runNodeScript("build-search-v1.12-html.mjs", validation.root);
      return sendJson(res, 200, { ok: true, action: "archive-fiche", from: fiche.rel, to: relative(validation.root, target), build });
    }

    if (url.pathname === "/api/build") {
      const validation = await validateKmRoot(config.kmRoot);
      if (!validation.ok) return sendJson(res, 422, { ok: false, validation });
      const result = await runNodeScript("build-search-v1.12-html.mjs", validation.root);
      return sendJson(res, 200, { ok: true, action: "build", ...result });
    }

    if (url.pathname === "/api/ingest-raindrop") {
      const validation = await validateKmRoot(config.kmRoot);
      if (!validation.ok) return sendJson(res, 422, { ok: false, validation });
      const ingest = await runNodeScript("km-raindrop-rss-ingest.mjs", validation.root);
      const build = await runNodeScript("build-search-v1.12-html.mjs", validation.root);
      return sendJson(res, 200, { ok: true, action: "ingest-raindrop", ingest, build });
    }

    if (url.pathname === "/api/noteplan-scan") {
      const body = await readBody(req);
      const validation = await validateKmRoot(config.kmRoot);
      if (!validation.ok) return sendJson(res, 422, { ok: false, validation });
      const nextConfig = { ...config };
      if (body.noteplanPath) nextConfig.noteplanPath = body.noteplanPath;
      if (body.inboxRoot) nextConfig.noteplanInboxRoot = body.inboxRoot;
      if (body.project) nextConfig.noteplanProject = body.project;
      await writeConfig(nextConfig);
      const report = body.sourceMode === "inbox"
        ? await scanProjectInbox({ inboxRoot: body.inboxRoot || nextConfig.noteplanInboxRoot, project: body.project || nextConfig.noteplanProject, kmRoot: validation.root, scope: body.scope === "all" ? "all" : "watch" })
        : await scanNotePlan({ noteplanPath: body.noteplanPath, startDate: body.startDate, endDate: body.endDate, kmRoot: validation.root, scope: body.scope === "all" ? "all" : "watch" });
      return sendJson(res, 200, report);
    }

    if (url.pathname === "/api/noteplan-ingest") {
      const body = await readBody(req);
      const validation = await validateKmRoot(config.kmRoot);
      if (!validation.ok) return sendJson(res, 422, { ok: false, validation });
      const nextConfig = { ...config };
      if (body.noteplanPath) nextConfig.noteplanPath = body.noteplanPath;
      if (body.inboxRoot) nextConfig.noteplanInboxRoot = body.inboxRoot;
      if (body.project) nextConfig.noteplanProject = body.project;
      await writeConfig(nextConfig);
      const report = await ingestNotePlan({
        noteplanPath: body.noteplanPath,
        startDate: body.startDate,
        endDate: body.endDate,
        kmRoot: validation.root,
        scope: body.scope === "all" ? "all" : "watch",
        sourceMode: body.sourceMode === "inbox" ? "inbox" : "calendar",
        inboxRoot: body.inboxRoot || nextConfig.noteplanInboxRoot,
        project: body.project || nextConfig.noteplanProject
      });
      await appendLog(`NOTEPLAN_INGEST | created=${report.created.length} skipped=${report.skipped.length} range=${report.range.start}..${report.range.end}`, validation.root);
      return sendJson(res, 200, report);
    }

    if (url.pathname === "/api/books-scan") {
      const body = await readBody(req);
      const validation = await validateKmRoot(config.kmRoot);
      if (!validation.ok) return sendJson(res, 422, { ok: false, validation });
      const nextConfig = { ...config };
      if (body.bookPath) nextConfig.bookInboxPath = body.bookPath;
      await writeConfig(nextConfig);
      const report = await scanBookPhotos({
        bookPath: body.bookPath || nextConfig.bookInboxPath,
        kmRoot: validation.root,
        title: body.title,
        author: body.author,
        isbn: body.isbn,
        source: body.source,
        tags: body.tags
      });
      return sendJson(res, 200, report);
    }

    if (url.pathname === "/api/books-ingest") {
      const body = await readBody(req);
      const validation = await validateKmRoot(config.kmRoot);
      if (!validation.ok) return sendJson(res, 422, { ok: false, validation });
      const nextConfig = { ...config };
      if (body.bookPath) nextConfig.bookInboxPath = body.bookPath;
      await writeConfig(nextConfig);
      const report = await ingestBookPhotos({
        bookPath: body.bookPath || nextConfig.bookInboxPath,
        kmRoot: validation.root,
        title: body.title,
        author: body.author,
        isbn: body.isbn,
        source: body.source,
        tags: body.tags
      });
      await appendLog(`BOOKS_PHOTO_INGEST | created=${report.created.length} skipped=${report.skipped.length} source=${report.bookPath}`, validation.root);
      return sendJson(res, 200, report);
    }

    if (url.pathname === "/api/choose-noteplan-root") {
      const noteplanPath = await chooseNotePlanFolder();
      await writeConfig({ ...config, noteplanPath });
      return sendJson(res, 200, { ok: true, noteplanPath });
    }

    return sendJson(res, 404, { ok: false, error: "not_found" });
  } catch (error) {
    return sendJson(res, 500, { ok: false, error: error.message });
  }
});

server.listen(DEFAULT_PORT, HOST, () => {
  console.log(`KM Monitor Local: http://${HOST}:${DEFAULT_PORT}`);
});
