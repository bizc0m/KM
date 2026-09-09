import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
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
  "resources/RESOURCES.md",
  "books/index.md",
  "km/km-search-v2-chat-handoff.md",
  "km/km-search-v2-gpt-prompt.md"
]);

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.isFile() && entry.name.endsWith(".md") ? [full] : [];
  });
}

function markdownFiles() {
  return publishableDirs.flatMap((dir) => walk(join(root, dir)))
    .filter((file) => !skipPaths.has(relative(root, file)));
}

function cleanRaindropPrefix(content) {
  const raindropPrefix = ["Veille", "Raindrop", "KM", "Monitor"].join(" ");
  return content
    .replace(new RegExp(`${raindropPrefix}\\s*\\/[\\s\\u00a0]*`, "g"), "")
    .replace(new RegExp(`${raindropPrefix}\\.?`, "g"), "")
    .replace(/de veille\s+Source finale/g, "de veille. Source finale");
}

function tagsFor(content) {
  const match = content.match(/^## Tags\n+([\s\S]*?)(?=^## |\s*$(?![\s\S]))/m);
  if (!match) return [];
  return [...match[1].matchAll(/#([A-Za-z0-9_-]+)/g)].map((tag) => tag[1].toLowerCase());
}

function inferredType(tags) {
  const has = (...needles) => needles.some((needle) => tags.includes(needle));
  if (has("rouge", "offensive-risk")) return "veille #ROUGE / outil ou source a risque offensif.";
  if (has("osint", "privacy", "privacy-risk")) return "veille OSINT / privacy.";
  if (has("media", "creative-ai")) return "veille media IA / creation.";
  if (has("llm", "api")) return "veille LLM / API.";
  if (has("agents", "automation")) return "veille agents IA / automatisation.";
  if (has("raindrop", "to-verify")) return "veille source Raindrop / a verifier.";
  return "veille KM / a verifier.";
}

function fillEmptyType(content) {
  return content.replace(/^## Type\n+\s*(?=^## Tags)/m, () => {
    return `## Type\n\n${inferredType(tagsFor(content))}\n\n`;
  });
}

function githubRepos(content) {
  const repos = new Map();
  const pattern = /https?:\/\/github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)/g;
  for (const match of content.matchAll(pattern)) {
    const owner = match[1];
    const repo = match[2].replace(/\.git$/i, "");
    if (/^(topics|orgs|marketplace|features|pricing|login|search|settings|sponsors)$/i.test(owner)) continue;
    if (/^(pulls|issues|discussions|blob|tree|releases|actions|wiki|stargazers|network|graphs)$/i.test(repo)) continue;
    repos.set(`${owner}/${repo}`.toLowerCase(), `${owner}/${repo}`);
  }
  return [...repos.values()];
}

function fetchTopics(repo) {
  try {
    const output = execFileSync("gh", ["api", `/repos/${repo}`, "--jq", "{full_name:.full_name,topics:(.topics//[])}"], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"]
    });
    const json = JSON.parse(output);
    return {
      repo: json.full_name || repo,
      topics: Array.isArray(json.topics) ? json.topics.filter(Boolean).sort() : []
    };
  } catch (error) {
    return { repo, topics: [], error: String(error.stderr || error.message || error).trim() };
  }
}

function topicsBlock(results) {
  const lines = ["## Topics GitHub", ""];
  for (const result of results) {
    lines.push(`- Repo : \`https://github.com/${result.repo}\``);
    if (result.error) {
      lines.push(`- A_VERIFIER : topics non recuperes via GitHub API (${result.error})`);
    } else if (result.topics.length) {
      lines.push(`- Topics releves : ${result.topics.join(", ")}`);
    } else {
      lines.push("- Aucun topic public releve via GitHub API.");
    }
    lines.push("");
  }
  return lines.join("\n").trimEnd() + "\n\n";
}

function upsertTopicsSection(content, block) {
  if (!block.trim()) return content;
  const section = /^## Topics GitHub\n[\s\S]*?(?=^## |\s*$(?![\s\S]))/m;
  if (section.test(content)) return content.replace(section, block.trimEnd() + "\n\n");
  const relations = content.match(/^## Relations\n/m);
  if (relations) return content.slice(0, relations.index) + block + content.slice(relations.index);
  const changelog = content.match(/^## Changelog\n/m);
  if (changelog) return content.slice(0, changelog.index) + block + content.slice(changelog.index);
  return content.trimEnd() + "\n\n" + block.trimEnd() + "\n";
}

const files = markdownFiles();
const topicCache = new Map();
let prefixTouched = 0;
let topicTouched = 0;
const topicTouchedFiles = [];
const failures = [];

for (const file of files) {
  let content = readFileSync(file, "utf8");
  const before = content;
  content = cleanRaindropPrefix(content);
  content = fillEmptyType(content);
  if (content !== before) prefixTouched++;

  const repos = githubRepos(content);
  if (repos.length) {
    const results = repos.map((repo) => {
      const key = repo.toLowerCase();
      if (!topicCache.has(key)) topicCache.set(key, fetchTopics(repo));
      return topicCache.get(key);
    });
    failures.push(...results.filter((result) => result.error).map((result) => `${relative(root, file)} :: ${result.repo} :: ${result.error}`));
    const block = topicsBlock(results);
    const withTopics = upsertTopicsSection(content, block);
    if (withTopics !== content) {
      topicTouched++;
      topicTouchedFiles.push(relative(root, file));
    }
    content = withTopics;
  }

  if (content !== before) writeFileSync(file, content);
}

console.log(JSON.stringify({
  files: files.length,
  prefixTouched,
  topicTouched,
  topicTouchedFiles: topicTouchedFiles.slice(0, 20),
  reposQueried: topicCache.size,
  failures: failures.length,
  failureSamples: failures.slice(0, 12)
}, null, 2));
