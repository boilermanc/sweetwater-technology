import React from "react";
import { motion } from "framer-motion";
import { Sprout, ExternalLink, ArrowRight, Leaf } from "lucide-react";
import type { AppProject } from "../../types";

interface SproutifyClassroomsCardProps {
  app: AppProject;
  index: number;
  onClick: () => void;
}

const SproutifyClassroomsCard: React.FC<SproutifyClassroomsCardProps> = ({
  app,
  index,
  onClick,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -6,
        transition: { duration: 0.35, ease: "easeOut" },
      }}
      onClick={onClick}
      className="group relative h-full cursor-pointer"
    >
      {/* Ambient glow on hover */}
      <div
        className="absolute -inset-1 rounded-2xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at 50% 80%, #279B5140, transparent 70%)",
        }}
      />

      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white shadow-sm transition-shadow duration-500 group-hover:shadow-xl">
        {/* ── Header / Image Zone ── */}
        <div className="relative overflow-hidden">
          {/* Green gradient backdrop */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(145deg, #1a7a3a 0%, #279B51 35%, #47C96E 100%)",
            }}
          />

          {/* Organic leaf shapes — decorative */}
          <div className="absolute inset-0 overflow-hidden opacity-[0.12]">
            <Leaf
              className="absolute -right-4 -top-4 rotate-45 text-white"
              size={120}
              strokeWidth={0.8}
            />
            <Leaf
              className="absolute -bottom-2 -left-6 -rotate-12 text-white"
              size={96}
              strokeWidth={0.8}
            />
            <Sprout
              className="absolute right-8 bottom-4 text-white"
              size={48}
              strokeWidth={1}
            />
          </div>

          {/* Dot grid pattern — subtle structure */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          />

          {/* Product image */}
          <div className="relative z-10">
            <motion.img
              src={app.image}
              alt={`${app.title} preview`}
              className="h-40 sm:h-52 w-full object-cover"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          {/* Category pill */}
          <div className="absolute left-4 top-4 z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold tracking-wide text-white backdrop-blur-sm">
              <Sprout size={13} strokeWidth={2.5} />
              {app.category}
            </span>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex flex-1 flex-col px-4 sm:px-5 pt-3 sm:pt-4 pb-4 sm:pb-5">
          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold tracking-tight text-gray-900">
            {app.title}
          </h3>

          {/* Description */}
          <p className="mt-1.5 text-sm leading-relaxed text-gray-500">
            {app.description}
          </p>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {app.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Actions */}
          <div className="mt-5 flex items-center gap-3">
            <a
              href={app.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
            >
              <ExternalLink size={13} />
              Demo
            </a>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="group/btn inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold text-gray-600 transition-colors hover:text-emerald-700"
            >
              Learn More
              <ArrowRight
                size={13}
                className="transition-transform group-hover/btn:translate-x-0.5"
              />
            </button>
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          className="h-1 w-full opacity-80"
          style={{
            background:
              "linear-gradient(90deg, #279B51, #47C96E 50%, #279B51)",
          }}
        />
      </div>
    </motion.div>
  );
};

export default SproutifyClassroomsCard;
