import { createClient } from '@supabase/supabase-js';

// Publishable key only. Authorization must be enforced by database policies.
const url = import.meta.env.VITE_PORTAL_SUPABASE_URL;
const key = import.meta.env.VITE_PORTAL_SUPABASE_PUBLISHABLE_KEY;
export const portalClient = typeof url === 'string' && url.startsWith('https://') && typeof key === 'string' && key.startsWith('sb_publishable_')
  ? createClient(url, key, {
    auth: { storageKey: 'sweetwater-portal-auth', flowType: 'pkce', persistSession: true, detectSessionInUrl: true },
    global: { fetch: (input, init = {}) => fetch(input, {
      ...init,
      signal: init.signal ? AbortSignal.any([init.signal, AbortSignal.timeout(15000)]) : AbortSignal.timeout(15000),
    }) },
  })
  : null;

// Preview launcher sets this only after the exact callback URLs are verified.
export const portalSignInReady = Boolean(portalClient) && import.meta.env.VITE_PORTAL_AUTH_READY === 'true';
