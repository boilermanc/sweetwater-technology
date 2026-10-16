import { useEffect, useRef, useState, type FormEvent } from 'react';
import { BookingSecurity } from './BookingSecurity';
import { BookingError, bookSlot, loadAvailability, type Slot, type BookingConfirmation } from '../lib/booking';
const mock = import.meta.env.DEV && import.meta.env.VITE_BOOKING_MOCK === 'true';
const availabilityUrl = mock ? '/__booking/availability' : 'https://n8n.sproutify.app/webhook/sweetwater-booking-availability';
const bookingUrl = mock ? '/__booking/create' : 'https://n8n.sproutify.app/webhook/sweetwater-booking-create';
const field = 'mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:outline-2 focus:outline-blue-600';
export function BookingPicker() {
  const [slots,setSlots] = useState<Slot[]>([]);
  const [loading,setLoading] = useState(true);
  const [loadError,setLoadError] = useState(false);
  const [refresh,setRefresh] = useState(0);
  const [selected,setSelected] = useState('');
  const [day,setDay] = useState('');
  const [zone] = useState(() => typeof window === 'undefined' ? 'America/New_York' : Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [details,setDetails] = useState({name:'',email:'',topic:'',website:''});
  const [token,setToken] = useState('');
  const [challenge,setChallenge] = useState(0);
  const [pending,setPending] = useState(false);
  const [error,setError] = useState('');
  const [confirmed,setConfirmed] = useState<BookingConfirmation | null>(null);
  const retry = useRef<{fingerprint:string;id:string} | null>(null);
  const lock = useRef(false);
  const dayFormat = new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'});
  const dateLabel = (start: string) => new Intl.DateTimeFormat(undefined,{timeZone:zone,weekday:'short',month:'short',day:'numeric'}).format(new Date(start));
  const timeLabel = (start: string) => new Intl.DateTimeFormat(undefined,{timeZone:zone,hour:'numeric',minute:'2-digit'}).format(new Date(start));
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(),15000);
    loadAvailability(availabilityUrl,controller.signal).then(data => { if (!disposed) { setSlots(data.slots.filter(s=>Date.parse(s.start)>Date.now()));setLoadError(false); } }).catch(() => { if (!disposed) setLoadError(true); }).finally(() => { if (!disposed) setLoading(false); });
    let disposed = false;
    return () => { disposed = true;clearTimeout(timer);controller.abort(); };
  },[refresh]);
  const days = [...new Set(slots.map(s=>dayFormat.format(new Date(s.start))))];
  const activeDay = days.includes(day) ? day : days[0];
  const visible = slots.filter(s=>dayFormat.format(new Date(s.start))===activeDay);
  function reload() { setLoading(true);setLoadError(false);setRefresh(v=>v+1); }
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (lock.current || !selected || !token || details.website) return;
    lock.current=true;setPending(true);setError('');
    const fingerprint=JSON.stringify({...details,start:selected});
    if(retry.current?.fingerprint!==fingerprint)retry.current={fingerprint,id:crypto.randomUUID()};
    try { setConfirmed(await bookSlot(bookingUrl,{...details,start:selected,requestId:retry.current.id,turnstileToken:token})); }
    catch(e) {
      if(e instanceof BookingError && e.status===409){setError('That time has just become unavailable. Your details are saved here—please pick another time.');setSelected('');retry.current=null;reload();}
      else if(e instanceof BookingError && e.status===400)setError('Please check your details and complete the security check again.');
      else setError('We could not confirm your booking. Your details are still here. Complete the security check and retry with the same details to check it safely.');
    } finally {setPending(false);lock.current=false;setToken('');setChallenge(v=>v+1);}
  }
  if(confirmed)return <div role="status" className="rounded-3xl border border-blue-200 bg-blue-50 p-7"><h2 className="text-2xl font-black text-slate-900">Your call is booked.</h2><p className="mt-4">{dateLabel(confirmed.start)} at {timeLabel(confirmed.start)} ({zone}) · 20 minutes</p><p className="mt-4 leading-7">Your appointment is saved in our calendar. Look for the calendar invitation in your email. We’ll follow up with call details.</p><p className="mt-4 text-sm">Need to change it? Email <a className="text-blue-700 underline" href="mailto:team@sweetwater.technology">team@sweetwater.technology</a>.</p></div>;
  return <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 sm:p-8">
    {mock&&<p className="mb-5 rounded bg-amber-50 p-3 text-sm">Local booking demo. No calendar events or emails are created.</p>}
    <h2 className="text-2xl font-black text-slate-900">Choose your free call</h2>
    <p className="mt-3 text-sm text-slate-600">20 minutes · Times shown in {zone}</p>
    {loading?<p role="status" className="mt-6">Checking available times…</p>:loadError?<div role="alert" className="mt-6"><p>We couldn’t load available times.</p><button className="mt-3 font-bold text-blue-700 underline" onClick={reload}>Try again</button></div>:slots.length===0?<p className="mt-6">No open times right now. Email us and we’ll find a time together.</p>:<fieldset disabled={pending} className="mt-6"><legend className="font-bold text-slate-800">Available appointments</legend><label className="mt-3 block text-sm" htmlFor="booking-day">Choose a day</label><select id="booking-day" value={activeDay} onChange={e=>{setDay(e.target.value);setSelected('');setError('');}} className={field}>{days.map(d=><option key={d} value={d}>{dateLabel(slots.find(s=>dayFormat.format(new Date(s.start))===d)!.start)}</option>)}</select><div className="mt-4 grid grid-cols-2 gap-3">{visible.map(slot=><button type="button" key={slot.start} aria-pressed={selected===slot.start} onClick={()=>{setSelected(slot.start);setError('');}} className={'min-h-12 rounded-xl border px-3 py-2 font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 '+(selected===slot.start?'border-blue-600 bg-blue-600 text-white':'border-slate-300 text-blue-700 hover:bg-blue-50')}>{timeLabel(slot.start)}</button>)}</div></fieldset>}
    {selected&&<form onSubmit={submit} className="mt-7"><fieldset disabled={pending} className="space-y-4"><legend className="mb-4 font-bold">{dateLabel(selected)} · {timeLabel(selected)} ({zone})</legend><label className="block font-semibold" htmlFor="booking-name">Your name<input id="booking-name" required maxLength={120} autoComplete="name" value={details.name} onChange={e=>setDetails({...details,name:e.target.value})} className={field}/></label><label className="block font-semibold" htmlFor="booking-email">Email<input id="booking-email" type="email" required maxLength={254} autoComplete="email" value={details.email} onChange={e=>setDetails({...details,email:e.target.value})} className={field}/></label><label className="block font-semibold" htmlFor="booking-topic">What would you like to discuss? (optional)<textarea id="booking-topic" rows={3} maxLength={1000} value={details.topic} onChange={e=>setDetails({...details,topic:e.target.value})} className={field}/></label><p className="text-sm text-slate-600">Keep it general—no private customer or patient information.</p><div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden"><label htmlFor="booking-website">Website<input id="booking-website" tabIndex={-1} autoComplete="off" value={details.website} onChange={e=>setDetails({...details,website:e.target.value})}/></label></div><BookingSecurity key={challenge} onToken={setToken}/><p className="text-sm leading-6 text-slate-600">Confirming saves the appointment to our Google Calendar and requests an invitation to your email.</p><button disabled={pending||!token||loadError||loading} className="min-h-12 w-full rounded-xl bg-blue-600 p-3 font-bold text-white hover:bg-blue-700 disabled:opacity-50">{pending?'Confirming…':'Confirm my free call'}</button></fieldset></form>}
    {error&&<p role="alert" className="mt-5 text-sm leading-6 text-red-800">{error}</p>}
    <a href="mailto:team@sweetwater.technology?subject=Free%2020-minute%20call" className="mt-6 inline-block text-sm font-bold text-blue-700 underline">Prefer to email us?</a>
  </div>;
}
