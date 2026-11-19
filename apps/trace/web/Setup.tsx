import { useState, type FormEvent } from 'react'
import { setupFields, setupLabels, statuses, type Setup, type Workspace } from '../model.ts'
import { api, type Save } from './api.ts'
const initial: Setup = {
  name: '',
  goal: '',
  start: '',
  end: '',
  people: '',
  tools: '',
  exceptions: '',
  status: 'In discovery',
}
export function StudySetup({
  workspace,
  client,
  data,
  save,
}: {
  workspace: Workspace
  client?: string
  data?: Setup
  save?: Save
}) {
  const [values, set] = useState<Setup>(() => {
    const values = { ...initial }
    if (data) {
      for (const field of setupFields) values[field] = data[field]
      values.status = data.status
    }
    return values
  })
  const [clientId, selectClient] = useState(client ?? workspace.clients[0]?.id)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  async function submit(e: FormEvent) {
    e.preventDefault()
    setPending(true)
    setError('')
    try {
      if (save) await save('setup', values)
      else {
        const { id } = await api<{ id: string }>('/api/clients/' + clientId + '/studies', values)
        location.assign('/studies/' + clientId + '/' + id + '/setup')
      }
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setPending(false)
    }
  }
  return (
    <form className="panel" onSubmit={submit}>
      <h2>{data ? 'Study setup' : 'Set up a study'}</h2>
      <div className="fields">
        <label>
          Client
          <select disabled={!!data} value={clientId} onChange={(e) => selectClient(e.target.value)}>
            {workspace.clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select
            value={values.status}
            onChange={(e) => set({ ...values, status: e.target.value as Setup['status'] })}
          >
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        {setupFields.map((k) => (
          <label className={['name', 'goal', 'exceptions'].includes(k) ? 'wide' : ''} key={k}>
            {setupLabels[k]}
            <input
              required={k === 'name'}
              maxLength={5000}
              value={values[k]}
              onChange={(e) => set({ ...values, [k]: e.target.value })}
            />
          </label>
        ))}
      </div>
      {error && <p role="alert">{error}</p>}
      <button className="primary" disabled={pending}>
        {data ? 'Save setup' : 'Create study'}
      </button>
    </form>
  )
}
