# Sweetwater Technology

Portfolio and marketing site for Sweetwater Technology, built with React, TypeScript, Vite, Tailwind CSS, and Framer Motion.

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

The contact form posts to the configured n8n webhook in `src/components/Contact.tsx`. Verify that endpoint and its server-side spam controls before changing the form contract.
