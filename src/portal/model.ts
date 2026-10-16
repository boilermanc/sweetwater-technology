export const stages = ['Fit', 'Assessment', 'Findings', 'Implementation', 'Acceptance', 'Handoff', 'Support', 'Closed'] as const;
export type Stage = typeof stages[number];
export interface Engagement {
  id: string;
  client: string;
  workflow: string;
  track: 'Lite' | 'Full';
  stage: Stage;
  owner: string;
  next_step: string;
  due_date: string;
  retention_date: string;
  scope: string;
  findings: string;
  evidence_notes: string;
  approval_reference: string;
  estimated_hours: number;
  actual_hours: number;
  hourly_cost: number;
  direct_cost: number;
  risk_allowance: number;
  fee: number;
  updated_at: string;
}
export function deliveryEconomics(item: Pick<Engagement, 'estimated_hours' | 'hourly_cost' | 'direct_cost' | 'risk_allowance' | 'fee'>) {
  const cost = item.estimated_hours * item.hourly_cost + item.direct_cost + item.risk_allowance;
  return { cost, contribution: item.fee - cost, margin: item.fee > 0 ? (item.fee - cost) / item.fee : null };
}
export function newEngagement(): Omit<Engagement, 'id' | 'updated_at'> {
  return { client: '', workflow: '', track: 'Lite', stage: 'Fit', owner: '', next_step: '', due_date: '', retention_date: '', scope: '', findings: '', evidence_notes: '', approval_reference: '', estimated_hours: 0, actual_hours: 0, hourly_cost: 0, direct_cost: 0, risk_allowance: 0, fee: 0 };
}
export function editableEngagement(item: Omit<Engagement, 'id' | 'updated_at'>): Omit<Engagement, 'id' | 'updated_at'> {
  const draft = newEngagement();
  for (const key of Object.keys(draft) as (keyof typeof draft)[]) {
    Object.assign(draft, { [key]: item[key] });
  }
  return draft;
}
export function validateEngagement(item: Omit<Engagement, 'id' | 'updated_at'>): string | null {
  if (!item.client.trim() || !item.workflow.trim()) return 'Add a client and a workflow.';
  if (!stages.includes(item.stage) || !['Lite', 'Full'].includes(item.track)) return 'Choose a valid stage and track.';
  for (const value of [item.estimated_hours, item.actual_hours, item.hourly_cost, item.direct_cost, item.risk_allowance, item.fee]) {
    if (!Number.isFinite(value) || value < 0) return 'Hours and amounts must be finite, non-negative numbers.';
  }
  return null;
}
