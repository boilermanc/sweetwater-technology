export interface AppProject {
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  tags: string[];
  link: string;
  color: string;
}

export interface ChatMessage {
  role: 'assistant' | 'user';
  content: string;
}

export type BackgroundTexture = 'grain' | 'grid' | 'flow' | 'liquid';
