import { portalClient } from '../client';
import { editableProspect, safeWebsite, validateProspect } from './model';
import type { Activity, Candidate, Prospect, ProspectDraft, SearchInput } from './model';

function client() { if (!portalClient) throw new Error('The team workspace is not configured.'); return portalClient; }
export async function listProspects(): Promise<Prospect[]> {
  const { data, error } = await client().from('sw_signalscout_prospects').select('*').order('updated_at', { ascending: false }).limit(1000);
  if (error) throw new Error('Could not load prospects. Check your connection and workspace access.');
  return data as Prospect[];
}
export async function saveProspect(draft: ProspectDraft, id: string, revision?: number): Promise<Prospect> {
  const problem = validateProspect(draft); if (problem) throw new Error(problem);
  const values = { ...editableProspect(draft), name: draft.name.trim(), website: safeWebsite(draft.website)!, tags: draft.tags.map(t => t.trim()) };
  const op = revision === undefined
    ? client().from('sw_signalscout_prospects').insert({ ...values, id })
    : client().from('sw_signalscout_prospects').update(values).eq('id', id).eq('revision', revision);
  const { data, error } = await op.select().maybeSingle();
  if (error?.code === '23505') throw new Error('This prospect is already saved. Copy any notes, close the editor and refresh the queue to open the saved version.');
  if (error || !data) throw new Error('Save could not be confirmed. The prospect may have changed, or access was lost. Your draft is still here. Copy your notes, close the editor, refresh, and reopen the latest version.');
  return data as Prospect;
}
export async function listActivity(id: string): Promise<Activity[]> {
  const { data, error } = await client().from('sw_signalscout_activity').select('id,action,changed_fields,occurred_at,previous_assessment').eq('prospect_id', id).order('occurred_at', { ascending: false }).limit(20);
  if (error) throw new Error('Review history could not be loaded.');
  return data as Activity[];
}
async function invoke(body: object) {
  const { data, error } = await client().functions.invoke('sweetwater-signalscout', { body });
  if (error) {
    let message = 'Business search is unavailable. You can still add and update prospects manually.';
    if (error.context instanceof Response) { try { const result = await error.context.json(); if (typeof result.error === 'string') message = result.error; } catch { /* keep a useful fallback */ } }
    throw new Error(message);
  }
  if (data?.error) throw new Error(data.error);
  return data;
}
export async function searchStatus(): Promise<{ ready: boolean }> { return invoke({ action: 'status' }); }
export async function searchBusinesses(input: SearchInput): Promise<{ candidates: Candidate[]; warnings: string[] }> { return invoke({ action: 'search', ...input }); }
