export function normalizeContact(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body) || JSON.stringify(body).length > 12000 || body.website) throw new Error('Invalid request');
  if (typeof body.requestId !== 'string' || !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(body.requestId)) throw new Error('Invalid request ID');
  const field = (value,max,required=false) => { if (typeof value !== 'string' || value.length > max || (required && !value.trim())) throw new Error('Invalid field'); return value.trim(); };
  const name=field(body.contact?.name,100,true),email=field(body.contact?.email ?? '',254).toLowerCase(),phone=field(body.contact?.phone ?? '',30);
  const business=field(body.context?.business ?? '',120),message=field(body.context?.summary,1000,true);
  if (!email && !phone) throw new Error('Contact details required');
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Invalid email');
  if (phone && (!/^\+?[\d\s().-]+$/.test(phone) || phone.replace(/\D/g,'').length<7 || phone.replace(/\D/g,'').length>15)) throw new Error('Invalid phone');
  if (body.event!=='intro_contact_request' || body.intent!=='website-contact' || body.consent?.marketing!==false) throw new Error('Invalid purpose');
  const source=field(body.source,120,true);
  if (source!=='homepage-contact' && !/^website:\/[a-z0-9/-]*$/.test(source)) throw new Error('Invalid source');
  const scrub=v=>v.replace(/\b\d{3}-\d{2}-\d{4}\b/g,'[redacted]').replace(/\b(?:\d[ -]*?){13,19}\b/g,'[redacted]').replace(/\b(?:sk-|sb_secret_)[a-zA-Z0-9_-]{16,}\b/g,'[redacted]');
  return {requestId:body.requestId.toLowerCase(),event:'intro_contact_request',intent:'website-contact',source,contactMethod:email?'email':'callback',contact:{name,email:email||null,phone:phone||null},context:{business:scrub(business),summary:scrub(message)},messages:[{role:'user',content:scrub(message)}],consent:{marketing:false},testMode:false};
}
export function humanVerified(response) {
  return response.statusCode===200 && response.body?.success===true && response.body.hostname==='sweetwater.technology' && response.body.action==='sweetwater-contact';
}
export function savedResponse(response,payload) {
  return response.statusCode===200 && response.body?.accepted===true && response.body.requestId===payload.requestId
    ? {statusCode:200,body:{accepted:true,requestId:payload.requestId}}
    : {statusCode:503,body:{accepted:false,message:'We could not confirm receipt. Please retry with the same details.'}};
}
