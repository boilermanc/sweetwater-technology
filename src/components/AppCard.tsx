import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Layers, ChevronRight } from 'lucide-react';
import type { AppProject } from '../types';

interface AppCardProps {
  app: AppProject;
  index: number;
  onClick: () => void;
}

export const AppCard: React.FC<AppCardProps> = ({ app, index, onClick }) => {
  const handleDemoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      whileHover="hover"
      onClick={onClick}
      className="group relative cursor-pointer"
    >
      <motion.div
        variants={{
          hover: {
            scale: 1.15,
            opacity: 0.3,
            filter: 'blur(40px)',
            transition: { duration: 0.6, ease: "easeOut" }
          }
        }}
        className={`absolute inset-0 bg-gradient-to-tr ${app.color} rounded-2xl sm:rounded-[2.5rem] blur-xl opacity-0 transition-opacity duration-500`}
      />

      <motion.div
        variants={{
          hover: { y: -12 }
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative bg-white border border-slate-100 rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-sm group-hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
      >
        <div className="aspect-[16/10] sm:aspect-[4/3] overflow-hidden relative">
          <motion.img
            src={app.image}
            alt={app.title}
            variants={{
              hover: {
                scale: 1.15,
                y: 10,
                transition: { duration: 0.6, ease: "easeOut" }
              }
            }}
            className="w-full h-full object-cover origin-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        <div className="p-5 sm:p-8 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <span className="text-blue-600 font-bold text-xs uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
              {app.category}
            </span>
            <Layers className="text-slate-300 w-5 h-5 group-hover:text-blue-500 transition-colors" />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
            {app.title}
          </h3>

          <p className="text-sm sm:text-base text-slate-500 line-clamp-2 leading-relaxed mb-4 sm:mb-6 font-medium">
            {app.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-5 sm:mb-8">
            {app.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[10px] font-bold text-slate-400 border border-slate-200 rounded-lg px-2 py-1">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-auto flex flex-col gap-3">
            <motion.a
              href={app.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleDemoClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
            >
              View Live Demo
              <ExternalLink className="w-4 h-4" />
            </motion.a>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClick}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-100 hover:border-slate-300 transition-all"
            >
              Learn More
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
