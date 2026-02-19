import type { AppProject } from './types';

export const PROJECTS: AppProject[] = [
  {
    id: '1',
    title: 'AquaStream',
    category: 'FinTech',
    description: 'High-velocity liquidity management for modern enterprises.',
    longDescription: 'AquaStream redefines how CFOs manage corporate liquidity. Using real-time streaming data, it predicts cash flow bottlenecks before they happen, allowing for seamless capital allocation across global subsidiaries.',
    image: 'https://picsum.photos/800/600?random=1',
    tags: ['Real-time', 'Predictive', 'Enterprise'],
    link: '#',
    color: 'from-blue-400 to-indigo-600'
  },
  {
    id: '2',
    title: 'FlowState',
    category: 'Productivity',
    description: 'Deep-focus neuro-adaptive workspace for developers.',
    longDescription: 'FlowState integrates directly with your neurological rhythm. By monitoring subtle eye movement and typing cadence, it optimizes your environment—adjusting lighting, music, and notification suppression to keep you in the zone.',
    image: 'https://picsum.photos/800/600?random=2',
    tags: ['AI-Powered', 'Workspace', 'Wellness'],
    link: '#',
    color: 'from-cyan-400 to-blue-600'
  },
  {
    id: '3',
    title: 'Riptide Analytics',
    category: 'Data Science',
    description: 'Chaos-theory based market analysis for volatile assets.',
    longDescription: 'Riptide doesn\'t just look at charts; it analyzes the underlying currents of market psychology. Utilizing advanced chaos theory algorithms, it identifies structural shifts in market regimes with unprecedented accuracy.',
    image: 'https://picsum.photos/800/600?random=3',
    tags: ['Analytics', 'Chaos Theory', 'Finance'],
    link: '#',
    color: 'from-violet-400 to-purple-600'
  },
  {
    id: '4',
    title: 'Vapor CRM',
    category: 'SaaS',
    description: 'Zero-friction relationship management that works for you.',
    longDescription: 'Vapor is the CRM that requires no entry. It lives in your communication stack, automatically distilling meetings, emails, and calls into actionable client insights and pipeline updates without human intervention.',
    image: 'https://picsum.photos/800/600?random=4',
    tags: ['Automation', 'SaaS', 'Sales'],
    link: '#',
    color: 'from-sky-400 to-blue-500'
  },
  {
    id: '5',
    title: 'DeepBlue Core',
    category: 'Infrastructure',
    description: 'Serverless architecture for edge-native applications.',
    longDescription: 'DeepBlue Core provides the backbone for the next generation of decentralized web. It enables sub-millisecond latency for compute-heavy tasks at the edge, scaling elastically across millions of nodes.',
    image: 'https://picsum.photos/800/600?random=5',
    tags: ['Edge', 'Infrastructure', 'Scale'],
    link: '#',
    color: 'from-indigo-500 to-blue-700'
  },
  {
    id: '6',
    title: 'Current.OS',
    category: 'OS',
    description: 'Fluid operating environment for spatial computing.',
    longDescription: 'Current.OS is built from the ground up for the era of spatial computing. It removes the abstraction of windows and files, replacing them with fluid streams of contextually relevant information and immersive tools.',
    image: 'https://picsum.photos/800/600?random=6',
    tags: ['Spatial', 'UI/UX', 'OS'],
    link: '#',
    color: 'from-blue-600 to-violet-700'
  }
];
