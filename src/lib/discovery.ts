export type DiscoveryIntent = 'ai-help' | 'app-idea';
export type DiscoveryMessage = { role: 'user' | 'assistant'; content: string };
export type DiscoveryContext = Record<string, string>;
export const discoveryConfig = {
  'ai-help': {
    title: 'Practical AI for local businesses',
    opening: "Hi, I'm Sage, Clint's assistant. You don't need to have an AI project figured out. Tell me a little about your business and what you'd like to make easier.",
    fields: [['business', 'Business type'], ['task', 'Time-consuming task'], ['result', 'Desired result']],
  },
  'app-idea': {
    title: 'An app idea starts with a conversation',
    opening: "Hi, I'm Sage, Clint's assistant. You don't need to be ready to build. What's your idea, who might use it, and what problem would it help them solve? We can talk through a useful first version together. AI is optional.",
    fields: [['idea', 'The idea'], ['audience', 'Who might use it'], ['problem', 'Problem to solve'], ['firstVersion', 'Useful first version']],
  },
} as const;

export function completeContext(intent: DiscoveryIntent, context: DiscoveryContext) {
  return discoveryConfig[intent].fields.every(([key]) => !!context[key]?.trim());
}

export async function discoveryReply(endpoint: string, intent: DiscoveryIntent, source: string, messages: DiscoveryMessage[], context: DiscoveryContext) {
  const response = await fetch(endpoint, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(30000),
    body: JSON.stringify({ event: 'discovery_chat', intent, source: source.slice(0, 120), messages: messages.slice(-30), context }),
  });
  if (!response.ok) throw new Error('Chat unavailable');
  const data: unknown = await response.json();
  if (!data || typeof data !== 'object' || !('reply' in data) || typeof data.reply !== 'string' || !data.reply.trim() || data.reply.length > 4000) throw new Error('Invalid reply');
  const parsedContext: DiscoveryContext = { ...context };
  if ('context' in data && data.context && typeof data.context === 'object') {
    for (const [key] of discoveryConfig[intent].fields) {
      const value = (data.context as Record<string, unknown>)[key];
      if (typeof value === 'string' && value.trim()) parsedContext[key] = value.trim().slice(0, 1000);
    }
  }
  return { reply: data.reply, context: parsedContext };
}

export function discoveryEmail(intent: DiscoveryIntent, source: string, context: DiscoveryContext, contact: {name:string;email:string;phone:string;callback:boolean;marketing:boolean}, messages: DiscoveryMessage[]) {
  const body = [
    'Please contact me about a free introductory conversation (approximately 20 minutes).',
    ...discoveryConfig[intent].fields.map(([key,label]) => `${label}: ${context[key] || ''}`),
    `Name: ${contact.name}`, `Email: ${contact.email}`,
    `Preferred contact: ${contact.callback ? 'Callback' : 'Email'}`,
    ...(contact.callback ? [`Phone: ${contact.phone}`] : []),
    `Optional marketing updates: ${contact.marketing ? 'Yes' : 'No'}`,
    `Source: ${source.slice(0,120)}`, `Intent: ${intent}`, '', 'Conversation:',
    ...messages.map(message => `${message.role === 'user' ? 'Visitor' : 'Sage'}: ${message.content}`),
  ].join('\n');
  return `mailto:clint@sweetwater.technology?subject=${encodeURIComponent(intent === 'ai-help' ? 'Practical AI introduction' : 'Talk through an app idea')}&body=${encodeURIComponent(body)}`;
}
