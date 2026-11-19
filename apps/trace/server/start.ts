import { fileURLToPath } from 'node:url'
import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { makeServer } from './http.ts'
import { fileStore, trellisStore } from './store.ts'

const port = Number(process.env.TRACE_PORT ?? 4186)
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid Trace port.')
const localOrigin = 'http://127.0.0.1:' + port
const demo = process.argv.includes('--demo')
const origin = demo ? localOrigin : (process.env.TRACE_ORIGIN ?? 'https://trace.sweetwater.technology')
if (origin !== localOrigin && origin !== 'https://trace.sweetwater.technology')
  throw new Error('Choose the local preview or the Trace subdomain as TRACE_ORIGIN.')
const store = demo
  ? fileStore(fileURLToPath(new URL('../.trace-' + port + '.local/', import.meta.url)))
  : trellisStore(process.env.TRACE_TRELLIS_KEY ?? '')
if (!demo && !(await store.listIds()).length)
  throw new Error('Trellis has no Trace studies. Seed the fictional clients during activation.')
const { server, facilitators } = makeServer(store, fileURLToPath(new URL('../dist/', import.meta.url)))
server.listen(port, '127.0.0.1', async () => {
  // Keep the local facilitator capability out of console output, the repository and browser history.
  const directory = await mkdtemp(join(tmpdir(), 'sweetwater-trace-'))
  for (const [name, access] of Object.entries(facilitators)) {
    const path = join(directory, 'Open Trace - ' + name + '.html')
    const target = origin + '/#access=' + access
    await writeFile(
      path,
      '<!doctype html><meta name="referrer" content="no-referrer"><title>Open Trace</title><a href="' +
        target +
        '">Open facilitator workspace</a><script>location.replace(' +
        JSON.stringify(target) +
        ')</script>',
      { mode: 0o600 },
    )
    console.log(name + ' facilitator launcher: ' + path)
  }
})
