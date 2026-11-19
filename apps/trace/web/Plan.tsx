import { useState } from 'react'
import { CheckCircle2, MessageSquare } from 'lucide-react'
import { planFields, planLabels } from '../model.ts'
import type { ScreenProps } from './api.ts'
export function PlanScreen({ view: { study }, staff, save }: ScreenProps) {
  const [editing, setEditing] = useState(false)
  const [version, setVersion] = useState(0)
  const latest = study.plans.at(-1)!
  const plan = study.plans.find((p) => p.version === version) ?? latest
  const current = plan.version === latest.version
  return (
    <section className="panel">
      <div className="section-head">
        <h2>Discovery plan</h2>
        <label className="version">
          Version
          <select
            value={plan.version}
            onChange={(e) => {
              setVersion(Number(e.target.value))
              setEditing(false)
            }}
          >
            {study.plans.toReversed().map((p) => (
              <option key={p.id} value={p.version}>
                v{p.version}
                {p.version === latest.version ? ' · Latest' : ''}
              </option>
            ))}
          </select>
        </label>
      </div>
      {editing ? (
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            if (await save('plan', Object.fromEntries(new FormData(e.currentTarget)))) {
              setVersion(0)
              setEditing(false)
            }
          }}
        >
          {planFields.map((k) => (
            <label key={k}>
              {planLabels[k]}
              <textarea name={k} maxLength={5000} defaultValue={plan[k]} />
            </label>
          ))}
          <div className="actions">
            <button className="primary">Save plan</button>
            <button type="button" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          {planFields.map((k) => (
            <div className="plan-section" key={k}>
              <h3>{planLabels[k]}</h3>
              <p>{plan[k] || 'Awaiting facilitator notes.'}</p>
            </div>
          ))}
          {staff && current && <button onClick={() => setEditing(true)}>Edit plan</button>}
        </>
      )}
      <div className="review">
        <h3>
          <CheckCircle2 size={18} />
          Approval record
        </h3>
        {plan.approval ? (
          <p>
            <b>{plan.approval.decision}</b> by {plan.approval.reviewer} ·{' '}
            {new Date(plan.approval.date).toLocaleString()} · Version {plan.approval.version}
          </p>
        ) : (
          <>
            <p>Version {plan.version} is awaiting approval.</p>
            {!staff && current && (
              <button className="primary" onClick={() => save('approve', { version: plan.version })}>
                Approve version {plan.version}
              </button>
            )}
          </>
        )}
      </div>
      <div className="comments">
        <h3>
          <MessageSquare size={17} />
          Reviewer comments
        </h3>
        {plan.comments.map((c) => (
          <div className="citation" key={c.id}>
            <b>{c.reviewer}</b>
            <small>
              {new Date(c.date).toLocaleString()} · v{c.version}
            </small>
            <p>{c.text}</p>
          </div>
        ))}
        {!plan.comments.length && <p>No comments on this version.</p>}
        {!staff && current && (
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              const form = e.currentTarget
              if (await save('comment', { version: plan.version, text: new FormData(form).get('text') }))
                form.reset()
            }}
          >
            <label>
              Your comment
              <textarea required maxLength={5000} name="text" />
            </label>
            <button>Post comment</button>
          </form>
        )}
      </div>
    </section>
  )
}
