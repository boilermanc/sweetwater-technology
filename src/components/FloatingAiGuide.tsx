import { useEffect, useState } from 'react';
import { ArrowUpRight, Droplets, X } from 'lucide-react';

export function FloatingAiGuide() {
  const [dismissed, setDismissed] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);

  useEffect(() => {
    const targets = [document.getElementById('contact-form'), document.getElementById('site-footer')].filter((element): element is HTMLElement => !!element);
    const visible = new Set<Element>();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      setContactVisible(visible.size > 0);
    });
    targets.forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  if (dismissed || contactVisible) return null;
  return <aside aria-label="Free AI guide" className="fixed right-4 z-30 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-blue-500 bg-blue-600 shadow-xl shadow-blue-950/25" style={{ bottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
    <button type="button" onClick={() => setDismissed(true)} aria-label="Dismiss free AI guide" className="absolute right-1 top-1 grid h-10 w-10 place-items-center rounded-full text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-white"><X size={17} aria-hidden="true" /></button>
    <a href="/downloads/try-ai-this-week.pdf" target="_blank" rel="noopener noreferrer" className="block rounded-2xl p-4 pr-11 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700">
      <span className="flex items-center gap-2 text-base font-extrabold text-white"><Droplets size={20} aria-hidden="true" />New to AI? Dip your toe in →</span>
      <span className="mt-2 block text-sm leading-5 text-white">Our free guide: five things to try this week with free tools.</span>
      <span className="mt-2 flex items-center gap-1 text-xs font-bold text-white">Open the free PDF <ArrowUpRight size={14} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></span>
    </a>
  </aside>;
}
