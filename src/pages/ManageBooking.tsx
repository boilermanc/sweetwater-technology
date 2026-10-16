import { useEffect, useRef, useState } from 'react';
import { loadAvailability, type Slot } from '../lib/booking';
import { ManagementError, manageBooking, parseManagementLink, type ManagedBooking, type ManagementLink, type ManagementRequest } from '../lib/bookingManagement';
const endpoint = 'https://n8n.sproutify.app/webhook/sweetwater-booking-manage';
const availabilityEndpoint = 'https://n8n.sproutify.app/webhook/sweetwater-booking-availability';
const button = 'min-h-12 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600';
export function ManageBooking() {
  const [link, setLink] = useState<ManagementLink | null>(null);
  const [booking, setBooking] = useState<ManagedBooking | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [target, setTarget] = useState('');
  const [mode, setMode] = useState<'cancel' | 'reschedule' | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('Loading your booking…');
  const [pending, setPending] = useState<ManagementRequest | null>(null);
  const locked = useRef(false);
  const format = (start: string) => new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }).format(new Date(start));
  useEffect(() => {
    const found = parseManagementLink(window.location.hash);
    setLink(found);
    if (!found) { setMessage('Use the private link in your Sweetwater confirmation email to manage your booking.'); return; }
    let active = true;
    manageBooking(endpoint, { ...found, action: 'view' }).then(result => {
      if (active) { setBooking(result); setMessage(''); }
    }).catch(() => { if (active) setMessage('We could not load your booking. Refresh this page to try again, or email us for help.'); });
    return () => { active = false; };
  }, []);
  async function chooseReschedule() {
    if (locked.current) return;
    locked.current = true; setBusy(true); setMessage(''); setMode('reschedule');
    try { const result = await loadAvailability(availabilityEndpoint); setSlots(result.slots.filter(s => s.start !== booking?.start)); }
    catch { setMessage('Available times could not be loaded. Please try again.'); }
    finally { locked.current = false; setBusy(false); }
  }
  async function confirmChange() {
    if (!link || !booking || !mode || locked.current || (mode === 'reschedule' && !target && !pending)) return;
    const request = pending ?? { ...link, action: mode, operationId: crypto.randomUUID(), start: new Date(booking.start).toISOString(), ...(mode === 'reschedule' ? { target } : {}) };
    // Keep the exact operation on an uncertain response; a retry cannot create a second change.
    setPending(request); locked.current = true; setBusy(true); setMessage('');
    try { const result = await manageBooking(endpoint, request); setBooking(result); setPending(null); setMode(null); setTarget(''); setMessage(result.status === 'cancelled' ? 'Your booking is cancelled. Thank you for letting us know.' : 'Your new time is confirmed. Your calendar invitation will be updated.'); }
    catch (error) { if (error instanceof ManagementError && error.retryNew) setPending(null); setMessage(error instanceof Error ? error.message : 'Your change could not be confirmed. Please retry.'); }
    finally { locked.current = false; setBusy(false); }
  }
  const canChange = booking?.status === 'active' && Date.parse(booking.start) > Date.now() && !booking.pending;
  return <main className="relative z-10 mx-auto max-w-2xl px-5 pb-24 pt-32 sm:pt-40">
    <p className="text-sm font-bold uppercase tracking-widest text-blue-700">Your Sweetwater call</p>
    <h1 className="mt-4 text-4xl font-black text-slate-900">Manage your booking</h1>
    <p className="mt-4 text-slate-600">Change your time or cancel your free 20-minute call. Keep this private link to yourself.</p>
    {booking && <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6" aria-label="Current booking">
      <h2 className="text-xl font-bold">{booking.status === 'cancelled' ? 'Booking cancelled' : 'Your current appointment'}</h2>
      <p className="mt-3 text-lg">{format(booking.start)}</p><p className="mt-2 text-slate-600">20 minutes · Eastern time</p>
      {booking.pending && <p className="mt-4">A change is being verified. If you closed the page before it finished, contact us before making another change.</p>}
      {canChange && !mode && <div className="mt-6 flex flex-wrap gap-3"><button className={button} onClick={chooseReschedule} disabled={busy}>Choose a new time</button><button className="min-h-12 rounded-xl border border-slate-300 px-5 py-3 font-bold" onClick={() => { setMode('cancel'); setMessage(''); }}>Cancel booking</button></div>}
    </section>}
    {mode && <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm" aria-labelledby="change-heading">
      <h2 id="change-heading" className="text-xl font-bold">{mode === 'cancel' ? 'Cancel this appointment?' : 'Choose your new time'}</h2>
      {mode === 'cancel' ? <p className="mt-3">Confirm below to cancel your call and make the time available to someone else.</p> : <><p className="mt-3">All times are Eastern. Your current time stays reserved until the change is confirmed.</p><label htmlFor="new-booking-time" className="mt-5 block font-bold">Available appointments</label><select id="new-booking-time" className="mt-2 min-h-12 w-full rounded-lg border border-slate-300 bg-white p-3" value={target} onChange={e => setTarget(e.target.value)} disabled={busy || !!pending}><option value="">Select a time</option>{slots.map(s => <option key={s.start} value={s.start}>{format(s.start)}</option>)}</select>{!busy && slots.length === 0 && <p className="mt-3">No times are currently available. Please contact us.</p>}</>}
      <div className="mt-6 flex flex-wrap gap-3"><button className={button} disabled={busy || (mode === 'reschedule' && !target && !pending)} onClick={confirmChange}>{busy ? 'Checking…' : pending ? 'Retry this change' : mode === 'cancel' ? 'Yes, cancel my booking' : 'Confirm new time'}</button><button className="min-h-12 rounded-xl border border-slate-300 px-5 py-3 font-bold" disabled={busy || !!pending} onClick={() => { setMode(null); setMessage(''); }}>Keep my current booking</button></div>
    </section>}
    <p role="status" aria-live="polite" className="mt-6 leading-7 text-slate-700">{message}</p>
    <p className="mt-8 text-slate-600">Need help? <a className="font-bold text-blue-700 underline" href="mailto:team@sweetwater.technology" referrerPolicy="no-referrer">Email Clint and Sheree</a>.</p>
    {booking?.status === 'cancelled' && <a href="/book" className="mt-5 inline-block font-bold text-blue-700 underline">Book another call</a>}
  </main>;
}
