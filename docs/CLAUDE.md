# CLAUDE.md

Personal portfolio for Shivam Mahajan, a full-stack engineer who builds with AI.
Live at https://shivam-mahajan.vercel.app (Vercel Hobby, auto-deploys from `main`).

## Start here
- Read `docs/PLAN.md` fully before doing any work. It is the source of truth for design, content, architecture and milestones.
- Work through the milestones in Section 11 in order. At every **CHECKPOINT**, stop, push a preview, and summarize what changed and what you need from Shivam. Don't start the next milestone until he approves.

## Non-negotiable rules
- **Never invent facts:** no metrics, dates, employers, links, quotes or learnings that aren't in `docs/PLAN.md`. If something is missing, add `TODO(shivam)` in the content file and mention it in your summary.
- Lines marked [CONFIRM] in the plan go into content with `needsReview: true`.
- All copy lives in `src/content/*.ts`. Never hard-code text in components.
- The phone number, email and links in `src/content/site.ts` are approved. Don't add any other personal info.
- Ask before adding new sections, pages, dependencies, or anything not in the plan.

## Commands
- `pnpm dev`: local dev server
- `pnpm build`: production build (must pass before any push)
- `pnpm lint` and `pnpm typecheck`: must be clean
- `pnpm check:content`: lists every `needsReview` and `TODO(shivam)` item

## Conventions
- Next.js App Router, TypeScript strict, Tailwind v4 using the design tokens in `src/styles/globals.css`. Never hard-code hex colors in components.
- Animation uses `motion/react` only. Animate only transform, opacity, clip-path and SVG pathLength. Every animation must respect `prefers-reduced-motion`.
- Use one accent color, and no gradients, glows or emoji in the UI.
- Accessibility: real buttons and links, visible focus, AA contrast in both themes, `role="img"` with `aria-label` on diagrams.
- Keep the site fully static (SSG). No database, CMS or server runtime.

## Git
- Work on a branch per milestone (for example `m2-home-static`) and open a PR into `main`. Vercel creates a preview URL for each PR, which is what Shivam reviews at checkpoints.
- Use small, descriptive commits. Never push directly to `main` and never force-push.

## Definition of done (per milestone)
Build, lint and typecheck pass. The pages look right at 360px, 768px and 1440px in both themes. There are no console errors. The summary lists any open `TODO(shivam)` items.