# Homepage review

Branch: feature/home-plain-english. Review branch only; no production deployment.

## What changed

The homepage leads with time back, keeps AI-help and app-idea discovery links, shows three featured products, explains Clint and Sheree's approach, and links to a free beginner guide. All 12 products remain accessible on /work with their existing detail interactions. Decorative lottery numbers were removed from the catalog card.

The guide is at /resources/try-ai-this-week. It has Article metadata, prerendered HTML, and a sitemap entry. The recently published Headwaters navigation, Continuum page, Resources catalog, services, and portal are preserved.

The shared service form now also serves the homepage. It accepts email or phone, retains details after errors, prevents repeated clicks, reuses a request ID for unchanged retries, and requires HTTP success plus matching accepted/requestId JSON before claiming receipt. It does not subscribe visitors to marketing. Before JavaScript loads, controls are disabled to prevent accidental native form submission.

The existing uncommitted discovery UI and its two supporting libraries were carried into this branch because the homepage links depend on them. Unrelated local portal, greenhouse event, backend workflow, and other edits were not bundled. The branch was reconciled with remote main bf198c7.

## Local review

Run npm ci, then npm run dev -- --port 4004 --strictPort --host 127.0.0.1.

- Home: http://127.0.0.1:4004/
- Guide: http://127.0.0.1:4004/resources/try-ai-this-week
- Full catalog: http://127.0.0.1:4004/work
- Shared form: http://127.0.0.1:4004/services/#service-contact
- Discovery: http://127.0.0.1:4004/ai-help?src=homepage and /app-idea?src=homepage

For a safe form submission, run node scripts/home-contact-preview.mjs and open http://127.0.0.1:4005/#contact-form. Use fictional details. The first request fails after a delay; unchanged retry succeeds. Double-clicking must create one request per attempt. Terminal logs show request IDs, not contact details. This mock has no persistence or forwarding. Restart it to reset the sequence. The banner identifies the mock, and its client flag is honored only in development. The mock does not test production delivery.

## Delivery boundary

Online sending is intentionally disabled by default. The existing discovery endpoint setting VITE_SAGE_DISCOVERY_CONTACT_URL is reused, with VITE_HOME_CONTACT_ENABLED=true as an explicit activation gate for the shared form. These are configuration values, not credentials. No secrets belong in client settings.

The existing intro_contact_request / ai-help contract receives source=homepage-contact on home and website:<pathname> elsewhere, contactMethod=email or callback, contact details, context.business/context.task, the message, website honeypot, marketing=false, and a UUID requestId. No new backend is introduced.

Before enabling delivery, separately authorize and verify the deployed endpoint's server-side validation, field limits, honeypot rejection, Turnstile or equivalent server-enforced abuse controls, CORS/origin handling, durable duplicate handling, and matching acknowledgement after durable acceptance. The client honeypot and flag alone are not spam protection. Turnstile is not connected in this branch. The server must accept optional business names and email-only or phone-only contact. An unchanged retry must return the same accepted result without sending duplicate notifications. Do not point this form at the legacy generic webhook or Sage chat endpoint.

Production endpoint, storage, notifications, and genuine Sage replies were not verified or changed. Missing discovery configuration shows an honest unavailable state. Email links open a draft; they never count as a submitted request.

## Validation

Run npm run lint, npm run build, node --test scripts/home.test.mjs scripts/ai-help.test.mjs scripts/discovery.test.mjs scripts/portal.test.mjs scripts/guided-portal.test.mjs, and npm run audit:html.

The homepage review workflow runs these checks on the review branch and pull requests. It has no deployment steps or secrets. Production deployment remains restricted to main/manual dispatch and was not triggered.

## Verification recorded

Build, lint, 19 Node tests, and the HTML audit (20 sitemap pages) passed after integration. Browser checks covered desktop and 390×844 mobile layouts, no horizontal overflow on home/services, contact anchors, guide navigation, keyboard opening of SpectIQ details, both discovery routes, and the honest missing-chat fallback. The shared local form mock showed failed delivery retaining text, then success only after a matching acknowledgement. Two double-click attempts produced exactly two requests with the same ID. No live submission was made.

The build reports the existing large main-bundle warning. npm reports four dependency advisories from the existing lockfile (one moderate, three high); dependency upgrades were outside this change.

## Changed files

- .github/workflows/home-review.yml
- README.md
- docs/homepage-review.md
- scripts/ai-help.test.mjs
- scripts/audit-html.mjs
- scripts/discovery.test.mjs
- scripts/home-contact-preview.mjs
- scripts/home.test.mjs
- src/App.tsx
- src/components/Contact.tsx
- src/components/Hero.tsx
- src/components/HomeSections.tsx
- src/components/MarketingPages.tsx
- src/components/SageDiscovery.tsx
- src/components/SageSheet.tsx
- src/components/ServiceContactForm.tsx
- src/components/cards/ShanesRetirementFundCard.tsx
- src/homeContent.ts
- src/lib/aiHelp.ts
- src/lib/discovery.ts
- src/lib/homeContact.ts
- src/pages/CardLanding.tsx
- src/pages/Resources.tsx
- src/pages/TryAiGuide.tsx
- src/resources.ts
- src/seo.ts

## Follow-up: deals, printable guide and footer

The hero now connects less busywork with quicker replies and timely follow-ups. The next section focuses on keeping good opportunities from going cold, without a guaranteed sales claim.

The supplied four-page PDF is preserved byte-for-byte at /downloads/try-ai-this-week.pdf. The blue, white-text lower-right guide card opens it directly in a new tab, is dismissible, and hides while the contact form or footer is visible. The online guide also links to the printable PDF.

The shared main-site footer now includes services, company navigation, resources, the guide, client login, contact email, and Terms/Privacy draft links. There were no existing legal pages in the inspected repository history. At the user's request, /terms and /privacy contain substantive review drafts, visibly marked unapproved, with unresolved facts listed. They are prerendered but noindex and excluded from the sitemap. They must not be treated as approved legal policies. No production deployment is authorized by this update.

The privacy draft follows the observed site code and avoids inventing provider, retention, training, cookie, or sale/sharing promises. Review background: https://www.ftc.gov/business-guidance/privacy-security/consumer-privacy and https://www.ftc.gov/business-guidance/resources/protecting-personal-information-guide-business-0 . Production data handling still needs a business/legal review.

Additional files: src/components/FloatingAiGuide.tsx, src/components/Footer.tsx, src/pages/LegalDraft.tsx, src/legalContent.ts, public/downloads/try-ai-this-week.pdf. Updated homepage copy, guide, routes/SEO, tests and this handoff are included in the same review branch.
