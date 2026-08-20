import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink, Mail, Route, ShieldCheck, Truck } from 'lucide-react';
import type { AppProject } from '../../types';

interface LanewiseCardProps {
  app: AppProject;
  index: number;
  onClick: () => void;
}

export default function LanewiseCard({ app, index, onClick }: LanewiseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -7 }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`View ${app.title} details`}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick();
        }
      }}
      className="group relative h-full cursor-pointer"
    >
      <div className="absolute -inset-1 rounded-2xl bg-[#f4d35e]/30 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-70" />

      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#2c323a] bg-[#1b1f24] shadow-[0_20px_45px_-26px_rgba(20,23,27,0.75)]">
        <div className="flex items-center justify-between border-b border-[#2c323a] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#8b939d]">
            <Route size={12} className="text-[#f4d35e]" /> freight intelligence
          </span>
        </div>

        <div className="space-y-3 px-4 pt-4 sm:px-5">
          <div className="rounded-lg border border-[#313841] bg-[#23282f] p-3.5">
            <div className="mb-2 flex items-center gap-2 font-mono text-[10px] text-[#8b939d]">
              <Mail size={12} /> inbound spot quote · 7:58 AM
            </div>
            <p className="text-sm font-semibold text-[#f0f2f5]">Dallas → Memphis · dry van</p>
            <p className="mt-1 text-xs text-[#aab1ba]">38,000 lbs · pickup tomorrow</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-[#313841]" />
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#f4d35e]">LaneWise drafts</span>
            <span className="h-px flex-1 bg-[#313841]" />
          </div>

          <div className="rounded-lg border border-[#2f4438] bg-[#1f2a23] p-3.5">
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 rounded-full border border-[#2f4438] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-[#8fd6ad]">
                <ShieldCheck size={11} /> draft ready
              </span>
              <Truck size={16} className="text-[#f4d35e]" />
            </div>
            <p className="text-2xl font-bold text-white">$1,840 <span className="text-[10px] font-medium uppercase tracking-wider text-[#8fd6ad]">all-in</span></p>
          </div>
        </div>

        <div className="flex flex-1 flex-col px-4 pb-4 pt-4 sm:px-5 sm:pb-5">
          <h3 className="text-xl font-bold tracking-tight text-white">{app.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-[#aab1ba]">{app.description}</p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {app.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="rounded-md border border-[#343b44] bg-[#23282f] px-2 py-0.5 text-[11px] font-medium text-[#cdd3da]">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex-1" />

          <div className="mt-5 flex items-center justify-between border-t border-[#2c323a] pt-4">
            <a
              href={app.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="inline-flex items-center gap-2 rounded-lg bg-[#f4d35e] px-3.5 py-2 text-xs font-bold text-[#14171b] transition-colors hover:bg-[#e0b830]"
            >
              <ExternalLink size={13} /> Live Site
            </a>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onClick();
              }}
              className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold text-[#cdd3da] transition-colors hover:text-[#f4d35e]"
            >
              Learn More <ArrowRight size={13} />
            </button>
          </div>
        </div>

        <div className="h-1 w-full bg-gradient-to-r from-[#f4d35e] via-[#3a7d5c] to-[#f4d35e]" />
      </div>
    </motion.div>
  );
}
