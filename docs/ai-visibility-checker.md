# AI Visibility Checker

The checker asks Gemini, ChatGPT, and Claude the same three buyer questions. Perplexity joins when configured, and Manus can answer all three questions in a single optional agent task. Visitors supply their domain, business name, an unbranded buyer category, and an email. The email field unlocks after Cloudflare Turnstile, and Trellis validates the token's action and hostname before reserving an audit. Model providers receive the buyer questions only.

The report shows answers and counts by model. The direct model calls omit web search tools. Manus runs a separate agent task that can consult public sources. Consumer apps may answer differently. Trellis stores successful reports and normalized emails in a service-role-only table. The form neither confirms mailbox ownership nor enrolls visitors in a mailing list.

The web report explains both counts, shows one practical check, and offers a print layout for saving a PDF through the browser. When email delivery is enabled, visitors can request a copy before starting the audit. The email includes the formatted report in the body, plus a plain-text version, and invites a reply to Clint about the results.

## Activation

1. Use the Trellis Switchboard binding from the `sproutify-trellis` repository. Review the pending migrations and apply the specific `20261108143422_sweetwater_ai_visibility.sql` migration to the approved target.
2. Configure a Cloudflare Turnstile widget for `sweetwater.technology`. Supply its secret as `AI_VISIBILITY_TURNSTILE_SECRET` to the Trellis Edge Function. The expected action is `ai_visibility`. For an isolated preview, set `AI_VISIBILITY_ORIGIN` to its exact origin and use a corresponding test widget.
3. Confirm Trellis has `GEMINI_API_KEY` and `OPENAI_API_KEY` with access to Gemini 3.5 Flash-Lite and GPT-6 Luna. Claude and Manus reuse Trellis's saved tenant keys, with `ANTHROPIC_API_KEY` and `MANUS_API_KEY` taking precedence if configured. Verify Claude Haiku 5.5 access. Set `PERPLEXITY_API_KEY` to include Perplexity Sonar. The database caps starts at 25 per UTC day, with up to nine core model calls per start, three optional Perplexity calls, and one Manus Lite task.
4. Deploy only `sweetwater-ai-visibility` with JWT verification disabled for that function. Its public submission path checks Turnstile before making database claims or Gemini calls. The report recovery path accepts a random, short-lived receipt from the same tab and does not look up reports by email.
5. Set the Sweetwater GitHub Actions repository variables `VITE_AI_VISIBILITY_URL` to the deployed Edge Function URL and `VITE_AI_VISIBILITY_TURNSTILE_SITE_KEY` to the public widget site key. Build and deploy the site using its existing workflow.
6. In the approved environment, test one audit with an authorized test email, verify each model's counts against the returned answers, retry with the same address in different casing, and confirm the duplicate never calls a model provider. Check that anonymous database roles cannot read the table or call the reservation RPC.

For email delivery, confirm Trellis has an authorized `RESEND_API_KEY` and set `AI_VISIBILITY_EMAIL_FROM` to a sender on the verified Sweetwater domain. Enable `VITE_AI_VISIBILITY_EMAIL_ENABLED=true` for the website after checking the sender and reply-to mailbox. Send one approved test audit to your own address and check inbox rendering. Delivery is attempted after Trellis saves the report. The on-screen report is available if email delivery fails.

A failed Gemini, ChatGPT, or Claude attempt releases the email for a fresh verification and still counts toward the daily cap. A failed optional Perplexity or Manus check is marked unavailable in the completed report. Manus gets a 25-second window, then the server requests that unfinished tasks stop. An interrupted reservation expires after five minutes. After a lost response, the visitor can check for the report from the original tab.

To take the live form offline, unset either website variable and rebuild. Disable the dedicated endpoint if immediate containment is needed. Preserve the audit records and the one-use history during rollback.

## Local checks

For repeat owner tests, sign in to the Sweetwater portal as `clint@sweetwater.technology`, then open the checker in the same browser and use that address. Complete Turnstile for each run. The checker offers **Run another test** after a successful report. Trellis verifies the session and confirmed email before reserving a test, and those runs are counted separately from the public daily quota.

Apply the owner-test migration before deploying the updated Edge Function. Deploy the updated website after the function is active. The five-argument reservation function continues to handle public submissions during rollout.

- Run `npm run lint`, `npm run build`, and `npm run audit:html` in Sweetwater.
- To exercise the form without external requests, run Vite at `http://127.0.0.1:4003` with `VITE_AI_VISIBILITY_URL=http://127.0.0.1:4003/test-visibility`, a placeholder value for `VITE_AI_VISIBILITY_TURNSTILE_SITE_KEY`, and `VITE_AI_VISIBILITY_EMAIL_ENABLED=true`. Run `node scripts/ai-visibility-browser.mjs` with Playwright available. The script intercepts the widget and endpoint.
- Run `deno test --no-config --allow-env tests/sweetwater-ai-visibility.test.ts` in Trellis. Apply the migration and run `tests/sweetwater-ai-visibility.sql` in a disposable local database with the Supabase roles.

## Private inbox test

Run the first real audit on a private preview or a local stack with its own audit table. Use `sweetwater.technology`, `Sweetwater Technology`, and `custom software development for small businesses in Atlanta` as the test inputs. Confirm the recipient address and request a copy at submission. Check that the inbox copy and on-screen report show the same three answers and counts, and that replying addresses the message to Clint. Submit the same email in different casing to confirm the reservation blocks a repeat. Use an isolated table so the test cannot consume the recipient's public audit.

The preview needs access to the three required models, a Resend sending key for the verified Sweetwater domain, and a Turnstile widget that accepts the preview hostname and returns the expected action. Keep these credentials server-side. Cloudflare's dummy credentials omit the action and return a fixed hostname, so they cannot verify this endpoint's real action and hostname checks.

At published standard token rates, the three core models cost about $0.0102 at their combined output caps, plus input tokens. Optional Sonar adds up to $0.003 in output tokens, plus its input tokens. Manus uses separate task credits. Measure an actual Lite run before estimating its per-audit cost. See [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing), [OpenAI pricing](https://developers.openai.com/api/docs/models/gpt-6-luna), [Claude pricing](https://platform.claude.com/docs/en/models/haiku-5-5/overview), and [Perplexity pricing](https://docs.perplexity.ai/docs/agent-api/models).
