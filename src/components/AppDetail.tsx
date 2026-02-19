import React from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink, Globe, Cpu, Users } from 'lucide-react';
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
        className="relative w-full max-w-5xl bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row h-full max-h-[85vh]"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md flex items-center justify-center text-slate-900 md:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="md:w-1/2 relative bg-slate-900 overflow-hidden">
          <img
            src={app.image}
            alt={app.title}
            className="w-full h-full object-cover opacity-80"
          />
          <div className={`absolute inset-0 bg-gradient-to-tr ${app.color} mix-blend-multiply opacity-60`} />
          <div className="absolute bottom-12 left-12 right-12">
             <span className="text-white/60 font-bold text-xs uppercase tracking-[0.2em] mb-4 block">Project Profile</span>
             <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-4">{app.title}</h2>
             <div className="flex gap-4">
                <span className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                  {app.category}
                </span>
             </div>
          </div>
        </div>

        <div className="md:w-1/2 p-8 md:p-16 overflow-y-auto">
          <div className="space-y-10">
            <div>
              <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-4">The Vision</h3>
              <p className="text-xl md:text-2xl text-slate-800 leading-relaxed font-semibold">
                {app.longDescription}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                <Globe className="text-blue-500 w-6 h-6 mb-4" />
                <h4 className="font-bold text-slate-900 mb-1">Architecture</h4>
                <p className="text-sm text-slate-500">Cloud-Native, High Availability, Distributed Compute.</p>
              </div>
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                <Cpu className="text-indigo-500 w-6 h-6 mb-4" />
                <h4 className="font-bold text-slate-900 mb-1">Tech Stack</h4>
                <p className="text-sm text-slate-500">React, Rust, WebAssembly, Edge Runtime.</p>
              </div>
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                <Users className="text-sky-500 w-6 h-6 mb-4" />
                <h4 className="font-bold text-slate-900 mb-1">Target Base</h4>
                <p className="text-sm text-slate-500">Enterprise Scale, Modern Teams, Solo Pros.</p>
              </div>
            </div>

            <div className="pt-6">
              <button className="w-full py-5 rounded-2xl bg-blue-600 text-white font-bold text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-3">
                Launch Application
                <ExternalLink className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
