import React from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink, Globe, Cpu, Users, Disc3 } from 'lucide-react';
import type { AppProject } from '../../types';

interface RekkrdDetailProps {
  app: AppProject;
  onClose: () => void;
}

export const RekkrdDetail: React.FC<RekkrdDetailProps> = ({ app, onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[rgb(26,37,40)]/90 backdrop-blur-xl"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-5xl bg-[rgb(26,37,40)] rounded-2xl sm:rounded-[2rem] shadow-2xl overflow-hidden border border-white/[0.06] flex flex-col md:flex-row h-full max-h-[85vh]"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-[#e8e2d6] transition-colors shadow-lg"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="md:w-1/2 relative bg-[rgb(20,30,33)] overflow-hidden">
          <img
            src={app.image}
            alt={app.title}
            className="w-full h-full object-cover opacity-80"
            draggable={false}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-48 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgb(20,30,33) 0%, transparent 100%)' }}
          />
          <div className="absolute bottom-5 left-5 right-5 sm:bottom-8 sm:left-8 sm:right-8 z-10">
            <span className="text-[#7d9199] font-bold text-xs uppercase tracking-[0.2em] mb-2 sm:mb-4 block">Product Preview</span>
            <h2 className="text-2xl sm:text-5xl md:text-6xl font-black text-[#e8e2d6] tracking-tighter mb-2 sm:mb-4">{app.title}</h2>
            <div className="flex gap-3">
              <span className="px-4 py-2 rounded-xl bg-[#dd6e42]/15 backdrop-blur-md text-[#dd6e42] text-xs font-bold border border-[#dd6e42]/20">
                {app.category}
              </span>
            </div>
          </div>
        </div>

        <div className="md:w-1/2 p-5 sm:p-8 md:p-12 overflow-y-auto">
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h3 className="text-xs font-black text-[#dd6e42] uppercase tracking-widest mb-4">The Vision</h3>
              <p className="text-base sm:text-lg md:text-xl text-[#c0d6df] leading-relaxed font-medium">
                {app.longDescription}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <Disc3 className="text-[#dd6e42] w-6 h-6 mb-3" />
                <h4 className="font-bold text-[#e8e2d6] mb-1 text-sm">AI Recognition</h4>
                <p className="text-xs text-[#7d9199]">Gemini Vision identifies albums from camera scans instantly.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <Cpu className="text-[#4f6d7a] w-6 h-6 mb-3" />
                <h4 className="font-bold text-[#e8e2d6] mb-1 text-sm">Tech Stack</h4>
                <p className="text-xs text-[#7d9199]">React, TypeScript, Supabase, Gemini AI, Tailwind CSS.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <Globe className="text-[#dd6e42] w-6 h-6 mb-3" />
                <h4 className="font-bold text-[#e8e2d6] mb-1 text-sm">Collection Manager</h4>
                <p className="text-xs text-[#7d9199]">Grid and list views, condition grading, tags, and notes.</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <Users className="text-[#4f6d7a] w-6 h-6 mb-3" />
                <h4 className="font-bold text-[#e8e2d6] mb-1 text-sm">Smart Playlists</h4>
                <p className="text-xs text-[#7d9199]">AI-generated mood playlists from your physical collection.</p>
              </div>
            </div>

            <div className="pt-4">
              <a
                href={app.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-2xl bg-[#dd6e42] text-[#e8e2d6] font-bold text-lg shadow-xl shadow-[#dd6e42]/10 hover:bg-[#c45a30] transition-all flex items-center justify-center gap-3"
              >
                Launch Rekkrd
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
