import React from 'react';
import { PROJECTS } from '../constants';
import type { AppProject } from '../types';
import { AppCard } from './AppCard';

interface AppGridProps {
  onSelectApp: (app: AppProject) => void;
}

export const AppGrid: React.FC<AppGridProps> = ({ onSelectApp }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {PROJECTS.map((app, index) => (
        <AppCard
          key={app.id}
          app={app}
          index={index}
          onClick={() => onSelectApp(app)}
        />
      ))}
    </div>
  );
};
