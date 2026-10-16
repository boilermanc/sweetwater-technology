export interface Resource {
  slug: string;
  title: string;
  description: string;
  kind: string;
  article?: boolean;
  file?: string;
  repository?: string;
  video?: string;
  poster?: string;
  highlights?: string[];
}

export const RESOURCES: Resource[] = [
  { slug: 'try-ai-this-week', title: 'Try AI This Week', description: 'A simple starter guide for small businesses. Five practical experiments using fictional examples or public information.', kind: 'Guide', article: true },
  {
    slug: 'codex-cyd-dashboard',
    title: 'Codex CYD Dashboard',
    description: 'Turn an ESP32 Cheap Yellow Display into a touchscreen dashboard for your local Codex chats. See live status and tap a card to open its exact chat.',
    kind: 'Open-source hardware project',
    repository: 'https://github.com/boilermanc/codex-cyd-dashboard',
    video: '/resources/media/codex-cyd-dashboard.mp4',
    poster: '/resources/media/codex-cyd-dashboard.png',
    highlights: [
      'A separate card for every chat, including multiple chats in the same project.',
      'Color-coded Working, Needs you, Done, Idle and Error states.',
      'Tap a card to open the exact chat; page through six chats at a time.',
      'Firmware, Windows USB helper, setup instructions and recovery guidance on GitHub.',
    ],
  },
  {
    slug: 'about-page-codex-skill',
    title: 'About Page Codex Skill',
    description: 'A ready-to-use Codex SKILL.md file that helps you create a clear, credible About page for any business.',
    kind: 'Codex skill · ZIP',
    file: '/downloads/about-page-codex-skill.zip',
  },
];

export const findResource = (slug: string) => RESOURCES.find((resource) => resource.slug === slug);
