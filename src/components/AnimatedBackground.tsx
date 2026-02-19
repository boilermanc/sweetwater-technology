import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BackgroundTexture } from '../types';

interface AnimatedBackgroundProps {
  texture: BackgroundTexture;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ texture }) => {
  const liquidDroplets = useMemo(() =>
    [...Array(20)].map(() => ({
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 5,
      left: Math.random() * 100,
    })), []);
  return (
    <div className="fixed inset-0 -z-30 overflow-hidden pointer-events-none bg-slate-50">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,#eff6ff_0%,transparent_70%)]"
      />

      <AnimatePresence mode="wait">
        {texture === 'grain' && (
          <motion.div
            key="grain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 mix-blend-multiply bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"
          />
        )}

        {texture === 'grid' && (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.08 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }}
          />
        )}

        {texture === 'flow' && (
          <motion.div
            key="flow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.25 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 15 + i * 4,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 2,
                }}
                className="absolute h-[1.5px] w-[200%] bg-gradient-to-r from-transparent via-blue-300 to-transparent"
                style={{ top: `${10 + i * 12}%`, opacity: 0.6 }}
              />
            ))}
          </motion.div>
        )}

        {texture === 'liquid' && (
          <motion.div
            key="liquid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 z-0">
              {liquidDroplets.map((d, i) => (
                <motion.div
                  key={i}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{
                    y: ['0vh', '110vh'],
                    opacity: [0, 0.4, 0.4, 0],
                    scaleY: [1, 2, 1]
                  }}
                  transition={{
                    duration: d.duration,
                    repeat: Infinity,
                    delay: d.delay,
                    ease: "linear"
                  }}
                  className="absolute w-[1.5px] h-8 bg-gradient-to-b from-transparent via-blue-400/40 to-transparent rounded-full blur-[1px]"
                  style={{
                    left: `${d.left}%`,
                  }}
                />
              ))}
            </div>

            <div className="absolute inset-0 filter blur-[100px] contrast-[1.1] opacity-60">
              <motion.div
                animate={{
                  x: [0, 150, 0],
                  y: [0, -150, 0],
                  scale: [1, 1.4, 1]
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] bg-blue-300 rounded-full mix-blend-multiply"
              />
              <motion.div
                animate={{
                  x: [0, -200, 0],
                  y: [0, 150, 0],
                  scale: [1.2, 0.8, 1.2]
                }}
                transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-1/4 right-1/4 w-[45vw] h-[45vw] bg-indigo-200 rounded-full mix-blend-multiply"
              />
            </div>

            <div className="absolute inset-0 opacity-20 mix-blend-overlay">
              <svg width="100%" height="100%" className="block">
                <filter id="liquid_caustics">
                  <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="4" seed="5">
                    <animate attributeName="baseFrequency" dur="20s" values="0.02;0.025;0.02" repeatCount="indefinite" />
                  </feTurbulence>
                  <feDisplacementMap in="SourceGraphic" scale="30" />
                </filter>
                <rect width="100%" height="100%" fill="url(#main_liquid_grad)" filter="url(#liquid_caustics)" />
                <defs>
                  <linearGradient id="main_liquid_grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
                    <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
};
