export const SERVICE_AREA_COPY = 'We work with small businesses in metro Atlanta and remotely.';

export const SERVICE_ENGAGEMENT_STEPS = [
  { title: 'Fit call', description: 'Start with a free 20-minute fit call.' },
  { title: 'Paid assessment', description: 'If there’s a fit, we scope and price a paid assessment.' },
  { title: 'Implementation', description: 'Implementation is scoped and priced separately after the assessment.' },
];

export const SERVICE_PRICING = SERVICE_ENGAGEMENT_STEPS.map((step) => step.description).join(' ');

export const SERVICES_COPY = {
  title: 'AI consulting and custom software for small businesses',
  description: 'Sweetwater Technology helps small businesses automate repetitive work, connect the tools they use, and build custom web and mobile apps.',
};
export const AI_SERVICES_COPY = {
  title: 'AI consulting and workflow automation for small businesses',
  description: `Get help with AI consulting and workflow automation. ${SERVICE_AREA_COPY}`,
  faqs: [
    { question: 'Will it replace my staff?', answer: "We focus on helping your team with repetitive work. You decide what changes." },
    { question: 'Does it work with my current software?', answer: "Often, yes. We'll tell you honestly if not." },
    { question: 'What about sensitive information?', answer: 'We use only what the job needs and talk through data handling first.' },
    { question: 'What does it cost?', answer: SERVICE_PRICING },
  ],
};
