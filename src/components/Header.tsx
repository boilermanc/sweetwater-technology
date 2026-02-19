import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Waves, Grid3X3, Layers, Droplets } from 'lucide-react';
import type { BackgroundTexture } from '../types';

interface HeaderProps {
  onOpenAI: () => void;
  activeTexture: BackgroundTexture;
  onTextureChange: (texture: BackgroundTexture) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAI, activeTexture, onTextureChange }) => {
  const textures: { id: BackgroundTexture, icon: React.ReactNode, label: string }[] = [
    { id: 'liquid', icon: <Droplets className="w-3.5 h-3.5" />, label: 'Liquid' },
    { id: 'flow', icon: <Waves className="w-3.5 h-3.5" />, label: 'Fluid' },
    { id: 'grid', icon: <Grid3X3 className="w-3.5 h-3.5" />, label: 'Grid' },
    { id: 'grain', icon: <Layers className="w-3.5 h-3.5" />, label: 'Grain' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between backdrop-blur-xl bg-white/70 border-b border-white/20"
    >
      <div className="flex items-center gap-3">
        <motion.div
          whileHover={{ rotate: 180 }}
          transition={{ type: 'spring', damping: 10 }}
          className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-blue-200 flex items-center justify-center text-white"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
        <span className="font-extrabold text-2xl tracking-tighter text-slate-900">SWEETWATER</span>
      </div>

      <nav className="hidden lg:flex items-center gap-8">
        <div className="flex items-center bg-slate-100/50 p-1 rounded-full border border-slate-200 mr-4">
          {textures.map((t) => (
            <button
              key={t.id}
              onClick={() => onTextureChange(t.id)}
              className={`relative px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all duration-300 ${
                activeTexture === t.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {activeTexture === t.id && (
                <motion.div
                  layoutId="activeTextureBg"
                  className="absolute inset-0 bg-white rounded-full shadow-sm border border-slate-100"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{t.icon}</span>
              <span className="relative z-10 text-[10px] font-black uppercase tracking-wider">{t.label}</span>
            </button>
          ))}
        </div>

        <a href="#philosophy" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Philosophy</a>
        <a href="#portfolio" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Apps</a>
        <a href="#contact" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Connect</a>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenAI}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-bold shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          Conduit Sage
        </motion.button>
      </nav>

      <button aria-label="Open menu" className="lg:hidden text-slate-900">
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </motion.header>
  );
};
