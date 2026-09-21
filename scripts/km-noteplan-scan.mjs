#!/usr/bin/env node
import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const ROOT = process.env.KM_ROOT || path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const NOTEPLAN_ROOT = process.env.NOTEPLAN_ROOT || path.join(
  process.env.HOME || "",
  "Library/Containers/co.noteplan.NotePlan-setapp/Data/Library/Application Support/co.noteplan.NotePlan-setapp"
);
const DEFAULT_OUT = process.env.KM_NOTEPLAN_OUT || "/private/tmp/km-noteplan-runs";
const OLLAMA_URL = process.env.OLLAMA_URL || "http://127.0.0.1:11434/api/generate";
const DEFAULT_MODEL = process.env.KM_OLLAMA_MODEL || "qwen3:8b";

const args = new Map();
for (let i = 2; i < process.argv.length; i += 1) {
  const arg = process.argv[i];
  if (arg.startsWith("--")) {
    const [key, inline] = arg.split("=", 2);
    if (inline !== undefined) args.set(key, inline);
    else if (process.argv[i + 1] && !process.argv[i + 1].startsWith("--")) args.set(key, process.argv[++i]);
    else args.set(key, "true");
  }
}

const days = Number(args.get("--days") || 21);
const useOllama = args.has("--ollama");
const model = args.get("--model") || DEFAULT_MODEL;
const inputJson = args.get("--input");
const outRoot = path.resolve(args.get("--out") || DEFAULT_OUT);
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const outDir = path.join(outRoot, timestamp);

function cleanUrl(value = "") {
  return value.trim().replace(/[.,;:!?)}`]+$/g, "");
}

function urls(value = "") {
  return [...value.matchAll(/https?:\/\/[^\s<>\[\]"']+/g)].map((match) => cleanUrl(match[0]));
}

function canonicalUrl(value = "") {
  try {
    const url = new URL(cleanUrl(value));
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    let pathname = decodeURIComponent(url.pathname).replace(/\/$/, "");
    if (host === "github.com") pathname = pathname.toLowerCase().replace(/\.git$/, "");
    const query = [...url.searchParams.entries()]
      .filter(([key]) => !key.startsWith("utm_") && !["ref", "source", "fbclid"].includes(key))
      .map(([key, val]) => `${key}=${val}`)
      .join("&");
    return `${host}${pathname}${query ? `?${query}` : ""}`;
  } catch {
    return cleanUrl(value).toLowerCase();
  }
}

function ignoredCanonical(canon = "") {
  const host = canon.split("/")[0] || "";
  return host.includes("localhost")
    || host.includes("127.0.0.1")
    || host.includes("192.168.")
    || canon.includes("chatgpt.com/c/")
    || canon.includes("chat.openai.com/")
    || canon.includes("claude.ai/");
}

function priorityCandidate(row) {
  const url = row.url.toLowerCase();
  const include = [
    "github.com", "huggingface.co", "noteplan.co", "tosdr.org", "tiddlywiki.com",
    "triliumnotes.org", "getupnote.com", "vdo.ninja", "filespane.com",
    "captains-deck.com", "opensanctions.org", "poligraph.fr", "quipossede.fr",
    "mammouth.ai", "opencode.ai", "codepen.io", "magicelklabs.com"
  ];
  const exclude = [
    "instagram.com", "facebook.com", "linkedin.com", "perplexity.ai", "nperf.com",
    "sciencesconf.org", "google.com", "chatgpt.com", "openai.com"
  ];
  return row.status !== "FICHE EXISTANTE"
    && include.some((part) => url.includes(part))
    && !exclude.some((part) => url.includes(part));
}

async function walkMarkdown(root, options = {}) {
  const out = [];
  async function walk(dir) {
    let entries = [];
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      const rel = path.relative(root, full);
      if (rel.split(path.sep).some((part) => part.startsWith(".")
        || ["@Archive", "@Trash", "@Templates", "node_modules", "_archive", "tests"].includes(part)
        || part.endsWith("_attachments"))) continue;
      if (entry.isDirectory()) await walk(full);
      else if (entry.isFile() && [".md", ".txt"].includes(path.extname(entry.name).toLowerCase())) out.push(full);
    }
  }
  await walk(root);
  return options.sort === false ? out : out.sort();
}

async function scanNotePlan() {
  const now = new Date();
  const start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  start.setHours(0, 0, 0, 0);
  const startDate = start.toISOString().slice(0, 10).replace(/-/g, "");
  const endDate = now.toISOString().slice(0, 10).replace(/-/g, "");
  const notes = [];

  for (const base of ["Notes", "Calendar"]) {
    const baseDir = path.join(NOTEPLAN_ROOT, base);
    if (!existsSync(baseDir)) continue;
    try {
      await readdir(baseDir);
    } catch (error) {
      throw new Error(`NotePlan ${base} illisible: ${baseDir} (${error.code || error.message})`);
    }
    const files = await walkMarkdown(baseDir);
    for (const file of files) {
      const info = await stat(file);
      const modified = new Date(info.mtimeMs);
      const name = path.basename(file);
      const dated = base === "Calendar" && /^\d{8}/.test(name) && name.slice(0, 8) >= startDate && name.slice(0, 8) <= endDate;
      if (!(modified >= start || dated)) continue;
      const bytes = await readFile(file);
      notes.push({
        path: path.join(base, path.relative(baseDir, file)),
        modified: modified.toISOString(),
        dated,
        body: bytes.toString("utf8"),
        sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
      });
    }
  }
  return { start: start.toISOString(), end: now.toISOString(), notes };
}

async function collectKnownKm() {
  const known = new Map();
  const files = await walkMarkdown(ROOT);
  for (const file of files) {
    if (!["watch", "resources", "books", "km", "prompts"].some((dir) => path.relative(ROOT, file).startsWith(`${dir}${path.sep}`))) continue;
    const text = await readFile(file, "utf8").catch(() => "");
    for (const url of urls(text)) {
      const canon = canonicalUrl(url);
      if (!known.has(canon)) known.set(canon, new Set());
      known.get(canon).add(path.relative(ROOT, file));
    }
  }
  return known;
}

function extractRows(scan, known) {
  const byUrl = new Map();
  const twitter = new Map();
  for (const note of scan.notes || []) {
    const lines = String(note.body || "").split("\n");
    for (let i = 0; i < lines.length; i += 1) {
      for (const url of urls(lines[i])) {
        const canon = canonicalUrl(url);
        if (ignoredCanonical(canon)) continue;
        if (!byUrl.has(canon)) byUrl.set(canon, { url, canonical: canon, sources: [], lines: [] });
        const row = byUrl.get(canon);
        row.sources.push(`${note.path}:${i + 1}`);
        row.lines.push(lines[i].trim().slice(0, 220));
        if (/^https?:\/\/(?:www\.)?(?:x\.com|twitter\.com)\/[^\s<>)?]+\/status\/\d+/i.test(url)) {
          if (!twitter.has(url)) twitter.set(url, []);
          twitter.get(url).push(`${note.path}:${i + 1}`);
        }
      }
    }
  }
  return {
    rows: [...byUrl.values()].sort((a, b) => a.canonical.localeCompare(b.canonical)).map((row) => {
      const km = [...(known.get(row.canonical) || [])].sort();
      return {
        url: row.url,
        canonical: row.canonical,
        status: km.length ? "FICHE EXISTANTE" : "NON RETROUVE PAR URL - A VERIFIER",
        occurrences: row.sources.length,
        sources: [...new Set(row.sources)].join(" ; "),
        km: km.join(" ; "),
        excerpt: [...new Set(row.lines)].slice(0, 3).join(" || "),
      };
    }),
    twitter,
  };
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

async function writeCsv(file, rows, headers) {
  const lines = [headers.join(",")];
  for (const row of rows) lines.push(headers.map((h) => csvEscape(row[h])).join(","));
  await writeFile(file, `${lines.join("\n")}\n`, "utf8");
}

async function ollamaClassify(candidates) {
  if (!candidates.length) return [];
  const batch = candidates.slice(0, Number(args.get("--ollama-limit") || 40)).map((row) => ({
    url: row.url,
    sources: row.sources,
    excerpt: row.excerpt,
  }));
  const prompt = `Classe ces candidats KM. Reponds en JSON strict, tableau d'objets avec url, decision parmi watch/resources/books/ignore, raison courte, tags.\n${JSON.stringify(batch, null, 2)}`;
  const res = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ model, prompt, stream: false, options: { temperature: 0.1 } }),
  });
  if (!res.ok) throw new Error(`Ollama HTTP ${res.status}`);
  const data = await res.json();
  return data.response || "";
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const scan = inputJson
    ? JSON.parse(await readFile(inputJson, "utf8"))
    : await scanNotePlan();
  const known = await collectKnownKm();
  const { rows, twitter } = extractRows(scan, known);
  const priorityRows = rows.filter(priorityCandidate);
  await writeFile(path.join(outDir, "three-weeks.json"), JSON.stringify(scan, null, 2), "utf8");
  await writeCsv(path.join(outDir, "noteplan-km-url-match.csv"), rows, ["url", "canonical", "status", "occurrences", "sources", "km", "excerpt"]);
  await writeCsv(path.join(outDir, "noteplan-km-prioritaires.csv"), priorityRows, ["url", "canonical", "status", "occurrences", "sources", "km", "excerpt"]);
  await writeCsv(path.join(outDir, "noteplan-km-twitter.csv"), [...twitter.entries()].map(([url, sources]) => ({
    url,
    sources: [...new Set(sources)].join(" ; "),
    status: "CONTENU NON LU - A QUALIFIER",
  })), ["url", "sources", "status"]);

  let ollamaResult = "";
  if (useOllama) {
    ollamaResult = await ollamaClassify(priorityRows);
    await writeFile(path.join(outDir, "ollama-classification.txt"), ollamaResult, "utf8");
  }

  const counts = rows.reduce((acc, row) => {
    acc[row.status] = (acc[row.status] || 0) + 1;
    return acc;
  }, {});
  const report = [
    "# NotePlan KM scan",
    "",
    `Periode: ${scan.start} -> ${scan.end}`,
    `Fichiers NotePlan: ${(scan.notes || []).length}`,
    `URLs candidates: ${rows.length}`,
    `Prioritaires filtrees: ${priorityRows.length}`,
    `Liens X/Twitter: ${twitter.size}`,
    `Statuts: ${JSON.stringify(counts)}`,
    `Ollama: ${useOllama ? `${model} (${ollamaResult ? "ok" : "vide"})` : "non lance"}`,
    "",
    "## Fichiers",
    `- ${path.join(outDir, "noteplan-km-url-match.csv")}`,
    `- ${path.join(outDir, "noteplan-km-prioritaires.csv")}`,
    `- ${path.join(outDir, "noteplan-km-twitter.csv")}`,
    "",
    "## Prioritaires",
    ...priorityRows.slice(0, 80).map((row) => `- ${row.url} — ${row.occurrences} occ. — ${row.sources}`),
    "",
  ].join("\n");
  await writeFile(path.join(outDir, "noteplan-km-rapport.md"), report, "utf8");
  console.log(JSON.stringify({ outDir, files: (scan.notes || []).length, urls: rows.length, priority: priorityRows.length, twitter: twitter.size, statuses: counts, ollama: useOllama ? model : null }, null, 2));
}

main().catch((error) => {
  console.error(error?.stack || error);
  process.exit(1);
});
