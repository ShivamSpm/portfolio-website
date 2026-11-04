# Shivam Mahajan: portfolio

Personal portfolio for a full-stack engineer who builds with AI.
Live at https://shivam-mahajan-portfolio.vercel.app.

Built with Next.js (App Router), TypeScript, Tailwind CSS v4 and Motion. Fully static, deployed on Vercel.
The full design and content plan is in [`docs/PLAN.md`](docs/PLAN.md).

## Run it locally

You need Node.js 20 or newer and pnpm. If `pnpm` isn't installed, run `corepack enable pnpm` once.

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Other commands:

| Command              | What it does                                                            |
| -------------------- | ----------------------------------------------------------------------- |
| `pnpm build`         | Content check, then the production build. Must pass before any push.    |
| `pnpm lint`          | ESLint.                                                                 |
| `pnpm typecheck`     | TypeScript in strict mode.                                              |
| `pnpm format`        | Formats everything with Prettier.                                       |
| `pnpm check:content` | Lists every item still waiting on you (see below). Never fails a build. |

## Edit content

All text on the site lives in typed files under `src/content/`. Components never contain copy, so
you can change wording without touching any layout code.

- `site.ts`: name, role, location, availability, email, phone, social links, resume link.
- `home.ts`: nav, hero, impact strip, section titles, About, contact, footer, and button labels.
- `stories.ts`: the eight stories (four work, four projects), their diagrams and step text.
- `experience.ts`: roles, education, awards.
- `skills.ts`: skill groups and which stories each skill links to.
- `types.ts`: the shapes the files above must follow.

Edit a file, save, and the dev server updates instantly. TypeScript will flag a missing or misspelled field.

### Items waiting on you

- **`needsReview: true`** marks drafted wording you haven't approved yet. When you approve or edit it,
  delete the `needsReview` line (and its `reviewNote`, if there is one).
- **`TODO(shivam): ...`** marks missing information. A story step whose text is still a TODO is hidden
  on the site until you replace it.

`pnpm check:content` prints both lists with file locations. It also checks that every diagram step
only refers to nodes and edges that exist.

## Update the resume

The Resume button links to a Google Drive file, so the PDF can change without a code change.

**First time:**

1. Upload the resume PDF to Google Drive.
2. Choose **Share → "Anyone with the link" → Viewer**, and copy the link.
3. Paste it as `resumeUrl` in `src/content/site.ts`. While it's `null`, the Resume button is hidden.

**To update it later without changing the link:** in Drive, right-click the file → **File information →
Manage versions → Upload new version**. The link stays the same, so the website never needs to change.

## Per-company tracking links

Every `/for/<company>` URL (for example `/for/stripe`) shows the normal home page. Nothing on
the page mentions the company, it's hidden from search engines, and one static page serves
every name, so there's nothing to set up per link.

When you apply somewhere, send that company its own link. In Vercel Analytics, a view of
`/for/stripe` means someone opened the link you sent Stripe. Vercel can't tell you who it was,
only that the link was opened. Stories opened from there show up as `/stories/<slug>` views.

## Deploy on Vercel (one time)

1. Sign in at vercel.com with GitHub, then **Add New → Project → Import**
   `ShivamSpm/portfolio-website`.
2. Pick the project's address (this site uses `shivam-mahajan-portfolio.vercel.app`), keep the
   Next.js preset, and click **Deploy**.
3. Go to the project's **Analytics** tab and enable **Web Analytics**.
4. From then on, every push to `main` redeploys, and every pull request gets a preview URL.

If the final address is different, update `siteUrl` in `src/content/site.ts`: canonical
links, the sitemap and the share images all use it.

## Theme and design tokens

Colors, fonts and the type scale are CSS variables in `src/styles/globals.css`, exposed to Tailwind
as `bg-bg`, `text-ink`, `text-muted`, `border-line`, `text-accent` and so on. Light mode is "Paper",
dark mode is "Blueprint". The default follows the visitor's system setting, and the toggle choice is
remembered.
