import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const ts = require('typescript');
const source = readFileSync(new URL('../src/portal/signalscout/model.ts', import.meta.url), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const model = await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
test('manual prospect starts unscored and unverified', () => {
  const item = model.newProspect();
  assert.equal(item.score, 0); assert.equal(item.revenue_band, 'unverified'); assert.deepEqual(item.evidence, []);
  assert.ok(model.validateProspect(item));
  assert.equal(model.validateProspect({ ...item, name: 'Example business' }), null);
});
test('URLs, invalid score values and long input cannot be saved', () => {
  const base = { ...model.newProspect(), name: 'Example' };
  for (const website of ['javascript:alert(1)', 'data:text/html,test', 'https://user:secret@example.com', 'not a URL']) assert.ok(model.validateProspect({ ...base, website }));
  for (const score_adjustment of [-31, 31, NaN, 1.2]) assert.ok(model.validateProspect({ ...base, score_adjustment }));
  assert.ok(model.validateProspect({ ...base, notes: 'x'.repeat(6001) }));
  assert.ok(model.validateProspect({ ...base, tags: [''] }));
  assert.equal(model.safeWebsite(' https://example.com '), 'https://example.com/');
});
test('saved revision and system columns never enter an update payload', () => {
  const draft = model.editableProspect({ ...model.newProspect(), id: 'id', revision: 99, updated_at: 'date', actor_id: 'other' });
  for (const key of ['id','revision','updated_at','actor_id']) assert.equal(key in draft, false);
});
test('territory parser preserves city/state commas; scoring remains bounded', () => {
  assert.deepEqual(model.splitSearch('Atlanta, GA; Nashville, TN', 'Plumbers, Roofers'), { locations: ['Atlanta, GA','Nashville, TN'], categories: ['Plumbers','Roofers'] });
  assert.equal(model.opportunityScore({ score: 95, score_adjustment: 20 }), 100);
  assert.equal(model.opportunityScore({ score: 5, score_adjustment: -30 }), 0);
});
