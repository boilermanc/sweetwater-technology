import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { getPageSeo, PRERENDER_ROUTES, renderHead } from './seo';
import { NEWS_ARTICLES } from './news';
import { SERVICES, WORK_PROFILES } from './marketing';

export const prerenderRoutes = PRERENDER_ROUTES;
export const sitemapEntries = [
  { path: '/', priority: '1.0' },
  { path: '/services', priority: '0.9' },
  ...SERVICES.map((service) => ({ path: `/services/${service.slug}`, priority: '0.9' })),
  { path: '/work', priority: '0.8' },
  ...WORK_PROFILES.map((profile) => ({ path: `/work/${profile.slug}`, priority: '0.8' })),
  { path: '/news', priority: '0.8' },
  ...NEWS_ARTICLES.map((article) => ({
    path: `/news/${article.slug}`,
    lastmod: article.updatedAt.slice(0, 10),
    priority: '0.7',
  })),
];

export const render = (path: string) => ({
  appHtml: renderToString(
    <StrictMode>
      <App path={path} />
    </StrictMode>,
  ),
  headHtml: renderHead(getPageSeo(path)),
});
