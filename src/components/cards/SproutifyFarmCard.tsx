import React from "react";
import { motion } from "framer-motion";
import {
  Sprout,
  ExternalLink,
  ArrowRight,
  Droplets,
  BarChart3,
} from "lucide-react";
import type { AppProject } from "../../types";

interface SproutifyFarmCardProps {
  app: AppProject;
  index: number;
  onClick: () => void;
}

const SproutifyFarmCard: React.FC<SproutifyFarmCardProps> = ({
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
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -6 }}
      className="group relative h-full cursor-pointer overflow-hidden rounded-2xl"
      style={{
        background: "linear-gradient(165deg, #0d2818 0%, #0a1f14 50%, #071a0f 100%)",
      }}
      onClick={onClick}
    >
      {/* Ambient glow on hover */}
      <motion.div
        className="pointer-events-none absolute -inset-1 z-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(600px circle at 50% 50%, rgba(22, 163, 74, 0.12), transparent 60%)",
        }}
      />

      {/* Decorative tower lines — subtle vertical elements */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-[0.04]">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute bottom-0 w-px bg-gradient-to-t from-emerald-400 to-transparent"
            style={{
              left: `${15 + i * 14}%`,
              height: `${35 + i * 8}%`,
            }}
          />
        ))}
      </div>

      {/* Decorative growth dots — like nutrient data points */}
      <div className="pointer-events-none absolute right-4 top-4 z-0 opacity-[0.06]">
        <div className="flex gap-1">
          {[3, 5, 4, 7, 6, 8, 5].map((h, i) => (
            <div
              key={i}
              className="w-1 rounded-full bg-emerald-400"
              style={{ height: `${h * 3}px`, marginTop: `${(8 - h) * 3}px` }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 flex h-full flex-col">
        {/* Image section */}
        <div className="relative overflow-hidden">
          <motion.div
            className="relative h-40 sm:h-52 w-full overflow-hidden"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <img
              src={app.image}
              alt={app.title}
              className="h-full w-full object-cover"
            />
            {/* Bottom gradient fade into card body */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, transparent 40%, #0a1f14 100%)",
              }}
            />
          </motion.div>

          {/* Category badge */}
          <div className="absolute left-4 top-4">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium tracking-wide backdrop-blur-md"
              style={{
                background: "rgba(22, 163, 74, 0.2)",
                color: "#86efac",
                border: "1px solid rgba(134, 239, 172, 0.15)",
              }}
            >
              <Sprout className="h-3 w-3" />
              {app.category}
            </span>
          </div>
        </div>

        {/* Content section */}
        <div className="flex flex-1 flex-col px-4 sm:px-5 pb-4 sm:pb-5 pt-1">
          {/* Title */}
          <h3 className="mb-2 text-lg sm:text-xl font-bold tracking-tight text-white">
            {app.title}
          </h3>

          {/* Description */}
          <p
            className="mb-4 text-sm leading-relaxed"
            style={{ color: "rgba(187, 214, 194, 0.75)" }}
          >
            {app.description}
          </p>

          {/* Mini stat indicators — evoke the data-driven dashboard feel */}
          <div className="mb-3 sm:mb-4 flex flex-wrap gap-2 sm:gap-3">
            {[
              { icon: Droplets, label: "Nutrients" },
              { icon: BarChart3, label: "Analytics" },
              { icon: Sprout, label: "Growth" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-medium uppercase tracking-widest"
                style={{
                  background: "rgba(22, 163, 74, 0.08)",
                  color: "rgba(134, 239, 172, 0.6)",
                  border: "1px solid rgba(22, 163, 74, 0.1)",
                }}
              >
                <Icon className="h-3 w-3" />
                {label}
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="mb-5 flex flex-wrap gap-1.5">
            {app.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md px-2 py-0.5 text-[11px] font-medium"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  color: "rgba(187, 214, 194, 0.55)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Divider — subtle organic line */}
          <div
            className="mb-4 h-px w-full"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(22, 163, 74, 0.2), transparent)",
            }}
          />

          {/* Action buttons */}
          <div className="flex items-center justify-between">
            <a
              href={app.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all duration-200 hover:brightness-125"
              style={{
                background: "rgba(22, 163, 74, 0.15)",
                color: "#4ade80",
                border: "1px solid rgba(74, 222, 128, 0.2)",
              }}
            >
              Live Demo
              <ExternalLink className="h-3 w-3" />
            </a>

            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors duration-200 hover:text-[#4ade80]"
              style={{ color: "rgba(187, 214, 194, 0.6)" }}
              whileHover={{ x: 3 }}
            >
              Learn More
              <ArrowRight className="h-3.5 w-3.5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Bottom accent line — like a growing progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">
        <motion.div
          className="h-full"
          style={{
            background:
              "linear-gradient(to right, transparent, #16a34a, #22c55e, #16a34a, transparent)",
          }}
          initial={{ x: "-100%" }}
          whileHover={{ x: "0%" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
};

export default SproutifyFarmCard;
