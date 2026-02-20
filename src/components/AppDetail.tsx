import React from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import type { AppProject } from '../types';

interface AppDetailProps {
  app: AppProject;
  onClose: () => void;
}

export const AppDetail: React.FC<AppDetailProps> = ({ app, onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-white/80 backdrop-blur-xl"
      />

      <motion.div
        layoutId={`card-${app.id}`}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-5xl bg-white rounded-2xl sm:rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row h-full max-h-[85vh]"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur-md flex items-center justify-center text-white transition-colors shadow-lg"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="md:w-1/2 relative bg-slate-900 overflow-hidden">
          <img
            src={app.image}
            alt={app.title}
            className="w-full h-full object-cover opacity-80"
          />
          {app.color.startsWith('from-') ? (
            <div className={`absolute inset-0 bg-gradient-to-tr ${app.color} mix-blend-multiply opacity-60`} />
          ) : (
            <div
              className="absolute inset-0 mix-blend-multiply opacity-60"
              style={{ background: `linear-gradient(to top right, ${app.color}, ${app.color}88)` }}
            />
          )}
          <div className="absolute bottom-6 left-6 right-6 sm:bottom-12 sm:left-12 sm:right-12">
             <span className="text-white/60 font-bold text-xs uppercase tracking-[0.2em] mb-2 sm:mb-4 block">Project Profile</span>
             <h2 className="text-2xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter mb-2 sm:mb-4">{app.title}</h2>
             <div className="flex gap-4">
                <span className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                  {app.category}
                </span>
             </div>
          </div>
        </div>

        <div className="md:w-1/2 p-5 sm:p-8 md:p-16 overflow-y-auto">
          <div className="space-y-6 sm:space-y-10">
            <div>
              <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-4">The Vision</h3>
              <p className="text-base sm:text-xl md:text-2xl text-slate-800 leading-relaxed font-semibold">
                {app.longDescription}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {app.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-semibold text-slate-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <a
                href={app.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-5 rounded-2xl bg-slate-900 text-white font-bold text-lg shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
              >
                Launch Application
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
