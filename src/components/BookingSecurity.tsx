import { useEffect, useRef, useState } from 'react';
type Turnstile = { render: (element: HTMLElement, options: Record<string, unknown>) => string; remove: (id: string) => void };
declare global { interface Window { turnstile?: Turnstile } }
let ready: Promise<void> | undefined;
function load() {
  if (window.turnstile) return Promise.resolve();
  if (!ready) ready = new Promise<void>((resolve,reject) => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'; script.async = true;
    script.onload = () => resolve(); script.onerror = () => { ready = undefined; script.remove(); reject(new Error('Security check unavailable')); };
    document.head.appendChild(script);
  });
  return ready;
}
export function BookingSecurity({ onToken }: { onToken: (token: string) => void }) {
  const host = useRef<HTMLDivElement>(null);
  const [failed,setFailed] = useState(false);
  const mock = import.meta.env.DEV && import.meta.env.VITE_BOOKING_MOCK === 'true';
  useEffect(() => {
    if (mock) return;
    let disposed = false; let id: string | undefined;
    const key = import.meta.env.VITE_BOOKING_TURNSTILE_SITE_KEY;
    if (!key) return;
    load().then(() => { if (!disposed && host.current && window.turnstile) id = window.turnstile.render(host.current, { sitekey: key, action: 'sweetwater-booking', callback: onToken, 'expired-callback': () => onToken(''), 'error-callback': () => { onToken(''); setFailed(true); } }); }).catch(() => { if (!disposed) setFailed(true); });
    return () => { disposed = true; if (id) window.turnstile?.remove(id); };
  }, [mock,onToken]);
  if (mock) return <button type="button" onClick={() => onToken('local-mock-only')} className="rounded border p-3">Complete local test security check</button>;
  return <div><div ref={host} />{(failed || !import.meta.env.VITE_BOOKING_TURNSTILE_SITE_KEY) && <p role="alert">The security check is unavailable. Please email us to arrange your call.</p>}</div>;
}
