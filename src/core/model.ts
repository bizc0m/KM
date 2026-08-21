export type Priority = 0 | 1 | 2 | 3

export interface TaskNode {
  rawLine: string
  indent: string
  completed: boolean
  explicitPriority: Priority
  effectivePriority: Priority
  originalIndex: number
  children: TaskNode[]
}

export interface LineRecord {
  text: string
  newline: string
}

export interface TaskBlock {
  kind: 'task'
  lines: LineRecord[]
  root: TaskNode
  originalIndex: number
}

export interface LooseBlock {
  kind: 'loose'
  lines: LineRecord[]
}

export type SectionBlock = TaskBlock | LooseBlock

export interface Section {
  heading: LineRecord[]
  blocks: SectionBlock[]
}

export interface ParsedMarkdown {
  sections: Section[]
}
