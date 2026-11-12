import { useState } from 'react';
import { ArrowLeft, ArrowRight, Asterisk, Bot, Compass, MessageSquare, Sparkles } from 'lucide-react';
import type { Engine } from './VisibilityAuditReport';

const engineIcons = {
  Gemini: Sparkles,
  ChatGPT: MessageSquare,
  Claude: Asterisk,
  Perplexity: Compass,
  Manus: Bot,
};

export function VisibilityEngineScreens({ engines, business }: { engines: Engine[]; business: string }) {
  const [selected, setSelected] = useState('');
  const index = Math.max(0, engines.findIndex(({ name }) => name === selected));
  const engine = engines[index];
  if (!engine) return <p>There are no engine results for this report.</p>;

  const { name, model, answers, pending } = engine;
  const named = answers.filter(({ mentioned }) => mentioned).length;
  const referenced = answers.filter(({ domainReferenced }) => domainReferenced).length;
  const Icon = engineIcons[name as keyof typeof engineIcons] ?? Bot;

  return <div className="visibility-engine-tour">
    <nav className="visibility-engine-nav" aria-label="AI engines">
      {engines.map(({ name: engineName, answers, pending }) => <button type="button" key={engineName}
        data-engine={engineName} aria-pressed={name === engineName}
        aria-controls="visibility-engine-screen" onClick={() => setSelected(engineName)}>
        <span className="visibility-engine-dot" aria-hidden="true" />
        {engineName}
        {pending ? <span className="visibility-engine-state">Searching</span>
          : answers.length === 0 && <span className="sr-only"> (results unavailable)</span>}
      </button>)}
    </nav>

    <p className="sr-only" role="status">Engine {index + 1} of {engines.length}. {name} selected.</p>
    <section key={name + (pending ? '-pending' : '-ready')} id="visibility-engine-screen" className="visibility-engine-screen"
      data-engine={name} aria-labelledby="visibility-engine-title">
      <div className="visibility-engine-layout">
        <div className="visibility-engine-intro">
          <div className="visibility-engine-art" aria-hidden="true">
            <div className="visibility-engine-pixels">
              {Array.from({ length: 40 }, (_, pixel) => <i key={pixel}
                style={{ opacity: .12 + (pixel * 7 % 9) / 12, animationDelay: (pixel % 8) * 40 + 'ms' }} />)}
            </div>
            <div className="visibility-engine-emblem"><Icon size={38} strokeWidth={1.5} /></div>
          </div>
          <p className="visibility-kicker">Engine {String(index + 1).padStart(2, '0')} / {String(engines.length).padStart(2, '0')}</p>
          <h3 id="visibility-engine-title">{name} answers</h3>
          <p className="visibility-engine-business">How {name} sees {business}.</p>
          <p className="visibility-engine-model">{model}</p>
          {answers.length > 0 ? <>
            <div className="visibility-engine-totals">
              <div>
                <strong className="visibility-outcome" data-tone={named ? 'named' : 'missed'}>{named}<small>/{answers.length}</small></strong>
                <span>named your business</span>
              </div>
              <div>
                <strong className="visibility-outcome" data-tone={referenced ? 'linked' : 'missed'}>{referenced}<small>/{answers.length}</small></strong>
                <span>referenced your domain</span>
              </div>
            </div>
            <div className="visibility-engine-meter" aria-hidden="true">
              <span style={{ width: (named / answers.length * 100) + '%' }} />
            </div>
            <p className="visibility-engine-reading">{named === 0
              ? 'Your business name was absent from every answer returned by this engine.'
              : `${named} of ${answers.length} answers included your business name.`}</p>
          </> : <p className="visibility-engine-reading">{pending
            ? 'Manus is still searching public sources. Keep this tab open and its result will appear here when it finishes. Your other engine results are ready to explore.'
            : 'This engine did not return answers for this run. Continue to another engine to explore its results.'}</p>}
        </div>

        <div className="visibility-engine-answers">
          <p className="visibility-kicker">The questions / The answers</p>
          {answers.length > 0 ? answers.map((answer, questionIndex) => <details
            className="visibility-detail" key={answer.question} open={questionIndex === 0 ? true : undefined}>
            <summary><span className="visibility-engine-question-number">{String(questionIndex + 1).padStart(2, '0')}</span> {answer.question}</summary>
            <div className="visibility-engine-answer-body">
              <p className="visibility-answer-status">
                <span className="visibility-outcome" data-tone={answer.mentioned ? 'named' : 'missed'}>{answer.mentioned ? 'Business named' : 'Business name absent'}</span>
                <span className="visibility-outcome" data-tone={answer.domainReferenced ? 'linked' : 'missed'}>{answer.domainReferenced ? 'Domain referenced' : 'Domain reference absent'}</span>
              </p>
              <p className="visibility-engine-answer-text">{answer.text}</p>
            </div>
          </details>) : <div className="visibility-engine-unavailable">
            <Icon size={32} aria-hidden="true" />
            <h4>{pending ? 'Search in progress' : 'Results unavailable'}</h4>
            <p>{pending ? 'The longer search runs in the background. This screen updates automatically.'
              : 'An unavailable result does not count as an answer where your business was absent.'}</p>
          </div>}
        </div>
      </div>
      {answers.length > 0 && <div className="visibility-engine-question-map" aria-label={name + ' question results'}>
        {answers.map((answer, questionIndex) => <div key={answer.question}>
          <span>Question {questionIndex + 1}</span>
          <span className="visibility-outcome" data-tone={answer.domainReferenced ? 'linked' : answer.mentioned ? 'named' : 'missed'}>
            {answer.domainReferenced ? '↗ Domain referenced' : answer.mentioned ? '● Business named' : '× Name and domain absent'}
          </span>
        </div>)}
      </div>}
    </section>
    <div className="visibility-engine-pagination">
      <button type="button" disabled={index === 0} onClick={() => setSelected(engines[index - 1].name)}>
        <ArrowLeft size={17} aria-hidden="true" /> Previous engine
      </button>
      {index < engines.length - 1
        ? <button type="button" onClick={() => setSelected(engines[index + 1].name)}>
          Next / {engines[index + 1].name} <ArrowRight size={17} aria-hidden="true" />
        </button>
        : <a href="#audit-sources">Next / Sources <ArrowRight size={17} aria-hidden="true" /></a>}
    </div>
  </div>;
}
