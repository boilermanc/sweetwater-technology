export type Slot = { start: string; end: string };
export type BookingDetails = { name: string; email: string; topic: string; website: string };
export type BookingRequest = BookingDetails & { start: string; requestId: string; turnstileToken: string };
export type BookingConfirmation = Slot & { confirmed: true; requestId: string; bookingId: string };
export class BookingError extends Error { status: number; constructor(message: string, status: number) { super(message); this.status = status; } }
export function parseAvailability(data: unknown): { timeZone: string; slots: Slot[] } {
  if (!data || typeof data !== 'object' || !('slots' in data) || !Array.isArray(data.slots) || data.slots.length > 2000 || !('timeZone' in data) || typeof data.timeZone !== 'string' || !('durationMinutes' in data) || data.durationMinutes !== 20) throw new Error('Invalid availability response');
  new Intl.DateTimeFormat('en', { timeZone: data.timeZone });
  const slots: Slot[] = data.slots.map((slot: unknown) => {
    if (!slot || typeof slot !== 'object' || !('start' in slot) || !('end' in slot) || typeof slot.start !== 'string' || typeof slot.end !== 'string' || !Number.isFinite(Date.parse(slot.start)) || Date.parse(slot.end) - Date.parse(slot.start) !== 1200000) throw new Error('Invalid slot');
    return { start: new Date(slot.start).toISOString(), end: new Date(slot.end).toISOString() };
  });
  if (new Set(slots.map(s => s.start)).size !== slots.length) throw new Error('Duplicate slots');
  return { timeZone: data.timeZone, slots: slots.sort((a,b) => a.start.localeCompare(b.start)) };
}
export async function loadAvailability(endpoint: string, signal?: AbortSignal) {
  const response = await fetch(endpoint, { signal: signal ?? AbortSignal.timeout(15000), cache: 'no-store' });
  if (!response.ok) throw new Error('Availability unavailable');
  return parseAvailability(await response.json());
}
export async function bookSlot(endpoint: string, request: BookingRequest): Promise<BookingConfirmation> {
  const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(request), signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new BookingError('Booking not confirmed',response.status);
  const data: unknown = await response.json();
  if (!data || typeof data !== 'object' || !('confirmed' in data) || data.confirmed !== true || !('requestId' in data) || data.requestId !== request.requestId || !('bookingId' in data) || typeof data.bookingId !== 'string' || !data.bookingId || !('start' in data) || data.start !== request.start || !('end' in data) || typeof data.end !== 'string' || Date.parse(data.end) - Date.parse(request.start) !== 1200000) throw new Error('Booking not confirmed');
  return { confirmed: true, requestId: request.requestId, bookingId: data.bookingId, start: request.start, end: data.end };
}
