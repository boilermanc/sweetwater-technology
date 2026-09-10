import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import QRCode from 'qrcode'

const [slug, url] = process.argv.slice(2)

if (!slug || !url) {
  console.error('Usage: npm run qr -- <slug> <url>')
  process.exit(1)
}

const outputDirectory = path.resolve('public', 'qr')
const outputBase = path.join(outputDirectory, slug)

await mkdir(outputDirectory, { recursive: true })

const commonOptions = {
  errorCorrectionLevel: 'H',
  margin: 4,
  color: {
    dark: '#000000',
    light: '#FFFFFF',
  },
}

await Promise.all([
  QRCode.toFile(`${outputBase}.svg`, url, {
    ...commonOptions,
    type: 'svg',
    width: 1200,
  }),
  QRCode.toFile(`${outputBase}.png`, url, {
    ...commonOptions,
    type: 'png',
    width: 1200,
  }),
])

console.log(`Created ${outputBase}.svg and ${outputBase}.png for ${url}`)
