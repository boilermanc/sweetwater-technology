export type PaperStatus = 'Thesis' | 'Essay' | 'Prototype' | 'Shipped';
export interface Paper {
  slug: string;
  title: string;
  summary: string;
  datePublished: string;
  status: PaperStatus;
}

// Publication date follows the original Continuum introduction in Git history.
// Add one entry here to add a paper card to Headwaters.
export const HEADWATERS_PAPERS: Paper[] = [
  {
    slug: 'continuum',
    title: 'Sweetwater Continuum',
    summary: 'Your AI tools should remember you — but never act for you without a fresh, limited yes.',
    datePublished: '2026-08-28',
    status: 'Thesis',
  },
];
export const CONTINUUM_PAPER = HEADWATERS_PAPERS.find(paper => paper.slug === 'continuum')!;
export const paperPath = (paper: Paper) => `/headwaters/${paper.slug}/`;
export const HEADWATERS_INTRO = 'Where ideas start. Headwaters is where we think out loud about where AI and software are heading — before any of it becomes a product.';
