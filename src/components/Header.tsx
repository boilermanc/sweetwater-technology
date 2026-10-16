import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, Menu, ChevronDown, ArrowUpRight, LockKeyhole } from 'lucide-react';
import { SweetwaterLogo } from './SweetwaterLogo';

const NAV_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/continuum', label: 'Continuum' },
  { href: '/services', label: 'Services' },
  { href: '/work', label: 'Work' },
  { href: '/news', label: 'News' },
  { href: '/resources', label: 'Resources' },
  { href: '/#contact', label: 'Connect' },
];

export const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const loginRef = useRef<HTMLDivElement>(null);
  const loginButton = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!loginOpen) return;
    const dismiss = (event: PointerEvent) => {
      if (!loginRef.current?.contains(event.target as Node)) setLoginOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setLoginOpen(false); loginButton.current?.focus(); }
    };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', escape);
    };
  }, [loginOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between backdrop-blur-xl bg-white/70 border-b border-white/20 gap-2"
      >
        <a
          href="/"
          aria-label="Sweetwater Technology home"
          className="flex items-center gap-2 sm:gap-3 min-w-0"
        >
          <SweetwaterLogo
            animated
            markClassName="h-9 w-9 sm:h-10 sm:w-10 drop-shadow-md"
            className="scale-90 origin-left sm:scale-100"
          />
        </a>

        <nav className="hidden xl:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
        <div ref={loginRef} className="relative" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setLoginOpen(false); }}>
          <button ref={loginButton} type="button" aria-expanded={loginOpen} aria-controls="client-login-panel" onClick={() => { setLoginOpen(!loginOpen); setMobileOpen(false); }} className="flex items-center gap-1 rounded-xl border border-blue-100 bg-blue-50 px-2 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold text-blue-700 hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-blue-600">
            Client Login <ChevronDown size={14} className={loginOpen ? 'rotate-180' : ''} />
          </button>
          {loginOpen && <motion.div id="client-login-panel" initial={{ opacity: 0, y: reducedMotion ? 0 : -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : 0.2 }} className="absolute right-0 top-full mt-4 w-64 max-w-[calc(100vw-3rem)] rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
            <LockKeyhole size={22} className="mb-3 text-blue-600" />
            <p className="font-bold text-slate-900">Client Login</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">Access your Sweetwater workspace with your approved email address.</p>
            <a href="/portal" className="mt-4 flex items-center justify-between rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700">Continue to login <ArrowUpRight size={16} /></a>
          </motion.div>}
        </div>
        <button
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          onClick={() => { setMobileOpen(!mobileOpen); setLoginOpen(false); }}
          className="xl:hidden text-slate-900 p-1"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-sm xl:hidden"
            />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-white shadow-2xl xl:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                <span className="font-extrabold text-slate-900 tracking-tight">Menu</span>
                <button
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-2 p-6">
                {NAV_LINKS.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className="text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors py-3 px-4 rounded-xl hover:bg-blue-50"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
