import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const ts = require('typescript');
const compiled = ts.transpileModule(readFileSync(new URL('../src/portal/model.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { newEngagement, deliveryEconomics, validateEngagement, editableEngagement } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
test('pricing includes labor, direct expenses and risk without inventing a fee', () => {
  assert.deepEqual(deliveryEconomics({ estimated_hours:8.5, hourly_cost:60, direct_cost:20, risk_allowance:60, fee:900 }), { cost:590, contribution:310, margin:310/900 });
  assert.equal(deliveryEconomics(newEngagement()).margin, null);
});
test('invalid amounts and missing scope identifiers cannot be submitted', () => {
  const item = {...newEngagement(),client:'Example',workflow:'Quote preparation'};
  assert.equal(validateEngagement(item), null);
  for (const value of [-1, NaN, Infinity]) assert.ok(validateEngagement({...item, fee:value}));
  assert.ok(validateEngagement({...item, client:' '}));
  assert.ok(validateEngagement({...item,stage:'Published'}));
});
test('updates strip protected database fields rather than replaying them', () => {
  const source = {...newEngagement(),id:'server-id',updated_at:'version-token',created_at:'server-date',user_id:'other-user'};
  const draft = editableEngagement(source);
  for (const key of ['id','updated_at','created_at','user_id']) assert.equal(key in draft, false);
  assert.equal(draft.track, 'Lite');
});
test('portal render is excluded from sitemap and has noindex metadata', () => {
  const sitemap = readFileSync(new URL('../dist/sitemap.xml',import.meta.url),'utf8');
  const html = readFileSync(new URL('../dist/portal/index.html',import.meta.url),'utf8');
  assert.doesNotMatch(sitemap, /\/portal/);
  assert.match(html, /name="robots" content="noindex, nofollow"/);
  assert.doesNotMatch(html, /clint@sweetwater|sheree@sweetwater|service_role/);
});
