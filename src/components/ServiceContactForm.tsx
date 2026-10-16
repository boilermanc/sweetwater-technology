import { useState, useSyncExternalStore } from 'react';

const inputClass = 'mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200';

const subscribe = () => () => {};

export function ServiceContactForm() {
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false);
  const [contactError, setContactError] = useState('');
  const [unavailable, setUnavailable] = useState(false);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get('email') ?? '').trim();
    const phone = String(data.get('phone') ?? '').trim();
    if (!email && !phone) {
      setContactError('Enter an email or phone number so we can reach you.');
      form.querySelector<HTMLInputElement>('[name="email"]')?.focus();
      return;
    }
    setContactError('');
    // Delivery and server-side Turnstile verification will be connected later.
    // Do not send, persist, or report successful receipt of these details.
    setUnavailable(true);
  }

  return <section id="service-contact" aria-labelledby="service-contact-title" className="mt-20 scroll-mt-28 rounded-[2rem] border border-slate-200 bg-slate-50 p-6 sm:p-12">
    <h2 id="service-contact-title" className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Tell us what's slowing you down</h2>
    <p className="mt-4 leading-7 text-slate-600">A few sentences is plenty. Clint or Sheree will follow up.</p>
    <p className="mt-4 text-sm leading-6 text-slate-600">Preview only — this form isn't connected yet. Nothing entered here will be sent.</p>
    <form className="mt-8 max-w-3xl" onSubmit={submit}>
      <fieldset disabled={!hydrated} className="space-y-6">
      <legend className="sr-only">Your enquiry</legend>
      <div>
        <label htmlFor="service-message" className="font-bold text-slate-900">What's slowing you down?</label>
        <textarea id="service-message" name="message" required maxLength={5000} rows={4} aria-describedby="service-message-note" className={inputClass} placeholder="e.g. chasing quotes, typing the same info twice, purchase orders in spreadsheets" />
        <p id="service-message-note" className="mt-2 text-sm text-slate-600">Keep it general — no patient, client or customer personal details.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div><label htmlFor="service-name" className="font-bold text-slate-900">Your name</label><input id="service-name" name="name" required autoComplete="name" maxLength={200} className={inputClass} /></div>
        <div><label htmlFor="service-business" className="font-bold text-slate-900">Business name (optional)</label><input id="service-business" name="business" autoComplete="organization" maxLength={200} className={inputClass} /></div>
      </div>
      <fieldset>
        <legend className="font-bold text-slate-900">How can we reach you?</legend>
        <p id="service-contact-help" className="mt-1 text-sm text-slate-600">At least one, so we can reach you.</p>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <div><label htmlFor="service-email" className="font-bold text-slate-900">Email</label><input id="service-email" name="email" type="email" autoComplete="email" maxLength={254} onChange={() => setContactError('')} aria-invalid={Boolean(contactError)} aria-describedby="service-contact-help service-contact-error" className={inputClass} /></div>
          <div><label htmlFor="service-phone" className="font-bold text-slate-900">Phone</label><input id="service-phone" name="phone" type="tel" autoComplete="tel" maxLength={50} onChange={() => setContactError('')} aria-invalid={Boolean(contactError)} aria-describedby="service-contact-help service-contact-error" className={inputClass} /></div>
        </div>
        <p id="service-contact-error" role="alert" className="mt-2 text-sm text-red-700">{contactError}</p>
      </fieldset>
      <div aria-hidden="true" className="hidden"><label htmlFor="service-website">Leave this empty</label><input id="service-website" name="website" tabIndex={-1} autoComplete="off" /></div>
      {unavailable && <p role="status" className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-slate-700">This form isn't connected yet, so your message hasn't been sent. Your entries are still here. You can reach us at <a href="mailto:team@sweetwater.technology" className="font-bold text-blue-600 underline">team@sweetwater.technology</a>.</p>}
      <button type="submit" className="inline-flex min-h-12 items-center justify-center rounded-full bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700">Send to Sweetwater</button>
      </fieldset>
      <noscript><p className="mt-3 text-sm">This preview form requires JavaScript. Please email team@sweetwater.technology instead.</p></noscript>
    </form>
  </section>;
}
