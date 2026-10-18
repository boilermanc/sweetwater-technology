export type AiHelpDetails = {
  business: string;
  task: string;
  result: string;
  name: string;
  email: string;
  callback: boolean;
  phone: string;
  marketing: boolean;
};

export const emptyDetails: AiHelpDetails = {
  business: '', task: '', result: '', name: '', email: '', callback: false, phone: '', marketing: false,
};

export function validateDetails(details: AiHelpDetails, step: number): string | null {
  const fields = ['business', 'task', 'result'] as const;
  if (step < 3) return details[fields[step]].trim() ? null : 'Please add a few words before continuing.';
  if (!details.name.trim()) return 'Please enter your name.';
  if ((!details.callback || details.email.trim()) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email.trim())) return 'Please enter a valid email address, or choose a callback and leave email blank.';
  if (details.callback && !/^\+?[\d\s().-]+$/.test(details.phone.trim())) return 'Please enter a phone number for your callback.';
  const digits = details.phone.replace(/\D/g, '');
  if (details.callback && (digits.length < 7 || digits.length > 15)) return 'Please enter a phone number with 7 to 15 digits.';
  return null;
}

export function requestPayload(details: AiHelpDetails, source: string, requestId: string) {
  return {
    requestId, source: source.slice(0, 120), intent: 'ai-help', event: 'intro_contact_request',
    business: details.business.trim(), task: details.task.trim(), desiredResult: details.result.trim(),
    contact: { name: details.name.trim(), email: details.email.trim(), phone: details.callback ? details.phone.trim() : null },
    contactMethod: details.callback ? 'callback' : 'email',
    consent: { marketing: details.marketing },
  };
}

export function emailRequest(details: AiHelpDetails, source: string) {
  const body = [
    'I would like a free introductory conversation (approximately 20 minutes).',
    '', `Business: ${details.business.trim()}`, `Time-consuming task: ${details.task.trim()}`,
    `Desired result: ${details.result.trim()}`, '', `Name: ${details.name.trim()}`,
    `Email: ${details.email.trim()}`, `Preferred contact: ${details.callback ? 'Callback' : 'Email'}`,
    ...(details.callback ? [`Phone: ${details.phone.trim()}`] : []),
    `Optional marketing updates: ${details.marketing ? 'Yes' : 'No'}`,
    '', `Source: ${source.slice(0, 120)}`, 'Intent: ai-help',
  ].join('\n');
  return `mailto:clint@sweetwater.technology?subject=${encodeURIComponent('Practical AI — introductory conversation')}&body=${encodeURIComponent(body)}`;
}

// A dedicated endpoint must implement this contract. Do not point at sage-card-chat.
export async function submitRequest<T extends { requestId: string }>(endpoint: string, payload: T) {
  const response = await fetch(endpoint, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload), signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error('Request was not confirmed');
  const data: unknown = await response.json();
  if (!data || typeof data !== 'object' || !('accepted' in data) || data.accepted !== true ||
      !('requestId' in data) || data.requestId !== payload.requestId) throw new Error('Request was not confirmed');
}
