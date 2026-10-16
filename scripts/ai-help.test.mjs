import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const ts = require(process.env.SWEETWATER_TYPESCRIPT || '../node_modules/typescript');
const source = readFileSync(new URL('../src/lib/aiHelp.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { emptyDetails, validateDetails, requestPayload, emailRequest, submitRequest } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const details = { ...emptyDetails, business: 'Repair shop', task: 'Estimate follow-ups', result: 'Less time writing', name: 'Test Visitor', email: 'visitor@example.invalid' };
test('business context is required before contact and callback requires a usable phone', () => {
  for (const step of [0,1,2,3]) assert.ok(validateDetails(emptyDetails,step));
  for (const step of [0,1,2,3]) assert.equal(validateDetails(details,step),null);
  assert.ok(validateDetails({...details,email:'invalid'},3));
  for (const phone of ['', '123', 'call me', '1234567890123456']) assert.ok(validateDetails({...details,callback:true,phone},3));
  assert.equal(validateDetails({...details,callback:true,phone:'+1 (404) 555-0100'},3),null);
  assert.equal(validateDetails({...details,email:'',callback:true,phone:'+1 (404) 555-0100'},3),null);
  assert.ok(validateDetails({...details,email:'',callback:false},3));
  assert.ok(validateDetails({...details,email:'invalid',callback:true,phone:'+1 (404) 555-0100'},3));
});
test('source is distinct from intent and consent is optional', () => {
  const data=requestPayload({...details,phone:'hidden old phone'},'facebook-local','test-id');
  assert.equal(data.source,'facebook-local'); assert.equal(data.intent,'ai-help');
  assert.equal(data.contact.phone,null); assert.equal(data.consent.marketing,false);
  assert.equal(requestPayload({...details,callback:true,phone:'4045550100',marketing:true},'direct','id').contact.phone,'4045550100');
});
test('fallback encodes a reviewable email without sending', () => {
  const uri=emailRequest({...details,task:'A & B\nSecond line'},'facebook-local');
  const url=new URL(uri);
  assert.equal(url.protocol,'mailto:'); assert.equal(url.pathname,'clint@sweetwater.technology');
  const body=url.searchParams.get('body');
  assert.match(body,/A & B\nSecond line/); assert.match(body,/Source: facebook-local/);
  assert.match(body,/Optional marketing updates: No/); assert.match(body,/Intent: ai-help/);
});
test('mocked endpoint requires explicit matching acknowledgement; all failures reject', async () => {
  const original=globalThis.fetch;
  const payload=requestPayload(details,'facebook-local','test-id');
  try {
    for(const response of [new Response('',{status:500}),new Response('{}'),new Response('not json'),new Response(JSON.stringify({accepted:true,requestId:'wrong'})),new Response(JSON.stringify({accepted:false,requestId:'test-id'}))]) {
      globalThis.fetch=async()=>response;
      await assert.rejects(submitRequest('https://mock.invalid/contact',payload));
    }
    globalThis.fetch=async()=>{throw new TypeError('offline');};
    await assert.rejects(submitRequest('https://mock.invalid/contact',payload));
    globalThis.fetch=async(_url,options)=>{
      assert.deepEqual(JSON.parse(options.body),payload); assert.ok(options.signal);
      return new Response(JSON.stringify({accepted:true,requestId:'test-id'}));
    };
    await submitRequest('https://mock.invalid/contact',payload);
  } finally {globalThis.fetch=original;}
});
