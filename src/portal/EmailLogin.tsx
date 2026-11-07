import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

type Auth = Pick<SupabaseClient['auth'], 'signInWithOtp' | 'verifyOtp'>;
export default function EmailLogin({ auth, ready }: { auth: Auth | null; ready: boolean }) {
  const [email, setEmail] = useState('');
  const [sentTo, setSentTo] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const pending = useRef(false);
  const nextSend = useRef(0);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.slice(1));
    if (params.has('error') || hash.has('error') || params.has('code')) {
      setMessage('That email link did not complete sign-in. Request an email code below instead.');
    }
  }, []);
  useEffect(() => {
    if (!seconds) return;
    const timer = window.setTimeout(() => setSeconds(Math.max(0, Math.ceil((nextSend.current - Date.now()) / 1000))), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds]);
  async function send(event: FormEvent) {
    event.preventDefault();
    if (!auth || !ready || pending.current || Date.now() < nextSend.current) return;
    pending.current = true; setBusy(true); setMessage('');
    const address = email.trim();
    nextSend.current = Date.now() + 60000; setSeconds(60);
    try {
      const { error } = await auth.signInWithOtp({ email: address, options: { shouldCreateUser: false, emailRedirectTo: `${window.location.origin}/portal` } });
      if (error) {
        setMessage(error.status === 429 ? 'Please wait a minute before requesting another code. Use the latest email if it has arrived.' : 'Unable to send a code. Check your email address and try again.');
      } else {
        setSentTo(address); setCode(''); setMessage('If this email has workspace access, a code is on its way. Enter the code from the newest email below.');
      }
    } catch { setMessage('Unable to connect. Please check your connection and try again.'); }
    finally { pending.current = false; setBusy(false); }
  }
  async function verify(event: FormEvent) {
    event.preventDefault();
    if (!auth || !ready || pending.current || !sentTo) return;
    const token = code.replace(/\s/g, '');
    if (!/^\d{6,10}$/.test(token)) { setMessage('Enter the complete numeric code from your email.'); return; }
    pending.current = true; setBusy(true); setMessage('');
    try {
      const { data, error } = await auth.verifyOtp({ email: sentTo, token, type: 'email' });
      if (error || !data.session) {
        setMessage(error?.status === 429 ? 'Too many attempts. Wait before trying again.' : 'That code is invalid or expired. Use the newest email code, or request a new one.');
      } else { setCode(''); setMessage('Email verified. Checking workspace access…'); }
    } catch { setMessage('Unable to verify the code. Check your connection and try again.'); }
    finally { pending.current = false; setBusy(false); }
  }
  return <>
    <form onSubmit={send}>
      <label htmlFor="portal-email">Email address</label>
      <input id="portal-email" type="email" autoComplete="email" placeholder="you@sweetwater.technology" required value={email} onChange={event => { setEmail(event.target.value); setSentTo(''); setCode(''); }} disabled={!ready || busy} />
      <button className="primary" disabled={!ready || busy || seconds > 0}>{seconds > 0 ? `Request another code in ${seconds}s` : sentTo ? 'Send a new code' : 'Email me a sign-in code'}</button>
      {!sentTo && <button type="button" className="quiet-link" disabled={!ready || busy} onClick={event => { if (event.currentTarget.form?.reportValidity()) { setSentTo(email.trim()); setMessage('Enter the code from your newest Sweetwater email.'); } }}>I already have an email code</button>}
    </form>
    {sentTo && <form onSubmit={verify}>
      <p className="small">Enter the email code for {sentTo}. Your authenticator check comes next.</p>
      <label htmlFor="portal-email-code">Email sign-in code</label>
      <input id="portal-email-code" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={12} required value={code} onChange={event => setCode(event.target.value)} disabled={busy} />
      <button className="primary" disabled={busy || !ready}>{busy ? 'Please wait…' : 'Verify email code'}</button>
    </form>}
    <p className="small">Use your approved workspace email. No password or email link needed.</p>
    {message && <p className="notice" role="status">{message}</p>}
  </>;
}
