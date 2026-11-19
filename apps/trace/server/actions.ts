import { evidenceTypes, modes, planFields, setupFields, sources, statuses } from '../model.ts'
import type { ClientData, Evidence, Session, Setup, Step, Study } from '../model.ts'
import { blankStudy, copyMap, newId } from './fixtures.ts'
import { extname } from 'node:path'

const textLimit = 5000
const attachmentTypes: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.txt': 'text/plain',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
}

export class RequestError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}
export function bad(message: string): never {
  throw new RequestError(400, message)
}
export function missing(): never {
  throw new RequestError(404, 'This item is unavailable in this workspace.')
}
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) bad('Check the submitted fields.')
  return value as Record<string, unknown>
}
// Match the Trellis text scrubber. IDs, dates and uploaded bytes are validated separately.
function sanitizePII(text: string) {
  return text
    .replace(/\b\d{3}-?\d{2}-?\d{4}\b/g, '[REDACTED_SSN]')
    .replace(/\b(?:\d[ -]*?){13,19}\b/g, '[REDACTED_NUMBER]')
    .replace(/\b[A-Za-z0-9_-]{32,}\b/g, '[REDACTED_TOKEN]')
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[REDACTED_EMAIL]')
}
function field(body: Record<string, unknown>, key: string, required = false, max = textLimit): string {
  const value = body[key]
  if (typeof value !== 'string' || value.length > max || (required && !value.trim()))
    bad('Check the ' + key + ' field.')
  const trimmed = value.trim()
  return ['date', 'bytes', 'branchFrom'].includes(key) ? trimmed : sanitizePII(trimmed)
}
function choice<T extends string>(value: unknown, options: readonly T[]): T {
  if (!options.includes(value as T)) bad('Choose one of the available options.')
  return value as T
}
function setup(body: Record<string, unknown>): Setup {
  return {
    ...Object.fromEntries(setupFields.map((k) => [k, field(body, k, k === 'name')])),
    status: choice(body.status, statuses),
  } as Setup
}
export function createStudy(data: ClientData, input: unknown) {
  const study = blankStudy(data.client.id, setup(object(input)))
  data.studies.push(study)
  return study.id
}
function saveEvidence(study: Study, body: Record<string, unknown>) {
  const kind = choice(body.kind, evidenceTypes)
  const item: Evidence = {
    id: newId(),
    clientId: study.clientId,
    studyId: study.id,
    title: field(body, 'title', true, 200),
    text: field(body, 'text', kind === 'Note' || kind === 'Interview answer'),
    kind,
    person: field(body, 'person', true, 150),
    date: field(body, 'date', true, 10),
  }
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(item.date) ||
    !Number.isFinite(Date.parse(item.date)) ||
    new Date(item.date).toISOString().slice(0, 10) !== item.date
  )
    bad('Choose a valid evidence date.')
  if (kind === 'Document' || kind === 'Photo') {
    item.fileName = field(body, 'fileName', true, 180)
    const mime = choice(
      body.mime === '' ? attachmentTypes[extname(item.fileName).toLowerCase()] : body.mime,
      kind === 'Photo' ? ['image/png', 'image/jpeg'] : ['application/pdf', 'text/plain'],
    )
    const bytes = field(body, 'bytes', true, 1400000)
    const decoded = Buffer.from(bytes, 'base64')
    if (decoded.length > 1024 * 1024 || decoded.toString('base64') !== bytes) bad('Choose a file up to 1 MB.')
    item.mime = mime
    item.bytes = bytes
  }
  study.evidence.push(item)
}
export function changeStudy(study: Study, session: Session, action: string, input: unknown) {
  const body = object(input)
  const owner = { clientId: study.clientId, studyId: study.id }
  const plan = study.plans.at(-1)!
  if (action === 'comment' || action === 'approve') {
    if (session.role !== 'reviewer' || session.clientId !== study.clientId) missing()
    if (body.version !== plan.version)
      throw new RequestError(409, 'The plan has changed. Reload to review its latest version.')
    if (action === 'approve' && !plan.findings.trim())
      bad('The facilitator needs to add findings to this plan first.')
    const record = {
      ...owner,
      id: newId(),
      version: plan.version,
      reviewer: session.name,
      date: new Date().toISOString(),
    }
    if (action === 'approve') plan.approval ??= { ...record, decision: 'Approved' }
    else plan.comments.push({ ...record, text: field(body, 'text', true) })
    return
  }
  if (session.role !== 'facilitator') missing()
  switch (action) {
    case 'setup':
      Object.assign(study, setup(body))
      return
    case 'evidence':
      saveEvidence(study, body)
      return
    case 'deleteEvidence': {
      if (!study.evidence.some((e) => e.id === body.id)) missing()
      study.evidence = study.evidence.filter((e) => e.id !== body.id)
      for (const map of [study.current, study.proposed]) {
        if (!map) continue
        for (const step of map.steps) {
          if (!step.evidenceIds.includes(body.id as string)) continue
          step.evidenceIds = step.evidenceIds.filter((id) => id !== body.id)
          if (!step.evidenceIds.length) step.uncertain = true
          map.revision++
        }
      }
      return
    }
    case 'plan': {
      const fields = Object.fromEntries(planFields.map((k) => [k, field(body, k)])) as Pick<
        typeof plan,
        (typeof planFields)[number]
      >
      if (planFields.every((k) => fields[k] === plan[k])) return
      study.plans.push({
        ...owner,
        ...fields,
        id: newId(),
        version: plan.version + 1,
        comments: [],
        approval: null,
      })
      return
    }
    case 'copyMap':
      if (study.proposed) bad('A proposed process already exists.')
      study.proposed = copyMap(study.current)
      return
  }
  const kind = choice(body.map, ['current', 'proposed'] as const)
  const map = study[kind]
  if (!map) missing()
  const steps = map.steps
  const index = steps.findIndex((step) => step.id === body.id)
  const step = steps[index]
  if (action === 'questions') map.questions = field(body, 'questions')
  else if (action === 'step') {
    if (body.id && !step) missing()
    if (
      !Array.isArray(body.evidenceIds) ||
      !body.evidenceIds.every((id) => study.evidence.some((e) => e.id === id))
    )
      bad('Choose evidence from this study.')
    const evidenceIds = Array.from(new Set<string>(body.evidenceIds))
    const branchFrom = field(body, 'branchFrom')
    const entry: Step = {
      ...owner,
      id: step?.id ?? newId(),
      name: field(body, 'name', true, 180),
      description: field(body, 'description'),
      source: choice(body.source, sources),
      evidenceIds,
      uncertain: !evidenceIds.length || body.uncertain === true,
      branchFrom,
      condition: field(body, 'condition', Boolean(branchFrom)),
      mode: kind === 'proposed' ? choice(body.mode, modes) : 'Human',
      why: field(body, 'why', kind === 'proposed'),
    }
    if (step) steps[index] = entry
    else steps.push(entry)
  } else {
    if (!step) missing()
    if (action === 'remove') {
      if (steps.some((s) => s.branchFrom === step.id))
        bad('Move or remove the attached exception before removing this step.')
      steps.splice(index, 1)
    } else if (action === 'move') {
      if (body.direction !== 1 && body.direction !== -1) bad('Choose a direction.')
      const to = index + body.direction
      if (to < 0 || to >= steps.length) bad('This step is already at the edge.')
      ;[steps[index], steps[to]] = [steps[to], steps[index]]
    } else if (action === 'merge') {
      const previous = steps
        .slice(0, index)
        .findLast((s) => s.branchFrom === step.branchFrom && s.condition === step.condition)
      if (!previous) bad('There is no earlier step on this path to merge into.')
      const description = [previous.description, step.name + ' (' + step.source + '). ' + step.description]
        .filter(Boolean)
        .join('\n')
      const why =
        kind === 'proposed'
          ? previous.why + '\n' + step.name + ' (' + step.mode + '). ' + step.why
          : previous.why
      if (description.length > textLimit || why.length > textLimit)
        bad(
          'Shorten the descriptions or rationales before merging these steps. Each merged field can contain up to ' +
            textLimit +
            ' characters.',
        )
      previous.description = description
      previous.why = why
      previous.evidenceIds = [...new Set([...previous.evidenceIds, ...step.evidenceIds])]
      previous.uncertain ||= step.uncertain
      steps.forEach((s) => {
        if (s.branchFrom === step.id) s.branchFrom = previous.id
      })
      steps.splice(index, 1)
    } else missing()
  }
  for (const [i, s] of steps.entries()) {
    if (s.branchFrom && !steps.slice(0, i).some((parent) => parent.id === s.branchFrom && !parent.branchFrom))
      bad('An exception must follow its main-path step.')
  }
  map.revision++
}
