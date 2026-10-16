import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const source = readFileSync(new URL('../src/lib/homeContact.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { validateHomeContact, homeContactPayload, homeContactEmail } = await import('data:text/javascript;base64,' + Buffer.from(compiled).toString('base64'));
const details = { name: 'Test Visitor', business: '', email: '', phone: '4045550100', message: 'Fictional quote follow-ups', website: '' };
test('contact accepts phone-only or email-only, validates supplied fields, and rejects honeypots', () => {
  assert.equal(validateHomeContact(details), null);
  assert.equal(validateHomeContact({...details, email: 'test@example.invalid', phone: ''}), null);
  for (const invalid of [{name: ' '}, {message: ' '}, {message: 'a'.repeat(1001)}, {phone: ''}, {email: 'bad'}, {phone: '123'}, {phone: 'abcdefghi'}, {website: 'bot'}, {business: 'a'.repeat(121)}]) assert.ok(validateHomeContact({...details, ...invalid}));
});
test('contact maps to the shared inquiry contract without adding marketing consent', () => {
  const payload = homeContactPayload(details, 'retry-id');
  assert.equal(payload.requestId, 'retry-id'); assert.equal(payload.event, 'intro_contact_request');
  assert.equal(payload.intent, 'ai-help'); assert.equal(payload.source, 'homepage-contact');
  assert.equal(payload.contactMethod, 'callback'); assert.equal(payload.contact.email, null);
  assert.equal(payload.contact.phone, details.phone); assert.equal(payload.context.task, details.message);
  assert.equal(payload.consent.marketing, false);
  const email = new URL(homeContactEmail(details)); assert.equal(email.protocol, 'mailto:');
  assert.ok(email.searchParams.get('body').includes(details.message));
});
test('prerendered homepage, guide and catalog preserve the agreed journeys', () => {
  const html = file => readFileSync(new URL('../dist/' + file, import.meta.url), 'utf8');
  const home = html('index.html');
  assert.match(home, /Get Your Hours Back/); assert.match(home, /hours back/);
  for (const route of ['/ai-help?src=homepage', '/app-idea?src=homepage', '/resources/try-ai-this-week', '#contact-form']) assert.ok(home.includes(route));
  assert.equal((home.match(/<article/g) || []).length, 3);
  assert.ok(!home.includes('contact-subject')); assert.ok(home.includes('Online sending is not connected yet'));
  const guide = html('resources/try-ai-this-week/index.html');
  assert.match(guide, /Five things to try this week/); assert.match(guide, /fictional/); assert.match(guide, /"@type":"Article"/);
  assert.ok(html('sitemap.xml').includes('/resources/try-ai-this-week'));
  const work = html('work/index.html');
  for (const name of ['Rekkrd', 'Once Upon a Drawing', 'Rejoice', 'Sproutify Home', 'Sproutify School', 'Alison.', 'Sproutify Farm', 'Shane', 'Sproutify Micro', 'ATL Urban Farms', 'LaneWise', 'SpectIQ']) assert.ok(work.includes(name), name + ' missing from /work');
  assert.ok(!/>7<|>21<|>33<|>44<|>9</.test(work), 'Stray lottery numbers remain');
});

test('footer destinations, legal drafts and the printable guide are available', () => {
  const html = file => readFileSync(new URL('../dist/' + file, import.meta.url), 'utf8');
  const home = html('index.html');
  for (const link of ['/terms', '/privacy', '/#contact-form', '/portal', '/headwaters/', '/downloads/try-ai-this-week.pdf']) assert.ok(home.includes('href="' + link + '"'), link);
  assert.ok(home.includes('Dip your toe into AI'));
  assert.equal(readFileSync(new URL('../dist/downloads/try-ai-this-week.pdf', import.meta.url)).subarray(0,5).toString(), '%PDF-');
  for (const route of ['terms', 'privacy']) {
    const draft = html(route + '/index.html');
    assert.ok(draft.includes('Draft for review')); assert.ok(draft.includes('noindex, follow'));
    assert.ok(!html('sitemap.xml').includes('/' + route + '</loc>'));
  }
});
