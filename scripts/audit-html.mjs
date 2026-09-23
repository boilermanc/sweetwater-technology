import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

// Inspect response HTML without executing JavaScript. A populated <head> or JSON-LD
// alone must never pass the business-content checks.
const args = process.argv.slice(2);
assert(args.length === 0 || (args.length === 2 && args[0] === '--url'),
  'Usage: npm run audit:html [-- --url https://sweetwater.technology]');
const origin = 'https://sweetwater.technology';
const liveUrl = args[1] ? new URL(args[1]) : null;
const dist = path.resolve('dist');
const failures = [];
const titles = new Set();
const plainText = (html) => html
  .replace(/<(script|style|svg|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ').trim();
const requiredCopy = new Map([
  ['/', 'Sweetwater Technology builds custom web applications, mobile products, and AI workflow automation from Atlanta, Georgia.'],
  ['/services/custom-web-applications', 'Custom Web Application Development'],
  ['/services/ai-workflow-automation', 'AI Workflow Automation'],
  ['/services/mobile-app-development', 'Mobile App Development'],
]);

async function read(route, userAgent, expectedStatus = 200) {
  if (liveUrl) {
    const response = await fetch(new URL(route, liveUrl), {
      headers: { 'User-Agent': userAgent ?? 'Sweetwater-HTML-Audit/1.0' },
      signal: AbortSignal.timeout(20000),
    });
    assert.equal(response.status, expectedStatus, `${route}: HTTP status`);
    assert(!/noindex/i.test(response.headers.get('x-robots-tag') ?? '') || expectedStatus === 404,
      `${route}: unexpected X-Robots-Tag noindex`);
    return response.text();
  }
  const file = path.posix.extname(route) ? route : `${route.replace(/\/$/, '')}/index.html`;
  return readFile(path.join(dist, file), 'utf8');
}

async function check(label, action) {
  try {
    await action();
    console.log(`PASS ${label}`);
  } catch (error) {
    failures.push(label);
    console.error(`FAIL ${label}: ${error.message}`);
  }
}

function inspect(html, route, uniqueTitle = true) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? '';
  const text = plainText(main);
  assert(text.length > 200, `${route}: substantial content missing from <main>`);
  assert.equal((main.match(/<h1\b/gi) ?? []).length, 1, `${route}: expected one H1 in initial HTML`);
  assert(!/<div id="root">\s*<\/div>/.test(html), `${route}: empty React shell`);
  assert(!html.includes('<!--app-head-->'), `${route}: prerender head placeholder remains`);
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1];
  assert(title, `${route}: title missing`);
  if (uniqueTitle) {
    assert(!titles.has(title), `${route}: duplicate title (possible homepage fallback)`);
    titles.add(title);
  }
  assert(html.includes(`<link rel="canonical" href="${origin}${route}"`), `${route}: wrong canonical`);
  assert(/<meta name="description" content="[^"]+"/.test(html), `${route}: description missing`);
  assert(!/<meta name="robots" content="[^"]*noindex/i.test(html), `${route}: sitemap page is noindex`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert(schemas.length > 0, `${route}: structured data missing`);
  for (const [, json] of schemas) JSON.parse(json);
  if (requiredCopy.has(route)) assert(text.includes(requiredCopy.get(route)), `${route}: expected business copy missing`);
  if (route.startsWith('/services/')) {
    for (const phrase of ['Who this service is for', 'What Sweetwater Technology delivers', 'How the engagement works']) {
      assert(text.includes(phrase), `${route}: missing service content: ${phrase}`);
    }
  }
}

const sitemap = await read('/sitemap.xml');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]));
assert(urls.length > 0, 'Sitemap has no URLs');
assert(urls.every((url) => url.origin === origin), 'Sitemap contains an unexpected origin');
const routes = urls.map((url) => url.pathname);
assert.equal(new Set(routes).size, routes.length, 'Duplicate sitemap URL');
for (const route of requiredCopy.keys()) assert(routes.includes(route), `${route}: missing from sitemap`);
for (const route of routes) await check(route, async () => inspect(await read(route), route));

await check('robots.txt', async () => {
  const robots = await read('/robots.txt');
  assert(robots.includes(`Sitemap: ${origin}/sitemap.xml`), 'Sitemap declaration missing');
  assert(!/^Disallow:\s*\/\s*$/m.test(robots), 'Site-wide crawl disallow');
});

if (liveUrl) {
  // These test responses to UA strings, not traffic from verified crawler IPs.
  for (const agent of ['Googlebot', 'OAI-SearchBot', 'PerplexityBot']) {
    for (const route of ['/', '/services/custom-web-applications']) {
      await check(`${agent} ${route}`, async () => inspect(await read(route, agent), route, false));
    }
  }
  await check('unknown URL returns a real 404', async () => {
    const html = await read('/__sweetwater-html-audit-missing-page__', undefined, 404);
    assert(/<meta name="robots" content="noindex/.test(html), '404 must be noindex');
    assert(plainText(html).includes('Page not found'), '404 content missing');
  });
} else {
  await check('404 document and Apache configuration', async () => {
    const html = await read('/404.html');
    assert(/<meta name="robots" content="noindex/.test(html), '404 must be noindex');
    assert(plainText(html).includes('Page not found'), '404 content missing');
    const config = await readFile(path.join(dist, '.htaccess'), 'utf8');
    assert(config.includes('ErrorDocument 404 /404.html'), 'Custom 404 handler missing');
    assert(config.includes('RewriteRule . - [R=404,L]'), 'Missing URL status rule absent');
    assert(!/RewriteRule\s+\.\s+\/index\.html/.test(config), 'Homepage fallback creates soft 404s');
  });
}

console.log(`\nChecked ${routes.length} sitemap pages in ${liveUrl ? liveUrl.origin : dist}; ${failures.length} failed checks.`);
if (failures.length) process.exitCode = 1;
