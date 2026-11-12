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
      if (payload.operation === 'email') {
        assert.deepEqual(payload, { operation: 'email', receipt });
        emailRequests++;
        return route.fulfill(emailRequests === 1
          ? { status: 503, json: { emailDelivery: 'unavailable' } }
          : { json: { emailDelivery: 'accepted' } });
      }
      if (payload.operation === 'recover') {
        assert.equal(payload.receipt, receipt);
        if (width === 1280 && allowManusResult) {
          return route.fulfill({ json: { report: {
            ...report,
            engines: report.engines.map((engine) => engine.name === 'Manus' ? { ...engine, pending: false, answers } : engine),
          }, emailAvailable: true } });
        }
        if (width === 1280) return route.fulfill({ json: { report, emailAvailable: true } });
        return route.fulfill({ json: { report: { business: report.business, domain: report.domain, model: 'gemini-3.5-flash-lite', answers }, emailAvailable: true } });
      }
      receipt = payload.receipt;
      assert.equal(payload.token, 'test-token');
      if (payload.email === 'clint@sweetwater.technology') {
        ownerRequests++;
        assert.equal(width, 320);
        return route.fulfill({ status: 401, json: { error: 'Sign in to the Sweetwater portal.' } });
      }
      assert.equal(payload.email, 'audit@example.com');
      assert.equal(payload.emailReport, undefined);
      await auditDisplayed;
      if (width === 320) return route.fulfill({ status: 409, json: { error: 'duplicate' } });
      if (width === 375) return route.abort();
      return route.fulfill({ json: { report, emailAvailable: true } });
    });
    let receipt;
    let emailRequests = 0;
    let allowManusResult = false;
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
      generatedAt: new Date().toISOString(),
      engines: [
        { name: 'Gemini', model: 'gemini-3.5-flash-lite', answers },
        { name: 'ChatGPT', model: 'gpt-6-luna', answers },
        { name: 'Claude', model: 'claude-haiku-5-5', answers },
        { name: 'Perplexity', model: 'perplexity/sonar', answers: [] },
        { name: 'Manus', model: 'Lite agent', answers: [], pending: true },
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
    const engineNavigation = page.getByRole('navigation', { name: 'AI engines' });
    const engineScreen = page.locator('#visibility-engine-screen');
    const accents = [];
    const sampleCounts = {
      Gemini: ['1/3', '1/3'],
      ChatGPT: ['1/3', '0/3'],
      Claude: ['0/3', '0/3'],
      Manus: ['1/3', '1/3'],
    };
    for (const name of ['Gemini', 'ChatGPT', 'Claude', 'Manus']) {
      const engineButton = engineNavigation.getByRole('button', { name, exact: true });
      await engineButton.click();
      assert.equal(await engineButton.getAttribute('aria-pressed'), 'true');
      await engineScreen.getByRole('heading', { name: name + ' answers' }).waitFor();
      assert.equal(await engineNavigation.locator('[aria-pressed=true]').count(), 1);
      assert.deepEqual(await engineScreen.locator('.visibility-engine-totals strong').allTextContents(),
        sampleCounts[name]);
      accents.push(await engineScreen.evaluate((element) => getComputedStyle(element).getPropertyValue('--engine-accent').trim()));
      assert.equal(await engineScreen.evaluate((element) => getComputedStyle(element).animationName),
        width === 320 ? 'none' : 'visibility-engine-enter');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
    }
    assert.equal(new Set(accents).size, 4);
    await page.getByRole('button', { name: 'Previous engine' }).click();
    await engineScreen.getByRole('heading', { name: 'Claude answers' }).waitFor();
    await page.getByRole('button', { name: 'Next / Manus' }).click();
    await engineScreen.getByRole('heading', { name: 'Manus answers' }).waitFor();
    await page.getByRole('link', { name: 'Next / Sources' }).click();
    assert.equal(new URL(page.url()).hash, '#audit-sources');
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
    assert.equal(await page.getByRole('button', { name: 'Email me the report' }).count(), 0);
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
      await page.getByText(/Audit complete \/ AI model snapshot|Core results ready \/ Manus searching/).waitFor();
      assert.equal(await page.locator('.visibility-metrics strong').first().textContent(), '3/3');
      await page.getByText(answer.text, { exact: true }).first().waitFor();
      assert.equal(await page.getByRole('table', { name: 'Visibility by model and buyer question' }).isVisible(), true);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);
      if (width === 1280) {
        await engineNavigation.getByRole('button', { name: 'Perplexity (results unavailable)' }).click();
        await engineScreen.getByRole('heading', { name: 'Results unavailable', exact: true }).waitFor();
        assert.equal(await engineScreen.locator('.visibility-engine-totals').count(), 0);
        assert.equal(await engineScreen.locator('.visibility-detail').count(), 0);
        await engineNavigation.getByRole('button', { name: 'ChatGPT', exact: true }).click();
        await engineScreen.getByRole('heading', { name: 'ChatGPT answers' }).waitFor();
      } else {
        // Legacy one-model recovery reports still get a complete engine screen.
        assert.equal(await engineNavigation.getByRole('button').count(), 1);
        await engineScreen.getByRole('heading', { name: 'Gemini answers' }).waitFor();
        assert.equal(await page.getByRole('button', { name: 'Previous engine' }).isDisabled(), true);
      }
      const emailButton = page.getByRole('button', { name: 'Email me the report' });
      await emailButton.waitFor();
      const finalSection = page.getByRole('region', { name: 'Want a copy in your inbox?' });
      assert.equal(await finalSection.getByRole('button', { name: 'Email me the report' }).count(), 1);
      assert.equal(await finalSection.evaluate((section) => section === section.parentElement.querySelector(':scope > section:last-of-type')), true);
      assert.match(await finalSection.locator('#audit-email-consent').innerText(), /you agree that Sweetwater Technology can send this report/);
      assert.equal(emailRequests, 0);
      if (width === 1280) {
        assert.equal(await emailButton.isDisabled(), true);
        await engineNavigation.getByRole('button', { name: /Manus.*Searching/ }).click();
        await engineScreen.getByRole('heading', { name: 'Search in progress' }).waitFor();
        assert.equal(await engineScreen.locator('.visibility-engine-totals').count(), 0);
        allowManusResult = true;
        await page.waitForFunction(() => !document.querySelector('.visibility-email-offer button').disabled);
        await engineScreen.locator('.visibility-detail').first().waitFor();
        assert.deepEqual(await engineScreen.locator('.visibility-engine-totals strong').allTextContents(), ['3/3', '3/3']);
        assert.equal(await page.locator('#audit-sources li').count(), 1);
        assert.match(await page.locator('#audit-sources li').first().innerText(), /12 answers/);
        await page.getByText('Results unavailable for this run.').waitFor();
        await emailButton.click();
        await page.getByRole('status').filter({ hasText: 'We couldn’t confirm delivery' }).waitFor();
        await emailButton.click();
        await page.getByText('Your email copy is on its way.').waitFor();
        assert.equal(await page.getByRole('button', { name: 'Email requested' }).isDisabled(), true);
        assert.equal(emailRequests, 2);
        await page.emulateMedia({ media: 'print' });
        const document = page.getByRole('article', { name: 'Printable AI visibility report' });
        await document.getByRole('heading', { level: 1, name: 'AI Visibility Report' }).waitFor();
        await document.getByRole('heading', { name: 'Executive summary' }).waitFor();
        await document.getByRole('heading', { name: 'Model answers' }).waitFor();
        await document.getByText(answer.text, { exact: true }).first().waitFor();
        await page.locator('.visibility-chapters').waitFor({ state: 'hidden' });
        await page.locator('.visibility-print').first().waitFor({ state: 'hidden' });
        await page.getByText('Your email copy is on its way.').waitFor({ state: 'hidden' });
      }
    }
    assert.deepEqual(errors, []);
    console.log(`PASS checker at ${width}px`);
    await page.close();
  }
} finally {
  await browser.close();
}
