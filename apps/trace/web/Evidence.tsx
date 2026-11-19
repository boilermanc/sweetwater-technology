import { useState, type FormEvent } from 'react'
import { ChevronRight, FileText, Plus } from 'lucide-react'
import { evidenceTypes, type EvidenceType } from '../model.ts'
import { download, endpoint, type ScreenProps } from './api.ts'
export function EvidenceScreen({ view, save }: ScreenProps) {
  const { study } = view
  const [adding, setAdding] = useState(false)
  const [open, setOpen] = useState('')
  const [kind, setKind] = useState<EvidenceType>('Note')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const attached = kind === 'Document' || kind === 'Photo'
  async function add(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError('')
    const data = Object.fromEntries(new FormData(e.currentTarget))
    const { attachment, ...fields } = data
    try {
      const payload: Record<string, unknown> = { ...fields, kind }
      if (attached && attachment instanceof File) {
        if (attachment.size > 1024 * 1024) throw new Error('Choose a file up to 1 MB.')
        const bytes = new Uint8Array(await attachment.arrayBuffer())
        Object.assign(payload, {
          fileName: attachment.name,
          mime: attachment.type,
          bytes: btoa(Array.from(bytes, (byte) => String.fromCharCode(byte)).join('')),
        })
      }
      if (await save('evidence', payload)) setAdding(false)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setPending(false)
    }
  }
  return (
    <section className="panel">
      <div className="section-head">
        <h2>Evidence</h2>
        {!adding && (
          <button
            onClick={() => {
              setError('')
              setAdding(true)
            }}
          >
            <Plus size={16} />
            Add evidence
          </button>
        )}
      </div>
      {adding && (
        <form onSubmit={add} className="inset">
          <h3>Add evidence</h3>
          <div className="fields">
            <label>
              Type
              <select value={kind} onChange={(e) => setKind(e.target.value as EvidenceType)}>
                {evidenceTypes.map((k) => (
                  <option key={k}>{k}</option>
                ))}
              </select>
            </label>
            <label>
              Date
              <input required type="date" name="date" defaultValue={new Date().toLocaleDateString('en-CA')} />
            </label>
            <label>
              Title
              <input required name="title" maxLength={200} />
            </label>
            <label>
              Source person
              <input required name="person" maxLength={150} />
            </label>
            <label className="wide">
              Notes
              <textarea required={!attached} name="text" maxLength={5000} />
            </label>
            {attached && (
              <label className="wide">
                Cleaned fictional file (up to 1 MB)
                <input
                  required
                  key={kind}
                  type="file"
                  name="attachment"
                  accept={kind === 'Photo' ? 'image/jpeg,image/png' : '.pdf,.txt'}
                />
              </label>
            )}
          </div>
          <div className="actions">
            <button className="primary" disabled={pending}>
              Save evidence
            </button>
            <button type="button" onClick={() => setAdding(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}
      {error && <p role="alert">{error}</p>}
      {!study.evidence.length && <p className="empty">Add a note to start documenting this process.</p>}
      {study.evidence.map((e) => (
        <div key={e.id} className="record">
          <button
            className="record-toggle"
            aria-expanded={open === e.id}
            onClick={() => setOpen(open === e.id ? '' : e.id)}
          >
            <FileText size={19} />
            <span>
              <b>{e.title}</b>
              <small>
                {e.kind} · {e.person} · {e.date}
              </small>
            </span>
            <ChevronRight size={17} />
          </button>
          {open === e.id && (
            <div className="record-body">
              <p>{e.text}</p>
              <div className="actions">
                {e.fileName && (
                  <button
                    onClick={() =>
                      download(endpoint(study.clientId, study.id) + '/files/' + e.id, e.fileName!).catch(
                        (err) => setError(err.message),
                      )
                    }
                  >
                    Download {e.fileName}
                  </button>
                )}
                <button
                  className="quiet"
                  onClick={() => {
                    if (confirm('Delete this evidence and unlink it from both maps?'))
                      void save('deleteEvidence', { id: e.id })
                  }}
                >
                  Delete evidence
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </section>
  )
}
