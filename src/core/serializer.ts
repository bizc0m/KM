import type { ParsedMarkdown, SectionBlock } from './model'

export function serializeMarkdown(parsed: ParsedMarkdown): string {
  let output = ''
  for (const section of parsed.sections) {
    for (const line of section.heading) output += line.text + line.newline
    for (const block of section.blocks) {
      for (const line of block.lines) output += line.text + line.newline
    }
  }
  return output
}

export function countTaskLines(blocks: SectionBlock[]): number {
  let count = 0
  for (const block of blocks) {
    if (block.kind === 'task') count += block.lines.filter((line) => /^\s*[-*+]\s+\[[^\]]\]\s+/.test(line.text)).length
  }
  return count
}

export function sortedLineMultiset(markdown: string): string {
  return markdown.split(/(\r\n|\n|\r)/).sort().join('')
}
