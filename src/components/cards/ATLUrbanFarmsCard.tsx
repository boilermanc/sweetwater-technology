import React from "react";
import { motion } from "framer-motion";
import {
  Sprout,
  ExternalLink,
  ArrowRight,
  Leaf,
  Sun,
} from "lucide-react";
import type { AppProject } from "../../types";

interface ATLUrbanFarmsCardProps {
  app: AppProject;
  index: number;
  onClick: () => void;
}

const ATLUrbanFarmsCard: React.FC<ATLUrbanFarmsCardProps> = ({
  app,
  index,
  onClick,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.12,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -8 }}
      onClick={onClick}
      className="group relative h-full cursor-pointer"
    >
      {/* Hover glow — emerald bloom behind the card */}
      <div
        className="absolute -inset-3 rounded-2xl sm:rounded-[3rem] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(16,185,129,0.15) 0%, transparent 70%)",
        }}
      />

      {/* Card shell */}
      <div
        className="relative flex h-full flex-col overflow-hidden rounded-2xl sm:rounded-[2.5rem] border border-emerald-100/60 bg-white transition-shadow duration-400"
        style={{
          boxShadow:
            "0 4px 24px -4px rgba(16,185,129,0.08), 0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        {/* Decorative corner vine */}
        <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 opacity-[0.06]">
          <svg viewBox="0 0 120 120" fill="none">
            <path
              d="M100 10 C80 30, 60 20, 40 40 C20 60, 30 80, 10 100"
              stroke="#047857"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="40" cy="40" r="4" fill="#10B981" />
            <circle cx="70" cy="25" r="3" fill="#34D399" />
            <circle cx="25" cy="70" r="3" fill="#10B981" />
            <path
              d="M42 38 C36 32, 30 36, 28 30"
              stroke="#10B981"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M38 42 C32 48, 28 44, 22 48"
              stroke="#10B981"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Image area */}
        <div className="relative overflow-hidden">
          {/* Emerald gradient overlay on image — visible on hover */}
          <div
            className="absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "linear-gradient(180deg, transparent 40%, rgba(4,120,87,0.12) 100%)",
            }}
          />
          <motion.img
            src={app.image}
            alt={app.title}
            className="h-40 sm:h-52 w-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Category badge — top left */}
          <div className="absolute left-3 top-3 z-20">
            <div
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
              style={{
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(12px)",
              }}
            >
              <Sprout className="h-3 w-3 text-emerald-600" strokeWidth={2.5} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">
                {app.category}
              </span>
            </div>
          </div>

          {/* Floating sun accent — top right, visible on hover */}
          <div className="absolute right-3 top-3 z-20">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full opacity-0 transition-all duration-500 group-hover:opacity-100"
              style={{
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(12px)",
              }}
            >
              <Sun
                className="h-4 w-4 text-amber-500 transition-transform duration-700 group-hover:rotate-90"
                strokeWidth={2}
              />
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="flex flex-1 flex-col px-4 sm:px-6 pb-4 sm:pb-6 pt-4 sm:pt-5">
          {/* Title */}
          <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-gray-900">
            {app.title}
          </h3>

          {/* Description */}
          <p className="mt-2 text-sm sm:text-[15px] leading-relaxed text-gray-500">
            {app.description}
          </p>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {app.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Divider */}
          <div className="my-4 sm:my-5 h-px bg-gray-100" />

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Demo link */}
            <a
              href={app.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/60 px-4 py-2.5 text-[13px] font-bold text-emerald-700 transition-all duration-300 hover:border-emerald-300 hover:bg-emerald-100 hover:shadow-sm"
            >
              <ExternalLink className="h-3.5 w-3.5" strokeWidth={2.5} />
              Demo
            </a>

            {/* Learn More button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="group/btn flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-[13px] font-bold text-gray-900 transition-all duration-300 hover:bg-gray-900 hover:text-white"
            >
              Learn More
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Bottom accent bar — grows on hover */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] overflow-hidden">
          <div
            className="h-full w-full origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
            style={{
              background:
                "linear-gradient(90deg, #10B981 0%, #047857 50%, #10B981 100%)",
            }}
          />
        </div>
      </div>

      {/* Floating leaf accent — appears on hover, drifts upward */}
      <div className="pointer-events-none absolute -bottom-2 -right-2 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <Leaf
          className="h-6 w-6 -rotate-45 text-emerald-300/50 transition-transform duration-700 group-hover:-translate-y-2 group-hover:rotate-0"
          strokeWidth={1.5}
        />
      </div>
    </motion.div>
  );
};

export default ATLUrbanFarmsCard;
