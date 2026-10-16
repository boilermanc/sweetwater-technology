export type HomeContactDetails = { name: string; business: string; email: string; phone: string; message: string; website: string };
export function validateHomeContact(details: HomeContactDetails): string | null {
  if (details.website) return 'Unable to send this request. Please email us instead.';
  if (!details.message.trim() || details.message.length > 1000) return 'Please describe the problem in 1 to 1,000 characters.';
  if (!details.name.trim() || details.name.length > 120) return 'Please enter your name (up to 120 characters).';
  if (details.business.length > 120) return 'Please shorten the business name to 120 characters.';
  if (!details.email.trim() && !details.phone.trim()) return 'Please enter an email address or phone number.';
  if (details.email.trim() && (details.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim()))) return 'Please enter a valid email address.';
  if (details.phone.trim() && (!/^\+?[\d\s().-]+$/.test(details.phone.trim()) || details.phone.replace(/\D/g, '').length < 7 || details.phone.replace(/\D/g, '').length > 15)) return 'Please enter a phone number with 7 to 15 digits.';
  return null;
}
export function homeContactPayload(details: HomeContactDetails, requestId: string, source = 'homepage-contact') {
  return {
    requestId, event: 'intro_contact_request', intent: 'ai-help', source,
    contactMethod: details.email.trim() ? 'email' : 'callback',
    contact: { name: details.name.trim(), email: details.email.trim() || null, phone: details.phone.trim() || null },
    context: { business: details.business.trim(), task: details.message.trim() },
    messages: [{ role: 'user', content: details.message.trim() }],
    consent: { marketing: false }, website: details.website,
  };
}
export function homeContactEmail(details: HomeContactDetails) {
  const body = [details.message.trim(), '', 'Name: ' + details.name.trim(), 'Business: ' + details.business.trim(), 'Email: ' + details.email.trim(), 'Phone: ' + details.phone.trim()].join('\n');
  return 'mailto:team@sweetwater.technology?subject=' + encodeURIComponent('Help with my business') + '&body=' + encodeURIComponent(body);
}
