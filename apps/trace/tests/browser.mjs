import { pathToFileURL } from 'node:url'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'
import { mkdtemp, rm } from 'node:fs/promises'
import assert from 'node:assert/strict'
const { chromium } = process.env.PLAYWRIGHT_MODULE
  ? await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE).href)
  : await import('playwright')
import { makeServer } from '../server/http.ts'
import { fileStore } from '../server/store.ts'
const folder = await mkdtemp(join(tmpdir(), 'trace-browser-'))
const { server, facilitators } = makeServer(
  fileStore(folder),
  fileURLToPath(new URL('../dist/', import.meta.url)),
)
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
const origin = 'http://127.0.0.1:' + server.address().port
let browser
const errors = []
async function checkPendingSave(page, action, button, controls) {
  const hold = Promise.withResolvers()
  await page.route(
    '**/actions/' + action,
    async (route) => {
      await hold.promise
      await route.continue()
    },
    { times: 1 },
  )
  try {
    await button.click()
    await page.getByText('Saving…', { exact: true }).waitFor()
    for (const control of controls) assert.ok(await control.isDisabled())
  } finally {
    hold.resolve()
  }
}
try {
  browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 1280, height: 850 } })
  context.on('page', (p) => {
    p.on('pageerror', (e) => errors.push(e.message))
    p.on('request', (r) => {
      if (!r.url().startsWith(origin) && !r.url().startsWith('blob:')) errors.push('External request')
    })
  })
  const page = await context.newPage()
  await page.goto(origin + '/#access=' + facilitators.Clint)
  await page.getByRole('heading', { name: 'Discovery studies' }).waitFor()
  assert.equal(await page.locator('.study-card').count(), 2)

  const originals = await page
    .locator('.study-card')
    .evaluateAll((nodes) => nodes.map((a) => a.getAttribute('href')))
  await page.getByLabel('Search studies').fill('Juniper')
  assert.equal(await page.locator('.study-card').count(), 1)
  await page.getByLabel('Search studies').fill('')
  await page.setViewportSize({ width: 390, height: 844 })

  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
  for (const [i, name] of ['Alder & Pine Painting', 'Juniper Room Salon'].entries()) {
    await page.goto(origin + originals[i].replace('/setup', '/map'))
    await page.getByRole('button', { name: 'Proposed', exact: true }).click()
    await page.locator('.step-toggle').first().click()
    assert.ok(await page.locator('.step-detail .citation').count())
    assert.ok(await page.locator('.branch-label').isVisible())
    assert.ok(await page.locator('.questions').isVisible())
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth))

    await page.goto(origin + '/studies')
    await page.getByRole('link', { name: 'New study', exact: true }).click()
    await page.getByRole('combobox', { name: 'Client', exact: true }).selectOption({ label: name })
    await page.getByLabel('Process name').fill('Field handoff ' + i)
    await page.getByLabel('Goal', { exact: true }).fill('Understand request handling')
    await page.getByRole('button', { name: 'Create study' }).click()
    await page.getByRole('heading', { name: 'Field handoff ' + i }).waitFor()
    await page
      .getByRole('navigation', { name: 'Study screens' })
      .getByRole('link', { name: 'Evidence' })
      .click()
    await page.getByRole('button', { name: 'Add evidence' }).click()
    await page.getByLabel('Title', { exact: true }).fill('Field note')
    await page.getByLabel('Source person').fill('Fictional owner')
    await page.getByLabel('Notes', { exact: true }).fill('The owner reads a request.')
    await checkPendingSave(page, 'evidence', page.getByRole('button', { name: 'Save evidence' }), [
      page.getByRole('button', { name: 'Cancel' }),
      page.getByLabel('Notes', { exact: true }),
    ])
    await page.getByRole('button', { name: /Field note/ }).click()
    await page.getByText('The owner reads a request.', { exact: true }).waitFor()
    await page.getByRole('link', { name: 'Process map', exact: true }).click()
    await page.getByRole('button', { name: 'Add step', exact: true }).click()
    await page.getByLabel('Step name').fill('Read request')
    await page.getByLabel('Field note', { exact: true }).check()
    await checkPendingSave(page, 'step', page.getByRole('button', { name: 'Save step' }), [
      page.getByRole('button', { name: 'Proposed', exact: true }),
      page.getByRole('button', { name: 'Cancel' }),
    ])
    await page.getByRole('button', { name: /Read request/ }).click()
    await page.locator('.citation').getByText('Field note').waitFor()
    await page.getByRole('button', { name: 'Proposed', exact: true }).click()
    await page.getByRole('button', { name: 'Create proposed copy' }).click()
    await page.getByRole('button', { name: /Read request/ }).click()
    await page.getByRole('button', { name: 'Edit step' }).click()
    await page.getByLabel('Step name').fill('Review request details')
    await page.getByRole('button', { name: 'Save step' }).click()
    await page.getByRole('button', { name: /Review request details/ }).waitFor()
    await page.getByRole('button', { name: 'Current', exact: true }).click()
    await page.getByRole('button', { name: /Read request/ }).waitFor()
    await page.getByRole('link', { name: 'Plan', exact: true }).click()
    await page.getByRole('button', { name: 'Edit plan' }).click()
    await page.getByLabel('What we found').fill('Requests arrive without the site name.')
    await page.getByLabel('What we suggest').fill('Confirm the location up front.')
    await page.getByRole('button', { name: 'Save plan' }).click()
    await page.getByText('Requests arrive without the site name.').waitFor()
    await page.getByRole('button', { name: 'Reviewer preview' }).click()
    const [reviewer] = await Promise.all([
      context.waitForEvent('page'),
      page.getByRole('link', { name: /Open as/ }).click(),
    ])
    await reviewer.getByRole('link', { name: 'Plan', exact: true }).click()
    assert.equal(await reviewer.getByRole('link', { name: 'Evidence', exact: true }).count(), 0)
    await reviewer.getByLabel('Your comment').fill('Matches our process.')
    await checkPendingSave(reviewer, 'comment', reviewer.getByRole('button', { name: 'Post comment' }), [
      reviewer.getByLabel('Your comment'),
      reviewer.getByRole('button', { name: 'Post comment' }),
    ])
    await reviewer.getByText('Matches our process.', { exact: true }).waitFor()
    await reviewer.getByRole('button', { name: 'Approve version 2' }).click()
    await reviewer.getByText('Approved', { exact: true }).waitFor()
    await reviewer.goto(origin + originals[1 - i].replace('/setup', '/plan'))
    await reviewer.getByRole('alert').filter({ hasText: 'unavailable' }).waitFor()
    await reviewer.close()
    await page.reload()
    await page.getByText('Approved', { exact: true }).waitFor()
  }
  assert.deepEqual(errors, [])
  console.log(
    'Verified desktop and mobile, two study-to-approval flows, server-scoped review, and zero external requests. Private files scoped to their own client.',
  )
} finally {
  if (browser) await browser.close()
  await new Promise((resolve) => server.close(resolve))
  await rm(folder, { recursive: true, force: true })
}
