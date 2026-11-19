import { trellisStore } from './store.ts'

await trellisStore(process.env.TRACE_TRELLIS_KEY ?? '').seedFictionalClients()
console.log('The two fictional Trace clients are present in Trellis.')
