import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { makeServer } from '../server/http.ts'
import { fileStore, trellisStore } from '../server/store.ts'

async function demo(t) {
  const directory = await mkdtemp(join(tmpdir(), 'trace-test-'))
  const store = fileStore(directory)
  const { server, facilitators } = makeServer(store, fileURLToPath(new URL('../dist/', import.meta.url)))
  const facilitator = facilitators.Clint
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  t.after(async () => {
    await new Promise((resolve) => server.close(resolve))
    await rm(directory, { recursive: true, force: true })
  })
  const base = 'http://127.0.0.1:' + server.address().port
  const call = async (path, key = facilitator, payload) => {
    const response = await fetch(base + path, {
      method: payload === undefined ? 'GET' : 'POST',
      headers: { authorization: 'Bearer ' + key, 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const type = response.headers.get('content-type')
    const data = type?.includes('json') ? await response.json() : await response.text()
    return { status: response.status, data }
  }
  const work = (await call('/api/workspace')).data
  assert.equal((await call('/api/workspace', facilitators.Sheree)).data.session.name, 'Sheree')
  const clientPath = (id) => '/api/clients/' + id
  const studyPath = (s) => clientPath(s.clientId) + '/studies/' + s.id
  const invite = async (id) => (await call(clientPath(id) + '/review', facilitator, {})).data.access
  return { call, work, invite, studyPath, clientPath, store, directory, facilitator }
}

test('reviewer scope is applied before reading or changing studies, evidence and files', async (t) => {
  const { call, work, invite, studyPath, facilitator, clientPath } = await demo(t)
  assert.equal(work.clients.length, 2)
  assert.equal((await call('/api/workspace', '')).status, 401)
  for (const s of work.studies) {
    const other = work.studies.find((row) => row.clientId !== s.clientId)
    const key = await invite(s.clientId)
    const index = (await call('/api/workspace', key)).data
    assert.deepEqual(
      index.studies.map((row) => row.id),
      [s.id],
    )
    assert.deepEqual(
      index.clients.map((c) => c.id),
      [s.clientId],
    )
    const full = (await call(studyPath(s))).data
    const projection = (await call(studyPath(s), key)).data
    assert.ok(projection.study.evidence.every((e) => !('text' in e) && !('bytes' in e) && !('fileName' in e)))
    assert.ok(full.study.evidence.find((e) => e.text))
    const sameFile = full.study.evidence.find((e) => e.fileName)
    assert.equal((await call(studyPath(s) + '/files/' + sameFile.id, facilitator)).data, sameFile.text)
    assert.equal((await call(studyPath(s) + '/files/' + sameFile.id, key)).status, 404)
    for (const path of [
      studyPath(other),
      clientPath(s.clientId) + '/studies/' + other.id,
      studyPath(other) + '/files/' + sameFile.id,
    ]) {
      assert.equal((await call(path, key)).status, 404)
    }
    for (const path of [
      clientPath(s.clientId) + '/review',
      clientPath(other.clientId) + '/review',
      clientPath(s.clientId) + '/studies',
      studyPath(s) + '/actions/step',
    ]) {
      assert.equal((await call(path, key, { revision: full.revision })).status, 404)
    }
    for (const path of [
      '/server/fixtures.ts',
      '/.trace-4186.local/fictional-studies.json',
      '/@fs/server/start.ts',
    ]) {
      assert.equal((await call(path, key)).status, 404)
    }
  }
})

test('study creation through versioned reviewer approval works for both clients and survives reopening', async (t) => {
  const { call, work, invite, clientPath, studyPath, facilitator, directory } = await demo(t)
  for (const c of work.clients) {
    const setup = {
      name: 'New fictional discovery',
      goal: 'Understand the handoff',
      start: 'Request',
      end: 'Confirmed',
      people: 'Owner',
      tools: 'Notebook',
      exceptions: 'Incomplete details',
      status: 'Mapping',
    }
    const created = await call(clientPath(c.id) + '/studies', facilitator, setup)
    assert.equal(created.status, 201)
    const url = studyPath({ id: created.data.id, clientId: c.id })
    let view = (await call(url)).data
    async function act(action, payload, key = facilitator) {
      const result = await call(url + '/actions/' + action, key, { ...payload, revision: view.revision })
      assert.equal(result.status, 200, JSON.stringify(result.data.error))
      view = result.data
    }
    await act('evidence', {
      title: 'Observation',
      text: 'The owner checks the note.',
      person: 'Facilitator',
      date: '2026-11-19',
      kind: 'Note',
    })
    const step = {
      name: 'Check note',
      description: 'Read it back',
      source: 'Observed',
      map: 'current',
      branchFrom: '',
      condition: '',
      why: '',
      evidenceIds: [view.study.evidence[0].id],
    }
    await act('step', step)
    await act('step', {
      ...step,
      name: 'Ask for details',
      condition: 'Missing information',
      branchFrom: view.study.current.steps[0].id,
      evidenceIds: [],
    })
    assert.equal(view.study.current.steps[1].uncertain, true)
    await act('questions', { map: 'current', questions: 'Who handles an unanswered request?' })
    const current = structuredClone(view.study.current)
    await act('copyMap', {})
    assert.notEqual(current.steps[0].id, view.study.proposed.steps[0].id)
    assert.equal(view.study.proposed.steps[1].branchFrom, view.study.proposed.steps[0].id)
    assert.equal(view.study.proposed.questions, current.questions)
    await act('step', {
      ...view.study.proposed.steps[0],
      map: 'proposed',
      name: 'Review a draft checklist',
      mode: 'AI-assisted',
      why: 'The owner checks the draft.',
    })
    assert.deepEqual(view.study.current, current)
    const draft = {
      findings: 'The handoff is manual.',
      suggestions: 'Agree a checklist.',
      priorities: 'Check incoming notes.',
      requirements: 'Owner review.',
      questions: 'Who follows up?',
    }
    await act('plan', draft)
    const version = view.study.plans.at(-1).version
    const reviewer = await invite(c.id)
    await act('comment', { version, text: 'Looks right.' }, reviewer)
    const before = structuredClone((await call(url)).data.study)
    await act('approve', { version, reviewer: 'Wrong person', date: 'invalid' }, reviewer)
    const after = (await call(url)).data.study
    const approval = after.plans.at(-1).approval
    assert.equal(approval.reviewer, (await call('/api/workspace', reviewer)).data.session.name)
    assert.equal(approval.decision, 'Approved')
    assert.equal(approval.version, version)
    assert.ok(Number.isFinite(Date.parse(approval.date)))
    before.plans.at(-1).approval = approval
    assert.deepEqual(after, before)
    await act('approve', { version }, reviewer)
    assert.deepEqual(view.study.plans.at(-1).approval, approval)
    await act('plan', { ...draft, findings: 'Updated finding.' })
    assert.equal(view.study.plans.at(-1).approval, null)
    assert.deepEqual(view.study.plans.at(-2).approval, approval)
    const stale = await call(url + '/actions/approve', reviewer, { revision: view.revision, version })
    assert.equal(stale.status, 409)
    assert.ok(
      (await fileStore(directory).read(c.id)).studies.some((s) =>
        s.plans.some((p) => p.approval?.id === approval.id),
      ),
    )
  }
})

test('map validation, edits, evidence deletion and concurrent updates preserve integrity', async (t) => {
  const { call, work, studyPath, facilitator } = await demo(t)
  const url = studyPath(work.studies[0])
  let view = (await call(url)).data
  const act = (name, value) =>
    call(url + '/actions/' + name, facilitator, { ...value, revision: view.revision, map: 'proposed' })
  const [first, anchor, branch, last] = view.study.proposed.steps
  assert.equal((await act('move', { id: branch.id, direction: -1 })).status, 400)
  assert.equal((await act('remove', { id: anchor.id })).status, 400)
  assert.equal((await act('step', { ...first, evidenceIds: ['missing'] })).status, 400)
  assert.deepEqual((await call(url)).data, view)
  const moved = await act('move', { id: last.id, direction: -1 })
  assert.equal(moved.status, 200)
  view = moved.data
  const merged = await act('merge', { id: anchor.id })
  assert.equal(merged.status, 200)
  view = merged.data
  assert.equal(view.study.proposed.steps.find((s) => s.id === branch.id).branchFrom, first.id)
  assert.ok(view.study.proposed.steps[0].description.includes(anchor.name))
  view = (await act('remove', { id: branch.id })).data
  assert.ok(!view.study.proposed.steps.some((s) => s.id === branch.id))
  const questionCalls = await Promise.all(
    ['Question A?', 'Question B?'].map((questions) => act('questions', { questions })),
  )
  assert.deepEqual(questionCalls.map((r) => r.status).sort(), [200, 409])
  view = (await call(url)).data
  const id = view.study.current.steps[0].evidenceIds[0]
  view = (await act('deleteEvidence', { id })).data
  assert.ok(!view.study.evidence.some((e) => e.id === id))
  assert.ok(view.study.current.steps[0].uncertain)
  assert.ok(
    [view.study.current, view.study.proposed].every((map) =>
      map.steps.every((s) => !s.evidenceIds.includes(id)),
    ),
  )
})

test('Trellis adapter pins the host, scopes updates by client and revision, and seeds only on request', async () => {
  assert.throws(() => trellisStore(''), /server-only/)
  const rows = new Map()
  const requests = []
  const store = trellisStore('fictional-test', async (input, init) => {
    const url = new URL(input)
    assert.equal(url.origin, 'https://horvjqqifgrzxesuxtfm.supabase.co')
    assert.equal(url.pathname, '/rest/v1/sw_trace_clients')
    assert.equal(init.redirect, 'error')
    requests.push(init.method)
    const id = url.searchParams.get('id')?.slice(3)
    const row = rows.get(id)
    if (init.method === 'POST') {
      assert.equal(url.searchParams.get('on_conflict'), 'id')
      assert.match(new Headers(init.headers).get('prefer'), /resolution=ignore-duplicates/)
      for (const incoming of JSON.parse(init.body)) {
        if (!rows.has(incoming.id)) rows.set(incoming.id, { ...incoming, revision: 1 })
      }
      return new Response(null, { status: 201 })
    }
    if (init.method === 'PATCH') {
      if (!row || url.searchParams.get('revision') !== 'eq.' + row.revision) return Response.json([])
      Object.assign(row, JSON.parse(init.body))
      return Response.json([{ id }])
    }
    return Response.json(id ? (row ? [row] : []) : [...rows.keys()].map((id) => ({ id })))
  })
  assert.deepEqual(await store.listIds(), [])
  assert.deepEqual(requests, ['GET'])
  await store.seedFictionalClients()
  const ids = await store.listIds()
  assert.equal(ids.length, 2)
  const client = await store.read(ids[0])
  client.studies[0].name = 'Changed in Trace'
  await store.save(client, 1)
  await assert.rejects(store.save(client, 1), /Another edit/)
  await store.seedFictionalClients()
  assert.deepEqual(await store.listIds(), ids)
  const saved = await store.read(ids[0])
  assert.equal(saved.revision, 2)
  assert.equal(saved.studies[0].name, 'Changed in Trace')
})
