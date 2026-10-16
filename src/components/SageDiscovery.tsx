import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { completeContext, discoveryConfig, discoveryEmail, discoveryReply } from '../lib/discovery';
import type { DiscoveryContext, DiscoveryIntent, DiscoveryMessage } from '../lib/discovery';
import { emptyDetails, submitRequest, validateDetails } from '../lib/aiHelp';

const fieldClass = 'mt-2 w-full rounded-xl border border-[#526a9d] bg-[#0c1322] px-4 py-3 text-white focus:outline-2 focus:outline-[#83a6ff]';
const actionClass = 'min-h-11 rounded-full bg-[#2e5ce6] px-5 py-3 text-sm font-bold text-white hover:bg-[#3c69e9] disabled:opacity-50';

export function SageDiscovery({ intent, openSignal = 0 }: { intent: DiscoveryIntent; openSignal?: number }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const end = useRef<HTMLDivElement>(null);
  const lock = useRef(false);
  const requestId = useRef<string | null>(null);
  const config = discoveryConfig[intent];
  const [messages, setMessages] = useState<DiscoveryMessage[]>([{ role: 'assistant', content: config.opening }]);
  const [context, setContext] = useState<DiscoveryContext>({});
  const [input, setInput] = useState('');
  const [contact, setContact] = useState(emptyDetails);
  const [stage, setStage] = useState<'chat' | 'review' | 'contact' | 'sent'>('chat');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [emailReady, setEmailReady] = useState(false);
  const chatEndpoint = import.meta.env.VITE_SAGE_DISCOVERY_CHAT_URL?.trim();
  const contactEndpoint = import.meta.env.VITE_SAGE_DISCOVERY_CONTACT_URL?.trim();
  const isMock = import.meta.env.DEV && import.meta.env.VITE_SAGE_DISCOVERY_MOCK === 'true';
  const source = typeof window === 'undefined' ? 'direct' : new URLSearchParams(window.location.search).get('src') || 'direct';

  useEffect(() => { if (openSignal > 0 && !dialog.current?.open) dialog.current?.showModal(); }, [openSignal]);
  useEffect(() => { if (dialog.current?.open) end.current?.scrollIntoView({ block: 'nearest' }); }, [messages, pending]);

  async function send() {
    if (lock.current || !chatEndpoint || !input.trim()) return;
    lock.current = true; setPending(true); setError('');
    const next = [...messages, { role: 'user', content: input.trim() } as DiscoveryMessage];
    // Commit the turn only on a valid reply. Failure preserves the input for retry.
    try {
      const answer = await discoveryReply(chatEndpoint, intent, source, next, context);
      setMessages([...next, { role: 'assistant', content: answer.reply }]);
      setContext(answer.context); setInput(''); requestId.current = null;
    } catch { setError('Sage could not reply just now. Your message is still here. Try again, or email Clint directly.'); }
    finally { lock.current = false; setPending(false); }
  }

  async function handoff() {
    if (lock.current || stage === 'sent') return;
    const issue = validateDetails(contact, 3);
    if (issue) { setError(issue); return; }
    if (!completeContext(intent, context)) { setError('Please review the missing details first.'); return; }
    setError('');
    if (!contactEndpoint) { setEmailReady(true); return; }
    lock.current = true; setPending(true); requestId.current ??= crypto.randomUUID();
    const payload = {
      requestId: requestId.current, event: 'intro_contact_request', intent, source: source.slice(0,120), context, messages,
      contact: { name: contact.name.trim(), email: contact.email.trim() || null, phone: contact.callback ? contact.phone.trim() : null },
      contactMethod: contact.callback ? 'callback' : 'email', consent: { marketing: contact.marketing },
    };
    try { await submitRequest(contactEndpoint, payload); setStage('sent'); }
    catch { setError('We could not confirm your request. Your details are still here. Retry or use the email draft below. No appointment has been booked.'); setEmailReady(true); }
    finally { lock.current = false; setPending(false); }
  }

  return <>
    <button aria-label="Open Sage conversation" onClick={() => dialog.current?.showModal()} className="fixed bottom-5 right-5 z-30 grid h-14 w-14 place-items-center rounded-full bg-[#2e5ce6] text-white shadow-xl"><MessageCircle /></button>
    <dialog ref={dialog} aria-labelledby="sage-discovery-title" className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-xl overflow-y-auto rounded-3xl border border-[#365080] bg-[#101a30] p-6 text-white shadow-2xl backdrop:bg-[#050a14]/80 sm:p-8">
      <header className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-[#9bb5ff]">Sweetwater Technology</p><h2 id="sage-discovery-title" className="mt-2 text-xl font-bold">{intent === 'ai-help' ? 'Practical AI with Sage' : 'Talk through your idea with Sage'}</h2></div><button aria-label="Close Sage" onClick={() => dialog.current?.close()} className="grid h-11 w-11 shrink-0 place-items-center rounded-full hover:bg-white/10"><X /></button></header>
      {isMock && <p role="status" className="mt-4 rounded-xl border border-amber-300/40 p-3 text-sm text-amber-200">Local test preview: scripted mock replies, not live AI. No leads are saved.</p>}
      {stage === 'chat' ? <>
        <div aria-live="polite" aria-label="Conversation with Sage" className="mt-6 space-y-4">{messages.map((message,index) => <p key={index} className={`whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-7 ${message.role === 'user' ? 'ml-6 bg-[#2e5ce6]' : 'mr-4 border border-[#365080] bg-[#16223c]'}`}><span className="mb-1 block text-xs font-bold">{message.role === 'user' ? 'You' : 'Sage'}</span>{message.content}</p>)}<div ref={end} /></div>
        {!chatEndpoint ? <div role="status" className="mt-5 rounded-xl border border-[#526a9d] p-4 text-sm leading-7">Sage's live conversation is not connected in this preview. <a href="mailto:clint@sweetwater.technology" className="font-bold text-[#9bb5ff] underline">Email Clint to talk it through</a>. Nothing has been sent.</div> : <form className="mt-5" onSubmit={event => {event.preventDefault(); void send();}}><label htmlFor="sage-discovery-message" className="text-sm font-semibold">Your message</label><textarea id="sage-discovery-message" rows={3} maxLength={2000} className={fieldClass} value={input} disabled={pending} onChange={event => setInput(event.target.value)} /><p className="mt-2 text-xs text-[#aebfe8]">Leave out customer records and sensitive information. You can explore without sharing contact details.</p><button disabled={pending || !input.trim()} className={`${actionClass} mt-4`}>{pending ? 'Sage is thinking...' : 'Send message'}</button></form>}
        {completeContext(intent,context) && <button disabled={pending} onClick={() => {setStage('review'); setError('');}} className="mt-4 min-h-11 rounded-full border border-[#526a9d] px-5 py-3 text-sm font-bold">Review details to talk with Clint</button>}
      </> : stage === 'review' ? <form className="mt-6 space-y-4" onSubmit={event => {event.preventDefault(); if (completeContext(intent,context)) {setStage('contact');setError('');} else setError('Please complete each detail before continuing.');}}>
        <h3 className="text-lg font-bold">Does this capture what you mean?</h3><p className="text-sm leading-6 text-[#c7d4f5]">Edit Sage's summary before choosing whether to contact Clint.</p>
        {config.fields.map(([key,label]) => <label key={key} className="block text-sm">{label}<textarea className={fieldClass} rows={2} maxLength={1000} value={context[key] || ''} onChange={event => {setContext({...context,[key]:event.target.value});requestId.current=null;setEmailReady(false);}} /></label>)}
        <button type="button" onClick={() => {setStage('chat');setError('');}} className="mr-3 min-h-11 px-3">Keep talking</button><button className={actionClass}>Contact details</button>
      </form> : stage === 'contact' ? <form noValidate className="mt-6 space-y-4" onSubmit={event => {event.preventDefault();void handoff();}}><fieldset disabled={pending} className="space-y-4">
        <p className="text-sm leading-7 text-[#c7d4f5]">Start with a free introductory conversation of approximately 20 minutes. Any assessment or implementation afterward has an agreed scope and fixed pricing. This is a contact request, not a booked appointment.</p>
        <label className="block">Your name<input autoComplete="name" maxLength={100} className={fieldClass} value={contact.name} onChange={event => {setContact({...contact,name:event.target.value});requestId.current=null;setEmailReady(false);}} /></label>
        <label className="block">Email{contact.callback ? ' (optional for a callback)' : ''}<input type="email" autoComplete="email" maxLength={254} className={fieldClass} value={contact.email} onChange={event => {setContact({...contact,email:event.target.value});requestId.current=null;setEmailReady(false);}} /></label>
        <label className="flex min-h-11 items-center gap-3"><input type="checkbox" checked={contact.callback} onChange={event => {setContact({...contact,callback:event.target.checked});requestId.current=null;setEmailReady(false);}} /> I would prefer a callback</label>
        {contact.callback && <label className="block">Phone number (required for a callback)<input type="tel" autoComplete="tel" maxLength={30} className={fieldClass} value={contact.phone} onChange={event => {setContact({...contact,phone:event.target.value});requestId.current=null;setEmailReady(false);}} /></label>}
        <label className="flex items-start gap-3 text-sm leading-6"><input type="checkbox" className="mt-1" checked={contact.marketing} onChange={event => {setContact({...contact,marketing:event.target.checked});requestId.current=null;setEmailReady(false);}} /> Send me occasional Sweetwater updates (optional). I can unsubscribe anytime.</label>
        <p className="text-xs text-[#aebfe8]">Contact details are for this request. Marketing updates are a separate choice.</p>
        <button type="button" onClick={() => {setStage('review');setError('');setEmailReady(false);}} className="mr-3 min-h-11 px-3">Back to summary</button><button className={actionClass}>{pending ? 'Sending...' : contactEndpoint ? 'Send contact request' : 'Prepare email request'}</button>
      </fieldset></form> : <p role="status" className="mt-6 leading-7">Your contact request was received. Clint can follow up using the details you shared. No appointment has been booked.</p>}
      {error && <p role="alert" className="mt-4 rounded-xl border border-red-400/40 p-3 text-sm leading-6 text-red-200">{error}</p>}
      {emailReady && stage === 'contact' && <div role="status" className="mt-5 rounded-xl border border-[#526a9d] p-4 text-sm leading-7"><p>Nothing has been sent by this email option. Open the draft, review it, and send it to Clint.</p><a className="font-bold text-[#9bb5ff] underline" href={discoveryEmail(intent,source,context,contact,messages)}>Open email draft</a><p>If your email app does not open, copy the summary into an email to clint@sweetwater.technology.</p></div>}
    </dialog>
  </>;
}
