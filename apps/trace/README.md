# Trace

Trace is Sweetwater’s private discovery workspace for `trace.sweetwater.technology`. Stage 1 uses fictional records for Alder & Pine Painting and Juniper Room Salon. The React/TypeScript UI, Node API, seed data and build live in this directory. The marketing site builds independently.

## Run locally

From the repository root, use Node 22.18 or later and install the locked dependencies with `npm ci`.

```sh
npm run dev:trace
```

Open the launcher for **Clint** or **Sheree** named in the terminal. It opens the facilitator workspace on loopback port 4186. Keep each launcher private. Trace places them in the OS temporary directory and rotates all access links when the server restarts. The offline file store keeps fictional edits between restarts in the ignored `apps/trace/.trace-4186.local/` directory. Each port gets a separate file store. Run one server per store.

1. Open a seeded study, or select **New study**, choose a fictional client, enter a process name and save.
2. Add an interview answer or note in **Evidence**. A cleaned fictional PDF, text file, JPEG or PNG up to 1 MB can also be attached. Open a record to read or delete it.
3. In **Process map**, add the main steps first. Set a step’s path to an earlier main step to create an exception. Select a step to inspect its evidence. **Proposed** starts as a copy and retains its source revision. Document open questions on each map.
4. In **Plan**, save the findings and recommendations. Each change creates a new version. Prior versions retain their comments and approval.
5. Select **Reviewer preview** and open the named reviewer link in another tab. It shows that client’s maps and plans. A reviewer can see linked source titles, comment on the current plan and approve its exact version. The facilitator can refresh to see the record. Approval has no downstream action.

The demo uses server-generated access links and per-tab sessions. It has no real identity verification or invitations by email. Evidence bodies, raw attachments and facilitator actions require the facilitator session. Use fictional content throughout Stage 1.

## Trellis database

The hosted backend uses the **Sproutify Trellis** Supabase project (`horvjqqifgrzxesuxtfm`). The migration authority is the `sproutify-trellis` repository. It owns `supabase/migrations/20261119165427_sweetwater_trace_clients.sql`, its master-schema import and `tests/sweetwater-trace.sql`. Confirm the target through Switchboard before applying the migration. The Sweetwater repository has read-only management access.

Trace stores one row per client in `public.sw_trace_clients`. The seven discovery objects live inside that client’s payload. Row-level security is enabled, and browser roles have no table privileges. The Node API checks role, client and study before returning reviewer-safe fields. Each update checks the previous revision to prevent lost edits.

For an authorized activation, apply the reviewed migration in Trellis, then supply its server-side Supabase key as `TRACE_TRELLIS_KEY` through the hosting secret store. Run `npm run seed:trace` once to add the two fictional clients. Repeating the seed preserves existing rows. Startup performs a read-only check and fails if Trellis is unprepared. Only `npm run dev:trace` selects the offline file store. Never put the key in a Vite variable, a repository file or the browser.

## Verification

```sh
npm run test:trace
npm run lint
npm run build:trace
npm run build
```

With Playwright available, run `node --experimental-strip-types apps/trace/tests/browser.mjs` after the Trace build. Set `PLAYWRIGHT_MODULE` to the module entry point if Playwright is installed outside the repository. The test starts a disposable offline workspace and exercises both client journeys on mobile and desktop.

The Trace web build goes to `apps/trace/dist/`. The host serves that bundle and the authenticated `/api/` routes together. The marketing deployment publishes the root `dist/` directory.

## Subdomain handoff

The target origin is `https://trace.sweetwater.technology`. For an authorized private preview, use a Node-capable host and a TLS reverse proxy for that hostname. Build with `npm run build:trace` and start one service instance with `npm run start:trace`. The proxy must forward both page and API requests to `127.0.0.1:4186` (or `TRACE_PORT`), preserve the Authorization header, and keep the launcher and server source outside the document root. The operator retrieves the private launcher from the host, opens it on their computer and issues reviewer links from the study.

Validate that a fresh browser sees the access screen, a facilitator can open both studies, and a reviewer link opens only the assigned client. To withdraw a preview, disable the Trace virtual host and stop the Trace process. Retain the additive Trellis table and saved data during rollback. Real accounts, intake ingestion and AI suggestions require separate decisions.
