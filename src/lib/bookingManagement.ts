export class ManagementError extends Error { retryNew: boolean; constructor(message: string, retryNew = false) { super(message); this.retryNew = retryNew; } }
export type ManagementLink = { bookingId: string; token: string };
export type ManagementRequest = ManagementLink & { action: 'view' | 'cancel' | 'reschedule'; operationId?: string; start?: string; target?: string };
export type ManagedBooking = { ok: true; bookingId: string; status: 'active' | 'cancelled'; start: string; timeZone: string; pending: boolean; operationId?: string };
export function parseManagementLink(hash: string): ManagementLink | null {
  const p = new URLSearchParams(hash.replace(/^#/, ''));
  const bookingId = p.get('id'), token = p.get('token');
  const valid = (v: string | null): v is string => !!v && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
  return valid(bookingId) && valid(token) ? { bookingId: bookingId.toLowerCase(), token: token.toLowerCase() } : null;
}
export async function manageBooking(endpoint: string, request: ManagementRequest): Promise<ManagedBooking> {
  const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(request), cache: 'no-store', referrerPolicy: 'no-referrer', signal: AbortSignal.timeout(60000) });
  const d = await response.json();
  if (!response.ok || d?.ok !== true) throw new ManagementError(d?.retryNew === true && response.status === 409 ? 'That time is no longer available. Choose another time, or keep your current booking.' : 'We could not confirm this request. Retry the same request, or email team@sweetwater.technology for help.', response.status === 409 && d?.retryNew === true);
  if (d.bookingId !== request.bookingId || !['active','cancelled'].includes(d.status) || typeof d.start !== 'string' || !Number.isFinite(Date.parse(d.start)) || d.timeZone !== 'America/New_York' || typeof d.pending !== 'boolean') throw new Error('The booking response could not be verified. Please retry.');
  if (request.action !== 'view' && (d.operationId !== request.operationId || d.pending || d.status !== (request.action === 'cancel' ? 'cancelled' : 'active') || Date.parse(d.start) !== Date.parse(request.action === 'reschedule' ? request.target! : request.start!))) throw new Error('Your change could not be verified. Please retry the same request.');
  return d;
}
