import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowUpRight, Check, Compass, LogOut, Plus, RefreshCw, Search, ShieldCheck, X } from 'lucide-react';
import { SweetwaterLogo } from '../../components/SweetwaterLogo';
import * as api from './api';
import { editableProspect, newProspect, opportunityScore, revenueBands, safeWebsite, splitSearch, statuses } from './model';
import type { Activity, Candidate, Prospect, ProspectDraft } from './model';
import './signalscout.css';

const revenueLabels = ['Unverified', 'Under $5M', '$5M–$10M', '$10M–$20M', '$20M–$50M', 'Above $50M'];
export default function SignalScout({ onBack, onSignOut, dataSource = api }: { onBack: () => void; onSignOut: () => void; dataSource?: typeof api }) {
  const [items, setItems] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [view, setView] = useState<'queue' | 'search'>('queue');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('active');
  const [editing, setEditing] = useState<{ id: string; item: ProspectDraft; revision?: number } | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  async function refresh() {
    setLoading(true); setError('');
    try { setItems(await dataSource.listProspects()); } catch (e) { setError((e as Error).message); } finally { setLoading(false); }
  }
  useEffect(() => {
    let active = true;
    void dataSource.listProspects().then(data => { if (active) setItems(data); }).catch(e => { if (active) setError(e.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [dataSource]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener('beforeunload', warn); return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  function leave(action: () => void) { if (!saving && (!dirty || window.confirm('Leave without saving your prospect changes?'))) { setDirty(false); action(); } }
  function open(item?: Prospect | Candidate) {
    setMessage(''); setError(''); setDirty(false);
    setEditing({ id: item && 'id' in item ? item.id : crypto.randomUUID(), item: item ? editableProspect(item) : newProspect(), revision: item && 'revision' in item ? item.revision : undefined });
  }
  async function save(draft: ProspectDraft) {
    if (!editing || saving) return;
    setSaving(true); setError(''); setMessage('');
    try {
      const saved = await dataSource.saveProspect(draft, editing.id, editing.revision);
      setItems(current => [saved, ...current.filter(p => p.id !== saved.id)]);
      setEditing({ id: saved.id, revision: saved.revision, item: editableProspect(saved) });
      setDirty(false); setMessage('Prospect saved for both team members.');
    } catch (e) { setError((e as Error).message); } finally { setSaving(false); }
  }
  const visible = items.filter(p => (status === 'all' || (status === 'active' ? p.status !== 'archived' : p.status === status)) && `${p.name} ${p.location} ${p.owner} ${p.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => opportunityScore(b) - opportunityScore(a) || a.name.localeCompare(b.name));
  return <div className="signal-scout">
    <header className="sc-header"><SweetwaterLogo /><nav aria-label="Workspace navigation"><button disabled={saving} onClick={() => leave(onBack)}><ArrowLeft size={16} /> Workspace</button><button disabled={saving} onClick={() => leave(onSignOut)}><LogOut size={16} /> Sign out</button></nav></header>
    <main className="sc-main">
      <div className="sc-heading"><div><p className="sc-eyebrow"><Compass size={15} /> SWEETWATER · SIGNALSCOUT</p><h1>Find the next good conversation.</h1><p>Discover local businesses, review the evidence, and move opportunities forward together.</p></div><span className="sc-private"><ShieldCheck size={16} /> Shared with Clint & Sheree</span></div>
      <div className="sc-tabs"><button aria-pressed={view === 'queue'} onClick={() => leave(() => { setEditing(null); setView('queue'); })}>Prospect queue <span>{items.filter(p => p.status !== 'archived').length}</span></button><button aria-pressed={view === 'search'} onClick={() => leave(() => { setEditing(null); setView('search'); })}>Territory search</button><button className="sc-primary" onClick={() => leave(() => open())}><Plus size={16} /> Add a prospect</button></div>
      {error && <div className="sc-error" role="alert">{error}</div>}{message && <div className="sc-notice" role="status"><Check size={17} /> {message}</div>}
      {editing ? <ProspectEditor dataSource={dataSource} key={editing.id} initial={editing.item} id={editing.revision === undefined ? undefined : editing.id} revision={editing.revision} busy={saving} onDirty={setDirty} onSave={save} onClose={() => leave(() => setEditing(null))} /> : view === 'search' ? <TerritorySearch dataSource={dataSource} onSelect={open} savedPlaceIds={new Set(items.flatMap(p => p.place_id ? [p.place_id] : []))} /> : <>
        <section className="sc-stats" aria-label="Pipeline summary">{[['Active prospects', items.filter(p => p.status !== 'archived').length], ['Priority conversations', items.filter(p => p.status === 'priority').length], ['Contacted', items.filter(p => p.status === 'contacted').length]].map(([label, value]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</section>
        <div className="sc-toolbar"><label>Find a prospect<input type="search" placeholder="Business, location, owner or tag" value={query} onChange={e => setQuery(e.target.value)} /></label><label>Status<select value={status} onChange={e => setStatus(e.target.value)}><option value="active">Active prospects</option><option value="all">All prospects</option>{statuses.map(s => <option key={s}>{s}</option>)}</select></label><button disabled={loading} onClick={() => void refresh()}><RefreshCw size={16} /> Refresh</button></div>
        {loading ? <p role="status">Loading shared prospects…</p> : !error && !visible.length ? <div className="sc-empty"><Compass size={36} /><h2>{items.length ? 'No matching prospects.' : 'Your next opportunity starts here.'}</h2><p>{items.length ? 'Try another status or search term.' : 'Add a business you know, or search a territory once Google Places is connected.'}</p><button onClick={() => open()} className="sc-primary">Add a prospect</button></div> : <div className="sc-list">{visible.map(item => <button className="sc-row" key={item.id} onClick={() => open(item)}><span className="sc-score">{item.score || item.score_adjustment ? opportunityScore(item) : '—'}<small>{item.score || item.score_adjustment ? '/ 100' : 'unscored'}</small></span><span className="sc-business"><strong>{item.name}</strong><span>{[item.category, item.location].filter(Boolean).join(' · ') || 'Details to be confirmed'}</span><small>{item.next_action || 'Set the next action'}</small></span><span className="sc-owner">{item.owner}</span><span className={`sc-badge sc-${item.status}`}>{item.status}</span><ArrowUpRight size={17} /></button>)}</div>}
        {items.length >= 1000 && <p role="status">Showing the 1,000 most recently updated prospects.</p>}
      </>}
    </main>
  </div>;
}

function ProspectEditor({ dataSource, initial, id, revision, busy, onDirty, onSave, onClose }: { dataSource: typeof api; initial: ProspectDraft; id?: string; revision?: number; busy: boolean; onDirty: (dirty: boolean) => void; onSave: (draft: ProspectDraft) => Promise<void>; onClose: () => void }) {
  const [draft, setDraft] = useState(initial);
  const [history, setHistory] = useState<Activity[]>([]);
  const [historyError, setHistoryError] = useState('');
  useEffect(() => {
    if (!id) return;
    let active = true;
    void dataSource.listActivity(id).then(data => { if (active) { setHistory(data); setHistoryError(''); } }).catch(e => { if (active) setHistoryError(e.message); });
    return () => { active = false; };
  }, [id, revision, dataSource]);
  function change<K extends keyof ProspectDraft>(key: K, value: ProspectDraft[K]) { setDraft(d => ({ ...d, [key]: value })); onDirty(true); }
  const textField = (key: 'name' | 'address' | 'website' | 'phone' | 'category' | 'location' | 'next_action', label: string, max: number) => <label>{label}<input required={key === 'name'} maxLength={max} type={key === 'website' ? 'url' : 'text'} value={draft[key]} onChange={e => change(key, e.target.value)} /></label>;
  return <section className="sc-editor"><div className="sc-editor-title"><div><p className="sc-eyebrow">{id ? 'SHARED PROSPECT' : 'NEW PROSPECT'}</p><h2>{initial.name || 'Add a business'}</h2></div><button onClick={onClose} disabled={busy}><X size={17} /> Close</button></div>
    <form onSubmit={e => { e.preventDefault(); void onSave(draft); }}><fieldset disabled={busy}><div className="sc-fields">
      {textField('name', 'Business name', 320)}{textField('category', 'Business category', 255)}{textField('location', 'City / territory', 320)}{textField('address', 'Address', 1000)}{textField('website', 'Website (https://…)', 2048)}{textField('phone', 'Phone', 96)}
      <label>Status<select value={draft.status} onChange={e => change('status', e.target.value as ProspectDraft['status'])}>{statuses.map(s => <option key={s}>{s}</option>)}</select></label>
      <label>Next-step owner<select value={draft.owner} onChange={e => change('owner', e.target.value)}>{[...new Set(['Unassigned', 'Clint', 'Sheree', draft.owner])].map(s => <option key={s}>{s}</option>)}</select></label>
      {textField('next_action', 'Next action', 600)}<label>Tags (comma separated)<input maxLength={395} value={draft.tags.join(', ')} onChange={e => change('tags', e.target.value.split(',').map(t => t.trimStart()))} onBlur={() => change('tags', draft.tags.map(t => t.trim()).filter(Boolean))} /></label>
      <label>Verified revenue band<select value={draft.revenue_band} onChange={e => change('revenue_band', e.target.value as ProspectDraft['revenue_band'])}>{revenueBands.map((r, i) => <option value={r} key={r}>{revenueLabels[i]}</option>)}</select></label>
      <label>Score adjustment (−30 to +30)<input type="number" min={-30} max={30} step={1} value={draft.score_adjustment} onChange={e => change('score_adjustment', Number(e.target.value))} /></label>
      <label className="sc-wide">Working notes<textarea rows={5} maxLength={6000} value={draft.notes} onChange={e => change('notes', e.target.value)} /></label>
    </div><div className="sc-save"><span>Saved changes are shared. Archiving keeps the record and history.</span><button className="sc-primary" type="submit">{busy ? 'Saving…' : 'Save prospect'}<Check size={17} /></button></div></fieldset></form>
    <section className="sc-evidence"><h3>Evidence & conversation cues</h3>{draft.place_id && <p>Directory details from Google Places · <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(draft.name)}&query_place_id=${encodeURIComponent(draft.place_id)}`} target="_blank" rel="noreferrer">View on Google Maps</a></p>}{draft.attributions.map((a,i) => <small key={i}>{safeWebsite(a.uri || '') ? <a href={safeWebsite(a.uri!)!} target="_blank" rel="noreferrer">{a.displayName}</a> : a.displayName}</small>)}<p>{draft.assessment.summary || 'No automated assessment yet. Add your observations in the working notes.'}</p>{draft.assessment.confidence && <p>Confidence: {draft.assessment.confidence} · {draft.assessment.scanned ? 'Website checked' : 'Website not scanned'}</p>}{draft.assessment.companyFit && <p><strong>{draft.assessment.companyFit.label}.</strong> {draft.assessment.companyFit.detail}</p>}{draft.evidence.map((ev, i) => <article key={i}><strong>{ev.label}</strong><p>{ev.detail}</p><small>{ev.source}</small></article>)}{draft.assessment.engagements?.length ? <ul>{draft.assessment.engagements.map(text => <li key={text}>{text}</li>)}</ul> : null}{draft.assessment.outreachAngle && <blockquote>{draft.assessment.outreachAngle}</blockquote>}{draft.website && safeWebsite(draft.website) && <a href={safeWebsite(draft.website)!} target="_blank" rel="noreferrer">Review the business website <ArrowUpRight size={14} /></a>}</section>
    {id && <section className="sc-evidence"><h3>Review history</h3>{historyError && <p role="alert">{historyError}</p>}{history.map(event => <details key={event.id}><summary>{new Date(event.occurred_at).toLocaleString()} · {event.action === 'INSERT' ? 'Prospect added' : `Updated ${event.changed_fields.join(', ')}`}</summary>{event.previous_assessment ? <p>Previous assessment: {event.previous_assessment.summary || 'No assessment'}</p> : <p>No previous assessment.</p>}</details>)}</section>}
  </section>;
}

function TerritorySearch({ dataSource, onSelect, savedPlaceIds }: { dataSource: typeof api; onSelect: (item: Candidate) => void; savedPlaceIds: Set<string> }) {
  const [ready, setReady] = useState<boolean | null>(null);
  const [locations, setLocations] = useState('');
  const [categories, setCategories] = useState('');
  const [requireWebsite, setRequireWebsite] = useState(true);
  const [excludeLargeCompanies, setExcludeLargeCompanies] = useState(true);
  const [minRating, setMinRating] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<Candidate[] | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  useEffect(() => { let active = true; void dataSource.searchStatus().then(data => { if (active) setReady(data.ready); }).catch(() => { if (active) { setReady(false); setError('Directory search is not available yet. The shared queue and manual entry remain available.'); } }); return () => { active = false; }; }, [dataSource]);
  async function search() {
    if (busy || !ready) return;
    const input = splitSearch(locations, categories);
    if (!input.locations.length || !input.categories.length || input.locations.length > 4 || input.categories.length > 4 || input.locations.length * input.categories.length > 8) { setError('Enter 1–4 locations and categories, with at most 8 combinations. Separate locations with semicolons.'); return; }
    setBusy(true); setError(''); setResults(null); setWarnings([]);
    try { const result = await dataSource.searchBusinesses({ ...input, requireWebsite, minRating, excludeLargeCompanies }); setResults(result.candidates); setWarnings(result.warnings); } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  }
  return <section className="sc-search"><h2>Choose your next territory.</h2><p>Find business-directory signals, then verify the fit before outreach. Search results are not saved until you review and save a prospect.</p>{ready === null ? <p role="status">Checking directory connection…</p> : !ready && <div className="sc-notice">Google Places setup is pending. You can add prospects manually while the new key is configured.</div>}
    <form onSubmit={e => { e.preventDefault(); void search(); }}><fieldset disabled={busy}><div className="sc-fields"><label>Locations (separate with semicolons)<input required maxLength={800} placeholder="Atlanta, GA; Nashville, TN" value={locations} onChange={e => setLocations(e.target.value)} /></label><label>Business categories<input required maxLength={400} placeholder="Home services, specialty retail" value={categories} onChange={e => setCategories(e.target.value)} /></label><label>Minimum Google rating<select value={minRating} onChange={e => setMinRating(Number(e.target.value))}>{[0, 3, 3.5, 4, 4.5].map(n => <option value={n} key={n}>{n || 'Any rating'}</option>)}</select></label><div className="sc-checks"><label><input type="checkbox" checked={requireWebsite} onChange={e => setRequireWebsite(e.target.checked)} /> Require a website</label><label><input type="checkbox" checked={excludeLargeCompanies} onChange={e => setExcludeLargeCompanies(e.target.checked)} /> Exclude recognized national / franchise brands</label></div></div><button className="sc-primary" disabled={!ready || busy}><Search size={16} /> {busy ? 'Searching…' : 'Search businesses'}</button></fieldset></form>
    {error && <p role="alert" className="sc-error">{error}</p>}{warnings.map(w => <p role="status" key={w} className="sc-notice">{w}</p>)}{results && <p role="status">{results.length} candidates found · Powered by Google</p>}{results?.length === 0 && <p>No businesses matched these filters. Try a different category or territory.</p>}
    <div className="sc-results">{results?.map(item => <article key={item.place_id}><span className="sc-badge">{item.assessment.companyFit?.label || 'Review fit'}</span><h3>{item.name}</h3><p>{item.address}</p><p>{item.category} · {item.rating === null ? 'Unrated' : `${item.rating} / 5`}</p><p>{item.assessment.summary}</p><div><a href={safeWebsite(item.maps_url) || 'https://maps.google.com'} target="_blank" rel="noreferrer">View on Google Maps <ArrowUpRight size={14} /></a><button className="sc-primary" disabled={savedPlaceIds.has(item.place_id!)} onClick={() => onSelect(item)}>{savedPlaceIds.has(item.place_id!) ? 'Already saved' : 'Review & add'}</button></div>{item.attributions.map((a, i) => <small key={i}>{safeWebsite(a.uri || '') ? <a href={safeWebsite(a.uri!)!} target="_blank" rel="noreferrer">{a.displayName}</a> : a.displayName}</small>)}</article>)}</div>
  </section>;
}
