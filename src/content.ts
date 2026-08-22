export interface FAQItem {
  category: string;
  question: string;
  answer: string;
}

export const FAQS: FAQItem[] = [
  {
    category: 'Working With Us',
    question: 'What kind of projects do you build?',
    answer:
      'Sweetwater Technology builds full-stack web apps, mobile apps, AI-powered features, e-commerce platforms, and SaaS products. We work on early-stage MVPs and production-scale systems.',
  },
  {
    category: 'Process',
    question: 'How does a typical engagement start?',
    answer:
      'Every engagement starts with a conversation about what you are building and where you are stuck. We then scope the work, propose an approach, and begin once the plan is aligned.',
  },
  {
    category: 'Technology',
    question: "What's your tech stack?",
    answer:
      'Our core stack includes React, TypeScript, Tailwind CSS, Supabase, and Framer Motion. We also work with React Native, Expo, Flutter, Stripe, ShipEngine, and Google Gemini AI when a project calls for them.',
  },
  {
    category: 'Pricing',
    question: 'How do you structure pricing?',
    answer:
      'We offer project-based pricing for defined scopes and monthly retainers for ongoing development. Every engagement starts with a clear proposal, and scope changes require a conversation.',
  },
  {
    category: 'Timeline',
    question: 'How quickly can you deliver?',
    answer:
      'MVPs typically ship in weeks rather than months. The exact timeline depends on scope, integrations, and the readiness of the product requirements.',
  },
];
