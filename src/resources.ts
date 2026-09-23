export interface Resource {
  slug: string;
  title: string;
  description: string;
  kind: string;
  file: string;
}

export const RESOURCES: Resource[] = [
  {
    slug: 'about-page-codex-skill',
    title: 'About Page Codex Skill',
    description: 'A ready-to-use Codex SKILL.md file that helps you create a clear, credible About page for any business.',
    kind: 'Codex skill · ZIP',
    file: '/downloads/about-page-codex-skill.zip',
  },
];

export const findResource = (slug: string) => RESOURCES.find((resource) => resource.slug === slug);
