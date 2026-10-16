import { useEffect, useState } from 'react';
import { SweetwaterLogo } from '../components/SweetwaterLogo';
import { portalClient } from './client';
import { newEngagement } from './model';
import type { Engagement } from './model';
import type { Answers } from './guided-model';
import GuidedWorkspace from './GuidedWorkspace';
import './guided.css';

type SavedClient = Engagement & { discovery_answers?: Answers };
export default function SavedDiscovery({ onRecords, onChanged }: { onRecords: () => void; onChanged: (client: Engagement) => void }) {
  const [clients, setClients] = useState<SavedClient[]>([]);
  const [selected, setSelected] = useState<SavedClient | null>(null);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  async function refresh() {
    setLoading(true); setError('');
    try {
      const result = await portalClient!.from('sw_portal_engagements').select('*').order('updated_at', { ascending: false });
      if (result.error) throw result.error;
      setClients(result.data as SavedClient[]);
    } catch { setError('Could not load saved clients. Check your connection or sign in again.'); }
    finally { setLoading(false); }
  }
  useEffect(() => { void refresh(); }, []);
  async function saveAnswers(answers: Answers) {
    if (!answers.client?.trim()) throw new Error('Add the client’s name before saving.');
    if (answers.client.trim().length > 500) throw new Error('Keep the client name under 500 characters.');
    if (new TextEncoder().encode(JSON.stringify(answers)).length > 90000) throw new Error('These notes are too long. Shorten them before saving.');
    const changes = { client: answers.client.trim(), discovery_answers: answers };
    const result = selected
      ? await portalClient!.from('sw_portal_engagements').update(changes).eq('id', selected.id).eq('updated_at', selected.updated_at).select().maybeSingle()
      : await portalClient!.from('sw_portal_engagements').insert({ ...newEngagement(), ...changes, id: draftId!, workflow: answers.goal || 'Guided discovery' }).select().single();
    if (result.error || !result.data) throw new Error('Save could not be confirmed. Someone may have edited this client, or your connection or access changed. Your answers are still here. Copy any unsaved notes, then return to Saved clients and reopen the latest version.');
    setSelected(result.data as SavedClient);
    onChanged(result.data as SavedClient);
  }
  if (draftId) return <GuidedWorkspace key={draftId} initialAnswers={selected?.discovery_answers && Object.keys(selected.discovery_answers).length ? selected.discovery_answers : selected ? { client: selected.client } : {}} onSave={saveAnswers} onRecords={() => { setDraftId(null); setSelected(null); void refresh(); }} />;
  return <div className="guided"><header className="guide-header"><a href="/" aria-label="Sweetwater Technology home"><SweetwaterLogo /></a><button onClick={onRecords}>Engagement records</button></header><main className="saved-clients"><p className="guide-eyebrow">SHARED WITH CLINT & SHEREE</p><h1>Pick up where you left off.</h1><p>Open a client to continue their guided discovery. Answers are saved when you continue, or when you choose Save progress.</p><div className="saved-toolbar"><label>Find a client<input value={query} onChange={e => setQuery(e.target.value)} type="search" /></label><button className="guide-primary" onClick={() => { setSelected(null); setDraftId(crypto.randomUUID()); }}>Start a new client</button><button onClick={() => void refresh()} disabled={loading}>Refresh</button></div>{loading && <p role="status">Loading saved clients…</p>}{error && <p role="alert">{error}</p>}{!loading && !error && clients.filter(c => c.client.toLowerCase().includes(query.toLowerCase())).map(c => <button className="saved-client" key={c.id} onClick={() => { setSelected(c); setDraftId(c.id); }}><strong>{c.client}</strong><span>{c.discovery_answers?.goal || c.workflow}</span><small>Saved {new Date(c.updated_at).toLocaleString()} · Open walkthrough</small></button>)}{!loading && !error && !clients.length && <p>No clients saved yet. Start with a client’s name.</p>}</main></div>;
}
