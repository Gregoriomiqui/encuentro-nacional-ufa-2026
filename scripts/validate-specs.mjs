import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const specsDirectory = 'specs'
const allowedStatuses = new Set(['draft', 'accepted', 'delivered', 'superseded'])
const governanceFiles = new Set([
  join(specsDirectory, 'README.md'),
  join(specsDirectory, 'LIFECYCLE.md'),
  join(specsDirectory, '_template.md'),
])
const specFiles = collectSpecFiles(specsDirectory).filter((filePath) => !governanceFiles.has(filePath))
const errors = []

for (const filePath of specFiles) {
  if (filePath.endsWith('/spec.md')) {
    validateSpecKitSpec(filePath)
  } else if (!isSpecKitArtifact(filePath)) {
    validateLegacySpec(filePath)
  }
}

if (errors.length > 0) {
  console.error('Validación SDD fallida:')
  for (const error of errors) {
    console.error(`- ${error}`)
  }
  process.exitCode = 1
} else {
  console.log(`Validación SDD correcta: ${specFiles.length} especificación(es) revisada(s).`)
}

function collectSpecFiles(directory) {
  if (!existsSync(directory)) return []

  return readdirSync(directory).flatMap((entry) => {
    const entryPath = join(directory, entry)
    return statSync(entryPath).isDirectory()
      ? collectSpecFiles(entryPath)
      : entryPath.endsWith('.md') ? [entryPath] : []
  })
}

function isSpecKitArtifact(filePath) {
  return /\/(?:plan|tasks|research|data-model|quickstart)\.md$/.test(filePath) || filePath.includes('/contracts/')
}

function validateLegacySpec(filePath) {
  const content = readFileSync(filePath, 'utf8')
  const displayPath = relative('.', filePath)
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n/)

  if (!frontmatterMatch) {
    errors.push(`${displayPath}: falta frontmatter YAML.`)
    return
  }

  const metadata = Object.fromEntries(
    frontmatterMatch[1]
      .split('\n')
      .map((line) => line.match(/^([a-z_]+):\s*(.*)$/))
      .filter(Boolean)
      .map(([, key, value]) => [key, value.trim()]),
  )

  for (const field of ['id', 'title', 'status', 'owners', 'created', 'updated']) {
    if (!metadata[field]) errors.push(`${displayPath}: falta el campo '${field}'.`)
  }

  if (metadata.status && !allowedStatuses.has(metadata.status)) {
    errors.push(`${displayPath}: estado inválido '${metadata.status}'.`)
  }

  if (metadata.status === 'accepted' || metadata.status === 'delivered') {
    for (const section of ['## Alcance', '## Reglas e invariantes', '## Escenarios de aceptación', '## Trazabilidad']) {
      if (!content.includes(section)) errors.push(`${displayPath}: falta la sección '${section}'.`)
    }
  }

  if (metadata.status === 'delivered' && !/\|\s*S\d+\s*\|\s*`[^`]+\.spec\.(?:ts|tsx)`\s*\|\s*(?:green|passed)\s*\|/.test(content)) {
    errors.push(`${displayPath}: una spec delivered debe trazar al menos un escenario a una prueba en estado green o passed.`)
  }
}

function validateSpecKitSpec(filePath) {
  const content = readFileSync(filePath, 'utf8')
  const displayPath = relative('.', filePath)
  const statusMatch = content.match(/^\*\*Status\*\*:\s*(.+)$/m)

  for (const heading of ['## User Scenarios & Testing', '## Requirements', '## Success Criteria']) {
    if (!content.includes(heading)) errors.push(`${displayPath}: falta la sección '${heading}'.`)
  }

  if (!statusMatch) {
    errors.push(`${displayPath}: falta el campo '**Status**'.`)
    return
  }

  const status = statusMatch[1].trim().toLowerCase()
  if (!['draft', 'accepted', 'delivered', 'superseded'].includes(status)) {
    errors.push(`${displayPath}: estado inválido '${statusMatch[1].trim()}'.`)
  }

  if ((status === 'accepted' || status === 'delivered') && !content.includes('## Trazabilidad')) {
    errors.push(`${displayPath}: una spec ${status} debe incluir '## Trazabilidad'.`)
  }

  if (status === 'delivered' && !/\|\s*(?:S\d+|US\d+)\s*\|\s*`[^`]+\.spec\.(?:ts|tsx)`\s*\|\s*(?:green|passed)\s*\|/i.test(content)) {
    errors.push(`${displayPath}: una spec Delivered debe trazar al menos un escenario a una prueba en estado green o passed.`)
  }
}