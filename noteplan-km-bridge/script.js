/* global Editor, Clipboard */

function kmPasteFiche() {
  const fiche = buildKmNote(false)
  appendToCurrentNote(fiche)
  return 'KM Bridge: fiche ajoutee.'
}

function kmPasteAction() {
  const fiche = buildKmNote(true)
  appendToCurrentNote(fiche)
  return 'KM Bridge: fiche action ajoutee.'
}

function kmPasteInbox() {
  const fiche = buildKmNote(true)
  appendToCurrentNote(`\n## KM A traiter\n\n${fiche}`)
  return 'KM Bridge: fiche ajoutee a KM A traiter.'
}

function kmCopyClean() {
  const fiche = buildKmNote(true)
  setClipboardText(fiche)
  return 'KM Bridge: fiche nettoyee copiee.'
}

function buildKmNote(withActions) {
  const input = clipboardText()
  if (!input.trim()) throw new Error('KM Bridge: presse-papiers vide.')
  const parsed = parseKm(input)
  const lines = [
    `# ${parsed.title}`,
    '',
    '## Fonction',
    parsed.functionLine || 'A qualifier',
    '',
    '## Sources',
    ...sourceLines(parsed),
  ]

  if (parsed.topics.length) {
    lines.push('', '## Topics GitHub', parsed.topics.map((topic) => `#${topic}`).join(' '))
  }

  if (parsed.summary) {
    lines.push('', '## Notes', parsed.summary)
  }

  if (withActions) {
    lines.push(
      '',
      '## Action',
      '- [ ] Tester',
      '- [ ] Classer',
      '- [ ] Garder / ignorer'
    )
  }

  return `${lines.join('\n')}\n`
}

function parseKm(input) {
  const text = cleanInput(input)
  const title = firstMatch(text, /^#\s+(.+)$/m)
    || firstMatch(text, /^##\s+(.+)$/m)
    || firstUsefulLine(text)
    || 'Fiche KM'
  const urls = unique([...text.matchAll(/https?:\/\/[^\s)>"']+/g)].map((match) => trimUrl(match[0])))
  const topics = unique([
    ...[...text.matchAll(/github\.com\/topics\/([a-z0-9][a-z0-9-]*)/gi)].map((match) => match[1].toLowerCase()),
    ...[...text.matchAll(/#([a-z0-9][a-z0-9-]{2,})/gi)].map((match) => match[1].toLowerCase()),
  ]).filter((topic) => !isGenericTopic(topic)).slice(0, 20)

  return {
    title: compact(title.replace(/^KM Search.+$/i, 'Fiche KM')),
    functionLine: findFunction(text),
    summary: findSummary(text, title),
    urls,
    topics,
  }
}

function findFunction(text) {
  const explicit = firstMatch(text, /^## Fonction\s+([\s\S]*?)(?:\n## |\n# |$)/im)
    || firstMatch(text, /^Fonction\s*:?\s*(.+)$/im)
  if (explicit) return compact(stripMarkdown(explicit)).slice(0, 220)

  const lower = text.toLowerCase()
  const words = []
  const add = (value) => {
    if (!words.includes(value)) words.push(value)
  }
  if (/export|pdf|markdown|json|csv/.test(lower)) add('export')
  if (/chatgpt|conversation/.test(lower)) add('conversations ChatGPT')
  if (/codebase|context/.test(lower)) add('contexte codebase')
  if (/agent|workflow|automation|orchestrat/.test(lower)) add('agents / automatisation')
  if (/scrap|crawl|extract/.test(lower)) add('extraction web')
  if (/osint|threat|recon|intelligence/.test(lower)) add('investigation OSINT')
  if (/video|image|media|design/.test(lower)) add('media / design')
  return words.join(', ')
}

function findSummary(text, title) {
  const sections = ['## Notes', '## Resume court', '## Résumé', '## Usage KM']
  for (const section of sections) {
    const body = firstMatch(text, new RegExp(`${escapeRegExp(section)}\\s+([\\s\\S]*?)(?:\\n## |\\n# |$)`, 'i'))
    if (body) return compact(stripMarkdown(body)).slice(0, 360)
  }
  return text
    .split(/\r?\n/)
    .map((line) => compact(stripMarkdown(line)))
    .filter((line) => line && !line.startsWith('#') && line !== title && !/^[-*]\s*Source/i.test(line))
    .find((line) => line.length > 30 && !/^https?:\/\//.test(line))
    ?.slice(0, 360) || ''
}

function sourceLines(parsed) {
  if (!parsed.urls.length) return ['- Source: a completer']
  return parsed.urls.slice(0, 8).map((url) => {
    if (/github\.com\/[^/]+\/[^/]+/i.test(url)) return `- Repo GitHub: ${url}`
    if (/(^|\/\/)(x|twitter)\.com\//i.test(url)) return `- Post Twitter: ${url}`
    if (/reddit\.com\//i.test(url)) return `- Reddit: ${url}`
    return `- Source: ${url}`
  })
}

function appendToCurrentNote(markdown) {
  assertEditor()
  const before = Editor.content || ''
  const spacer = before.trim() ? '\n\n' : ''
  Editor.content = `${before.replace(/\s+$/, '')}${spacer}${markdown.trim()}\n`
}

function clipboardText() {
  if (typeof Clipboard === 'undefined') return ''
  return String(Clipboard.string || Clipboard.content || '')
}

function setClipboardText(value) {
  if (typeof Clipboard === 'undefined') return
  if ('string' in Clipboard) Clipboard.string = value
  else Clipboard.content = value
}

function assertEditor() {
  if (typeof Editor === 'undefined' || typeof Editor.content !== 'string') {
    throw new Error('KM Bridge demande une note NotePlan active.')
  }
}

function cleanInput(value) {
  return String(value || '')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+$/gm, '')
    .trim()
}

function firstMatch(text, pattern) {
  const match = text.match(pattern)
  return match ? match[1].trim() : ''
}

function firstUsefulLine(text) {
  return text.split('\n').map((line) => compact(stripMarkdown(line))).find(Boolean)
}

function stripMarkdown(value) {
  return String(value || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^[-*]\s+/gm, '')
    .replace(/^#+\s+/gm, '')
}

function compact(value) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

function trimUrl(value) {
  return String(value || '').replace(/[),.;]+$/, '')
}

function unique(values) {
  const seen = new Set()
  return values.filter((value) => {
    const key = String(value || '').trim()
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function isGenericTopic(topic) {
  return /^(km|watch|source|github|outil|tools|tool|ia|ai|agent|agents|active|actif)$/.test(topic)
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
