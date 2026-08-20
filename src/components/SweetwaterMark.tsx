import React from 'react';

interface SweetwaterMarkProps {
  className?: string;
  animated?: boolean;
}

export const SweetwaterMark: React.FC<SweetwaterMarkProps> = ({
  className = '',
  animated = true,
}) => {
  const clipId = React.useId();

  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx="32" cy="32" r="24" />
        </clipPath>
      </defs>

      <circle cx="32" cy="32" r="31" fill="#2f63e9" />
      <circle cx="32" cy="32" r="24" fill="#eef2ff" />

      <g clipPath={`url(#${clipId})`}>
        <g className={animated ? 'sweetwater-mark__waves' : undefined}>
          <path
            d="M-64 38 C-48 26 -32 26 -16 38 S16 50 32 38 S64 26 80 38 S112 50 128 38 S160 26 176 38 V70 H-64 Z"
            fill="#2f63e9"
          />
          <path
            d="M-64 45 C-48 37 -32 37 -16 45 S16 53 32 45 S64 37 80 45 S112 53 128 45 S160 37 176 45 V70 H-64 Z"
            fill="#2456d8"
            opacity="0.35"
          />
        </g>
      </g>
    </svg>
  );
};
