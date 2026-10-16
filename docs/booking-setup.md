# Sweetwater booking operations

## Configuration

The /book picker uses the two published n8n workflows:
- Availability: https://n8n.sproutify.app/workflow/Y7Iazpa_XYBBoFUNd3vU1
- Create booking: https://n8n.sproutify.app/workflow/b-JEjb62iB9wMDPwUMtdr

n8n/booking/config.json is the authoritative schedule: Tuesday and Thursday, 10am–noon America/New_York; 20-minute calls, 10-minute buffer, 24-hour notice, 30-day horizon. Sweetwater Calls receives bookings; its busy periods and boilermanc@gmail.com personal busy periods block slots. Only open slots are returned publicly.

Run node scripts/build-booking-workflows.mjs after changes to configuration or core.mjs. Generated imports are disabled and contain no credentials. Import into an empty intended canvas, bind credentials, enable the validation/availability guard, then publish after verification. Clipboard imports do not apply workflow settings; configure those separately. Current production workflows retain no successful, failed, or manual executions. Creation has a 90-second timeout.

## Services and deployment

- Google Cloud project sweetwater-booking: Calendar API enabled, OAuth app In production. Owner reconnected Google on 2026-10-16 after the status change. n8n uses Google Calendar account for all Google HTTP nodes.
- OAuth callback: https://n8n.sproutify.app/rest/oauth2-credential/callback
- Cloudflare Turnstile widget Sweetwater Booking: Managed, hostname sweetwater.technology only, no pre-clearance. Public site key 0x4AAAAAAFYv6L2Bv43OoITD. The owner-entered secret is in encrypted Custom Auth credential Sweetwater Booking Turnstile, restricted to challenges.cloudflare.com. Never put secrets in repository files.
- Cloudflare rate rule Sweetwater booking endpoints: 20 requests per 10 seconds per IP, block 10 seconds; matches only the two production booking webhook paths on n8n.sproutify.app. Rule ID 86ce186a9a4f467d92da1a339923dd83.
- Trellis credential Sproutify Trellis is bound to Claim booking slot. Migration 20261016194928_sweetwater_booking_claims.sql lives in the Trellis repository. The private table permits service-role SELECT/INSERT only; public roles have no access.
- GitHub production build variables: VITE_BOOKING_ENABLED=true and VITE_BOOKING_TURNSTILE_SITE_KEY set to the public key above. Existing portal deployment configuration must be preserved.
- Build and Deploy Sweetwater Technology deploys main pushes or an explicitly dispatched branch through IONOS SFTP. Homepage review checks only validate the feature branch.
- Resend domain sweetwater.technology is verified. Existing IONOS mail records remain in place. Booking currently requests Google Calendar invitations; it does not send Resend confirmations or generate Google Meet links. The page states that call details follow separately.

## Booking integrity and cancellation

Only a new, matching database INSERT permits event creation. Unique slot and request-ID constraints prevent competing claims; conflicts or uncertain writes read Google to confirm and never blindly create another event. Google event IDs are stable per request (5a followed by the UUID without hyphens), allowing a manually released slot to be booked again after cancellation. A matching saved event, request ID, time, and duration are required before the browser shows success.

Claims never expire automatically. Before manually releasing a failed or cancelled claim, verify the exact Google event and request ID, ensure no request is still running, and reconcile or cancel the event. Delete only the matching claim using the Trellis Switchboard connection with operator authorization. Never upsert or bulk-clear claims. Availability reads Google busy windows; an unresolved claim can still appear open until reconciled, but creation fails closed.

## Verification (2026-10-16)

- Calendar reads returned 32 open slots. Invalid security tokens returned 400, unapproved origins 403, and browser preflight 204.
- A local browser completed real Turnstile against an isolated copy of the production workflow. The claim INSERT, Google create, Google readback, and matched browser confirmation succeeded. Test event 5asfmv2 was then deleted (204) and its exact claim removed. The slot returned to availability. The intended guest-removal override did not persist: the event contained only fictional test@example.invalid; sendUpdates=none was verified. No actual invitation delivery was tested.
- The temporary localhost widget hostname was removed and the test workflow archived. Production hostname validation was never relaxed.
- Request-based event IDs were then covered by regression tests and published as creation version 10985c8c. Availability version 047bad2a.
- Mock failure/retry preserved form details and the same request ID. Database rollback tests verified duplicate-slot/request rejection and private access; generated workflow tests verified the claim gate. No parallel live booking load test was performed.
- Desktop and 390px mobile layouts and keyboard navigation were inspected. Booking entry points cover header/mobile menu, footer, homepage, About, service/work contact sections, guide, and card/AI-help/app-idea call buttons.

Run npm run lint, npm run build, npm run audit:html, and node --test scripts/*.test.mjs. Run with VITE_BOOKING_ENABLED=true to verify the picker build; omit it to verify the fallback build. The local mock is node scripts/booking-preview.mjs and never writes appointments or sends email.

## Recovery

Set VITE_BOOKING_ENABLED=false and redeploy to return to the existing request-call fallback. Unpublish the two workflows if endpoint rollback is needed. These steps do not cancel existing events or remove claims. Do not change existing IONOS DNS or unrelated workflows during rollback.
