import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { NEWS_ARTICLES, type NewsArticle } from '../news';

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'America/New_York',
  }).format(new Date(value));

export const NewsIndex: React.FC = () => (
  <main className="relative z-10 min-h-screen px-4 pb-24 pt-32 sm:px-6">
    <div className="mx-auto max-w-5xl">
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-blue-600">Newsroom</p>
      <h1 className="max-w-4xl text-4xl font-black tracking-tight text-slate-900 sm:text-6xl">
        Company and product news from Sweetwater Technology
      </h1>
      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-600">
        Sweetwater Technology publishes verified announcements, product releases, and development updates from Atlanta, Georgia.
      </p>

      {NEWS_ARTICLES.length > 0 ? (
        <section aria-labelledby="latest-news" className="mt-16">
          <h2 id="latest-news" className="text-2xl font-black text-slate-900">Latest news</h2>
          <div className="mt-8 grid gap-6">
            {NEWS_ARTICLES.map((article) => (
              <article key={article.slug} className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm sm:p-8">
                <time dateTime={article.publishedAt} className="text-sm font-semibold text-blue-600">
                  {formatDate(article.publishedAt)}
                </time>
                <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900">
                  <a href={`/news/${article.slug}`} className="hover:text-blue-600">{article.title}</a>
                </h2>
                <p className="mt-3 leading-relaxed text-slate-600">{article.description}</p>
                <a href={`/news/${article.slug}`} className="mt-5 inline-flex items-center gap-2 font-bold text-blue-600">
                  Read {article.title} <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </a>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <section className="mt-16 rounded-3xl border border-blue-100 bg-white/80 p-8 shadow-sm sm:p-12">
          <h2 className="text-2xl font-black text-slate-900">The newsroom is ready</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-slate-600">
            The first verified Sweetwater Technology announcement will appear here with its publication date, author, canonical URL, and structured data.
          </p>
        </section>
      )}
    </div>
  </main>
);

export const NewsDetail: React.FC<{ article: NewsArticle }> = ({ article }) => (
  <main className="relative z-10 min-h-screen px-4 pb-24 pt-32 sm:px-6">
    <article className="mx-auto max-w-3xl">
      <nav aria-label="Breadcrumb" className="mb-8 text-sm font-semibold text-slate-500">
        <a href="/" className="hover:text-blue-600">Home</a> <span aria-hidden="true">/</span>{' '}
        <a href="/news" className="hover:text-blue-600">News</a>
      </nav>
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600">Sweetwater Technology News</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-6xl">{article.title}</h1>
        <p className="mt-6 text-xl leading-relaxed text-slate-600">{article.description}</p>
        <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 border-y border-slate-200 py-4 text-sm text-slate-600">
          <span>By {article.author}</span>
          <span>Published <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time></span>
          {article.updatedAt !== article.publishedAt && (
            <span>Updated <time dateTime={article.updatedAt}>{formatDate(article.updatedAt)}</time></span>
          )}
        </div>
      </header>
      <img
        src={article.image}
        alt={article.imageAlt}
        width={article.imageWidth}
        height={article.imageHeight}
        decoding="async"
        fetchPriority="high"
        className="mt-10 w-full rounded-3xl border border-slate-200 bg-white object-cover shadow-lg"
      />
      <div className="mt-10 space-y-10 text-lg leading-8 text-slate-700">
        {article.body.map((section, index) => (
          <section key={section.heading ?? index}>
            {section.heading && <h2 className="mb-4 text-2xl font-black text-slate-900">{section.heading}</h2>}
            {section.paragraphs && (
              <div className="space-y-5">{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
            )}
            {section.bullets && (
              <ul className="mt-5 list-disc space-y-3 pl-6">
                {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
              </ul>
            )}
            {section.quote && (
              <blockquote className="mt-8 rounded-3xl border-l-4 border-blue-600 bg-blue-50 p-6 text-xl font-semibold text-slate-800 sm:p-8">
                <p>“{section.quote.text}”</p>
                <footer className="mt-4 text-sm font-bold text-blue-700">— {section.quote.attribution}</footer>
              </blockquote>
            )}
          </section>
        ))}
      </div>
      {article.links && (
        <aside aria-label="Related links" className="mt-12 rounded-3xl bg-slate-900 p-6 text-white sm:p-8">
          <h2 className="text-xl font-black">Learn more</h2>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            {article.links.map((link) => (
              <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white px-5 py-3 text-center text-sm font-bold text-slate-900 hover:bg-blue-50">
                {link.label}
              </a>
            ))}
          </div>
        </aside>
      )}
      <a href="/news" className="mt-12 inline-flex items-center gap-2 font-bold text-blue-600">
        <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Back to all Sweetwater Technology news
      </a>
    </article>
  </main>
);

export const NotFound: React.FC = () => (
  <main className="relative z-10 flex min-h-screen items-center justify-center px-6 text-center">
    <div>
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-blue-600">404</p>
      <h1 className="mt-4 text-4xl font-black text-slate-900">Page not found</h1>
      <p className="mt-4 text-slate-600">The page you requested does not exist.</p>
      <a href="/" className="mt-8 inline-block rounded-full bg-slate-900 px-6 py-3 font-bold text-white">Return home</a>
    </div>
  </main>
);
