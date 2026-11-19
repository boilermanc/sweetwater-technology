import { useState } from 'react'
import { ArrowRight, CornerDownRight, GitBranch, Plus, Search, Workflow } from 'lucide-react'
import { statuses, type Workspace } from '../model.ts'

export function Studies({ workspace }: { workspace: Workspace }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('')
  const staff = workspace.session.role === 'facilitator'
  const clientName = (id: string) => workspace.clients.find((c) => c.id === id)?.name ?? ''
  const list = workspace.studies.filter(
    (s) =>
      (!status || s.status === status) &&
      (s.name + ' ' + clientName(s.clientId)).toLowerCase().includes(query.trim().toLowerCase()),
  )
  return (
    <>
      <div className="heading">
        <div>
          <h1>Discovery studies</h1>
          <p>
            {staff
              ? 'The evidence, maps and plans behind each client discovery.'
              : 'Review your process maps and discovery plans.'}
          </p>
        </div>
        {staff && (
          <a className="button primary" href="/studies/new">
            <Plus size={17} />
            New study
          </a>
        )}
      </div>
      <div className="library">
        <h2>
          Study library <span className="count">{workspace.studies.length}</span>
        </h2>
        <div className="filters">
          <label className="search">
            <Search size={16} />
            <input
              aria-label="Search studies"
              placeholder="Search studies"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="cards">
        {list.map((s) => (
          <a
            key={s.id}
            className="study-card"
            href={'/studies/' + s.clientId + '/' + s.id + '/' + (staff ? 'setup' : 'map')}
          >
            <div className="card-top">
              <span className="client-name">{clientName(s.clientId)}</span>
              <span className="status">
                <i />
                {s.status}
              </span>
            </div>
            <h3>{s.name}</h3>
            <p>{s.goal || 'Study setup in progress.'}</p>
            <div className="map-preview">
              <span className="preview-label">
                <Workflow size={14} />
                Current process
              </span>
              {s.steps.length ? (
                <div className="mini-path">
                  {s.steps.map((name, i) => (
                    <div key={i} className="mini-node">
                      <span className="point" />
                      <span>{name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No steps mapped yet.</p>
              )}
              {s.branch && (
                <div className="mini-branch">
                  <CornerDownRight size={15} />
                  {s.branch}
                </div>
              )}
            </div>
            <div className="card-bottom">
              <GitBranch size={15} />
              Open study
              <ArrowRight size={17} />
            </div>
          </a>
        ))}
      </div>
      {!list.length && <p className="empty">No studies match these filters.</p>}
    </>
  )
}
