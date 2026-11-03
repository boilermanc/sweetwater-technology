import {googleMeetUrl} from './meet.mjs';
import {randomUUID} from 'node:crypto';
import {managedEvent,operationApplied} from './management.mjs';

export function managementEmail(response,event,request,operation,config,now=Date.now()) {
  if(response?.statusCode!==200 || response.body?.ok!==true || response.body.pending!==false || request.action==='view' || response.body.bookingId!==request.bookingId || response.body.operationId!==request.operationId || operation?.id!==request.operationId || operation.booking_id!==request.bookingId || operation.action!==request.action || !['pending','complete'].includes(operation.state))return null;
  const expected=operation.action==='cancel'?'cancelled':'active';
  if(response.body.status!==expected || Date.parse(response.body.start)!==Date.parse(operation.target_start||operation.old_start) || !operationApplied(event,request,operation))return null;
  // Bound all retries inside Resend's 24-hour idempotency window, including lost acknowledgements.
  const age=now-Date.parse(operation.created_at);
  if(!Number.isFinite(age)||age<0||age>23*3600000)return null;
  const email=event.extendedProperties.private.sweetwaterEmail,name=event.extendedProperties.private.sweetwaterName;
  if(typeof email!=='string'||! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||typeof name!=='string')return null;
  const validUUID=x=>typeof x==='string'&&/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(x);
  if(!validUUID(request.bookingId)||!validUUID(request.token)||!validUUID(request.operationId))return null;
  const when=value=>new Intl.DateTimeFormat('en-US',{timeZone:config.timeZone,weekday:'long',month:'long',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'}).format(new Date(value));
  const cancel=operation.action==='cancel',title=cancel?'Your call is cancelled.':'Your call has been rescheduled.';
  const details=cancel?'Cancelled appointment: '+when(operation.old_start):'New appointment: '+when(operation.target_start)+'\nPrevious appointment: '+when(operation.old_start);
  const url=cancel?'https://sweetwater.technology/book':'https://sweetwater.technology/book/manage#id='+request.bookingId+'&token='+request.token;
  const label=cancel?'Book another call':'Cancel or reschedule';
  const meet=cancel?null:googleMeetUrl(event);
  const callText=meet?'Join your call on Google Meet: '+meet:'Your Google Meet link is not available yet. Reply here for help joining.';
  const note=cancel?'Your appointment has been cancelled. You can book another free 20-minute call whenever you are ready.':'Your free 20-minute call is confirmed for the new time. '+callText;
  const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
  const text=`Hi ${name},\n\n${title}\n\n${details}\nTime zone: ${config.timeZone}\n\n${note}\n\n${label}: ${url}\n${cancel?'':'Keep this private link to yourself.\n'}\nReply to this email if you need help.\n\nClint and Sheree\nSweetwater Technology\n\nBooking reference: ${event.id}\nChange reference: ${operation.id}`;
  const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title></head><body style="margin:0;background:#f1f5fb;color:#142035;font-family:Arial,sans-serif"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px"><table role="presentation" width="100%" style="max-width:600px;background:#fff;border-radius:16px" cellpadding="0" cellspacing="0"><tr><td style="background:#1556e8;color:#fff;padding:28px;border-radius:16px 16px 0 0"><p>SWEETWATER TECHNOLOGY</p><h1 style="font-size:28px">${title}</h1></td></tr><tr><td style="padding:28px;font-size:16px;line-height:1.6"><p>Hi ${escape(name)},</p><p style="padding:18px;background:#eef4ff;border-radius:10px"><strong>${escape(details).replaceAll('\n','<br>')}</strong><br>Time zone: ${escape(config.timeZone)}</p><p>${note}</p>${meet?`<p><a href="${meet}" style="display:inline-block;background:#1556e8;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold">Join Google Meet</a></p>`:""}<p><a href="${escape(url)}" style="display:inline-block;background:#1556e8;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold">${label}</a></p>${cancel?'':'<p style="font-size:13px">Keep this private link to yourself.</p>'}<p>Reply to this email if you need help.</p><p>Clint and Sheree<br>Sweetwater Technology</p><p style="font-size:12px;color:#536075">Booking reference: ${escape(event.id)}<br>Change reference: ${escape(operation.id)}</p></td></tr></table></td></tr></table></body></html>`;
  return {from:'Sweetwater Technology <team@sweetwater.technology>',to:[email],reply_to:'team@sweetwater.technology',subject:cancel?'Your Sweetwater call is cancelled':'Your Sweetwater call has been rescheduled',html,text};
}

export function addManagementEmailNodes(workflow,config) {
  const code=(name,jsCode)=>({id:randomUUID(),name,type:'n8n-nodes-base.code',typeVersion:2,parameters:{jsCode},position:[7200,720]});
  const nodes=[
    code('Confirmed management email only',"const r=$input.first().json;if(r.statusCode!==200||r.body?.ok!==true||!r.body.operationId||r.body.pending!==false)return [];return [{json:{response:r,request:$('Validate management request').first().json.request,operation:$('Check management reservation').first().json.operation}}];"),
    {id:randomUUID(),name:'Read management email event',type:'n8n-nodes-base.httpRequest',typeVersion:4.2,parameters:{method:'GET',url:"={{ 'https://www.googleapis.com/calendar/v3/calendars/'+encodeURIComponent("+JSON.stringify(config.calendarId)+")+'/events/5a'+$('Confirmed management email only').first().json.request.bookingId.replaceAll('-','') }}",authentication:'predefinedCredentialType',nodeCredentialType:'googleCalendarOAuth2Api',options:{timeout:10000,response:{response:{fullResponse:true,neverError:true,responseFormat:'json'}}}}},
    code('Build management email',[googleMeetUrl,managedEvent,operationApplied,managementEmail].map(f=>f.toString()).join('\n')+"\nconst r=$input.first().json,c=$('Confirmed management email only').first().json;if(r.statusCode!==200)return [];const payload=managementEmail(c.response,r.body,c.request,c.operation,"+JSON.stringify(config)+");return payload?[{json:{payload}}]:[];"),
    {id:randomUUID(),name:'Send Sweetwater change confirmation',type:'n8n-nodes-base.httpRequest',typeVersion:4.2,retryOnFail:true,maxTries:3,waitBetweenTries:1000,onError:'continueRegularOutput',parameters:{method:'POST',url:'https://api.resend.com/emails',authentication:'genericCredentialType',genericAuthType:'httpHeaderAuth',sendHeaders:true,headerParameters:{parameters:[{name:'Idempotency-Key',value:'={{ "sweetwater-change/" + $("Confirmed management email only").first().json.operation.id }}'}]},sendBody:true,specifyBody:'json',jsonBody:'={{ JSON.stringify($json.payload) }}',options:{timeout:10000,response:{response:{fullResponse:true,responseFormat:'json'}}}}}
  ];
  nodes.forEach((n,i)=>{n.position=[7200+i*260,720];workflow.nodes.push(n);});
  const chain=['Return management response',...nodes.map(n=>n.name)];
  for(let i=0;i<chain.length-1;i++)workflow.connections[chain[i]]={main:[[{node:chain[i+1],type:'main',index:0}]]};
  return workflow;
}
