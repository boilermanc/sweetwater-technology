import React from 'react';
import { ArrowRight, Check, ExternalLink } from 'lucide-react';
import { SERVICES, WORK_PROFILES, type ServicePage, type WorkProfile } from '../marketing';

const PageIntro: React.FC<{ eyebrow: string; title: string; description: string }> = ({ eyebrow, title, description }) => (
  <header className="max-w-4xl">
    <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600">{eyebrow}</p>
    <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-6xl">{title}</h1>
    <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-600 sm:text-xl">{description}</p>
  </header>
);

const ContactCta: React.FC = () => (
  <aside className="mt-20 rounded-[2rem] bg-slate-900 p-8 text-white sm:p-12">
    <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-300">Start a conversation</p>
    <h2 className="mt-4 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">Tell us which workflow or product you need to improve.</h2>
    <p className="mt-4 max-w-2xl leading-relaxed text-slate-300">Sweetwater Technology scopes focused projects and ongoing product-development engagements from Atlanta, Georgia.</p>
    <a href="mailto:team@sweetwater.technology" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-slate-900 hover:bg-blue-50">
      Email team@sweetwater.technology <ArrowRight aria-hidden="true" className="h-4 w-4" />
    </a>
  </aside>
);

export const ServicesIndex: React.FC = () => (
  <main className="relative z-10 min-h-screen px-4 pb-24 pt-32 sm:px-6">
    <div className="mx-auto max-w-6xl">
      <PageIntro
        eyebrow="Services"
        title="Custom software built around the work"
        description="Sweetwater Technology builds custom web applications, human-supervised AI automation, and mobile products for businesses with specialized workflows."
      />
      <section aria-labelledby="services-list" className="mt-16">
        <h2 id="services-list" className="sr-only">Sweetwater Technology services</h2>
        <div className="grid gap-6 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <article key={service.slug} className="flex flex-col rounded-3xl border border-slate-200 bg-white/85 p-7 shadow-sm">
              <h2 className="text-2xl font-black tracking-tight text-slate-900">{service.shortTitle}</h2>
              <p className="mt-4 flex-1 leading-relaxed text-slate-600">{service.description}</p>
              <a href={`/services/${service.slug}`} className="mt-6 inline-flex items-center gap-2 font-bold text-blue-600">
                Explore {service.shortTitle.toLowerCase()} <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </a>
            </article>
          ))}
        </div>
      </section>
      <ContactCta />
    </div>
  </main>
);

export const ServiceDetail: React.FC<{ service: ServicePage }> = ({ service }) => {
  const relatedWork = WORK_PROFILES.filter((profile) => service.relatedWork.includes(profile.slug));

  return (
    <main className="relative z-10 min-h-screen px-4 pb-24 pt-32 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm font-semibold text-slate-500">
          <a href="/" className="hover:text-blue-600">Home</a> <span aria-hidden="true">/</span>{' '}
          <a href="/services" className="hover:text-blue-600">Services</a>
        </nav>
        <PageIntro eyebrow="Sweetwater Technology service" title={service.title} description={service.description} />
        <p className="mt-10 max-w-4xl text-xl font-medium leading-8 text-slate-700">{service.intro}</p>

        <div className="mt-16 grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <section aria-labelledby="who-it-is-for">
            <h2 id="who-it-is-for" className="text-2xl font-black text-slate-900">Who this service is for</h2>
            <ul className="mt-6 space-y-4">
              {service.audience.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed text-slate-600">
                  <Check aria-hidden="true" className="mt-1 h-5 w-5 flex-none text-blue-600" /> {item}
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="what-we-deliver">
            <h2 id="what-we-deliver" className="text-2xl font-black text-slate-900">What Sweetwater Technology delivers</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {service.deliverables.map((item) => (
                <article key={item.title} className="rounded-2xl border border-slate-200 bg-white/85 p-6">
                  <h3 className="font-black text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section aria-labelledby="process" className="mt-20">
          <h2 id="process" className="text-3xl font-black text-slate-900">How the engagement works</h2>
          <ol className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {service.process.map((step, index) => (
              <li key={step.title} className="rounded-3xl bg-slate-900 p-6 text-white">
                <span className="text-sm font-black text-blue-300">0{index + 1}</span>
                <h3 className="mt-3 text-xl font-black">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        {relatedWork.length > 0 && (
          <section aria-labelledby="related-work" className="mt-20">
            <h2 id="related-work" className="text-3xl font-black text-slate-900">Related product work</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {relatedWork.map((profile) => (
                <article key={profile.slug} className="rounded-3xl border border-slate-200 bg-white/85 p-7">
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-600">{profile.category}</p>
                  <h3 className="mt-3 text-2xl font-black text-slate-900">{profile.title}</h3>
                  <p className="mt-3 leading-relaxed text-slate-600">{profile.description}</p>
                  <a href={`/work/${profile.slug}`} className="mt-5 inline-flex items-center gap-2 font-bold text-blue-600">
                    Read the {profile.title} product profile <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </a>
                </article>
              ))}
            </div>
          </section>
        )}

        <section aria-labelledby="service-faq" className="mt-20 max-w-4xl">
          <h2 id="service-faq" className="text-3xl font-black text-slate-900">Questions about {service.shortTitle.toLowerCase()}</h2>
          <div className="mt-8 space-y-5">
            {service.faqs.map((faq) => (
              <article key={faq.question} className="rounded-3xl border border-slate-200 bg-white/85 p-6 sm:p-8">
                <h3 className="text-xl font-black text-slate-900">{faq.question}</h3>
                <p className="mt-3 leading-relaxed text-slate-600">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>
        <ContactCta />
      </div>
    </main>
  );
};

export const WorkIndex: React.FC = () => (
  <main className="relative z-10 min-h-screen px-4 pb-24 pt-32 sm:px-6">
    <div className="mx-auto max-w-6xl">
      <PageIntro
        eyebrow="Product work"
        title="Software for specific, underserved workflows"
        description="These product profiles show how Sweetwater Technology applies custom application development, mobile delivery, and AI-assisted workflows to distinct operating problems."
      />
      <section aria-labelledby="work-list" className="mt-16 grid gap-6 lg:grid-cols-3">
        <h2 id="work-list" className="sr-only">Sweetwater Technology product profiles</h2>
        {WORK_PROFILES.map((profile) => (
          <article key={profile.slug} className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white/85 shadow-sm">
            {profile.image ? (
              <img src={profile.image} alt={profile.imageAlt} width={profile.imageWidth} height={profile.imageHeight} loading="lazy" decoding="async" className="aspect-[16/10] w-full bg-slate-100 object-cover" />
            ) : (
              <div className="flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-emerald-100 to-blue-100 px-8 text-center text-3xl font-black text-emerald-900">{profile.title}</div>
            )}
            <div className="flex flex-1 flex-col p-7">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600">{profile.category}</p>
              <h2 className="mt-3 text-2xl font-black text-slate-900">{profile.title}</h2>
              <p className="mt-3 flex-1 leading-relaxed text-slate-600">{profile.description}</p>
              <a href={`/work/${profile.slug}`} className="mt-6 inline-flex items-center gap-2 font-bold text-blue-600">
                View the {profile.title} product profile <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </a>
            </div>
          </article>
        ))}
      </section>
      <ContactCta />
    </div>
  </main>
);

export const WorkDetail: React.FC<{ profile: WorkProfile }> = ({ profile }) => {
  const relatedServices = SERVICES.filter((service) => profile.relatedServices.includes(service.slug));

  return (
    <main className="relative z-10 min-h-screen px-4 pb-24 pt-32 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm font-semibold text-slate-500">
          <a href="/" className="hover:text-blue-600">Home</a> <span aria-hidden="true">/</span>{' '}
          <a href="/work" className="hover:text-blue-600">Work</a>
        </nav>
        <PageIntro eyebrow={profile.category} title={profile.title} description={profile.description} />
        <a href={profile.externalUrl} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 font-bold text-white hover:bg-blue-600">
          Visit {profile.title} <ExternalLink aria-hidden="true" className="h-4 w-4" />
        </a>

        {profile.image && (
          <img src={profile.image} alt={profile.imageAlt} width={profile.imageWidth} height={profile.imageHeight} decoding="async" fetchPriority="high" className="mt-12 max-h-[680px] w-full rounded-[2rem] border border-slate-200 bg-white object-cover shadow-xl" />
        )}

        <div className="mt-16 grid gap-12 lg:grid-cols-3">
          <section>
            <h2 className="text-2xl font-black text-slate-900">Product overview</h2>
            <p className="mt-4 leading-7 text-slate-600">{profile.overview}</p>
          </section>
          <section>
            <h2 className="text-2xl font-black text-slate-900">The operating problem</h2>
            <p className="mt-4 leading-7 text-slate-600">{profile.challenge}</p>
          </section>
          <section>
            <h2 className="text-2xl font-black text-slate-900">The product approach</h2>
            <p className="mt-4 leading-7 text-slate-600">{profile.solution}</p>
          </section>
        </div>

        <section aria-labelledby="capabilities" className="mt-20 rounded-[2rem] bg-slate-900 p-8 text-white sm:p-12">
          <h2 id="capabilities" className="text-3xl font-black">Core capabilities</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {profile.capabilities.map((capability) => (
              <li key={capability} className="flex gap-3 rounded-2xl bg-white/5 p-4 text-slate-200">
                <Check aria-hidden="true" className="h-5 w-5 flex-none text-blue-300" /> {capability}
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <section aria-labelledby="technology">
            <h2 id="technology" className="text-2xl font-black text-slate-900">Technology</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {profile.stack.map((technology) => <span key={technology} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700">{technology}</span>)}
            </div>
          </section>
          <section aria-labelledby="related-services">
            <h2 id="related-services" className="text-2xl font-black text-slate-900">Related Sweetwater Technology services</h2>
            <div className="mt-5 space-y-3">
              {relatedServices.map((service) => (
                <a key={service.slug} href={`/services/${service.slug}`} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 font-bold text-slate-800 hover:border-blue-300 hover:text-blue-600">
                  {service.shortTitle} <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </a>
              ))}
            </div>
          </section>
        </div>
        <ContactCta />
      </div>
    </main>
  );
};
