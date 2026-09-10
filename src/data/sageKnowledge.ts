export interface ProductKnowledge {
  label: string;
  headline: string;
  summary: string;
  outcomes: string[];
  faqs: { question: string; answer: string }[];
  status?: string;
}

export const PRODUCT_KNOWLEDGE: Record<string, ProductKnowledge> = {
  sproutify: {
    label: 'For home tower growers',
    headline: 'Confidence from planning through harvest.',
    summary: 'Sproutify Home puts tower tracking, plant care, water-quality records, pest guidance, and Sage in one approachable mobile experience.',
    outcomes: ['Manage indoor and outdoor towers', 'Track plants, harvests, pH, and EC', 'Get reminders and help when something looks off'],
    status: 'Live on iOS. Android is in development.',
    faqs: [
      { question: 'Will it work with my tower?', answer: 'Sproutify Home supports more than 20 aeroponic tower brands.' },
      { question: 'Can I try it first?', answer: 'Yes. Full growing tools include a seven-day trial, and the catalog, guides, and community remain available on the free tier.' },
    ],
  },
  'sproutify-farm': {
    label: 'For commercial tower growers',
    headline: 'Run every tower with a clearer view.',
    summary: 'Sproutify Farm brings crop planning, tower records, nutrient routines, harvest reporting, pest management, and daily team work together.',
    outcomes: ['Follow the full tower lifecycle', 'Coordinate staff work and compliance records', 'Manage multiple farms from one account'],
    faqs: [
      { question: 'Do I need special hardware?', answer: 'No. The core platform is software. Greenhouse equipment automation is a separate capability.' },
      { question: 'Can my whole crew use it?', answer: 'Yes. It supports team roles and is designed to work on a phone in the greenhouse.' },
    ],
  },
  'sproutify-classrooms': {
    label: 'For schools and educators',
    headline: 'Make the garden part of the lesson.',
    summary: 'Sproutify School helps teachers manage classroom towers while students participate in planting, observation, water-quality checks, and harvests.',
    outcomes: ['Give students a shared kiosk with a class PIN', 'Keep classroom growing records organized', 'Connect garden progress to science and sustainability'],
    faqs: [
      { question: 'Do students need accounts?', answer: 'No. Students use teacher-chosen display names and a shared kiosk with a class PIN.' },
      { question: 'Can a district use it?', answer: 'Yes. School- and district-level programs are supported; district reviews should be coordinated directly with Clint.' },
    ],
  },
  'sproutify-micro': {
    label: 'For microgreen farms',
    headline: 'Follow every tray from seed to sale.',
    summary: 'Sproutify Micro turns seeding, blackout, grow, harvest, inventory, and customer orders into one daily production flow.',
    outcomes: ['See every task due today', 'Plan production from delivery targets', 'Manage one-time and recurring orders'],
    status: 'Currently accepting waitlist signups.',
    faqs: [
      { question: 'Does it handle restaurant standing orders?', answer: 'Yes. The product supports recurring orders and tracks fulfillment through delivery.' },
      { question: 'Will it work in the grow room?', answer: 'Yes. Daily tasks, harvests, and recipes are designed to be usable from a phone.' },
    ],
  },
  'atl-urban-farms': {
    label: 'For live-plant commerce',
    headline: 'A storefront built around living inventory.',
    summary: 'ATL Urban Farms connects product discovery, garden guidance, weekly harvest batches, and careful shipping for customers buying live seedlings online.',
    outcomes: ['Help shoppers choose the right plants', 'Coordinate orders with harvest windows', 'Ship live products with fewer surprises'],
    faqs: [
      { question: 'Can home growers buy seedlings?', answer: 'Yes. ATL Urban Farms sells live seedlings and can help match plants to a home growing setup.' },
      { question: 'Why is fulfillment different?', answer: 'Live plants are harvested and shipped around safe weekly windows rather than treated like shelf-stable inventory.' },
    ],
  },
  spectiq: {
    label: 'For home inspection companies',
    headline: 'Keep the customer journey moving.',
    summary: 'SpectIQ is building one connected path for inquiry, estimates, agreements, payment, booking, and the next action for the team.',
    outcomes: ['Keep customer and property context on one deal', 'Use company rules for transparent estimates', 'Require people to approve consequential messages and changes'],
    status: 'Early access. Connected workflows are being completed for pilot use.',
    faqs: [
      { question: 'Is the phone agent live?', answer: 'The inbound voice agent is in controlled pilot design. Sage should offer an early-access conversation, not promise general availability.' },
      { question: 'Does AI set prices or send on its own?', answer: 'No. Company rules determine prices, and a person approves consequential customer messages and changes.' },
    ],
  },
  lanewise: {
    label: 'For freight brokers',
    headline: 'Move from inbox to review-ready quote.',
    summary: 'LaneWise reads inbound spot requests, checks the broker’s own rate source, and prepares a transparent draft while the broker controls every send.',
    outcomes: ['Reduce repetitive quote entry', 'Keep assumptions and special requirements visible', 'Work with Microsoft 365, Outlook, Google Workspace, or Gmail'],
    status: 'Early access.',
    faqs: [
      { question: 'Will it send quotes automatically?', answer: 'No. Draft-only is a permanent product principle; the broker always controls the send.' },
      { question: 'Where do rates come from?', answer: 'LaneWise uses the brokerage’s own DAT or Truckstop account. It does not pool or resell rate data.' },
    ],
  },
  rekkrd: {
    label: 'For vinyl collectors',
    headline: 'Turn a physical shelf into a living collection.',
    summary: 'Rekkrd catalogs records, tracks condition and estimated value, documents listening gear, and helps collectors enjoy what they already own.',
    outcomes: ['Identify and catalog physical releases', 'Import a Discogs collection or CSV', 'Track gear, wantlists, listening, and collection value'],
    status: 'Live on the web and on iOS.',
    faqs: [
      { question: 'Does it sync with Discogs?', answer: 'You can import a Discogs collection and use Discogs-backed release and pricing data. Sage should not promise continuous two-way collection sync.' },
      { question: 'Can I export my collection?', answer: 'Yes. Rekkrd supports a full collection export.' },
    ],
  },
  rejoice: {
    label: 'For a daily spiritual practice',
    headline: 'Meet people in the emotion they are feeling.',
    summary: 'Rejoice shapes scripture, context, reflection, and prayer around how the person feels in that moment.',
    outcomes: ['Begin with what you are carrying today', 'Receive a focused six-part devotional', 'Save studies and participate in the prayer wall'],
    status: 'Live on iOS and Android with a seven-day trial.',
    faqs: [
      { question: 'Which Bible translations are available?', answer: 'The app offers NIV, ESV, KJV, NLT, MSG, NKJV, and NASB, with NIV as the default.' },
      { question: 'Is emotional information private?', answer: 'Emotions and study content are processed to provide the service. Community posts are public when shared, and anonymous posts remain associated with the account for safety and operation.' },
    ],
  },
};
