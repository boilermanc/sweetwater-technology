import { ArrowRight } from 'lucide-react';
import { ABOUT_DESCRIPTION, FAQS } from '../content';
import { SERVICES, WORK_PROFILES } from '../marketing';

export const About = () => (
  <main className="relative z-10 min-h-screen px-4 pb-24 pt-32 sm:px-6">
    <div className="mx-auto max-w-6xl">
      <nav aria-label="Breadcrumb" className="mb-8 text-sm font-semibold text-slate-500">
        <a href="/" className="hover:text-blue-600">Home</a> <span aria-hidden="true">/</span>{' '}
        <span aria-current="page">About</span>
      </nav>

      <header className="max-w-4xl">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600">The studio behind the software</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-6xl">About Sweetwater Technology</h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-600 sm:text-xl">{ABOUT_DESCRIPTION}</p>
      </header>

      <div className="mt-14 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <section aria-labelledby="about-approach" className="rounded-[2rem] bg-slate-900 p-8 text-white sm:p-10">
          <h2 id="about-approach" className="text-3xl font-black tracking-tight">Built around the work people do</h2>
          <p className="mt-5 leading-8 text-slate-300">We design software around a specific workflow: the requests a team receives, the decisions people make, and the information they need to act. Our work ranges from early product releases to improvements in existing applications.</p>
          <p className="mt-4 leading-8 text-slate-300">That can mean a customer portal, a mobile collection tool, or an AI-assisted process that prepares information for someone to review. The starting point is understanding who will use it and what they need to accomplish.</p>
          <a href="/work" className="mt-6 inline-flex items-center gap-2 font-bold text-blue-200 hover:text-white">Explore our product work <ArrowRight aria-hidden="true" size={18} /></a>
        </section>

        <section aria-labelledby="about-facts" className="rounded-[2rem] border border-slate-200 bg-white/85 p-8 sm:p-10">
          <h2 id="about-facts" className="text-2xl font-black text-slate-900">At a glance</h2>
          <dl className="mt-6 divide-y divide-slate-200 text-sm">
            <div className="pb-4"><dt className="font-bold text-slate-500">Company</dt><dd className="mt-1 text-base text-slate-900">Sweetwater Technology LP</dd></div>
            <div className="py-4"><dt className="font-bold text-slate-500">Based in</dt><dd className="mt-1 text-base text-slate-900">Atlanta, Georgia, United States</dd></div>
            <div className="py-4"><dt className="font-bold text-slate-500">Founder</dt><dd className="mt-1 text-base text-slate-900">Clint Crowe</dd></div>
            <div className="pt-4"><dt className="font-bold text-slate-500">Contact</dt><dd className="mt-1 break-words text-base"><a href="mailto:team@sweetwater.technology" className="font-semibold text-blue-700 hover:underline">team@sweetwater.technology</a><br /><a href="tel:+16785211798" className="mt-2 inline-block text-slate-700 hover:underline">+1 (678) 521-1798</a></dd></div>
          </dl>
        </section>
      </div>

      <section aria-labelledby="about-services" className="mt-20">
        <h2 id="about-services" className="text-3xl font-black tracking-tight text-slate-900">What we build</h2>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <article key={service.slug} className="flex flex-col rounded-3xl border border-slate-200 bg-white/85 p-7">
              <h3 className="text-xl font-black text-slate-900">{service.shortTitle}</h3>
              <p className="mt-4 flex-1 leading-7 text-slate-600">{service.description}</p>
              <a href={`/services/${service.slug}`} className="mt-6 inline-flex items-center gap-2 font-bold text-blue-700">Explore {service.shortTitle.toLowerCase()} <ArrowRight aria-hidden="true" className="h-4 w-4 flex-none" /></a>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="about-people" className="mt-20 grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600">People and perspective</p>
          <h2 id="about-people" className="mt-4 text-3xl font-black tracking-tight text-slate-900">A practical connection to the greenhouse</h2>
          <p className="mt-5 leading-8 text-slate-600">Sweetwater Technology was founded by Clint Crowe. Alongside its software work, the studio uses Sweetwater Urban Farms as a real-world setting for developing and testing connected systems, data tools, and automation.</p>
          <p className="mt-4 leading-8 text-slate-600">Clint and Sheree Crowe share that work through the farm’s aeroponic growing operation. The connection keeps everyday needs—growing plants, supplying seedlings, and coordinating operations—close to the technology being built.</p>
          <a href="/news/openai-team-visits-sweetwater-urban-farms" className="mt-6 inline-flex items-center gap-2 font-bold text-blue-700">Read the story from the greenhouse <ArrowRight aria-hidden="true" className="h-4 w-4 flex-none" /></a>
        </div>
        <figure>
          <img src="/images/openai-greenhouse-visit.jpg" alt="Clint and Sheree Crowe with visiting OpenAI team members in the Sweetwater Urban Farms greenhouse" width={575} height={587} loading="lazy" decoding="async" className="w-full rounded-[2rem] border border-slate-200 object-cover" />
          <figcaption className="mt-3 text-sm leading-6 text-slate-500">A greenhouse visit with Clint and Sheree Crowe, shared in our company newsroom.</figcaption>
        </figure>
      </section>

      <section aria-labelledby="about-products" className="mt-20">
        <h2 id="about-products" className="text-3xl font-black tracking-tight text-slate-900">See the approach in our products</h2>
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {WORK_PROFILES.map((profile) => (
            <article key={profile.slug} className="flex flex-col rounded-3xl border border-slate-200 bg-white/85 p-7">
              <h3 className="text-xl font-black text-slate-900">{profile.title}</h3>
              <p className="mt-3 flex-1 leading-7 text-slate-600">{profile.description}</p>
              <a href={`/work/${profile.slug}`} className="mt-5 inline-flex items-center gap-2 font-bold text-blue-700">Explore {profile.title} <ArrowRight aria-hidden="true" size={16} /></a>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="about-engagement" className="mt-20 max-w-4xl">
        <h2 id="about-engagement" className="text-3xl font-black tracking-tight text-slate-900">Working with Sweetwater</h2>
        <div className="mt-8 space-y-6">
          {FAQS.filter((faq) => ['Process', 'Pricing'].includes(faq.category)).map((faq) => (
            <div key={faq.question}>
              <h3 className="text-xl font-bold text-slate-900">{faq.question}</h3>
              <p className="mt-3 leading-8 text-slate-600">{faq.answer}</p>
            </div>
          ))}
        </div>
        <a href="/#contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 font-bold text-white hover:bg-blue-700">Tell us what you’re building <ArrowRight aria-hidden="true" size={18} /></a>
      </section>
    </div>
  </main>
);
