import type { Priority } from './model'

const URL_TOKEN = /^[a-z][a-z0-9+.-]*:\/\/\S+/i

export function detectPriority(rawLine: string, inFencedCode = false): Priority {
  if (inFencedCode) return 0

  const taskMatch = rawLine.match(/^\s*[-*+]\s+\[[^\]]\]\s*(.*)$/)
  const source = taskMatch?.[1] ?? rawLine
  const visible = removeInlineCode(source)
  const tokens = visible.match(/\S+/g) ?? []

  let priority: Priority = 0
  for (const token of tokens) {
    if (URL_TOKEN.test(token)) continue
    const normalized = token.replace(/^[([{<]+/, '').replace(/[)\]},.;:?]+$/, '')
    if (normalized === '!!!') priority = 3
    else if (normalized === '!!') priority = Math.max(priority, 2) as Priority
    else if (normalized === '!') priority = Math.max(priority, 1) as Priority
  }

  return priority
}

export function priorityRank(priority: Priority, completed: boolean): number {
  if (completed) return 4
  return 3 - priority
}

function removeInlineCode(value: string): string {
  let output = ''
  let inCode = false
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index]
    if (char === '`') {
      inCode = !inCode
      output += ' '
    } else if (!inCode) {
      output += char
    } else {
      output += ' '
    }
  }
  return output
}
