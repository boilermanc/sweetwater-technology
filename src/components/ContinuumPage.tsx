import React from 'react';
import {
  ArrowDown,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  CircleDot,
  Database,
  Eye,
  FileCheck2,
  Fingerprint,
  GitBranch,
  KeyRound,
  Network,
  RefreshCcw,
  ShieldCheck,
  UserRound,
  Workflow,
  XCircle,
} from 'lucide-react';

const hierarchy = [
  { number: '01', title: 'The person is the principal', detail: 'The beneficiary and source of governing terms—not an account trapped inside an agent.', icon: UserRound, tone: 'border-blue-200 bg-blue-50 text-blue-950' },
  { number: '02', title: 'Continuity is the promise', detail: 'Selected goals, context, decisions, and boundaries persist as models and interfaces change.', icon: BrainCircuit, tone: 'border-violet-200 bg-violet-50 text-violet-950' },
  { number: '03', title: 'Delegation is the spine', detail: 'Each actor receives bounded access for a named purpose, scope, recipient, and duration.', icon: Workflow, tone: 'border-cyan-200 bg-cyan-50 text-cyan-950' },
  { number: '04', title: 'Governance is the machinery', detail: 'Policy, evidence, consent, audit, commitment, and revocation keep continuity under human terms.', icon: ShieldCheck, tone: 'border-emerald-200 bg-emerald-50 text-emerald-950' },
];

const authorityFlow = [
  { short: 'Intent', title: 'A person states a goal', detail: 'Outcome, priorities, exclusions', tone: 'bg-blue-600 text-white' },
  { short: 'Continuity', title: 'Relevant state is selected', detail: 'Context, decisions, constraints', tone: 'bg-violet-600 text-white' },
  { short: 'Policy', title: 'Permitted use is evaluated', detail: 'Actor, purpose, data, conditions', tone: 'bg-slate-900 text-white' },
  { short: 'Delegation', title: 'Bounded authority is issued', detail: 'Scope, recipient, expiry, revocation', tone: 'bg-cyan-600 text-white' },
  { short: 'Work', title: 'An agent or service operates', detail: 'Only within the active grant', tone: 'bg-white text-slate-950 border border-slate-300' },
  { short: 'Evidence', title: 'A proposal returns', detail: 'Sources, freshness, limitations', tone: 'bg-amber-100 text-amber-950 border border-amber-300' },
  { short: 'Decision', title: 'The person decides', detail: 'Approve, revise, reject, or expire', tone: 'bg-emerald-100 text-emerald-950 border border-emerald-300' },
];

const invariants = [
  ['01', 'Description is not authority', 'Facts, preferences, goals, memories, and prior decisions may inform work. None grants permission by itself.'],
  ['02', 'Policy evaluates; delegation grants', 'A rule may permit a grant to be issued quietly, but every exercise of agent authority resolves to an active delegation.'],
  ['03', 'Consent and commitment are separate', 'Selecting a proposal does not mint a reusable credential. Consequential execution needs its own bounded authority.'],
  ['04', 'Continuity is semantic', 'A receiving system must distinguish current intent, historical decision, soft preference, hard constraint, evidence, and authority.'],
  ['05', 'Evidence must fit the next decision', 'A claim sufficient for a proposal may be insufficient for commitment. Material facts are revalidated when required.'],
  ['06', 'Proposals cannot execute themselves', 'A proposal explains evidence, assumptions, disclosures, and consequences. It carries no implied execution authority.'],
  ['07', 'Revocation is precise', 'Continuum distinguishes local effect, downstream request, acknowledgement, uncertainty, and data already disclosed.'],
  ['08', 'Responsibility follows control', 'Builders, operators, integrators, and services remain accountable for the controls and representations they actually own.'],
  ['09', 'Boundaries exist before failure', 'Authority provenance is preventive infrastructure—not merely a record used to reconstruct blame afterward.'],
  ['10', 'The destination comes first', 'The person or originating application identifies where work continues before Continuum evaluates the transfer. Continuum does not choose a worker from an agent pool.'],
  ['11', 'Continuity is projected, not shared', 'Each named recipient receives a separate purpose-limited view. Agents do not share direct access to one mutable conversation or project store.'],
  ['12', 'Runtime output remains proposed', 'Evidence, proposals, and proposed changes pass through an acceptance transition. State changes never silently trigger another runtime.'],
];

const semanticObjects = [
  { title: 'Intent', metadata: 'purpose · priority · exclusions · status', color: 'bg-blue-600', icon: CircleDot },
  { title: 'Preference', metadata: 'context · strength · source · revision', color: 'bg-violet-600', icon: BrainCircuit },
  { title: 'Decision', metadata: 'outcome · rationale · scope · reversibility', color: 'bg-fuchsia-600', icon: GitBranch },
  { title: 'Evidence', metadata: 'claim · origin · freshness · limitation', color: 'bg-amber-500', icon: FileCheck2 },
  { title: 'Policy', metadata: 'rule · conditions · priority · exceptions', color: 'bg-slate-800', icon: ShieldCheck },
  { title: 'Delegation', metadata: 'actor · action · data · expiry · status', color: 'bg-cyan-600', icon: KeyRound },
  { title: 'Consent', metadata: 'consequence · decision · assurance · time', color: 'bg-emerald-600', icon: Fingerprint },
];

const provenanceNodes = [
  { title: 'Request', detail: 'Who asked for what?', icon: CircleDot },
  { title: 'Policy evaluation', detail: 'Which version and inputs?', icon: ShieldCheck },
  { title: 'Delegation', detail: 'What authority was active?', icon: KeyRound },
  { title: 'Context disclosure', detail: 'Which subset went where?', icon: Eye },
  { title: 'Evidence', detail: 'What supported the proposal?', icon: FileCheck2 },
  { title: 'Proposal', detail: 'What was presented?', icon: BrainCircuit },
  { title: 'Outcome', detail: 'What happened afterward?', icon: CheckCircle2 },
];

const revocationStates = [
  ['Sweetwater stopped', 'The grant is no longer valid inside Continuum.', 'bg-blue-300'],
  ['Local enforcement confirmed', 'Sweetwater-controlled tokens and adapters reject it.', 'bg-cyan-300'],
  ['Downstream requested', 'An external revocation or deletion request was sent.', 'bg-violet-300'],
  ['Acknowledged or uncertain', 'The external boundary confirmed—or has not yet confirmed—the request.', 'bg-amber-300'],
  ['Prior disclosure remains external', 'Previously shared data may remain under the recipient’s rules.', 'bg-slate-300'],
];

const productProof = [
  ['01', 'Begin a real project', 'One person starts a proposal-first planning or evaluation project with explicit goals and exclusions.'],
  ['02', 'Form governed project state', 'Continuum separates constraints, preferences, prior decisions, evidence, unresolved questions, and permitted work.'],
  ['03', 'Name the recipient', 'The person chooses where work continues before Continuum evaluates disclosure or delegation.'],
  ['04', 'Project, do not share', 'The named runtime receives a recipient-bound project view—not a transcript dump or direct access to shared canonical state.'],
  ['05', 'Return proposed work', 'Evidence, limitations, assumptions, rationale, and proposed changes return through a separate acceptance boundary.'],
  ['06', 'Inspect and stop', 'The person can correct state, narrow access, expire the project, or revoke remaining authority.'],
];

const transferFlow = [
  { number: '01', title: 'Name the destination', detail: 'The person or originating application chooses the receiving runtime first.', icon: UserRound, tone: 'border-blue-200 bg-blue-50 text-blue-950' },
  { number: '02', title: 'Evaluate the transfer', detail: 'Governance checks disclosure, purpose, use limits, and delegation for that named recipient.', icon: ShieldCheck, tone: 'border-slate-300 bg-white text-slate-950' },
  { number: '03', title: 'Create a projection', detail: 'Continuum produces a separate minimum-necessary project view bound to one recipient.', icon: Eye, tone: 'border-violet-200 bg-violet-50 text-violet-950' },
  { number: '04', title: 'Delegate fresh authority', detail: 'The runtime receives no inherited authority and must obtain its own bounded grant.', icon: KeyRound, tone: 'border-cyan-200 bg-cyan-50 text-cyan-950' },
  { number: '05', title: 'Return proposed state', detail: 'Output remains evidence, a proposal, or a proposed change until separately accepted.', icon: GitBranch, tone: 'border-emerald-200 bg-emerald-50 text-emerald-950' },
];

const SectionIntro: React.FC<{ eyebrow: string; title: string; body: string; dark?: boolean }> = ({ eyebrow, title, body, dark }) => (
  <div className="max-w-3xl">
    <p className={`text-xs font-black uppercase tracking-[0.3em] ${dark ? 'text-blue-300' : 'text-blue-600'}`}>{eyebrow}</p>
    <h2 className={`mt-4 text-4xl font-black tracking-[-0.04em] sm:text-6xl ${dark ? 'text-white' : 'text-slate-950'}`}>{title}</h2>
    <p className={`mt-6 text-lg leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-600'}`}>{body}</p>
  </div>
);

export const ContinuumPage: React.FC = () => (
  <main className="relative z-10 overflow-hidden pb-24 pt-24 text-slate-950">
    <section className="relative border-b border-slate-200 px-4 pb-20 pt-20 sm:px-6 sm:pb-28 sm:pt-28">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_15%,rgba(37,99,235,0.16),transparent_35%),radial-gradient(circle_at_85%_25%,rgba(124,58,237,0.14),transparent_34%),linear-gradient(to_bottom,#ffffff,#f8fafc)]" />
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-14 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.34em] text-blue-600">Sweetwater Continuum · Working thesis</p>
            <h1 className="mt-6 max-w-5xl text-5xl font-black leading-[0.94] tracking-[-0.055em] sm:text-7xl lg:text-[6.6rem]">Governed personal continuity for an agentic world.</h1>
          </div>
          <div className="border-l-2 border-blue-600 pl-6">
            <p className="text-xl font-semibold leading-relaxed text-slate-700">Carry the right goals, decisions, preferences, and boundaries into any AI you choose—without giving it blanket access or control.</p>
            <p className="mt-6 text-sm font-black uppercase tracking-[0.24em] text-slate-900">Your context can follow you. Your authority does not.</p>
          </div>
        </div>
        <div className="mt-16 grid gap-4 border-t border-slate-300 pt-8 sm:grid-cols-3">
          <p className="text-sm font-bold text-slate-500">Agents operate.</p>
          <p className="text-sm font-bold text-slate-500">Continuum persists.</p>
          <p className="text-sm font-bold text-slate-900">The person remains the principal.</p>
        </div>
      </div>
    </section>

    <section className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
        <SectionIntro eyebrow="The human problem" title="AI continuity currently fails in both directions." body="Without continuity, every new system starts with too little. With unrestricted continuity, remembered context can become inferred intent, excessive disclosure, or standing permission." />
        <div className="grid gap-5 sm:grid-cols-2">
          <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <XCircle aria-hidden="true" className="h-9 w-9 text-rose-500" />
            <p className="mt-8 text-xs font-black uppercase tracking-[0.25em] text-rose-600">Too little continuity</p>
            <h3 className="mt-3 text-3xl font-black tracking-tight">The person repeatedly starts over.</h3>
            <p className="mt-5 leading-relaxed text-slate-600">Goals, decisions, constraints, and rationale remain trapped inside individual conversations, products, and interfaces.</p>
          </article>
          <article className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-xl">
            <Database aria-hidden="true" className="h-9 w-9 text-violet-300" />
            <p className="mt-8 text-xs font-black uppercase tracking-[0.25em] text-violet-300">Too much continuity</p>
            <h3 className="mt-3 text-3xl font-black tracking-tight">History quietly becomes authority.</h3>
            <p className="mt-5 leading-relaxed text-slate-300">A preference becomes an instruction, a past decision becomes a default, and broad access outlives the task that justified it.</p>
          </article>
        </div>
      </div>
    </section>

    <section className="border-y border-slate-200 bg-slate-50 px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionIntro eyebrow="The product hierarchy" title="A person-centered stack, in the right order." body="Continuum is not another agent and not a universal memory vault. It is the governed relationship between what should persist and what may act." />
        <ol className="mt-14 grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-stretch">
          {hierarchy.map((item, index) => {
            const Icon = item.icon;
            return <React.Fragment key={item.number}>
              <li className={`rounded-[1.75rem] border p-6 ${item.tone}`}>
                <div className="flex items-center justify-between gap-4"><span className="text-xs font-black tracking-[0.25em] opacity-60">{item.number}</span><Icon aria-hidden="true" className="h-6 w-6" /></div>
                <h3 className="mt-10 text-2xl font-black leading-tight tracking-tight">{item.title}</h3>
                <p className="mt-4 text-sm leading-relaxed opacity-75">{item.detail}</p>
              </li>
              {index < hierarchy.length - 1 && <li aria-hidden="true" className="flex items-center justify-center py-1 text-slate-300 lg:px-1"><ArrowDown className="h-5 w-5 lg:-rotate-90" /></li>}
            </React.Fragment>;
          })}
        </ol>
      </div>
    </section>

    <section className="bg-slate-950 px-4 py-20 text-white sm:px-6 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionIntro eyebrow="The authority flow" title="Understanding and acting are different state transitions." body="Context can help an agent prepare useful work. Authority arrives separately, remains bounded to the task, and cannot be inferred from what the system happens to know." dark />
        <ol className="mt-14 grid gap-3 lg:grid-cols-[repeat(7,minmax(0,1fr))]">
          {authorityFlow.map((item, index) => <li key={item.short} className="relative">
            <div className={`h-full min-h-48 rounded-3xl p-5 ${item.tone}`}>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] opacity-65">{item.short}</p>
              <h3 className="mt-8 text-xl font-black leading-tight">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed opacity-70">{item.detail}</p>
            </div>
            {index < authorityFlow.length - 1 && <ArrowRight aria-hidden="true" className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 rounded-full bg-slate-950 p-1 text-slate-400 lg:block" />}
          </li>)}
        </ol>
        <div className="mt-6 grid gap-4 rounded-3xl border border-emerald-400/25 bg-emerald-400/10 p-6 sm:grid-cols-[auto_1fr] sm:items-center">
          <Fingerprint aria-hidden="true" className="h-10 w-10 text-emerald-300" />
          <p className="font-semibold leading-relaxed text-emerald-50"><strong>Commitment remains a separate rail.</strong> If the product later supports a consequential act, current evidence is rechecked and a narrow, purpose-bound execution authority is created only after the applicable review.</p>
        </div>
      </div>
    </section>

    <section className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionIntro eyebrow="The normative core" title="Twelve rules an implementation cannot violate." body="Interfaces and deployment models may change. These invariants define whether an implementation remains faithful to governed continuity." />
        <div className="mt-14 grid gap-px overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-200 md:grid-cols-2 lg:grid-cols-3">
          {invariants.map(([number, title, detail]) => <article key={number} className="bg-white p-7 sm:p-8">
            <p className="text-xs font-black tracking-[0.3em] text-blue-600">{number}</p>
            <h3 className="mt-8 text-2xl font-black leading-tight tracking-tight">{title}</h3>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">{detail}</p>
          </article>)}
        </div>
      </div>
    </section>

    <section className="border-y border-slate-200 bg-slate-50 px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-14 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          <SectionIntro eyebrow="Semantic continuity" title="Not a transcript. A typed, selective project state." body="Portability is useful only when a receiving system understands both what an object means and the terms under which it may be used." />
          <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-5">
              <div><p className="text-xs font-black uppercase tracking-[0.25em] text-blue-600">Portable project object</p><p className="mt-2 font-bold text-slate-500">Selected state · attributable terms · no implied commitment</p></div>
              <Network aria-hidden="true" className="h-8 w-8 text-slate-300" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {semanticObjects.map((item) => {
                const Icon = item.icon;
                return <article key={item.title} className="flex items-start gap-4 rounded-2xl border border-slate-200 p-4">
                  <div className={`flex h-10 w-10 flex-none items-center justify-center rounded-xl text-white ${item.color}`}><Icon aria-hidden="true" className="h-5 w-5" /></div>
                  <div><h3 className="font-black">{item.title}</h3><p className="mt-1 text-xs leading-relaxed text-slate-500">{item.metadata}</p></div>
                </article>;
              })}
              <article className="flex items-center justify-center rounded-2xl border border-dashed border-rose-300 bg-rose-50 p-4 text-center text-sm font-black text-rose-700">Commitment authority: none</article>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="border-y border-slate-200 bg-slate-950 px-4 py-20 text-white sm:px-6 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionIntro eyebrow="Governed transfer" title="A handoff without a router or shared agent memory." body="Continuum governs a transfer to a destination the person has already chosen. It does not select the best worker, expose one common context store to every agent, or let an agent result silently trigger the next handoff." dark />
        <ol className="mt-14 grid gap-4 lg:grid-cols-5">
          {transferFlow.map((item, index) => {
            const Icon = item.icon;
            return <li key={item.number} className={`relative rounded-[1.75rem] border p-6 ${item.tone}`}>
              <div className="flex items-center justify-between"><span className="text-xs font-black tracking-[0.28em] opacity-60">{item.number}</span><Icon aria-hidden="true" className="h-6 w-6" /></div>
              <h3 className="mt-10 text-2xl font-black leading-tight tracking-tight">{item.title}</h3>
              <p className="mt-4 text-sm leading-relaxed opacity-75">{item.detail}</p>
              {index < transferFlow.length - 1 && <ArrowRight aria-hidden="true" className="absolute -right-3 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 rounded-full bg-slate-950 p-1 text-slate-400 lg:block" />}
            </li>;
          })}
        </ol>
        <div className="mt-8 grid gap-px overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/15 md:grid-cols-3">
          <div className="bg-slate-900 p-6"><p className="text-xs font-black uppercase tracking-[0.24em] text-blue-300">No auto-selection</p><p className="mt-3 text-sm leading-relaxed text-slate-300">Compatibility can be validated, but Continuum does not choose or silently substitute a runtime.</p></div>
          <div className="bg-slate-900 p-6"><p className="text-xs font-black uppercase tracking-[0.24em] text-violet-300">No common context</p><p className="mt-3 text-sm leading-relaxed text-slate-300">Each recipient gets its own scoped projection and cannot directly read canonical project state.</p></div>
          <div className="bg-slate-900 p-6"><p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-300">No auto-merge or handoff</p><p className="mt-3 text-sm leading-relaxed text-slate-300">A separate acceptance transition governs state, and every onward transfer begins with a newly named destination.</p></div>
        </div>
      </div>
    </section>

    <section className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionIntro eyebrow="Authority provenance" title="Why did this actor think it was allowed to do that?" body="Continuum connects the minimum attributable facts needed to govern, explain, revoke, and investigate its own control chain. Provenance records what happened; it does not magically make every external assertion true." />
        <div className="mt-14 grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="relative rounded-[2rem] bg-slate-950 p-6 text-white sm:p-10">
            <div className="absolute bottom-12 left-[2.95rem] top-12 w-px bg-gradient-to-b from-blue-400 via-violet-400 to-emerald-400 sm:left-[4.95rem]" />
            <ol className="relative space-y-4">
              {provenanceNodes.map((item, index) => {
                const Icon = item.icon;
                return <li key={item.title} className="grid grid-cols-[3rem_1fr] items-center gap-4 sm:grid-cols-[5rem_1fr]">
                  <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-slate-900 text-blue-300 shadow-lg sm:mx-auto"><Icon aria-hidden="true" className="h-5 w-5" /></div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex sm:items-center sm:justify-between sm:gap-4"><h3 className="font-black"><span className="mr-3 text-xs text-slate-500">0{index + 1}</span>{item.title}</h3><p className="mt-1 text-sm text-slate-400 sm:mt-0">{item.detail}</p></div>
                </li>;
              })}
            </ol>
          </div>
          <aside className="rounded-[2rem] border border-slate-200 bg-slate-50 p-7 sm:p-9">
            <p className="text-xs font-black uppercase tracking-[0.26em] text-blue-600">Record meaning</p>
            <h3 className="mt-4 text-3xl font-black tracking-tight">Precision instead of a universal “verified” badge.</h3>
            <dl className="mt-8 space-y-5">
              {[
                ['Recorded', 'Continuum captured an event at a stated time.'],
                ['Asserted', 'A named actor claimed a fact or outcome.'],
                ['Source-authenticated', 'The response came through an authenticated origin.'],
                ['Policy-evaluated', 'A specified policy version was applied to stated inputs.'],
                ['Outcome-confirmed', 'Defined evidence established that the named outcome occurred.'],
              ].map(([term, description]) => <div key={term} className="border-t border-slate-200 pt-4 first:border-0 first:pt-0"><dt className="font-black text-slate-900">{term}</dt><dd className="mt-1 text-sm leading-relaxed text-slate-600">{description}</dd></div>)}
            </dl>
          </aside>
        </div>
      </div>
    </section>

    <section className="bg-blue-600 px-4 py-20 text-white sm:px-6 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionIntro eyebrow="Revocation" title="Stop what can be stopped. State honestly what cannot." body="Revocation ends future Sweetwater authority. It does not retroactively erase information already disclosed or prove that every external copy has disappeared." dark />
        <ol className="mt-14 grid gap-4 lg:grid-cols-5">
          {revocationStates.map(([title, detail, color], index) => <li key={title} className="relative rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
            <div className={`h-2 w-12 rounded-full ${color}`} /><p className="mt-8 text-xs font-black tracking-[0.25em] text-blue-200">0{index + 1}</p><h3 className="mt-3 text-xl font-black leading-tight">{title}</h3><p className="mt-3 text-sm leading-relaxed text-blue-100">{detail}</p>
          </li>)}
        </ol>
        <div className="mt-8 flex items-start gap-4 rounded-3xl bg-white p-6 text-slate-950 sm:p-8"><RefreshCcw aria-hidden="true" className="mt-1 h-7 w-7 flex-none text-blue-600" /><p className="leading-relaxed"><strong>User-facing truth:</strong> “This agent’s Sweetwater access stopped immediately. We asked the external service to revoke access. It has not yet confirmed. Information shared earlier may remain under that service’s policies.”</p></div>
      </div>
    </section>

    <section className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionIntro eyebrow="The first product proof" title="One vertical slice should prove the whole loop." body="The first product is a governed project-continuity companion in one recurring decision domain—not a universal profile, permissions console, or autonomous transaction agent." />
        <ol className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {productProof.map(([number, title, detail]) => <li key={number} className="group rounded-[1.75rem] border border-slate-200 bg-white p-7 shadow-sm transition-transform hover:-translate-y-1"><div className="flex items-center justify-between"><span className="text-sm font-black tracking-[0.25em] text-blue-600">{number}</span><ArrowRight aria-hidden="true" className="h-5 w-5 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-blue-600" /></div><h3 className="mt-10 text-2xl font-black tracking-tight">{title}</h3><p className="mt-4 text-sm leading-relaxed text-slate-600">{detail}</p></li>)}
        </ol>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {[
            ['Safety laboratory', 'Stress-test stale evidence, malformed tools, injected content, excessive scope, bypass, and failed revocation.'],
            ['Thesis demonstrator', 'Make selective cross-agent continuity visible through two compatible interfaces.'],
            ['Commercial wedge', 'Solve a recurring job in which accumulated context and decision rationale compound in value.'],
          ].map(([title, detail]) => <article key={title} className="rounded-3xl bg-slate-100 p-6"><h3 className="font-black text-slate-900">{title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">{detail}</p></article>)}
        </div>
      </div>
    </section>

    <section className="border-y border-slate-200 bg-slate-50 px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-2">
          <article className="rounded-[2rem] border border-slate-200 bg-white p-8 sm:p-10"><BrainCircuit aria-hidden="true" className="h-10 w-10 text-violet-600" /><p className="mt-10 text-xs font-black uppercase tracking-[0.25em] text-violet-600">Agent runtime</p><h2 className="mt-4 text-4xl font-black tracking-tight">Operates for the task.</h2><p className="mt-5 leading-relaxed text-slate-600">Reasons, plans, communicates, invokes tools, and returns work. Its sessions, model, tools, and interface may change.</p></article>
          <article className="rounded-[2rem] bg-slate-950 p-8 text-white sm:p-10"><Network aria-hidden="true" className="h-10 w-10 text-cyan-300" /><p className="mt-10 text-xs font-black uppercase tracking-[0.25em] text-cyan-300">Sweetwater Continuum</p><h2 className="mt-4 text-4xl font-black tracking-tight">Persists for the person.</h2><p className="mt-5 leading-relaxed text-slate-300">Carries selected continuity and governing terms across compatible runtimes without making any one of them the permanent owner of the relationship.</p></article>
        </div>
      </div>
    </section>

    <section className="px-4 py-24 sm:px-6 sm:py-36">
      <div className="mx-auto max-w-7xl rounded-[2.5rem] bg-[linear-gradient(135deg,#0f172a,#1e3a8a_55%,#0e7490)] p-8 text-white shadow-2xl sm:p-14 lg:p-20">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">The destination</p>
        <blockquote className="mt-8 max-w-5xl text-4xl font-black leading-tight tracking-[-0.04em] sm:text-6xl">Continuity without delegation becomes memory infrastructure. Delegation without continuity becomes a permissions product.</blockquote>
        <p className="mt-10 max-w-3xl text-lg leading-relaxed text-blue-100">Continuum is the governed relationship between them: a way for a person to carry themselves forward without allowing their history to become someone else’s authority.</p>
        <div className="mt-12 flex flex-col gap-4 border-t border-white/20 pt-8 sm:flex-row sm:items-center sm:justify-between"><p className="font-black">Automation should increase without human agency decreasing.</p><a href="mailto:team@sweetwater.technology?subject=Sweetwater%20Continuum%20thesis" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-black text-slate-950 transition-transform hover:scale-105">Discuss the thesis <ArrowRight aria-hidden="true" className="h-4 w-4" /></a></div>
      </div>
    </section>
  </main>
);
