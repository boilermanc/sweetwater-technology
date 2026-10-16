import { AI_SERVICES_COPY, SERVICES_COPY } from './servicesContent';
import { CONTINUUM_PAPER, HEADWATERS_INTRO } from './headwaters';
import { ABOUT_DESCRIPTION } from './content';
import { HOME_DESCRIPTION, HOME_FAQS } from './homeContent';
import { findNewsArticle, NEWS_ARTICLES } from './news';
import { findService, findWorkProfile, SERVICES, WORK_PROFILES } from './marketing';
import { findResource, RESOURCES } from './resources';

const SITE_URL = 'https://sweetwater.technology';
const SOCIAL_IMAGE = `${SITE_URL}/og-image.png`;

export interface PageSeo {
  title: string;
  description: string;
  canonical: string;
  type: 'website' | 'article';
  jsonLd: object[];
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
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
  mainEntity: HOME_FAQS.map((faq) => ({
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

  if (path === '/terms' || path === '/privacy') {
    return { title: (path === '/terms' ? 'Website Terms' : 'Privacy Notice') + ' — Draft for Review | Sweetwater Technology', description: 'Unapproved draft for business and legal review. No effective date has been assigned.', canonical: SITE_URL + path, type: 'website', jsonLd: [organization], robots: 'noindex, follow' };
  }

  if (path === '/portal') {
    return { title: 'Client Login | Sweetwater Technology', description: 'Private Sweetwater Technology workspace.', canonical: `${SITE_URL}/portal`, type: 'website', jsonLd: [], robots: 'noindex, nofollow' };
  }

  if (path === '/') return { title: 'Get Your Hours Back | Sweetwater Technology', description: HOME_DESCRIPTION, canonical: SITE_URL + '/', type: 'website', jsonLd: [organization, faqPage] };
  if (path === '/ai-help' || path === '/app-idea') return { title: (path === '/ai-help' ? 'Practical AI for your business' : 'Talk through your app idea') + ' | Sweetwater Technology', description: 'Start a conversation about your business or app idea. Explore a useful first step with Sweetwater Technology.', canonical: SITE_URL + path, type: 'website', jsonLd: [organization], robots: 'noindex, follow' };

  if (path === '/book/manage') return { title: 'Manage Your Booking | Sweetwater Technology', description: 'Manage your private Sweetwater call booking.', canonical: SITE_URL + '/book/manage', type: 'website', jsonLd: [], robots: 'noindex, nofollow' };

  if (path === '/book') return { title: 'Free 20-Minute Introductory Call | Sweetwater Technology', description: 'Book a free 20-minute call to talk through your business workflow, connected systems, and practical next steps with Sweetwater Technology.', canonical: SITE_URL + '/book', type: 'website', jsonLd: [organization] };

  if (path === '/about') {
    const canonical = `${SITE_URL}/about`;
    return {
      title: 'About Sweetwater Technology | Atlanta Software Studio',
      description: ABOUT_DESCRIPTION,
      canonical,
      type: 'website',
      jsonLd: [organization, breadcrumbJsonLd([
        { name: 'Home', url: `${SITE_URL}/` },
        { name: 'About', url: canonical },
      ])],
    };
  }

  if (path === '/card') {
    return {
      title: 'Meet Sweetwater Technology',
      description: 'Explore live software products and tell Sage what kind of business problem you are solving.',
      canonical: `${SITE_URL}/card`,
      type: 'website',
      jsonLd: [organization],
      robots: 'noindex, follow',
    };
  }

  if (path === '/card/test') {
    return {
      title: 'Card Landing Test Hub | Sweetwater Technology',
      description: 'Internal links for checking each Sweetwater card landing-page experience.',
      canonical: `${SITE_URL}/card/test`,
      type: 'website',
      jsonLd: [],
      robots: 'noindex, nofollow',
    };
  }

  if (path === '/card/email-preview') {
    return {
      title: 'Sage Follow-up Email Mockup | Sweetwater Technology',
      description: 'Internal design preview of the personalized Sage follow-up email.',
      canonical: `${SITE_URL}/card/email-preview`,
      type: 'website',
      jsonLd: [],
      robots: 'noindex, nofollow',
    };
  }

  if (path === '/headwaters') {
    return {
      title: 'Headwaters | Ideas on AI and Software | Sweetwater Technology',
      description: HEADWATERS_INTRO,
      canonical: `${SITE_URL}/headwaters/`,
      type: 'website',
      jsonLd: [organization],
    };
  }

  if (path === '/headwaters/continuum') {
    const canonical = `${SITE_URL}/headwaters/continuum/`;
    return {
      title: 'Sweetwater Continuum | Headwaters | Sweetwater Technology',
      description: CONTINUUM_PAPER.summary,
      canonical,
      type: 'article',
      jsonLd: [
        organization,
        {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: CONTINUUM_PAPER.title,
          description: CONTINUUM_PAPER.summary,
          datePublished: CONTINUUM_PAPER.datePublished,
          author: { '@type': 'Organization', name: 'Sweetwater Technology' },
          publisher: { '@id': `${SITE_URL}/#organization` },
          mainEntityOfPage: canonical,
        },
        breadcrumbJsonLd([
          { name: 'Headwaters', url: `${SITE_URL}/headwaters/` },
          { name: CONTINUUM_PAPER.title, url: canonical },
        ]),
      ],
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

  if (path === '/resources') {
    return {
      title: 'Free Resources | Sweetwater Technology',
      description: 'Browse free documents and reusable tools from Sweetwater Technology.',
      canonical: `${SITE_URL}/resources`,
      type: 'website',
      jsonLd: [organization],
    };
  }

  if (path.startsWith('/resources/')) {
    const isDownload = path.endsWith('/download');
    const slug = path.slice('/resources/'.length).replace(/\/download$/, '');
    const resource = findResource(slug);
    if (resource?.article && !isDownload) {
      const canonical = SITE_URL + '/resources/' + resource.slug;
      return {
        title: 'Try AI This Week: A Starter Guide for Small Businesses | Sweetwater Technology',
        description: resource.description, canonical, type: 'article',
        jsonLd: [organization, {
          '@context': 'https://schema.org', '@type': 'Article', headline: resource.title,
          description: resource.description, author: { '@id': SITE_URL + '/#organization' },
          publisher: { '@id': SITE_URL + '/#organization' }, mainEntityOfPage: canonical,
        }, breadcrumbJsonLd([
          { name: 'Home', url: SITE_URL + '/' }, { name: 'Resources', url: SITE_URL + '/resources' },
          { name: resource.title, url: canonical },
        ])],
      };
    }
    if (resource) {
      const canonical = `${SITE_URL}/resources/${resource.slug}`;
      return {
        title: `${resource.title} | Sweetwater Technology`,
        description: resource.description,
        canonical,
        type: 'website',
        jsonLd: isDownload ? [] : [organization, breadcrumbJsonLd([
          { name: 'Home', url: `${SITE_URL}/` },
          { name: 'Resources', url: `${SITE_URL}/resources` },
          { name: resource.title, url: canonical },
        ])],
        ...(isDownload ? { robots: 'noindex, follow' } : {}),
      };
    }
  }

  if (path === '/services') {
    return {
      title: `${SERVICES_COPY.title} | Sweetwater Technology`,
      description: SERVICES_COPY.description,
      canonical: `${SITE_URL}/services`,
      type: 'website',
      jsonLd: [organization],
    };
  }

  if (path.startsWith('/services/')) {
    const service = findService(path.slice('/services/'.length));
    if (service) {
      const canonical = `${SITE_URL}/services/${service.slug}`;
      const copy = service.slug === 'ai-workflow-automation' ? AI_SERVICES_COPY : service;
      return {
        title: `${copy.title} | Sweetwater Technology`,
        description: copy.description,
        canonical,
        type: 'website',
        jsonLd: [
          organization,
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: copy.title,
            serviceType: service.shortTitle,
            description: copy.description,
            url: canonical,
            provider: { '@id': `${SITE_URL}/#organization` },
            areaServed: { '@type': 'Country', name: 'United States' },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: copy.faqs.map((faq) => ({
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
        imageWidth: article.imageWidth,
        imageHeight: article.imageHeight,
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
  '/book/manage',
  '/book',
  '/terms',
  '/privacy',
  '/ai-help',
  '/app-idea',
  '/portal',
  '/',
  '/about',
  '/card',
  '/card/test',
  '/card/email-preview',
  '/headwaters/',
  '/headwaters/continuum/',
  '/services',
  ...SERVICES.map((service) => `/services/${service.slug}`),
  '/work',
  ...WORK_PROFILES.map((profile) => `/work/${profile.slug}`),
  '/news',
  '/resources',
  ...RESOURCES.flatMap((resource) => resource.file ? [`/resources/${resource.slug}`, `/resources/${resource.slug}/download`] : [`/resources/${resource.slug}`]),
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
    <meta property="og:image:width" content="${seo.imageWidth ?? 1200}" />
    <meta property="og:image:height" content="${seo.imageHeight ?? 630}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttribute(seo.title)}" />
    <meta name="twitter:description" content="${escapeAttribute(seo.description)}" />
    <meta name="twitter:image" content="${seo.image ?? SOCIAL_IMAGE}" />
${seo.jsonLd.map((item) => `    <script type="application/ld+json">${safeJson(item)}</script>`).join('\n')}`;
