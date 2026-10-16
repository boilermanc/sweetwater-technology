import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require=createRequire(import.meta.url);
const ts=require('../node_modules/typescript');
const compiled=ts.transpileModule(readFileSync(new URL('../src/lib/discovery.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {completeContext,discoveryReply,discoveryEmail}=await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
test('each intent requires its own context; an app first version is required',()=>{
 assert.equal(completeContext('ai-help',{business:'shop',task:'quotes',result:'less typing'}),true);
 assert.equal(completeContext('app-idea',{business:'shop',task:'quotes',result:'less typing'}),false);
 assert.equal(completeContext('app-idea',{idea:'tool',audience:'makers',problem:'sharing'}),false);
 assert.equal(completeContext('app-idea',{idea:'tool',audience:'makers',problem:'sharing',firstVersion:'one shared list'}),true);
});
test('conversation sends transcript and distinct intent/source, accepts only valid reply and allowed context',async()=>{
 const original=globalThis.fetch;
 try {
  globalThis.fetch=async(_url,options)=>{ const body=JSON.parse(options.body);assert.equal(body.intent,'app-idea');assert.equal(body.source,'facebook-local');assert.equal(body.event,'discovery_chat');assert.equal('contact' in body,false);assert.equal(body.messages.at(-1).content,'My idea');return new Response(JSON.stringify({reply:'Who would use it?',context:{idea:'My idea',business:'wrong intent',email:'should not be stored'}}));};
  const result=await discoveryReply('https://mock.invalid','app-idea','facebook-local',[{role:'user',content:'My idea'}],{});
  assert.equal(result.reply,'Who would use it?');assert.deepEqual(result.context,{idea:'My idea'});
  for(const response of [new Response('',{status:503}),new Response('{}'),new Response('bad json'),new Response(JSON.stringify({reply:''}))]) {globalThis.fetch=async()=>response;await assert.rejects(discoveryReply('https://mock.invalid','ai-help','direct',[],{}));}
  globalThis.fetch=async()=>{throw new DOMException('timed out','TimeoutError');};await assert.rejects(discoveryReply('https://mock.invalid','ai-help','direct',[],{}));
 } finally {globalThis.fetch=original;}
});
test('app email preserves reviewed context and transcript without sending',()=>{
 const url=new URL(discoveryEmail('app-idea','homepage',{idea:'Tool',audience:'Makers',problem:'Sharing',firstVersion:'List'},{name:'Test',email:'test@example.invalid',phone:'4045550100',callback:true,marketing:false},[{role:'user',content:'AI is optional'}]));
 const body=url.searchParams.get('body');assert.match(body,/Intent: app-idea/);assert.match(body,/Useful first version: List/);assert.match(body,/Optional marketing updates: No/);assert.match(body,/Visitor: AI is optional/);assert.equal(url.protocol,'mailto:');
});
