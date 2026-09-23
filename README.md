# Sweetwater Technology

Portfolio and marketing site for Sweetwater Technology, built with React, TypeScript, Vite, Tailwind CSS, and Framer Motion.

Production builds prerender the homepage, newsroom, and every published news article to crawler-readable static HTML. Route metadata, JSON-LD, and `sitemap.xml` are generated from the same source data.

## Local development

```bash
npm install
npm run dev
```

The development server runs at `http://localhost:4003`.

## Validation

```bash
npm run lint
npm run build
```

Portfolio content lives in `src/constants.tsx`. Product-specific card designs live in `src/components/cards/`, while the reusable project detail dialog is in `src/components/AppDetail.tsx`.

Verified news articles live in `src/news.ts`. Adding an article there creates its `/news/:slug` page, route-specific metadata, `NewsArticle` and breadcrumb structured data, and dated sitemap entry during `npm run build`.

Service and product-profile content lives in `src/marketing.ts`. Those entries generate `/services/:slug` and `/work/:slug` routes with Service, FAQ, SoftwareApplication, and breadcrumb structured data where applicable.

The contact form posts to the configured n8n webhook in `src/components/Contact.tsx`. Verify that endpoint and its server-side spam controls before changing the form contract.
# QR codes

Print and campaign QR codes are stored in `public/qr` as both scalable SVG and high-resolution PNG files.

Generate another tracked QR code with:

```sh
npm run qr -- <name> <full-url>
```

For example:

```sh
npm run qr -- box-02 https://sweetwater.technology/card?b=2
npm run qr -- substack https://sweetwater.technology/card?src=substack
```

### Studio overview video

The video's closing QR uses the existing YouTube entry experience with a dedicated
campaign batch. Keep the QR and clickable description link distinct:

| Placement | Destination |
| --- | --- |
| Closing QR | `https://sweetwater.technology/card?src=youtube&b=studio-overview-qr` |
| Video description / pinned link | `https://sweetwater.technology/card?src=youtube&b=studio-overview-link` |

The QR assets are `public/qr/studio-overview.svg` and `.png`. Regenerate them with:

```sh
npm run qr -- studio-overview 'https://sweetwater.technology/card?src=youtube&b=studio-overview-qr'
```

`src=youtube` selects the YouTube landing copy and Sage welcome. The existing
`card-scan` request includes `source: youtube` and the exact `batch` value;
Sage requests retain these fields as the visitor selects an interest and enters
contact details. The checked-in scan workflow includes Source and Batch in its
notification. No new analytics fields or workflow deployment are needed for this
campaign convention.

These events count landing-page visits, including repeat loads; they are not
unique viewers or proof that a lead came from a camera scan rather than a shared
copy of the QR URL. Actual downstream reporting depends on the deployed n8n
workflow. Keep this video ID specific to this film when creating future campaigns.

For local landing-page review, append `&test=1` to either destination. This skips
the scan webhook, but Sage still calls its webhook with `testMode: true`; automated
tests must intercept external requests to avoid sending messages or notifications.
Never include `test=1` in the published QR or description link.
