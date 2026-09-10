import { ArrowLeft, ArrowUpRight, Bot, CheckCircle2, ScanLine } from 'lucide-react';
import { SweetwaterLogo } from '../components/SweetwaterLogo';
import { SEGMENTS, SEGMENT_ORDER, type SegmentId } from '../data/segments';

const TEST_CASES: Array<{ id: SegmentId | 'default'; title: string; note: string }> = [
  { id: 'default', title: 'Default / just curious', note: 'General Sweetwater portfolio and custom-build positioning.' },
  { id: 'agtech', title: 'Farming and agriculture', note: 'Sproutify Farm, School, Micro, Home, and ATL Urban Farms.' },
  { id: 'inspection', title: 'Home inspection', note: 'SpectIQ early-access positioning and verified FAQs.' },
  { id: 'freight', title: 'Freight and logistics', note: 'LaneWise draft-only quoting workflow.' },
  { id: 'mobile', title: 'Mobile products', note: 'Rejoice, Rekkrd, and Sproutify Home.' },
  { id: 'custom', title: 'Custom software', note: 'Services-led page for unmatched business workflows.' },
];

const testHref = (id: SegmentId | 'default') => {
  const params = new URLSearchParams({ test: '1', b: `test-${id}` });
  if (id !== 'default') params.set('segment', id);
  return `/card?${params.toString()}`;
};

export function CardTestPage() {
  return (
    <div className="min-h-screen bg-[#0c1322] text-white selection:bg-[#2e5ce6]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(46,92,230,.2),transparent_32%),radial-gradient(circle_at_85%_65%,rgba(74,102,170,.12),transparent_28%)]" />
      <header className="relative mx-auto flex max-w-5xl items-center justify-between px-5 py-6 sm:px-8">
        <a href="/" aria-label="Sweetwater Technology home" className="shrink-0"><SweetwaterLogo reversed markClassName="h-9 w-9" className="[&>span:last-child]:hidden min-[360px]:[&>span:last-child]:flex" /></a>
        <a href="/card?test=1" className="inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-bold text-[#aebfe8] hover:text-white"><ArrowLeft size={16} /> <span className="hidden min-[360px]:inline">Back to </span>landing page</a>
      </header>

      <main className="relative mx-auto max-w-5xl px-5 pb-20 pt-12 sm:px-8 sm:pt-20">
        <div className="max-w-3xl">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.22em] text-[#7897ea]"><ScanLine size={15} /> Card landing QA</p>
          <h1 className="mt-5 text-4xl font-bold tracking-[-.045em] sm:text-6xl">Open every landing-page experience.</h1>
          <p className="mt-6 text-lg leading-8 text-[#aebfe8]">Each link opens in a new tab with the intended Sage segment already selected. Test mode prevents these visits from creating card-scan alerts in Slack.</p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {TEST_CASES.map((testCase) => {
            const segment = testCase.id === 'default' ? SEGMENTS.custom : SEGMENTS[testCase.id];
            return (
              <a key={testCase.id} href={testHref(testCase.id)} target="_blank" rel="noreferrer" className="group flex min-h-52 flex-col rounded-2xl border border-[#26385f] bg-[#101a30] p-6 transition hover:-translate-y-1 hover:border-[#526a9d] hover:shadow-[0_20px_55px_rgba(2,7,18,.28)]">
                <div className="flex items-start justify-between gap-4"><span className="rounded-full border border-[#314878] bg-[#14213b] px-3 py-1 text-xs font-bold text-[#91adf5]">{testCase.id === 'default' ? 'Default' : segment.chipLabel}</span><ArrowUpRight className="text-[#7085b4] transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white" /></div>
                <h2 className="mt-5 text-xl font-bold">{testCase.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[#9cafda]">{testCase.note}</p>
                <span className="mt-auto flex items-center gap-2 pt-6 text-sm font-bold text-white"><CheckCircle2 size={16} className="text-[#7897ea]" /> Open test page</span>
              </a>
            );
          })}
        </div>

        <section className="mt-8 rounded-2xl border border-[#26385f] bg-[#0f192d] p-6">
          <div className="flex items-center gap-3"><Bot className="text-[#7897ea]" /><h2 className="text-lg font-bold">What to check</h2></div>
          <ul className="mt-4 grid gap-3 text-sm leading-6 text-[#aebfe8] sm:grid-cols-2">
            <li>Correct headline and product order</li><li>Sage opens and keeps conversation history</li><li>Product FAQs match the selected audience</li><li>Buttons reach the correct product destination</li>
          </ul>
        </section>

        <p className="mt-8 text-xs text-[#6578a3]">Segments available: {SEGMENT_ORDER.join(', ')}</p>
      </main>
    </div>
  );
}
