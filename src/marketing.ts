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
    "slug": "custom-web-applications",
    "title": "Custom Web Application Development",
    "shortTitle": "Custom web apps",
    "description": "Keep jobs, customers and paperwork in one place with software built around your business.",
    "intro": "When spreadsheets and separate tools stop fitting the job, a custom app can bring the important details together. We start with the work your team needs to do.",
    "audience": [
      "Teams copying details between emails and spreadsheets",
      "Businesses that need a place for customers to request work or check progress",
      "Owners with an app idea they want to test"
    ],
    "deliverables": [
      {
        "title": "A clear plan",
        "description": "Agree what the first version needs to do and what it will cost."
      },
      {
        "title": "An app your team can use",
        "description": "Clear screens for everyday tasks, on a computer or phone."
      },
      {
        "title": "Connected tools",
        "description": "Bring information across from your existing tools where they support it."
      },
      {
        "title": "Help getting started",
        "description": "Testing, training and handover so the team can use what we build."
      }
    ],
    "process": [
      {
        "title": "Understand the job",
        "description": "Show us where time gets lost."
      },
      {
        "title": "Agree the first step",
        "description": "Choose a useful starting point and a clear price."
      },
      {
        "title": "Try working software",
        "description": "Review it as we build and tell us what needs changing."
      },
      {
        "title": "Put it to work",
        "description": "Test the important tasks and help your team get started."
      }
    ],
    "faqs": [
      {
        "question": "What does it cost?",
        "answer": "The first conversation is free. We agree the scope and price before paid work begins."
      },
      {
        "question": "Can you improve an app we already use?",
        "answer": "Often, yes. We will look at the app and explain what can be changed before proposing work."
      }
    ],
    "relatedWork": [
      "lanewise",
      "atl-urban-farms"
    ]
  },
  {
    "slug": "ai-workflow-automation",
    "title": "AI helpers for everyday work",
    "shortTitle": "AI helpers",
    "description": "Prepare replies, organize incoming information and cut repeated typing with practical AI your team can review.",
    "intro": "Start with one repeated task and test whether AI can help.",
    "audience": [
      "Small and growing businesses"
    ],
    "deliverables": [
      {
        "title": "Useful drafts",
        "description": "Give your team something to review instead of a blank page."
      }
    ],
    "process": [
      {
        "title": "Start small",
        "description": "Agree a task, a test and a price."
      }
    ],
    "faqs": [
      {
        "question": "What does it cost?",
        "answer": "The first conversation is free. Paid work is scoped and priced separately."
      }
    ],
    "relatedWork": [
      "lanewise"
    ]
  },
  {
    "slug": "mobile-app-development",
    "title": "Mobile App Development",
    "shortTitle": "Mobile apps",
    "description": "Useful tools for customers and crews, wherever the work happens.",
    "intro": "A phone can help people capture a photo, update a job or find the details they need away from a desk. We build around that useful task.",
    "audience": [
      "Crews working on site",
      "Businesses whose customers need a simple mobile tool",
      "Owners with a new app idea"
    ],
    "deliverables": [
      {
        "title": "Easy-to-use screens",
        "description": "Clear actions designed for a phone."
      },
      {
        "title": "Shared information",
        "description": "Keep the app and your existing business tools in step where connections are available."
      },
      {
        "title": "Device testing",
        "description": "Check the important tasks on the devices your users need."
      },
      {
        "title": "Launch support",
        "description": "Prepare the app, store listing and handover together."
      }
    ],
    "process": [
      {
        "title": "Choose the task",
        "description": "Find what is easier on a phone."
      },
      {
        "title": "Try the idea",
        "description": "Check the main screens before building everything."
      },
      {
        "title": "Build and test",
        "description": "Try the app on real devices."
      },
      {
        "title": "Help people start",
        "description": "Prepare launch materials and support."
      }
    ],
    "faqs": [
      {
        "question": "Can an app connect to our website?",
        "answer": "Often, yes. We check how your current website stores and shares information first."
      },
      {
        "question": "Can you help with app store release?",
        "answer": "Yes. We can help prepare the listing, testing and submission. Store approval remains with the store."
      }
    ],
    "relatedWork": [
      "rekkrd"
    ]
  }
];

export const WORK_PROFILES: WorkProfile[] = [
  {
    slug: 'rekkrd',
    title: 'Rekkrd',
    category: 'AI-native music collection platform',
    description: 'Rekkrd helps collectors identify, catalog, value, and rediscover physical music while documenting listening history and audio gear.',
    externalUrl: 'https://rekkrd.com',
    image: '/images/optimized/rekkrd-card.webp',
    imageAlt: 'Vinyl records representing the Rekkrd music collection application',
    imageWidth: 784,
    imageHeight: 1168,
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
    image: '/images/optimized/atl-urban-farms.webp',
    imageAlt: 'Live seedlings grown for ATL Urban Farms customers',
    imageWidth: 1152,
    imageHeight: 922,
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
