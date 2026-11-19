import { randomBytes } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { join } from 'node:path'
import type { ClientData, Session, Study, Summary, Workspace } from '../model.ts'
import { bad, changeStudy, createStudy, missing, RequestError } from './actions.ts'
import { conflict, type Store } from './store.ts'

const token = () => randomBytes(32).toString('base64url')
function send(res: ServerResponse, status: number, value: unknown) {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(value))
}
async function body(req: IncomingMessage) {
  if (req.headers['content-type'] !== 'application/json') bad('Expected a JSON request.')
  const chunks: Buffer[] = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > 1500000) throw new RequestError(413, 'The file is too large.')
    chunks.push(chunk)
  }
  try {
    const value = JSON.parse(Buffer.concat(chunks).toString())
    if (!value || typeof value !== 'object' || Array.isArray(value)) bad('Invalid request.')
    return value
  } catch {
    return bad('Invalid JSON request.')
  }
}
function summary(study: Study): Summary {
  return {
    id: study.id,
    clientId: study.clientId,
    name: study.name,
    goal: study.goal,
    status: study.status,
    steps: study.current.steps
      .filter((s) => !s.branchFrom)
      .slice(0, 3)
      .map((s) => s.name),
    branch: study.current.steps.find((s) => s.branchFrom)?.condition ?? '',
  }
}
function view(data: ClientData, study: Study, session: Session) {
  const isStaff = session.role === 'facilitator'
  const evidence = study.evidence
    .filter(
      (e) =>
        isStaff ||
        [study.current, study.proposed].some((m) => m?.steps.some((s) => s.evidenceIds.includes(e.id))),
    )
    .map((e) =>
      isStaff
        ? { ...e, bytes: undefined }
        : { id: e.id, clientId: e.clientId, studyId: e.studyId, title: e.title, kind: e.kind },
    )
  return {
    clientName: data.client.name,
    revision: data.revision,
    study: {
      ...study,
      people: isStaff ? study.people : '',
      tools: isStaff ? study.tools : '',
      exceptions: isStaff ? study.exceptions : '',
      evidence,
    },
  }
}
export function makeServer(store: Store, dist: string) {
  const sessions = new Map<string, Session>()
  const facilitators = { Clint: token(), Sheree: token() }
  for (const [name, access] of Object.entries(facilitators)) {
    sessions.set(access, { role: 'facilitator', name })
  }
  const reviewers = new Map<string, string>()
  const server = createServer(async (req, res) => {
    res.setHeader('Cache-Control', 'no-store')
    res.setHeader('Referrer-Policy', 'no-referrer')
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive')
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; object-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
    )
    try {
      const path = (req.url ?? '/').split('?')[0]
      if (!path.startsWith('/api/')) {
        if (req.method !== 'GET' && req.method !== 'HEAD') missing()
        const asset = /^\/assets\/([\w.-]+\.(js|css|woff2))$/.exec(path)
        const route = /^\/(?:studies(?:\/new|\/[\w-]+\/[\w-]+\/(?:setup|evidence|map|plan))?)?\/?$/
        if (!asset && !route.test(path)) missing()
        const file = asset ? join(dist, 'assets', asset[1]) : join(dist, 'index.html')
        const content = await readFile(file).catch(() => missing())
        const types: Record<string, string> = { js: 'text/javascript', css: 'text/css', woff2: 'font/woff2' }
        res.writeHead(200, { 'Content-Type': asset ? types[asset[2]] : 'text/html; charset=utf-8' })
        res.end(req.method === 'HEAD' ? undefined : content)
        return
      }
      const key = req.headers.authorization?.match(/^Bearer ([A-Za-z0-9_-]+)$/)?.[1]
      const session = key && sessions.get(key)
      if (!session)
        throw new RequestError(
          401,
          'Open your facilitator launcher or your reviewer invitation to enter Trace.',
        )
      if (path === '/api/workspace' && req.method === 'GET') {
        const ids = session.role === 'reviewer' ? [session.clientId!] : await store.listIds()
        const result: Workspace = { session, clients: [], studies: [] }
        for (const id of ids) {
          const data = await store.read(id)
          if (!data) continue
          result.clients.push({ id, name: data.client.name })
          result.studies.push(...data.studies.filter((study) => study.clientId === id).map(summary))
        }
        return send(res, 200, result)
      }
      const match =
        /^\/api\/clients\/([\w-]+)\/(studies|review)(?:\/([\w-]+)(?:\/(?:actions\/([a-zA-Z]+)|files\/([\w-]+)))?)?$/.exec(
          path,
        )
      if (!match) missing()
      const [, clientId, resource, studyId, action, fileId] = match
      if (session.role === 'reviewer' && session.clientId !== clientId) missing()
      const data = await store.read(clientId)
      if (!data) missing()
      if (resource === 'review') {
        if (studyId || session.role !== 'facilitator' || req.method !== 'POST') missing()
        let access = reviewers.get(clientId)
        if (!access) {
          access = token()
          reviewers.set(clientId, access)
          sessions.set(access, { role: 'reviewer', name: data.client.reviewer, clientId })
        }
        return send(res, 200, { access, reviewer: data.client.reviewer })
      }
      if (!studyId) {
        if (session.role !== 'facilitator' || req.method !== 'POST') missing()
        const id = createStudy(data, await body(req))
        await store.save(data, data.revision)
        return send(res, 201, { id })
      }
      const study = data.studies.find((s) => s.id === studyId && s.clientId === clientId)
      if (!study) missing()
      if (fileId) {
        if (req.method !== 'GET' || session.role !== 'facilitator') missing()
        const file = study.evidence.find(
          (e) => e.id === fileId && e.clientId === clientId && e.studyId === studyId,
        )
        if (!file?.bytes) missing()
        res.writeHead(200, {
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': 'attachment',
        })
        return res.end(Buffer.from(file.bytes, 'base64'))
      }
      if (!action && req.method === 'GET') return send(res, 200, view(data, study, session))
      if (!action || req.method !== 'POST') missing()
      if (session.role === 'reviewer' && !['approve', 'comment'].includes(action)) missing()
      const input = await body(req)
      if (input.revision !== data.revision) conflict()
      changeStudy(study, session, action, input)
      await store.save(data, data.revision)
      data.revision++
      send(res, 200, view(data, study, session))
    } catch (error) {
      const known = error instanceof RequestError
      send(res, known ? error.status : 500, {
        error: known ? error.message : 'Trace could not complete this request.',
      })
    }
  })
  return { server, facilitators }
}
