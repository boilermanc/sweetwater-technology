import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Wind, Zap } from 'lucide-react';

export const Philosophy: React.FC = () => {
  const pillars = [
    {
      icon: <Droplets className="w-8 h-8 text-blue-500" />,
      title: "Adaptability",
      desc: "Like water, our software fills any container. We build infrastructure that morphs to your scale, not the other way around.",
      delay: 0.1
    },
    {
      icon: <Wind className="w-8 h-8 text-indigo-500" />,
      title: "Clarity",
      desc: "Transparency is our default. We distill complex data streams into crystal-clear insights that anyone can navigate.",
      delay: 0.2
    },
    {
      icon: <Zap className="w-8 h-8 text-sky-500" />,
      title: "Velocity",
      desc: "We move with the force of a mountain river. High-performance isn't a feature; it's our foundational requirement.",
      delay: 0.3
    }
  ];

  return (
    <section id="philosophy" className="relative py-16 sm:py-32 overflow-hidden scroll-mt-20">
      <div className="absolute inset-0 -z-10 pointer-events-none opacity-[0.5]">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: ['-50%', '50%'],
              y: [0, 20, -20, 0],
            }}
            transition={{
              x: { duration: 20 + i * 5, repeat: Infinity, ease: "linear", delay: i * 2 },
              y: { duration: 8 + i * 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute h-[1px] w-[200%] bg-gradient-to-r from-transparent via-blue-200 to-transparent"
            style={{ top: `${15 + i * 14}%`, transform: 'rotate(-2deg)' }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/20 to-white" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="text-blue-600 font-bold text-xs uppercase tracking-[0.3em] mb-4 block">The Liquid Philosophy</span>
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-slate-900 leading-tight mb-6 sm:mb-8">
              Soft as water, <br />
              <span className="italic text-slate-400 font-light">hard as crystal.</span>
            </h2>
            <p className="text-base sm:text-xl text-slate-600 leading-relaxed mb-6 sm:mb-8 max-w-xl font-medium">
              We believe technology shouldn't be a rigid wall you have to climb. It should be the fluid current that carries you forward.
              At Sweetwater, we don't just build apps; we engineer digital ecosystems that flow, adapt, and respond with biological grace.
            </p>
            <div className="flex gap-8 sm:gap-12">
              <div>
                <div className="text-3xl sm:text-4xl font-black text-blue-600 mb-1">99.9%</div>
                <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">Fluidity Score</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-black text-indigo-600 mb-1">2.4ms</div>
                <div className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">Stream Latency</div>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-6">
            {pillars.map((pillar) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ delay: pillar.delay, duration: 0.5 }}
                viewport={{ once: true }}
                className="group p-5 sm:p-8 rounded-2xl sm:rounded-[2.5rem] bg-white/70 backdrop-blur-md border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-50 transition-all cursor-default relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-start gap-4 sm:gap-6 relative z-10">
                  <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:border-blue-100 transition-colors flex-shrink-0">
                    {pillar.icon}
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 sm:mb-2 group-hover:text-blue-600 transition-colors">{pillar.title}</h3>
                    <p className="text-slate-500 leading-relaxed text-sm font-medium">{pillar.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
