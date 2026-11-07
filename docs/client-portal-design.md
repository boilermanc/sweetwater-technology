# Sweetwater client portal in Trellis

Sweetwater uses the existing Trellis project (`horvjqqifgrzxesuxtfm`). There is no separate client project or additional subscription.

## Sign-in and permissions

Everyone visits https://sweetwater.technology/portal and requests an emailed code. Clients have Auth role `sw_portal_client`; this Postgres role does not inherit `authenticated`, `anon`, or staff access. Only the authenticated admin provisioning endpoint assigns that role. User-editable metadata never grants authorization.

Clint and Sheree remain the only active `sw_portal_members`; their approved email-only sign-in remains enabled. Staff can use guided discovery, engagement records, SignalScout, and Client access.

Client accounts can SELECT only `sw_client_projects` and their own `sw_client_project_access` rows. RLS additionally requires a live assignment and `published=true`. They cannot write projects, grant themselves access, read staff tables/RPCs, or access private storage. Removing an assignment or unpublishing prevents the next fetch even with an existing JWT. The UI refreshes on focus and every minute; previously viewed information cannot be recalled.

## Sharing a project

1. Save an engagement in Guided discovery or Engagement records.
2. Open **Client access** and choose the engagement.
3. Write the client-visible title, stage, progress update, next step, and optional target date.
4. Select **Publish for assigned clients** and save.
5. Add the client's email. Ask them to visit the portal and request an emailed code.

Adding access does not send an email automatically. Existing internal Auth accounts cannot be converted to clients. Multiple emails can be assigned to a project; one client can have multiple assigned projects. Remove access per project using **Remove access**.

Client updates are explicitly curated snapshots. Internal discovery answers, evidence, costs, fees, approval notes, and Scout data are never copied automatically. Clients currently have a read-only project view; no uploads, messaging, billing, or client approvals are implied.

## Backend

Schema migrations live in the Trellis repository:
- `20261107203137_sweetwater_client_isolation.sql`
- `20261107204441_sweetwater_client_enrollment_guard.sql`

`sweetwater-client-access` verifies the live user and existing staff access helper before provisioning or assigning an account. Its enrollment marker only suppresses Trellis/marketing enrollment; the server-set Auth role controls access. Supabase applies the requested role after inserting the Auth row, which is why the enrollment trigger also checks this non-authorizing marker.

Fourteen internal service-role Edge handlers now require an active Trellis staff identity, an authorized Sweetwater staff identity, or the exact service-role worker credential before handling requests. Existing stronger endpoint checks remain in place. Worker integrations must supply their service credential server-side.

## Verification and recovery

Live tests cover real email-OTP verification, client provisioning, two-client isolation, private table denial, client write denial, ordinary nonmember denial, publishing, revocation with unchanged JWTs, and 18 internal endpoint denials. Temporary test accounts, memberships, projects and their audit fixtures are removed afterward. No test email is sent.

The portal build, lint, and existing 13 portal tests pass. Browser checks cover the client page at desktop and 390px width. Production staff navigation is verified after release.

If the UI needs recovery, redeploy the preceding site commit. Keep the database restrictions and endpoint protections: reverting those would reopen internal access. To temporarily disable clients, unpublish shared projects or remove assignments. Do not convert their role to authenticated. Before/after deployment manifests for the hardened handlers are retained in the local client-isolation release artifact for review; restoring a vulnerable manifest is not a safe client rollback.

Google Places search in SignalScout still needs the new API key; manual prospect tracking remains available.
