import type { AppProject } from './types';

export const PROJECTS: AppProject[] = [
  {
    id: 'rekkrd',
    title: 'Rekkrd',
    category: 'AI + Music',
    description: 'Scan your vinyl with AI. Build your collection. Generate mood-based playlists from your shelves.',
    longDescription: 'A vinyl record collection manager powered by Gemini Vision. Point your camera at an album cover and Rekkrd identifies it instantly — pulling in metadata, cover art, and track listings. Browse your collection in grid or list view, grade condition, add tags and notes, and let the AI build playlists from what you actually own.',
    image: '/images/1771516109417.jpg',
    tags: ['React', 'TypeScript', 'Gemini AI', 'Supabase', 'Tailwind'],
    link: 'https://rekkrd.com',
    color: 'from-orange-400 to-amber-700'
  },
  {
    id: 'once-upon-a-drawing',
    title: 'Once Upon a Drawing',
    category: 'AI / Creative',
    description: 'Transforms children\'s drawings into cinematic Pixar-style storybooks and museum-grade printed hardcover keepsakes. Every scribble has a story.',
    longDescription: 'Once Upon a Drawing uses AI to analyze a child\'s artwork — extracting characters, scenes, and emotions — then generates a 12-spread cinematic storybook with Pixar-quality 3D illustrations and an HD animation. Parents can order archival-quality printed hardcovers, turning ephemeral crayon scribbles into treasured family keepsakes that last generations.',
    image: '/images/once_5543132.jpg',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Supabase', 'Gemini AI', 'Stripe'],
    link: 'https://onceuponadrawing.com',
    color: '#62929e'
  },
  {
    id: 'rejoice',
    title: 'Rejoice',
    category: 'Mobile App',
    description: 'An emotion-driven Bible study app that generates personalized AI-powered scripture studies based on how you feel.',
    longDescription: 'Rejoice transforms Bible study into a deeply personal experience by responding to your emotional state with tailored scripture, reflection prompts, and prayer points. With a community prayer wall, achievement tracking, and daily devotion reminders, it helps users build a vibrant spiritual practice. Powered by AI content generation and built on React Native with Supabase.',
    image: '/images/rejoice_55428738.jpg',
    tags: ['React Native', 'Expo', 'TypeScript', 'Supabase', 'AI'],
    link: 'https://letsrejoice.app',
    color: '#655A7C'
  },
  {
    id: 'sproutify',
    title: 'Sproutify',
    category: 'Mobile App',
    description: 'The ultimate companion app for aeroponic tower growers — AI-powered planning, community engagement, and comprehensive plant management.',
    longDescription: 'Sproutify helps aeroponic tower gardeners grow smarter with an AI-powered planning assistant (Sage), a catalog of 100+ plants with community ratings, and support for 20+ tower brands. Track costs, identify pests, share harvests with the community, and level up through gamified achievements — all from one beautifully designed app.',
    image: '/images/home_2987394.PNG',
    tags: ['Flutter', 'Supabase', 'AI', 'RevenueCat', 'Dart'],
    link: 'https://www.sproutify.app/sproutify-home.html',
    color: '#899786'
  },
  {
    id: 'sproutify-classrooms',
    title: 'Sproutify Classrooms',
    category: 'EdTech',
    description: 'Aeroponic garden management tools for educators and students to explore sustainable agriculture together.',
    longDescription: 'Sproutify Classrooms is a comprehensive web application for managing classroom hydroponic tower gardens. Teachers track plant growth, monitor environmental data like pH and EC, log harvests and waste, and engage students through gamified learning with leaderboards and achievements. It scales from individual classrooms to entire school districts with role-based administration.',
    image: '/images/file_00000000ebf871fd9be2d9a59b6f5f0d.png',
    tags: ['React', 'TypeScript', 'Supabase', 'Stripe', 'Tailwind CSS', 'Vite'],
    link: 'https://school.sproutify.app/',
    color: '#279B51'
  },
  {
    id: 'sproutify-farm',
    title: 'Sproutify Farm',
    category: 'Farm Management',
    description: 'The complete farm management system for commercial aeroponic farms. Track towers, optimize yields, and grow smarter with AI-powered insights.',
    longDescription: 'Sproutify Farm is a cloud-based management platform built specifically for commercial aeroponic and vertical tower garden operations. It combines real-time nutrient monitoring, integrated pest management, planting planners, and AI-powered analytics into a single dashboard. With native mobile apps designed for greenhouse use and a comprehensive web interface, it helps urban farmers scale operations while maintaining quality control across every tower.',
    image: '/images/IMG20250728081625.jpg',
    tags: ['React', 'TypeScript', 'Supabase', 'Tailwind CSS', 'React Native', 'Expo', 'Vite', 'Stripe'],
    link: 'https://farm.sproutify.app',
    color: '#16a34a'
  },
  {
    id: 'shanes-retirement-fund',
    title: 'Shane\'s Retirement Fund',
    category: 'Social Finance',
    description: 'Pool together, win together. The easiest way to manage lottery pools with friends, family, and coworkers.',
    longDescription: 'Shane\'s Retirement Fund is a mobile-first lottery pool web app that lets users create syndicates, invite friends, scan tickets with OCR, and automatically check for wins. It replaces messy spreadsheets and group chats with a transparent, trustworthy platform — so everyone knows what tickets were bought, what the odds are, and who won.',
    image: '/images/lottery_9928883.jpg',
    tags: ['React 19', 'TypeScript', 'Supabase', 'Zustand', 'Framer Motion', 'Vite', 'Tailwind CSS'],
    link: 'https://shanesfund.vercel.app',
    color: '#006D77'
  },
  {
    id: 'sproutify-micro',
    title: 'Sproutify Micro',
    category: 'Farm Management',
    description: 'Complete microgreen farm management — track every tray from seed to harvest, streamline orders, and scale your growing operation.',
    longDescription: 'Sproutify Micro is a purpose-built management platform for microgreen growers. It unifies daily seeding and harvest workflows, customer order fulfillment, inventory tracking, and team coordination into a single system. With an AI-powered assistant, mobile-first worker interface, and real-time tray lifecycle visibility, it helps farms scale without the operational chaos.',
    image: '/images/micro_177363657.jpg',
    tags: ['React', 'TypeScript', 'Supabase', 'React Native', 'Tailwind CSS', 'Framer Motion'],
    link: 'https://micro.sproutify.app',
    color: '#10B981'
  },
  {
    id: 'atl-urban-farms',
    title: 'ATL Urban Farms',
    category: 'E-Commerce',
    description: 'Live plant seedlings e-commerce platform with weekly batch fulfillment, AI-powered recommendations, and multi-channel shipping for urban growers.',
    longDescription: 'ATL Urban Farms is a full-stack e-commerce platform purpose-built for selling live plant seedlings. It features 321+ products across 9 categories, an AI garden assistant (Sage), ShipEngine-powered shipping with live-plant-safe scheduling, and a comprehensive 18-section admin panel. The platform serves home gardeners, schools, and urban farmers with weekly batch harvesting and Monday-Tuesday shipping to ensure plants arrive alive.',
    image: '/images/P5020028-ATLUFarm040322.jpg',
    tags: ['React', 'TypeScript', 'Supabase', 'Stripe', 'ShipEngine', 'Framer Motion', 'TailwindCSS', 'Gemini AI'],
    link: 'https://atlurbanfarms.com',
    color: '#10B981'
  }
];
