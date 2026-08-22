import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { getPageSeo } from './seo.ts'

const pageSeo = getPageSeo(window.location.pathname)
document.title = pageSeo.title
const description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
if (description) {
  description.content = pageSeo.description
}

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

if (root.hasChildNodes()) {
  hydrateRoot(root, app)
} else {
  createRoot(root).render(app)
}
