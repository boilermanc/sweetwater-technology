import React from "react";
import { motion } from "framer-motion";
import { Sprout, ExternalLink, ArrowRight } from "lucide-react";
import type { AppProject } from "../../types";

interface SproutifyMicroCardProps {
  app: AppProject;
  index: number;
  onClick: () => void;
}

const SproutifyMicroCard: React.FC<SproutifyMicroCardProps> = ({
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
        ease: [0.25, 0.8, 0.25, 1],
      }}
      whileHover="hover"
      onClick={onClick}
      className="group relative h-full cursor-pointer"
    >
      <motion.div
        variants={{
          hover: { y: -8, transition: { duration: 0.35, ease: [0.25, 0.8, 0.25, 1] } },
        }}
        className="relative flex h-full flex-col overflow-hidden rounded-2xl"
        style={{
          background: "linear-gradient(165deg, #2A3744 0%, #1e2b36 55%, #1a2530 100%)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.12)",
        }}
      >
        {/* Top accent bar — emerald gradient that "grows" on hover */}
        <motion.div
          className="absolute top-0 left-0 right-0 z-10"
          style={{
            height: "3px",
            background: "linear-gradient(90deg, #10B981, #14B8A6, #10B981)",
            backgroundSize: "200% 100%",
          }}
          variants={{
            hover: {
              height: "4px",
              boxShadow: "0 0 20px rgba(16, 185, 129, 0.5)",
            },
          }}
          transition={{ duration: 0.35 }}
        />

        {/* Hover glow effect */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-0 opacity-0"
          style={{
            boxShadow: "inset 0 0 80px rgba(16, 185, 129, 0.04)",
          }}
          variants={{
            hover: { opacity: 1 },
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Image area */}
        <div className="relative overflow-hidden">
          <motion.div
            className="relative h-40 sm:h-52 w-full overflow-hidden"
            variants={{
              hover: { scale: 1.02 },
            }}
            transition={{ duration: 0.5, ease: [0.25, 0.8, 0.25, 1] }}
          >
            <img
              src={app.image}
              alt={`${app.title} preview`}
              className="h-full w-full object-cover"
            />
            {/* Gradient overlay fading into the dark card body */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(42, 55, 68, 0) 40%, rgba(42, 55, 68, 0.6) 75%, #2A3744 100%)",
              }}
            />
          </motion.div>

          {/* Category badge — floating over bottom of image */}
          <div className="absolute bottom-3 left-5 z-10 flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide"
              style={{
                background: "rgba(16, 185, 129, 0.15)",
                color: "#6EE7B7",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
              }}
            >
              <Sprout size={12} />
              {app.category}
            </span>
          </div>
        </div>

        {/* Content area */}
        <div className="relative z-10 flex flex-1 flex-col px-4 sm:px-5 pb-4 sm:pb-5 pt-2">
          {/* Title */}
          <h3
            className="mb-1.5 text-base sm:text-lg font-bold leading-tight tracking-tight"
            style={{ color: "#F0F4F8" }}
          >
            {app.title}
          </h3>

          {/* Description */}
          <p
            className="mb-4 line-clamp-2 text-sm leading-relaxed"
            style={{ color: "#8A99A8" }}
          >
            {app.description}
          </p>

          {/* Tags */}
          <div className="mb-5 flex flex-wrap gap-1.5">
            {app.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                style={{
                  background: "rgba(91, 124, 153, 0.15)",
                  color: "#7A99B4",
                  border: "1px solid rgba(91, 124, 153, 0.12)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            {/* Learn More */}
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #10B981 0%, #14B8A6 100%)",
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              Learn More
              <ArrowRight size={14} />
            </motion.button>

            {/* Demo link */}
            <motion.a
              href={app.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center rounded-xl p-2.5"
              style={{
                background: "rgba(91, 124, 153, 0.12)",
                color: "#7A99B4",
                border: "1px solid rgba(91, 124, 153, 0.15)",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              title="View demo"
            >
              <ExternalLink size={16} />
            </motion.a>
          </div>
        </div>

        {/* Subtle outer glow on hover */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-2xl"
          style={{
            border: "1px solid transparent",
          }}
          variants={{
            hover: {
              borderColor: "rgba(16, 185, 129, 0.15)",
              boxShadow: "0 20px 50px -12px rgba(16, 185, 129, 0.12), 0 8px 20px rgba(0, 0, 0, 0.15)",
            },
          }}
          transition={{ duration: 0.35 }}
        />
      </motion.div>
    </motion.div>
  );
};

export default SproutifyMicroCard;
