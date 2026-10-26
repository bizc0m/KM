// scripts/km-noteplan-writeback.ts
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";

// src/core/priority.ts
var URL_TOKEN = /^[a-z][a-z0-9+.-]*:\/\/\S+/i;
function detectPriority(rawLine, inFencedCode = false) {
  if (inFencedCode) return 0;
  const taskMatch = rawLine.match(/^\s*[-*+]\s+\[[^\]]\]\s*(.*)$/);
  const source = taskMatch?.[1] ?? rawLine;
  const visible = removeInlineCode(source);
  const tokens = visible.match(/\S+/g) ?? [];
  let priority = 0;
  for (const token of tokens) {
    if (URL_TOKEN.test(token)) continue;
    const normalized = token.replace(/^[([{<]+/, "").replace(/[)\]},.;:?]+$/, "");
    if (normalized === "!!!") priority = 3;
    else if (normalized === "!!") priority = Math.max(priority, 2);
    else if (normalized === "!") priority = Math.max(priority, 1);
  }
  return priority;
}
function priorityRank(priority, completed) {
  if (completed) return 4;
  return 3 - priority;
}
function removeInlineCode(value) {
  let output = "";
  let inCode = false;
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (char === "`") {
      inCode = !inCode;
      output += " ";
    } else if (!inCode) {
      output += char;
    } else {
      output += " ";
    }
  }
  return output;
}

// src/core/parser.ts
var HEADING_RE = /^#{1,6}(?:\s|$)/;
var TASK_RE = /^(\s*)[-*+]\s+\[([^\]])\]\s+/;
var FENCE_RE = /^\s*(```|~~~)/;
function parseMarkdown(markdown) {
  const lines = splitLines(markdown);
  const sections = [];
  let current = { heading: [], blocks: [] };
  let pendingLoose = [];
  let index = 0;
  const flushLoose = () => {
    if (pendingLoose.length > 0) {
      current.blocks.push({ kind: "loose", lines: pendingLoose });
      pendingLoose = [];
    }
  };
  while (index < lines.length) {
    const line = lines[index];
    if (HEADING_RE.test(line.text)) {
      flushLoose();
      if (current.heading.length > 0 || current.blocks.length > 0) sections.push(current);
      current = { heading: [line], blocks: [] };
      index += 1;
      continue;
    }
    if (isTaskLine(line.text)) {
      flushLoose();
      const blockLines = [line];
      index += 1;
      while (index < lines.length && !HEADING_RE.test(lines[index].text) && !isRootTaskLine(lines[index].text)) {
        blockLines.push(lines[index]);
        index += 1;
      }
      current.blocks.push(createTaskBlock(blockLines, current.blocks.length));
      continue;
    }
    pendingLoose.push(line);
    index += 1;
  }
  flushLoose();
  sections.push(current);
  return { sections };
}
function splitLines(markdown) {
  const records = [];
  const re = /([^\r\n]*)(\r\n|\n|\r|$)/g;
  let match;
  while ((match = re.exec(markdown)) !== null) {
    if (match[0] === "") break;
    records.push({ text: match[1], newline: match[2] });
    if (match[2] === "") break;
  }
  return records;
}
function createTaskBlock(lines, originalIndex) {
  const root = buildTaskTree(lines);
  return { kind: "task", lines, root, originalIndex };
}
function buildTaskTree(lines) {
  const stack = [];
  let root;
  let taskIndex = 0;
  let inFence = false;
  for (const line of lines) {
    if (FENCE_RE.test(line.text)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const match = line.text.match(TASK_RE);
    if (!match) continue;
    const node = {
      rawLine: line.text,
      indent: match[1],
      completed: match[2].toLowerCase() === "x",
      explicitPriority: detectPriority(line.text),
      effectivePriority: 0,
      originalIndex: taskIndex,
      children: []
    };
    taskIndex += 1;
    while (stack.length > 0 && stack[stack.length - 1].indent.length >= node.indent.length) stack.pop();
    if (stack.length === 0) {
      root = node;
    } else {
      stack[stack.length - 1].children.push(node);
    }
    stack.push(node);
  }
  if (!root) {
    throw new Error("Task block does not contain a root task");
  }
  computeEffectivePriority(root);
  return root;
}
function computeEffectivePriority(node) {
  let effective = node.explicitPriority;
  for (const child of node.children) {
    effective = Math.max(effective, child.completed ? 0 : computeEffectivePriority(child));
  }
  node.effectivePriority = effective;
  return effective;
}
function isRootTaskLine(line) {
  const match = line.match(TASK_RE);
  return Boolean(match && match[1].length === 0);
}
function isTaskLine(line) {
  return TASK_RE.test(line);
}

// src/core/serializer.ts
function serializeMarkdown(parsed) {
  let output = "";
  for (const section of parsed.sections) {
    for (const line of section.heading) output += line.text + line.newline;
    for (const block of section.blocks) {
      for (const line of block.lines) output += line.text + line.newline;
    }
  }
  return output;
}
function countTaskLines(blocks) {
  let count = 0;
  for (const block of blocks) {
    if (block.kind === "task") count += block.lines.filter((line) => /^\s*[-*+]\s+\[[^\]]\]\s+/.test(line.text)).length;
  }
  return count;
}
function sortedLineMultiset(markdown) {
  return markdown.split(/(\r\n|\n|\r)/).sort().join("");
}

// src/core/sorter.ts
function smartSortMarkdown(markdown) {
  const parsed = parseMarkdown(markdown);
  const beforeTasks = parsed.sections.reduce((sum, section) => sum + countTaskLines(section.blocks), 0);
  for (const section of parsed.sections) {
    section.blocks = sortSectionBlocks(section.blocks);
  }
  const output = serializeMarkdown(parsed);
  const reparsed = parseMarkdown(output);
  const afterTasks = reparsed.sections.reduce((sum, section) => sum + countTaskLines(section.blocks), 0);
  if (beforeTasks !== afterTasks) {
    throw new Error(`Smart Sort aborted: task count changed (${beforeTasks} -> ${afterTasks})`);
  }
  if (sortedLineMultiset(markdown) !== sortedLineMultiset(output)) {
    throw new Error("Smart Sort aborted: line content changed during sorting");
  }
  return output;
}
function sortSectionBlocks(blocks) {
  const taskBlocks = blocks.filter((block) => block.kind === "task");
  const sortedTasks = [...taskBlocks].sort((a, b) => {
    const rankDelta = priorityRank(a.root.effectivePriority, a.root.completed) - priorityRank(b.root.effectivePriority, b.root.completed);
    if (rankDelta !== 0) return rankDelta;
    return a.originalIndex - b.originalIndex;
  });
  let taskIndex = 0;
  return blocks.map((block) => {
    if (block.kind === "loose") return block;
    const next = sortedTasks[taskIndex];
    taskIndex += 1;
    return next;
  });
}

// scripts/km-technical-policy.mjs
var excluded = /\b(bdsm|bondage|fetish\w*|fétich\w*|porn\w*|nsfw|onlyfans|sexual\w*|sexuel\w*|sexe|eroti\w*|éroti\w*|nudes?|hentai|sadomaso\w*|dominatrix|orgasm\w*|masturb\w*|sodom\w*)\b/i;
var privateText = /\b(ma vie|vie privée|vie privee|journal intime|mes sentiments|ma relation|mon couple|mon adresse|mon téléphone|mon telephone|my diary|my relationship|mot de passe|password\s*[:=]|api[_ -]?key\s*[:=]|bearer\s+[a-z0-9_-]{12})\b/i;
var technical = /\b(github|gitlab|codeberg|huggingface|software|logiciel|développe\w*|developpe\w*|programm\w*|coding|code|api|sdk|cli|llm|mcp|agent\w*|framework|python|javascript|typescript|rust|golang|docker|kubernetes|linux|macos|swift|database|sql|postgres|sqlite|réseau|reseau|network|server|serveur|cybersecurity|sécurité informatique|securite informatique|machine learning|open.source|automation|automatisation|workflow|noteplan|obsidian|encryption|chiffrement|computer|react|svg|osint|qwen|deepseek|benchmarks|hister|algorithm\w*|benchmark|webassembly)\b/i;
function blocked(text) {
  return excluded.test(String(text)) || privateText.test(String(text)) || /(?:^|[/\\])(?:perso|personnel|personnelle|private|intime)(?:[/\\]|$)/i.test(String(text));
}
function technicalSignal(text) {
  return (technical.test(String(text)) || /\b(informatique|intelligence artificielle|mod[eè]les? de langage|apprentissage automatique)\b/i.test(String(text))) && !blocked(text);
}
function canonical(value) {
  const u = new URL(value);
  if (u.username || u.password || !["http:", "https:"].includes(u.protocol)) throw new Error("url_rejected");
  u.hash = "";
  for (const k of [...u.searchParams.keys()]) if (/^utm_/i.test(k) || /^(fbclid|gclid|mc_cid|mc_eid)$/i.test(k)) u.searchParams.delete(k);
  u.searchParams.sort();
  u.hostname = u.hostname.toLowerCase().replace(/^www\./, "").replace(/^twitter\.com$/, "x.com");
  if (u.hostname === "github.com") {
    const parts = u.pathname.split("/");
    if (parts[1]) parts[1] = parts[1].toLowerCase();
    if (parts[2]) parts[2] = parts[2].replace(/\.git$/i, "").toLowerCase();
    u.pathname = parts.join("/");
  }
  return u.toString().replace(/\/$/, "");
}

// scripts/km-noteplan-writeback.ts
var hash = (s) => crypto.createHash("sha256").update(s).digest("hex");
var task = /^(\s*)[-*+]\s+\[([^\]])\]\s+/;
var urls = (s) => [...s.matchAll(/https?:\/\/[^\s<>"'\[\]]+/g)].map((m) => m[0].replace(/[).,;!}`]+$/g, "")).filter((u) => !u.includes("bizc0m.github.io/KM/") && !/127\.0\.0\.1:876[67]/.test(u));
function planWriteback(body, state, validFiles) {
  if (blocked(body) || /^\s*(```|~~~)/m.test(body)) return { content: body, marked: 0, skip: "mixed_or_fenced" };
  const lines = body.split(/\r?\n/);
  let marked = 0;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(task);
    if (!m || m[2] !== " ") continue;
    let j = i + 1;
    for (; j < lines.length; j++) {
      if (/^#{1,6}\s/.test(lines[j])) break;
      const n = lines[j].match(task);
      if (n && n[1].length <= m[1].length) break;
      if (lines[j].trim() && !/^\s/.test(lines[j])) break;
    }
    if (lines.slice(i + 1, j).some((l) => {
      const n = l.match(task);
      return n && n[2].toLowerCase() !== "x";
    })) continue;
    const links = urls(lines.slice(i, j).join("\n"));
    if (!links.length) continue;
    const files = /* @__PURE__ */ new Set();
    let complete = true;
    for (const u of links) {
      let r;
      try {
        r = state.urls[hash(canonical(u))];
      } catch {
        complete = false;
        break;
      }
      const f = [...r?.fiches || [], ...r?.fiche ? [r.fiche] : []];
      if (r?.status !== "done" || !f.length || f.some((p) => !validFiles.has(p)) || r.crawl && !r.crawl.complete) {
        complete = false;
        break;
      }
      f.forEach((p) => files.add(p));
    }
    if (!complete) continue;
    const refs = [...files].map((p) => "[KM](https://bizc0m.github.io/KM/search-v2.html#fiche=" + p.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") + ")").join(" ");
    lines[i] = lines[i].replace(/\[ \]/, "[x]") + " " + refs + " #km-fait";
    marked++;
  }
  let candidate = lines.join(body.includes("\r\n") ? "\r\n" : "\n");
  const sections = candidate.split(/(?=^#{1,6}\s)/m);
  candidate = sections.map((section) => {
    const ls = section.split(/\r?\n/);
    const hasMarker = section.includes("#km-fait") || technicalSignal(section);
    const unsafe = ls.some((l, k) => l.trim() && !/^#{1,6}\s/.test(l) && !task.test(l) && !/^\s/.test(l));
    return hasMarker && !unsafe ? smartSortMarkdown(section) : section;
  }).join("");
  return { content: candidate, marked };
}
async function main() {
  const root = process.env.KM_ROOT || process.cwd(), data = process.env.KM_PIPELINE_DATA || path.join(os.homedir(), "Library/Application Support/KM/pipeline");
  const apply = process.argv.includes("--apply");
  const state = JSON.parse(await fs.readFile(path.join(data, "state.json"), "utf8"));
  const roots = process.env.NOTEPLAN_ROOT ? [process.env.NOTEPLAN_ROOT] : [path.join(os.homedir(), "Library/Containers/co.noteplan.NotePlan-setapp/Data/Library/Application Support/co.noteplan.NotePlan-setapp"), path.join(os.homedir(), "Library/Containers/co.noteplan.NotePlan3/Data/Library/Application Support/co.noteplan.NotePlan3"), path.join(os.homedir(), "Library/Mobile Documents/iCloud~co~noteplan~NotePlan/Documents")];
  const valid = /* @__PURE__ */ new Set();
  for (const r of Object.values(state.urls)) for (const p of [...r.fiches || [], ...r.fiche ? [r.fiche] : []]) if (/^(watch|resources|books)\/[a-z0-9_-]+\.md$/i.test(p)) {
    try {
      await fs.access(path.join(root, p));
      valid.add(p);
    } catch {
    }
  }
  const report = { at: (/* @__PURE__ */ new Date()).toISOString(), apply, scanned: 0, candidates: 0, marked: 0, written: 0, conflicts: 0, skipped: 0, backup: "" };
  const backup = path.join(os.homedir(), "Library/Application Support/KM/backups", "noteplan-writeback-" + Date.now());
  async function walk(dir) {
    let out = [];
    for (const e of await fs.readdir(dir, { withFileTypes: true })) {
      if (e.name.startsWith(".") || /^(@Archive|@Trash|@Templates)$/.test(e.name) || e.name.endsWith("_attachments")) continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) out.push(...await walk(p));
      else if (e.isFile()) out.push(p);
    }
    return out;
  }
  for (const base of roots) {
    const cal = path.join(base, "Calendar");
    let names;
    try {
      names = await walk(cal);
    } catch {
      continue;
    }
    for (const file of names) {
      const name = path.relative(cal, file);
      if (!/\.(md|txt)$/i.test(file)) continue;
      const st = await fs.lstat(file);
      if (!st.isFile() || st.size > 512e3) continue;
      const body = await fs.readFile(file, "utf8");
      report.scanned++;
      const p = planWriteback(body, state, valid);
      if (p.content === body) {
        report.skipped++;
        continue;
      }
      report.candidates++;
      report.marked += p.marked;
      if (!apply) continue;
      await fs.mkdir(backup, { recursive: true, mode: 448 });
      report.backup = backup;
      await fs.mkdir(path.dirname(path.join(backup, name)), { recursive: true, mode: 448 });
      await fs.writeFile(path.join(backup, name), body, { mode: 384, flag: "wx" });
      if (hash(await fs.readFile(file, "utf8")) !== hash(body)) {
        report.conflicts++;
        continue;
      }
      const tmp = file + ".km-writeback.tmp";
      await fs.writeFile(tmp, p.content, { mode: st.mode & 511, flag: "wx" });
      if (hash(await fs.readFile(file, "utf8")) !== hash(body)) {
        await fs.rm(tmp);
        report.conflicts++;
        continue;
      }
      await fs.rename(tmp, file);
      if (await fs.readFile(file, "utf8") !== p.content) throw Error("writeback_verification_failed");
      report.written++;
    }
    break;
  }
  await fs.writeFile(path.join(data, apply ? "noteplan-writeback.json" : "noteplan-writeback-preview.json"), JSON.stringify(report, null, 2), { mode: 384 });
  console.log(JSON.stringify(report));
}
if (process.argv[1]?.endsWith("km-noteplan-writeback.mjs")) await main();
export {
  planWriteback
};
