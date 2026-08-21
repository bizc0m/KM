import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { detectPriority } from '../../src/core/priority'

describe('detectPriority', () => {
  it('recognizes !', () => {
    assert.equal(detectPriority('* [ ] Acheter matériel !'), 1)
  })

  it('recognizes !!', () => {
    assert.equal(detectPriority('* [ ] Tester Tantivy !!'), 2)
  })

  it('recognizes !!!', () => {
    assert.equal(detectPriority('* [ ] Apostille !!!'), 3)
  })

  it('recognizes priority at the start of a task', () => {
    assert.equal(detectPriority('- [ ] !!! Appeler client'), 3)
  })

  it('ignores URLs', () => {
    assert.equal(detectPriority('* [ ] Lire https://example.com/path!'), 0)
  })

  it('ignores inline code', () => {
    assert.equal(detectPriority('* [ ] Garder `danger !!!` normal'), 0)
  })

  it('ignores fenced code lines', () => {
    assert.equal(detectPriority('* [ ] code !!!', true), 0)
  })
})
