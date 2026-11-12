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

// scripts/km-technical-policy.mjs
var excluded = /\b(bdsm|bondage|fetish\w*|fétich\w*|porn\w*|nsfw|onlyfans|sexual\w*|sexuel\w*|sexe|eroti\w*|éroti\w*|nudes?|hentai|sadomaso\w*|dominatrix|orgasm\w*|masturb\w*|sodom\w*)\b/i;
var privateText = /\b(ma vie|vie privée|vie privee|journal intime|mes sentiments|ma relation|mon couple|mon adresse|mon téléphone|mon telephone|my diary|my relationship|mot de passe|password\s*[:=]|api[_ -]?key\s*[:=]|bearer\s+[a-z0-9_-]{12})\b/i;
function blocked(text) {
  return excluded.test(String(text)) || privateText.test(String(text)) || /(?:^|[/\\])(?:perso|personnel|personnelle|private|intime)(?:[/\\]|$)/i.test(String(text));
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
    lines[i] = lines[i].replace(/\[ \]/, "[x]") + " #KM-OK";
    items.push({ files: [...files] });
    marked++;
  }
  return { content: marked ? lines.join(body.includes("\r\n") ? "\r\n" : "\n") : body, marked, items, pending, moved: 0 };
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
    for (const e of await timed(fs.readdir(dir, { withFileTypes: true }))) {
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
