import { sortCurrentEditorContent } from './adapter'

export function sortCurrentNoteTasksByPriority(): string {
  try {
    const result = sortCurrentEditorContent(true)
    if (result.changed) {
      console.log(`/tri: sorted ${result.afterTaskCount} tasks.`)
      return `/tri: sorted ${result.afterTaskCount} tasks.`
    } else {
      console.log('/tri: note already sorted.')
      return '/tri: note already sorted.'
    }
  } catch (error) {
    console.log(`/tri error: ${error instanceof Error ? error.message : String(error)}`)
    throw error
  }
}
