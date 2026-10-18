import {test} from 'node:test';
import assert from 'node:assert/strict';
import {normalizeContact,humanVerified,savedResponse} from '../n8n/contact/core.mjs';
const body={requestId:'516363f4-eec4-4e88-9342-6b66d4f78587',event:'intro_contact_request',intent:'website-contact',source:'homepage-contact',contact:{name:'Test Person',email:'test@example.invalid',phone:''},context:{business:'',summary:'Fictional quote follow-up'},consent:{marketing:false},website:''};
test('contact supports optional business and either contact method without marketing enrollment',()=>{
 const p=normalizeContact(body); assert.equal(p.context.business,'');assert.equal(p.contactMethod,'email'); assert.equal(p.intent,'website-contact');assert.equal(p.consent.marketing,false);
 const phone=normalizeContact({...body,contact:{name:'Test',email:'',phone:'2025550101'}});assert.equal(phone.contactMethod,'callback');
 assert.deepEqual(normalizeContact({...body,turnstileToken:'new-token'}),p,'security tokens must not change durable retry payload');
});
test('contact rejects malformed, oversized, bot and altered-purpose requests',()=>{
 for(const change of [{website:'spam'},{requestId:'bad'},{intent:'ai-help'},{consent:{marketing:true}},{context:{summary:''}},{context:{summary:'a'.repeat(1001)}},{contact:{name:'Test',email:'bad'}},{contact:{name:'Test'}},{contact:{name:'a'.repeat(101),email:'test@example.invalid'}}])assert.throws(()=>normalizeContact({...body,...change}));
});
test('contact checks Turnstile action and host and fails closed on uncertain storage',()=>{
 const ok={statusCode:200,body:{success:true,hostname:'sweetwater.technology',action:'sweetwater-contact'}};assert.equal(humanVerified(ok),true);
 for(const b of [{success:false},{hostname:'localhost'},{action:'sweetwater-booking'}])assert.equal(humanVerified({...ok,body:{...ok.body,...b}}),false);
 const p=normalizeContact(body);assert.equal(savedResponse({statusCode:200,body:{accepted:true,requestId:p.requestId}},p).body.accepted,true);
 for(const r of [{},{statusCode:500},{statusCode:200,body:{accepted:true,requestId:'other'}}])assert.equal(savedResponse(r,p).body.accepted,false);
});
