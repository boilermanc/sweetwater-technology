export type SegmentId = 'agtech' | 'inspection' | 'freight' | 'mobile' | 'custom';

export interface SegmentConfig {
  id: SegmentId;
  chipLabel: string;
  heroHeadline: string;
  heroSub: string;
  portfolioOrder: string[];
  sageOpener: string;
}

export const SEGMENT_ORDER: SegmentId[] = ['agtech', 'inspection', 'freight', 'mobile', 'custom'];

export const SEGMENTS: Record<SegmentId, SegmentConfig> = {
  agtech: {
    id: 'agtech',
    chipLabel: 'Farming and agriculture',
    heroHeadline: 'Software built for growers',
    heroSub: 'From greenhouse operations to the home harvest, practical tools make every growing decision clearer.',
    portfolioOrder: ['sproutify-farm', 'sproutify-classrooms', 'sproutify-micro', 'sproutify', 'atl-urban-farms'],
    sageOpener: 'Let me show you the products helping growers, educators, and farms run with less friction.',
  },
  inspection: {
    id: 'inspection',
    chipLabel: 'Home inspection',
    heroHeadline: 'From inquiry to booked and paid',
    heroSub: 'A smoother client journey for inspection teams, with fewer handoffs and less time lost to admin.',
    portfolioOrder: ['spectiq', 'lanewise', 'sproutify', 'rekkrd', 'rejoice'],
    sageOpener: 'SpectIQ is the closest match. It is designed to make the path from a new lead to a completed job feel effortless.',
  },
  freight: {
    id: 'freight',
    chipLabel: 'Freight and logistics',
    heroHeadline: 'Inbound quotes, drafted for you',
    heroSub: 'Turn a busy inbox into review-ready freight quotes while keeping brokers in control of every send.',
    portfolioOrder: ['lanewise', 'spectiq', 'sproutify', 'rekkrd', 'rejoice'],
    sageOpener: 'LaneWise is built for this world. It takes the repetitive work out of spot quotes without taking judgment away from the broker.',
  },
  mobile: {
    id: 'mobile',
    chipLabel: 'I need a mobile app',
    heroHeadline: 'Consumer apps people love',
    heroSub: 'Focused mobile products with the polish, utility, and personality that bring people back.',
    portfolioOrder: ['rejoice', 'rekkrd', 'sproutify', 'spectiq', 'lanewise'],
    sageOpener: 'You are in the right place. Rejoice, Rekkrd, and Sproutify Home show three very different mobile experiences we have brought to life.',
  },
  custom: {
    id: 'custom',
    chipLabel: 'Something else',
    heroHeadline: 'Software that flows like water',
    heroSub: 'Custom web apps, mobile products, and thoughtful automation built around the way your business actually works.',
    portfolioOrder: ['sproutify', 'spectiq', 'lanewise', 'rekkrd', 'rejoice'],
    sageOpener: 'I will give you the short tour, then we can narrow in on whatever caught your attention.',
  },
};

export const isSegmentId = (value: unknown): value is SegmentId =>
  typeof value === 'string' && SEGMENT_ORDER.includes(value as SegmentId);
