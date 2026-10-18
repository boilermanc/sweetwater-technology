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
- Cloudflare rate rule Sweetwater booking endpoints: 20 requests per 10 seconds per IP, block 10 seconds; matches the availability, create and manage production booking webhook paths on n8n.sproutify.app. Rule ID 86ce186a9a4f467d92da1a339923dd83.
- Trellis credential Sproutify Trellis is bound to Claim booking slot. Migration 20261016194928_sweetwater_booking_claims.sql lives in the Trellis repository. The private table permits service-role SELECT/INSERT only; public roles have no access.
- GitHub production build variables: VITE_BOOKING_ENABLED=true and VITE_BOOKING_TURNSTILE_SITE_KEY set to the public key above. Existing portal deployment configuration must be preserved.
- Build and Deploy Sweetwater Technology deploys main pushes or an explicitly dispatched branch through IONOS SFTP. Homepage review checks only validate the feature branch.
- Resend domain sweetwater.technology is verified. Existing IONOS mail records remain in place. Booking requests Google Calendar invitations. The Resend confirmation branch is live (creation version 4ff41dea), bound to Sweetwater Booking Resend. Delivery to the owner inbox was verified on 2026-10-16 with SPF, DKIM and DMARC passing. It does not generate Google Meet links. The page states that call details follow separately.

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

## Sweetwater confirmation email

The branch runs after Return public response, so email failures do not change a confirmed booking. It rereads Google and verifies the event identity, request, recipient, name, topic and times. Only confirmed events created within 23 hours without a sweetwaterConfirmationId marker are eligible. HTML escapes visitor input; plain text is included. Free-text topics are excluded from email. Sender and reply-to are team@sweetwater.technology.

Bind Send Sweetwater confirmation to the encrypted Sweetwater Booking Resend Header Auth credential: Authorization header, Bearer token entered by the owner, requests restricted to api.resend.com. Use a Sending access Resend key scoped to sweetwater.technology. Never store it in files or output.

Resend requests use a stable sweetwater-booking/<eventId> idempotency key, up to three attempts with one-second delays and ten-second timeouts. After a valid Resend API acknowledgement, Google stores its message ID in private extended properties with sendUpdates=none and the observed event ETag (If-Match), preventing a concurrent booking change from being overwritten. This marker indicates accepted for sending, not delivered. Resend delivery logs or the recipient inbox are required to verify delivery. A timeout or rejected send leaves the marker unset; reusing the same booking request can retry within 23 hours. The cutoff prevents duplicate uncertain sends after Resend’s 24-hour key expiry. Older unresolved sends require operator reconciliation. There is no background delivery-retry queue or bounce webhook yet.

Recovery: restore the previous published workflow version to remove only the confirmation branch; appointments and existing Google invitations remain intact. The original workflow was downloaded before editing. Do not clear booking claims to retry email.


## Self-service booking management (live, 2026-10-16)

The Trellis migration 20261016213929_sweetwater_booking_management.sql is applied with owner approval. Rollback-only tests passed for reschedule, cancellation, incorrect tokens, concurrent operations, verified abort and service-role enforcement. Rollback-only tests left no records. Live disposable booking audit records remain cancelled, with no pending operations or slot claims. The Trellis SQL_SCHEMA includes this migration.

The deployed site adds /book/manage (noindex, nofollow; excluded from sitemap). Confirmation emails register a private token and put the booking ID/token in the link fragment, never query parameters. Guests explicitly confirm changes; opening a link only views the booking. Treat links as bearer credentials: never log or share them. Registration failure falls back to the existing reply-for-help email.

Generate with node scripts/build-booking-management.mjs. The management workflow is published with owner approval at https://n8n.sproutify.app/workflow/4vpSIcnTmBsjoLXTq6pwL (version 0a127769). It uses existing Google and Trellis credentials. Imports do not apply settings: disable successful, failed and manual execution retention and progress retention; set a 90-second timeout. The existing Cloudflare booking rate rule now includes /webhook/sweetwater-booking-manage, verified Active with its original threshold.

POST requests require the private token. Public responses expose only booking ID, time, status and operation ID. A new operation reserves the target while retaining the old claim. Google PATCH uses the observed ETag (If-Match), preserves private properties and requests invitation updates. Readback must match the operation marker and status/time before the service-only finish RPC releases the old claim. Retries reuse the same operation ID. The same link works after rescheduling.

Known busy targets are rejected before reservation. If a conflict appears afterward, or a write is uncertain, retain claims and retry the exact operation. Never automatically expire reservations. Guests who close the page during an uncertain change may need operator help. To reconcile manually, ensure no execution is running or capable of writing late, then read the exact Google event and operation. Finish only a verified applied operation; abort only a definitively unchanged event after excluding delayed writes. Never bulk-clear records or claims.

Activation order: verify the draft and rate rule, publish with approval, test a disposable appointment through reschedule/cancel and restored availability, deploy the management page, then publish the creation-email link branch. Existing emails do not gain links retroactively. To roll back, restore the previous creation workflow to stop new links. Retain management for already-issued links unless disabling them is intentional. The page deployed from commit 9f327f4 through production run 38975264331; creation version 4ff41dea now includes the email links. The temporary manual test workflow was archived after verification.

Verification: database rollback tests; generated workflow with mocked Google/Trellis (including timeout-after-write and failed readback); strict browser response matching; 49 passing tests; build/lint/HTML audit. The live endpoint rejects invalid links (404), malformed requests (400), and unapproved origins (403). A disposable appointment successfully rescheduled and cancelled; both times reopened, with 28 total open slots. Cancellation retry returned the same success. The real reschedule retry exposed a preflight issue; the corrected version includes full-workflow regression coverage. A confirmation reached boilermanc@gmail.com with the private link. The live page rescheduled the disposable booking using keyboard navigation, then cancelled it; the same-operation reschedule retry returned the same confirmed result. Both test times reopened and October 22 remained blocked. The page was inspected at an 843px viewport without horizontal overflow; a dedicated narrow mobile viewport was not available. Browser access to the isolated local preview was blocked. CI and production HTML audit passed.

## Reschedule and cancellation emails (live, 2026-10-18)

Management version 5753a542 adds a Resend branch after Return management response. It sends only after a matching successful mutation response and a fresh Google readback with the same operation marker and expected status/time. Views, failures, stale operations and mismatched events cannot send. Recipient/name come from the verified event's private booking properties; free-text topics are omitted. No new database schema or credentials were added.

Reschedules include the previous and new Eastern appointment times and the existing private management link. Cancellations identify the cancelled time and link to /book for a new appointment. Both include plain text, escaped HTML, and the existing team@sweetwater.technology sender/reply-to. Google invitation updates continue separately.

Resend uses sweetwater-change/<operationId> as a stable idempotency key, three attempts and ten-second request timeouts. Retries are allowed only within 23 hours of operation creation, inside Resend's 24-hour deduplication window. Sending is after the public response, so an email error does not undo a confirmed calendar change. There is no background retry queue; an unresolved send older than this window requires operator reconciliation. No email receipt is written back to cancelled calendar events.

Verification: all 53 automated tests and lint passed. A disposable booking for boilermanc@gmail.com was rescheduled and cancelled through the production management endpoint. Both branded emails were delivered in Resend and found in the recipient inbox with matching operation references. Repeating each operation returned 200 with the same result and produced only one email per operation. Both test slots reopened (32 available); October 22 remained blocked. The temporary manual test workflow was archived. Cancelled management audit records remain; no active test appointment remains.

Recovery: restore management version 0a127769 to remove only this email branch while preserving self-service changes. A pre-change workflow export is available locally. No website redeployment is required for this workflow-only update.
