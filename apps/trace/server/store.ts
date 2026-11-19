import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { createClient } from '@supabase/supabase-js'
import type { ClientData } from '../model.ts'
import { fixtures } from './fixtures.ts'
import { RequestError } from './actions.ts'

export interface Store {
  listIds(): Promise<string[]>
  read(clientId: string): Promise<ClientData | undefined>
  save(data: ClientData, expected: number): Promise<void>
}
export function conflict(): never {
  throw new RequestError(409, 'Another edit was saved. Reload this study before saving again.')
}

// Only one local server owns this fixture store. Synchronous compare-and-rename keeps competing requests atomic.
export function fileStore(directory: string): Store {
  mkdirSync(directory, { recursive: true })
  const path = join(directory, 'fictional-studies.json')
  if (!existsSync(path)) writeFileSync(path, JSON.stringify(fixtures()), { flag: 'wx', mode: 0o600 })
  const read = () => JSON.parse(readFileSync(path, 'utf8')) as ClientData[]
  return {
    async listIds() {
      return read().map((row) => row.client.id)
    },
    async read(id) {
      return read().find((row) => row.client.id === id)
    },
    async save(data, expected) {
      const rows = read()
      const index = rows.findIndex((row) => row.client.id === data.client.id)
      if (rows[index]?.revision !== expected) conflict()
      rows[index] = { ...data, revision: expected + 1 }
      writeFileSync(path + '.new', JSON.stringify(rows), { mode: 0o600 })
      renameSync(path + '.new', path)
    },
  }
}

// Switchboard binds both repositories to the Trellis hub. Only the server imports this module.
export function trellisStore(secret: string, transport: typeof fetch = fetch) {
  if (!secret) throw new Error('Set the server-only TRACE_TRELLIS_KEY to use the Trellis database.')
  const db = createClient('https://horvjqqifgrzxesuxtfm.supabase.co', secret, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => transport(input, { ...init, redirect: 'error' }) },
  })
  const table = () => db.from('sw_trace_clients')
  const store: Store & { seedFictionalClients(): Promise<void> } = {
    async listIds() {
      const { data, error } = await table().select('id')
      if (error) throw error
      return (data ?? []).map((row) => row.id as string)
    },
    async read(id) {
      const { data, error } = await table().select('payload,revision').eq('id', id).maybeSingle()
      if (error) throw error
      return data ? ({ ...data.payload, revision: data.revision } as ClientData) : undefined
    },
    async save(data, expected) {
      const { data: saved, error } = await table()
        .update({ payload: { client: data.client, studies: data.studies }, revision: expected + 1 })
        .eq('id', data.client.id)
        .eq('revision', expected)
        .select('id')
      if (error) throw error
      if (!saved?.length) conflict()
    },
    async seedFictionalClients() {
      const rows = fixtures().map(({ client, studies }) => ({ id: client.id, payload: { client, studies } }))
      const { error } = await table().upsert(rows, { onConflict: 'id', ignoreDuplicates: true })
      if (error) throw error
    },
  }
  return store
}
