export type Answers = Record<string, string>;
export type Question = { id: string; title: string; why: string; example?: string; choices?: string[] };
export function resumeDiscovery(answers: Answers) {
  const index = questionsFor(answers).findIndex(question => !answers[question.id]?.trim());
  return { step: index < 0 ? 0 : index, review: index < 0 };
}
export function questionsFor(a: Answers): Question[] {
  const questions: Question[] = [
    { id: 'client', title: 'Who are we helping?', why: 'Start with the business name so everyone is talking about the same client.', example: 'Example: Meadowbrook Services (a fictional business)' },
    { id: 'goal', title: 'What would they most like to improve?', why: 'Choose one starting point. We can explore other problems in a separate walkthrough.', choices: ['Responding to customers', 'Keeping track of work', 'Inventory and supplies', 'An app idea', 'We’re not sure yet'] },
  ];
  if (a.goal === 'Responding to customers') {
    questions.push({ id: 'channel', title: 'Where do requests get missed?', why: 'The channel tells us which part of the response process to explore.', choices: ['Phone calls', 'Email or website forms', 'Several places', 'I’m not sure'] });
    if (a.channel === 'Phone calls') questions.push({ id: 'calls', title: 'When is it hardest to answer?', why: 'After-hours calls need a different approach from calls missed while the team is busy.', choices: ['After hours', 'During the workday', 'Both', 'I’m not sure'] });
    else if (a.channel) questions.push({ id: 'handoff', title: 'Who notices a new request and owns the reply?', why: 'A clear owner may solve the problem before any new software is needed.', example: 'Example: Everyone sees the inbox, but nobody is assigned to reply.' });
  } else if (a.goal === 'Keeping track of work') {
    questions.push({ id: 'tracking', title: 'Where does the team track work today?', why: 'We want to understand the existing process before replacing anything.', choices: ['Spreadsheets', 'An existing app', 'Messages and memory', 'I’m not sure'] });
    if (a.tracking) questions.push({ id: 'breakdown', title: 'Walk us through the last time something slipped.', why: 'A real example helps distinguish a tool problem from an unclear handoff.', example: 'What was supposed to happen? Where did it stop? Who found out?' });
  } else if (a.goal === 'Inventory and supplies') {
    questions.push({ id: 'inventory', title: 'What goes wrong most often?', why: 'Too little stock and too much stock require different evidence.', choices: ['Running out', 'Ordering too much', 'Not knowing what we have', 'I’m not sure'] });
    if (a.inventory) questions.push({ id: 'stock', title: 'How do people record what comes in and goes out?', why: 'A reliable stock count starts with how changes are recorded.', example: 'Example: Deliveries go in a spreadsheet; usage is recorded at the end of the week.' });
  } else if (a.goal === 'An app idea') {
    questions.push({ id: 'audience', title: 'Who would use the app?', why: 'The first version should help a specific group do one useful thing.', choices: ['The client’s team', 'Their customers', 'A new audience', 'I’m not sure'] });
    if (a.audience) questions.push({ id: 'job', title: 'What is the one thing those people need to do?', why: 'Describe the task first. Features can wait.', example: 'Example: Let customers request an appointment without calling.' });
  } else if (a.goal) {
    questions.push({ id: 'explore', title: 'What happened recently that made them ask for help?', why: 'We can start with a story when the problem is still unclear.', example: 'Ask: What takes more effort than it should? What gets repeated or forgotten?' });
  }
  if (a.goal) questions.push(
    { id: 'decision', title: 'What decision does the client need help making?', why: 'Keep the work focused on one useful decision. A better process may be enough; new software is only one option.', example: 'Example: Can we improve our current process, or do we need a different tool?' },
    { id: 'impact', title: 'What happens when this goes wrong?', why: 'Describe the effect on people, time, money, or service. Mark estimates as estimates.', example: 'Example: The owner estimates two hours a week chasing replies; we have not checked that yet.' },
    { id: 'evidence', title: 'What could we check together?', why: 'Separate what we have heard from what we can verify. Describe sources; don’t paste sensitive records.', choices: ['We have an example to review', 'We can ask someone who does the work', 'We still need evidence'] },
  );
  if (a.goal && a.evidence === 'We have an example to review') questions.push(
    { id: 'evidence_check', title: 'Which real example should we look at?', why: 'Name where the original information lives and what you want to check. An example can confirm the story or change our understanding. Describe it without copying private details.', example: a.channel === 'Phone calls' ? 'Example: Review last week’s call log with the owner. Check which missed calls received a callback and when.' : a.goal === 'Inventory and supplies' ? 'Example: Compare one recent stock count with the stock sheet. Check where the numbers differ.' : 'Example: Follow one recent request from arrival to completion with the person who handled it. Check where it waited.' },
  );
  else if (a.goal && a.evidence) questions.push(
    { id: 'evidence_followup', title: 'Who could help us check what really happens?', why: 'Ask someone who does the work to walk through a recent example. If nobody or no source is available yet, mark this as an open question.', example: 'Example: Ask the office manager to walk through one recent case, including anything that did not go as expected.' },
  );
  if (a.goal) questions.push(
    { id: 'success', title: 'How would we know an improvement worked?', why: 'Choose something we can observe or measure, how we will check it, and what result would count as success. Agreement between people or AI models is not proof.', example: 'Example: Review a week of requests before and after the change. Success means every request has an owner and a reply by the next business day; missed replies mean we need to adjust.' },
    { id: 'limits', title: 'What needs to stay true?', why: 'Capture budget, timing, existing tools, privacy requirements, and anything the team cannot change.', example: 'Example: Keep the current booking system. The team has one hour a week to learn.' },
    { id: 'next', title: 'What should we do next?', why: 'Choose a small step that reduces uncertainty. This is a draft decision for you and Sheree.', choices: ['Ask the client a follow-up question', 'Review an example of the work', 'Discuss a small assessment', 'Pause — this may not be a fit'] },
  );
  return questions;
}
// Changing an earlier answer invalidates later answers, including hidden branches.
export function answerQuestion(answers: Answers, id: string, value: string): Answers {
  if (answers[id] === value) return answers;
  const path = questionsFor(answers);
  const index = path.findIndex(q => q.id === id);
  const next: Answers = {};
  for (const question of path.slice(0, index)) if (answers[question.id]) next[question.id] = answers[question.id];
  next[id] = value;
  return next;
}
