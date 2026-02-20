import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Disc3, Music2 } from "lucide-react";
import type { AppProject } from "../../types";

interface RekkrdCardProps {
  app: AppProject;
  index: number;
  onClick: () => void;
}

const PEACH = "#dd6e42";
const PEACH_DARK = "#c45a30";
const SLATE = "#4f6d7a";
const BG_DARK = "rgb(26, 37, 40)";

export default function RekkrdCard({ app, index, onClick }: RekkrdCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/[0.06] bg-[rgb(26,37,40)] shadow-lg"
    >
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-700">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-white"
            style={{
              width: `${(i + 1) * 80}px`,
              height: `${(i + 1) * 80}px`,
            }}
          />
        ))}
      </div>

      <div className="relative h-40 sm:h-52 overflow-hidden">
        <motion.img
          src={app.image}
          alt={app.title}
          className="h-full w-full object-cover"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${BG_DARK} 0%, transparent 60%)`,
          }}
        />
        <motion.div
          className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-30 group-hover:opacity-50 transition-opacity duration-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <div className="relative h-36 w-36">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 shadow-2xl" />
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full border border-white/10"
                style={{ inset: `${(i + 1) * 10}px` }}
              />
            ))}
            <div
              className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: `linear-gradient(135deg, ${PEACH}, ${PEACH_DARK})` }}
            />
            <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-900" />
          </div>
        </motion.div>
        <div className="absolute left-4 top-4 z-10">
          <span
            className="inline-block rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md"
            style={{ background: `linear-gradient(135deg, ${PEACH_DARK}cc, ${SLATE}cc)` }}
          >
            {app.category}
          </span>
        </div>
      </div>

      <div className="relative z-10 px-4 sm:px-5 pb-4 sm:pb-5 pt-3">
        <div className="mb-2 flex items-center gap-2">
          <Disc3 size={16} className="text-[#dd6e42] opacity-70 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0" />
          <h3 className="text-base sm:text-lg font-bold tracking-tight text-[#e8e2d6]">{app.title}</h3>
        </div>
        <p className="mb-3 sm:mb-4 text-sm leading-relaxed text-[#7d9199]">{app.description}</p>
        <div className="mb-3 sm:mb-4 flex flex-wrap gap-1.5">
          {app.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-white/[0.06] bg-white/[0.04] px-2 py-0.5 text-[10px] uppercase tracking-widest text-[#c0d6df]/70"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <a
            href={app.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#dd6e42]/30 bg-[#dd6e42]/10 px-3.5 py-2 sm:py-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#dd6e42] backdrop-blur-sm transition-all duration-300 hover:border-[#dd6e42]/60 hover:bg-[#dd6e42]/20 hover:shadow-[0_0_15px_rgba(221,110,66,0.15)]"
          >
            <ExternalLink size={11} />
            Demo
          </a>
          <motion.button
            whileHover={{ x: 3 }}
            transition={{ duration: 0.2 }}
            className="inline-flex items-center gap-1.5 py-2 sm:py-0 text-[10px] font-semibold uppercase tracking-widest text-[#c0d6df]/50 transition-colors duration-300 group-hover:text-[#c0d6df]/80"
            onClick={onClick}
          >
            <Music2 size={11} />
            Learn More
          </motion.button>
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `linear-gradient(90deg, transparent, ${PEACH}, transparent)`,
          boxShadow: `0 0 20px ${PEACH}40, 0 0 40px ${PEACH}20`,
        }}
      />
    </motion.div>
  );
}
