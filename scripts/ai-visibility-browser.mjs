import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';

const { chromium } = process.env.PLAYWRIGHT_MODULE
  ? await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE).href)
  : await import('playwright');
const origin = process.env.AI_VISIBILITY_TEST_ORIGIN || 'http://127.0.0.1:4003';
const browser = await chromium.launch({ headless: true });

try {
  for (const width of [1280, 375, 320]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: width === 320 ? 'reduce' : 'no-preference' });
    const errors = [];
    let ownerRequests = 0;
    let finishAudit;
    const auditDisplayed = new Promise((resolve) => { finishAudit = resolve; });
    page.on('pageerror', (error) => errors.push(error.message));
    await page.route('https://challenges.cloudflare.com/**', (route) => route.fulfill({
      contentType: 'application/javascript',
      body: `window.turnstile = {
        render(target, options) {
          const button = document.createElement('button');
          button.type = 'button';
          button.textContent = 'Verify test visitor';
          button.onfocus = () => options['before-interactive-callback']();
          button.onclick = () => options.callback('test-token');
          target.append(button);
          return 'test-widget';
        },
        remove() { document.querySelectorAll('button').forEach(button => {
          if (button.textContent === 'Verify test visitor') button.remove();
        }); }
      };`,
    }));
    await page.route(`${origin}/test-visibility`, async (route) => {
      const payload = route.request().postDataJSON();
      assert.match(payload.receipt, /^[a-f0-9-]{36}$/);
      if (payload.operation === 'recover') {
        assert.equal(payload.receipt, receipt);
        return route.fulfill({ json: { report: { business: report.business, domain: report.domain, model: 'gemini-3.5-flash-lite', answers } } });
      }
      receipt = payload.receipt;
      assert.equal(payload.token, 'test-token');
      if (payload.email === 'clint@sweetwater.technology') {
        ownerRequests++;
        assert.equal(width, 320);
        return route.fulfill({ status: 401, json: { error: 'Sign in to the Sweetwater portal.' } });
      }
      assert.equal(payload.email, 'audit@example.com');
      assert.equal(payload.emailReport, width === 1280);
      await auditDisplayed;
      if (width === 320) return route.fulfill({ status: 409, json: { error: 'duplicate' } });
      if (width === 375) return route.abort();
      return route.fulfill({ json: { report, emailDelivery: 'accepted' } });
    });
    let receipt;
    const answer = {
      text: 'Alder Studio (https://alder-studio.example) is an option. See https://alder-studio.example/portfolio.',
      mentioned: true,
      domainReferenced: true,
    };
    const answers = ['Which providers should I consider?', 'What are some alternatives?', 'Who specializes in this?']
      .map((question) => ({ question, ...answer }));
    const report = {
      business: 'Alder Studio',
      domain: 'alder-studio.example',
      engines: [
        { name: 'Gemini', model: 'gemini-3.5-flash-lite', answers },
        { name: 'ChatGPT', model: 'gpt-6-luna', answers },
        { name: 'Claude', model: 'claude-haiku-5-5', answers },
        { name: 'Perplexity', model: 'perplexity/sonar', answers: [] },
      ],
    };

    await page.goto(`${origin}/resources`);
    await page.getByRole('link', { name: 'Open the checker' }).click();
    await page.getByRole('heading', { level: 1, name: 'Does AI bring up your business?' }).waitFor();
    await page.getByRole('status').filter({ hasText: 'Loading verification…' }).waitFor();
    assert.equal(await page.getByLabel('Email', { exact: true }).isDisabled(), true);
    await page.getByRole('button', { name: 'See an example report' }).click();
    await page.getByText('Example report / Fictional data').waitFor();
    assert.equal(await page.getByRole('region', { name: 'Visibility report' }).evaluate((element) => element === document.activeElement), true);
    await page.getByRole('navigation', { name: 'Report sections' }).getByRole('link', { name: 'Sources' }).click();
    assert.equal(new URL(page.url()).hash, '#audit-sources');
    await page.getByRole('heading', { name: 'Links that appeared in answers.' }).waitFor();
    await page.getByRole('link', { name: /alder-studio\.example/ }).waitFor();
    assert.match(await page.locator('#audit-sources li').first().innerText(), /2 answers/);
    await page.getByRole('navigation', { name: 'Report sections' }).getByRole('link', { name: 'Your next move' }).click();
    assert.equal(new URL(page.url()).hash, '#audit-plan');
    const nextMove = page.getByRole('region', { name: 'Give buyers a clearer answer.' });
    assert.match(await nextMove.locator('blockquote').innerText(), /alternatives for landscape design/);
    assert.equal(await nextMove.getByRole('link', { name: 'Book a free 20-minute call' }).getAttribute('href'), '/book');
    for (const id of ['overview', 'visibility', 'answers', 'sources', 'plan']) {
      await page.locator('#audit-' + id).scrollIntoViewIfNeeded();
      const entered = page.locator('#audit-' + id + '[data-entered]');
      await entered.waitFor({ state: 'attached' });
      assert.equal(await entered.locator(':scope > :first-child').evaluate((element) =>
        getComputedStyle(element).animationName), width === 320 ? 'none' : 'visibility-arrive');
    }
    await page.getByRole('heading', { name: 'ChatGPT answers' }).waitFor();
    await page.getByRole('heading', { name: 'Claude answers' }).waitFor();
    await page.getByRole('heading', { name: 'Manus answers' }).waitFor();
    await page.getByRole('heading', { name: 'How to read your results' }).waitFor();
    await page.getByRole('button', { name: 'Print or save as PDF' }).waitFor();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
    if (width === 320) {
      assert.equal(await page.locator('.visibility-intro').evaluate((element) => getComputedStyle(element, '::after').animationName), 'none');
    }
    await page.getByLabel('Website').fill('alder-studio.example');
    await page.getByLabel('Business name').fill('Alder Studio');
    await page.getByLabel('What customers look for').fill('landscape design in Portland');
    const verificationButton = page.getByRole('button', { name: 'Verify test visitor' });
    await verificationButton.focus();
    await page.getByRole('status').filter({ hasText: 'Complete the verification below.' }).waitFor();
    await verificationButton.click();
    await page.getByRole('status').filter({ hasText: 'Verified. You can enter your email.' }).waitFor();
    await page.getByLabel('Email', { exact: true }).fill('audit@example.com');
    if (width === 1280) await page.getByLabel('Email me a copy of my report').check();
    await page.getByRole('button', { name: 'Run my free audit' }).click();
    await page.getByText('Audit running', { exact: true }).waitFor();
    await page.getByRole('heading', { name: 'Asking AI about alder-studio.example' }).waitFor();
    assert.equal(await page.getByLabel('Audit stages').locator('[aria-current=step]').innerText(), 'Collecting answers');
    assert.equal(await page.getByLabel('Website').isVisible(), false);
    finishAudit();

    if (width === 320) {
      await page.getByRole('alert').filter({ hasText: 'already started or completed' }).waitFor();
      assert.equal(await page.getByLabel('Email', { exact: true }).isDisabled(), true);
      await page.reload();
      await page.getByLabel('Website').fill('alder-studio.example');
      await page.getByLabel('Business name').fill('Alder Studio');
      await page.getByLabel('What customers look for').fill('landscape design in Portland');
      await verificationButton.focus();
      await page.getByRole('status').filter({ hasText: 'Complete the verification below.' }).waitFor();
      await verificationButton.click();
      await page.getByRole('status').filter({ hasText: 'Verified. You can enter your email.' }).waitFor();
      await page.getByLabel('Email', { exact: true }).fill('clint@sweetwater.technology');
      await page.evaluate(() => {
        const observer = new MutationObserver((records) => {
          for (const { addedNodes } of records) {
            if ([...addedNodes].some((node) => node instanceof Element &&
              (node.matches('.visibility-running') || node.querySelector('.visibility-running')))) {
              document.body.dataset.auditProgressSeen = 'true';
              observer.disconnect();
            }
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });
      });
      await page.getByRole('button', { name: 'Run my free audit' }).click();
      const error = page.getByRole('alert').filter({ hasText: 'Enter a different email to run a free audit.' });
      await error.waitFor();
      assert.doesNotMatch(await error.innerText(), /portal/i);
      assert.equal(await error.getByRole('link').count(), 0);
      assert.equal(ownerRequests, 0);
      assert.equal(await page.locator('body').getAttribute('data-audit-progress-seen'), null);
      assert.equal(await page.getByLabel('Email', { exact: true }).isEnabled(), true);
      assert.equal(await page.getByText('Audit running', { exact: true }).isVisible(), false);
    } else {
      if (width === 375) {
        await page.getByRole('button', { name: 'Check for my report' }).click();
      }
      await page.getByText('Audit complete / AI model snapshot').waitFor();
      assert.equal(await page.locator('.visibility-metrics strong').first().textContent(), '3/3');
      await page.getByText(answer.text, { exact: true }).first().waitFor();
      assert.equal(await page.getByRole('table', { name: 'Visibility by model and buyer question' }).isVisible(), true);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
      if (width === 1280) {
        assert.equal(await page.locator('#audit-sources li').count(), 1);
        assert.match(await page.locator('#audit-sources li').first().innerText(), /9 answers/);
        await page.getByText('Results unavailable for this run.').waitFor();
        await page.getByText('Your email copy is on its way.').waitFor();
        await page.emulateMedia({ media: 'print' });
        assert.equal(await page.getByRole('heading', { level: 1 }).isVisible(), true);
        await page.locator('.visibility-chapters').waitFor({ state: 'hidden' });
        await page.locator('.visibility-print').first().waitFor({ state: 'hidden' });
        await page.locator('.visibility-next-actions').waitFor({ state: 'hidden' });
        assert.equal(await page.locator('#audit-plan blockquote').isVisible(), true);
        assert.equal(await page.locator('.visibility-detail').last().evaluate((element) =>
          getComputedStyle(element, '::details-content').contentVisibility), 'visible');
      }
    }
    assert.deepEqual(errors, []);
    console.log(`PASS checker at ${width}px`);
    await page.close();
  }
} finally {
  await browser.close();
}
