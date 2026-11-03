// Embedded in n8n Code nodes. All external writes remain explicit HTTP nodes.
export function managementRequest(body) {
  const uuid = x => typeof x === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(x);
  const iso = x => typeof x === 'string' && x.length <= 30 && Number.isFinite(Date.parse(x)) && new Date(x).toISOString() === x;
  if (!body || !uuid(body.bookingId) || !uuid(body.token) || !['view','cancel','reschedule'].includes(body.action)) throw Error('invalid_request');
  const r = {bookingId:body.bookingId.toLowerCase(),token:body.token.toLowerCase(),action:body.action};
  if (body.action !== 'view') {
    if (!uuid(body.operationId) || !iso(body.start) || (body.action === 'reschedule' && !iso(body.target))) throw Error('invalid_request');
    Object.assign(r,{operationId:body.operationId.toLowerCase(),start:body.start,target:body.action==='reschedule'?body.target:null});
  }
  return r;
}
export function managedEvent(event, request) {
  return event?.id === '5a'+request.bookingId.replaceAll('-','') && event.extendedProperties?.private?.sweetwaterRequestId === request.bookingId;
}
export function operationApplied(event, request, operation) {
  if (!managedEvent(event,request) || event.extendedProperties.private.sweetwaterManagementOperation !== request.operationId) return false;
  if (operation.action === 'cancel') return event.status === 'cancelled';
  return event.status === 'confirmed' && Date.parse(event.start?.dateTime) === Date.parse(operation.target_start) && Date.parse(event.end?.dateTime) === Date.parse(operation.target_start)+1200000;
}
export function managementPatch(event, request, operation, config) {
  if (!managedEvent(event,request) || event.status!=='confirmed' || !event.etag || Date.parse(event.start?.dateTime)!==Date.parse(operation.old_start) || Date.parse(event.start.dateTime)<=Date.now()) throw Error('stale_booking');
  const patch={extendedProperties:{private:{...event.extendedProperties.private,sweetwaterManagementOperation:request.operationId}}};
  if(operation.action==='cancel') patch.status='cancelled';
  else {
    patch.start={dateTime:new Date(operation.target_start).toISOString(),timeZone:config.timeZone};
    patch.end={dateTime:new Date(Date.parse(operation.target_start)+1200000).toISOString(),timeZone:config.timeZone};
  }
  return patch;
}
export function managementView(record,event,request,config) {
  if(!managedEvent(event,request)) throw Error('unverified_booking');
  const cancelled=event.status==='cancelled';
  if(!cancelled && (event.status!=='confirmed' || Date.parse(event.start?.dateTime)!==Date.parse(record.start))) throw Error('change_in_progress');
  return {ok:true,bookingId:request.bookingId,status:cancelled?'cancelled':'active',start:new Date(record.start).toISOString(),timeZone:config.timeZone,pending:!!record.pendingOperation};
}
