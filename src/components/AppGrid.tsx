import React from 'react';
import { PROJECTS } from '../constants';
import type { AppProject } from '../types';
import { AppCardRenderer } from './AppCardRenderer';

interface AppGridProps {
  onSelectApp: (app: AppProject) => void;
  projects?: AppProject[];
}

export const AppGrid: React.FC<AppGridProps> = ({ onSelectApp, projects = PROJECTS }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
      {projects.map((app, index) => (
        <AppCardRenderer
          key={app.id}
          app={app}
          index={index}
          onClick={() => onSelectApp(app)}
        />
      ))}
    </div>
  );
};
