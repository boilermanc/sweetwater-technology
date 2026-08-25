export interface NewsArticle {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  image: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
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
    slug: 'openai-team-visits-sweetwater-urban-farms',
    title: 'Sweetwater Technology Welcomes OpenAI Team Members to Sweetwater Urban Farms',
    description:
      'The greenhouse visit highlighted Sweetwater Technology\'s work in aeroponics, connected devices, AI-powered software, and real-world automation.',
    publishedAt: '2026-08-25T14:00:00-04:00',
    updatedAt: '2026-08-25T14:00:00-04:00',
    author: 'Clint Crowe',
    image: '/images/openai-greenhouse-visit.jpg',
    imageAlt: 'OpenAI team members meet with Clint and Sheree Crowe inside the Sweetwater Urban Farms greenhouse',
    imageWidth: 575,
    imageHeight: 587,
    body: [
      {
        paragraphs: [
          'ATLANTA, Georgia — August 25, 2026 — Sweetwater Technology recently welcomed members of the OpenAI team to Sweetwater Urban Farms for a conversation about how software, connected devices, and artificial intelligence can support practical work across agriculture and other industries.',
          'Clint and Sheree Crowe hosted the visit inside the greenhouse, where they shared Sweetwater Urban Farms\' aeroponic growing operation and its work supplying seedlings to homes and schools. They also demonstrated how Sweetwater Technology turns operational needs and ideas into applications, connected systems, automation, and AI-powered products.',
        ],
        quote: {
          text: 'What better place to talk about technology than right in the middle of the greenhouse?',
          attribution: 'Clint Crowe, founder of Sweetwater Technology',
        },
      },
      {
        heading: 'Technology built around real-world operations',
        paragraphs: [
          'The discussion extended beyond farming to the broader challenge of connecting hardware and software, automating day-to-day operations, and applying AI to concrete problems. Sweetwater Technology develops working products across several industries, using the farm as both an operating business and a practical environment for technology development.',
          'Crowe thanked Kevin D. and Harry Spitzer for visiting the greenhouse and for their interest in the Sweetwater story and the products the company is building.',
        ],
      },
      {
        heading: 'ChatGPT Pro Community and OpenAI DevDay',
        paragraphs: [
          'Sweetwater Technology has also been invited into the ChatGPT Pro Community, creating opportunities to learn from and collaborate with other people developing innovative uses of AI.',
          'The Sweetwater team plans to travel to San Francisco at the end of September for OpenAI DevDay. The company looks forward to building relationships, learning from the wider developer community, and exploring how new AI capabilities can support future products.',
        ],
      },
      {
        heading: 'About Sweetwater Technology',
        paragraphs: [
          'Sweetwater Technology builds focused consumer and business software, connected systems, and AI-powered workflow tools from Atlanta, Georgia. Its portfolio spans agriculture, logistics, education, creative tools, and music technology.',
        ],
      },
      {
        heading: 'About Sweetwater Urban Farms',
        paragraphs: [
          'Sweetwater Urban Farms is an aeroponic greenhouse operation that grows plants and supplies seedlings for homes and schools. The farm also provides a real-world setting for developing and testing technology that connects growing operations, devices, data, and automation.',
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
      {
        label: 'Read the original announcement on LinkedIn',
        url: 'https://www.linkedin.com/posts/clintcrowe_openai-chatgpt-chatgptpro-activity-7498055071998382081-19Xc',
      },
    ],
  },
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
    imageWidth: 1299,
    imageHeight: 822,
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
