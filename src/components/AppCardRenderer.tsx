import type { ComponentType } from 'react';
import type { AppProject } from '../types';
import { AppCard } from './AppCard';
import ATLUrbanFarmsCard from './cards/ATLUrbanFarmsCard';
import LanewiseCard from './cards/LanewiseCard';
import OnceUponADrawingCard from './cards/OnceUponADrawingCard';
import RejoiceCard from './cards/RejoiceCard';
import RekkrdCard from './cards/RekkrdCard';
import ShanesRetirementFundCard from './cards/ShanesRetirementFundCard';
import SproutifyCard from './cards/SproutifyCard';
import SproutifyClassroomsCard from './cards/SproutifyClassroomsCard';
import SproutifyFarmCard from './cards/SproutifyFarmCard';
import SproutifyMicroCard from './cards/SproutifyMicroCard';

interface AppCardRendererProps {
  app: AppProject;
  index: number;
  onClick: () => void;
}

const CARD_COMPONENTS: Partial<Record<string, ComponentType<AppCardRendererProps>>> = {
  'atl-urban-farms': ATLUrbanFarmsCard,
  lanewise: LanewiseCard,
  'once-upon-a-drawing': OnceUponADrawingCard,
  rejoice: RejoiceCard,
  rekkrd: RekkrdCard,
  'shanes-retirement-fund': ShanesRetirementFundCard,
  sproutify: SproutifyCard,
  'sproutify-classrooms': SproutifyClassroomsCard,
  'sproutify-farm': SproutifyFarmCard,
  'sproutify-micro': SproutifyMicroCard,
};

export function AppCardRenderer({ app, index, onClick }: AppCardRendererProps) {
  const Card = CARD_COMPONENTS[app.id] ?? AppCard;
  return <Card app={app} index={index} onClick={onClick} />;
}
