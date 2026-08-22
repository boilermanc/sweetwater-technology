import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

const HERO_PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  x: ((i * 41) % 100) - 50,
  duration: 10 + ((i * 29) % 120) / 10,
  delay: ((i * 23) % 50) / 10,
  left: (i * 37) % 100,
  top: (i * 61) % 100,
}));

export const Hero: React.FC = () => {
  return (
    <section id="top" className="relative min-h-[70vh] md:min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden pt-20 scroll-mt-24">
      <div className="absolute inset-0 -z-10 bg-transparent">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] bg-blue-100/40 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -60, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 2 }}
          className="absolute bottom-[10%] right-[10%] w-[35vw] h-[35vw] bg-indigo-100/30 rounded-full blur-[120px]"
        />

        <div className="absolute inset-0 opacity-[0.2] mix-blend-overlay pointer-events-none">
          <svg width="100%" height="100%">
            <filter id="heroCaustics">
              <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" seed="2">
                <animate attributeName="baseFrequency" dur="25s" values="0.01;0.015;0.01" repeatCount="indefinite" />
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" scale="35" />
            </filter>
            <rect width="100%" height="100%" fill="url(#heroWaterGradient)" filter="url(#heroCaustics)" />
            <defs>
              <radialGradient id="heroWaterGradient">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        {HERO_PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -200, 0],
              x: [0, p.x, 0],
              opacity: [0, 0.6, 0],
              scale: [1, 2, 1],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
            }}
            className="absolute w-2 h-2 bg-blue-300 rounded-full blur-[2px]"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
            }}
          />
        ))}
      </div>

      <div className="max-w-5xl w-full text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-block mb-6 px-4 py-1.5 rounded-full border border-blue-200 bg-white/40 backdrop-blur-md text-blue-700 text-xs font-bold uppercase tracking-widest shadow-sm"
        >
          Custom software from Atlanta, Georgia
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-slate-900 leading-[0.9] tracking-tighter mb-6 md:mb-8 drop-shadow-sm"
        >
          Custom web apps and <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400">
            AI workflow automation.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-base md:text-2xl text-slate-600 max-w-2xl mx-auto mb-8 md:mb-12 font-medium bg-white/10 backdrop-blur-[2px] rounded-2xl py-2 px-4 inline-block"
        >
          Software that flows like water. Sweetwater Technology builds web, mobile, and AI-powered products around the way each business operates.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-center gap-4"
        >
          <motion.a
            href="#portfolio"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 md:px-8 md:py-4 rounded-full bg-slate-900 text-white font-bold text-base md:text-lg shadow-2xl shadow-slate-300/50 hover:bg-blue-600 transition-all flex items-center gap-2"
          >
            Explore the Suite
          </motion.a>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10"
      >
        <ArrowDown className="text-slate-400 w-8 h-8" />
      </motion.div>
    </section>
  );
};
