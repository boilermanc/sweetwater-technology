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

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export type BackgroundTexture = 'grain' | 'grid' | 'flow' | 'liquid';
