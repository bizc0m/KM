import { smartSortMarkdown } from '../core'

declare const Editor: {
  content?: string
}

declare const Clipboard:
  | {
      string?: string
      content?: string
    }
  | undefined

export interface SortResult {
  changed: boolean
  beforeTaskCount: number
  afterTaskCount: number
  content: string
}

export function sortCurrentEditorContent(write: boolean): SortResult {
  assertEditorAvailable()
  const before = Editor.content ?? ''
  const after = smartSortMarkdown(before)
  const result = {
    changed: before !== after,
    beforeTaskCount: countTasks(before),
    afterTaskCount: countTasks(after),
    content: after,
  }

  if (write && result.changed) {
    Editor.content = after
  }

  return result
}

export function copyPreviewToClipboard(content: string): void {
  if (typeof Clipboard === 'undefined') return
  if ('string' in Clipboard) Clipboard.string = content
  else if ('content' in Clipboard) Clipboard.content = content
}

function assertEditorAvailable(): void {
  if (typeof Editor === 'undefined' || typeof Editor.content !== 'string') {
    throw new Error('Smart Sort requires an active NotePlan editor note.')
  }
}

function countTasks(markdown: string): number {
  return markdown.split(/\r\n|\n|\r/).filter((line) => /^\s*[-*+]\s+\[[^\]]\]\s+/.test(line)).length
}
