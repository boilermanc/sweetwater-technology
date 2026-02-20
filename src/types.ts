export interface AppProject {
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  image: string;
  tags: string[];
  link: string;
  color: string;
}

export type BackgroundTexture = 'grain' | 'grid' | 'flow' | 'liquid';
