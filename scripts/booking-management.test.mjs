import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {managementRequest,managedEvent,operationApplied,managementPatch,managementView} from '../n8n/booking/management.mjs';
import {bookingEmail} from '../n8n/booking/email.mjs';
const id='12345678-1234-4123-8123-123456789abc',token='22345678-1234-4123-8123-123456789abc',op='32345678-1234-4123-8123-123456789abc';
const request={bookingId:id,token,operationId:op,action:'reschedule',start:'2099-10-20T14:00:00.000Z',target:'2099-10-20T14:30:00.000Z'};
const operation={id:op,booking_id:id,action:'reschedule',old_start:request.start,target_start:request.target,state:'pending'};
const event={id:'5a'+id.replaceAll('-',''),status:'confirmed',etag:'"v1"',start:{dateTime:request.start},end:{dateTime:'2099-10-20T14:20:00.000Z'},extendedProperties:{private:{sweetwaterRequestId:id,sweetwaterEmail:'person@example.invalid',sweetwaterName:'Guest',sweetwaterTopic:'private'}}};
const config={timeZone:'America/New_York'};
test('management validates bearer links and mutations, strips extra fields',()=>{assert.deepEqual(managementRequest({...request,unsafe:'value'}),request);for(const body of [{...request,token:'guess'},{...request,operationId:''},{...request,action:'finish'},{...request,target:'tomorrow'},{...request,start:undefined}])assert.throws(()=>managementRequest(body));assert.deepEqual(managementRequest({...request,action:'view'}),{bookingId:id,token,action:'view'});});
test('only matching Google operation readback confirms a change',()=>{assert.equal(operationApplied(event,request,operation),false);const changed={...event,start:{dateTime:request.target},end:{dateTime:'2099-10-20T14:50:00.000Z'},extendedProperties:{private:{...event.extendedProperties.private,sweetwaterManagementOperation:op}}};assert.equal(operationApplied(changed,request,operation),true);assert.equal(operationApplied({...changed,id:'other'},request,operation),false);assert.equal(operationApplied({...changed,status:'cancelled'},request,operation),false);assert.equal(operationApplied({...changed,status:'cancelled'},request,{...operation,action:'cancel'}),true);assert.equal(operationApplied({...changed,end:event.end},request,operation),false);});
test('patches preserve private fields and reject changed calendar state',()=>{const patch=managementPatch(event,request,operation,config);assert.equal(patch.start.dateTime,request.target);assert.equal(patch.extendedProperties.private.sweetwaterEmail,event.extendedProperties.private.sweetwaterEmail);assert.equal(patch.extendedProperties.private.sweetwaterManagementOperation,op);for(const bad of [{...event,etag:null},{...event,status:'cancelled'},{...event,start:{dateTime:request.target}},{...event,id:'other'}])assert.throws(()=>managementPatch(bad,request,operation,config));});
test('public view contains no guest data or token',()=>{const view=managementView({start:request.start,status:'active'},event,request,config);assert.deepEqual(Object.keys(view).sort(),['bookingId','ok','pending','start','status','timeZone']);assert.ok(managedEvent(event,request));assert.throws(()=>managementView({start:request.target},event,request,config));});
test('confirmation links require matching registration and use fragments',()=>{const booking={requestId:id,eventId:event.id,name:'Guest',email:'person@example.invalid',topic:'private',start:request.start,end:event.end.dateTime};const saved={...event,created:new Date().toISOString()};const email=bookingEmail(saved,booking,config,Date.now(),{ok:true,bookingId:id,eventId:event.id,token});assert.match(email.text,/\/book\/manage#id=/);assert.match(email.html,/Cancel or reschedule/);assert.ok(!email.text.includes('private topic'));assert.ok(!bookingEmail(saved,booking,config,Date.now(),{ok:true,bookingId:'wrong',eventId:event.id,token}).text.includes('/book/manage'));});
test('workflow is POST-only, private, conditional, and every code node compiles',()=>{const w=JSON.parse(readFileSync('n8n/booking/manage-booking.json','utf8'));assert.equal(w.active,false);assert.equal(w.settings.saveDataErrorExecution,'none');assert.equal(w.settings.saveDataSuccessExecution,'none');assert.equal(w.nodes.find(n=>n.type.endsWith('.webhook')).parameters.httpMethod,'POST');for(const n of w.nodes.filter(n=>n.type.endsWith('.code')))assert.doesNotThrow(()=>new Function('$input','$',n.parameters.jsCode),n.name);const patch=w.nodes.find(n=>n.name==='Update managed calendar event');assert.equal(patch.parameters.headerParameters.parameters[0].name,'If-Match');assert.match(patch.parameters.url,/sendUpdates=all/);assert.equal(w.connections['Update managed calendar event'].main[0][0].node,'Verify managed calendar change');assert.equal(w.connections['Management verified?'].main[0][0].node,'Complete management change');});
import ts from 'typescript';
const compiled=ts.transpileModule(readFileSync('src/lib/bookingManagement.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const client=await import('data:text/javascript;base64,'+Buffer.from(compiled).toString('base64'));
test('client rejects mismatched mutation acknowledgements and never transmits the token in a URL',async()=>{const original=globalThis.fetch;try{const valid={ok:true,bookingId:id,operationId:op,status:'active',start:request.target,timeZone:config.timeZone,pending:false};for(const invalid of [{...valid,operationId:token},{...valid,bookingId:token},{...valid,start:request.start},{...valid,status:'cancelled'},{...valid,pending:true},{...valid,ok:false}]){globalThis.fetch=async()=>new Response(JSON.stringify(invalid));await assert.rejects(client.manageBooking('/manage',request));}globalThis.fetch=async(url,options)=>{assert.equal(url,'/manage');assert.equal(options.referrerPolicy,'no-referrer');assert.equal(JSON.parse(options.body).token,token);return new Response(JSON.stringify(valid));};assert.deepEqual(await client.manageBooking('/manage',request),valid);assert.equal(client.parseManagementLink('#token=guess'),null);assert.deepEqual(client.parseManagementLink('#id='+id+'&token='+token),{bookingId:id,token});}finally{globalThis.fetch=original;}});
test('management page is prerendered but excluded from search indexing and sitemap',()=>{assert.match(readFileSync('dist/book/manage/index.html','utf8'),/noindex, nofollow/);assert.ok(!readFileSync('dist/sitemap.xml','utf8').includes('/book/manage'));});
import {slots as makeSlots} from '../n8n/booking/core.mjs';
const liveConfig={...JSON.parse(readFileSync('n8n/booking/config.json','utf8')),enabled:true};
async function runWorkflow(action,{timeoutAfterWrite=false,wrongReadback=false,busyTarget=false,alreadyComplete=false}={}) {
  const w=JSON.parse(readFileSync('n8n/booking/manage-booking.json','utf8')),outputs=new Map();
  const times=makeSlots(liveConfig,Date.now());const r={...request,action,start:times[0].start,target:action==='reschedule'?times[1].start:undefined};
  let current={...event,start:{dateTime:r.start},end:{dateTime:times[0].end}},writes=0,finished=false;
  const operation={id:op,booking_id:id,action,state:alreadyComplete?'complete':'pending',old_start:r.start,target_start:r.target||null};
  if(alreadyComplete)current={...current,start:{dateTime:r.target},end:{dateTime:times[1].end},extendedProperties:{private:{...current.extendedProperties.private,sweetwaterManagementOperation:op}}};
  const $=name=>({first:()=>({json:outputs.get(name)})});
  let name='Validate management request',input={headers:{origin:'https://sweetwater.technology'},body:r};
  for(let steps=0;steps<60;steps++) {
    const n=w.nodes.find(n=>n.name===name);assert.ok(n,name);let output,index=0;
    if(n.type.endsWith('.code'))output=new Function('$input','$',n.parameters.jsCode.replace('"enabled":false','"enabled":true'))({first:()=>({json:input})},$)[0].json;
    else if(n.type.endsWith('.if')){output=input;index=input.proceed===true?0:1;}
    else if(n.type.endsWith('.respondToWebhook'))return {response:input,writes,finished};
    else if(n.type.endsWith('.httpRequest')) {
      if(n.name==='Read private booking link')output={statusCode:200,body:{ok:true,eventId:event.id,bookingId:id,start:alreadyComplete?r.target:r.start,status:'active',pendingOperation:null}};
      else if(n.name==='Reserve management change')output={statusCode:200,body:{ok:true,operation,status:'active',start:r.start}};
      else if(n.name==='Complete management change'){finished=true;output={statusCode:200,body:{ok:true,operationId:op,status:action==='cancel'?'cancelled':'active',start:r.target||r.start}};}
      else if(n.parameters.url.includes('freeBusy'))output={statusCode:200,body:{calendars:Object.fromEntries(liveConfig.busyCalendarIds.map(c=>[c,{busy:busyTarget?[{start:r.target,end:times[1].end}]:[]}]))}};
      else if(n.parameters.method==='PATCH'){writes++;const patch=JSON.parse(new Function('$','$json','return '+n.parameters.jsonBody.slice(3,-2))($,input));current={...current,...patch};if(wrongReadback)current.extendedProperties.private.sweetwaterManagementOperation=token;output=timeoutAfterWrite?{error:'timeout'}:{statusCode:200,body:current};}
      else output={statusCode:200,body:current};
    } else throw Error(n.type);
    outputs.set(name,output);input=output;name=w.connections[name].main[index][0].node;
  }
  throw Error('workflow did not finish');
}
test('whole workflow verifies cancel/reschedule and reconciles a write timeout',async()=>{for(const action of ['cancel','reschedule']){const r=await runWorkflow(action,{timeoutAfterWrite:true});assert.equal(r.response.statusCode,200);assert.equal(r.response.body.status,action==='cancel'?'cancelled':'active');assert.equal(r.writes,1);assert.equal(r.finished,true);}});
test('whole workflow never releases old claims after unverified write',async()=>{const r=await runWorkflow('reschedule',{wrongReadback:true});assert.equal(r.response.statusCode,503);assert.equal(r.finished,false);});
test('known busy target is rejected before reservation or Google write',async()=>{const r=await runWorkflow('reschedule',{busyTarget:true});assert.equal(r.response.statusCode,409);assert.equal(r.response.body.retryNew,true);assert.equal(r.writes,0);assert.equal(r.finished,false);});

test('completed reschedule replay bypasses its own busy window and returns verified success',async()=>{const r=await runWorkflow('reschedule',{alreadyComplete:true,busyTarget:true});assert.equal(r.response.statusCode,200);assert.equal(r.response.body.operationId,op);assert.equal(r.writes,0);assert.equal(r.finished,false);});
