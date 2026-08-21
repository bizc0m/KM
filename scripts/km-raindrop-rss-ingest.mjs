#!/usr/bin/env node
import { mkdir, readFile, writeFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const ROOT = process.env.KM_ROOT || process.cwd();
const FEED_URL = process.env.KM_RAINDROP_FEED || "https://arno-vltn.raindrop.page/km-monitor-71629567/feed";
const PUBLIC_PAGE = "https://arno-vltn.raindrop.page/km-monitor-71629567";
const WATCH_DIR = path.join(ROOT, "watch");
const RESOURCES_DIR = path.join(ROOT, "resources");
const INDEX_FILE = path.join(ROOT, "index.md");
const WATCH_INDEX_FILE = path.join(WATCH_DIR, "index.md");
const LOG_DIR = path.join(ROOT, "logs");

const now = new Date();
const date = now.toISOString().slice(0, 10);

function decodeXml(value = "") {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .trim();
}

function stripHtml(value = "") {
  return decodeXml(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getTag(block, tag) {
  const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? decodeXml(match[1]) : "";
}

function slugify(value) {
  const base = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return base || `raindrop-${Date.now()}`;
}

function normalizeUrl(value = "") {
  try {
    const url = new URL(value.trim());
    url.hash = "";
    url.search = "";
    url.hostname = url.hostname.toLowerCase();
    return url.toString().replace(/\/$/, "");
  } catch {
    return value.trim();
  }
}

function classify(item) {
  const haystack = `${item.title} ${item.link} ${item.description}`.toLowerCase();
  if (/(pentest|red.?team|offensive|malware|exploit|dark.?web|leak|dork|osint|recon|forensic|bounty)/i.test(haystack)) {
    return {
      status: "#ROUGE",
      tags: ["#ROUGE", "#offensive-risk", "#privacy-risk"],
      usage: "#ROUGE : veille defensive uniquement, sans procedure operationnelle.",
    };
  }
  if (/(scrap|crawler|automation|agent|workflow|memory|github|api|browser|email|llm|mcp|vector|search)/i.test(haystack)) {
    return {
      status: "actif",
      tags: ["#agents", "#automation"],
      usage: "Signal utile pour veille agents/outils.",
    };
  }
  return {
    status: "a verifier",
    tags: ["#source", "#a-verifier"],
    usage: "Signal Raindrop a qualifier manuellement.",
  };
}

function titleCaseFromSlug(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

async function collectKnown() {
  const chunks = [];
  const slugs = new Set();
  for (const file of [INDEX_FILE, WATCH_INDEX_FILE]) {
    try {
      chunks.push(await readFile(file, "utf8"));
    } catch {}
  }
  for (const dir of [WATCH_DIR, RESOURCES_DIR]) {
    try {
      const names = await readdir(dir);
      for (const name of names) {
        if (!name.endsWith(".md")) continue;
        slugs.add(name.replace(/\.md$/, ""));
        const file = path.join(dir, name);
        const info = await stat(file);
        if (info.size > 250_000) continue;
        chunks.push(await readFile(file, "utf8"));
      }
    } catch {}
  }
  const text = chunks.join("\n");
  const urls = new Set(
    [...text.matchAll(/https?:\/\/[^\s`)>"']+/g)]
      .map((match) => normalizeUrl(match[0]))
      .filter(Boolean)
  );
  return { text, urls, slugs };
}

async function uniquePath(slug) {
  let candidate = slug;
  let counter = 2;
  while (true) {
    const file = path.join(WATCH_DIR, `${candidate}.md`);
    try {
      await stat(file);
      candidate = `${slug}-${counter}`;
      counter += 1;
    } catch {
      return { slug: candidate, file };
    }
  }
}

function parseFeed(xml) {
  return [...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi)].map(([block]) => ({
    title: getTag(block, "title"),
    link: getTag(block, "link"),
    guid: getTag(block, "guid"),
    pubDate: getTag(block, "pubDate"),
    description: stripHtml(getTag(block, "description")),
  })).filter((item) => item.title && (item.link || item.guid));
}

function ficheMarkdown(item, slug, classification) {
  const title = titleCaseFromSlug(slug);
  const source = item.link || item.guid;
  const description = item.description || "Signal detecte dans le flux Raindrop KM Monitor.";
  return `# ${title}

## Type

Veille Raindrop KM Monitor / signal automatique.

## Tags

${classification.tags.filter((tag) => !/^#?(sensible|sensitive|export)$/i.test(tag)).join(", ")}

## Appel canonique

\`watch:${slug}\`

## Sources

- Source : \`${source}\`

## Resume court

${description.slice(0, 700)}

## Usage KM

- ${classification.usage}
- Conserver la source et eviter tout contenu copyright complet.
- Reclasser manuellement si l'analyse humaine contredit l'automate.

## Garde-fous

- Ne pas executer de code, payload ou outil externe depuis cette fiche.
- Ne pas stocker de secrets, donnees personnelles inutiles ou contenu complet tiers.
- Pour les signaux #ROUGE, rester en meta-veille defensive.

## Relations

- \`watch:index\`

## Changelog

### v0.1 - ${date}

- Objectif : integrer automatiquement le signal depuis Raindrop KM Monitor.
- Fichiers touches : \`watch/${slug}.md\`, \`watch/index.md\`, \`index.md\`.
- Risques : classification automatique imparfaite.
- Rollback possible : supprimer cette fiche et retirer les lignes d'index.
`;
}

function insertBeforeSection(content, marker, line) {
  if (content.includes(line)) return content;
  const idx = content.indexOf(marker);
  if (idx === -1) return `${content.trimEnd()}\n${line}\n`;
  return `${content.slice(0, idx).trimEnd()}\n${line}\n\n${content.slice(idx)}`;
}

async function appendLog(message) {
  await mkdir(LOG_DIR, { recursive: true });
  const hhmm = new Date().toISOString().slice(11, 16);
  const file = path.join(LOG_DIR, `${date}.log`);
  const prior = await readFile(file, "utf8").catch(() => "");
  await writeFile(file, `${prior}[${hhmm}] ${message}\n`, "utf8");
}

async function main() {
  await mkdir(WATCH_DIR, { recursive: true });
  const response = await fetch(FEED_URL, { headers: { "User-Agent": "KM-Raindrop-Ingest/1.0" } });
  if (!response.ok) throw new Error(`Feed HTTP ${response.status}`);
  const items = parseFeed(await response.text());
  const known = await collectKnown();
  const created = [];

  let globalIndex = await readFile(INDEX_FILE, "utf8");
  let watchIndex = await readFile(WATCH_INDEX_FILE, "utf8");

  for (const item of items) {
    const source = item.link || item.guid;
    const normalizedSource = normalizeUrl(source);
    const baseSlug = slugify(item.title);
    if (known.text.includes(source) || known.urls.has(normalizedSource) || known.slugs.has(baseSlug)) continue;
    const classification = classify(item);
    const { slug, file } = await uniquePath(baseSlug);
    await writeFile(file, ficheMarkdown(item, slug, classification), "utf8");

    const globalLine = `| \`watch:${slug}\` | \`watch/${slug}.md\` | veille | ${classification.tags.join(", ")} | ${classification.status} |`;
    const watchLine = `| \`watch:${slug}\` | \`${slug}.md\` | ${classification.usage.replace(/\|/g, "/")} | ${classification.status} |`;
    globalIndex = insertBeforeSection(globalIndex, "\n## Regle automatique", globalLine);
    watchIndex = insertBeforeSection(watchIndex, "\n## Regles", watchLine);
    created.push({ slug, source, status: classification.status });
  }

  if (created.length) {
    await writeFile(INDEX_FILE, globalIndex, "utf8");
    await writeFile(WATCH_INDEX_FILE, watchIndex, "utf8");
  }

  await appendLog(`RESULTAT | KM_RAINDROP_INGEST | OK | feed_items=${items.length} new=${created.length}`);
  console.log(JSON.stringify({ ok: true, feed: FEED_URL, items: items.length, created }, null, 2));
}

main().catch(async (error) => {
  await appendLog(`ERREUR | KM_RAINDROP_INGEST | FAIL | ${String(error.message || error)}`);
  console.error(error);
  process.exit(1);
});
