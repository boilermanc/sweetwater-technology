import { createElement, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Download, ExternalLink, Monitor, Usb } from 'lucide-react';
import type { Resource } from '../resources';

const ASSETS = '/downloads/crowes-nest/0.3.0-preview.2';
const steps = ['Before you begin', 'Connect & install', 'Connect Codex', 'Make it yours'];
const buttonClass = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-45';
const secondaryClass = 'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-bold text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600';

let installerPromise: Promise<void> | undefined;
function loadInstaller() {
  if (!installerPromise) {
    installerPromise = new Promise<void>((resolve, reject) => {
      if (customElements.get('esp-web-install-button')) { resolve(); return; }
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://unpkg.com/esp-web-tools@10.1.1/dist/web/install-button.js?module';
      const timer = window.setTimeout(() => { script.remove(); reject(new Error('Installer load timed out.')); }, 20000);
      script.onload = () => {
        if (customElements.get('esp-web-install-button')) { window.clearTimeout(timer); resolve(); }
        else { window.clearTimeout(timer); script.remove(); reject(new Error('Installer unavailable.')); }
      };
      script.onerror = () => { window.clearTimeout(timer); script.remove(); reject(new Error('Installer unavailable.')); };
      document.head.appendChild(script);
    }).catch((error: unknown) => { installerPromise = undefined; throw error; });
  }
  return installerPromise;
}

export function CrowesNestSetup({ resource }: { resource: Resource }) {
  const [step, setStep] = useState(0);
  const [board, setBoard] = useState(false);
  const [windows, setWindows] = useState(false);
  const [consent, setConsent] = useState(false);
  const [mode, setMode] = useState<'install' | 'update'>('install');
  const [installer, setInstaller] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [supported, setSupported] = useState<boolean | null>(null);
  const [tested, setTested] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const canFlash = board && windows && consent && supported === true;

  useEffect(() => { setSupported(window.isSecureContext && 'serial' in navigator); }, []);

  function navigate(next: number) {
    setStep(next);
    requestAnimationFrame(() => heading.current?.focus());
  }

  async function prepare() {
    if (!canFlash || installer === 'loading') return;
    setInstaller('loading');
    try {
      const response = await fetch(`${ASSETS}/${mode}.json`);
      if (!response.ok || !response.headers.get('content-type')?.includes('json')) throw new Error('Missing firmware');
      const manifest = await response.json();
      if (manifest.name !== "Crowe's Nest" || !manifest.builds?.length) throw new Error('Invalid manifest');
      await loadInstaller();
      setInstaller('ready');
    } catch { setInstaller('error'); }
  }

  return <main className="relative z-10 mx-auto min-h-screen max-w-6xl px-4 pb-24 pt-28 sm:px-6 sm:pt-32">
    <a href="/resources" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600"><ArrowLeft size={16} aria-hidden="true" /> All resources</a>
    <div className="mt-7 grid items-center gap-8 lg:grid-cols-[1.1fr_1fr]">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">Sweetwater Technology · Open-source hardware</p>
        <h1 className="mt-4 text-5xl font-black tracking-tight text-slate-900 sm:text-7xl">Crowe’s Nest</h1>
        <p className="mt-5 text-2xl font-semibold tracking-tight text-slate-800">Your agents, at a glance.</p>
        <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">Give your Codex chats a place on your desk. We’ll walk you from a new CYD board to live status, with no code to compile.</p>
        <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold text-slate-600"><span className="rounded-full bg-white px-3 py-2 ring-1 ring-slate-200">Windows 11</span><span className="rounded-full bg-white px-3 py-2 ring-1 ring-slate-200">USB connected</span><span className="rounded-full bg-white px-3 py-2 ring-1 ring-slate-200">No API key</span></div>
      </div>
      <figure className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 shadow-lg">
        <video controls playsInline preload="none" poster={resource.poster} aria-label="Crowe’s Nest dashboard demonstration" className="aspect-video w-full"><source src={resource.video} type="video/mp4" /><a href={resource.video}>Download the demonstration</a></video>
        <figcaption className="px-5 py-3 text-xs leading-5 text-slate-300">Illustrated dashboard demo with fictional chats. Includes music.</figcaption>
      </figure>
    </div>

    <div className="mt-12 rounded-3xl border border-slate-200 bg-white shadow-sm" id="setup">
      <div className="border-b border-slate-200 px-6 py-5 sm:px-9"><p className="font-bold text-slate-900">Let’s set up your Nest</p><p className="mt-1 text-sm text-slate-500">Preview release 0.3.0-preview.2 · For the ESP32-2432S028R only</p></div>
      <div className="grid lg:grid-cols-[230px_1fr]">
        <nav aria-label="Setup steps" className="border-b border-slate-200 p-4 lg:border-b-0 lg:border-r lg:p-6">
          <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">{steps.map((label, index) => <li key={label}><button type="button" onClick={() => navigate(index)} aria-current={step === index ? 'step' : undefined} className={`flex min-h-14 w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold focus-visible:outline-2 focus-visible:outline-blue-600 ${step === index ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}><span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${step === index ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>{index + 1}</span>{label}</button></li>)}</ol>
          <p className="mt-5 hidden text-xs leading-6 text-slate-500 lg:block">The website installs the board firmware. A small Windows helper keeps your chats connected after you close this page.</p>
        </nav>
        <section aria-labelledby="setup-heading" className="min-w-0 px-6 py-8 sm:px-9">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Step {step + 1} of 4</p>
          <h2 ref={heading} tabIndex={-1} id="setup-heading" className="mt-3 text-3xl font-black tracking-tight text-slate-900 outline-none">{steps[step]}</h2>
          {step === 0 && <>
            <p className="mt-5 leading-7 text-slate-600">Start on the Windows computer where you use Codex. Have your board and a USB <strong>data</strong> cable nearby. You don’t need to plug it in yet.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl bg-slate-50 p-5"><Monitor className="text-blue-600" aria-hidden="true" /><h3 className="mt-3 font-bold">Your computer</h3><p className="mt-2 text-sm leading-6 text-slate-600">Windows 11, Codex desktop, and Chrome or Edge. Mac setup is not supported yet.</p></div><div className="rounded-2xl bg-slate-50 p-5"><Usb className="text-blue-600" aria-hidden="true" /><h3 className="mt-3 font-bold">Your board</h3><p className="mt-2 text-sm leading-6 text-slate-600">ESP32-2432S028R / ESP-WROOM-32, ILI9341 display, XPT2046 touch, 4 MB flash.</p></div></div>
            <p className="mt-5 text-sm leading-6 text-slate-600">Check the model printed on the board and your seller’s display specification. Similar-looking ST7789 and ESP32-S3 boards need different firmware. The installer cannot identify your display controller.</p>
            <div className="mt-6 space-y-3"><label className="flex min-h-11 cursor-pointer items-start gap-3"><input type="checkbox" checked={board} onChange={event => setBoard(event.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-blue-600" /><span>I checked: my board matches all the hardware specifications above.</span></label><label className="flex min-h-11 cursor-pointer items-start gap-3"><input type="checkbox" checked={windows} onChange={event => setWindows(event.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-blue-600" /><span>I’m setting this up on Windows 11 with Codex desktop.</span></label></div>
            <button className={`${buttonClass} mt-6`} disabled={!board || !windows} onClick={() => navigate(1)}>Ready to plug in <ArrowRight size={18} aria-hidden="true" /></button>
          </>}
          {step === 1 && <>
            <p className="mt-5 leading-7 text-slate-600"><strong>Plug in your CYD now.</strong> Connect it directly to your computer with a data cable. Stop any existing USB helper and close other serial tools first.</p>
            {(!board || !windows) && <p role="status" className="mt-5 rounded-xl bg-amber-50 p-4 text-amber-900">Confirm your board and computer in <button className="font-bold underline" onClick={() => navigate(0)}>Before you begin</button> to enable installation.</p>}
            <fieldset className="mt-6 space-y-3"><legend className="mb-3 font-bold">What are you installing?</legend><label className="flex items-start gap-3"><input type="radio" name="install-mode" checked={mode === 'install'} onChange={() => { setMode('install'); setConsent(false); setInstaller('idle'); }} className="mt-1 h-5 w-5 shrink-0 accent-blue-600" /><span><strong>First install</strong><span className="mt-1 block text-sm text-slate-600">New board, or replacing another project. Installs the complete firmware.</span></span></label><label className="flex items-start gap-3"><input type="radio" name="install-mode" checked={mode === 'update'} onChange={() => { setMode('update'); setConsent(false); setInstaller('idle'); }} className="mt-1 h-5 w-5 shrink-0 accent-blue-600" /><span><strong>Update this dashboard</strong><span className="mt-1 block text-sm text-slate-600">Only for the existing Sweetwater Codex CYD Dashboard with its original partition layout. Updates the application.</span></span></label></fieldset>
            <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-950"><input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-amber-700" /><span>{mode === 'install' ? 'I understand this replaces the board’s existing firmware and can reset saved settings or pairing. I have backed up anything I need.' : 'I confirm this board already runs the Sweetwater dashboard. I will leave “Erase device” unchecked to preserve settings.'}</span></label>
            <div className="mt-6" aria-live="polite">
              {supported === false ? <p className="rounded-xl bg-slate-100 p-4 text-sm leading-6">USB installation is unavailable in this browser or connection. Open this page in Chrome or Edge on Windows using HTTPS. You can still read the guide here.</p> : installer === 'ready' && canFlash ? createElement('esp-web-install-button', { key: mode, manifest: `${ASSETS}/${mode}.json` }, <button slot="activate" className={buttonClass}>Connect board & install</button>, <span slot="unsupported">Open this page in Chrome or Edge on Windows.</span>, <span slot="not-allowed">Open the secure HTTPS version of this page.</span>) : <button className={buttonClass} disabled={!canFlash || installer === 'loading'} onClick={prepare}>{installer === 'loading' ? 'Preparing installer…' : installer === 'error' ? 'Retry loading installer' : 'Prepare browser installer'}</button>}
              {installer === 'error' && <p role="alert" className="mt-3 text-sm text-red-700">The installer or firmware could not load. Check your connection and retry. Nothing has been flashed.</p>}
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">In the browser’s USB picker, choose the board you just connected. Keep it plugged in until installation finishes. The board should restart and show Crowe’s Nest.</p>
            <p className="mt-3 text-sm leading-6 font-semibold text-slate-800">When finished, close the installer dialog and any serial console to release the USB port before starting the Windows helper.</p>
            <button className={`${secondaryClass} mt-6`} onClick={() => navigate(2)}>My board is ready — next <ArrowRight size={18} aria-hidden="true" /></button>
          </>}
          {step === 2 && <>
            <p className="mt-5 leading-7 text-slate-600">The desktop helper connects your local Codex chats to the board. It includes its own runtime: no Python, terminal commands, API keys, or Wi-Fi setup.</p>
            <a className={`${buttonClass} mt-6`} href={`${ASSETS}/CrowesNest.exe`} download><Download size={18} aria-hidden="true" /> Download Windows helper</a>
            <p className="mt-3 text-xs leading-6 text-slate-500">Windows x64 · Preview build · Unsigned executable. If Windows or your organization blocks it, stop and use the source instructions or contact us; do not disable security protections.</p>
            <ol className="mt-6 list-decimal space-y-4 pl-5 leading-7 text-slate-600"><li>Close the web installer so the helper can use the USB port. Keep the board plugged in.</li><li>Open <strong>CrowesNest.exe</strong>, then open Codex desktop.</li><li>Select the CYD’s COM port and choose <strong>Verify board and start helper</strong>. The app checks its identity before sending chat information.</li><li>Optionally select <strong>Start the helper when I sign in to Windows</strong> and save that preference.</li></ol>
            <p className="mt-5 text-sm leading-6 text-slate-600">After verification, the app saves a copy in your Windows user profile. You can close this page and the setup window; the helper continues in the background. Reopen the app to stop it or change startup settings.</p>
            <button className={`${secondaryClass} mt-6`} onClick={() => navigate(3)}>Continue to the connection test <ArrowRight size={18} aria-hidden="true" /></button>
          </>}
          {step === 3 && <>
            <p className="mt-5 leading-7 text-slate-600">The helper window should report that your board is receiving updates. Check the screen on the CYD to finish setup.</p>
            <ul className="mt-6 space-y-4 text-slate-600"><li><strong className="text-slate-900">See your chats.</strong> Choose the screen orientation, calibrate touch, then tap Finish setup on the board. Incoming updates will not skip these steps. Start a local Codex chat if none appear afterward.</li><li><strong className="text-slate-900">Tap a card.</strong> That exact chat should open on your computer.</li><li><strong className="text-slate-900">Set the screen direction.</strong> Tap BOOT to rotate. Hold BOOT to start touch calibration if taps miss.</li></ul>
            <p className="mt-5 text-sm leading-6 text-slate-600">The USB dashboard works without Bluetooth. Actions and Navigate are optional Bluetooth features with separate pairing. Remote and cloud chats are not supported.</p>
            <label className="mt-6 flex cursor-pointer items-start gap-3"><input type="checkbox" checked={tested} onChange={event => setTested(event.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-blue-600" /><span>I see my chats and tapping a card opens the correct chat.</span></label>
            {tested && <div role="status" className="mt-6 flex items-start gap-3 rounded-2xl bg-emerald-50 p-5 text-emerald-900"><Check className="shrink-0" aria-hidden="true" /><div><p className="font-bold">Your Nest is ready.</p><p className="mt-1 text-sm leading-6">You can close this page. Keep the CYD plugged in, the helper running, and Codex open.</p></div></div>}
            <p className="mt-4 text-xs text-slate-500">This checklist uses your confirmation. The website does not read your Codex chats or verify the desktop helper remotely.</p>
          </>}
        </section>
      </div>
    </div>

    <section className="mt-10 grid gap-8 lg:grid-cols-[1fr_2fr]" aria-labelledby="help-heading">
      <div><h2 id="help-heading" className="text-2xl font-black text-slate-900">A little help getting connected</h2><p className="mt-3 text-sm leading-7 text-slate-600">No accounts to create. Chat information stays on your computer and the board. This unofficial integration may need updates when Codex changes.</p></div>
      <div className="space-y-3">{[
        ['No USB device appears', 'Try another USB data cable and a direct USB port. Check Windows Device Manager. If a serial driver is missing, use the driver specified by your board vendor for its USB chip.'],
        ['The installer cannot connect', 'Stop the desktop helper and close all serial tools. Check the selected port. If necessary, hold BOOT while connecting, then release it once flashing starts.'],
        ['The helper cannot connect', 'Close the browser installer and serial console. Stop any older USB helper before starting this one. Reopen the setup app and refresh the ports if you moved the USB cable.'],
        ['USB is connected, but chats are missing or stale', 'Keep Codex desktop open on the same Windows account. Start a local chat and check the helper status. Stale or Unknown means current status is unavailable, not that a task has finished.'],
        ['I want to update or remove the helper', 'Stop the helper in its setup window before updating. To remove it, first uncheck sign-in startup and save, then stop the helper and close the app. Delete the Sweetwater/CrowesNest folder under your Windows LocalAppData folder.'],
      ].map(([title, body]) => <details key={title} className="rounded-2xl border border-slate-200 bg-white px-5 py-4"><summary className="cursor-pointer py-1 font-bold text-slate-800">{title}</summary><p className="mt-3 text-sm leading-7 text-slate-600">{body}</p></details>)}</div>
    </section>
    <footer className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-slate-200 pt-6 text-sm font-semibold text-blue-600"><a href={resource.repository} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">Source & manual setup <ExternalLink size={14} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a><a href={`${ASSETS}/SHA256SUMS.txt`}>Download checksums</a><a href={`${resource.repository}/blob/main/docs/INSTALL.md`} target="_blank" rel="noopener noreferrer">Backup & recovery<span className="sr-only"> (opens in a new tab)</span></a></footer>
  </main>;
}
