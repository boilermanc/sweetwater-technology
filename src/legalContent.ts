export const LEGAL_CONTACT_ADDRESS = '1295 Smithdale Heights Drive, Cumming, GA 30040';
export type LegalSection = { title: string; text: string };
export const LEGAL_DRAFTS = {
  terms: {
    title: 'Website Terms',
    introduction: 'Proposed terms for the Sweetwater Technology LP website, its informational resources and introductory conversations. These are not a client services agreement or terms for every product shown in our portfolio.',
    sections: [
      { title: 'Postal contact', text: `Sweetwater Technology LP, ${LEGAL_CONTACT_ADDRESS}.` },
      { title: 'Using this website', text: 'Use the website lawfully. Do not attempt to access another person’s account, disrupt the service, bypass access controls, or submit content you are not authorized to share.' },
      { title: 'Conversations and project work', text: 'An inquiry, AI conversation or resource download does not create a client engagement, book an appointment or commit either party to a project. Scope, fees, responsibilities, acceptance criteria and support for paid work belong in a separate written agreement.' },
      { title: 'Information and AI-assisted content', text: 'Website resources and AI-assisted replies provide general information and starting points. They may contain errors or be incomplete. Check important facts and use appropriate professional advice before making legal, financial, medical or other consequential decisions. Product examples do not guarantee business results.' },
      { title: 'Your submissions', text: 'Share only information needed to explain your question. Do not submit passwords, payment details, sensitive personal information or confidential customer material through public forms or chat. The Privacy Notice describes the proposed treatment of information submitted through this website.' },
      { title: 'Resources, ownership and other sites', text: 'Sweetwater and the relevant rights holders retain ownership of their content, marks and software. Individual resources may have their own license terms. Do not assume that downloading a resource transfers ownership or permission to resell it. External websites and portfolio products may have separate terms and privacy notices.' },
      { title: 'Availability and updates', text: 'Features and informational content may change. Contact Sweetwater if you need to confirm a capability or service before relying on it. Any approved version of these terms should carry an effective date and a stated process for communicating material changes.' },
    ],
    review: 'Before approval: confirm the contracting entity, resource licenses and permitted reuse, any warranty or liability provisions, dispute process, applicable law, age requirements and how changes take effect. These points are deliberately not invented in this draft.',
  },
  privacy: {
    title: 'Privacy Notice',
    introduction: 'A proposed notice for the Sweetwater Technology LP website and its contact, discovery and resource-request features. Portfolio products may use separate notices. The signed-in client workspace also needs its data practices confirmed before this notice is approved.',
    sections: [
      { title: 'Postal contact', text: `Sweetwater Technology LP, ${LEGAL_CONTACT_ADDRESS}.` },
      { title: 'Information you choose to provide', text: 'Depending on the feature, you may provide your name, email address, phone number, business information, questions, messages and conversation summaries. A contact request can include the conversation leading to it. Do not include patient or customer personal details, passwords, financial account information or other sensitive material in public forms or chat.' },
      { title: 'How features handle a request', text: 'A connected contact form sends the details you submit to a server for processing. AI discovery features can send conversation content to a configured service to generate replies. Some resource requests ask for contact details before a download. Email links instead open your email application; you decide whether to send the draft.' },
      { title: 'Why information is used', text: 'The proposed purposes are to respond to inquiries, understand requested work, provide requested resources, manage follow-up and operate the relevant feature. Where a form offers optional marketing updates, that preference is collected separately from the request for contact.' },
      { title: 'Technical information and browser storage', text: 'Some campaign entry pages send visit source, campaign information and browser details to a tracking endpoint. The existing card conversation uses session storage for a conversation identifier. Hosting and account services may also process connection or authentication information. The complete production cookie, storage and analytics inventory remains to be confirmed.' },
      { title: 'Services that process information', text: 'Website features can involve hosting, email, automation, account and AI service providers. External links take you to services with their own notices. Before publication, Sweetwater must confirm the actual providers, recipients, processing locations and whether AI providers retain content or use it for model training.' },
      { title: 'Retention, security and your choices', text: 'You can choose not to submit a form or use chat. You can contact Sweetwater about information you previously supplied, corrections, deletion requests or communication preferences. Applicable rights and any identity-verification process need to be stated in the approved notice. Retention periods, deletion procedures and security practices must also be confirmed; this draft makes no promise of a particular retention period or absolute security.' },
      { title: 'Contact', text: 'For privacy questions, email team@sweetwater.technology. Describe your request without sending passwords, sensitive documents or unnecessary personal details.' },
    ],
    review: 'Before approval: confirm the data controller, all live data flows and vendors, retention/deletion schedules, cookies and analytics, AI training settings, marketing use, sale/sharing practices, international transfers, children’s data handling and rights applicable to the people served. Do not publish this draft as a complete privacy policy until those facts are verified.',
  },
} satisfies Record<string, { title: string; introduction: string; sections: LegalSection[]; review: string }>;
