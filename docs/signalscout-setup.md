# SignalScout in the Sweetwater portal

Release status October 21, 2026: database migration and Edge Function v1 are deployed. The scoped website build is verified; commit, push and publication were authorized on October 26, 2026.

After activation, Clint and Sheree sign in at `/portal`, complete the existing
authenticator check, and select **SignalScout** from Saved clients or Engagement
records. The tool shares the portal session, active membership and MFA requirement.
No new accounts or separate passwords are introduced.

## What is implemented

- Shared prospect queue, manual entry, status and owner, working notes, next action,
  tags, revenue verification, score adjustment, archive/restore, and review history.
- Optimistic concurrency uses a database-managed revision. Conflicting/failed saves
  retain the draft. Creates have a stable UUID so retrying does not duplicate records.
- Google Places Text Search (New) runs server-side. The browser never receives the
  key. It limits combinations to eight, returns at most 40 candidates, deduplicates
  place IDs, supports website/rating/brand filters, preserves attribution, and
  distinguishes no results from provider failures. Review and save adds a candidate
  to the shared queue; searching alone does not insert prospects.
- The new integration uses **directory evidence only**. Automatic website fetching
  from the export is deliberately not connected: its URL guard did not cover all
  private addresses or DNS rebinding and read responses without a byte limit.
  The UI says websites have not been scanned, confidence is low, and cues require
  manual verification. Existing deterministic scoring rules remain; no AI model is
  called and the score is not a revenue estimate or probability.
- The first screen shows the shared queue even when the directory key is missing.
  Search stays disabled with an explanation, while manual entry remains usable.
- No public SignalScout route, private browser-local record storage, deletion API,
  exported source-package runtime, or external login is added.

## Verified existing backend

Switchboard resolves Sweetwater to Trellis (`horvjqqifgrzxesuxtfm`), read-only for
schema work from this repository. `sproutify-trellis` is the migration authority.
Read-only management checks on October 21 confirmed active Clint and Sheree portal
memberships, email auth and TOTP enabled, and these allowed redirects:

- `https://sweetwater.technology/portal`
- `http://127.0.0.1:4014/portal`
- `http://localhost:4014/portal`

No configuration was changed. MCP returned HTTP 429, so the read-only fallback used
the same registered connection's management credential without displaying it.

## Activation sequence

1. Apply only the reviewed Trellis migration
   `20261021220449_sweetwater_signalscout.sql`, after local PostgreSQL verification.
   It adds three isolated `sw_signalscout_*` tables, member/MFA RLS, restricted column
   grants, audit triggers, and an atomic search reservation RPC. It changes no
   existing Trellis or portal policy and deletes no data. JSON payloads are not
   queried by content, so no unused GIN indexes are added.
2. Deploy only `supabase/functions/sweetwater-signalscout` through Switchboard with
   JWT verification enabled. The handler additionally verifies the user with Auth
   and calls a caller-scoped membership/MFA RPC. No service-role client is used.
   Quotas are 20 searches per member per hour and at least 10 seconds between them.
3. Build the website with `VITE_PORTAL_SUPABASE_URL`, a publishable
   `VITE_PORTAL_SUPABASE_PUBLISHABLE_KEY`, and `VITE_PORTAL_AUTH_READY=true` after
   rechecking redirects. These are wired to GitHub Actions repository variables.
   No credential values are checked in. Preserve unrelated working-tree changes;
   do not publish the entire dirty checkout without reviewing release scope.
4. Publish the scoped website build to the existing Sweetwater IONOS target. No
   commits or pushes are authorized by this implementation. Preserve the prior
   static release for recovery. Verify the live page before inviting real use.
5. In Google Cloud, enable Places API (New) on a billing-enabled project, create a
   server-side key restricted to that API, and set an appropriate usage quota/budget.
   Store it only as the Edge secret `SWEETWATER_GOOGLE_PLACES_API_KEY` using a secure
   local or dashboard input. Do not paste it into chat or a frontend `VITE_*` setting.
   The user chose preparation for a new key; no key was created or configured here.
   Review Google's provider terms/attribution and retention requirements before
   enabling real directory searches.
6. Verify real email sign-in, MFA, both-account shared reads/edits, sign-out, and
   nonmember denial against the deployed backend. These are not replaced by the
   local fixture or simulated database identity tests.

Reference: [Google Text Search documentation](https://developers.google.com/maps/documentation/places/web-service/text-search),
[Supabase function auth](https://supabase.com/docs/guides/functions/auth).

## Validation and recovery

Website: `npm run build`, `npm run lint`, and
`node --test scripts/signalscout.test.mjs scripts/portal.test.mjs scripts/guided-portal.test.mjs`.
Trellis: `deno check supabase/functions/sweetwater-signalscout/index.ts`,
`deno test supabase/functions/sweetwater-signalscout/handler_test.ts`, and
`node tests/signalscout-sql.mjs <installed-pglite-dist/index.js>`.

The SQL suite uses an isolated in-memory PostgreSQL engine with stub Auth roles;
it applies the schema twice, checks shared reads/updates, audit writes, protected
columns, validation, conflicting revisions, rate limits, MFA and nonmember/inactive/
anonymous denial. It makes no remote writes. Website tests and six endpoint tests
passed. Browser fixture verified failed-save retention/retry and conflict handling;
the mobile editor was inspected at 390px with no horizontal overflow. The fixture
is under `scripts/fixtures/` and is not a production build entry.

Rollback: restore the previous static website and disable/remove the new Edge
Function if necessary. Retain the additive tables and saved records. Access can be
revoked through existing membership controls under separate authorization. Do not
drop the prospect or audit tables as a routine rollback.

## Production verification on October 21

Migration recorded as 20261021220449; the local migration filename matches the remote history. All three tables have RLS enabled. A rolled-back production transaction verified Clint creation, Sheree shared editing, revision increments and audit history. An aal1 session saw no prospects, and no verification records remained. The deployed JWT-protected endpoint returns HTTP 401 without authentication.

The isolated website release is based on live commit 0878d8913c3ecb6a3753f3780d577d30c91f4b4b. It includes only the two portal navigation files, four SignalScout files, the model test, this document, and the existing workflow test command. Existing production secret-based portal settings are preserved. Build, lint, 13 tests and the 21-page HTML audit passed; production dependency audit reports zero vulnerabilities. Real two-person browser login remains unverified. Google search awaits its new server-side key.
