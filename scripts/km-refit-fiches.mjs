import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = process.env.KM_ROOT
  ? resolve(process.env.KM_ROOT)
  : fileURLToPath(new URL("..", import.meta.url)).replace(/\/$/, "");
const config = JSON.parse(readFileSync(join(root, "km.config.json"), "utf8"));
const publishableDirs = (config.folders || [])
  .filter((folder) => folder.publishable)
  .map((folder) => folder.path);
const skipPaths = new Set([
  "watch/index.md",
  "watch/demoforge-scene.md",
  "resources/RESOURCES.md",
  "books/index.md"
]);

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.isFile() && entry.name.endsWith(".md") ? [full] : [];
  });
}

function section(content, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = content.match(new RegExp(`^## ${escaped}\\n+([\\s\\S]*?)(?=^## |\\s*$)`, "im"));
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

function tags(content) {
  return [...section(content, "Tags").matchAll(/#([A-Za-z0-9_-]+)/g)].map((tag) => tag[1].toLowerCase());
}

function hasAny(values, ...needles) {
  return needles.some((needle) => values.includes(needle));
}

function titleOf(content, fallback) {
  return clean(content.match(/^#\s+(.+)$/m)?.[1] || fallback);
}

function typeSummary(type) {
  const text = clean(type)
    .replace(/^veille\s+/i, "")
    .replace(/^strategic\s+/i, "")
    .replace(/^(outils?|outil|liens utilisateur|ressource longue|ressource|source sociale|#rouge)\s*(ia|ai)?\s*\/?\s*/i, "")
    .replace(/\bwatch\b/ig, "")
    .replace(/\s+\/\s+/g, " / ")
    .replace(/\s+([.,;:])/g, "$1")
    .replace(/[.。]+$/g, "")
    .trim();
  if (!text || /^(raindrop km monitor|source finale conservee dans la fiche)$/i.test(text)) return "";
  return text;
}

function generatedSummary(title, value) {
  const text = clean(value);
  if (!text) return true;
  const escapedTitle = clean(title).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`^${escapedTitle}\\s+est une fiche KM\\b`, "i").test(text)
    || /\best une fiche KM\b.*\bSource finale conservee dans la fiche\.?$/i.test(text)
    || /^fiche KM de veille\.?$/i.test(text);
}

function summaryFrom(content, fallbackPath) {
  const title = titleOf(content, fallbackPath);
  const t = tags(content);
  const type = typeSummary(section(content, "Type"));
  if (/contexte codebase|codebase/.test(type.toLowerCase())) return "Fournit du contexte exploitable aux agents de code.";
  if (/orchestration|multi-agent|multi-agents/.test(type.toLowerCase())) return "Orchestre des agents IA ou des workflows multi-agents.";
  if (/scraping|extraction|extract/.test(type.toLowerCase())) return "Extrait ou structure des donnees depuis des sources web ou documents.";
  if (/recherche|research/.test(type.toLowerCase())) return "Automatise la recherche, la synthese ou la verification d'information.";
  if (/governance|gouvernance|public policy|politique publique/.test(type.toLowerCase())) return "Suit un signal de gouvernance IA ou de politique publique.";
  if (hasAny(t, "rouge", "offensive-risk")) return "Signale un outil ou une source directement sensible cote abus.";
  if (hasAny(t, "osint", "threat-intelligence", "digital-footprint")) return "Sert a surveiller un outil ou signal OSINT.";
  if (hasAny(t, "privacy", "privacy-risk")) return "Sert a evaluer un enjeu privacy ou donnees exposees.";
  if (hasAny(t, "llm", "api", "openai", "gemini")) return "Sert a suivre une ressource LLM ou API.";
  if (hasAny(t, "automation", "agents", "agent", "workflow")) return "Sert a suivre un outil d'automatisation ou d'agents IA.";
  if (hasAny(t, "pdf", "document-ai", "ocr", "markdown", "json")) return "Sert a traiter, exporter ou structurer des documents.";
  if (hasAny(t, "media", "ai-video", "creative-ai", "image-generation")) return "Sert a suivre un outil de generation ou production media IA.";
  if (hasAny(t, "github", "open-source", "devtools", "coding")) return "Sert a suivre un projet open source ou devtool.";
  if (hasAny(t, "rss", "sources", "source", "monitoring")) return "Sert a suivre ou organiser des sources de veille.";
  if (type) return `${type.charAt(0).toUpperCase()}${type.slice(1)}.`;
  return `${title} reste une fiche KM a verifier.`;
}

function usageFrom(content) {
  const t = tags(content);
  const type = clean(section(content, "Type")).toLowerCase();
  if (hasAny(t, "rouge", "offensive-risk")) {
    return "Conserver comme signal de risque; verifier uniquement en contexte defensif, autorise et documente.";
  }
  if (hasAny(t, "privacy", "privacy-risk") || /privacy|donnees|donn.es|exposition/.test(type)) {
    return "Evaluer les impacts privacy, les donnees manipulees et les conditions d'usage avant integration.";
  }
  if (hasAny(t, "osint", "threat-intelligence", "digital-footprint")) {
    return "Alimenter la veille OSINT defensive et documenter les limites legales, sources et risques d'abus.";
  }
  if (hasAny(t, "llm", "api", "openai", "gemini", "claude")) {
    return "Comparer pour les workflows LLM, couts, contexte, routage et dependances API.";
  }
  if (hasAny(t, "automation", "agents", "agent", "workflow", "multi-agent")) {
    return "Evaluer l'apport pour automatiser, orchestrer ou superviser des workflows agents.";
  }
  if (hasAny(t, "github", "open-source", "devtools", "coding", "mcp")) {
    return "Verifier maturite, licence, activite GitHub et integration possible dans les projets KM/dev.";
  }
  if (hasAny(t, "pdf", "document-ai", "ocr", "markdown", "json", "export")) {
    return "Tester l'usage pour convertir, extraire ou structurer des contenus sans exposer de donnees sensibles.";
  }
  if (hasAny(t, "media", "ai-video", "creative-ai", "image-generation", "video")) {
    return "Suivre les capacites media IA et garder les risques de droits, deepfake et provenance sous controle.";
  }
  if (hasAny(t, "rss", "sources", "source", "monitoring", "raindrop")) {
    return "Utiliser comme source de veille ou point d'entree a verifier avant enrichissement KM.";
  }
  return "Classer, relier et reevaluer la fiche lors du prochain scan KM.";
}

function replaceOrInsertSection(content, heading, body) {
  const block = `## ${heading}\n\n${body.trim()}\n\n`;
  const pattern = new RegExp(`^## ${heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\n+[\\s\\S]*?(?=^## |\\s*$)`, "im");
  if (pattern.test(content)) return content.replace(pattern, block.trimEnd() + "\n\n");
  const anchors = ["## A verifier", "## A_VERIFIER", "## Topics GitHub", "## Relations", "## Changelog"];
  for (const headingName of anchors) {
    const match = content.match(new RegExp(`^${headingName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\n`, "im"));
    if (match) return content.slice(0, match.index) + block + content.slice(match.index);
  }
  return content.trimEnd() + "\n\n" + block.trimEnd() + "\n";
}

let files = 0;
let summariesTouched = 0;
let usageTouched = 0;
const touched = [];

for (const dir of publishableDirs) {
  for (const file of walk(join(root, dir))) {
    const path = relative(root, file);
    if (skipPaths.has(path)) continue;
    files++;
    let content = readFileSync(file, "utf8");
    const before = content;
    const title = titleOf(content, path);
    const currentSummary = section(content, "Resume court");
    if (generatedSummary(title, currentSummary)) {
      content = replaceOrInsertSection(content, "Resume court", summaryFrom(content, path));
      if (content !== before) summariesTouched++;
    }
    const beforeUsage = content;
    if (!section(content, "Usage KM")) {
      content = replaceOrInsertSection(content, "Usage KM", `- ${usageFrom(content)}`);
      if (content !== beforeUsage) usageTouched++;
    }
    if (content !== before) {
      writeFileSync(file, content);
      touched.push(path);
    }
  }
}

console.log(JSON.stringify({
  files,
  summariesTouched,
  usageTouched,
  touched: touched.length,
  touchedSamples: touched.slice(0, 40)
}, null, 2));
