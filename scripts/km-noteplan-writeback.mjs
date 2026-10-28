// scripts/km-noteplan-writeback.ts
import fs from "node:fs/promises";
import os from "node:os";
import path2 from "node:path";
import crypto from "node:crypto";

// scripts/km-noteplan-window.mjs
import path from "node:path";
var DAY = 864e5;
function cutoff(lastSuccess) {
  const t = Date.parse(lastSuccess || "");
  return Number.isFinite(t) ? t - DAY : null;
}
function noteDay(file) {
  const m = path.basename(file).match(/^(\d{4})-?(\d{2})-?(\d{2})\.(?:md|txt)$/);
  return m ? Date.parse(`${m[1]}-${m[2]}-${m[3]}T00:00:00Z`) : NaN;
}
function inWindow(file, mtime, lastSuccess, pending = false) {
  const from = cutoff(lastSuccess);
  return pending || from === null || mtime >= from || noteDay(file) >= from;
}

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
var timed = (p) => Promise.race([p, new Promise((_, reject) => {
  const t = setTimeout(() => reject(Error("noteplan_io_timeout")), 3e3);
  t.unref();
})]);
var hash = (s) => crypto.createHash("sha256").update(s).digest("hex");
var task = /^(\s*)[-*+]\s+\[([^\]])\]\s+/;
var urls = (s) => [...s.matchAll(/https?:\/\/[^\s<>"'\[\]]+/g)].map((m) => m[0].replace(/[).,;!}`]+$/g, "")).filter((u) => !u.includes("bizc0m.github.io/KM/") && !/127\.0\.0\.1:876[67]/.test(u));
function planWriteback(body, state, validFiles) {
  if (blocked(body) || /^\s*(```|~~~)/m.test(body)) return { content: body, marked: 0, skip: "mixed_or_fenced" };
  const items = [];
  const pending = [];
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
    if (!complete) {
      const known = links.map((u) => {
        try {
          return state.urls[hash(canonical(u))];
        } catch {
          return null;
        }
      }).filter(Boolean);
      if (known.length) pending.push({ sources: links, files: [...new Set(known.flatMap((r) => [...r.fiches || [], ...r.fiche ? [r.fiche] : []]))], reason: "Liens non termin\xE9s, exploration partielle ou fiche non \xE9tablie" });
      continue;
    }
    lines[i] = lines[i].replace(/\[ \]/, "[x]") + " #km-fait";
    items.push({ files: [...files] });
    marked++;
  }
  const beforeSort = lines.join("\n");
  let moved = 0;
  for (let n = 0; n < lines.length; n++) if (lines[n].includes("#km-fait")) lines[n] = lines[n].replace(/ +\[KM\]\(https:\/\/bizc0m\.github\.io\/KM\/search-v2\.html#fiche=[a-zA-Z0-9-]+\)/g, "");
  let candidate = lines.join(body.includes("\r\n") ? "\r\n" : "\n");
  const sections = candidate.split(/(?=^#{1,6}\s)/m);
  candidate = sections.map((section) => {
    const ls = section.split(/\r?\n/);
    const hasMarker = section.includes("#km-fait") || technicalSignal(section);
    const unsafe = ls.some((l, k) => l.trim() && !/^#{1,6}\s/.test(l) && !task.test(l) && !/^\s/.test(l));
    return hasMarker && !unsafe ? smartSortMarkdown(section) : section;
  }).join("");
  const positions = (text) => text.split(/\r?\n/).map((line, index) => ({ line, index })).filter((x) => task.test(x.line));
  const old = positions(lines.join("\n")), next = positions(candidate);
  const used = /* @__PURE__ */ new Set();
  for (const x of old) {
    const n = next.findIndex((y, k) => !used.has(k) && y.line === x.line);
    if (n >= 0) {
      used.add(n);
      if (next[n].index !== x.index) moved++;
    }
  }
  return { content: candidate, marked, items, pending, moved };
}
async function main() {
  const root = process.env.KM_ROOT || process.cwd(), data = process.env.KM_PIPELINE_DATA || path2.join(os.homedir(), "Library/Application Support/KM/pipeline");
  await fs.mkdir(data, { recursive: true, mode: 448 });
  const apply = process.argv.includes("--apply"), started = (/* @__PURE__ */ new Date()).toISOString();
  const state = JSON.parse(await fs.readFile(path2.join(data, "state.json"), "utf8"));
  let cursor = { files: {} };
  try {
    cursor = JSON.parse(await fs.readFile(path2.join(data, "writeback-cursor.json"), "utf8"));
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
  }
  cursor.files ??= {};
  const roots = process.env.NOTEPLAN_ROOT ? [process.env.NOTEPLAN_ROOT] : [path2.join(os.homedir(), "Library/Containers/co.noteplan.NotePlan-setapp/Data/Library/Application Support/co.noteplan.NotePlan-setapp"), path2.join(os.homedir(), "Library/Containers/co.noteplan.NotePlan3/Data/Library/Application Support/co.noteplan.NotePlan3"), path2.join(os.homedir(), "Library/Mobile Documents/iCloud~co~noteplan~NotePlan/Documents")];
  const valid = /* @__PURE__ */ new Set(), titles = /* @__PURE__ */ new Map();
  for (const r of Object.values(state.urls)) for (const p of [...r.fiches || [], ...r.fiche ? [r.fiche] : []]) if (/^(watch|resources|books)\/[a-z0-9_-]+\.md$/i.test(p)) {
    try {
      const text = await fs.readFile(path2.join(root, p), "utf8");
      if (blocked(text)) continue;
      valid.add(p);
      titles.set(p, text.match(/^# (.+)/)?.[1] || "Fiche KM");
    } catch {
    }
  }
  const report = { at: started, apply, examined: 0, scanned: 0, notRead: 0, candidates: 0, marked: 0, moved: 0, written: 0, conflicts: 0, unreadable: 0, skipped: 0, backup: "", items: [], pending: [], sortedNotes: [] };
  const backup = path2.join(os.homedir(), "Library/Application Support/KM/backups", "noteplan-writeback-" + Date.now());
  let activeBase = "";
  const signature = (keys) => hash(JSON.stringify(keys.map((k) => state.urls[k] || null)));
  async function walk(dir) {
    let out = [];
    for (const e of await fs.readdir(dir, { withFileTypes: true })) {
      if (e.name.startsWith(".") || /^(@Archive|@Trash|@Templates)$/.test(e.name) || e.name.endsWith("_attachments")) continue;
      const p = path2.join(dir, e.name);
      if (e.isDirectory()) out.push(...await walk(p));
      else if (e.isFile()) out.push(p);
    }
    return out;
  }
  for (const base of roots) {
    const cal = path2.join(base, "Calendar");
    let names;
    try {
      names = await walk(cal);
    } catch {
      continue;
    }
    activeBase = base;
    for (const file of names) {
      const name = path2.relative(cal, file);
      if (!/\.(md|txt)$/i.test(file)) continue;
      try {
        if (Date.now() - Date.parse(started) > 9e4) {
          report.unreadable++;
          break;
        }
        const st = await timed(fs.lstat(file));
        if (!st.isFile() || st.size > 512e3) continue;
        report.examined++;
        const id = hash(file), prior = cursor.files[id];
        const depChanged = prior && signature(prior.keys) !== prior.signature;
        if (prior && !depChanged && st.mtimeMs === prior.mtimeMs && st.size === prior.size && !inWindow(file, st.mtimeMs, cursor.lastSuccess)) {
          report.notRead++;
          continue;
        }
        const body = await timed(fs.readFile(file, "utf8"));
        report.scanned++;
        const p = planWriteback(body, state, valid);
        const keys = [...new Set(urls(body).map((u) => {
          try {
            return hash(canonical(u));
          } catch {
            return "";
          }
        }).filter(Boolean))];
        const fields = { mtimeMs: st.mtimeMs, size: st.size, keys, signature: signature(keys) };
        report.pending.push(...(p.pending || []).map((x) => ({ ...x, note: name })));
        if (p.content === body) {
          report.skipped++;
          cursor.files[id] = fields;
          continue;
        }
        report.candidates++;
        if (!apply) {
          report.marked += p.marked;
          report.moved += p.moved || 0;
          continue;
        }
        await fs.mkdir(path2.dirname(path2.join(backup, name)), { recursive: true, mode: 448 });
        report.backup = backup;
        await fs.writeFile(path2.join(backup, name), body, { mode: 384, flag: "wx" });
        if (hash(await timed(fs.readFile(file, "utf8"))) !== hash(body)) {
          report.conflicts++;
          continue;
        }
        const tmp = file + ".km-writeback.tmp";
        await fs.writeFile(tmp, p.content, { mode: st.mode & 511, flag: "wx" });
        if (hash(await timed(fs.readFile(file, "utf8"))) !== hash(body)) {
          await fs.rm(tmp);
          report.conflicts++;
          continue;
        }
        await fs.rename(tmp, file);
        if (await timed(fs.readFile(file, "utf8")) !== p.content) throw Error("writeback_verification_failed");
        report.written++;
        report.marked += p.marked;
        report.moved += p.moved || 0;
        report.items.push(...(p.items || []).map((x) => ({ ...x, note: name })));
        if (p.moved) report.sortedNotes.push(name);
        const after = await fs.stat(file);
        cursor.files[id] = { ...fields, mtimeMs: after.mtimeMs, size: after.size };
      } catch {
        report.unreadable++;
      }
    }
    break;
  }
  if (!activeBase) throw Error("noteplan_unavailable");
  if (apply) {
    let eventLines = [];
    try {
      eventLines = (await fs.readFile(path2.join(data, "fiche-events.jsonl"), "utf8")).trim().split("\n").filter(Boolean);
    } catch (e) {
      if (e.code !== "ENOENT") throw e;
    }
    const ficheEvents = [];
    for (const line of eventLines.slice(cursor.ficheEventCount || 0)) {
      const e = JSON.parse(line);
      if (!/^(watch|resources|books)\/[a-z0-9_-]+\.md$/i.test(e.file) || blocked(e.title)) continue;
      try {
        await fs.access(path2.join(root, e.file));
        titles.set(e.file, e.title);
        ficheEvents.push(e);
      } catch {
      }
    }
    const visible = { ficheEvents, items: report.items, pending: report.pending, sortedNotes: report.sortedNotes };
    const contentHash = hash(JSON.stringify(visible));
    if (report.written || ficheEvents.length || report.pending.length && contentHash !== cursor.lastReport) {
      const date = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Paris" }).format(new Date(started));
      const time = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date(started));
      const link = (f) => "[" + (titles.get(f) || "Fiche KM") + "](https://bizc0m.github.io/KM/search-v2.html#fiche=" + f.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") + ")";
      const safeNote = (n) => /^\d{4}[-\dWQ]*\.(md|txt)$/i.test(path2.basename(n)) ? path2.basename(n).replace(/\.(md|txt)$/, "") : "note Calendar";
      let block = "### " + time + " \u2014 " + (ficheEvents.length ? "Fiches mises \xE0 jour" : report.marked ? "\xC9l\xE9ments trait\xE9s" : report.pending.length ? "\xC0 reprendre" : "Notes r\xE9organis\xE9es") + "\n\n";
      if (ficheEvents.length) block += "#### Fiches cr\xE9\xE9es ou enrichies\n\n" + ficheEvents.map((e) => "* " + link(e.file) + " \u2014 " + e.action + ".").join("\n") + "\n\n";
      if (report.items.length) block += "#### Trait\xE9s\n\n" + report.items.map((x) => "* " + x.files.map(link).join(" \xB7 ") + " \u2014 agenda " + safeNote(x.note) + ", coch\xE9.").join("\n") + "\n\n";
      if (report.sortedNotes.length) block += "#### Tri effectu\xE9\n\n" + report.sortedNotes.map((n) => "* Agenda " + safeNote(n)).join("\n") + "\n\n";
      if (report.pending.length) block += "#### \xC0 reprendre\n\n" + report.pending.map((x) => "* " + (x.files.filter((f) => valid.has(f)).map(link).join(" \xB7 ") || (x.sources?.length ? "[Source \xE0 reprendre](" + x.sources[0] + ")" : "\xC9l\xE9ment KM")) + " \u2014 agenda " + safeNote(x.note) + " : " + x.reason + ".").join("\n") + "\n\n";
      block += "#### Contr\xF4le\n\n* " + report.marked + " t\xE2che(s) coch\xE9e(s), " + report.moved + " t\xE2che(s) d\xE9plac\xE9e(s), " + report.conflicts + " conflit(s).\n\n";
      const note = path2.join(activeBase, "Notes/Rapports KM.md");
      await fs.mkdir(path2.dirname(note), { recursive: true });
      let old = "";
      try {
        old = await fs.readFile(note, "utf8");
      } catch (e) {
        if (e.code !== "ENOENT") throw e;
      }
      const tag = "## " + date;
      const at = old.indexOf(tag + "\n");
      let next;
      if (at >= 0) {
        const end = old.indexOf("\n## ", at + tag.length);
        const pos = end < 0 ? old.length : end;
        next = old.slice(0, pos).trimEnd() + "\n\n" + block + old.slice(pos);
      } else next = (old || "# Rapports KM\n").trimEnd() + "\n\n" + tag + "\n\n" + block;
      await fs.mkdir(backup, { recursive: true, mode: 448 });
      await fs.writeFile(path2.join(backup, "Rapports KM.before.md"), old, { mode: 384 });
      let current = "";
      try {
        current = await fs.readFile(note, "utf8");
      } catch (e) {
        if (e.code !== "ENOENT") throw e;
      }
      if (current !== old) throw Error("report_conflict");
      await fs.writeFile(note, next, { mode: 384 });
      cursor.lastReport = contentHash;
      report.reportAdded = true;
    }
    cursor.ficheEventCount = eventLines.length;
    report.fiches = ficheEvents.length;
    await fs.appendFile(path2.join(data, "noteplan-writeback-history.jsonl"), JSON.stringify(report) + "\n", { mode: 384 });
    if (!report.conflicts && !report.unreadable) cursor.lastSuccess = started;
    await fs.writeFile(path2.join(data, "writeback-cursor.json"), JSON.stringify(cursor), { mode: 384 });
  }
  await fs.writeFile(path2.join(data, apply ? "noteplan-writeback.json" : "noteplan-writeback-preview.json"), JSON.stringify(report, null, 2), { mode: 384 });
  console.log(JSON.stringify({ ...report, items: report.items.length, pending: report.pending.length, sortedNotes: report.sortedNotes.length }));
}
if (process.argv[1]?.endsWith("km-noteplan-writeback.mjs")) await main();
export {
  planWriteback
};
