# Card Design Prompt
## Portfolio Card — Sweetwater Technology

> **Drop this file into the root of any product repo.** Cursor reads the codebase, extracts the product's identity, and generates a unique card component for the Sweetwater portfolio site.

---

### What You Must Do First

**DO NOT ask the user to fill in colors, features, or descriptions. Extract everything yourself by reading this project's code.**

Before writing any code, thoroughly read this project's codebase to understand its visual identity:

1. **Colors** — Read CSS files (`index.css`, `globals.css`, `tailwind.config.*`, `styles/`, or any CSS-in-JS theme files). Extract the primary, secondary, and accent colors with their exact hex values.
2. **Typography** — Identify the font families used (serif, sans-serif, monospace, display). Note any Google Fonts imported in HTML or CSS.
3. **Component patterns** — Read the main UI components to understand the design language: card shapes, border radius, shadow styles, hover effects, spacing patterns.
4. **Product purpose** — Read the main app component, landing page, or README to understand what this product does, who it's for, and what makes it unique.
5. **Mood & personality** — Based on the color palette, typography, and UI patterns, determine the emotional character: is it playful? serious? warm? technical? whimsical? premium?

**You must complete this research before writing the card component.** Summarize your findings in a comment at the top of the output file.

---

### Context

This is for a marketing portfolio site (Sweetwater Technology) that showcases multiple products/apps in a card grid. Each product gets its own uniquely designed card that captures the spirit and character of the product it represents — like a movie poster captures the feel of a film.

The goal is NOT to replicate the product's UI inside a card. The goal is to distill the product's identity — its mood, energy, color story, and personality — into a compact, beautiful card that makes someone want to click and learn more.

The generated card component file should be saved to this project's root directory so it can be copied into the Sweetwater site manually. It does not get committed or deployed with the source project.

---

### Output File

Create a file called `[ProjectName]Card.tsx` in this project's root directory. Derive the project name from the codebase (package.json name, main heading, README title, etc.).

---

### Component Spec

```tsx
interface AppProject {
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  image: string;
  tags: string[];
  link: string;
  color: string;
}

// Component props:
{ app: AppProject, index: number, onClick: () => void }
```

### Required Functionality
- Display `app.image` (product preview image)
- Show `app.title`, `app.category`, `app.description`
- Render all `app.tags`
- Demo link using `app.link` with `target="_blank"`, `rel="noopener noreferrer"`, and `e.stopPropagation()` on click
- Learn More button that calls `onClick`
- Framer Motion entrance animation (stagger by `index`)
- Framer Motion hover animation that matches this product's energy
- Fully responsive (mobile through desktop)

### Imports — Only These Three Packages
```tsx
import React from "react";
import { motion } from "framer-motion";
import { /* pick icons that fit this product */ } from "lucide-react";
```

### Styling Rules
- Tailwind CSS classes only (no external CSS files)
- Inline styles only when absolutely necessary (complex gradients, shadows)
- No additional dependencies beyond the three above

---

### Suggested Constants Block

At the bottom of the output file, add a comment block with the recommended Sweetwater `constants.tsx` entry. **Derive all values from the codebase — do not use placeholder text:**

```tsx
/*
 * SWEETWATER CONSTANTS.TSX ENTRY:
 *
 * {
 *   id: "[derived-from-codebase]",
 *   title: "[product name from codebase]",
 *   category: "[appropriate category]",
 *   description: "[1-2 sentence pitch derived from the product's actual purpose]",
 *   longDescription: "[3-4 sentence description of what the product does and why it matters]",
 *   image: "/images/[project-name]-preview.svg",
 *   tags: ["[actual tech stack from package.json]"],
 *   link: "[production URL if found, otherwise placeholder]",
 *   color: "[primary brand color hex from the codebase]"
 * }
 */
```

---

### Design Principles

- **Personify, don't replicate** — capture the product's character, not its UI
- **Each card is a first impression** — prioritize visual impact and clarity
- **Contrast with other cards** — if most cards are light, maybe this one goes dark; if most are rounded, maybe this one is sharp
- **The card should make someone say "oh that one's different"** and want to click it
- **Quality over quantity** — one strong visual idea executed well beats five half-baked effects
- **Use the product's actual colors** — extract them from the codebase, don't invent new ones

### What NOT to Do
- Don't ask the user to provide colors, descriptions, or features — read the code
- Don't just reskin a generic card with different colors
- Don't try to rebuild the product's actual interface inside the card
- Don't use external CSS files — keep everything in Tailwind
- Don't remove any required props or functionality
- Don't make it so wildly different that it feels like it's from a different website entirely
- Don't import anything beyond react, framer-motion, and lucide-react
- Don't use placeholder text — every string should come from the codebase
