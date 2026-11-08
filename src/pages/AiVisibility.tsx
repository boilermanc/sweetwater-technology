import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowDownRight, ArrowRight, AudioLines, Check, Globe2, Printer, Radar, ShieldCheck } from 'lucide-react';
import { VisibilityTurnstile } from '../components/VisibilityTurnstile';
import './ai-visibility.css';

const endpoint = import.meta.env.VITE_AI_VISIBILITY_URL?.trim();
const siteKey = import.meta.env.VITE_AI_VISIBILITY_TURNSTILE_SITE_KEY?.trim();
const available = Boolean(endpoint && siteKey);
const emailAvailable = import.meta.env.VITE_AI_VISIBILITY_EMAIL_ENABLED === 'true';

type Answer = {
  question: string;
  text: string;
  mentioned: boolean;
  domainReferenced: boolean;
};

type Engine = { name: string; model: string; answers: Answer[] };
type Report = { business: string; domain: string; generatedAt?: string } &
  ({ engines: Engine[] } | { model: string; answers: Answer[] });

const sampleAnswers: Answer[] = [
  { question: 'Which providers should I consider for landscape design in Portland?', text: 'Alder Studio (alder-studio.example) is one option for residential landscape design. Ask about recent projects and whether they offer installation oversight.', mentioned: true, domainReferenced: true },
  { question: 'What are some alternatives for landscape design in Portland?', text: 'Compare independent landscape designers and design-build firms based on project scale, service area, and the scope of their installation services.', mentioned: false, domainReferenced: false },
  { question: 'Who specializes in landscape design in Portland, and why would I choose them?', text: 'Look for local teams with a portfolio of similar sites and experience with native planting, drainage, and seasonal maintenance.', mentioned: false, domainReferenced: false },
];

const sample: Report = {
  business: 'Alder Studio',
  domain: 'alder-studio.example',
  engines: [
    { name: 'Gemini', model: 'gemini-3.5-flash-lite', answers: sampleAnswers },
    { name: 'ChatGPT', model: 'gpt-6-luna', answers: [
      { ...sampleAnswers[0], text: 'Alder Studio is worth considering for a residential garden redesign. Ask for examples of projects in your neighborhood.', domainReferenced: false },
      ...sampleAnswers.slice(1),
    ] },
    { name: 'Claude', model: 'claude-haiku-5-5', answers: [
      { ...sampleAnswers[0], text: 'Start with the local landscape architects’ directory and ask for portfolios covering similar homes and site conditions.', mentioned: false, domainReferenced: false },
      ...sampleAnswers.slice(1),
    ] },
    { name: 'Manus', model: 'Lite agent', answers: [
      { ...sampleAnswers[0], text: 'Alder Studio (alder-studio.example) is a candidate for residential landscape design. Check its service area and compare its portfolio with other local studios.' },
      ...sampleAnswers.slice(1),
    ] },
  ],
};

function SignalGrid({ scanning = false }: { scanning?: boolean }) {
  return <div className={`visibility-signal ${scanning ? 'is-scanning' : ''}`} aria-hidden="true">
    {Array.from({ length: 48 }, (_, index) => <span key={index} style={{ animationDelay: `${(index % 12) * 95 + Math.floor(index / 12) * 135}ms` }} />)}
  </div>;
}

function Results({ report, example = false }: { report: Report; example?: boolean }) {
  const engines = 'engines' in report ? report.engines : [{ ...report, name: 'Gemini' }];
  const date = report.generatedAt && new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long', timeZone: 'America/New_York',
  }).format(new Date(report.generatedAt));
  return <>
    <div className="visibility-report-header">
      <p className="visibility-kicker">{example ? 'Example report / Fictional data' : 'Audit complete / AI model snapshot'}</p>
      <button type="button" className="visibility-print" onClick={() => window.print()}>
        <Printer size={17} aria-hidden="true" /> Print or save as PDF
      </button>
    </div>
    <p className="visibility-report-brand">Sweetwater Technology · AI Visibility Report</p>
    <h2 className="mt-3 break-words text-3xl font-black tracking-tight sm:text-5xl">{report.business}, here’s what showed up.</h2>
    <p className="mt-3 break-all text-slate-300">{report.domain}{date && <> <span aria-hidden="true">·</span> {date}</>}</p>
    <div className="visibility-metrics mt-7">
      {engines.map(({ name, model, answers }) => <div key={name}>
        <h3 className="font-bold">{name}</h3>
        <p className="break-words text-sm text-slate-300">{model}</p>
        {answers.length ? <>
          <p><strong>{answers.filter((answer) => answer.mentioned).length}<small>/{answers.length}</small></strong> named your business</p>
          <span className="visibility-readout" aria-hidden="true">{answers.map((answer) => <i key={answer.question} data-hit={answer.mentioned} />)}</span>
          <p><strong>{answers.filter((answer) => answer.domainReferenced).length}<small>/{answers.length}</small></strong> referenced your domain</p>
          <span className="visibility-readout" aria-hidden="true">{answers.map((answer) => <i key={answer.question} data-hit={answer.domainReferenced} />)}</span>
        </> : <p>Results unavailable for this run.</p>}
      </div>)}
    </div>
    <div className="visibility-interpretation mt-6">
      <h3>How to read your results</h3>
      <p>A name mention means your business name appeared in an answer. A domain reference means your website address appeared in the answer text. The checker samples API responses. Consumer apps may answer differently.</p>
      {engines.some(({ name }) => name === 'Manus') && <p className="mt-2">Manus answers all three questions in one agent task and can consult public sources.</p>}
      <h3>One thing to check</h3>
      <p>{engines.some(({ answers }) => answers.some((answer) => !answer.mentioned))
        ? 'Pick a question where your business was absent. Check whether your website has a page that answers it and clearly says what you offer, who you serve, and where.'
        : 'Pick the answer most relevant to your customers. Compare how Gemini described your business with how you describe it on your website.'}</p>
    </div>
    {engines.filter(({ answers }) => answers.length).map(({ name, answers }) => <div className="mt-6 space-y-3" key={name}>
      <h3 className="text-lg font-bold">{name} answers</h3>
      {answers.map((answer, index) => <details className="visibility-detail" key={answer.question} open={index === 0 ? true : undefined}>
        <summary><span className="visibility-kicker">0{index + 1}</span> {answer.question}</summary>
        <div className="px-4 pb-5 sm:px-6">
          <p className="mb-3 text-sm font-semibold text-cyan-200">{answer.mentioned ? 'Business named' : 'Business name absent'} · {answer.domainReferenced ? 'Domain referenced' : 'Domain reference absent'}</p>
          <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-200">{answer.text}</p>
        </div>
      </details>)}
    </div>)}
  </>;
}

export function AiVisibility() {
  const [token, setToken] = useState('');
  const [widgetKey, setWidgetKey] = useState(0);
  const [widgetError, setWidgetError] = useState(false);
  const [phase, setPhase] = useState<'ready' | 'running' | 'complete'>('ready');
  const [error, setError] = useState('');
  const [report, setReport] = useState<Report>();
  const [emailDelivery, setEmailDelivery] = useState<'accepted' | 'unavailable'>();
  const [showSample, setShowSample] = useState(false);
  const [recoverable, setRecoverable] = useState(false);
  const running = useRef(false);
  const resultPanel = useRef<HTMLElement>(null);
  const request = useRef<AbortController>(null);
  const receipt = useRef('');
  const receiveToken = useCallback((value: string) => {
    setToken(value);
    if (value) setWidgetError(false);
  }, []);
  const verificationError = useCallback(() => {
    setToken('');
    setWidgetError(true);
  }, []);

  useEffect(() => () => request.current?.abort(), []);

  useEffect(() => {
    if (phase === 'complete' || showSample) resultPanel.current?.focus();
  }, [phase, showSample]);

  async function runAudit(payload: Record<string, unknown>) {
    if (!endpoint || running.current) return;
    const controller = new AbortController();
    request.current = controller;
    running.current = true;
    setError('');
    setShowSample(false);
    setPhase('running');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, receipt: receipt.current }),
        signal: AbortSignal.any([controller.signal, AbortSignal.timeout(65000)]),
      });
      const body = await response.json();
      if (controller.signal.aborted) return;
      if (!response.ok || !body.report) {
        setRecoverable(response.status === 202 || response.status === 503);
        const message = response.status === 202 ? 'Your audit is still running. Check again in a moment.'
          : response.status === 404 ? 'There is no finished report for this attempt. You can try a new audit.'
          : response.status === 409 ? 'This email has already started or completed its free audit.'
          : response.status === 429 ? 'Today’s audit slots are full. Please try again tomorrow.'
          : response.status === 400 ? 'Check your business details, keep the category unbranded, and complete a fresh verification.'
          : response.status === 502 ? 'One of the models could not finish. Complete a fresh verification and try again.'
          : 'The audit is temporarily unavailable. Please try again later.';
        setError(message);
        setPhase('ready');
        return;
      }
      setReport(body.report);
      setEmailDelivery(body.emailDelivery);
      setPhase('complete');
    } catch {
      if (controller.signal.aborted) return;
      setRecoverable(true);
      setError('The connection was interrupted. Check for your report in a moment.');
      setPhase('ready');
    } finally {
      if (!controller.signal.aborted) {
        running.current = false;
        setToken('');
        setWidgetKey((value) => value + 1);
      }
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || recoverable || running.current) return;
    receipt.current = crypto.randomUUID();
    setRecoverable(false);
    const { domain, business, category, email, emailReport } = Object.fromEntries(new FormData(event.currentTarget));
    void runAudit({ domain, business, category, email, token, emailReport: emailReport === 'on' });
  }

  return <main className="visibility-page relative z-10">
    <div className="visibility-shell">
      <a className="visibility-back" href="/resources">← Sweetwater resources</a>
      <div className="visibility-hero">
        <div className="visibility-intro">
          <p className="visibility-kicker"><span className="visibility-beacon" /> SWEETWATER LABS <span aria-hidden="true">/</span> FREE TOOL</p>
          <h1>Does AI bring up <em>your business?</em></h1>
          <p className="max-w-lg text-lg leading-8 text-slate-300">Compare how Gemini, ChatGPT, and Claude answer three questions your next customer might ask. See which models name your business or reference your site.</p>
          <p className="mt-2 text-sm text-slate-300">The report also includes a Manus agent check when available.</p>
          <button type="button" className="visibility-example" onClick={() => {
            if (showSample) resultPanel.current?.focus();
            else setShowSample(true);
          }} disabled={phase === 'running' || phase === 'complete'}>
            See an example report <ArrowDownRight size={18} aria-hidden="true" />
          </button>
        </div>
        <section className="visibility-console" aria-labelledby="visibility-console-title">
          <header className="visibility-console-bar">
            <span className="visibility-lights" aria-hidden="true"><i /><i /><i /></span>
            <h2 id="visibility-console-title">Your visibility audit</h2>
            <span className="visibility-console-tag">MODEL COMPARISON</span>
          </header>
          {phase === 'complete' ? <div className="visibility-console-body">
            <p className="visibility-kicker"><Check size={17} aria-hidden="true" /> Report ready</p>
            <p className="mt-3 text-slate-300">Your answers and visibility counts by model are below.</p>
            {emailDelivery === 'accepted' && <p className="mt-3 text-sm text-cyan-200">Your email copy is on its way.</p>}
            {emailDelivery === 'unavailable' && <p className="mt-3 text-sm text-amber-200">We couldn’t confirm email delivery. You can save a copy below.</p>}
          </div> : <form onSubmit={submit} className="visibility-console-body" aria-busy={phase === 'running'}>
            <fieldset disabled={!available || phase === 'running'} className="m-0 grid min-w-0 gap-3 border-0 p-0">
              <label className="visibility-label">Website<input name="domain" placeholder="yourbusiness.com" inputMode="url" autoComplete="url" maxLength={253} required /></label>
              <label className="visibility-label">Business name<input name="business" placeholder="Your Business" autoComplete="organization" minLength={2} maxLength={100} required /></label>
              <label className="visibility-label">What customers look for<input name="category" placeholder="e.g. landscape design in Portland" minLength={3} maxLength={100} required /></label>
              {available && siteKey && phase !== 'running' && <div className="min-w-0">
                <p className="visibility-kicker mb-2"><ShieldCheck size={15} aria-hidden="true" /> Verify before entering email</p>
                <VisibilityTurnstile key={widgetKey} siteKey={siteKey} onToken={receiveToken} onError={verificationError} />
                {widgetError && <button className="visibility-example" type="button" onClick={() => {
                  setWidgetError(false);
                  setWidgetKey((value) => value + 1);
                }}>Retry verification</button>}
              </div>}
              <label className="visibility-label">Email<input name="email" type="email" autoComplete="email" placeholder="you@yourbusiness.com" disabled={!token} maxLength={254} required /></label>
              {emailAvailable && <label className="flex min-h-11 items-center gap-2 text-sm text-slate-200">
                <input type="checkbox" name="emailReport" className="size-4 accent-cyan-200" disabled={!token} /> Email me a copy of my report
              </label>}
              <button type="submit" className="visibility-submit" disabled={!token || !available || recoverable || phase === 'running'}>{phase === 'running' ? 'Running your audit…' : 'Run my free audit'} <ArrowRight size={18} aria-hidden="true" /></button>
            </fieldset>
            <p className="mt-3 text-xs leading-5 text-slate-300">One free audit per email. Sweetwater stores your submission and audit result. Your report appears here.</p>
            {!available && <p className="mt-3 text-sm text-cyan-200">Live audits are offline. You can still explore the example report.</p>}
            {error && <p className="mt-3 text-sm text-rose-200" role="alert">{error}</p>}
            {recoverable && <button type="button" className="visibility-example" disabled={phase === 'running'} onClick={() => void runAudit({ operation: 'recover' })}>Check for my report</button>}
          </form>}
        </section>
      </div>

      {phase === 'running' && <section className="visibility-report" role="status">
        <p className="visibility-kicker">Audit running</p>
        <h2 className="mt-3 text-3xl font-black">Asking the models your buyer questions.</h2>
        <p className="mt-3 text-slate-300">Keep this tab open while we collect the answers.</p>
        <SignalGrid scanning />
      </section>}
      {(report || showSample) && <section className="visibility-report" tabIndex={-1} ref={resultPanel} aria-label="Visibility report">
        <Results report={report ?? sample} example={!report} />
      </section>}

      <section className="visibility-panels" aria-label="How the checker works">
        <article>
          <Globe2 size={25} aria-hidden="true" />
          <h2>Start with your market.</h2>
          <p>Your category and location, when relevant, shape three buyer questions. Leave your business name out of the category so the questions stay unbranded.</p>
        </article>
        <article>
          <Radar size={25} aria-hidden="true" />
          <h2>Ask the same questions.</h2>
          <p>Each model gets the same three buyer questions. Read the answers side by side in the comparison report.</p>
        </article>
        <article>
          <AudioLines size={25} aria-hidden="true" />
          <h2>See where you appeared.</h2>
          <p>We look for your business name and domain in the answer text. Results can vary by prompt, model, and date.</p>
        </article>
      </section>
    </div>
  </main>;
}
