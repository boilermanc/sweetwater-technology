# Sweetwater team portal

Release status (October 16, 2026): shared guided-answer saving and Trellis migrations are ready. The production redirect https://sweetwater.technology/portal is verified and production build configuration is enabled. Release validation passed; first-user email verification and authenticator enrollment must be completed by each user. Historical development notes below describe earlier states.

The latest agreed direction is a private `/portal` inside the existing Sweetwater website, using its branding and Trellis's existing Supabase project. Only Clint and Sheree sign in. The earlier separate Codex Site, dedicated database, and client-login directions are superseded.

## Implemented locally

- Branded sign-in screen, Supabase magic-link client with account creation disabled, database membership check, sign-out, and failure states.
- Shared engagement list with search, stage filters, Lite/Full tracking, next owner/date, proposal and findings drafts, approval references, evidence references, internal pricing and effort totals.
- Optimistic concurrency protects against silently overwriting another editor. Server-managed columns are never submitted.
- `/portal` has a prerendered entry, noindex metadata, and is excluded from the sitemap. These are indexing controls, not authorization.
- No browser-local engagement storage or sample client records.

## Backend ownership and release prerequisites

Switchboard resolves `sproutify-trellis` to `horvjqqifgrzxesuxtfm`. The Trellis repository owns migrations. The Sweetwater repository now has a read-only default binding to that same connection with migration authority disabled.

Applied migration: `sproutify-trellis/supabase/migrations/20261015185106_sweetwater_portal_workspace.sql`, included by that repository's master schema. The original CLI-generated file was renamed to match the server-assigned applied version without changing its SQL. It creates separate `sw_portal_members`, `sw_portal_engagements`, and `sw_portal_audit` tables, membership-based RLS, restricted column grants, server timestamps, and an append-only application audit trail. No existing tables or policies were altered. The two authorized Auth accounts were separately created through the Admin API without passwords or email invitations, then granted active portal membership. Email ownership remains unconfirmed until first sign-in.

Before activation:

1. Completed with explicit user approval on October 15, 2026: migration application and both accounts. Before application, ran the migration twice inside a rolled-back transaction. After application, `sproutify-trellis/tests/sweetwater-portal.sql` passed member create/read/update, shared access, nonmember/anonymous denial, membership self-edit denial, protected column denial, audit writes, stale updates, negative-fee rejection, and MFA enforcement. All test records rolled back; two memberships and no engagement/audit records remained. Security advisors reported no portal-specific findings.
2. Review shared-project exposure: live inspection found several existing Trellis policies granting broad authenticated access. Separate portal policies protect portal records from other users but do not restrict a portal account's access to other Trellis tables. Do not add client accounts to this shared project without resolving that boundary. Do not change unrelated policies as part of this feature without approval.
3. Completed for `clint@sweetwater.technology` and `sheree@sweetwater.technology`. Membership uses immutable Auth user IDs, not user-editable metadata. No invitations were sent. Users must verify their own email and enroll their own authenticator.
4. Required user action: add `http://127.0.0.1:4014/portal` and `http://localhost:4014/portal` to Trellis Auth Redirect URLs while keeping existing entries. The registered credential can manage data/accounts but the configuration API returned HTTP 403, missing `project_admin_write`; no redirect changes were applied. Existing SMTP, email auth, and TOTP enrollment/verification are enabled. Production callback setup remains deferred until deployment is authorized. Verify PKCE completion in the same browser and email expiry/replay behavior after configuration.
5. The preview process receives `VITE_PORTAL_SUPABASE_URL` and `VITE_PORTAL_SUPABASE_PUBLISHABLE_KEY` in memory. Only a publishable `sb_publishable_` key is accepted; never use a service-role key. The preview launcher reads existing settings and sets `VITE_PORTAL_AUTH_READY=true` only after both exact local callbacks are present. Until then, sign-in stays disabled. No API credentials were saved to repository files. Future production build configuration remains pending deployment approval.
6. Verify the implemented MFA enrollment/challenge flow and the migration's `aal2` requirement before storing client data. Enrolling a factor affects the shared Supabase identity, including other sessions.
7. Verify the full two-person flow in a browser at desktop and mobile widths, including keyboard access, sign-out, expired sessions and cross-user saves. Obtain deployment approval and preserve a prior artifact for rollback.

## Deferred from the original brief

This first increment is not the full assessment product. File upload/private storage, automatic retention cleanup, versioned client-facing proposals and findings, PDF exports, automated stage gates, Stripe integration, an audit-log viewer, a value calculator, per-stage time entries, and client access remain unimplemented. A retention date is a recorded agreement, not an active cleanup job. Approval references record external evidence; an internal stage edit is never a client signature. Pricing fields start unpriced; no offer name, fee, role defaults, legal terms or business outcome claims have been invented.

## Verification

Use the repository's `npm run build` and `npm run lint`, then `node --test scripts/portal.test.mjs`. The unit checks cover pricing arithmetic, invalid submissions, stripping protected fields, and private-route indexing. They do not establish live RLS or authentication correctness.

Results: production build, lint and all four portal tests passed, including after the database setup. Chrome inspection verified the login state at desktop size and 390px mobile width. The app returned HTTP 200 locally. The embedded Codex browser repeatedly timed out at its browser-control layer for both localhost and 127.0.0.1; the same page was verified in Chrome. Auth requests now have a 15-second timeout. Database policies were verified in rolled-back SQL tests, but actual email sign-in, MFA enrollment and the signed-in UI still require the callback configuration and user sign-in. The production build retains an existing main-bundle size warning.

Files changed in the website: `src/portal/` (UI, styles, client and model), `src/App.tsx` (route), `src/seo.ts` (private-route metadata/prerender), `package.json` and lockfile (pinned Supabase SDK), `scripts/portal.test.mjs`, this guide and the README link. Trellis changes are only the new migration and its import/interpolation in `constants.ts`. Pre-existing work in both repositories was preserved.

Database writes and account setup were explicitly authorized and completed. No invitations, commits, pushes, or website deployment occurred. To stop portal data access without deleting records, deactivate its two membership rows through an authorized administrative operation. Existing Trellis policies remain unchanged. The abandoned separate Sites starter is outside this repository in the chat's visualization workspace; it was not registered or published.

## Follow-up agreed October 15, 2026

Work paused at Clint's request before pushing. The local header now offers a Client Login dropdown linking to the shared portal login used by Clint and Sheree. Add Cloudflare Turnstile to the site's public submission and login flows when work resumes, including server-side token verification at the receiving services. Production redirects and auth configuration still need completion. An isolated release checkout was prepared at C:/Users/clint/Documents/Github/sweetwater-portal-release; no release commit or push was made.


## Guided discovery redesign — October 15, 2026

The portal now opens on a guided discovery walkthrough for signed-in members. Engagement records remain available from the header. For local design review without authentication, open `/portal?preview=guided` on the Vite development server. This preview entry is development-only; the production `/portal` route retains its existing authentication and MFA checks.

The walkthrough asks one question at a time, explains its purpose, and shows the current conversation path. Routes cover customer responses (with an additional phone-call branch), work tracking, inventory, app ideas, and uncertainty. Review shows the actual answers and a draft next step, with edit controls. Changing an earlier answer clears subsequent answers to prevent stale branch information from appearing in the brief. Re-selecting the same answer preserves progress.

This is a practice prototype: answers are component state only and are lost on refresh or leaving the walkthrough, including opening engagement records. Use fictional information. It does not save answers to Trellis or generate recommendations. Multi-model review is visibly labeled as future work; no AI services are connected. Persistence, later delivery-stage guidance, and Cloudflare Turnstile remain follow-up work.

Verification: build and lint passed; all seven portal/model tests passed. Chrome walkthrough verified nested branching, unsure answers, full review, editing an early answer to switch routes, and stale-answer removal. Desktop and 390px mobile layouts inspected; no horizontal overflow on mobile. No database changes, commits, pushes, or deployments were made for this redesign.

Changed files: `src/portal/GuidedWorkspace.tsx`, `src/portal/guided-model.ts`, `src/portal/guided.css`, the entry points in `src/portal/Portal.tsx` and `src/App.tsx`, `scripts/guided-portal.test.mjs`, and this document. Run `node --test scripts/guided-portal.test.mjs scripts/portal.test.mjs` with the normal build/lint checks.

Borrowed principles from the reviewed be-ambitious skill (without installing it): ask which decision the work supports; branch evidence collection into a real source/example or a person to ask; define an observable success check. Future model-review copy requires evidence, uncertainty, and a test, rather than treating model agreement as proof. Practice-only behavior is unchanged.


## Shared answer saving — October 16, 2026

This supersedes the practice-only limitation for authenticated members described above. The development preview remains unsaved practice.

After signing in with MFA, Clint and Sheree see a shared client list. Continuing a question saves its answer before advancing; Save progress saves without moving ahead. Reopening a client resumes the first unanswered question on its current branch, or opens review if complete. Existing engagements without guided answers start with their client name. The engagement editor does not submit the discovery field, preserving saved answers. Saved clients and engagement records share the same rows.

Saving requires a client name. The UI shows unsaved/saving/saved/error states, warns before leaving unsaved work, retains notes after failed saves, and disables editing while a save is pending. Updates require the previously read updated_at value. A conflicting or unconfirmed save never silently replaces another person's work: retain/copy unsaved notes, return to Saved clients, refresh, and reopen the latest record. Creates use a stable client-generated UUID so retrying an uncertain request cannot insert a second copy. No browser storage is used for real answers. Changing an earlier answer still clears later answers deliberately; saving commits that revised path.

Applied migration: `20261016112208_sweetwater_portal_answers.sql` in the Trellis migration-authority repository, included after the original portal schema in constants.ts. Adds discovery_answers JSONB with an empty-object default, object/string-value validation and a 100KB serialized limit; the UI leaves headroom at 90KB. Grants insert/update of answers and insert-only of UUID; existing RLS, MFA, audit triggers and protected update columns remain in effect. No existing records were deleted. No JSON-content queries are used, so no extra content index was added. Rollback can use the previous application while retaining the additive column and saved data; do not drop it to roll back the UI.

Verification: the migration and shared-answer SQL tests ran in a rolled-back transaction before application, then again after application. Clint insert, Sheree read/update, stale-update rejection, malformed-value rejection, audit entries and MFA denial passed. The original portal isolation suite also passed, including nonmember/anonymous denial. All test rows rolled back. Security advisors returned no portal-specific findings. Browser verification used a temporary in-memory test adapter (since sign-in activation remains deferred), confirming resume, manual save, save-on-continue, failed-save note retention and retry. The adapter was removed. These UI checks are not a complete authenticated browser-to-Trellis test.

Remaining activation: configure allowed sign-in redirects and production build variables, then verify real sign-in/MFA and cross-account browser use. No deployment, push, email, or credential change was made here.

Files for this increment: website `src/portal/SavedDiscovery.tsx`, `GuidedWorkspace.tsx`, `guided-model.ts`, `guided.css`, `Portal.tsx`, `scripts/guided-portal.test.mjs`, and this guide; Trellis migration, master-schema import and `tests/sweetwater-portal-answers.sql`.

## Production activation

The production build uses GitHub Actions variables VITE_PORTAL_SUPABASE_URL and VITE_PORTAL_AUTH_READY, plus the VITE_PORTAL_SUPABASE_PUBLISHABLE_KEY repository secret. Only the publishable key is bundled; management and service keys are never included. Auth site_url remains Trellis's existing URL; the explicitly allowed Sweetwater callback is used by the portal. Open the emailed link in the same browser that requested it. On first sign-in, scan the QR in an authenticator app and verify its six-digit code. No invitations are sent by deployment.

This release is based on main at 2614346 and includes only the portal and header entry, preserving unrelated in-progress website work. Validation: production build, lint, nine portal tests, HTML audit, and zero production dependency audit findings. Existing development dependency audit findings remain outside this release. Rollback: revert this portal release commit and push main through the existing deployment workflow; retain additive database columns to preserve saved records. Turnstile and multi-model integration remain deferred.
