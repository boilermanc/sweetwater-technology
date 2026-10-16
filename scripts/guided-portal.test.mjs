import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const ts = createRequire(import.meta.url)('typescript');
const source = ts.transpileModule(readFileSync(new URL('../src/portal/guided-model.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { questionsFor, answerQuestion, resumeDiscovery } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
test('each discovery route offers distinct follow-ups and reaches a next-step decision', () => {
  for (const [goal, key] of [['Responding to customers','channel'],['Keeping track of work','tracking'],['Inventory and supplies','inventory'],['An app idea','audience'],['We’re not sure yet','explore']]) {
    const path = questionsFor({client:'Fictional',goal});
    assert.ok(path.some(q => q.id === key));
    assert.equal(path.at(-1).id, 'next');
    assert.equal(new Set(path.map(q => q.id)).size,path.length);
  }
});
test('phone calls branch again; other channels ask about ownership', () => {
  assert.ok(questionsFor({goal:'Responding to customers',channel:'Phone calls'}).some(q=>q.id==='calls'));
  const other = questionsFor({goal:'Responding to customers',channel:'Email or website forms'});
  assert.ok(other.some(q=>q.id==='handoff'));
  assert.ok(!other.some(q=>q.id==='calls'));
});

test('saved discovery resumes a partial branch and opens review only when complete', () => {
  const answers = {client:'Practice',goal:'Inventory and supplies',inventory:'Running out'};
  const resumed = resumeDiscovery(answers);
  assert.equal(questionsFor(answers)[resumed.step].id, 'stock');
  assert.equal(resumed.review, false);
  const complete = {client:'Practice',goal:'We’re not sure yet',evidence:'We still need evidence'};
  for (const question of questionsFor(complete)) complete[question.id] ||= 'Discussed';
  assert.equal(resumeDiscovery(complete).review,true);
  complete.impact = '   ';
  assert.equal(questionsFor(complete)[resumeDiscovery(complete).step].id,'impact');
});
test('changing an early answer removes stale branch and review answers', () => {
  const a={client:'Fictional',goal:'Responding to customers',channel:'Phone calls',calls:'Both',impact:'Old impact',next:'Old decision'};
  const next=answerQuestion(a,'goal','Inventory and supplies');
  assert.deepEqual(next,{client:'Fictional',goal:'Inventory and supplies'});
  assert.equal(answerQuestion(a,'goal',a.goal),a);
});

test('evidence branches request a source or a person without retaining the other path', () => {
  const a = {client:'Practice',goal:'Responding to customers',channel:'Phone calls',evidence:'We have an example to review',evidence_check:'Call log',success:'Check callbacks'};
  assert.ok(questionsFor(a).some(q=>q.id==='evidence_check'));
  assert.ok(!questionsFor(a).some(q=>q.id==='evidence_followup'));
  const changed=answerQuestion(a,'evidence','We still need evidence');
  assert.equal(changed.evidence_check,undefined);
  assert.equal(changed.success,undefined);
  assert.ok(questionsFor(changed).some(q=>q.id==='evidence_followup'));
  assert.ok(!questionsFor(changed).some(q=>q.id==='evidence_check'));
});
