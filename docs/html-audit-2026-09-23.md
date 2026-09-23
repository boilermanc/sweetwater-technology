# Initial HTML audit — September 23, 2026

Reference: [Our website looked fine. The HTML…](https://sweetwatertechnology.substack.com/p/our-website-looked-fine-the-html)

The article's central claim holds on the live site: build-time prerendering delivers business content in the initial HTML, without requiring the reader to execute JavaScript.

## Production evidence

- All 16 URLs in the production sitemap returned meaningful `<main>` content, one H1, unique titles, descriptions, the expected canonical, and parseable JSON-LD. None carried a noindex directive in HTML or response headers.
- The homepage response contained its description of custom web applications, mobile products, AI workflow automation, and Atlanta location as body content.
- All three service pages contained their service descriptions, intended audiences, deliverables, and process in body content.
- The public robots.txt permitted crawling and declared the sitemap.
- The homepage and custom web applications page also passed with Googlebot, OAI-SearchBot, and PerplexityBot user-agent strings. This does not test requests from the actual services' IP addresses or prove indexing or inclusion in AI answers.
- The homepage rendered correctly in a browser with JavaScript enabled.

At the initial production audit, unknown URLs returned the homepage with HTTP 200. The routing correction in this change serves the existing noindex 404 document with HTTP 404. The deployment workflow checks the live status after upload. This separate issue did not invalidate the initial-HTML claim for existing pages.

## Repeatable checks

```sh
npm run lint
npm run build
npm run audit:html
npm run audit:html -- --url https://sweetwater.technology
```

The local audit reads generated files in `dist`. The URL audit uses HTTP requests without running JavaScript and additionally checks crawler user-agent responses and an unknown URL. It exits nonzero on failure. The deployment workflow runs the file audit before upload and the HTTP audit afterward.

Apache configuration now lives in `public/.htaccess` and is copied into the build. Every application route must continue to be prerendered: missing paths deliberately receive a 404 instead of the homepage. Vite preview is not a substitute for testing Apache status behavior.

Before deployment, lint, production build (21 prerendered routes), local file audit, and HTTP audit against a temporary Apache 2.4 container all passed. Apache served all 16 sitemap pages and a real HTTP 404 for an unknown URL. A negative regression check confirmed that removing homepage main content makes the audit fail even with metadata intact. The initial production HTTP audit passed every check except the unknown-URL HTTP 200 response. The deployment workflow records the post-upload audit separately.

Files changed for this audit: `scripts/audit-html.mjs`, `package.json`, `public/.htaccess`, `.github/workflows/deploy.yml`, and this report. Pre-existing edits to README, Sage, card landing, n8n, and QR assets were preserved.

## Supported public wording

“We checked the raw HTML on our live site. Our homepage and service pages deliver their core content before JavaScript runs, using build-time prerendering.”

This audit supports that specific claim. It is not a certification of a complete SEO audit, universal crawler access, search ranking, or AI visibility.
