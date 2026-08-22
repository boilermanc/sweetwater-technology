export interface NewsArticle {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  image: string;
  imageAlt: string;
  body: Array<{
    heading?: string;
    paragraphs?: string[];
    bullets?: string[];
    quote?: {
      text: string;
      attribution: string;
    };
  }>;
  links?: Array<{
    label: string;
    url: string;
  }>;
}

// Add verified company announcements here. Each entry automatically receives a
// prerendered route, metadata, NewsArticle JSON-LD, breadcrumbs, and a sitemap URL.
export const NEWS_ARTICLES: NewsArticle[] = [
  {
    slug: 'rekkrd-launches-on-apple-app-store',
    title: 'Sweetwater Technology Launches Rekkrd on the Apple App Store',
    description:
      'Rekkrd brings AI-assisted album identification, vinyl collection valuation, listening history, and audio gear cataloging to iPhone and iPad.',
    publishedAt: '2026-08-22T09:00:00-04:00',
    updatedAt: '2026-08-22T09:00:00-04:00',
    author: 'Clint Crowe',
    image: '/images/optimized/rekkrd-product.webp',
    imageAlt: 'Rekkrd vinyl collection application displayed beside a turntable',
    body: [
      {
        paragraphs: [
          'ATLANTA, Georgia — August 22, 2026 — Sweetwater Technology announced that Rekkrd, its AI-native music collection application, is now available on the Apple App Store. Rekkrd version 1.0 launched on August 7 for iPhone and iPad.',
          'The iOS release brings collection management, AI-assisted album identification, value tracking, listening history, and audio gear cataloging to the phone collectors carry while browsing record stores and organizing their shelves.',
          'Rekkrd works alongside Discogs rather than replacing it. Collectors can import an existing Discogs collection, use Rekkrd as a companion for daily collection activity, and export their data without being locked into the platform.',
        ],
        quote: {
          text: 'Keep Discogs. Add Rekkrd. Discogs is the system of record and it should stay that way. What collectors do not have is something pleasant to use day to day — something that tells them what a shelf is worth, remembers what they played last Sunday, and knows what gear it is playing through. That is what we built.',
          attribution: 'Clint Crowe, founder of Sweetwater Technology',
        },
      },
      {
        heading: 'What does Rekkrd do?',
        paragraphs: [
          'Rekkrd gives vinyl and physical-media collectors one place to document their records, listening history, equipment, and collection value.',
        ],
        bullets: [
          'AI album identification: Photograph a cover, center label, cassette, or 8-track and Rekkrd identifies the release and fills in available metadata.',
          'Discogs interoperability: Import an existing Discogs collection and export collection data when needed.',
          'Value analytics: Monitor record values using market data, including real eBay sales data in the iOS application and Discogs pricing across Rekkrd collection tools.',
          'Listening journal: Record what was played, when it was played, and the equipment used.',
          'Stakkd gear catalog: Document turntables, cartridges, amplifiers, speakers, and the connections between them.',
          'Condition grading: Store condition information for each individual copy in a collection.',
        ],
      },
      {
        heading: 'Rekkrd availability and pricing',
        paragraphs: [
          'Rekkrd is free to download from the Apple App Store and requires iOS 15 or later. The application runs on iPhone and iPad, and collection data synchronizes with the Rekkrd web application.',
          'The free Collector tier supports up to 2,000 albums, 10 AI scans per month, Discogs collection import, listening history, wantlist pricing, and a limited gear catalog. Curator costs $4.99 per month and adds unlimited albums and scans, expanded collection tools, data export, and the full Stakkd gear catalog. Enthusiast costs $9.99 per month and adds room planning, shelf organization, collection analytics, PDF catalogs, API access, and early feature access.',
          'Rekkrd remains available on the web at rekkrd.com. Sweetwater Technology has not announced an Android release date.',
        ],
      },
      {
        heading: 'About Sweetwater Technology',
        paragraphs: [
          'Sweetwater Technology builds focused consumer and business software from Atlanta, Georgia. Rekkrd includes the Stakkd audio gear catalog and connects collectors with Spennd, a free record grading and pricing tool, and Sellr, an appraisal and listing workflow for selling collections.',
        ],
      },
      {
        heading: 'Media contact',
        paragraphs: [
          'Clint Crowe, Sweetwater Technology — team@sweetwater.technology',
        ],
      },
    ],
    links: [
      { label: 'Download Rekkrd on the Apple App Store', url: 'https://apps.apple.com/us/app/rekkrd/id6795955100' },
      { label: 'Use Rekkrd on the web', url: 'https://rekkrd.com' },
    ],
  },
];

export const findNewsArticle = (slug: string) =>
  NEWS_ARTICLES.find((article) => article.slug === slug);
