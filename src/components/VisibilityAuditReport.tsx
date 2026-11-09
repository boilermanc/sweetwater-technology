import { useEffect, useRef } from 'react';
import { ArrowUpRight, BarChart3, FileText, Flag, Link2, MessageSquare, Printer } from 'lucide-react';

export type AuditAnswer = {
  question: string;
  text: string;
  mentioned: boolean;
  domainReferenced: boolean;
};

type Engine = { name: string; model: string; answers: AuditAnswer[] };
export type AuditReport = { business: string; domain: string; generatedAt?: string } &
  ({ engines: Engine[] } | { model: string; answers: AuditAnswer[] });

const sections = [
  ['overview', 'The audit', FileText],
  ['visibility', 'Visibility', BarChart3],
  ['answers', 'Model answers', MessageSquare],
  ['sources', 'Sources', Link2],
  ['plan', 'Your next move', Flag],
] as const;

const visibilityStates = {
  linked: { label: 'Domain referenced', symbol: '↗' },
  named: { label: 'Business named', symbol: '●' },
  missed: { label: 'Name and domain absent', symbol: '×' },
  unavailable: { label: 'Unavailable', symbol: '–' },
} as const;

function getLinkedSites(answers: AuditAnswer[]) {
  const sites = new Map<string, { answers: number; url: string }>();
  for (const answer of answers) {
    const seen = new Set<string>();
    for (const match of answer.text.matchAll(/https?:\/\/[^\s<>"'()[\]{}]+/gi)) {
      try {
        const url = new URL(match[0].replace(/[.,;!?]+$/, ''));
        if (url.username || url.password || !url.hostname.includes('.')) continue;
        const host = url.hostname.replace(/^www\./, '');
        if (seen.has(host)) continue;
        seen.add(host);
        const site = sites.get(host);
        if (site) site.answers++;
        else sites.set(host, { answers: 1, url: url.href });
      } catch {
        // A model can return malformed links.
      }
    }
  }
  return Array.from(sites, ([host, site]) => ({ host, ...site }))
    .sort((left, right) => right.answers - left.answers || left.host.localeCompare(right.host));
}

export function VisibilityAuditReport({ report, example }: { report: AuditReport; example: boolean }) {
  const reportBody = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!reportBody.current || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      for (const { isIntersecting, target } of entries) {
        if (!isIntersecting) continue;
        target.setAttribute('data-entered', '');
        observer.unobserve(target);
      }
    }, { rootMargin: '0px 0px -10% 0px' });
    reportBody.current.querySelectorAll('.visibility-chapter').forEach((chapter) => observer.observe(chapter));
    return () => observer.disconnect();
  }, []);

  const engines = 'engines' in report ? report.engines : [{ ...report, name: 'Gemini' }];
  const completed = engines.filter(({ answers }) => answers.length > 0);
  const answers = completed.flatMap((engine) => engine.answers);
  const questions = [...new Set(answers.map(({ question }) => question))];
  const named = answers.filter(({ mentioned }) => mentioned).length;
  const referenced = answers.filter(({ domainReferenced }) => domainReferenced).length;
  const words = answers.reduce((total, { text }) => total + (text.match(/\S+/g)?.length ?? 0), 0);
  const sites = getLinkedSites(answers);
  const exampleEngine = completed.find((engine) => engine.answers.some(({ mentioned }) => mentioned)) ?? completed[0];
  const exampleAnswer = exampleEngine?.answers.find(({ mentioned }) => mentioned) ?? exampleEngine?.answers[0];
  const missedQuestion = answers.find(({ mentioned }) => !mentioned)?.question;
  const nextQuestion = missedQuestion ?? questions[0];
  const questionAnswers = answers.filter(({ question }) => question === nextQuestion);
  const questionMentions = questionAnswers.filter(({ mentioned }) => mentioned).length;
  const ReportTitle = example ? 'h2' : 'h1';
  const date = report.generatedAt && new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long', timeZone: 'America/New_York',
  }).format(new Date(report.generatedAt));

  return <div ref={reportBody}>
    <div className="visibility-report-header">
      <p className="visibility-kicker">{example ? 'Example report / Fictional data' : 'Audit complete / AI model snapshot'}</p>
      <button type="button" className="visibility-print" onClick={() => window.print()}>
        <Printer size={17} aria-hidden="true" /> Print or save as PDF
      </button>
    </div>
    <p className="visibility-report-brand">Sweetwater Technology · AI Visibility Report</p>
    <nav className="visibility-chapters" aria-label="Report sections">
      {sections.map(([id, label, Icon], index) => <a href={'#audit-' + id} key={id}>
        <Icon size={16} aria-hidden="true" /><span className="visibility-kicker" aria-hidden="true">0{index + 1}</span>{label}
      </a>)}
    </nav>

    <section id="audit-overview" className="visibility-chapter" aria-labelledby="audit-overview-title">
      <div className="visibility-overview">
        <div className="visibility-chapter-copy">
          <p className="visibility-kicker"><span className="visibility-beacon" /> 01 / The audit</p>
          <ReportTitle id="audit-overview-title">{report.business}, here’s how AI sees you.</ReportTitle>
          <p>{report.domain}{date && <> · {date}</>}</p>
        </div>
        <div className="visibility-summary-stats">
          {([[answers.length, 'Answers returned'], [questions.length, 'Buyer questions'],
            [completed.length, 'Models with answers'], [words, 'Words in the answers']] as const).map(([value, label]) =>
            <div key={label}><strong>{value.toLocaleString('en-US')}</strong><p>{label}</p></div>)}
        </div>
      </div>
    </section>

    <section id="audit-visibility" className="visibility-chapter" aria-labelledby="audit-visibility-title">
      <div className="visibility-chapter-copy">
        <p className="visibility-kicker">02 / Visibility</p>
        <h2 id="audit-visibility-title">Where you showed up.</h2>
        {answers.length ? <p>
          <strong className="visibility-outcome" data-tone={named ? 'named' : 'missed'}>{named} of {answers.length}</strong> answers named your business.{' '}
          <strong className="visibility-outcome" data-tone={referenced ? 'linked' : 'missed'}>{referenced}</strong> included your domain.
        </p> : <p>There were no model answers to compare.</p>}
      </div>
      {questions.length > 0 && <div className="visibility-grid-panel">
        <table className="visibility-answer-grid">
          <caption>Visibility by model and buyer question</caption>
          <thead><tr><th scope="col">Model</th>{questions.map((question, index) =>
            <th scope="col" key={question}><span aria-hidden="true">Q{index + 1}</span><span className="sr-only">{question}</span></th>)}</tr></thead>
          <tbody>{engines.map(({ name, answers }) => <tr key={name}><th scope="row">{name}</th>
            {questions.map((question) => {
              const answer = answers.find((item) => item.question === question);
              const tone = !answer ? 'unavailable' : answer.domainReferenced ? 'linked' : answer.mentioned ? 'named' : 'missed';
              const { label, symbol } = visibilityStates[tone];
              return <td key={question} className="visibility-outcome" data-tone={tone}>
                <span aria-hidden="true">{symbol}</span>
                <span className="sr-only">{label}</span>
              </td>;
            })}</tr>)}</tbody>
        </table>
        <ul className="visibility-grid-key" aria-label="Visibility grid key">
          {Object.entries(visibilityStates).map(([tone, { label, symbol }]) => <li key={tone}>
            <span className="visibility-outcome" data-tone={tone} aria-hidden="true">{symbol}</span>
            {label}
          </li>)}
        </ul>
      </div>}
      <div className="visibility-metrics mt-5">
        {engines.map(({ name, model, answers }) => {
          const modelNamed = answers.filter(({ mentioned }) => mentioned).length;
          const modelReferenced = answers.filter(({ domainReferenced }) => domainReferenced).length;
          return <div key={name}>
            <h3 className="font-bold">{name}</h3>
            <p className="break-words text-sm text-slate-300">{model}</p>
            {answers.length ? <>
              <p><strong className="visibility-outcome" data-tone={modelNamed ? 'named' : 'missed'}>{modelNamed}<small>/{answers.length}</small></strong> named your business</p>
              <p><strong className="visibility-outcome" data-tone={modelReferenced ? 'linked' : 'missed'}>{modelReferenced}<small>/{answers.length}</small></strong> referenced your domain</p>
            </> : <p>Results unavailable for this run.</p>}
          </div>;
        })}
      </div>
      <div className="visibility-interpretation mt-5">
        <h3>How to read your results</h3>
        <p>The grid shows where your business name or domain appeared in answer text. A domain reference can occur with or without a business name mention. The checker samples API responses. Consumer apps may answer differently.</p>
        {engines.some(({ name }) => name === 'Manus') && <p className="mt-2">Manus answers all three questions in one agent task and can consult public sources.</p>}
      </div>
    </section>

    <section id="audit-answers" className="visibility-chapter" aria-labelledby="audit-answers-title">
      <div className="visibility-chapter-copy">
        <p className="visibility-kicker">03 / Model answers</p>
        <h2 id="audit-answers-title">Read what the models said.</h2>
      </div>
      {exampleEngine && exampleAnswer && <div className="visibility-featured-answer">
        <p className="visibility-kicker"><MessageSquare size={16} aria-hidden="true" /> {example ? 'Example answer' : 'One answer from this run'} · {exampleEngine.name}</p>
        <p className="visibility-answer-question">{exampleAnswer.question}</p>
        <blockquote>{exampleAnswer.text}</blockquote>
      </div>}
      {completed.map(({ name, answers }) => <div className="mt-6 space-y-3" key={name}>
        <h3 className="text-lg font-bold">{name} answers</h3>
        {answers.map((answer, index) => <details className="visibility-detail" key={answer.question} open={index === 0 ? true : undefined}>
          <summary><span className="visibility-kicker">0{index + 1}</span> {answer.question}</summary>
          <div className="px-4 pb-5 sm:px-6">
            <p className="visibility-answer-status mb-3 text-sm font-semibold">
              <span className="visibility-outcome" data-tone={answer.mentioned ? 'named' : 'missed'}>{answer.mentioned ? 'Business named' : 'Business name absent'}</span>
              <span className="visibility-outcome" data-tone={answer.domainReferenced ? 'linked' : 'missed'}>{answer.domainReferenced ? 'Domain referenced' : 'Domain reference absent'}</span>
            </p>
            <p className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-200">{answer.text}</p>
          </div>
        </details>)}
      </div>)}
    </section>

    <section id="audit-sources" className="visibility-chapter" aria-labelledby="audit-sources-title">
      <div className="visibility-chapter-copy">
        <p className="visibility-kicker">04 / Sources</p>
        <h2 id="audit-sources-title">Links that appeared in answers.</h2>
        <p>These links come from the answer text. They show what the models linked to, and their accuracy may vary.</p>
      </div>
      {sites.length > 0 ? <ol className="visibility-source-list">
        {sites.map(({ host, answers, url }) => <li key={host}>
          <a href={url} target="_blank" rel="noreferrer">{host}<ArrowUpRight size={15} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
          <span>{answers} {answers === 1 ? 'answer' : 'answers'}</span>
        </li>)}
      </ol> : <p className="visibility-source-empty">The answers in this run did not include any links.</p>}
    </section>

    <section id="audit-plan" className="visibility-chapter" aria-labelledby="audit-plan-title">
      <div className="visibility-next-move">
        <div className="visibility-chapter-copy">
          <p className="visibility-kicker"><Flag size={16} aria-hidden="true" /> 05 / Your next move</p>
          <h2 id="audit-plan-title">Give buyers a clearer answer.</h2>
          <p>{missedQuestion
            ? 'Check whether your site answers this question directly. Make it easy to find what you offer, who you serve, and where.'
            : nextQuestion
              ? 'Compare how the models describe your business with the language on your website. Start with the question below.'
              : 'Open a new audit when the models are available to see which buyer questions to focus on.'}</p>
        </div>
        {nextQuestion && <div className="visibility-next-question" data-tone={missedQuestion ? 'missed' : 'named'}>
          <p className="visibility-kicker visibility-outcome">{missedQuestion ? 'Visibility gap / Start here' : 'Start with this question'}</p>
          <blockquote>{nextQuestion}</blockquote>
          <p>{questionMentions} of {questionAnswers.length} answers named your business.</p>
        </div>}
        <div className="visibility-next-actions">
          <button type="button" className="visibility-print" onClick={() => window.print()}>
            <Printer size={17} aria-hidden="true" /> Save this report
          </button>
          <a href="/book" className="visibility-next-book">
            Book a free 20-minute call <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  </div>;
}
