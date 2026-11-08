import { useEffect, useRef } from 'react';

type Widget = {
  render: (target: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
};

let loading: Promise<Widget> | undefined;

function loadWidget() {
  const browser = window as Window & { turnstile?: Widget };
  if (browser.turnstile) return Promise.resolve(browser.turnstile);
  loading ??= new Promise<Widget>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    const fail = () => {
      window.clearTimeout(timeout);
      script.remove();
      loading = undefined;
      reject(new Error('Turnstile unavailable'));
    };
    const timeout = window.setTimeout(fail, 15000);
    script.onerror = fail;
    script.onload = () => {
      window.clearTimeout(timeout);
      if (browser.turnstile) resolve(browser.turnstile);
      else fail();
    };
    document.head.append(script);
  });
  return loading;
}

export function VisibilityTurnstile({ siteKey, onToken, onError }: {
  siteKey: string;
  onToken: (token: string) => void;
  onError: () => void;
}) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = container.current;
    if (!target) return;
    let remove: (() => void) | undefined;
    let active = true;
    void loadWidget().then((widget) => {
      if (!active) return;
      const id = widget.render(target, {
        sitekey: siteKey,
        action: 'ai_visibility',
        theme: 'dark',
        size: 'flexible',
        callback: (token: string) => { if (active) onToken(token); },
        'expired-callback': () => { if (active) onToken(''); },
        'error-callback': () => { if (active) onError(); },
      });
      remove = () => widget.remove(id);
    }).catch(() => { if (active) onError(); });
    return () => {
      active = false;
      remove?.();
    };
  }, [onError, onToken, siteKey]);

  return <div ref={container} className="min-h-[65px]" />;
}
