#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = fileURLToPath(new URL("..", import.meta.url)).replace(/\/$/, "");
const today = new Date().toISOString().slice(0, 10);

const TYPE_DIR = {
  watch: "watch",
  tool: "watch",
  github: "watch",
  url: "watch",
  source: "watch",
  book: "books",
  livre: "books",
  idea: "km",
  note: "km",
  resource: "resources/inbox",
  ressource: "resources/inbox",
  process: "process",
  strategy: "strategy",
  theme: "themes",
  rouge: "watch"
};

function parseArgs(argv) {
  const args = { tags: [], build: true, dryRun: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--tag" || arg === "--tags") {
      args.tags.push(...String(argv[++i] || "").split(",").map((x) => x.trim()).filter(Boolean));
    } else if (arg.startsWith("--")) {
      const key = arg.slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      if (key === "noBuild") args.build = false;
      else if (key === "dryRun") args.dryRun = true;
      else args[key] = argv[++i];
    } else if (!args.input) {
      args.input = arg;
    }
  }
  return args;
}

function slugify(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 90) || "untitled";
}

function compact(value, limit = 520) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, limit);
}

function read(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

function write(path, content, dryRun) {
  if (dryRun) return;
  mkdirSync(join(path, ".."), { recursive: true });
  writeFileSync(path, content, "utf8");
}

function appendUnique(path, line, dryRun) {
  const content = read(path);
  if (content.includes(line)) return false;
  if (!dryRun) writeFileSync(path, `${content.replace(/\s*$/, "\n")}${line}\n`, "utf8");
  return true;
}

function firstHeading(markdown) {
  const match = String(markdown || "").match(/^#\s+(.+)$/m);
  return match?.[1]?.trim() || "";
}

async function fetchMeta(url) {
  if (!url || !/^https?:\/\//i.test(url)) return {};
  try {
    const response = await fetch(url, { redirect: "follow" });
    const html = await response.text();
    const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]
      || html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)?.[1]
      || "";
    const description = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1]
      || html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i)?.[1]
      || "";
    return {
      title: compact(title.replace(/<[^>]+>/g, " "), 160),
      description: compact(description, 520),
      finalUrl: response.url
    };
  } catch {
    return {};
  }
}

function classify({ type, status, tags, title, summary }) {
  if (status) return status;
  if (type === "rouge") return "#ROUGE";
  const text = `${type} ${title} ${summary} ${tags.join(" ")}`.toLowerCase();
  if (/#rouge|\brouge\b|pentest|malware|offensive|exploit|anti-detection|doxx|stalking/.test(text)) return "#ROUGE";
  if (/secret|credential|token|privacy|sensible|personal|interne/.test(text)) return "sensible";
  if (/verifier|verify|unknown|a verifier|à vérifier|candidate/.test(text)) return "a verifier";
  return "actif";
}

function itemTemplate(data) {
  const tags = data.tags.join(", ");
  return `# ${data.title}

## Type

${data.type}

## Tags

${tags}

## Source

${data.source}

## Résumé court

${data.summary}

## Usage utile

- A compléter.

## Usage abusif possible

- A cadrer selon contexte.

## Classification

${data.status}

## Relations

- A relier.

## Historique

### v0.1 - ${today}

- Objectif : création automatique de fiche KM normalisée.
- Fichiers touchés : \`${data.path}\`, \`index.md\`${data.specializedIndex ? `, \`${data.specializedIndex}\`` : ""}.
- Risques : qualification initiale à vérifier.
- Rollback possible : supprimer cette fiche et retirer les lignes d'index.
`;
}

function ensureIndexHeader(path, title, dryRun) {
  if (existsSync(path)) return;
  const content = `# ${title}

| Appel | Fichier | Type | Tags | Statut |
| --- | --- | --- | --- | --- |
`;
  write(path, content, dryRun);
}

function updateHistory(path, data, dryRun) {
  if (!existsSync(path)) return false;
  const line = `| ${today} | Creation fiche ${data.canonical} | ${data.path}, index.md | Qualification initiale a verifier | Supprimer la fiche et retirer les lignes d'index |`;
  return appendUnique(path, line, dryRun);
}

function runBuild(dryRun) {
  if (dryRun) return;
  const buildScript = join(root, "scripts", "build-search-v1.10-html.mjs");
  if (existsSync(buildScript)) execFileSync("node", [buildScript], { cwd: root, stdio: "inherit" });
  if (process.env.KM_DB_PASSWORD) {
    execFileSync("node", [join(root, "scripts", "build-encrypted-km-db.mjs")], { cwd: root, stdio: "inherit" });
  }
}

const args = parseArgs(process.argv.slice(2));
const meta = await fetchMeta(args.url || args.input);
const inferredType = (args.url || /^https?:\/\//.test(args.input || "")) ? "watch" : "note";
const type = String(args.type || inferredType).toLowerCase();
const source = args.source || args.url || args.input || meta.finalUrl || "note utilisateur";
const title = compact(args.title || meta.title || firstHeading(args.body) || basename(String(source)).replace(/\.[^.]+$/, "") || "Untitled", 160);
const summary = compact(args.summary || meta.description || args.body || "A compléter.");
const tags = [...new Set([...(args.tags || []), type].map((x) => slugify(x)).filter(Boolean))];
const status = classify({ type, status: args.status, tags, title, summary });
const directory = TYPE_DIR[type] || TYPE_DIR.watch;
const slug = slugify(args.slug || title);
const targetDir = join(root, directory);
const target = join(targetDir, `${slug}.md`);
const relativePath = `${directory}/${slug}.md`;
const canonicalPrefix = directory.split("/")[0] === "books" ? "book" : directory.split("/")[0];
const canonical = `${canonicalPrefix}:${slug}`;
const specializedIndex = directory.split("/")[0] === "watch" ? "watch/index.md"
  : directory.split("/")[0] === "km" ? "km/index.md"
  : directory.split("/")[0] === "books" ? "books/index.md"
  : "";

if (existsSync(target)) {
  console.error(`Fiche déjà existante: ${relativePath}`);
  process.exit(2);
}

const data = { title, type, tags, source, summary, status, path: relativePath, canonical, specializedIndex };
const content = itemTemplate(data);

if (!args.dryRun) mkdirSync(targetDir, { recursive: true });
write(target, content, args.dryRun);

const globalLine = `| \`${canonical}\` | \`${relativePath}\` | ${type} | ${tags.join(", ")} | ${status} |`;
appendUnique(join(root, "index.md"), globalLine, args.dryRun);

if (specializedIndex) {
  const indexPath = join(root, specializedIndex);
  ensureIndexHeader(indexPath, `${canonicalPrefix[0].toUpperCase()}${canonicalPrefix.slice(1)} Index`, args.dryRun);
  appendUnique(indexPath, globalLine, args.dryRun);
}

updateHistory(join(root, "km", "history.md"), data, args.dryRun);
if (args.build) runBuild(args.dryRun);

console.log(JSON.stringify({
  created: !args.dryRun,
  path: relativePath,
  canonical,
  status,
  tags,
  build: args.build
}, null, 2));
