import { lazy, Suspense, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowLeft, ArrowUpRight, Check, ChevronRight, Clock3, FileText, LayoutDashboard, LockKeyhole, LogOut, Plus, Search, ShieldCheck, Waves } from 'lucide-react';
import { SweetwaterLogo } from '../components/SweetwaterLogo';
import { portalClient, portalSignInReady } from './client';
import { deliveryEconomics, editableEngagement, newEngagement, stages, validateEngagement } from './model';
import type { Engagement } from './model';
import './portal.css';
import SavedDiscovery from './SavedDiscovery';

const SignalScout = lazy(() => import('./signalscout/SignalScout'));

const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
type Draft = Omit<Engagement, 'id' | 'updated_at'>;

export default function Portal() {
  const [access, setAccess] = useState<'loading' | 'login' | 'denied' | 'mfa' | 'member'>(portalClient ? 'loading' : 'login');
  const [identity, setIdentity] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [items, setItems] = useState<Engagement[]>([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [editing, setEditing] = useState<Engagement | 'new' | null>(null);
  const [showRecords, setShowRecords] = useState(false);
  const [showScout, setShowScout] = useState(false);

  useEffect(() => {
    document.title = 'Private workspace | Sweetwater Technology';
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.appendChild(robots); }
    robots.content = 'noindex, nofollow';
    if (!portalClient) return;
    const client = portalClient;
    let active = true;
    let generation = 0;
    async function check() {
      const current = ++generation;
      const { data: { user }, error } = await client.auth.getUser();
      if (!active || current !== generation) return;
      setItems([]); setEditing(null);
      if (error || !user) { setAccess('login'); return; }
      const membership = await client.from('sw_portal_members').select('user_id, display_name').eq('user_id', user.id).eq('active', true).maybeSingle();
      if (!active || current !== generation) return;
      if (membership.error || !membership.data) { setAccess('denied'); return; }
      setIdentity(membership.data.display_name || user.email || 'Team member');
      const assurance = await client.auth.mfa.getAuthenticatorAssuranceLevel();
      if (!active || current !== generation) return;
      if (assurance.error) { setAccess('denied'); return; }
      if (assurance.data.currentLevel !== 'aal2') { setAccess('mfa'); return; }
      const result = await client.from('sw_portal_engagements').select('*').order('updated_at', { ascending: false });
      if (!active || current !== generation) return;
      if (result.error) { setAccess('denied'); setMessage('The workspace could not be loaded. Please check access and try again.'); return; }
      setItems(result.data as Engagement[]); setAccess('member');
    }
    const verify = () => { void check().catch(() => { if (active) { setItems([]); setEditing(null); setAccess('denied'); setMessage('Unable to verify access. Check your connection and reload.'); } }); };
    verify();
    const { data: { subscription } } = client.auth.onAuthStateChange((event) => { if (event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') return; window.setTimeout(() => { if (active) verify(); }, 0); });
    return () => { active = false; generation++; subscription.unsubscribe(); };
  }, []);

  async function signIn(event: FormEvent) {
    event.preventDefault();
    if (!portalClient || !portalSignInReady || busy) return;
    setBusy(true); setMessage('');
    try {
      const { error } = await portalClient.auth.signInWithOtp({ email: email.trim(), options: { shouldCreateUser: false, emailRedirectTo: `${window.location.origin}/portal` } });
      setMessage(error ? 'Unable to send a sign-in link. Check the address or try again later.' : 'If this address has access, a sign-in link is on its way. Open it in this browser.');
    } catch { setMessage('Unable to connect. Please try again.'); }
    finally { setBusy(false); }
  }

  async function signOut() {
    setItems([]); setEditing(null); setAccess('login'); setMessage('');
    try {
      const result = await portalClient?.auth.signOut();
      if (result?.error) setMessage('Sign-out could not be confirmed. Close this browser and try again when connected.');
    } catch { setMessage('Sign-out could not be confirmed. Close this browser and try again when connected.'); }
  }

  async function save(draft: Draft) {
    if (!portalClient || access !== 'member' || busy) return;
    const problem = validateEngagement(draft);
    if (problem) { setMessage(problem); return; }
    setBusy(true); setMessage('');
    try {
      // Optimistic concurrency: never silently overwrite the other person's edit.
      const values = editableEngagement(draft);
      const operation = editing && editing !== 'new'
        ? portalClient.from('sw_portal_engagements').update(values).eq('id', editing.id).eq('updated_at', editing.updated_at)
        : portalClient.from('sw_portal_engagements').insert(values);
      const { data, error } = await operation.select().single();
      if (error || !data) throw new Error('Save failed. Access may have changed, or this engagement was edited elsewhere. Reload before retrying.');
      setItems(current => [data as Engagement, ...current.filter(item => item.id !== data.id)]);
      setEditing(null); setMessage('Engagement saved.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to save. Your draft is still open.'); }
    finally { setBusy(false); }
  }

  const visible = items.filter(item => (filter === 'All' || item.stage === filter) && `${item.client} ${item.workflow}`.toLowerCase().includes(query.toLowerCase()));
  const activeItems = items.filter(item => item.stage !== 'Closed');
  const today = new Date().toLocaleDateString('en-CA');
  const overdue = activeItems.filter(item => item.due_date && item.due_date < today);

  if (access === 'member' && showScout) return <Suspense fallback={<main role="status">Loading SignalScout…</main>}><SignalScout onBack={() => setShowScout(false)} onSignOut={() => void signOut()} /></Suspense>;

  if (access === 'member' && !showRecords) return <SavedDiscovery onScout={() => setShowScout(true)} onSignOut={() => void signOut()} onRecords={() => setShowRecords(true)} onChanged={item => setItems(current => [item, ...current.filter(other => other.id !== item.id)])} />;

  return <div className="sw-portal">
    {access !== 'member' ? <>
      <header className="portal-public-header"><a href="/" aria-label="Sweetwater Technology home"><SweetwaterLogo /></a><a href="/" className="quiet-link"><ArrowLeft size={16} /> Back to the website</a></header>
      <main className="login-layout">
        <section className="login-story"><div className="eyebrow"><span className="live-dot" /> SWEETWATER WORKSPACE</div><h1>Good work.<br /><span>Clear next steps.</span></h1><p>One place to move client work forward—from the first conversation to a confident handoff.</p><div className="login-steps">{['Understand the work', 'Agree the next step', 'Deliver with care'].map((text, index) => <div key={text}><span>0{index + 1}</span>{text}<ChevronRight size={18} /></div>)}</div><div className="wave-art" aria-hidden="true"><Waves size={180} strokeWidth={0.6} /></div></section>
        <section className="login-card" aria-labelledby="login-title"><div className="icon-tile"><LockKeyhole size={24} /></div><p className="eyebrow">SECURE WORKSPACE ACCESS</p><h2 id="login-title">Client Login.</h2><p>Sign in to your Sweetwater workspace.</p>
          {access === 'loading' ? <p role="status">Checking your access…</p> : access === 'mfa' ? <MfaGate onSignOut={signOut} /> : access === 'denied' ? <><div className="notice">This account does not have workspace access, or access could not be verified.</div><button className="primary" onClick={signOut}>Use another account</button></> : <form onSubmit={signIn}><label htmlFor="portal-email">Email address</label><input id="portal-email" type="email" autoComplete="email" placeholder="you@sweetwater.technology" required value={email} onChange={event => setEmail(event.target.value)} disabled={!portalSignInReady || busy} /><button className="primary" disabled={!portalSignInReady || busy}>{busy ? 'Sending…' : 'Email me a sign-in link'}<ArrowUpRight size={18} /></button><p className="small">Use the email approved for your workspace. No shared passwords.</p></form>}
          {!portalSignInReady && <div className="notice">Team sign-in is being configured. This workspace is not open yet.</div>}
          {message && <p className="notice" role="status">{message}</p>}<div className="secure-note"><ShieldCheck size={17} /> For authorized Sweetwater team members.</div>
        </section>
      </main><footer className="login-footer">SWEETWATER TECHNOLOGY <span>Thoughtful systems. Practical progress.</span></footer>
    </> : <div className="workspace-layout">
      <aside className="portal-sidebar"><a href="/" aria-label="Sweetwater Technology home"><SweetwaterLogo /></a><p className="eyebrow">CLIENT DELIVERY</p><button className="nav-active" onClick={() => { setEditing(null); setFilter('All'); }}><LayoutDashboard size={18} /> Engagements</button><a href="/" className="quiet-link"><ArrowUpRight size={18} /> Public website</a><div className="sidebar-bottom"><ShieldCheck size={18} /><p>Private workspace<br /><strong>{identity}</strong></p><button aria-label="Sign out" onClick={signOut}><LogOut size={18} /></button></div></aside>
      <main className="workspace-main"><div className="workspace-top"><button className="quiet-link" onClick={() => setShowRecords(false)}><ArrowLeft size={14} /> Back to guided discovery</button><button className="quiet-link" onClick={() => setShowScout(true)}>SignalScout · Prospect queue</button><span className="team-badge">Sweetwater team</span></div>
        <header className="workspace-heading"><div><p className="eyebrow">KEEP THE WORK MOVING</p><h1>{editing ? editing === 'new' ? 'A new engagement.' : editing.client : 'Every engagement. One view.'}</h1><p>{editing ? 'Keep the scope clear and the next step useful.' : 'The people, decisions, and details behind good delivery.'}</p></div>{!editing && <button className="primary" onClick={() => { setMessage(''); setEditing('new'); }}><Plus size={18} /> New engagement</button>}</header>
        {message && <div className="notice" role="status">{message}</div>}
        {editing ? <EngagementEditor key={editing === 'new' ? 'new' : editing.id} item={editing === 'new' ? newEngagement() : editing} onSave={save} onCancel={() => { setEditing(null); setMessage(''); }} busy={busy} /> : <>
          <section className="stats-row" aria-label="Engagement overview"><Stat label="ACTIVE ENGAGEMENTS" value={activeItems.length} note="From conversation to handoff" icon={<LayoutDashboard size={19} />} /><Stat label="NEEDS ATTENTION" value={overdue.length} note="Next steps past their due date" icon={<Clock3 size={19} />} /><Stat label="IN ASSESSMENT" value={items.filter(item => item.stage === 'Assessment').length} note="Understanding the work" icon={<FileText size={19} />} /></section>
          <section className="engagement-panel"><div className="panel-heading"><div><h2>Your engagements</h2><p>Clear ownership. A visible next step.</p></div><label className="search-field"><Search size={17} /><input aria-label="Search engagements" placeholder="Search clients or workflows" value={query} onChange={event => setQuery(event.target.value)} /></label></div><div className="filter-row" aria-label="Filter by stage">{['All', ...stages].map(stage => <button key={stage} aria-pressed={filter === stage} className={filter === stage ? 'selected' : ''} onClick={() => setFilter(stage)}>{stage}</button>)}</div>
          {!visible.length ? <div className="empty-state"><div className="icon-tile"><Waves size={26} /></div><h3>{items.length ? 'No matching engagements.' : 'Start with a conversation.'}</h3><p>{items.length ? 'Try another search or stage.' : 'Add your first client and the workflow you want to understand. The next step starts here.'}</p>{!items.length && <button className="secondary" onClick={() => setEditing('new')}><Plus size={17} /> Add your first engagement</button>}</div> : <div className="engagement-list">{visible.map(item => <button className="engagement-row" key={item.id} onClick={() => { setMessage(''); setEditing(item); }}><span className="client-avatar">{item.client.slice(0, 2).toUpperCase()}</span><span className="engagement-title"><strong>{item.client}</strong><span>{item.workflow}</span></span><span className="stage-pill">{item.stage}</span><span className="next-step"><strong>{item.next_step || 'Set the next step'}</strong><span>{item.owner || 'Assign an owner'}{item.due_date ? ` · ${item.due_date}` : ''}</span></span><ChevronRight size={18} /></button>)}</div>}</section>
          <div className="workspace-note"><Check size={18} /><p><strong>A useful decision is a good outcome.</strong> A client can finish after findings. Implementation is always a separate agreement.</p></div>
        </>}
      </main></div>}
  </div>;
}

function Stat({ label, value, note, icon }: { label: string; value: number; note: string; icon: React.ReactNode }) { return <article className="stat"><div><p className="eyebrow">{label}</p>{icon}</div><strong>{String(value).padStart(2, '0')}</strong><p>{note}</p></article>; }

function MfaGate({ onSignOut }: { onSignOut: () => void }) {
  const [factor, setFactor] = useState('');
  const [qr, setQr] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    void portalClient!.auth.mfa.listFactors().then(result => {
      if (!active) return;
      if (result.error) setError('Could not load your authenticator. Reload to try again.');
      else setFactor(result.data.totp.find(item => item.status === 'verified')?.id || '');
      setBusy(false);
    }).catch(() => { if (active) { setError('Could not load your authenticator. Reload to try again.'); setBusy(false); } });
    return () => { active = false; };
  }, []);
  async function enroll() {
    setBusy(true); setError('');
    try {
      const result = await portalClient!.auth.mfa.enroll({ factorType: 'totp', friendlyName: `Sweetwater workspace ${Date.now()}` });
      if (result.error) throw result.error;
      setFactor(result.data.id);
      const source = result.data.totp.qr_code;
      setQr(source.startsWith('data:image/svg+xml') ? source : `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`);
    } catch { setError('Authenticator setup could not start. Please try again or contact your administrator.'); }
    finally { setBusy(false); }
  }
  async function verify(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const result = await portalClient!.auth.mfa.challengeAndVerify({ factorId: factor, code });
      if (result.error) throw result.error;
      window.location.reload();
    } catch { setError('That code could not be verified. Enter the current code and try again.'); setBusy(false); }
  }
  return <div><p className="small">An authenticator code protects access to client work.</p>{qr && <><p className="small">Scan this code in your authenticator app, then enter its six-digit code.</p><img src={qr} alt="Authenticator enrollment QR code" width={200} height={200} /></>}{factor ? <form onSubmit={verify}><label htmlFor="mfa-code">Authenticator code</label><input id="mfa-code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required value={code} onChange={event => setCode(event.target.value)} /><button className="primary" disabled={busy}>{busy ? 'Verifying…' : 'Verify and continue'}</button></form> : <button className="primary" disabled={busy || Boolean(error)} onClick={enroll}>{busy ? 'Checking authenticator…' : 'Set up an authenticator'}</button>}{error && <p className="notice" role="alert">{error}</p>}<button className="quiet-link" style={{marginTop:18}} onClick={onSignOut}>Sign out</button></div>;
}

function EngagementEditor({ item, onSave, onCancel, busy }: { item: Draft; onSave: (draft: Draft) => Promise<void>; onCancel: () => void; busy: boolean }) {
  const [draft, setDraft] = useState<Draft>(() => editableEngagement(item));
  const [tab, setTab] = useState('Overview');
  const economics = deliveryEconomics(draft);
  function field(key: keyof Draft, label: string, type = 'text', required = false) { return <label className="form-field" key={key}>{label}<input type={type} required={required} min={type === 'number' ? 0 : undefined} step={type === 'number' ? '0.01' : undefined} maxLength={type === 'text' ? 500 : undefined} value={draft[key]} onChange={event => setDraft(current => ({ ...current, [key]: type === 'number' ? Number(event.target.value) : event.target.value }))} /></label>; }
  function area(key: 'scope' | 'findings' | 'evidence_notes' | 'approval_reference', label: string, hint: string) { return <label className="form-field full">{label}<span className="field-hint">{hint}</span><textarea maxLength={20000} rows={10} value={draft[key]} onChange={event => setDraft(current => ({ ...current, [key]: event.target.value }))} /></label>; }
  return <form className="editor-panel" onSubmit={event => { event.preventDefault(); void onSave(draft); }}><div className="filter-row">{['Overview', 'Proposal', 'Evidence', 'Findings', 'Pricing'].map(name => <button type="button" key={name} className={tab === name ? 'selected' : ''} aria-pressed={tab === name} onClick={() => setTab(name)}>{name}</button>)}</div><div className="editor-fields">
    {tab === 'Overview' && <>{field('client', 'Client / organization', 'text', true)}{field('workflow', 'Workflow to improve', 'text', true)}<label className="form-field">Delivery track<select value={draft.track} onChange={event => setDraft({ ...draft, track: event.target.value as Draft['track'] })}><option>Lite</option><option>Full</option></select><span className="field-hint">Lite: intake, one-page terms, findings. Full: larger engagements.</span></label><label className="form-field">Current stage<select value={draft.stage} onChange={event => setDraft({ ...draft, stage: event.target.value as Draft['stage'] })}>{stages.map(stage => <option key={stage}>{stage}</option>)}</select><span className="field-hint">Tracking a stage does not grant client approval.</span></label>{field('owner', 'Engagement owner')}{field('next_step', 'Next step')}{field('due_date', 'Next step due', 'date')}{field('retention_date', 'Agreed evidence delete date', 'date')}{area('approval_reference', 'Approval record', 'Record the client approver, approved document version, date, scope, and link to written approval. Internal edits are not client sign-off.')}</>}
    {tab === 'Proposal' && area('scope', 'Assessment proposal', 'Decision to enable · workflow boundaries · sessions and evidence limits · deliverables · fee and payment terms · responsibilities · exclusions. Implementation is agreed separately.')}
    {tab === 'Evidence' && <>{area('evidence_notes', 'Source register', 'For each item: source, date, approved storage reference, measured / reported / estimate / assumption, and limitations. Do not paste sensitive records or credentials.')}<div className="notice full">File uploads and automatic deletion are not connected yet. Use approved storage and record its reference here.</div></>}
    {tab === 'Findings' && area('findings', 'Findings and recommendation', 'Decision addressed · current workflow and baseline · options · recommendation · readiness and gaps · next decision. Separate measured facts from assumptions and capacity from cash savings.')}
    {tab === 'Pricing' && <><p className="full field-hint">Internal planning only. All amounts in USD. Zero is an unpriced starting point, not an approved offer.</p>{field('estimated_hours', 'Budgeted hours', 'number')}{field('actual_hours', 'Actual hours', 'number')}{field('hourly_cost', 'Internal hourly cost', 'number')}{field('direct_cost', 'Direct costs', 'number')}{field('risk_allowance', 'Specific risk allowance', 'number')}{field('fee', 'Proposed fee', 'number')}<div className="pricing-result full"><span>Estimated cost<strong>{money(economics.cost)}</strong></span><span>Contribution<strong>{money(economics.contribution)}</strong></span><span>Margin<strong>{economics.margin === null ? 'Not priced' : `${(economics.margin * 100).toFixed(1)}%`}</strong></span></div></>}
  </div><div className="editor-actions"><button className="secondary" type="button" onClick={onCancel} disabled={busy}>Cancel</button><button className="primary" disabled={busy}>{busy ? 'Saving…' : 'Save engagement'}<Check size={17} /></button></div></form>;
}
