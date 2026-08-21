"use strict";
var SortPriorityPlugin = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/noteplan/commands.ts
  var commands_exports = {};
  __export(commands_exports, {
    sortCurrentNoteTasksByPriority: () => sortCurrentNoteTasksByPriority
  });

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
      effective = Math.max(effective, computeEffectivePriority(child));
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

  // src/noteplan/adapter.ts
  function sortCurrentEditorContent(write) {
    assertEditorAvailable();
    const before = Editor.content ?? "";
    const after = smartSortMarkdown(before);
    const result = {
      changed: before !== after,
      beforeTaskCount: countTasks(before),
      afterTaskCount: countTasks(after),
      content: after
    };
    if (write && result.changed) {
      Editor.content = after;
    }
    return result;
  }
  function assertEditorAvailable() {
    if (typeof Editor === "undefined" || typeof Editor.content !== "string") {
      throw new Error("Smart Sort requires an active NotePlan editor note.");
    }
  }
  function countTasks(markdown) {
    return markdown.split(/\r\n|\n|\r/).filter((line) => /^\s*[-*+]\s+\[[^\]]\]\s+/.test(line)).length;
  }

  // src/noteplan/commands.ts
  function sortCurrentNoteTasksByPriority() {
    try {
      const result = sortCurrentEditorContent(true);
      if (result.changed) {
        console.log(`/tri: sorted ${result.afterTaskCount} tasks.`);
        return `/tri: sorted ${result.afterTaskCount} tasks.`;
      } else {
        console.log("/tri: note already sorted.");
        return "/tri: note already sorted.";
      }
    } catch (error) {
      console.log(`/tri error: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }
  return __toCommonJS(commands_exports);
})();
function sortCurrentNoteTasksByPriority(){return SortPriorityPlugin.sortCurrentNoteTasksByPriority()}
