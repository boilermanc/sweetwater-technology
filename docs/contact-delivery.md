# Website contact delivery

The shared home/services form uses the existing Website Contact Capture workflow (`tXl1IzKp4g5Kzp1aLbVps`) and the existing Trellis inquiry queue. It does not create a second intake backend. Lead Email Alerts (`rPHbi13hY557tAqgb-NsF`) sends only to **boilermanc@gmail.com**, from `Sweetwater Technology <team@sweetwater.technology>`. Email inquiries set Reply-To to the visitor; phone-only inquiries remain supported. No marketing subscription is created.

## Contract and security

Set `VITE_HOME_CONTACT_ENABLED=true` and the existing public `VITE_BOOKING_TURNSTILE_SITE_KEY` for production. The shared widget uses action `sweetwater-contact`; booking retains `sweetwater-booking`. The default contact webhook is defined in `src/components/ServiceContactForm.tsx`; `VITE_HOME_CONTACT_URL` can override it. Never put a Turnstile secret or service credential in Vite settings.

The backend validates origin, UUID, field types and limits, honeypot, contact method, and intent before verifying Turnstile action and hostname. It saves the canonical `intro_contact_request` / `website-contact` payload with `context.summary` through `capture_sweetwater_inquiry`. Security tokens are excluded from the durable payload so a refreshed token does not invalidate an unchanged retry. The existing database function atomically saves the inquiry and queues its notification, rejects conflicting reuse of a request ID, and limits inquiries per identity.

The form preserves entered text on failure, disables repeated submission while pending, and requires an HTTP success plus `accepted: true` and its exact request ID before displaying receipt. Receipt means durably queued, not email delivery. The notification worker claims queued messages every minute, uses the inquiry request ID as its Resend idempotency key, records provider results, and retries transient failures within the existing retry window. Monitor terminal failures; a saved inquiry must not be silently lost.

Workflow exports are in `n8n/contact/`. Regenerate contact capture with `node scripts/build-contact-workflow.mjs`. Credential references in exports identify existing n8n credentials; no secret values are stored. Production execution-data retention was set to None for successful, failed, and manual runs in both workflows. Importing workflow JSON may not apply these settings: verify them in the editor before publication.

## Verification and recovery

Run `npm run lint`, `npm run build`, `node --test scripts/*.test.mjs`, and `npm run audit:html`. Use `node scripts/home-contact-preview.mjs` at port 4005 for an isolated first-failure/second-success test. That mock never forwards or saves messages. Use fictional details. It verifies retained fields and matching acknowledgements, not real delivery.

For production verification, submit a clearly labeled test through the real form, then check the matching inquiry notification status and recipient mailbox. A provider acceptance alone does not prove inbox receipt. Do not bypass Turnstile for a production test.

Rollback: disable the contact flag and redeploy to restore the explicit email fallback. Restore the previous n8n published version if backend behavior must be rolled back. Preserve saved inquiries and their notification state; do not clear the queue as part of a frontend rollback. The pre-change workflow exports were downloaded before publication. No database schema or credential change was needed for this release.

## October 18 content refresh

Home, Services, AI services, and About share the business-owner voice and navigation. Home leads with practical AI and focused proof, followed by everyday outcomes and the greenhouse story. Work has type filters and excludes personal/family projects while retaining existing detail interactions. LaneWise and SpectIQ use screenshots of their public websites, labeled accurately; Sproutify Farm retains its farm photograph rather than exposing private app data. Headwaters includes the beginner guide, whose canonical route remains under Resources. Legal pages remain drafts pending the inquiry-retention decision and remaining policy review.

The live contact test on October 18 confirmed the form acknowledgement and delivery to Clint’s Gmail inbox, with no other recipients. The follow-up consistency pass aligns contact ownership, booking labels, AI capitalization, and public product wording. The supplied postal address is recorded in both legal drafts; no retention period has been assumed.
