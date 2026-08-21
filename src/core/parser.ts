import type { LineRecord, ParsedMarkdown, Priority, Section, SectionBlock, TaskBlock, TaskNode } from './model'
import { detectPriority } from './priority'

const HEADING_RE = /^#{1,6}(?:\s|$)/
const TASK_RE = /^(\s*)[-*+]\s+\[([^\]])\]\s+/
const FENCE_RE = /^\s*(```|~~~)/

export function parseMarkdown(markdown: string): ParsedMarkdown {
  const lines = splitLines(markdown)
  const sections: Section[] = []
  let current: Section = { heading: [], blocks: [] }
  let pendingLoose: LineRecord[] = []
  let index = 0

  const flushLoose = () => {
    if (pendingLoose.length > 0) {
      current.blocks.push({ kind: 'loose', lines: pendingLoose })
      pendingLoose = []
    }
  }

  while (index < lines.length) {
    const line = lines[index]
    if (HEADING_RE.test(line.text)) {
      flushLoose()
      if (current.heading.length > 0 || current.blocks.length > 0) sections.push(current)
      current = { heading: [line], blocks: [] }
      index += 1
      continue
    }

    if (isTaskLine(line.text)) {
      flushLoose()
      const blockLines: LineRecord[] = [line]
      index += 1
      while (index < lines.length && !HEADING_RE.test(lines[index].text) && !isRootTaskLine(lines[index].text)) {
        blockLines.push(lines[index])
        index += 1
      }
      current.blocks.push(createTaskBlock(blockLines, current.blocks.length))
      continue
    }

    pendingLoose.push(line)
    index += 1
  }

  flushLoose()
  sections.push(current)
  return { sections }
}

export function splitLines(markdown: string): LineRecord[] {
  const records: LineRecord[] = []
  const re = /([^\r\n]*)(\r\n|\n|\r|$)/g
  let match: RegExpExecArray | null

  while ((match = re.exec(markdown)) !== null) {
    if (match[0] === '') break
    records.push({ text: match[1], newline: match[2] })
    if (match[2] === '') break
  }

  return records
}

function createTaskBlock(lines: LineRecord[], originalIndex: number): TaskBlock {
  const root = buildTaskTree(lines)
  return { kind: 'task', lines, root, originalIndex }
}

function buildTaskTree(lines: LineRecord[]): TaskNode {
  const stack: TaskNode[] = []
  let root: TaskNode | undefined
  let taskIndex = 0
  let inFence = false

  for (const line of lines) {
    if (FENCE_RE.test(line.text)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue

    const match = line.text.match(TASK_RE)
    if (!match) continue

    const node: TaskNode = {
      rawLine: line.text,
      indent: match[1],
      completed: match[2].toLowerCase() === 'x',
      explicitPriority: detectPriority(line.text),
      effectivePriority: 0,
      originalIndex: taskIndex,
      children: [],
    }
    taskIndex += 1

    while (stack.length > 0 && stack[stack.length - 1].indent.length >= node.indent.length) stack.pop()
    if (stack.length === 0) {
      root = node
    } else {
      stack[stack.length - 1].children.push(node)
    }
    stack.push(node)
  }

  if (!root) {
    throw new Error('Task block does not contain a root task')
  }

  computeEffectivePriority(root)
  return root
}

function computeEffectivePriority(node: TaskNode): Priority {
  let effective = node.explicitPriority
  for (const child of node.children) {
    effective = Math.max(effective, computeEffectivePriority(child)) as Priority
  }
  node.effectivePriority = effective
  return effective
}

function isRootTaskLine(line: string): boolean {
  const match = line.match(TASK_RE)
  return Boolean(match && match[1].length === 0)
}

function isTaskLine(line: string): boolean {
  return TASK_RE.test(line)
}
