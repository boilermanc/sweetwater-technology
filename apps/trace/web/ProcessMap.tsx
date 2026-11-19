import { useState, type FormEvent } from 'react'
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Copy,
  CornerDownRight,
  GitBranch,
  ListTree,
  Plus,
} from 'lucide-react'
import { modes, sources, type Evidence, type ProcessVersion, type Step } from '../model.ts'
import type { ScreenProps } from './api.ts'

function StepForm({
  map,
  step,
  evidence,
  submit,
  cancel,
}: {
  map: ProcessVersion
  step?: Step
  evidence: Evidence[]
  submit: (fields: object) => Promise<void>
  cancel: () => void
}) {
  const [parent, setParent] = useState(step?.branchFrom ?? '')
  const index = step ? map.steps.findIndex((s) => s.id === step.id) : map.steps.length
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    await submit({
      ...Object.fromEntries(form),
      id: step?.id,
      evidenceIds: form.getAll('evidenceIds'),
      uncertain: form.has('uncertain'),
      branchFrom: parent,
      condition: parent ? form.get('condition') : '',
      why: form.get('why') ?? '',
    })
  }
  return (
    <form className="inset" onSubmit={onSubmit}>
      <h3>{step ? 'Edit step' : 'Add step'}</h3>
      <div className="fields">
        <label>
          Step name
          <input required name="name" defaultValue={step?.name} maxLength={180} />
        </label>
        <label>
          Source label
          <select name="source" defaultValue={step?.source}>
            {sources.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="wide">
          Description
          <textarea name="description" defaultValue={step?.description} maxLength={5000} />
        </label>
        <label>
          Path
          <select value={parent} onChange={(e) => setParent(e.target.value)}>
            <option value="">Main path</option>
            {map.steps
              .slice(0, index)
              .filter((s) => !s.branchFrom)
              .map((s) => (
                <option value={s.id} key={s.id}>
                  Exception after {s.name}
                </option>
              ))}
          </select>
        </label>
        {parent && (
          <label>
            Exception condition
            <input required name="condition" defaultValue={step?.condition} />
          </label>
        )}
        {map.kind === 'proposed' && (
          <>
            <label>
              Proposed handling
              <select name="mode" defaultValue={step?.mode}>
                {modes.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </label>
            <label className="wide">
              Why this approach?
              <input required name="why" defaultValue={step?.why} maxLength={5000} />
            </label>
          </>
        )}
        <fieldset className="wide">
          <legend>Linked evidence</legend>
          {!evidence.length && <p>Add items in Evidence to link them here.</p>}
          {evidence.map((e) => (
            <label className="check" key={e.id}>
              <input
                type="checkbox"
                name="evidenceIds"
                value={e.id}
                defaultChecked={step?.evidenceIds.includes(e.id)}
              />
              {e.title}
            </label>
          ))}
        </fieldset>
        <label className="check wide">
          <input type="checkbox" name="uncertain" defaultChecked={step?.uncertain} />
          Mark this step uncertain
        </label>
      </div>
      <div className="actions">
        <button className="primary">Save step</button>
        <button type="button" onClick={cancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}

export function ProcessMap({ view: { study }, staff, save }: ScreenProps) {
  const [kind, setKind] = useState<'current' | 'proposed'>('current')
  const [open, setOpen] = useState('')
  const [edit, setEdit] = useState('')
  const [questions, setQuestions] = useState(false)
  const map = study[kind]
  const action = (name: string, fields: object) => save(name, { ...fields, map: kind })
  function select(k: typeof kind) {
    setKind(k)
    setOpen('')
    setEdit('')
    setQuestions(false)
  }
  return (
    <section className="panel">
      <div className="section-head">
        <h2>Process map</h2>
        <div className="segment" aria-label="Process version">
          {(['current', 'proposed'] as const).map((k) => (
            <button aria-pressed={k === kind} key={k} onClick={() => select(k)}>
              {k === 'current' ? 'Current' : 'Proposed'}
            </button>
          ))}
        </div>
      </div>
      {!map ? (
        <div className="empty">
          <p>The proposed process begins with a copy of the current map.</p>
          {staff && (
            <button onClick={() => action('copyMap', {})}>
              <Copy size={15} />
              Create proposed copy
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="map-head">
            <span className="muted">
              <ListTree size={16} />
              {map.steps.length} steps
              {map.basedOn && ' · Based on current revision ' + map.basedOn.split('@')[1]}
            </span>
            {staff && (
              <button onClick={() => setEdit('new')}>
                <Plus size={15} />
                Add step
              </button>
            )}
          </div>
          {!map.steps.length && <p className="empty">No steps mapped yet.</p>}
          {map.steps.map((step, i) => (
            <div className={'step ' + (step.branchFrom ? 'exception' : '')} key={step.id}>
              {step.branchFrom && (
                <div className="branch-label">
                  <CornerDownRight size={15} />
                  {step.condition} · after {map.steps.find((s) => s.id === step.branchFrom)?.name}
                </div>
              )}
              <button
                className="step-toggle"
                aria-expanded={open === step.id}
                onClick={() => {
                  setEdit('')
                  setOpen(open === step.id ? '' : step.id)
                }}
              >
                <span className="step-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="step-info">
                  <b>{step.name}</b>
                  <span className="tags">
                    <span>{step.source}</span>
                    {(step.uncertain || !step.evidenceIds.length) && (
                      <span className="warning">Uncertain</span>
                    )}
                    {kind === 'proposed' && <span>{step.mode}</span>}
                  </span>
                </span>
                <ChevronDown size={16} />
              </button>
              {open === step.id && (
                <div className="step-detail">
                  <p>{step.description}</p>
                  {kind === 'proposed' && (
                    <p>
                      <b>Rationale</b> · {step.why}
                    </p>
                  )}
                  <h4>Linked evidence</h4>
                  {!step.evidenceIds.length ? (
                    <p>There is no evidence linked to this step yet.</p>
                  ) : (
                    step.evidenceIds.map((id) => {
                      const e = study.evidence.find((item) => item.id === id)
                      return (
                        e && (
                          <div className="citation" key={id}>
                            <b>{e.title}</b>
                            <small>{[e.kind, e.person, e.date].filter(Boolean).join(' · ')}</small>
                            {staff && <p>{e.text}</p>}
                          </div>
                        )
                      )
                    })
                  )}
                  {staff && (
                    <div className="actions">
                      <button onClick={() => setEdit(step.id)}>Edit step</button>
                      <button
                        aria-label="Move step up"
                        disabled={i === 0}
                        onClick={() => action('move', { id: step.id, direction: -1 })}
                      >
                        <ArrowUp size={15} />
                      </button>
                      <button
                        aria-label="Move step down"
                        disabled={i === map.steps.length - 1}
                        onClick={() => action('move', { id: step.id, direction: 1 })}
                      >
                        <ArrowDown size={15} />
                      </button>
                      <button
                        disabled={
                          !map.steps
                            .slice(0, i)
                            .some((s) => s.branchFrom === step.branchFrom && s.condition === step.condition)
                        }
                        onClick={() => {
                          if (confirm('Merge this step into the previous step on the same path?'))
                            void action('merge', { id: step.id })
                        }}
                      >
                        Merge with previous
                      </button>
                      <button
                        className="quiet"
                        onClick={() => {
                          if (confirm('Remove this step from this map?'))
                            void action('remove', { id: step.id })
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              )}
              {staff && step.id === edit && (
                <StepForm
                  map={map}
                  step={step}
                  evidence={study.evidence}
                  cancel={() => setEdit('')}
                  submit={async (f) => {
                    if (await action('step', f)) setEdit('')
                  }}
                />
              )}
            </div>
          ))}
          {staff && edit === 'new' && (
            <StepForm
              map={map}
              evidence={study.evidence}
              cancel={() => setEdit('')}
              submit={async (f) => {
                if (await action('step', f)) setEdit('')
              }}
            />
          )}
          <div className="questions">
            <div className="section-head">
              <h3>
                <GitBranch size={18} />
                Open questions
              </h3>
              {staff && !questions && <button onClick={() => setQuestions(true)}>Edit questions</button>}
            </div>
            {questions ? (
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  if (
                    await action('questions', { questions: new FormData(e.currentTarget).get('questions') })
                  )
                    setQuestions(false)
                }}
              >
                <label>
                  Questions still to answer
                  <textarea name="questions" maxLength={5000} defaultValue={map.questions} />
                </label>
                <div className="actions">
                  <button>Save questions</button>
                  <button type="button" onClick={() => setQuestions(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <p>{map.questions || 'No questions recorded yet.'}</p>
            )}
          </div>
        </>
      )}
    </section>
  )
}
