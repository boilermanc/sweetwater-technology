export const statuses = ['new', 'review', 'priority', 'contacted', 'archived'] as const;
export const revenueBands = ['unverified', 'under5', 'fiveTo10', 'tenTo20', 'twentyTo50', 'above50'] as const;
export type Evidence = { label: string; detail: string; type: 'gap' | 'strength' | 'neutral'; source: string };
export type Assessment = { summary?: string; confidence?: string; scanned?: boolean; engagements?: string[]; outreachAngle?: string; companyFit?: { kind: string; label: string; detail: string } };
export type ProspectDraft = {
  name: string; address: string; website: string; phone: string; category: string; location: string;
  place_id: string | null; status: typeof statuses[number]; owner: string; notes: string; next_action: string;
  tags: string[]; score: number; score_adjustment: number; revenue_band: typeof revenueBands[number];
  evidence: Evidence[]; assessment: Assessment; attributions: { displayName?: string; uri?: string }[];
};
export type Prospect = ProspectDraft & { id: string; revision: number; created_at: string; updated_at: string };
export type Activity = { id: string; action: string; changed_fields: string[]; occurred_at: string; previous_assessment: Assessment | null };
export type SearchInput = { locations: string[]; categories: string[]; requireWebsite: boolean; minRating: number; excludeLargeCompanies: boolean };
export type Candidate = ProspectDraft & { rating: number | null; maps_url: string; attributions: { displayName?: string; uri?: string }[] };
export function newProspect(): ProspectDraft {
  return { name: '', address: '', website: '', phone: '', category: '', location: '', place_id: null, status: 'new', owner: 'Unassigned', notes: '', next_action: '', tags: [], score: 0, score_adjustment: 0, revenue_band: 'unverified', evidence: [], assessment: {}, attributions: [] };
}
export function editableProspect(source: ProspectDraft): ProspectDraft {
  return Object.fromEntries(Object.keys(newProspect()).map(key => [key, source[key as keyof ProspectDraft]])) as ProspectDraft;
}
export function safeWebsite(raw: string): string | null {
  if (!raw.trim()) return '';
  try {
    const url = new URL(raw.trim());
    return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}
export function validateProspect(value: ProspectDraft): string | null {
  if (!value.name.trim() || value.name.length > 320) return 'Enter a business name (up to 320 characters).';
  if (safeWebsite(value.website) === null || value.website.length > 2048) return 'Use a full http:// or https:// website address without credentials.';
  if (!statuses.includes(value.status) || !revenueBands.includes(value.revenue_band)) return 'Choose a valid status and revenue band.';
  if (!Number.isInteger(value.score_adjustment) || Math.abs(value.score_adjustment) > 30) return 'Score adjustment must be a whole number from -30 to 30.';
  if (!Number.isInteger(value.score) || value.score < 0 || value.score > 100) return 'Score must be between 0 and 100.';
  if (value.notes.length > 6000 || value.next_action.length > 600 || value.owner.length > 160 || value.phone.length > 96 || value.address.length > 1000 || value.category.length > 255 || value.location.length > 320) return 'One of these fields is too long. Shorten it before saving.';
  if (value.tags.length > 12 || value.tags.some(tag => !tag.trim() || tag.length > 32)) return 'Use up to 12 tags, each 1–32 characters.';
  return null;
}
export function opportunityScore(item: Pick<ProspectDraft, 'score' | 'score_adjustment'>) { return Math.max(0, Math.min(100, item.score + item.score_adjustment)); }
export function splitSearch(locations: string, categories: string): Pick<SearchInput, 'locations' | 'categories'> {
  return { locations: [...new Set(locations.split(/[;\n]/).map(s => s.trim()).filter(Boolean))], categories: [...new Set(categories.split(/[,;\n]/).map(s => s.trim()).filter(Boolean))] };
}
