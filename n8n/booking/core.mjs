// This file is embedded into the n8n Code nodes by build-booking-workflows.mjs.
// Keep configuration in config.json; no credentials belong in these files.
export function slots(config, now, busy = []) {
  const fmt = new Intl.DateTimeFormat('en-US', { timeZone: config.timeZone, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  const earliest = now + config.noticeHours * 3600000;
  const latest = now + config.horizonDays * 86400000;
  const step = config.stepMinutes * 60000;
  const result = [];
  for (let start = Math.ceil(earliest / step) * step; start < latest; start += step) {
    const p = Object.fromEntries(fmt.formatToParts(start).map(p => [p.type, p.value]));
    const minute = Number(p.hour) * 60 + Number(p.minute);
    const end = start + config.durationMinutes * 60000;
    if (!config.weekdays.includes(p.weekday) || minute < config.openMinute || minute + config.durationMinutes > config.closeMinute) continue;
    const buffer = config.bufferMinutes * 60000;
    if (busy.some(b => start < Date.parse(b.end) + buffer && end + buffer > Date.parse(b.start))) continue;
    result.push({ start: new Date(start).toISOString(), end: new Date(end).toISOString() });
  }
  return result;
}
export function busyWindows(response, config) {
  if (response.statusCode !== 200 || !response.body?.calendars) throw new Error('Calendar unavailable');
  return config.busyCalendarIds.flatMap(id => {
    const cal = response.body.calendars[id];
    if (!cal || cal.errors?.length || !Array.isArray(cal.busy)) throw new Error('Calendar unavailable');
    if (cal.busy.some(b => !Number.isFinite(Date.parse(b.start)) || !Number.isFinite(Date.parse(b.end)) || Date.parse(b.end) <= Date.parse(b.start))) throw new Error('Invalid availability');
    return cal.busy;
  });
}
export function validateBooking(body, config, now) {
  if (!body || typeof body !== 'object' || body.website) throw new Error('Invalid request');
  if (typeof body.requestId !== 'string' || !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(body.requestId)) throw new Error('Invalid request identifier');
  const field = (key, max, required = true) => { const value = body[key]; if (typeof value !== 'string' || value.length > max || (required && !value.trim())) throw new Error('Invalid ' + key); return value.trim(); };
  const name = field('name',120); const email = field('email',254).toLowerCase(); const topic = field('topic',1000,false);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Invalid email');
  const start = field('start',40);
  const slot = slots({ ...config, noticeHours: 0, horizonDays: config.horizonDays + 1 }, now - 86400000).find(s => s.start === start);
  if (!slot) throw new Error('Slot is outside booking hours');
  return { ...slot, name, email, topic, requestId: body.requestId.toLowerCase(), eventId: '5a' + body.requestId.toLowerCase().replaceAll('-', '') };
}
export function sameBooking(event, booking) {
  return event?.status === 'confirmed' && event.id === booking.eventId && event.extendedProperties?.private?.sweetwaterRequestId === booking.requestId && event.extendedProperties?.private?.sweetwaterEmail === booking.email && event.extendedProperties?.private?.sweetwaterName === booking.name && event.extendedProperties?.private?.sweetwaterTopic === booking.topic && Date.parse(event.start?.dateTime) === Date.parse(booking.start) && Date.parse(event.end?.dateTime) === Date.parse(booking.end);
}
export function confirmation(event, booking) {
  if (!sameBooking(event, booking)) throw new Error('Booking was not confirmed');
  return { confirmed: true, requestId: booking.requestId, bookingId: event.id, start: booking.start, end: booking.end };
}
export function eventBody(booking, config) {
  const escape = s => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
  return { id: booking.eventId, summary: 'Sweetwater introductory call — ' + booking.name,
    description: 'Free 20-minute introductory call.\nTopic: ' + escape(booking.topic) + '\nJoin using the Google Meet link on this invitation.',
    start: {dateTime: booking.start,timeZone:config.timeZone}, end: {dateTime:booking.end,timeZone:config.timeZone},
    conferenceData:{createRequest:{requestId:booking.requestId,conferenceSolutionKey:{type:'hangoutsMeet'}}},
    visibility:'private', transparency:'opaque', attendees:[{email:booking.email,displayName:booking.name}],
    guestsCanModify:false,guestsCanInviteOthers:false,guestsCanSeeOtherGuests:false,
    extendedProperties:{private:{sweetwaterRequestId:booking.requestId,sweetwaterEmail:booking.email,sweetwaterName:booking.name,sweetwaterTopic:booking.topic}}
  };
}
