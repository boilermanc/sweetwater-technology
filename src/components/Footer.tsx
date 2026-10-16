import { ArrowUpRight, Mail } from 'lucide-react';
import { SweetwaterLogo } from './SweetwaterLogo';

const groups = [
  { title: 'Work with us', links: [['Services', '/services'], ['Custom web apps', '/services/custom-web-applications'], ['AI helpers', '/services/ai-workflow-automation'], ['Mobile apps', '/services/mobile-app-development'], ['Have an app idea?', '/app-idea?src=footer']] },
  { title: 'Explore', links: [['About Sweetwater', '/about'], ['Our work', '/work'], ['News', '/news'], ['Headwaters', '/headwaters/'], ['Continuum', '/headwaters/continuum/']] },
  { title: 'Start here', links: [['Free resources', '/resources'], ['Try AI This Week', '/resources/try-ai-this-week'], ['Download the free AI guide', '/downloads/try-ai-this-week.pdf'], ['Explore practical AI', '/ai-help?src=footer'], ['Client login', '/portal']] },
];

export function Footer() {
  return <footer id="site-footer" className="relative z-10 border-t border-blue-100 bg-slate-50 px-5 pb-8 pt-14 sm:px-8 sm:pt-16">
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <a href="/" aria-label="Sweetwater Technology home" className="inline-block rounded-lg focus-visible:outline-2 focus-visible:outline-blue-600"><SweetwaterLogo markClassName="h-10 w-10" /></a>
          <p className="mt-5 max-w-xs leading-7 text-slate-600">Less busywork. Better follow-through.<br />Software built around your business.</p>
          <a href="/#contact-form" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700">Contact us <ArrowUpRight size={17} aria-hidden="true" /></a>
          <a href="mailto:team@sweetwater.technology" className="mt-4 flex min-h-11 w-fit items-center gap-2 break-all text-sm font-semibold text-blue-700 hover:underline"><Mail size={17} className="shrink-0" aria-hidden="true" />team@sweetwater.technology</a>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">{groups.map(group => <nav key={group.title} aria-label={'Footer: ' + group.title}><h2 className="text-sm font-extrabold text-slate-900">{group.title}</h2><ul className="mt-4 space-y-1">{group.links.map(([label, href]) => <li key={href}><a href={href} className="inline-flex min-h-10 items-center rounded text-sm text-slate-600 hover:text-blue-700 hover:underline focus-visible:outline-2 focus-visible:outline-blue-600">{label}</a></li>)}</ul></nav>)}</div>
      </div>
      <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Sweetwater Technology LP. All rights reserved.</p>
        <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-2"><a href="/terms" className="inline-flex min-h-10 items-center hover:text-blue-700 hover:underline">Terms <span className="ml-1">(draft)</span></a><a href="/privacy" className="inline-flex min-h-10 items-center hover:text-blue-700 hover:underline">Privacy <span className="ml-1">(draft)</span></a></nav>
      </div>
    </div>
  </footer>;
}
