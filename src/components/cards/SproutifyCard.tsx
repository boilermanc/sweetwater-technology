import React from "react";
import { motion } from "framer-motion";
import { Sprout, ExternalLink, ArrowRight, Droplets, Sun } from "lucide-react";
import type { AppProject } from "../../types";

interface SproutifyCardProps {
  app: AppProject;
  index: number;
  onClick: () => void;
}

const SproutifyCard: React.FC<SproutifyCardProps> = ({ app, index, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -8,
        transition: { duration: 0.35, ease: "easeOut" },
      }}
      className="group relative h-full cursor-pointer"
      onClick={onClick}
    >
      {/* Ambient glow on hover — golden sunlight from below */}
      <motion.div
        className="absolute -bottom-3 left-4 right-4 h-12 rounded-full opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at center, #D08008 0%, transparent 70%)",
        }}
      />

      {/* Card body */}
      <div
        className="relative flex h-full flex-col overflow-hidden rounded-2xl"
        style={{
          background:
            "linear-gradient(165deg, #3F4333 0%, #2D3026 45%, #3F4333 100%)",
          boxShadow:
            "0 4px 24px rgba(63, 67, 51, 0.25), 0 1px 3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(137, 151, 134, 0.15)",
        }}
      >
        {/* Organic texture overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, #899786 1px, transparent 1px), radial-gradient(circle at 80% 70%, #899786 1px, transparent 1px), radial-gradient(circle at 50% 50%, #899786 0.5px, transparent 0.5px)",
            backgroundSize: "60px 60px, 45px 45px, 30px 30px",
          }}
        />

        {/* Top accent bar — sage green vine line */}
        <div className="relative h-1.5 w-full overflow-hidden">
          <motion.div
            className="h-full w-full"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, #899786 20%, #D08008 50%, #899786 80%, transparent 100%)",
            }}
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 1, delay: index * 0.12 + 0.3, ease: "easeOut" }}
          />
        </div>

        {/* Image section */}
        <div className="relative overflow-hidden">
          <div className="relative h-52 w-full overflow-hidden">
            <img
              src={app.image}
              alt={`${app.title} preview`}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Vignette overlay on image */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(45, 48, 38, 0.6) 0%, transparent 40%), linear-gradient(to bottom, rgba(45, 48, 38, 0.3) 0%, transparent 20%)",
              }}
            />
          </div>

          {/* Category pill — floating on image */}
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 backdrop-blur-md">
            <Sprout className="h-3.5 w-3.5 text-[#899786]" />
            <span className="text-xs font-medium tracking-wide text-[#899786]">
              {app.category}
            </span>
          </div>
        </div>

        {/* Content section */}
        <div className="relative flex flex-1 flex-col px-5 pb-5 pt-4">
          {/* Title */}
          <h3
            className="text-xl font-semibold tracking-tight text-white"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {app.title}
          </h3>

          {/* Description */}
          <p
            className="mt-2 text-sm leading-relaxed text-[#B0B8AD]"
            style={{ fontFamily: "'Readex Pro', sans-serif" }}
          >
            {app.description}
          </p>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {app.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#899786]/20 bg-[#899786]/10 px-2.5 py-0.5 text-xs font-medium text-[#899786] transition-colors duration-200 group-hover:border-[#899786]/30 group-hover:bg-[#899786]/15"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Divider — organic line */}
          <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-[#899786]/25 to-transparent" />

          {/* Actions row */}
          <div className="flex items-center justify-between">
            {/* Demo link */}
            <a
              href={app.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-[#D08008] transition-all duration-200 hover:bg-[#D08008]/10"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Live Demo</span>
            </a>

            {/* Learn More button */}
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="flex items-center gap-2 rounded-lg bg-[#899786]/15 px-4 py-2 text-sm font-medium text-[#899786] transition-colors duration-200 hover:bg-[#899786]/25"
              whileHover={{ x: 0 }}
              whileTap={{ scale: 0.97 }}
            >
              <span>Learn More</span>
              <motion.span
                className="inline-flex"
                initial={{ x: 0 }}
                whileHover={{ x: 3 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.span>
            </motion.button>
          </div>
        </div>

        {/* Corner accent — decorative elements */}
        <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 opacity-[0.06]">
          <Sun className="h-full w-full text-[#D08008]" />
        </div>
        <div className="pointer-events-none absolute -bottom-3 -left-3 h-16 w-16 opacity-[0.06]">
          <Droplets className="h-full w-full text-[#899786]" />
        </div>
      </div>
    </motion.div>
  );
};

export default SproutifyCard;
