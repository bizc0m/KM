import { parseMarkdown } from './parser'
import { priorityRank } from './priority'
import { countTaskLines, serializeMarkdown, sortedLineMultiset } from './serializer'
import type { SectionBlock, TaskBlock } from './model'

export function smartSortMarkdown(markdown: string): string {
  const parsed = parseMarkdown(markdown)
  const beforeTasks = parsed.sections.reduce((sum, section) => sum + countTaskLines(section.blocks), 0)

  for (const section of parsed.sections) {
    section.blocks = sortSectionBlocks(section.blocks)
  }

  const output = serializeMarkdown(parsed)
  const reparsed = parseMarkdown(output)
  const afterTasks = reparsed.sections.reduce((sum, section) => sum + countTaskLines(section.blocks), 0)

  if (beforeTasks !== afterTasks) {
    throw new Error(`Smart Sort aborted: task count changed (${beforeTasks} -> ${afterTasks})`)
  }
  if (sortedLineMultiset(markdown) !== sortedLineMultiset(output)) {
    throw new Error('Smart Sort aborted: line content changed during sorting')
  }

  return output
}

function sortSectionBlocks(blocks: SectionBlock[]): SectionBlock[] {
  const taskBlocks = blocks.filter((block): block is TaskBlock => block.kind === 'task')
  const sortedTasks = [...taskBlocks].sort((a, b) => {
    const rankDelta = priorityRank(a.root.effectivePriority, a.root.completed) - priorityRank(b.root.effectivePriority, b.root.completed)
    if (rankDelta !== 0) return rankDelta
    return a.originalIndex - b.originalIndex
  })

  let taskIndex = 0
  return blocks.map((block) => {
    if (block.kind === 'loose') return block
    const next = sortedTasks[taskIndex]
    taskIndex += 1
    return next
  })
}
