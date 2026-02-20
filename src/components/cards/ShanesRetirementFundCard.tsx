import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  Ticket,
  Trophy,
  Sparkles,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import type { AppProject } from "../../types";

interface ShanesRetirementFundCardProps {
  app: AppProject;
  index: number;
  onClick: () => void;
}

// Lottery ball decorations — small circles that float in the background
const LotteryBall: React.FC<{
  number: number;
  x: string;
  y: string;
  size: string;
  delay: number;
  accent?: boolean;
}> = ({ number, x, y, size, delay, accent }) => (
  <motion.div
    className="absolute flex items-center justify-center rounded-full font-black text-white select-none pointer-events-none"
    style={{
      left: x,
      top: y,
      width: size,
      height: size,
      fontSize: `calc(${size} * 0.38)`,
      background: accent
        ? "linear-gradient(135deg, #E29578 0%, #FFDDD2 100%)"
        : "linear-gradient(135deg, #006D77 0%, #83C5BE 100%)",
      boxShadow: accent
        ? "0 4px 12px rgba(226, 149, 120, 0.4)"
        : "0 4px 12px rgba(0, 109, 119, 0.3)",
    }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 0.7, scale: 1 }}
    transition={{ delay: 0.4 + delay * 0.12, type: "spring", stiffness: 200 }}
  >
    {number}
  </motion.div>
);

const ShanesRetirementFundCard: React.FC<ShanesRetirementFundCardProps> = ({
  app,
  index,
  onClick,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -10, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="relative h-full cursor-pointer group w-full"
      style={{ perspective: "1000px" }}
    >
      {/* Outer glow on hover */}
      <motion.div
        className="absolute -inset-2 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255, 221, 210, 0.6) 0%, transparent 70%)",
        }}
      />

      {/* Main card */}
      <div
        className="relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-[#FFDDD2]"
        style={{
          background:
            "linear-gradient(165deg, #EDF6F9 0%, #FFFFFF 35%, #FFDDD2 100%)",
          boxShadow:
            "0 15px 40px -10px rgba(255, 221, 210, 0.5), 0 5px 15px -5px rgba(0, 109, 119, 0.08)",
        }}
      >
        {/* Ticket perforation edge — decorative dashed line */}
        <div
          className="absolute top-0 left-0 right-0 h-px opacity-30 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, #E29578 0px, #E29578 6px, transparent 6px, transparent 12px)",
          }}
        />

        {/* Floating lottery balls */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <LotteryBall number={7} x="78%" y="8%" size="28px" delay={0} accent />
          <LotteryBall number={21} x="85%" y="42%" size="22px" delay={1} />
          <LotteryBall
            number={33}
            x="6%"
            y="65%"
            size="24px"
            delay={2}
            accent
          />
          <LotteryBall number={44} x="72%" y="72%" size="20px" delay={3} />
          <LotteryBall number={9} x="12%" y="18%" size="18px" delay={4} />
        </div>

        {/* Decorative gradient blobs */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#83C5BE]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-[#FFDDD2]/30 rounded-full blur-3xl pointer-events-none" />

        {/* Image area */}
        <div className="relative overflow-hidden">
          <div
            className="absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "linear-gradient(180deg, transparent 40%, rgba(0,109,119,0.12) 100%)",
            }}
          />
          <motion.img
            src={app.image}
            alt={app.title}
            className="h-52 w-full object-cover"
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
              <Sparkles className="h-3 w-3 text-[#006D77]" strokeWidth={2.5} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#006D77]">
                {app.category}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-1 flex-col px-6 pb-6 pt-5">
          {/* Title */}
          <h3
            className="text-xl sm:text-2xl font-black tracking-tight text-[#006D77] leading-tight mb-2"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            {app.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-[#006D77]/65 font-medium leading-relaxed mb-5 sm:mb-6 line-clamp-2">
            {app.description}
          </p>

          {/* Feature highlights — quick glance at what makes it special */}
          <div className="flex flex-wrap gap-2 mb-5 sm:mb-6">
            {[
              { icon: Users, label: "Pool with friends" },
              { icon: Ticket, label: "Scan tickets" },
              { icon: Trophy, label: "Auto win-check" },
            ].map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/70 border border-[#83C5BE]/20 text-[#006D77]/80"
              >
                <feature.icon size={12} className="text-[#E29578]" />
                <span className="text-[10px] sm:text-xs font-semibold">
                  {feature.label}
                </span>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-5 sm:mb-6">
            {app.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold tracking-wide"
                style={{
                  backgroundColor: "rgba(0, 109, 119, 0.07)",
                  color: "#006D77",
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
            {/* Demo link */}
            <a
              href={app.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white transition-all duration-200 hover:brightness-110"
              style={{
                background:
                  "linear-gradient(135deg, #E29578 0%, #e8a78e 100%)",
                boxShadow: "0 4px 14px rgba(226, 149, 120, 0.35)",
              }}
            >
              <ExternalLink size={14} />
              Live Demo
            </a>

            {/* Learn More */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-[#006D77] bg-[#EDF6F9] hover:bg-[#006D77] hover:text-white border border-[#83C5BE]/20 hover:border-[#006D77] transition-all duration-200"
            >
              Learn More
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Bottom gradient accent bar */}
        <div
          className="h-1 w-full"
          style={{
            background:
              "linear-gradient(90deg, #E29578 0%, #83C5BE 50%, #E29578 100%)",
          }}
        />

        {/* Hover shimmer overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background:
              "linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.15) 45%, rgba(255, 255, 255, 0.25) 50%, rgba(255, 255, 255, 0.15) 55%, transparent 60%)",
            backgroundSize: "200% 100%",
          }}
          animate={{
            backgroundPosition: ["200% 0", "-200% 0"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "linear",
          }}
        />
      </div>
    </motion.div>
  );
};

export default ShanesRetirementFundCard;
