import { BookingPicker } from '../components/BookingPicker';
import { ContactForm } from '../components/ServiceContactForm';

export function Book() {
  const live = import.meta.env.VITE_BOOKING_ENABLED === 'true' || (import.meta.env.DEV && import.meta.env.VITE_BOOKING_MOCK === 'true');
  return <main className="relative z-10 mx-auto max-w-6xl px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-700">A simple first step</p>
        <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-6xl">Let’s talk.<br /><span className="text-blue-600">20 minutes. Free.</span></h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">Tell us where work gets stuck. We’ll talk through how you work, the tools you use, and what might make the biggest difference.</p>
        <h2 className="mt-9 text-xl font-bold text-slate-900">What we’ll cover</h2>
        <ul className="mt-4 list-disc space-y-3 pl-5 leading-7 text-slate-600">
          <li>What’s taking too much time or slipping through the cracks.</li>
          <li>Where better follow-ups or connected systems could help.</li>
          <li>Whether there’s a practical next step worth exploring.</li>
        </ul>
        <p className="mt-6 leading-7 text-slate-600">No preparation needed, and no obligation to start a project. Any paid work comes with an agreed scope and price.</p>
        <a href="/resources/try-ai-this-week" className="mt-8 inline-flex min-h-11 items-center font-bold text-blue-700 underline">Coming from the guide? Read it online →</a>
      </div>
      {live ? <section aria-label="Book your introductory call"><BookingPicker /></section> : <section aria-labelledby="call-request-title">
        <h2 id="call-request-title" className="text-2xl font-black text-slate-900">Request your free call</h2>
        <p className="mb-6 mt-3 leading-7 text-slate-600">Add a little about your business and a couple of times that work for you, including your time zone. Clint will follow up to agree a time. Your appointment is only booked once we confirm it with you.</p>
        <ContactForm initialMessage="I’d like a free 20-minute introductory call.

What I’d like to discuss:

Times that work for me (with time zone): " />
      </section>}
    </div>
  </main>;
}
