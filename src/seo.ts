import { FAQS } from './content';
import { findNewsArticle, NEWS_ARTICLES } from './news';
import { findService, findWorkProfile, SERVICES, WORK_PROFILES } from './marketing';

const SITE_URL = 'https://sweetwater.technology';
const SOCIAL_IMAGE = `${SITE_URL}/og-image.png`;

export interface PageSeo {
  title: string;
  description: string;
  canonical: string;
  type: 'website' | 'article';
  jsonLd: object[];
  image?: string;
  robots?: string;
}

const organization = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${SITE_URL}/#organization`,
  name: 'Sweetwater Technology',
  legalName: 'Sweetwater Technology LP',
  url: SITE_URL,
  logo: `${SITE_URL}/images/sweetwater-mark.png`,
  image: SOCIAL_IMAGE,
  description:
    'Sweetwater Technology builds custom web applications, AI-driven workflow automation, and digital products for businesses.',
  founder: {
    '@type': 'Person',
    name: 'Clint Crowe',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Atlanta',
    addressRegion: 'GA',
    addressCountry: 'US',
  },
  areaServed: {
    '@type': 'State',
    name: 'Georgia',
  },
  telephone: '+1-678-521-1798',
  email: 'team@sweetwater.technology',
  knowsAbout: [
    'Custom web application development',
    'AI integration',
    'Workflow automation',
    'Business process automation',
  ],
};

const faqPage = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

const breadcrumbJsonLd = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const normalizePath = (path: string) => {
  const withoutQuery = path.split(/[?#]/, 1)[0] || '/';
  if (withoutQuery === '/') return '/';
  return withoutQuery.replace(/\/+$/, '');
};

export const getPageSeo = (requestedPath: string): PageSeo => {
  const path = normalizePath(requestedPath);

  if (path === '/') {
    return {
      title: 'Custom Web Apps & AI Automation | Sweetwater Technology',
      description:
        'Sweetwater Technology builds custom web apps, mobile products, and AI workflow automation for businesses from Atlanta, Georgia.',
      canonical: `${SITE_URL}/`,
      type: 'website',
      jsonLd: [organization, faqPage],
    };
  }

  if (path === '/news') {
    return {
      title: 'Company & Product News | Sweetwater Technology',
      description:
        'Read verified company announcements, product releases, and development updates from Sweetwater Technology in Atlanta, Georgia.',
      canonical: `${SITE_URL}/news`,
      type: 'website',
      jsonLd: [organization],
    };
  }

  if (path === '/services') {
    return {
      title: 'Custom Software Development Services | Sweetwater Technology',
      description: 'Explore custom web application development, AI workflow automation, and mobile app development services from Sweetwater Technology in Atlanta.',
      canonical: `${SITE_URL}/services`,
      type: 'website',
      jsonLd: [organization],
    };
  }

  if (path.startsWith('/services/')) {
    const service = findService(path.slice('/services/'.length));
    if (service) {
      const canonical = `${SITE_URL}/services/${service.slug}`;
      return {
        title: `${service.title} | Sweetwater Technology`,
        description: service.description,
        canonical,
        type: 'website',
        jsonLd: [
          organization,
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: service.title,
            serviceType: service.shortTitle,
            description: service.description,
            url: canonical,
            provider: { '@id': `${SITE_URL}/#organization` },
            areaServed: { '@type': 'Country', name: 'United States' },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: service.faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: { '@type': 'Answer', text: faq.answer },
            })),
          },
          breadcrumbJsonLd([
            { name: 'Home', url: `${SITE_URL}/` },
            { name: 'Services', url: `${SITE_URL}/services` },
            { name: service.shortTitle, url: canonical },
          ]),
        ],
      };
    }
  }

  if (path === '/work') {
    return {
      title: 'Product Work & Case Studies | Sweetwater Technology',
      description: 'Explore Sweetwater Technology product profiles spanning AI-native consumer software, logistics automation, and specialized e-commerce.',
      canonical: `${SITE_URL}/work`,
      type: 'website',
      jsonLd: [organization],
    };
  }

  if (path.startsWith('/work/')) {
    const profile = findWorkProfile(path.slice('/work/'.length));
    if (profile) {
      const canonical = `${SITE_URL}/work/${profile.slug}`;
      return {
        title: `${profile.title} Product Profile | Sweetwater Technology`,
        description: profile.description,
        canonical,
        type: 'website',
        image: profile.image ? `${SITE_URL}${profile.image}` : SOCIAL_IMAGE,
        jsonLd: [
          organization,
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: profile.title,
            description: profile.description,
            url: profile.externalUrl,
            applicationCategory: profile.applicationCategory,
            operatingSystem: profile.operatingSystem,
            author: { '@id': `${SITE_URL}/#organization` },
            image: profile.image ? `${SITE_URL}${profile.image}` : SOCIAL_IMAGE,
          },
          breadcrumbJsonLd([
            { name: 'Home', url: `${SITE_URL}/` },
            { name: 'Work', url: `${SITE_URL}/work` },
            { name: profile.title, url: canonical },
          ]),
        ],
      };
    }
  }

  if (path.startsWith('/news/')) {
    const article = findNewsArticle(path.slice('/news/'.length));
    if (article) {
      const canonical = `${SITE_URL}/news/${article.slug}`;
      return {
        title: `${article.title} | Sweetwater Technology`,
        description: article.description,
        canonical,
        type: 'article',
        image: `${SITE_URL}${article.image}`,
        jsonLd: [
          organization,
          {
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: article.title,
            description: article.description,
            datePublished: article.publishedAt,
            dateModified: article.updatedAt,
            author: { '@type': 'Person', name: article.author },
            publisher: { '@id': `${SITE_URL}/#organization` },
            image: `${SITE_URL}${article.image}`,
            mainEntityOfPage: canonical,
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
              { '@type': 'ListItem', position: 2, name: 'News', item: `${SITE_URL}/news` },
              { '@type': 'ListItem', position: 3, name: article.title, item: canonical },
            ],
          },
        ],
      };
    }
  }

  return {
    title: 'Page Not Found | Sweetwater Technology',
    description: 'The requested Sweetwater Technology page could not be found.',
    canonical: `${SITE_URL}${path}`,
    type: 'website',
    jsonLd: [organization],
    robots: 'noindex, follow',
  };
};

export const PRERENDER_ROUTES = [
  '/',
  '/services',
  ...SERVICES.map((service) => `/services/${service.slug}`),
  '/work',
  ...WORK_PROFILES.map((profile) => `/work/${profile.slug}`),
  '/news',
  ...NEWS_ARTICLES.map((article) => `/news/${article.slug}`),
  '/404',
];

const escapeAttribute = (value: string) =>
  value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

const safeJson = (value: object) => JSON.stringify(value).replaceAll('<', '\\u003c');

export const renderHead = (seo: PageSeo) => `
    <title>${escapeAttribute(seo.title)}</title>
    <meta name="description" content="${escapeAttribute(seo.description)}" />
    <link rel="canonical" href="${seo.canonical}" />
${seo.robots ? `    <meta name="robots" content="${seo.robots}" />\n` : ''}    <meta property="og:type" content="${seo.type}" />
    <meta property="og:site_name" content="Sweetwater Technology" />
    <meta property="og:url" content="${seo.canonical}" />
    <meta property="og:title" content="${escapeAttribute(seo.title)}" />
    <meta property="og:description" content="${escapeAttribute(seo.description)}" />
    <meta property="og:image" content="${seo.image ?? SOCIAL_IMAGE}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttribute(seo.title)}" />
    <meta name="twitter:description" content="${escapeAttribute(seo.description)}" />
    <meta name="twitter:image" content="${seo.image ?? SOCIAL_IMAGE}" />
${seo.jsonLd.map((item) => `    <script type="application/ld+json">${safeJson(item)}</script>`).join('\n')}`;
