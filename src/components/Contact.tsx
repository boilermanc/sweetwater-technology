import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Mail, Phone, CheckCircle, Loader2 } from 'lucide-react';

interface FAQItem {
  category: string;
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    category: 'Working With Us',
    question: 'What kind of projects do you build?',
    answer:
      'We build full-stack web apps, mobile apps (React Native, Flutter), AI-powered features, e-commerce platforms, and SaaS products. From early-stage MVPs to production-scale systems — if it flows through code, we build it.',
  },
  {
    category: 'Process',
    question: 'How does a typical engagement start?',
    answer:
      "It starts with a conversation. Tell us what you're building and where you're stuck. We'll scope the work, propose an approach, and move fast once aligned. No bloated discovery phases — just clarity and momentum.",
  },
  {
    category: 'Technology',
    question: "What's your tech stack?",
    answer:
      'React, TypeScript, Tailwind CSS, Supabase, and Framer Motion are our core. We also work with React Native, Expo, Flutter, Stripe, ShipEngine, and Google Gemini AI depending on the project.',
  },
  {
    category: 'Pricing',
    question: 'How do you structure pricing?',
    answer:
      'We offer project-based pricing for defined scopes and monthly retainers for ongoing development. Every engagement starts with a clear proposal — no surprises, no scope creep without conversation.',
  },
  {
    category: 'Timeline',
    question: 'How quickly can you deliver?',
    answer:
      'MVPs typically ship in weeks, not months. We move fast because we use battle-tested patterns and tooling across every project. Timelines depend on scope, but speed is part of our DNA.',
  },
];

const SUPPORT_EMAIL = 'team@sproutify.app';

const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 mb-2">
          Frequently Asked Questions
        </h2>
        <p className="text-slate-500 font-medium">
          Quick answers for potential collaborators.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          const panelId = `faq-panel-${idx}`;
          const buttonId = `faq-button-${idx}`;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className={`group rounded-2xl border transition-all duration-300 ${
                isOpen
                  ? 'border-blue-200 shadow-lg shadow-blue-50 bg-white'
                  : 'border-slate-100 hover:border-blue-100 shadow-sm bg-white/80 backdrop-blur-md'
              }`}
            >
              <button
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between px-6 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 rounded-2xl"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
                    {faq.category}
                  </span>
                  <p
                    className={`font-bold transition-colors ${
                      isOpen ? 'text-blue-600' : 'text-slate-900'
                    }`}
                  >
                    {faq.question}
                  </p>
                </div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all flex-shrink-0 ml-4 ${
                    isOpen
                      ? 'bg-blue-600 text-white rotate-180'
                      : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={`overflow-hidden transition-all duration-300 ${
                  isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-blue-50 pt-4 mt-2">
                  {faq.answer}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const ContactForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'New Project',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const res = await fetch('https://n8n.sproutify.app/webhook/4a7ce38b-f497-424f-9936-f636f5b68514', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        throw new Error('Failed to send message');
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-blue-50/50 border border-blue-100 p-12 rounded-[2rem] text-center space-y-4"
      >
        <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-black text-slate-900">Message Received!</h3>
        <p className="text-slate-600 max-w-md mx-auto">
          Thanks for reaching out, <span className="font-bold text-slate-900">{formData.name}</span>.
          We'll get back to you at{' '}
          <span className="font-bold text-slate-900">{formData.email}</span> within 24 hours.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', subject: 'New Project', message: '' });
          }}
          className="text-blue-600 font-bold hover:underline mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 rounded-md px-2 py-1"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] border border-slate-100 shadow-2xl">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 mb-2">
          Send us a Message
        </h2>
        <p className="text-slate-500 font-medium">
          Tell us what you're building. We'll tell you how we can help.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label htmlFor="contact-name" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Full Name
            </label>
            <input
              id="contact-name"
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white focus:border-blue-400 transition-all placeholder:text-slate-300"
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="contact-email" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Email Address
            </label>
            <input
              id="contact-email"
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white focus:border-blue-400 transition-all placeholder:text-slate-300"
              placeholder="you@company.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="contact-subject" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Subject
          </label>
          <select
            id="contact-subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white focus:border-blue-400 transition-all appearance-none cursor-pointer"
          >
            <option>New Project</option>
            <option>Partnership Inquiry</option>
            <option>Technical Consultation</option>
            <option>Existing Project Support</option>
            <option>General Question</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="contact-message" className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            Message
          </label>
          <textarea
            id="contact-message"
            required
            rows={5}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-slate-900 font-medium focus:outline-none focus:ring-4 focus:ring-blue-50 focus:bg-white focus:border-blue-400 transition-all resize-none placeholder:text-slate-300"
            placeholder="Tell us about your project..."
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm font-medium bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <motion.button
          type="submit"
          disabled={sending}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
        >
          {sending ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
          ) : (
            <><Send className="w-5 h-5" /> Send Message</>
          )}
        </motion.button>

        <p className="text-center text-sm text-slate-400">
          Prefer direct email? Reach us at{' '}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="text-blue-600 font-bold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-sm"
          >
            {SUPPORT_EMAIL}
          </a>
        </p>
      </form>
    </div>
  );
};

export const Contact: React.FC = () => {
  return (
    <section id="contact" className="relative py-32 px-6 scroll-mt-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 2], opacity: [0.3, 0] }}
            transition={{ duration: 8, repeat: Infinity, delay: i * 2, ease: 'easeOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] border border-blue-100 rounded-full"
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-16">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-6"
        >
          <span className="text-blue-600 font-bold text-xs uppercase tracking-[0.3em] mb-4 block">
            Get in Touch
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight">
            Let's build{' '}
            <br className="hidden md:block" />
            <span className="italic text-slate-400 font-light text-4xl md:text-6xl">something together.</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            Whether you're launching an MVP, scaling an existing product, or need an AI-powered feature — our team is ready to help you flow.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="#faqs"
              className="bg-white border border-slate-200 text-slate-900 px-8 py-3.5 rounded-full font-bold shadow-sm hover:shadow-md hover:border-blue-200 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              Browse FAQs
            </a>
            <a
              href="#contact-form"
              className="bg-slate-900 text-white px-8 py-3.5 rounded-full font-bold shadow-2xl shadow-slate-300/50 hover:bg-blue-600 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              Contact Us
            </a>
          </div>
        </motion.div>

        {/* Main 2-column grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left — FAQs */}
          <div id="faqs" className="scroll-mt-32">
            <FaqSection />

            <div className="mt-12 p-8 bg-blue-50/30 border border-dashed border-blue-100 rounded-[2rem] text-slate-400 text-center">
              <p className="text-sm italic font-medium">
                "The best technology disappears into the experience it enables."
              </p>
            </div>
          </div>

          {/* Right — Contact Form + Info Cards */}
          <div id="contact-form" className="scroll-mt-32">
            <ContactForm />

            {/* Info cards */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {([
                {
                  icon: <Mail className="w-5 h-5" />,
                  title: 'Email',
                  detail: SUPPORT_EMAIL,
                  iconClass: 'bg-blue-50 text-blue-600',
                },
                {
                  icon: <MapPin className="w-5 h-5" />,
                  title: 'Location',
                  detail: 'Atlanta, GA',
                  iconClass: 'bg-indigo-50 text-indigo-600',
                },
                {
                  icon: <Phone className="w-5 h-5" />,
                  title: 'Response Time',
                  detail: 'Under 24 hours',
                  iconClass: 'bg-sky-50 text-sky-600',
                },
              ] as const).map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }}
                  className="bg-white/70 backdrop-blur-md p-5 rounded-2xl border border-slate-100 shadow-sm"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${item.iconClass}`}>
                    {item.icon}
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1 text-sm">{item.title}</h4>
                  <p className="text-xs text-slate-400 font-medium">{item.detail}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
