import { useState, type FormEvent } from 'react';
import { ArrowRight, Bot, Download, FileArchive, Github, Monitor, Send } from 'lucide-react';
import { RESOURCES, type Resource } from '../resources';

const WEBHOOK_URL = 'https://n8n.sproutify.app/webhook/4a7ce38b-f497-424f-9936-f636f5b68514';

export function ResourcesIndex() {
  return <main className="relative z-10 mx-auto min-h-screen max-w-5xl px-4 pb-24 pt-32 sm:px-6">
    <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600">Free resources</p>
    <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-6xl">Documents and tools you can put to work</h1>
    <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">Practical resources from Sweetwater Technology. Browse the catalog and choose what fits your project.</p>
    <div className="mt-12 grid gap-6 sm:grid-cols-2">
      {RESOURCES.map((resource) => <article key={resource.slug} className="rounded-3xl border border-slate-200 bg-white/85 p-7 shadow-sm">
        {resource.repository ? <Monitor className="h-8 w-8 text-blue-600" aria-hidden="true" /> : <FileArchive className="h-8 w-8 text-blue-600" aria-hidden="true" />}
        <p className="mt-5 text-xs font-bold uppercase tracking-widest text-blue-600">{resource.kind}</p>
        <h2 className="mt-2 text-2xl font-black text-slate-900">{resource.title}</h2>
        <p className="mt-3 leading-7 text-slate-600">{resource.description}</p>
        {resource.video && <video controls playsInline preload="none" poster={resource.poster} aria-label={`${resource.title} demonstration`} className="mt-6 aspect-video w-full rounded-2xl border border-slate-200 bg-slate-50"><source src={resource.video} type="video/mp4" />Your browser does not support this video. <a href={resource.video}>Download the demo</a>.</video>}
        {resource.repository && <a href={resource.repository} target="_blank" rel="noopener noreferrer" className="mt-6 mr-5 inline-flex min-h-12 items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700"><Github size={18} aria-hidden="true" /> View on GitHub<span className="sr-only"> (opens in a new tab)</span></a>}
        <a className="mt-6 inline-flex items-center gap-2 font-bold text-blue-600 hover:text-blue-700" href={`/resources/${resource.slug}`}>View resource <ArrowRight size={18} aria-hidden="true" /></a>
      </article>)}
    </div>
  </main>;
}

function OpenSourceResource({ resource }: { resource: Resource }) {
  return <main className="relative z-10 mx-auto min-h-screen max-w-5xl px-4 pb-24 pt-32 sm:px-6">
    <nav aria-label="Breadcrumb" className="mb-8 text-sm font-semibold text-slate-500"><a href="/resources" className="hover:text-blue-600">Resources</a> <span aria-hidden="true">/</span> {resource.title}</nav>
    <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600">{resource.kind}</p>
    <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-6xl">{resource.title}</h1>
    <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">{resource.description}</p>
    <video controls playsInline preload="metadata" poster={resource.poster} aria-label={`${resource.title} demonstration`} className="mt-9 aspect-video w-full rounded-3xl border border-slate-200 bg-slate-50 shadow-lg"><source src={resource.video} type="video/mp4" />Your browser does not support this video. <a href={resource.video}>Download the demo</a>.</video>
    <p className="mt-3 text-sm text-slate-500">26-second demo with music. Fictional sample chats illustrate the dashboard.</p>
    <div className="mt-10 rounded-3xl border border-white bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-7 shadow-sm sm:p-9">
      <h2 className="text-2xl font-black text-slate-900">Your chats, at a glance</h2>
      <ul className="mt-5 list-disc space-y-3 pl-6 leading-7 text-slate-600">{resource.highlights?.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
      <p className="mt-6 leading-7 text-slate-600">Designed for Windows 11 and the ESP32-2432S028R with an ILI9341 display and XPT2046 touch controller. Uses a local USB helper; no OpenAI API key is required. This unofficial project uses an undocumented Codex desktop interface, so app updates may affect compatibility.</p>
      <a href={resource.repository} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"><Github size={20} aria-hidden="true" /> Get the project on GitHub<span className="sr-only"> (opens in a new tab)</span></a>
    </div>
  </main>;
}

export function ResourceDetail({ resource }: { resource: Resource }) {
  return resource.repository ? <OpenSourceResource resource={resource} /> : <DownloadResourceDetail resource={resource} />;
}

function DownloadResourceDetail({ resource }: { resource: Resource }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [input, setInput] = useState('');
  const [stage, setStage] = useState<'name' | 'email'>('name');
  const [website, setWebsite] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const source = typeof window === 'undefined' ? '' : new URLSearchParams(window.location.search).get('src') || '';

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (website) return;
    const clean = input.trim();
    if (!clean) return;
    if (stage === 'name') {
      setName(clean);
      setInput('');
      setStage('email');
      return;
    }
    setEmail(clean);
    setSending(true);
    setError('');
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: clean,
          subject: `Resource download: ${resource.title}`,
          message: `Requested ${resource.title} (${resource.slug}).${source ? ` Source: ${source}.` : ''}`,
        }),
      });
      if (!response.ok) throw new Error('Unable to save your details right now. Please try again.');
      window.location.assign(`/resources/${resource.slug}/download`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to save your details right now. Please try again.');
      setSending(false);
    }
  }

  return <main className="relative z-10 mx-auto min-h-screen max-w-5xl px-4 pb-24 pt-32 sm:px-6">
    <nav aria-label="Breadcrumb" className="mb-8 text-sm font-semibold text-slate-500"><a href="/resources" className="hover:text-blue-600">Resources</a> <span aria-hidden="true">/</span> {resource.title}</nav>
    <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-start">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600">Free {resource.kind}</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-6xl">{resource.title}</h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">{resource.description}</p>
        <h2 className="mt-10 text-2xl font-black text-slate-900">What the skill helps you do</h2>
        <ul className="mt-4 list-disc space-y-3 pl-6 leading-7 text-slate-600">
          <li>A fact gathering framework for the company, its offerings, audience, team, and proof.</li>
          <li>Guidance for a clear page structure that adapts to the business.</li>
          <li>Implementation checks for readable HTML, links, metadata, and accessibility.</li>
          <li>Practical prompts to gather the right details before writing.</li>
        </ul>
        <p className="mt-7 leading-7 text-slate-600">The skill uses confirmed facts and avoids invented claims. It does not promise search rankings or AI citations.</p>
      </div>
      <form onSubmit={submit} className="overflow-hidden rounded-3xl border border-[#25365f] bg-[#0c1322] shadow-xl">
        <div className="flex items-center gap-3 border-b border-[#25365f] bg-[#111d35] px-6 py-5 text-white"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600"><Bot size={22} aria-hidden="true" /></span><div><h2 className="font-black">Sage</h2><p className="text-xs text-[#aebfe8]">Your resource guide</p></div></div>
        <div aria-live="polite" className="min-h-64 space-y-4 p-6 text-sm leading-6">
          <p className="max-w-[90%] rounded-2xl rounded-tl-sm border border-[#25365f] bg-[#172541] px-4 py-3 text-white">Hi, I’m Sage. I can get you the {resource.title}. What should I call you?</p>
          {name && <><p className="ml-auto max-w-[90%] rounded-2xl rounded-tr-sm bg-blue-600 px-4 py-3 text-white">{name}</p><p className="max-w-[90%] rounded-2xl rounded-tl-sm border border-[#25365f] bg-[#172541] px-4 py-3 text-white">Nice to meet you, {name.split(/\s+/)[0]}. What email should I use for this resource?</p></>}
          {email && <p className="ml-auto max-w-[90%] rounded-2xl rounded-tr-sm bg-blue-600 px-4 py-3 text-white">{email}</p>}
          {sending && <p className="text-[#aebfe8]">Getting your download ready…</p>}
        </div>
        <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true"><label htmlFor="resource-website">Website</label><input id="resource-website" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></div>
        <div className="border-t border-[#25365f] p-4">
          <label htmlFor="resource-input" className="sr-only">{stage === 'name' ? 'Your name' : 'Your email'}</label>
          <div className="flex gap-2"><input id="resource-input" name={stage} type={stage === 'email' ? 'email' : 'text'} autoComplete={stage} required maxLength={stage === 'email' ? 254 : 120} value={input} onChange={(event) => setInput(event.target.value)} placeholder={stage === 'name' ? 'Your name' : 'Your email'} className="min-w-0 flex-1 rounded-xl border border-[#365080] bg-[#15213b] px-4 py-3 text-white placeholder:text-[#8fa4d9] focus:border-blue-500 focus:outline-none" /><button disabled={sending || !input.trim()} aria-label="Send to Sage" className="grid h-12 w-12 place-items-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"><Send size={18} aria-hidden="true" /></button></div>
          {error && <p role="alert" className="mt-3 text-sm font-semibold text-red-300">{error}</p>}
          <p className="mt-3 text-xs leading-5 text-[#9cafda]">We’ll use these details to follow up about this resource. This does not subscribe you to a mailing list.</p>
        </div>
      </form>
    </div>
  </main>;
}

export function ResourceDownload({ resource }: { resource: Resource }) {
  if (resource.repository) return <OpenSourceResource resource={resource} />;
  return <main className="relative z-10 mx-auto min-h-screen max-w-3xl px-4 pb-24 pt-32 sm:px-6">
    <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600">Your resource</p>
    <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-6xl">{resource.title}</h1>
    <p className="mt-6 text-lg leading-8 text-slate-600">Thanks for your interest. The ZIP includes the Codex <code>SKILL.md</code> and its companion reference prompts. Extract the folder, then install the skill in your Codex skills directory to use it across projects.</p>
    <a href={resource.file} download className="mt-9 inline-flex min-h-12 items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"><Download size={18} aria-hidden="true" /> Download ZIP</a>
    <p className="mt-8 text-sm text-slate-600"><a href="/resources" className="font-bold text-blue-600 hover:text-blue-700">Browse more resources</a></p>
  </main>;
}
