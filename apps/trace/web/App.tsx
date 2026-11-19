import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  ChevronRight,
  ClipboardList,
  FileText,
  Folders,
  GitFork,
  Layers2,
  LockKeyhole,
} from 'lucide-react'
import { SweetwaterLogo } from '../../../src/components/SweetwaterLogo'
import { type StudyView, type Workspace } from '../model.ts'
import { api, endpoint, type Save } from './api.ts'
import { Studies } from './Studies.tsx'
import { StudySetup } from './Setup.tsx'
import { EvidenceScreen } from './Evidence.tsx'
import { ProcessMap } from './ProcessMap.tsx'
import { PlanScreen } from './Plan.tsx'

const [, , clientId, studyId, tab] = location.pathname.split('/')
const newStudy = location.pathname.replace(/\/$/, '') === '/studies/new'
const sections = [
  { id: 'setup', label: 'Study setup', icon: ClipboardList },
  { id: 'evidence', label: 'Evidence', icon: Folders },
  { id: 'map', label: 'Process map', icon: GitFork },
  { id: 'plan', label: 'Plan', icon: FileText },
]
export function App() {
  const [workspace, setWorkspace] = useState<Workspace>()
  const [view, setView] = useState<StudyView>()
  const [loadError, setLoadError] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [saving, setSaving] = useState(false)
  const [review, setReview] = useState<{ access: string; reviewer: string }>()
  const busy = useRef(false)
  const staff = workspace?.session.role === 'facilitator'
  useEffect(() => {
    let mounted = true
    Promise.all([
      api<Workspace>('/api/workspace'),
      studyId ? api<StudyView>(endpoint(clientId, studyId)) : undefined,
    ])
      .then(([w, s]) => {
        if (!mounted) return
        if (w.session.role === 'reviewer' && (newStudy || (studyId && tab !== 'map' && tab !== 'plan'))) {
          setLoadError('This screen is available to facilitators only.')
          return
        }
        setWorkspace(w)
        setView(s)
      })
      .catch((err) => {
        if (mounted) setLoadError(err.message)
      })
    return () => {
      mounted = false
    }
  }, [])
  const save: Save = async (action, fields) => {
    if (!view) return false
    if (busy.current) {
      setError('A save is in progress. Try your last change again when it finishes.')
      return false
    }
    busy.current = true
    setSaving(true)
    setError('')
    setNotice('')
    try {
      const updated = await api<StudyView>(endpoint(clientId, studyId) + '/actions/' + action, {
        ...fields,
        revision: view.revision,
      })
      setView(updated)
      setNotice('Saved.')
      return true
    } catch (err) {
      setError((err as Error).message)
      return false
    } finally {
      busy.current = false
      setSaving(false)
    }
  }
  const props = view ? { view, staff, save } : undefined
  return (
    <div className="shell">
      <a className="skip" href="#content">
        Skip to content
      </a>
      <header className="topbar">
        <div className="frame top-inner">
          <a href="/studies" aria-label="Sweetwater Technology · Trace studies" className="brand">
            <SweetwaterLogo markClassName="studio-mark" />
            <span className="product-name">Trace</span>
          </a>
          {workspace && (
            <div className="identity">
              <span className="avatar">{workspace.session.name[0]}</span>
              <span>
                <b>{workspace.session.name}</b>
                <small>{staff ? 'Facilitator' : 'Client reviewer'}</small>
              </span>
            </div>
          )}
        </div>
      </header>
      <main id="content" className="frame">
        <nav aria-label="Breadcrumb" className="crumb">
          <Layers2 size={15} />
          <a href="/studies">Workspace</a>
          <ChevronRight size={13} />
          <a href="/studies">Studies</a>
          {(view || newStudy) && (
            <>
              <ChevronRight size={13} />
              <span>{view?.clientName ?? 'New study'}</span>
            </>
          )}
        </nav>
        {loadError ? (
          <section className="panel gate">
            <LockKeyhole />
            <h1>Workspace access</h1>
            <p role="alert">{loadError}</p>
            <a href="/studies">Return to studies</a>
          </section>
        ) : !workspace ? (
          <p role="status">Opening workspace…</p>
        ) : newStudy ? (
          <>
            <div className="heading">
              <h1>New study</h1>
            </div>
            <StudySetup workspace={workspace} />
          </>
        ) : !view || !props ? (
          <Studies workspace={workspace} />
        ) : (
          <>
            <div className="heading">
              <div>
                <p className="client-name">{view.clientName}</p>
                <h1>{view.study.name}</h1>
                <p>{view.study.goal}</p>
              </div>
              {staff &&
                (review ? (
                  <a
                    className="button"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={'/studies/' + clientId + '/' + studyId + '/map#access=' + review.access}
                  >
                    Open as {review.reviewer}
                    <ArrowUpRight size={15} />
                  </a>
                ) : (
                  <button
                    onClick={async () => {
                      try {
                        setReview(await api('/api/clients/' + clientId + '/review', {}))
                      } catch (err) {
                        setError((err as Error).message)
                      }
                    }}
                  >
                    Reviewer preview
                    <BookOpen size={16} />
                  </button>
                ))}
            </div>
            <nav className="tabs" aria-label="Study screens">
              {sections
                .filter((s) => staff || s.id === 'map' || s.id === 'plan')
                .map((s) => (
                  <a
                    key={s.id}
                    aria-current={s.id === tab ? 'page' : undefined}
                    href={'/studies/' + clientId + '/' + studyId + '/' + s.id}
                  >
                    <s.icon size={17} />
                    {s.label}
                  </a>
                ))}
            </nav>
            {error && (
              <p className="alert" role="alert">
                {error} <button onClick={() => location.reload()}>Reload study</button>
              </p>
            )}
            <div className="save-status" aria-live="polite">
              {saving ? 'Saving…' : notice}
            </div>
            <fieldset
              className="study-controls"
              disabled={saving}
              aria-busy={saving}
              aria-label="Study workspace"
            >
              {tab === 'setup' && (
                <StudySetup workspace={workspace} data={view.study} client={clientId} save={save} />
              )}
              {tab === 'evidence' && <EvidenceScreen {...props} />}
              {tab === 'map' && <ProcessMap {...props} />}
              {tab === 'plan' && <PlanScreen {...props} />}
            </fieldset>
            <a className="back" href="/studies">
              <ArrowLeft size={15} /> All studies
            </a>
          </>
        )}
      </main>
      <footer className="frame">
        <span>
          <span className="footer-dot" />
          Fictional data workspace
        </span>
        <span>Sweetwater Technology</span>
      </footer>
    </div>
  )
}
