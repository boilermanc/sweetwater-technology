import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {bookingEmail,confirmationMarker} from '../n8n/booking/email.mjs';
import {eventBody} from '../n8n/booking/core.mjs';
const config={timeZone:'America/New_York'};
const booking={name:'<img src=x onerror=alert(1)>',email:'owner@example.invalid',topic:'private topic',eventId:'5a123',requestId:'request',start:'2026-11-03T15:00:00Z',end:'2026-11-03T15:20:00Z'};
const now=Date.parse('2026-10-16T20:00:00Z');
const event={...eventBody(booking,config),status:'confirmed',created:new Date(now-1000).toISOString()};
test('confirmation uses escaped HTML, plain text, Eastern DST and reply address',()=>{const email=bookingEmail(event,booking,config,now);assert.deepEqual(email.to,[booking.email]);assert.equal(email.reply_to,'team@sweetwater.technology');assert.ok(email.html.includes('&lt;img'));assert.ok(!email.html.includes('<img'));assert.match(email.text,/10:00 AM EST/);assert.ok(!email.text.includes(booking.topic));assert.ok(email.html.includes('lang="en"'));assert.deepEqual(bookingEmail(event,booking,config,now),email);});
test('unverified, cancelled, already sent and stale events never send',()=>{for(const altered of [{...event,status:'cancelled'},{...event,id:'other'},{...event,created:'bad'},{...event,created:new Date(now-24*3600000).toISOString()},{...event,extendedProperties:{private:{...event.extendedProperties.private,sweetwaterConfirmationId:'sent'}}}])assert.equal(bookingEmail(altered,booking,config,now),null);assert.equal(bookingEmail(event,{...booking,email:'other@example.invalid'},config,now),null);});
test('only a Resend acknowledgement records a receipt and preserves booking properties',()=>{for(const response of [{statusCode:500,body:{}},{error:'timeout'},{statusCode:200,body:{id:''}}])assert.equal(confirmationMarker(response,event),null);const id='e3d5b3d5-5e9d-4b9c-a9f5-5ef5d4d4f1c1';const p=confirmationMarker({statusCode:200,body:{id}},event);assert.equal(p.extendedProperties.private.sweetwaterConfirmationId,id);assert.equal(p.extendedProperties.private.sweetwaterRequestId,booking.requestId);});
test('email follows response, rejects errors and does not recreate calendar events',()=>{const w=JSON.parse(readFileSync('n8n/booking/create-booking.json','utf8'));const guard=w.nodes.find(n=>n.name==='Confirmed booking email only');const run=new Function('$input','$',guard.parameters.jsCode);for(const response of [{statusCode:409,body:{confirmed:false}},{statusCode:200,body:{confirmed:false}}])assert.deepEqual(run({first:()=>({json:response})},()=>{throw Error('must not run');}),[]);assert.equal(w.connections['Return public response'].main[0][0].node,guard.name);const send=w.nodes.find(n=>n.name==='Send Sweetwater confirmation');assert.equal(send.onError,'continueRegularOutput');assert.equal(send.maxTries,3);assert.match(send.parameters.headerParameters.parameters[0].value,/booking.eventId/);assert.equal(w.connections['Save confirmation email receipt'],undefined);});


test('receipt patch uses the observed ETag so concurrent booking changes are not overwritten',()=>{
 const w=JSON.parse(readFileSync('n8n/booking/create-booking.json','utf8'));
 const receipt=w.nodes.find(n=>n.name==='Save confirmation email receipt');
 assert.equal(receipt.parameters.method,'PATCH');
 assert.equal(receipt.parameters.sendHeaders,true);
 assert.deepEqual(receipt.parameters.headerParameters.parameters,[{name:'If-Match',value: "={{ $('Build Sweetwater confirmation').first().json.event.etag }}"}]);
});
