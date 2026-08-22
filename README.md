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
