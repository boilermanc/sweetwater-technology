import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {googleMeetUrl} from '../n8n/booking/meet.mjs';
import {eventBody} from '../n8n/booking/core.mjs';
import {bookingEmail} from '../n8n/booking/email.mjs';
import {reminderEmail} from '../n8n/booking/reminder.mjs';
const now=Date.parse('2026-10-19T14:30:00Z'),config={timeZone:'America/New_York'};
const requestId='dd735642-882a-4a8c-9db1-55ed481c6803';
const b={requestId,eventId:'5a'+requestId.replaceAll('-',''),name:'Meet test',email:'owner@example.invalid',topic:'test',start:'2026-10-20T14:00:00Z',end:'2026-10-20T14:20:00Z'};
const conferenceData={createRequest:{status:{statusCode:'success'}},conferenceSolution:{key:{type:'hangoutsMeet'}},entryPoints:[{entryPointType:'video',uri:'https://meet.google.com/abc-defg-hij'}]};
const e={...eventBody(b,config),status:'confirmed',created:new Date(now-1000).toISOString(),conferenceData};
test('each booking requests its own stable Meet conference',()=>{assert.equal(eventBody(b,config).conferenceData.createRequest.requestId,requestId);assert.equal(eventBody(b,config).conferenceData.createRequest.conferenceSolutionKey.type,'hangoutsMeet');});
test('only verified Google Meet URLs become join links',()=>{assert.equal(googleMeetUrl(e),'https://meet.google.com/abc-defg-hij');for(const altered of [{...e,status:'cancelled'},{...e,conferenceData:null},{...e,conferenceData:{...conferenceData,createRequest:{status:{statusCode:'pending'}}}},{...e,conferenceData:{...conferenceData,entryPoints:[{entryPointType:'video',uri:'https://meet.google.com.evil.invalid/abc-defg-hij'}]}}])assert.equal(googleMeetUrl(altered),null);});
test('confirmation and reminder include the same saved Meet room in HTML and text',()=>{for(const mail of [bookingEmail(e,b,config,now),reminderEmail(e,config,now).payload]){assert.match(mail.html,/Join Google Meet/);assert.ok(mail.html.includes('href="https://meet.google.com/abc-defg-hij"'));assert.ok(mail.text.includes('https://meet.google.com/abc-defg-hij'));}const pending={...e,conferenceData:{createRequest:{status:{statusCode:'pending'}}}};assert.match(bookingEmail(pending,b,config,now).text,/not available yet/);assert.ok(!bookingEmail(pending,b,config,now).html.includes('Join Google Meet'));});
test('calendar mutations opt into conference data preservation',()=>{for(const file of ['create-booking','manage-booking']){const w=JSON.parse(readFileSync('n8n/booking/'+file+'.json'));for(const n of w.nodes.filter(n=>n.parameters.nodeCredentialType==='googleCalendarOAuth2Api'&&['POST','PATCH'].includes(n.parameters.method)&&n.parameters.url.includes('/events')))assert.match(n.parameters.url,/conferenceDataVersion=1/);}});

