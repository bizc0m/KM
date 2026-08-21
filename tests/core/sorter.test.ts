import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { smartSortMarkdown } from '../../src/core'

const here = dirname(fileURLToPath(import.meta.url))

describe('smartSortMarkdown', () => {
  it('sorts simple tasks', () => {
    assert.equal(
      smartSortMarkdown(`* [ ] Normal\n* [ ] Urgent !!!\n`),
      `* [ ] Urgent !!!\n* [ ] Normal\n`,
    )
  })

  it('sorts child-only priority with the complete parent block', () => {
    const input = `* [ ] Normal\n* [ ] Mirae papier\n    * [ ] Apostille !!!\n    * [ ] Traduction\n`
    const output = smartSortMarkdown(input)
    assert.equal(output.startsWith('* [ ] Mirae papier'), true)
    assert.equal(output.includes('    * [ ] Apostille !!!\n    * [ ] Traduction\n'), true)
  })

  it('sorts priority inherited at 4 levels', () => {
    const input = `* [ ] Later\n* [ ] Parent\n    * [ ] Niveau 2\n        * [ ] Niveau 3\n            * [ ] Important !!!\n`
    assert.equal(smartSortMarkdown(input).startsWith('* [ ] Parent'), true)
  })

  it('keeps stable order at equal priority', () => {
    const input = `* [ ] A !\n* [ ] B !\n* [ ] C\n`
    assert.equal(smartSortMarkdown(input), input)
  })

  it('moves completed root tasks below active tasks', () => {
    assert.equal(
      smartSortMarkdown(`* [x] Done !!!\n* [ ] Active\n`),
      `* [ ] Active\n* [x] Done !!!\n`,
    )
  })

  it('keeps completed children inside active parents', () => {
    const input = `* [ ] Other\n* [ ] Parent !!\n    * [x] Done child !!!\n`
    assert.equal(smartSortMarkdown(input), `* [ ] Parent !!\n    * [x] Done child !!!\n* [ ] Other\n`)
  })

  it('treats non-x NotePlan checkbox states as active tasks', () => {
    const input = `- [x] Done !!!\n- [>] Scheduled !!\n- [ ] Normal\n`
    assert.equal(smartSortMarkdown(input), `- [>] Scheduled !!\n- [ ] Normal\n- [x] Done !!!\n`)
  })

  it('sorts each markdown section independently', () => {
    const input = `## Mirae\n* [ ] A\n* [ ] B !!!\n## NoteCortex\n* [ ] C\n* [ ] D !!\n`
    assert.equal(smartSortMarkdown(input), `## Mirae\n* [ ] B !!!\n* [ ] A\n## NoteCortex\n* [ ] D !!\n* [ ] C\n`)
  })

  it('moves attached paragraphs with their task block', () => {
    const input = `* [ ] Other\n* [ ] Faire dossier\n    remarque importante\n    https://example.com\n    * [ ] Apostille !!!\n`
    const output = smartSortMarkdown(input)
    assert.equal(output, `* [ ] Faire dossier\n    remarque importante\n    https://example.com\n    * [ ] Apostille !!!\n* [ ] Other\n`)
  })

  it('preserves tags, mentions and NotePlan dates', () => {
    const input = `* [ ] Low #tag @mirae >2026-08-20\n* [ ] High !!! #urgent @job <2026-08-21\n`
    assert.equal(smartSortMarkdown(input), `* [ ] High !!! #urgent @job <2026-08-21\n* [ ] Low #tag @mirae >2026-08-20\n`)
  })

  it('does not detect priorities inside fenced code blocks', () => {
    const input = `* [ ] Normal\n    \`\`\`\n    * [ ] Code !!!\n    \`\`\`\n* [ ] Later\n`
    assert.equal(smartSortMarkdown(input), input)
  })

  it('handles an empty note', () => {
    assert.equal(smartSortMarkdown(''), '')
  })

  it('handles a note without tasks', () => {
    const input = `# Title\nText\n\nhttps://example.com/!\n`
    assert.equal(smartSortMarkdown(input), input)
  })

  it('leaves an already sorted note unchanged', () => {
    const input = `* [ ] A !!!\n* [ ] B !!\n* [ ] C !\n* [ ] D\n* [x] E !!!\n`
    assert.equal(smartSortMarkdown(input), input)
  })

  it('is idempotent', () => {
    const input = `* [ ] D\n* [ ] B !!\n* [ ] A !!!\n* [x] E\n`
    const once = smartSortMarkdown(input)
    assert.equal(smartSortMarkdown(once), once)
  })

  it('does not lose lines', () => {
    const input = `* [ ] D\n\n* [ ] B !!\n    note\n* [ ] A !!!\n`
    assert.deepEqual(lines(smartSortMarkdown(input)).sort(), lines(input).sort())
  })

  it('matches the mandatory fixture root order', () => {
    const input = readFileSync(join(here, '../fixtures/minimal.md'), 'utf8')
    const output = smartSortMarkdown(input)
    assert.deepEqual(rootNames(output), ['Papier Mirae', 'NoteCortex', 'Acheter matériel', 'Divers', 'Ancienne tâche'])
  })
})

function rootNames(markdown: string): string[] {
  return markdown
    .split('\n')
    .filter((line) => /^\* \[[ x]\]/i.test(line))
    .map((line) => line.replace(/^\* \[[ x]\]\s*/i, '').replace(/\s+[!]+$/, ''))
}

function lines(markdown: string): string[] {
  return markdown.split(/\r\n|\n|\r/)
}
