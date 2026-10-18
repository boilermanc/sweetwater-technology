import { BookingSecurity } from './BookingSecurity';
import { useCallback, useRef, useState, useSyncExternalStore, type FormEvent } from 'react';
import { CheckCircle, ArrowUpRight, Send } from 'lucide-react';
import { submitRequest } from '../lib/aiHelp';
import { homeContactEmail, homeContactPayload, validateHomeContact, type HomeContactDetails } from '../lib/homeContact';

const fieldClass = 'mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-500 focus:outline-2 focus:outline-offset-2 focus:outline-blue-600';
const empty: HomeContactDetails = { name: '', business: '', email: '', phone: '', message: '', website: '' };

const subscribe = () => () => {};

export function ContactForm({ initialMessage = '' }: { initialMessage?: string }) {
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const [details, setDetails] = useState({ ...empty, message: initialMessage });
  const [token, setToken] = useState('');
  const [securityKey, setSecurityKey] = useState(0);
  const onToken = useCallback((value: string) => setToken(value), []);
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const lock = useRef(false);
  const retry = useRef<{ fingerprint: string; id: string } | null>(null);
  const endpoint = import.meta.env.VITE_HOME_CONTACT_URL?.trim() || 'https://n8n.sproutify.app/webhook/4a7ce38b-f497-424f-9936-f636f5b68514';
  const isMock = import.meta.env.DEV && import.meta.env.VITE_HOME_CONTACT_MOCK === 'true' && endpoint === '/__home_contact_mock';
  const enabled = isMock || (import.meta.env.VITE_HOME_CONTACT_ENABLED === 'true' && !!endpoint?.startsWith('https://'));
  function update(key: keyof HomeContactDetails, value: string) { setDetails(current => ({ ...current, [key]: value })); }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lock.current) return;
    const validation = validateHomeContact(details);
    if (validation) { setError(validation); return; }
    if (!enabled || !endpoint) { setError('Online sending is not connected yet. You can open an email with your details below.'); return; }
    if (!isMock && !token) { setError('Please complete the security check.'); return; }
    lock.current = true; setPending(true); setError('');
    const source = window.location.pathname === '/' ? 'homepage-contact' : 'website:' + window.location.pathname;
    const fingerprint = JSON.stringify(homeContactPayload(details, '', source));
    if (retry.current?.fingerprint !== fingerprint) retry.current = { fingerprint, id: crypto.randomUUID() };
    try {
      await submitRequest(endpoint, { ...homeContactPayload(details, retry.current.id, source), turnstileToken: token });
      setSubmitted(true);
    } catch {
      setError('That didn’t send. Please try again or email us at team@sweetwater.technology.');
    } finally { lock.current = false; setPending(false); setToken(''); setSecurityKey(key => key + 1); }
  }
  if (submitted) return <div role="status" className="rounded-3xl border border-blue-200 bg-blue-50 p-8"><CheckCircle size={32} className="text-blue-600" aria-hidden="true" /><h3 className="mt-5 text-2xl font-black text-slate-900">Thanks—we received your message.</h3><p className="mt-4 leading-7 text-slate-700">Clint will follow up using the details you provided.</p><a href="/book" className="mt-6 block font-bold text-blue-700 underline">Book a free 20-minute call →</a><button className="mt-6 font-bold text-blue-700 underline" onClick={() => { setDetails({ ...empty, message: initialMessage }); setSubmitted(false); retry.current = null; }}>Send another message</button></div>;
  return <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm sm:p-8" aria-label="Contact Sweetwater">
    {isMock && <p className="mb-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">Local test only. The first request fails; retry succeeds. No message is saved or sent.</p>}
    <fieldset disabled={!hydrated || pending} className="space-y-5">
      <legend className="sr-only">Your message and contact details</legend>
      <div><label htmlFor="contact-message" className="font-semibold text-slate-800">What’s slowing you down?</label><textarea id="contact-message" name="message" required maxLength={1000} rows={4} value={details.message} onChange={e => update('message', e.target.value)} aria-describedby="contact-privacy" placeholder="e.g. chasing quotes, typing the same info twice, purchase orders in spreadsheets" className={fieldClass} /><p id="contact-privacy" className="mt-2 text-sm leading-6 text-slate-600">Keep it general—no patient, client or customer personal details.</p></div>
      <div className="grid gap-5 sm:grid-cols-2"><div><label htmlFor="contact-name" className="font-semibold text-slate-800">Your name</label><input id="contact-name" name="name" autoComplete="name" required maxLength={100} value={details.name} onChange={e => update('name', e.target.value)} className={fieldClass} /></div><div><label htmlFor="contact-business" className="font-semibold text-slate-800">Business name <span className="font-normal">(optional)</span></label><input id="contact-business" name="business" autoComplete="organization" maxLength={120} value={details.business} onChange={e => update('business', e.target.value)} className={fieldClass} /></div></div>
      <p id="contact-method" className="text-sm text-slate-600">Leave an email address or phone number so we can reply.</p>
      <div className="grid gap-5 sm:grid-cols-2"><div><label htmlFor="contact-email" className="font-semibold text-slate-800">Email</label><input id="contact-email" name="email" type="email" autoComplete="email" aria-describedby="contact-method" maxLength={254} value={details.email} onChange={e => update('email', e.target.value)} className={fieldClass} /></div><div><label htmlFor="contact-phone" className="font-semibold text-slate-800">Phone</label><input id="contact-phone" name="phone" type="tel" autoComplete="tel" aria-describedby="contact-method" maxLength={30} value={details.phone} onChange={e => update('phone', e.target.value)} className={fieldClass} /></div></div>
      <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true"><label htmlFor="contact-website">Website</label><input id="contact-website" name="website" tabIndex={-1} autoComplete="off" value={details.website} onChange={e => update('website', e.target.value)} /></div>
      {!enabled && <p className="rounded-xl bg-blue-50 p-4 text-sm leading-6 text-slate-700">Online sending is not connected yet. Use the email link below to open a draft with your details. Nothing is sent until you send that email.</p>}
      {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-800">{error}</p>}
      {enabled && !isMock && <BookingSecurity key={securityKey} onToken={onToken} action="sweetwater-contact" />}
      <button disabled={!hydrated || !enabled || pending || (!isMock && !token)} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"><Send size={18} aria-hidden="true" />{pending ? 'Sending…' : 'Send to Sweetwater'}</button>
    </fieldset>
    <noscript><p className="mt-4 text-sm">JavaScript is needed for online sending. Please email team@sweetwater.technology instead.</p></noscript>
    <a href={homeContactEmail(details)} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-blue-700 underline">Email team@sweetwater.technology <ArrowUpRight size={16} aria-hidden="true" /></a>
  </form>;
}

export function ServiceContactForm() {
  return <section id="service-contact" aria-labelledby="service-contact-title" className="mt-20 scroll-mt-28 rounded-[2rem] border border-slate-200 bg-slate-50 p-6 sm:p-12">
    <h2 id="service-contact-title" className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Tell us what's slowing you down</h2>
    <p className="mb-7 mt-4 leading-7 text-slate-600">A few sentences is plenty. Clint will follow up.</p>
    <a href="/book" className="mb-6 inline-flex min-h-11 items-center font-bold text-blue-700 underline">Book a free 20-minute call →</a>
    <ContactForm />
  </section>;
}
