import {randomUUID} from 'node:crypto';
import {googleMeetUrl} from './meet.mjs';
import {bookingEmail} from './email.mjs';
import {managementEmail} from './management-email.mjs';
import {managedEvent,operationApplied} from './management.mjs';

export function ownerNotification(event,context,config,now=Date.now()) {
  if(!config.ownerEmail || !config.ownerSlackUserId)return null;
  const p=event?.extendedProperties?.private;
  let action,id,start,oldStart;
  if(context.kind==='booking') {
    // Owner delivery is independent of whether the guest email already has a receipt.
    const copy={...event,extendedProperties:{private:{...p,sweetwaterConfirmationId:null}}};
    if(!bookingEmail(copy,context.booking,config,now))return null;
    action='booked';id=context.booking.requestId;start=context.booking.start;
  } else if(context.kind==='management') {
    if(!managementEmail(context.response,event,context.request,context.operation,config,now))return null;
    action=context.request.action==='cancel'?'cancelled':'rescheduled';id=context.request.operationId;
    start=context.operation.target_start||context.operation.old_start;oldStart=context.operation.old_start;
  } else return null;
  const title={booked:'New Sweetwater call booked',rescheduled:'Sweetwater call rescheduled',cancelled:'Sweetwater call cancelled'}[action];
  const when=value=>new Intl.DateTimeFormat('en-US',{timeZone:config.timeZone,weekday:'long',month:'long',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'}).format(new Date(value));
  const meet=action==='cancelled'?null:googleMeetUrl(event);
  const lines=[title,'',`Guest: ${p.sweetwaterName}`,`Email: ${p.sweetwaterEmail}`,`${action==='cancelled'?'Cancelled time':'Appointment'}: ${when(start)}`,`Time zone: ${config.timeZone}`];
  if(action==='rescheduled')lines.push('Previous time: '+when(oldStart));
  if(meet)lines.push('Google Meet: '+meet);
  if(action!=='cancelled'&&!meet)lines.push('Google Meet link is not available yet. Check the calendar before the call.');
  lines.push('', 'Booking reference: '+event.id, 'Notification reference: '+id);
  const text=lines.join('\n');
  const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
  const topic=typeof p.sweetwaterTopic==='string'?p.sweetwaterTopic:'';
  const html='<!doctype html><html lang="en"><head><meta charset="utf-8"><title>'+title+'</title></head><body style="font-family:Arial,sans-serif;color:#142035;line-height:1.6"><h1 style="color:#1556e8">'+title+'</h1><p>'+escape(lines.slice(2).join('\n')).replaceAll('\n','<br>')+'</p>'+(topic?'<h2>What they want to discuss</h2><p>'+escape(topic)+'</p>':'')+'</body></html>';
  return {key:'sweetwater-owner/'+action+'/'+id,payload:{from:'Sweetwater Technology <team@sweetwater.technology>',to:[config.ownerEmail],reply_to:p.sweetwaterEmail,subject:title+' — '+when(start),text:text+(topic?'\n\nWhat they want to discuss:\n'+topic:''),html},slack:{channel:config.ownerSlackUserId,text,mrkdwn:false,parse:'none',unfurl_links:false,unfurl_media:false}};
}

export function firstOwnerDelivery(response) {
  // Resend is the delivery ledger. Never replay a Slack DM after an email replay,
  // or when acknowledgement is missing. Slack has no documented exactly-once send API.
  return response?.statusCode===200 && /^[a-f0-9-]{36}$/i.test(response.body?.id||'') && response.headers?.['idempotent-replayed']==='false';
}

export function addOwnerNotifications(workflow,config,kind) {
  const booking=kind==='booking';
  const source=booking?'Return public response':'Return management response';
  const nodes=[];
  const add=(name,type,parameters,version=2,extra={})=>nodes.push({id:randomUUID(),name,type:'n8n-nodes-base.'+type,typeVersion:version,parameters,position:[7600+nodes.length*260,480],...extra});
  const code=(name,jsCode)=>add(name,'code',{jsCode});
  code('Verified owner notification only',booking?"const r=$input.first().json;if(r.statusCode!==200||r.body?.confirmed!==true)return [];return [{json:{kind:'booking',booking:$('Validate booking request').first().json.booking}}];":"const r=$input.first().json;if(r.statusCode!==200||r.body?.ok!==true||r.body.pending!==false||!r.body.operationId)return [];return [{json:{kind:'management',response:r,request:$('Validate management request').first().json.request,operation:$('Check management reservation').first().json.operation}}];");
  if(booking)add('Allow owner Meet provisioning','wait',{amount:5,unit:'seconds'},1.1);
  add('Read owner notification event','httpRequest',{method:'GET',url:"={{ 'https://www.googleapis.com/calendar/v3/calendars/'+encodeURIComponent("+JSON.stringify(config.calendarId)+")+'/events/'+"+(booking?"$('Verified owner notification only').first().json.booking.eventId":"'5a'+$('Verified owner notification only').first().json.request.bookingId.replaceAll('-','')")+" }}",authentication:'predefinedCredentialType',nodeCredentialType:'googleCalendarOAuth2Api',options:{timeout:5000,response:{response:{fullResponse:true,neverError:true,responseFormat:'json'}}}},4.2,{onError:'continueRegularOutput'});
  code('Build owner notification',[googleMeetUrl,bookingEmail,managedEvent,operationApplied,managementEmail,ownerNotification].map(f=>f.toString()).join('\n')+'\nconst r=$input.first().json;if(r.statusCode!==200)return [];const alert=ownerNotification(r.body,$("Verified owner notification only").first().json,'+JSON.stringify(config)+');return alert?[{json:alert}]:[];');
  add('Email Clint booking notification','httpRequest',{method:'POST',url:'https://api.resend.com/emails',authentication:'genericCredentialType',genericAuthType:'httpHeaderAuth',sendHeaders:true,headerParameters:{parameters:[{name:'Idempotency-Key',value:'={{ $json.key }}'}]},sendBody:true,specifyBody:'json',jsonBody:'={{ JSON.stringify($json.payload) }}',options:{timeout:5000,response:{response:{fullResponse:true,responseFormat:'json'}}}},4.2,{retryOnFail:true,maxTries:2,waitBetweenTries:1000,onError:'continueRegularOutput'});
  code('Send Slack on first owner delivery',firstOwnerDelivery.toString()+'\nreturn firstOwnerDelivery($input.first().json)?[{json:$("Build owner notification").first().json.slack}]:[];');
  add('DM Clint booking notification','httpRequest',{method:'POST',url:'https://slack.com/api/chat.postMessage',authentication:'predefinedCredentialType',nodeCredentialType:'slackOAuth2Api',sendBody:true,specifyBody:'json',jsonBody:'={{ JSON.stringify($json) }}',options:{timeout:5000,response:{response:{fullResponse:true,neverError:true,responseFormat:'json'}}}},4.2,{onError:'continueRegularOutput'});
  code('Check Slack notification acknowledgement','const r=$input.first().json;if(r.statusCode!==200||r.body?.ok!==true||!r.body.ts||!r.body.channel)return [{json:{notificationAccepted:false}}];return [{json:{notificationAccepted:true}}];');
  workflow.nodes.push(...nodes);
  // Separate branch: an already-sent guest email cannot suppress the owner alert.
  const outputs=workflow.connections[source].main[0];outputs.unshift({node:nodes[0].name,type:'main',index:0});
  for(let i=0;i<nodes.length-1;i++)workflow.connections[nodes[i].name]={main:[[{node:nodes[i+1].name,type:'main',index:0}]]};
  return workflow;
}
