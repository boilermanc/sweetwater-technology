import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowDownRight, ArrowRight, AudioLines, Check, FileText, Globe2, MessageSquare, Radar, ShieldCheck } from 'lucide-react';
import { VisibilityTurnstile } from '../components/VisibilityTurnstile';
import { VisibilityAuditReport, type AuditAnswer, type AuditReport } from '../components/VisibilityAuditReport';
import './ai-visibility.css';

const endpoint = import.meta.env.VITE_AI_VISIBILITY_URL?.trim();
const siteKey = import.meta.env.VITE_AI_VISIBILITY_TURNSTILE_SITE_KEY?.trim();
const available = Boolean(endpoint && siteKey);
const emailAvailable = import.meta.env.VITE_AI_VISIBILITY_EMAIL_ENABLED === 'true';

const sampleAnswers: AuditAnswer[] = [
  { question: 'Which providers should I consider for landscape design in Portland?', text: 'Alder Studio (https://alder-studio.example) is one option for residential landscape design. Ask about recent projects and whether they offer installation oversight.', mentioned: true, domainReferenced: true },
  { question: 'What are some alternatives for landscape design in Portland?', text: 'Compare independent landscape designers and design-build firms based on project scale, service area, and the scope of their installation services.', mentioned: false, domainReferenced: false },
  { question: 'Who specializes in landscape design in Portland, and why would I choose them?', text: 'Look for local teams with a portfolio of similar sites and experience with native planting, drainage, and seasonal maintenance.', mentioned: false, domainReferenced: false },
];

const sample: AuditReport = {
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
      { ...sampleAnswers[0], text: 'Alder Studio (https://alder-studio.example/portfolio) is a candidate for residential landscape design. Check its service area and compare its portfolio with other local studios.' },
      ...sampleAnswers.slice(1),
    ] },
  ],
};

function SignalGrid({ scanning = false }: { scanning?: boolean }) {
  return <div className={`visibility-signal ${scanning ? 'is-scanning' : ''}`} aria-hidden="true">
    {Array.from({ length: 48 }, (_, index) => <span key={index} style={{ animationDelay: `${(index % 12) * 95 + Math.floor(index / 12) * 135}ms` }} />)}
  </div>;
}

const ownerEmail = 'clint@sweetwater.technology';

export function AiVisibility() {
  const [token, setToken] = useState('');
  const [widgetKey, setWidgetKey] = useState(0);
  const [verification, setVerification] = useState<'loading' | 'interactive' | 'error'>('loading');
  const [phase, setPhase] = useState<'ready' | 'running' | 'complete'>('ready');
  const [auditDomain, setAuditDomain] = useState('');
  const [error, setError] = useState('');
  const [report, setReport] = useState<AuditReport>();
  const [emailDelivery, setEmailDelivery] = useState<'accepted' | 'unavailable'>();
  const [showSample, setShowSample] = useState(false);
  const [recoverable, setRecoverable] = useState(false);
  const running = useRef(false);
  const resultPanel = useRef<HTMLElement>(null);
  const progressPanel = useRef<HTMLElement>(null);
  const request = useRef<AbortController>(null);
  const receipt = useRef('');
  const [ownerAudit, setOwnerAudit] = useState(false);
  const receiveToken = useCallback((value: string) => {
    setToken(value);
    setVerification('loading');
  }, []);
  const verificationInteractive = useCallback(() => setVerification('interactive'), []);
  const verificationError = useCallback(() => {
    setToken('');
    setVerification('error');
  }, []);

  useEffect(() => () => request.current?.abort(), []);

  useEffect(() => {
    if (phase === 'running') progressPanel.current?.focus();
    else if (phase === 'complete' || showSample) resultPanel.current?.focus();
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
      const requestHeaders = new Headers({ 'Content-Type': 'application/json' });
      const isOwnerRequest = typeof payload.email === 'string' && payload.email.trim().toLowerCase() === ownerEmail;
      if (isOwnerRequest) {
        const portalUrl = import.meta.env.VITE_PORTAL_SUPABASE_URL;
        if (typeof portalUrl === 'string' && new URL(endpoint).origin === new URL(portalUrl).origin) {
          const { portalClient } = await import('../portal/client');
          const session = await portalClient?.auth.getSession();
          if (session?.data.session?.user.email?.toLowerCase() === ownerEmail) {
            requestHeaders.set('Authorization', `Bearer ${session.data.session.access_token}`);
          }
        }
      }
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify({ ...payload, receipt: receipt.current }),
        signal: AbortSignal.any([controller.signal, AbortSignal.timeout(65000)]),
      });
      const body = await response.json();
      if (controller.signal.aborted) return;
      if (!response.ok || !body.report) {
        setRecoverable(response.status === 202 || response.status === 503);
        const message = response.status === 202 ? 'Your audit is still running. Check again in a moment.'
          : response.status === 401 && isOwnerRequest ? 'This email is reserved for repeat testing. Enter a different email to run a free audit.'
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
        setVerification('loading');
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
    setAuditDomain(typeof domain === 'string' ? domain.trim() : '');
    setOwnerAudit(typeof email === 'string' && email.trim().toLowerCase() === ownerEmail);
    void runAudit({ domain, business, category, email, token, emailReport: emailReport === 'on' });
  }

  return <main className="visibility-page relative z-10">
    <div className="visibility-shell">
      <a className="visibility-back" href="/resources">← Sweetwater resources</a>
      {phase !== 'complete' && <div className={phase === 'running' ? 'hidden' : 'visibility-hero'}>
        <div className="visibility-intro">
          <p className="visibility-kicker"><span className="visibility-beacon" /> SWEETWATER LABS <span aria-hidden="true">/</span> FREE TOOL</p>
          <h1>Does AI bring up <em>your business?</em></h1>
          <p className="max-w-lg text-lg leading-8 text-slate-300">Compare how Gemini, ChatGPT, and Claude answer three questions your next customer might ask. See which models name your business or reference your site.</p>
          <p className="mt-2 text-sm text-slate-300">The report also includes a Manus agent check when available.</p>
          <button type="button" className="visibility-example" onClick={() => {
            if (showSample) resultPanel.current?.focus();
            else setShowSample(true);
          }}>
            See an example report <ArrowDownRight size={18} aria-hidden="true" />
          </button>
        </div>
        <section className="visibility-console" aria-labelledby="visibility-console-title">
          <header className="visibility-console-bar">
            <span className="visibility-lights" aria-hidden="true"><i /><i /><i /></span>
            <h2 id="visibility-console-title">Your visibility audit</h2>
            <span className="visibility-console-tag">MODEL COMPARISON</span>
          </header>
          <form onSubmit={submit} className="visibility-console-body" aria-busy={phase === 'running'}>
            <fieldset disabled={!available || phase === 'running'} className="m-0 grid min-w-0 gap-3 border-0 p-0">
              <label className="visibility-label">Website<input name="domain" placeholder="yourbusiness.com" inputMode="url" autoComplete="url" maxLength={253} required /></label>
              <label className="visibility-label">Business name<input name="business" placeholder="Your Business" autoComplete="organization" minLength={2} maxLength={100} required /></label>
              <label className="visibility-label">What customers look for<input name="category" placeholder="e.g. landscape design in Portland" minLength={3} maxLength={100} required /></label>
              {available && siteKey && phase !== 'running' && <div className="min-w-0">
                <p className="visibility-kicker mb-2" role="status"><ShieldCheck size={15} aria-hidden="true" />
                  {token ? 'Verified. You can enter your email.'
                    : verification === 'error' ? 'Verification could not load.'
                    : verification === 'interactive' ? 'Complete the verification below.'
                    : 'Loading verification…'}
                </p>
                <VisibilityTurnstile key={widgetKey} siteKey={siteKey} onToken={receiveToken} onInteractive={verificationInteractive} onError={verificationError} />
                {verification === 'error' && <button className="visibility-example" type="button" onClick={() => {
                  setVerification('loading');
                  setWidgetKey((value) => value + 1);
                }}>Retry verification</button>}
              </div>}
              <label className="visibility-label">Email<input name="email" type="email" autoComplete="email" placeholder="you@yourbusiness.com" defaultValue={ownerAudit ? ownerEmail : undefined} disabled={!token} maxLength={254} required /></label>
              {emailAvailable && <label className="flex min-h-11 items-center gap-2 text-sm text-slate-200">
                <input type="checkbox" name="emailReport" className="size-4 accent-cyan-200" disabled={!token} /> Email me a copy of my report
              </label>}
              <button type="submit" className="visibility-submit" disabled={!token || !available || recoverable || phase === 'running'}>{phase === 'running' ? 'Running your audit…' : 'Run my free audit'} <ArrowRight size={18} aria-hidden="true" /></button>
            </fieldset>
            <p className="mt-3 text-xs leading-5 text-slate-300">Run one free audit per email without an account. Your report appears here. Sweetwater stores your submission and audit result.</p>
            {!available && <p className="mt-3 text-sm text-cyan-200">Live audits are offline. You can still explore the example report.</p>}
            {error && <p className="mt-3 text-sm text-rose-200" role="alert">{error}</p>}
            {recoverable && <button type="button" className="visibility-example" disabled={phase === 'running'} onClick={() => void runAudit({ operation: 'recover' })}>Check for my report</button>}
          </form>
        </section>
      </div>}

      {phase === 'running' && <section className="visibility-report visibility-running" ref={progressPanel} tabIndex={-1} aria-labelledby="audit-running-title">
        <div className="visibility-overview">
          <div className="visibility-chapter-copy" role="status">
            <p className="visibility-kicker"><span className="visibility-beacon" /> Audit running</p>
            <h1 id="audit-running-title">{recoverable ? 'Looking up your report.' : <>Asking AI about <em>{auditDomain}</em></>}</h1>
            <p>{recoverable ? 'We’ll show the report as soon as it’s available.' : 'Three buyer questions go to each model. Keep this tab open and your report will appear here when it’s ready.'}</p>
          </div>
          <div className="visibility-running-signal">
            <p className="visibility-kicker">{recoverable ? 'Checking report status' : 'Model comparison in progress'}</p>
            <SignalGrid scanning />
          </div>
        </div>
        {!recoverable && <ol className="visibility-run-steps" aria-label="Audit stages">
          <li><Check aria-hidden="true" size={20} /> <span>Questions ready</span></li>
          <li aria-current="step"><MessageSquare aria-hidden="true" size={20} /> <span>Collecting answers</span></li>
          <li><FileText aria-hidden="true" size={20} /> <span>Preparing report</span></li>
        </ol>}
      </section>}
      {(report || showSample) && <section className="visibility-report" tabIndex={-1} ref={resultPanel} aria-label="Visibility report">
        {report && (emailDelivery || ownerAudit) && <div className="visibility-report-actions">
          {emailDelivery === 'accepted' && <p className="text-sm text-cyan-200">Your email copy is on its way.</p>}
          {emailDelivery === 'unavailable' && <p className="text-sm text-amber-200">We couldn’t confirm email delivery. You can save a copy below.</p>}
          {ownerAudit && <button type="button" className="visibility-example" onClick={() => {
            setReport(undefined);
            setEmailDelivery(undefined);
            setPhase('ready');
          }}>Run another test</button>}
        </div>}
        <VisibilityAuditReport report={report ?? sample} example={!report} />
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
