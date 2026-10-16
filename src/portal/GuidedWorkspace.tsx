import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronRight, Compass, GitBranch, RotateCcw } from 'lucide-react';
import { SweetwaterLogo } from '../components/SweetwaterLogo';
import { answerQuestion, questionsFor, resumeDiscovery } from './guided-model';
import type { Answers } from './guided-model';
import './guided.css';

export default function GuidedWorkspace({ onRecords, initialAnswers = {}, onSave }: { onRecords?: () => void; initialAnswers?: Answers; onSave?: (answers: Answers) => Promise<void> }) {
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [step, setStep] = useState(() => resumeDiscovery(initialAnswers).step);
  const [review, setReview] = useState(() => resumeDiscovery(initialAnswers).review);
  const [saved, setSaved] = useState(JSON.stringify(initialAnswers));
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const dirty = JSON.stringify(answers) !== saved;
  useEffect(() => {
    if (!onSave || !dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty, onSave]);
  async function persist() {
    if (!onSave || !dirty) return true;
    setSaving(true); setSaveError('');
    try { await onSave(answers); setSaved(JSON.stringify(answers)); return true; }
    catch (error) { setSaveError(error instanceof Error ? error.message : 'Unable to save. Your answers are still here.'); return false; }
    finally { setSaving(false); }
  }
  function leave() {
    if (saving) return;
    if (!dirty || !onSave || window.confirm('You have unsaved answers. Leave without saving them?')) onRecords?.();
  }
  const [resetting, setResetting] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const questions = questionsFor(answers);
  const question = questions[Math.min(step, questions.length - 1)];
  const value = answers[question.id] || '';
  const answered = questions.filter(q => answers[q.id]?.trim()).length;
  useEffect(() => { heading.current?.focus(); }, [step, review]);
  function update(value: string) { setAnswers(current => answerQuestion(current, question.id, value)); }
  function edit(index: number) { setStep(index); setReview(false); }
  return <div className="guided">
    <header className="guide-header"><a href="/" aria-label="Sweetwater Technology home"><SweetwaterLogo /></a><div><span className="practice-badge">{onSave ? 'Shared client workspace' : 'Walkthrough preview'}</span>{onRecords ? <button disabled={saving} onClick={leave}>{onSave ? 'Saved clients' : 'Engagement records'} <ChevronRight size={15} /></button> : <a href="/portal">Client Login <ChevronRight size={15} /></a>}</div></header>
    {onSave ? <div className="guide-savebar"><p role={saveError ? 'alert' : 'status'}>{saveError || (saving ? 'Saving…' : dirty ? 'Unsaved changes — Continue saves your answer, or choose Save progress.' : !answers.client ? 'Start with a client name. Continue will save it.' : 'All changes saved. You and Sheree can reopen this client.')}</p><button disabled={saving || !dirty} onClick={() => void persist()}>Save progress</button></div> : <div className="practice-note">Practice space · Answers stay in this open page only. Refreshing clears them. Use fictional details while exploring.</div>}
    <fieldset disabled={saving} className="guide-layout">
      <aside className="guide-sidebar"><p className="guide-eyebrow">YOUR DELIVERY GUIDE</p><h2>One useful step<br />at a time.</h2><nav aria-label="Walkthrough stages"><div className={!review ? 'active' : ''}><span>01</span><div><strong>Understand the work</strong><small>Follow the conversation</small></div></div><div className={review ? 'active' : ''}><span>02</span><div><strong>Review together</strong><small>Check what we know</small></div></div><div><span>03</span><div><strong>Get another perspective</strong><small>AI review · coming later</small></div></div><div><span>04</span><div><strong>Agree the next step</strong><small>A human decision</small></div></div></nav><div className="guide-tip"><Compass size={22} /><strong>You don’t need the answer yet.</strong><p>Your job is to understand the work. A good follow-up question is progress.</p></div>{!onSave && <button className="guide-reset" onClick={() => setResetting(true)}><RotateCcw size={14} /> Start a fresh walkthrough</button>}{resetting && <div className="reset-confirm"><p>Clear all practice answers?</p><button onClick={() => { setAnswers({}); setStep(0); setReview(false); setResetting(false); }}>Yes, start fresh</button><button onClick={() => setResetting(false)}>Keep my answers</button></div>}</aside>
      <main className="guide-main">
        <div className="guide-breadcrumb">Workspace <ChevronRight size={13} /> Guided discovery</div>
        {!review ? <><div className="guide-progress"><span>UNDERSTAND THE WORK</span><span>{answered} answered · path adapts as you go</span></div><div className="guide-progress-track"><div style={{ width: `${answered / questions.length * 100}%` }} /></div>
        <section className="question-card"><p className="guide-eyebrow">QUESTION {step + 1}</p><h1 ref={heading} tabIndex={-1}>{question.title}</h1><p className="question-why">{question.why}</p>
          {question.choices ? <fieldset className="answer-choices"><legend className="sr-only">{question.title}</legend>{question.choices.map(choice => <label key={choice} className={value === choice ? 'chosen' : ''}><input type="radio" name={question.id} checked={value === choice} onChange={() => update(choice)} /><span>{choice}</span>{value === choice && <Check size={18} />}</label>)}</fieldset> : <><label className="guide-label" htmlFor="guide-answer">Your notes</label><textarea id="guide-answer" key={question.id} value={value} onChange={event => update(event.target.value)} placeholder={question.example} rows={5} /><button className="unsure" onClick={() => update('Not sure — follow up with the client')}>I’m not sure — flag for follow-up</button></>}
          {step > 0 && <p className="branch-explanation"><GitBranch size={16} /> {answers.goal ? `Exploring: ${answers.goal}.` : 'Your answer shapes what comes next.'} Changing an earlier answer clears the answers after it.</p>}
          <div className="guide-actions"><button className="guide-back" disabled={step === 0} onClick={() => setStep(step - 1)}><ArrowLeft size={16} /> Back</button><button className="guide-primary" disabled={!value.trim()} onClick={async () => { if (!await persist()) return; if (step === questions.length - 1) setReview(true); else setStep(step + 1); }}>{step === questions.length - 1 ? 'Review our answers' : 'Continue'}<ArrowRight size={17} /></button></div>
        </section><p className="guide-footnote">Ask it in your own words. Capture what the client means, not a perfect sentence.</p></> : <section className="guide-review"><p className="guide-eyebrow">REVIEW TOGETHER</p><h1 ref={heading} tabIndex={-1}>Here’s what we’ve learned.</h1><p>These are your notes, not verified findings. Check them together before making a recommendation.</p><div className="review-summary"><strong>{answers.client}</strong><span>{answers.goal}</span></div>{questions.map((q, index) => <article key={q.id}><div><h2>{q.title}</h2><button onClick={() => edit(index)}>Edit<span className="sr-only"> {q.title}</span></button></div><p>{answers[q.id] || 'Still to discuss'}</p></article>)}<div className="next-step-card"><p className="guide-eyebrow">YOUR DRAFT NEXT STEP</p><h2>{answers.next}</h2><p>Confirm who will do this and when with Sheree or Clint. {onSave ? 'Use Save progress to keep any edits. Nothing is sent to the client.' : 'Nothing has been sent to the client or saved to an engagement.'}</p></div><div className="future-review"><h2>More perspectives, when you’re ready.</h2><p>Later, connected models can propose an approach, challenge assumptions, and check it against the original evidence. Each recommendation should say what supports it, what is uncertain, and how to test it. Agreement between models is not proof. You and Sheree make the final call.</p><div>{['Propose', 'Challenge', 'Check evidence', 'Synthesize'].map(role => <span key={role}>{role}</span>)}</div><small>Preview only. No models are connected and no answers are sent to AI services.</small></div></section>}
      </main>
      <aside className="path-panel"><div><GitBranch size={19} /><h2>Your conversation path</h2></div><p>Watch this change as you choose an answer.</p><ol>{questions.map((q, index) => <li key={q.id} className={index === step && !review ? 'current' : ''}><button disabled={index > step && !answers[q.id] && !review} onClick={() => edit(index)}><span>{answers[q.id] ? <Check size={12} /> : index + 1}</span><div>{q.title}{answers[q.id] && <small>{answers[q.id]}</small>}</div></button></li>)}</ol><p className="path-note">Try going back to “What would they most like to improve?” and choosing another route.</p></aside>
    </fieldset>
  </div>;
}
