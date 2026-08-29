import React from 'react';
import { SweetwaterMark } from './SweetwaterMark';

interface SweetwaterLogoProps {
  className?: string;
  markClassName?: string;
  reversed?: boolean;
  animated?: boolean;
}

export const SweetwaterLogo: React.FC<SweetwaterLogoProps> = ({
  className = '',
  markClassName = 'h-10 w-10',
  reversed = false,
  animated = false,
}) => (
  <span className={`inline-flex items-center gap-3 ${className}`}>
    <SweetwaterMark animated={animated} className={`flex-none ${markClassName}`} />
    <span className="flex min-w-0 flex-col leading-none">
      <span
        className={`text-[1.35rem] font-extrabold tracking-[-0.055em] ${reversed ? 'text-white' : 'text-slate-950'}`}
      >
        SWEETWATER
      </span>
      <span
        className={`mt-1 text-[0.54rem] font-bold tracking-[0.36em] ${reversed ? 'text-blue-200' : 'text-blue-600'}`}
      >
        TECHNOLOGY
      </span>
    </span>
  </span>
);
