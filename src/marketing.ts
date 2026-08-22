export interface ServicePage {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  intro: string;
  audience: string[];
  deliverables: Array<{ title: string; description: string }>;
  process: Array<{ title: string; description: string }>;
  faqs: Array<{ question: string; answer: string }>;
  relatedWork: string[];
}

export interface WorkProfile {
  slug: string;
  title: string;
  category: string;
  description: string;
  externalUrl: string;
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  operatingSystem: string;
  applicationCategory: string;
  overview: string;
  challenge: string;
  solution: string;
  capabilities: string[];
  stack: string[];
  relatedServices: string[];
}

export const SERVICES: ServicePage[] = [
  {
    slug: 'custom-web-applications',
    title: 'Custom Web Application Development',
    shortTitle: 'Custom web applications',
    description:
      'Sweetwater Technology designs and builds custom web applications, internal tools, SaaS products, and customer portals for businesses with specialized workflows.',
    intro:
      'Custom software is valuable when the business process is too specific for an off-the-shelf platform. Sweetwater Technology turns those workflows into secure, maintainable web applications that teams can use from any modern browser.',
    audience: [
      'Businesses running important operations through spreadsheets, inboxes, and disconnected tools',
      'Founders who need a production-ready minimum viable product',
      'Teams replacing a legacy application or extending an existing platform',
      'Companies that need a customer portal, operations dashboard, marketplace, or specialized SaaS product',
    ],
    deliverables: [
      { title: 'Product definition', description: 'A practical feature scope, user-flow map, data model, and delivery plan tied to the business goal.' },
      { title: 'Application design', description: 'Responsive interfaces designed around the people who will use the product every day.' },
      { title: 'Full-stack development', description: 'Frontend, backend, database, authentication, integrations, and administrative tools built as one coherent system.' },
      { title: 'Launch and iteration', description: 'Deployment preparation, production verification, monitoring, and a plan for improvements after real users arrive.' },
    ],
    process: [
      { title: 'Understand the workflow', description: 'We document the current process, users, constraints, and the result the software must produce.' },
      { title: 'Shape the smallest useful release', description: 'We prioritize the capabilities needed to create value and defer work that does not support the first outcome.' },
      { title: 'Build in working increments', description: 'Stakeholders review functioning software throughout development instead of waiting for a final reveal.' },
      { title: 'Launch with evidence', description: 'The production release is checked across devices, key workflows, analytics, and operational handoffs.' },
    ],
    faqs: [
      { question: 'How much does a custom web application cost?', answer: 'Pricing depends on scope, integrations, security requirements, and the amount of product definition already completed. Sweetwater Technology provides a clear project proposal or retainer structure after an initial conversation.' },
      { question: 'How long does a custom web application take to build?', answer: 'Focused MVPs can often ship in weeks. Larger operational platforms are delivered in stages so the highest-value workflows reach users first.' },
      { question: 'Can Sweetwater Technology improve an existing application?', answer: 'Yes. Engagements can begin with a targeted feature, interface modernization, integration, reliability issue, or a staged replacement of a legacy system.' },
    ],
    relatedWork: ['lanewise', 'atl-urban-farms'],
  },
  {
    slug: 'ai-workflow-automation',
    title: 'AI Workflow Automation',
    shortTitle: 'AI workflow automation',
    description:
      'Sweetwater Technology builds human-supervised AI workflows that extract information, prepare decisions, and reduce repetitive operational work.',
    intro:
      'Useful AI automation starts with a repeatable business process, not a chatbot. Sweetwater Technology connects language and vision models to the systems a team already uses, with review steps and visible assumptions where accuracy matters.',
    audience: [
      'Operations teams repeatedly reading emails, documents, images, or form submissions',
      'Businesses that prepare quotes, summaries, listings, or structured records by hand',
      'Product teams adding AI-assisted search, classification, recommendations, or content generation',
      'Organizations that require a person to review an AI-generated result before it is sent or committed',
    ],
    deliverables: [
      { title: 'Workflow assessment', description: 'A map of the current inputs, decisions, exceptions, and systems involved in the process.' },
      { title: 'AI-assisted pipeline', description: 'Extraction, classification, generation, or recommendation steps connected to real business data.' },
      { title: 'Human review controls', description: 'Clear source data, assumptions, confidence signals, and approval steps for consequential outputs.' },
      { title: 'Measurement and safeguards', description: 'Evaluation examples, failure handling, access controls, and monitoring designed for the specific workflow.' },
    ],
    process: [
      { title: 'Choose a measurable task', description: 'We identify a narrow process with known inputs, outputs, and a meaningful definition of success.' },
      { title: 'Test against real examples', description: 'Representative cases expose ambiguity and exceptions before the workflow is connected to production systems.' },
      { title: 'Integrate with review', description: 'The automation prepares useful work while the responsible person retains control over the final action.' },
      { title: 'Improve from observed failures', description: 'Real usage informs prompt, data, interface, and workflow changes after launch.' },
    ],
    faqs: [
      { question: 'What business processes can be automated with AI?', answer: 'Strong candidates include document and email intake, data extraction, product enrichment, draft preparation, image identification, internal search, and recommendations grounded in business data.' },
      { question: 'Does AI automation replace employees?', answer: 'Sweetwater Technology primarily designs AI as a copilot for repetitive work. The system prepares information or a draft while people handle judgment, exceptions, and consequential decisions.' },
      { question: 'Can AI automation connect to existing software?', answer: 'Yes. A workflow can connect to email, databases, CRMs, commerce platforms, logistics services, internal APIs, and other systems that provide a secure integration method.' },
    ],
    relatedWork: ['lanewise', 'rekkrd'],
  },
  {
    slug: 'mobile-app-development',
    title: 'Mobile App Development',
    shortTitle: 'Mobile applications',
    description:
      'Sweetwater Technology builds focused mobile applications for iPhone, iPad, and cross-platform product experiences using React Native, Expo, and Flutter.',
    intro:
      'A mobile application should use the device for a clear reason. Sweetwater Technology builds products around camera capture, field workflows, notifications, portable collections, and other experiences that benefit from being available where the user is.',
    audience: [
      'Product teams extending a web platform to iPhone, iPad, or Android',
      'Businesses whose users work in stores, farms, classrooms, warehouses, or other field environments',
      'Consumer products that depend on camera capture, notifications, offline access, or portable personal data',
      'Founders who need one maintainable codebase across multiple mobile platforms',
    ],
    deliverables: [
      { title: 'Mobile product design', description: 'Touch-first navigation, device-aware workflows, and responsive layouts built for real usage conditions.' },
      { title: 'Cross-platform development', description: 'React Native, Expo, or Flutter implementation selected for the product and existing technology stack.' },
      { title: 'Backend integration', description: 'Secure authentication, synchronization, subscriptions, notifications, media, and API connections.' },
      { title: 'Store preparation', description: 'Build configuration, privacy details, screenshots, release checks, and submission support for the applicable stores.' },
    ],
    process: [
      { title: 'Define the mobile advantage', description: 'We establish why the experience belongs on a device and which capabilities matter to users away from a desk.' },
      { title: 'Prototype the critical flow', description: 'The riskiest interaction is tested early on representative screen sizes.' },
      { title: 'Build and test on devices', description: 'Development includes device behavior, permissions, connectivity changes, and platform conventions.' },
      { title: 'Prepare the release', description: 'Store assets, privacy disclosures, production configuration, and release builds are checked together.' },
    ],
    faqs: [
      { question: 'Do you build native or cross-platform mobile apps?', answer: 'Sweetwater Technology primarily uses React Native, Expo, and Flutter for shared mobile development. The final choice depends on device requirements, the existing product stack, and long-term maintenance needs.' },
      { question: 'Can a mobile app share data with an existing website?', answer: 'Yes. Mobile and web applications can use the same authenticated backend so accounts, collections, subscriptions, and operational data remain synchronized.' },
      { question: 'Can you help launch an app in the App Store?', answer: 'Yes. Store preparation can include build configuration, screenshots, privacy disclosures, listing content, testing, and submission support.' },
    ],
    relatedWork: ['rekkrd'],
  },
];

export const WORK_PROFILES: WorkProfile[] = [
  {
    slug: 'rekkrd',
    title: 'Rekkrd',
    category: 'AI-native music collection platform',
    description: 'Rekkrd helps collectors identify, catalog, value, and rediscover physical music while documenting listening history and audio gear.',
    externalUrl: 'https://rekkrd.com',
    image: '/images/optimized/rekkrd-product.webp',
    imageAlt: 'Rekkrd website showing its AI-powered vinyl collection experience',
    imageWidth: 1299,
    imageHeight: 822,
    operatingSystem: 'Web, iOS, iPadOS',
    applicationCategory: 'MusicApplication',
    overview: 'Rekkrd is a web and Apple-platform companion for physical music collectors. It works alongside Discogs and adds camera-based identification, listening history, value analytics, playlists, and a connected audio-equipment catalog called Stakkd.',
    challenge: 'Collectors often split their activity across a marketplace database, notes, spreadsheets, pricing searches, and memory. Those tools document ownership but do not create a cohesive daily experience around listening, valuation, and the equipment used to play a collection.',
    solution: 'Sweetwater Technology built a synchronized web, iPhone, and iPad product that imports existing Discogs data and enriches it with AI-assisted identification, collection workflows, listening records, and gear relationships.',
    capabilities: ['AI-assisted cover and label identification', 'Discogs collection import and data export', 'Collection valuation and price alerts', 'Spins and listening history', 'Stakkd audio gear and signal-chain catalog', 'Web, iPhone, and iPad synchronization'],
    stack: ['React', 'TypeScript', 'Supabase', 'Gemini AI', 'Tailwind CSS', 'iOS'],
    relatedServices: ['mobile-app-development', 'ai-workflow-automation'],
  },
  {
    slug: 'lanewise',
    title: 'LaneWise',
    category: 'Logistics quoting copilot',
    description: 'LaneWise turns inbound freight spot-quote emails into transparent, review-ready drafts with market-rate context.',
    externalUrl: 'https://lanewise.io',
    image: '/images/optimized/lanewise.webp',
    imageAlt: 'LaneWise logistics quoting application icon',
    imageWidth: 512,
    imageHeight: 512,
    operatingSystem: 'Web, Desktop',
    applicationCategory: 'BusinessApplication',
    overview: 'LaneWise is a quoting copilot for freight brokers. It monitors a connected inbox for spot-quote requests, extracts lane and load details, checks a live market rate, and prepares an all-in quote for a broker to review.',
    challenge: 'Freight brokers lose time reading inconsistent quote requests, re-entering shipment details, checking rates, and drafting similar responses. Fully automatic sending would remove the broker from a decision that depends on assumptions and market judgment.',
    solution: 'Sweetwater Technology designed LaneWise as a human-supervised workflow. The product prepares the structured request and quote draft, shows its assumptions, and leaves adjustment and sending under the broker’s control.',
    capabilities: ['Connected-inbox monitoring', 'Shipment detail extraction', 'Live market-rate context', 'Transparent all-in quote preparation', 'Visible assumptions and manual adjustment', 'Broker-controlled email sending'],
    stack: ['React', 'TypeScript', 'Supabase', 'Email automation', 'Rate intelligence', 'Electron'],
    relatedServices: ['custom-web-applications', 'ai-workflow-automation'],
  },
  {
    slug: 'atl-urban-farms',
    title: 'ATL Urban Farms',
    category: 'Live-plant e-commerce platform',
    description: 'ATL Urban Farms combines a live-seedling storefront with weekly fulfillment, plant recommendations, shipping coordination, and operational administration.',
    externalUrl: 'https://atlurbanfarms.com',
    operatingSystem: 'Web',
    applicationCategory: 'ShoppingApplication',
    overview: 'ATL Urban Farms is a full-stack commerce platform designed around the operational constraints of selling and shipping live seedlings. The product serves home gardeners, schools, and urban farms.',
    challenge: 'Live plants are perishable inventory. Product availability, weekly growing batches, safe shipping days, customer guidance, and order administration must work together in ways a generic catalog does not model well.',
    solution: 'Sweetwater Technology built a specialized storefront and administrative system with plant discovery, AI-assisted recommendations, Stripe payments, ShipEngine integration, and fulfillment tools aligned to weekly harvesting and early-week shipping.',
    capabilities: ['Live-seedling product catalog', 'Weekly batch fulfillment', 'AI-assisted plant recommendations', 'Stripe commerce workflows', 'ShipEngine shipping integration', 'Multi-section operations administration'],
    stack: ['React', 'TypeScript', 'Supabase', 'Stripe', 'ShipEngine', 'Gemini AI', 'Tailwind CSS'],
    relatedServices: ['custom-web-applications', 'ai-workflow-automation'],
  },
];

export const findService = (slug: string) => SERVICES.find((service) => service.slug === slug);
export const findWorkProfile = (slug: string) => WORK_PROFILES.find((profile) => profile.slug === slug);
