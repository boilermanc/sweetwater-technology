import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, ArrowUpRight, Droplets, Loader2, Mail, MessageCircle, Phone, Rss, UserRound, X } from 'lucide-react';
import { SEGMENTS, SEGMENT_ORDER, isSegmentId, type SegmentId } from '../data/segments';

type ChatMessage = { role: 'user' | 'assistant'; content: string };
type ConversationStage = 'name' | 'email' | 'segment' | 'recap' | 'substack' | 'chat';
type SageEvent = 'lead_captured' | 'preferences_complete' | 'chat';

interface SageSheetProps {
  segment: SegmentId;
  setSegment: (segment: SegmentId) => void;
  openSignal?: number;
}

const CHAT_URL = 'https://n8n.sproutify.app/webhook/sage-card-chat';
const SUBSTACK_URL = 'https://sweetwatertechnology.substack.com/';
const FAILURE_REPLY = "I hit a ripple — the site below has everything, or reach Clint directly at clint@sweetwater.technology.";

const getSessionId = () => {
  const key = 'sweetwater-sage-card-session';
  const saved = sessionStorage.getItem(key);
  if (saved) return saved;
  const created = crypto.randomUUID();
  sessionStorage.setItem(key, created);
  return created;
};

export function SageSheet({ segment, setSegment, openSignal = 0 }: SageSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [contact, setContact] = useState({ name: '', email: '' });
  const [stage, setStage] = useState<ConversationStage>('name');
  const [hasSelectedSegment, setHasSelectedSegment] = useState(false);
  const [showContactActions, setShowContactActions] = useState(false);
  const [recapOptIn, setRecapOptIn] = useState<boolean | null>(null);
  const [substackOptIn, setSubstackOptIn] = useState<boolean | null>(null);
  const [showSubstackAction, setShowSubstackAction] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "You just met Clint. I’m Sage. Before I set this page up for you, what should I call you?",
    },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsOpen(true), 600);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (openSignal > 0) setIsOpen(true);
  }, [openSignal]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, sending]);

  const requestReply = async (
    nextMessages: ChatMessage[],
    nextSegment: SegmentId | null,
    options: { event?: SageEvent; recap?: boolean | null; substack?: boolean | null; sendRecap?: boolean } = {},
  ) => {
    setSending(true);
    try {
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: getSessionId(),
          batch: new URLSearchParams(window.location.search).get('b'),
          testMode: new URLSearchParams(window.location.search).get('test') === '1',
          event: options.event ?? 'chat',
          sendRecap: options.sendRecap ?? false,
          segment: nextSegment,
          contact,
          consent: {
            recapEmail: options.recap ?? recapOptIn,
            substack: options.substack ?? substackOptIn,
            publication: SUBSTACK_URL,
          },
          messages: nextMessages,
        }),
      });
      if (!response.ok) throw new Error('Chat request failed');
      const data = (await response.json()) as { reply?: string; segment?: unknown };
      if (isSegmentId(data.segment)) setSegment(data.segment);
      if (data.reply) setMessages((current) => [...current, { role: 'assistant', content: data.reply as string }]);
    } catch {
      setMessages((current) => [...current, { role: 'assistant', content: FAILURE_REPLY }]);
    } finally {
      setSending(false);
    }
  };

  const send = (content: string, selectedSegment: SegmentId | null = null) => {
    const clean = content.trim();
    if (!clean || sending) return;
    if (selectedSegment) {
      setSegment(selectedSegment);
      setHasSelectedSegment(true);
    }
    const userMessage: ChatMessage = { role: 'user', content: clean };
    const next = [...messages, userMessage];
    setMessages(next);
    setInput('');
    void requestReply(next, selectedSegment ?? segment);
  };

  const submitInput = () => {
    const clean = input.trim();
    if (!clean || sending) return;

    if (stage === 'name') {
      const next = [
        ...messages,
        { role: 'user', content: clean } as ChatMessage,
        {
          role: 'assistant',
          content: `Nice to meet you, ${clean.split(/\s+/)[0]}. What’s the best email to use if Clint should follow up?`,
        } as ChatMessage,
      ];
      setContact((current) => ({ ...current, name: clean }));
      setMessages(next);
      setInput('');
      setStage('email');
      return;
    }

    if (stage === 'email') {
      const emailInput = document.createElement('input');
      emailInput.type = 'email';
      emailInput.value = clean;
      if (!emailInput.checkValidity()) return;

      const next = [
        ...messages,
        { role: 'user', content: clean } as ChatMessage,
        {
          role: 'assistant',
          content: `Perfect, ${contact.name.split(/\s+/)[0]}. What world are you coming from? I’ll bring the most relevant work to the top.`,
        } as ChatMessage,
      ];
      setContact((current) => ({ ...current, email: clean }));
      setMessages(next);
      setInput('');
      setStage('segment');
      void requestReply(next, null, { event: 'lead_captured' });
      return;
    }

    if (stage === 'segment') {
      setHasSelectedSegment(true);
      askRecap(clean);
      return;
    }
    send(clean);
  };

  const askRecap = (content: string, selectedSegment: SegmentId | null = null) => {
    if (selectedSegment) {
      setSegment(selectedSegment);
      setHasSelectedSegment(true);
    }
    setMessages((current) => [
      ...current,
      { role: 'user', content },
      { role: 'assistant', content: 'Would you like me to email you a short recap with the links that fit what you’re looking for?' },
    ]);
    setInput('');
    setStage('recap');
  };

  const selectSegment = (id: SegmentId, label: string) => {
    askRecap(label, id);
  };

  const respondToRecap = (wantsRecap: boolean) => {
    if (sending) return;
    setRecapOptIn(wantsRecap);
    setMessages((current) => [
      ...current,
      { role: 'user', content: wantsRecap ? 'Yes, email me a recap.' : 'No email recap, thanks.' },
      { role: 'assistant', content: 'Would you like to receive Sweetwater Technology’s new posts?' },
    ]);
    setStage('substack');
  };

  const respondToSubstack = (wantsSubscription: boolean) => {
    if (sending) return;
    const next = [
      ...messages,
      { role: 'user', content: wantsSubscription ? 'Yes, send me the new posts.' : 'No thanks.' } as ChatMessage,
      {
        role: 'assistant',
        content: wantsSubscription
          ? 'Great — use the button below to confirm your free subscription directly with Substack.'
          : 'No problem. You can always subscribe later if you change your mind.',
      } as ChatMessage,
    ];
    setSubstackOptIn(wantsSubscription);
    setShowSubstackAction(wantsSubscription);
    setMessages(next);
    setStage('chat');
    void requestReply(next, segment, {
      event: 'preferences_complete',
      recap: recapOptIn,
      substack: wantsSubscription,
      sendRecap: recapOptIn === true,
    });
  };

  const contactClint = () => {
    if (sending) return;
    setMessages((current) => [
      ...current,
      { role: 'user', content: 'I just want to get ahold of Clint.' },
      { role: 'assistant', content: 'Absolutely. You can email or call Clint directly.' },
    ]);
    setInput('');
    setStage('chat');
    setShowContactActions(true);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              aria-label="Close Sage and browse the page"
              className="fixed inset-0 z-40 bg-[#050a14]/70 backdrop-blur-[2px]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.aside
              role="dialog" aria-modal="true" aria-label="Chat with Sage"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.45 }}
              onDragEnd={(_, info) => { if (info.offset.y > 110 || info.velocity.y > 700) setIsOpen(false); }}
              className="fixed inset-x-0 bottom-0 z-50 flex h-[78dvh] flex-col overflow-hidden rounded-t-[2rem] border border-[#26375f] bg-[#101a30] text-white shadow-[0_-30px_80px_rgba(2,7,18,.5)] sm:h-[68dvh] lg:inset-y-5 lg:left-auto lg:right-5 lg:h-auto lg:w-[440px] lg:rounded-[2rem]"
            >
              <div className="flex cursor-grab touch-none justify-center py-2 lg:hidden"><div className="h-1.5 w-11 rounded-full bg-[#51648f]" /></div>
              <header className="flex items-center justify-between border-b border-[#1e2c52] px-5 pb-4 pt-2 lg:pt-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-[14px] bg-[#2e5ce6] shadow-lg shadow-blue-950/30"><Droplets size={22} /></div>
                  <div><div className="flex items-center gap-2 font-bold">Sage <span className="h-2 w-2 rounded-full bg-emerald-400" /></div><p className="text-xs text-[#8fa4d9]">Sweetwater concierge</p></div>
                </div>
                <button onClick={() => setIsOpen(false)} className="grid h-11 w-11 place-items-center rounded-full text-xs font-semibold text-[#aebfe8] hover:bg-white/5 sm:h-auto sm:w-auto sm:px-2 sm:py-2" aria-label="Skip and browse"><span className="hidden sm:inline">Skip — just browse</span><X className="sm:hidden" size={20} /></button>
              </header>

              <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
                {messages.map((message, index) => (
                  <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <p className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.role === 'user' ? 'rounded-br-md bg-[#2e5ce6] text-white' : 'rounded-bl-md border border-[#24345b] bg-[#16223c] text-[#dce5ff]'}`}>{message.content}</p>
                  </div>
                ))}
                {stage === 'segment' && !hasSelectedSegment && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {SEGMENT_ORDER.map((id) => <button disabled={sending} key={id} onClick={() => selectSegment(id, SEGMENTS[id].chipLabel)} className="min-h-11 rounded-full border border-[#365080] bg-[#15213b] px-3 py-2 text-left text-xs font-semibold text-[#c9d6f7] transition hover:border-[#5d81ed] hover:bg-[#1b2b4c] disabled:opacity-40">{SEGMENTS[id].chipLabel}</button>)}
                    <button disabled={sending} onClick={() => selectSegment('custom', 'Just curious')} className="min-h-11 rounded-full border border-[#365080] bg-[#15213b] px-3 py-2 text-xs font-semibold text-[#c9d6f7] transition hover:border-[#5d81ed] disabled:opacity-40">Just curious</button>
                  </div>
                )}
                {stage === 'recap' && (
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" disabled={sending} onClick={() => respondToRecap(true)} className="min-h-11 rounded-xl bg-[#2e5ce6] px-3 py-2 text-sm font-bold text-white transition hover:bg-[#3c69e9] disabled:opacity-40">Yes, email it</button>
                    <button type="button" disabled={sending} onClick={() => respondToRecap(false)} className="min-h-11 rounded-xl border border-[#365080] bg-[#15213b] px-3 py-2 text-sm font-bold text-[#dce5ff] transition hover:border-[#5d81ed] disabled:opacity-40">No thanks</button>
                  </div>
                )}
                {stage === 'substack' && (
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" disabled={sending} onClick={() => respondToSubstack(true)} className="min-h-11 rounded-xl bg-[#2e5ce6] px-3 py-2 text-sm font-bold text-white transition hover:bg-[#3c69e9] disabled:opacity-40">Yes, send them</button>
                    <button type="button" disabled={sending} onClick={() => respondToSubstack(false)} className="min-h-11 rounded-xl border border-[#365080] bg-[#15213b] px-3 py-2 text-sm font-bold text-[#dce5ff] transition hover:border-[#5d81ed] disabled:opacity-40">No thanks</button>
                  </div>
                )}
                {(stage === 'name' || stage === 'email' || stage === 'segment') && (
                  <button
                    type="button"
                    disabled={sending}
                    onClick={contactClint}
                    className="flex w-full items-center gap-3 rounded-2xl border border-[#365080] bg-[#15213b] px-4 py-3 text-left text-sm font-semibold text-[#dce5ff] transition hover:border-[#5d81ed] hover:bg-[#1b2b4c] disabled:opacity-40"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#243a68] text-[#9bb5ff]"><UserRound size={18} /></span>
                    <span>I just want to get ahold of Clint</span>
                  </button>
                )}
                {showContactActions && (
                  <div className="grid gap-2 sm:grid-cols-2">
                    <a href="mailto:clint@sweetwater.technology" className="flex items-center gap-3 rounded-2xl border border-[#365080] bg-[#15213b] px-4 py-3 text-sm font-bold text-white transition hover:border-[#5d81ed] hover:bg-[#1b2b4c]"><Mail size={18} className="text-[#9bb5ff]" /> Email Clint</a>
                    <a href="tel:+16785211798" className="flex items-center gap-3 rounded-2xl border border-[#365080] bg-[#15213b] px-4 py-3 text-sm font-bold text-white transition hover:border-[#5d81ed] hover:bg-[#1b2b4c]"><Phone size={18} className="text-[#9bb5ff]" /> Call Clint</a>
                  </div>
                )}
                {showSubstackAction && (
                  <a href={SUBSTACK_URL} target="_blank" rel="noreferrer" className="flex min-h-12 w-full items-center justify-between gap-3 rounded-2xl border border-[#365080] bg-[#15213b] px-4 py-3 text-sm font-bold text-white transition hover:border-[#5d81ed] hover:bg-[#1b2b4c]">
                    <span className="inline-flex items-center gap-3"><Rss size={18} className="text-[#9bb5ff]" /> Subscribe on Substack</span>
                    <ArrowUpRight size={17} className="text-[#9bb5ff]" />
                  </a>
                )}
                {sending && <div className="flex items-center gap-2 text-xs text-[#8fa4d9]"><Loader2 size={14} className="animate-spin" /> Sage is thinking</div>}
              </div>
              {stage === 'recap' || stage === 'substack' ? (
                <div className="border-t border-[#1e2c52] px-5 py-4 text-center text-xs text-[#7184ad]" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>Choose an option above to continue.</div>
              ) : <form onSubmit={(event) => { event.preventDefault(); submitInput(); }} className="border-t border-[#1e2c52] p-4" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
                <div className="flex items-center gap-2 rounded-2xl border border-[#2a3c68] bg-[#0c1322] p-2 focus-within:border-[#5d81ed]">
                  <input
                    autoFocus
                    type={stage === 'email' ? 'email' : 'text'}
                    autoComplete={stage === 'name' ? 'name' : stage === 'email' ? 'email' : 'off'}
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder={stage === 'name' ? 'Your name' : stage === 'email' ? 'Your email' : stage === 'segment' ? 'Or describe what you do' : 'Ask Sage anything'}
                    aria-label={stage === 'name' ? 'Tell Sage your name' : stage === 'email' ? 'Tell Sage your email' : 'Message Sage'}
                    className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-[#6578a3]"
                  />
                  <button disabled={!input.trim() || sending} className="grid h-11 w-11 place-items-center rounded-xl bg-[#2e5ce6] disabled:opacity-40" aria-label="Send message"><ArrowUp size={18} /></button>
                </div>
                {(stage === 'name' || stage === 'email') && <p className="px-2 pt-2 text-[11px] leading-relaxed text-[#7184ad]">Used only for this conversation and relevant follow-up.</p>}
              </form>}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} onClick={() => setIsOpen(true)} aria-label="Open Sage chat" className="fixed bottom-5 right-5 z-30 grid h-14 w-14 place-items-center rounded-full border border-white/15 bg-[#2e5ce6] text-white shadow-[0_12px_35px_rgba(21,55,150,.45)]"><MessageCircle size={24} /></motion.button>
      )}
    </>
  );
}
