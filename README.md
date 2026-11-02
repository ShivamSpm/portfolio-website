# Shivam Mahajan: portfolio

Personal portfolio for a full-stack engineer who builds with AI.
Live at https://shivam-mahajan.vercel.app.

Built with Next.js (App Router), TypeScript, Tailwind CSS v4 and Motion. Fully static, deployed on Vercel.
The full design and content plan is in [`docs/PLAN.md`](docs/PLAN.md).

## Run it locally

You need Node.js 20 or newer and pnpm. If `pnpm` isn't installed, run `corepack enable pnpm` once.

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Other commands:

| Command          | What it does                                 |
| ---------------- | -------------------------------------------- |
| `pnpm build`     | Production build. Must pass before any push. |
| `pnpm lint`      | ESLint.                                      |
| `pnpm typecheck` | TypeScript in strict mode.                   |
| `pnpm format`    | Formats everything with Prettier.            |

## Edit content

All text on the site lives in typed files under `src/content/`. Components never contain copy, so
you can change wording without touching any layout code.

- `src/content/site.ts`: name, role, location, availability, email, phone, social links, resume link.

Edit a file, save, and the dev server updates instantly. TypeScript will flag a missing or misspelled field.

## Update the resume

The Resume button links to a Google Drive file, so the PDF can change without a code change.

**First time:**

1. Upload the resume PDF to Google Drive.
2. Choose **Share → "Anyone with the link" → Viewer**, and copy the link.
3. Paste it as `resumeUrl` in `src/content/site.ts`. While it's `null`, the Resume button is hidden.

**To update it later without changing the link:** in Drive, right-click the file → **File information →
Manage versions → Upload new version**. The link stays the same, so the website never needs to change.

## Theme and design tokens

Colors, fonts and the type scale are CSS variables in `src/styles/globals.css`, exposed to Tailwind
as `bg-bg`, `text-ink`, `text-muted`, `border-line`, `text-accent` and so on. Light mode is "Paper",
dark mode is "Blueprint". The default follows the visitor's system setting, and the toggle choice is
remembered.
