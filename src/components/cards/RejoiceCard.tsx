import React from "react";
import { motion } from "framer-motion";
import {
  Heart,
  BookOpen,
  Sparkles,
  Users,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import type { AppProject } from "../../types";

// -- Rejoice brand palette (from codebase theme.ts) --
const COLORS = {
  dustyGrape: "#655A7C",
  warmBeige: "#F2ECD7",
  lavender: "#E7DAE6",
  amethyst: "#AB92BF",
  powderBlue: "#AFC1D6",
  mint: "#CEF9F2",
  gold: "#D6CA98",
  textPrimary: "#2D2D3A",
};

// Emotion orb colors — a subset of the 12 emotion states
const EMOTION_ORBS = [
  { color: "#CEF9F2", size: 64, x: "12%", y: "18%", delay: 0 },     // Peaceful / Mint
  { color: "#D6CA98", size: 48, x: "78%", y: "12%", delay: 0.8 },    // Joyful / Gold
  { color: "#AB92BF", size: 40, x: "65%", y: "55%", delay: 1.6 },    // Confused / Amethyst
  { color: "#AFC1D6", size: 52, x: "22%", y: "60%", delay: 0.4 },    // Sad / Powder Blue
  { color: "#E7DAE6", size: 36, x: "85%", y: "38%", delay: 1.2 },    // Lavender
  { color: "#FF6B6B", size: 28, x: "48%", y: "72%", delay: 2.0 },    // Anxious / Soft Red
];

export default function RejoiceCard({
  app,
  index,
  onClick,
}: {
  app: AppProject;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -6, transition: { duration: 0.35, ease: "easeOut" } }}
      onClick={onClick}
      className="group relative h-full cursor-pointer"
    >
      <div
        className="relative flex h-full flex-col overflow-hidden rounded-2xl"
        style={{
          background: `linear-gradient(145deg, ${COLORS.warmBeige} 0%, ${COLORS.lavender} 55%, ${COLORS.amethyst}33 100%)`,
          boxShadow: `0 4px 24px ${COLORS.dustyGrape}18, 0 1px 4px ${COLORS.dustyGrape}10`,
        }}
      >
        {/* ── Emotion Constellation Background ── */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {EMOTION_ORBS.map((orb, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: orb.size,
                height: orb.size,
                left: orb.x,
                top: orb.y,
                background: `radial-gradient(circle, ${orb.color}55 0%, ${orb.color}00 70%)`,
              }}
              animate={{
                y: [0, -8, 0, 6, 0],
                x: [0, 4, 0, -3, 0],
                scale: [1, 1.1, 1, 0.95, 1],
              }}
              transition={{
                duration: 6 + i * 0.7,
                delay: orb.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Subtle radial glow in the center */}
          <div
            className="absolute"
            style={{
              width: "60%",
              height: "60%",
              left: "20%",
              top: "20%",
              background: `radial-gradient(circle, ${COLORS.dustyGrape}08 0%, transparent 70%)`,
            }}
          />
        </div>

        {/* ── Image Section ── */}
        <div className="relative overflow-hidden">
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={app.image}
              alt={app.title}
              className="w-full h-40 sm:h-52 object-cover"
            />

            {/* Warm gradient overlay on image */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, transparent 50%, ${COLORS.dustyGrape}30 100%)`,
              }}
            />

            {/* Floating scripture icon */}
            <motion.div
              className="absolute top-3 right-3 rounded-full p-2"
              style={{
                background: `${COLORS.warmBeige}E6`,
                backdropFilter: "blur(8px)",
              }}
              whileHover={{ rotate: 12, scale: 1.1 }}
            >
              <BookOpen size={16} style={{ color: COLORS.dustyGrape }} />
            </motion.div>
          </motion.div>
        </div>

        {/* ── Content Section ── */}
        <div className="relative flex flex-1 flex-col p-4 sm:p-5 pt-3 sm:pt-4">
          {/* Category pill */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full tracking-wide uppercase"
              style={{
                background: `${COLORS.dustyGrape}15`,
                color: COLORS.dustyGrape,
                letterSpacing: "0.05em",
              }}
            >
              {app.category}
            </span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles size={14} style={{ color: COLORS.gold }} />
            </motion.div>
          </div>

          {/* Title */}
          <h3
            className="text-lg sm:text-xl font-bold mb-1.5 tracking-tight"
            style={{ color: COLORS.textPrimary }}
          >
            {app.title}
          </h3>

          {/* Description */}
          <p
            className="text-sm leading-relaxed mb-4"
            style={{ color: `${COLORS.dustyGrape}CC` }}
          >
            {app.description}
          </p>

          {/* Feature highlights row — key Rejoice concepts */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            {[
              { icon: Heart, label: "Prayer", color: COLORS.mint },
              { icon: BookOpen, label: "Scripture", color: COLORS.gold },
              { icon: Users, label: "Community", color: COLORS.powderBlue },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: `${color}66` }}
                >
                  <Icon size={10} style={{ color: COLORS.dustyGrape }} />
                </div>
                <span
                  className="text-xs font-medium"
                  style={{ color: COLORS.dustyGrape }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {app.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-md font-medium"
                style={{
                  background: `${COLORS.lavender}99`,
                  color: COLORS.dustyGrape,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Spacer to push actions to bottom */}
          <div className="flex-1" />

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-colors"
              style={{
                background: COLORS.dustyGrape,
                color: COLORS.warmBeige,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              Learn More
              <ArrowRight size={14} />
            </motion.button>

            <motion.a
              href={app.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center w-10 h-10 rounded-xl transition-colors"
              style={{
                background: `${COLORS.dustyGrape}12`,
                color: COLORS.dustyGrape,
              }}
              whileHover={{
                scale: 1.08,
                backgroundColor: `${COLORS.dustyGrape}22`,
              }}
              whileTap={{ scale: 0.95 }}
            >
              <ExternalLink size={16} />
            </motion.a>
          </div>
        </div>

        {/* ── Bottom accent line — emotion gradient ── */}
        <div
          className="h-1 w-full"
          style={{
            background: `linear-gradient(90deg, ${COLORS.mint}, ${COLORS.gold}, ${COLORS.amethyst}, ${COLORS.powderBlue}, ${COLORS.dustyGrape})`,
          }}
        />
      </div>

      {/* Hover glow effect */}
      <motion.div
        className="absolute -inset-1 rounded-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(145deg, ${COLORS.mint}30, ${COLORS.lavender}40, ${COLORS.amethyst}25)`,
          filter: "blur(16px)",
        }}
      />
    </motion.div>
  );
}
