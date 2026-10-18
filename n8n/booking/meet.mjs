export function googleMeetUrl(event) {
  const c=event?.conferenceData;
  if(event?.status!=='confirmed'||c?.conferenceSolution?.key?.type!=='hangoutsMeet'||(c.createRequest?.status?.statusCode && c.createRequest.status.statusCode!=='success'))return null;
  const url=c.entryPoints?.find(p=>p.entryPointType==='video')?.uri;
  return typeof url==='string'&&/^https:\/\/meet\.google\.com\/[a-z]{3}-[a-z]{4}-[a-z]{3}$/.test(url)?url:null;
}
