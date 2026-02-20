import React from 'react';
import { PROJECTS } from '../constants';
import type { AppProject } from '../types';
import { AppCard } from './AppCard';
import RekkrdCard from './cards/RekkrdCard';
import OnceUponADrawingCard from './cards/OnceUponADrawingCard';
import RejoiceCard from './cards/RejoiceCard';
import SproutifyCard from './cards/SproutifyCard';
import SproutifyClassroomsCard from './cards/SproutifyClassroomsCard';
import SproutifyFarmCard from './cards/SproutifyFarmCard';
import ShanesRetirementFundCard from './cards/ShanesRetirementFundCard';
import SproutifyMicroCard from './cards/SproutifyMicroCard';
import ATLUrbanFarmsCard from './cards/ATLUrbanFarmsCard';

interface AppGridProps {
  onSelectApp: (app: AppProject) => void;
}

export const AppGrid: React.FC<AppGridProps> = ({ onSelectApp }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
      {PROJECTS.map((app, index) =>
        app.id === 'rekkrd' ? (
          <RekkrdCard
            key={app.id}
            app={app}
            index={index}
            onClick={() => onSelectApp(app)}
          />
        ) : app.id === 'once-upon-a-drawing' ? (
          <OnceUponADrawingCard
            key={app.id}
            app={app}
            index={index}
            onClick={() => onSelectApp(app)}
          />
        ) : app.id === 'rejoice' ? (
          <RejoiceCard
            key={app.id}
            app={app}
            index={index}
            onClick={() => onSelectApp(app)}
          />
        ) : app.id === 'sproutify' ? (
          <SproutifyCard
            key={app.id}
            app={app}
            index={index}
            onClick={() => onSelectApp(app)}
          />
        ) : app.id === 'sproutify-classrooms' ? (
          <SproutifyClassroomsCard
            key={app.id}
            app={app}
            index={index}
            onClick={() => onSelectApp(app)}
          />
        ) : app.id === 'sproutify-farm' ? (
          <SproutifyFarmCard
            key={app.id}
            app={app}
            index={index}
            onClick={() => onSelectApp(app)}
          />
        ) : app.id === 'shanes-retirement-fund' ? (
          <ShanesRetirementFundCard
            key={app.id}
            app={app}
            index={index}
            onClick={() => onSelectApp(app)}
          />
        ) : app.id === 'sproutify-micro' ? (
          <SproutifyMicroCard
            key={app.id}
            app={app}
            index={index}
            onClick={() => onSelectApp(app)}
          />
        ) : app.id === 'atl-urban-farms' ? (
          <ATLUrbanFarmsCard
            key={app.id}
            app={app}
            index={index}
            onClick={() => onSelectApp(app)}
          />
        ) : (
          <AppCard
            key={app.id}
            app={app}
            index={index}
            onClick={() => onSelectApp(app)}
          />
        )
      )}
    </div>
  );
};
