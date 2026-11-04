# Shivam Mahajan — Portfolio Website: Implementation Plan

> Hand this file to Claude Code. Put it in the repo as `docs/PLAN.md`, and add a short `CLAUDE.md` at the root that says: "Read docs/PLAN.md before doing anything. Follow its milestones in order and stop at every CHECKPOINT for Shivam's review."

- **Repo:** https://github.com/ShivamSpm/portfolio-website (public)
- **Live URL:** https://shivam-mahajan-portfolio.vercel.app (Vercel Hobby plan, free; `shivam-mahajan` was taken)
- **Owner:** Shivam Mahajan, spmshivam@gmail.com

---

## 0. Rules for the implementer (read first)

1. **Never invent facts, metrics, employers, dates, or links.** Every claim on the site must come from this plan. If something is missing, leave a clearly marked `TODO(shivam)` in the content file and list it in your summary. Never ship it as made-up text.
2. Content marked **[CONFIRM]** is a draft Shivam has not approved yet. Put it in the content files with `needsReview: true` so it's easy to find. A build check should print the list of unreviewed items. It must not fail the build.
3. All copy lives in typed content files under `src/content/`, never hard-coded in components. Shivam will update content himself.
4. Work milestone by milestone (Section 11). Stop at each **CHECKPOINT**, deploy a preview, and report what changed.
5. Quality over features. A fast, polished, accessible site with fewer effects beats a heavy one.

---

## 1. Goal and audience

- **Primary audience:** founders and hiring managers. Recruiters come second.
- **Roles targeted:** Software Engineer, Full-stack Engineer, AI Engineer (entry to mid level, 3+ years of experience). Any company stage or industry.
- **The 5-second impression:** "This is a talented engineer who would move our business forward fast."
- **Positioning line:** *a full-stack engineer who builds with AI.* Lead as full-stack first, with AI as the multiplier.
- **Signature idea:** every accomplishment is a **clickable story**. It opens a pop-up that auto-plays a short visual narrative (Situation → Challenge → What I did → Result → What I learned) with a flow or architecture diagram that builds itself step by step.

### Research behind the design decisions

- The best developer portfolios share clear storytelling, a focused set of 3–6 projects, and fast load times. Case studies beat project lists.
- Reviewers decide within about 30 seconds whether to open a case study. They check layout and scannability, relevance to the role, and clarity of writing. The homepage's job is to get them to click into a story.
- Memorable minimal sites (Brittany Chiang, Sharlee) win through clear structure and deliberate restraint. Award-winning experimental sites (Bruno Simon, Adam Hartwig) win through one bold interactive idea. **We take both:** restrained editorial layout everywhere, plus one bold idea, which is living diagrams that tell each story.
- Animation must explain, not decorate: each element animates in when it becomes relevant. The page should load in under 2 seconds and work well on phones.

---

## 2. Visual direction: "Editorial × Blueprint"

A blend of two directions Shivam reviewed:
- **B · Editorial** gives the structure: a large serif headline, generous whitespace, and stories listed like a magazine table of contents with a big number on each row.
- **A · Blueprint** gives the technical layer: monospace metadata, a live system schematic in the hero, and story pop-ups with Instagram-style progress segments and self-drawing diagrams.

Light mode is "paper", dark mode is "blueprint", and a toggle switches between them. The default follows the visitor's system setting, and the choice is remembered.

### 2.1 Design tokens (CSS variables; Tailwind v4 `@theme`)

| Token | Light ("Paper") | Dark ("Blueprint") | Use |
|---|---|---|---|
| `--bg` | `#F6F6F3` | `#0B0C0E` | page background |
| `--surface` | `#FBFBF9` | `#121418` | cards, pop-up |
| `--surface-2` | `#EEEEE9` | `#171A1F` | diagram canvas, hovers |
| `--ink` | `#15171A` | `#E8EAED` | primary text |
| `--muted` | `#4A4F57` | `#A0A6AF` | secondary text (AA on bg) |
| `--faint` | `#6B7079` | `#7D838C` | tertiary, only at 14px or larger |
| `--line` | `#DCDCD6` | `#23262C` | hairlines, borders |
| `--accent` | `#2443D0` (cobalt) | `#8EA2FF` (periwinkle) | single accent: links, numbers, diagram flow |
| `--accent-soft` | `#E6E9F8` | `#1A2140` | accent backgrounds |
| `--ok` | `#1F8A4C` | `#4ADE80` | "Open to work" dot only |
| `--grid-dot` | `transparent` | `#1B1E23` | dark-mode 24px dot grid background |

- Use only one accent. No gradients, glows, emoji, or left-border accent cards.
- Every text and background pair must meet WCAG AA (4.5:1). Verify both themes.

### 2.2 Typography (via `next/font/google`, self-hosted, `display: swap`)

- **Display:** Newsreader (variable, optical sizes, regular plus italic) for the hero headline, story titles, and big numbers. Italic in accent color for emphasis words.
- **Body/UI:** Instrument Sans (400, 500, 600).
- **Mono:** Geist Mono (400, 500) for labels, metadata, step counters, diagram text, and tags.
- **Scale:** hero `clamp(48px, 7vw, 104px)` with line-height 0.98 and tracking −0.03em; story title 32–52px; body 17–19px with line-height 1.6; mono labels 12–13px uppercase with tracking +0.04em.

### 2.3 Motion principles (Motion library, `motion/react`)

- **One orchestrated hero reveal:** headline lines rise from a mask with a 120ms stagger, then the status line, CTAs, and schematic fade up.
- **Living diagrams:** edges draw with `pathLength`, "packets" (small accent dots) travel along edges in loops, and nodes fade and scale in when their step begins.
- **Count-up numbers** in the impact strip when scrolled into view (once).
- **Section reveals** on scroll: 12–18px rise plus fade, once per element. Never re-animate on scroll back.
- **Hover:** table-of-contents rows shift 12px and get an `--accent-soft` background; cards lift 3px.
- **Timing:** 200–800ms, easing `[0.2, 0.7, 0.2, 1]`.
- **`prefers-reduced-motion`:** no auto-advance, no looping packets, and everything appears instantly in its final state. Diagrams still change state per step, just without movement.
- Animate only `transform`, `opacity`, `clip-path`, and SVG `pathLength`. Never animate layout properties.

The design mockups for reference are on Shivam's design canvas, "Shivam Portfolio – Visual Directions" (artboards A and B). Treat them as a guide for direction, not as pixel specs.

---

## 3. Tech stack

- **Next.js** (latest stable, App Router), **TypeScript** in strict mode, **Tailwind CSS v4**
- **motion** (`motion/react`) for all animation
- **next-themes** for the theme toggle (class strategy, no flash on load)
- **@radix-ui/react-dialog** for the accessible pop-up (focus trap, Esc, scroll lock, ARIA)
- **@vercel/analytics** for analytics (free on Hobby)
- `lucide-react` for icons (tree-shaken), plus hand-made SVG for GitHub, LinkedIn, and X marks
- **Tooling:** ESLint, Prettier, `pnpm`. Optionally Playwright for smoke tests of the modal flow.
- **No** Three.js, heavy UI kits, CMS, or database. The entire site is static (SSG).

---

## 4. Information architecture and routes

```
/                       Home (all sections)
/stories/[slug]         Story as a full page (shareable link, SEO, used on hard refresh)
(.)stories/[slug]       Same story intercepted as a pop-up over Home (Next.js parallel + intercepting routes, @modal slot)
/for/[company]          Renders Home unchanged; noindex. Used as a per-company tracking link (Section 9)
/opengraph-image        Site OG image (next/og)
/stories/[slug]/opengraph-image   Per-story OG image
/sitemap.xml, /robots.txt
```

- Clicking a story on Home uses a soft navigation to `/stories/[slug]`, so the pop-up opens and the URL changes. That makes stories shareable and lets each open count as a page view in analytics.
- Closing the pop-up calls `router.back()`, or `router.push('/')` if there's no history.
- Loading `/stories/[slug]` directly renders the full-page version with the same `StoryPlayer` component, plus "← All work" and "Next story" links.
- All story slugs come from `generateStaticParams`, so everything is prerendered.

### Home page sections, in order

1. **Nav (sticky, slim):** the name "Shivam Mahajan" in serif links to the top. Links: Work · Projects · Experience · About · Resume (external) · theme toggle. On mobile the links collapse into a simple menu sheet.
2. **Hero:**
   - **Left:** status row ("● Open to work · San Francisco · Remote or onsite"), then the serif headline, sub-copy, and CTAs: *Read the stories* (primary) and *Resume (PDF)*, plus GitHub, LinkedIn, and X icon buttons.
   - **Right:** the *"How I build"* live schematic (Blueprint style, mono labels). It shows Interface → APIs → AI agents, with an AWS foundation bar beneath and packets flowing.
3. **Impact strip:** four big numbers with count-up, each a button that opens its story: −80%, −60%, 10%, 3rd.
4. **Selected work** (editorial table of contents): four rows with number, serif title, mono category, and big accent metric on the right. Each row opens a story pop-up.
5. **Projects:** a 2×2 grid of cards. Each card has a title, one-line pitch, stack tags, badges (`Hackathon build`, `Live demo`, `In progress`), and a small animated thumbnail of its own diagram. Each card opens a story pop-up. Repo and demo links appear inside the story.
6. **Experience timeline:** a vertical timeline with a mono date column and serif role titles, with an expandable "Highlights" list per role.
7. **Skills:** grouped. Each skill links to where it was used ("used in: The 80% faster API"), not a logo wall.
8. **About and outside of work:** a short bio plus three small items for Boxing, Swimming, and Hiking (icon and name only, Section 6.5).
9. **Contact and footer:** "Let's build something." Shows email (copy button and mailto), phone, GitHub, LinkedIn, X, Resume, and an "Open to work" line. Then a small footer: © 2026 Shivam Mahajan · Built with Next.js, deployed on Vercel · link to the source repo.

---

## 5. The story pop-up ("StoryPlayer")

The heart of the site. Build it once as a generic, data-driven component.

### 5.1 Layout (desktop at 1024px or wider)

- Radix Dialog, max width 1120px, centered, `--surface` background. The backdrop dims the page with an 8px blur. The dialog opens with a 24px rise, scale from 0.98 to 1, and a fade.
- **Top:** five progress segments (Instagram-stories style). Finished segments are filled, the current one fills over its duration, and future ones are empty.
- **Header:** a mono label (`STORY 02 · MINDEX · BACKEND PERFORMANCE`), the serif title (accent italic on the key word), badges, and a close button (44px, `aria-label="Close story"`).
- **Body:** two columns.
  - **Left (about 60%):** the diagram canvas (`--surface-2`, mono labels, rounded 14px). In dark mode the dot grid shows behind it.
  - **Right (about 40%):** step counter (`03 / 05 — WHAT I DID`), step heading (serif, 26px), body (17px), and stack chips on the "What I did" step.
- **Footer:** step chapter list (clickable: Situation · Challenge · What I did · Result · Learned), Previous, Pause/Play, and Next. On the last step, Next becomes **"Next story →"**, which navigates to the next story's slug.

### 5.2 Layout (mobile, under 768px)

- Full-screen sheet. Progress segments at the top. Diagram on top at about 45vh, with step text below and scrollable.
- Tap the right 30% of the diagram for next, the left 30% for previous. A horizontal swipe also navigates steps.
- Diagrams switch to their `mobile` layout (vertical flow), as defined in the content.

### 5.3 Behavior

- **Auto-advance:** each step lasts `step.durationMs`, about 7000ms by default. To keep this readable, base it on word count: `max(6000, words × 260ms)`.
- **Pauses automatically** while the pointer is over the dialog, while anything inside has keyboard focus, after any manual navigation (resuming after 10 seconds of no interaction), or when the tab is hidden.
- **Keyboard:** ←/→ move between steps, Space toggles pause, Esc closes. Focus is trapped, and focus returns to the trigger on close.
- Never auto-advance into the next story. The visitor chooses that.
- With reduced motion, auto-advance is off by default and a "Play" button is shown.
- **Analytics:** opening the story is a page view (its own URL). Step views are not tracked; custom events aren't available on Hobby.

### 5.4 Diagram engine

- **`<FlowDiagram spec state />`:** renders an SVG with a `viewBox`, so it scales responsively. Nodes are rounded rectangles with a label and a mono sub-label. Edges are straight or orthogonal paths with arrowheads. Optional `group` bands (dashed outline with a label) and `annotations` (callouts).
- **Each step declares a `diagramState`:** `{ show: string[]; highlight?: string[]; flow?: string[]; dim?: string[]; annotate?: string[] }`.
  - Elements not in `show` are hidden.
  - Newly shown elements animate in: nodes fade and scale, edges draw.
  - `highlight` shows an accent border and accent label.
  - `flow` runs looping packets along those edges.
  - `dim` drops opacity to 0.35.
- This is what makes the visual follow the story: the same diagram evolves across the five steps.
- **Custom diagram components** for stories that need them, each driven by the same `step` index prop:
  - `<WaterfallDiagram>` for the API story (before vs after request timeline)
  - `<LossDiagram>` for the missing-errors story (dropping packets)
  - `<LoopDiagram>` for the hackathon workflow (circular spec-driven loop)
  - `<PhotoStrip>` for hackathon photos, on the Result step
- **Accessibility:** each diagram is `role="img"` with an `aria-label` summarizing the current state. The step text is the full text alternative.

---

## 6. Content (source of truth)

All facts below come from Shivam's resume, his GitHub READMEs, and his LinkedIn post. Do not add to them.

### 6.1 Profile (`src/content/site.ts`)

```ts
name: "Shivam Mahajan"
role: "Full-stack engineer who builds with AI"
location: "San Francisco, CA"
availability: { openToWork: true, text: "Open to work · Remote or onsite" }
email: "spmshivam@gmail.com"
phone: "(585) 743-8485"            // Shivam approved showing it
links: {
  github: "https://github.com/ShivamSpm",
  linkedin: "https://www.linkedin.com/in/shivamspm/",
  x: "https://x.com/Shivam_Spm",
  repo: "https://github.com/ShivamSpm/portfolio-website",
}
resumeUrl: "TODO(shivam): Google Drive share link"   // see Section 8
siteUrl: "https://shivam-mahajan-portfolio.vercel.app"
```

### 6.2 Hero copy

- **Headline**, in three lines for the mask reveal: "A full-stack engineer / who builds with *AI —* / and ships it." The italic accent goes on "AI —".
- **Sub-copy:** "I'm Shivam. 3+ years building React and TypeScript products, AWS backends, and AI agents with tracing and evals. Every story below opens into how it actually happened."
- **Schematic** (labels only, no fake data):
  - Interface (React · Next.js · TypeScript) → APIs (C# · FastAPI · Node) → AI agents (MCP · tools · evals)
  - Foundation bar: "AWS — Lambda · SNS/SQS · DynamoDB · CloudWatch"
  - Mono caption: `// how I build`

### 6.3 Impact strip

| Number | Caption | Opens |
|---|---|---|
| −80% | API response time | `faster-api` |
| −60% | manual effort with AI agents | `ai-agents` |
| 10% | of error messages were silently lost. Found and fixed. | `missing-errors` |
| 3rd | place, AI-Native Talent Hunt Hackathon, SF Tech Week 2026 | `hackathon-3rd-place` |

### 6.4 Stories

Story type (`src/content/stories.ts`):

```ts
type StepId = "situation" | "challenge" | "approach" | "result" | "learned";
interface Story {
  slug: string;
  section: "work" | "project";
  order: number;
  title: string;            // serif title
  titleAccent?: string;     // word(s) rendered in accent italic
  org: string;              // e.g. "Mindex" or "Hackathon build"
  category: string;         // mono label, e.g. "Backend performance"
  metric?: { value: string; label: string };
  pitch: string;            // one line for cards and TOC
  badges?: ("hackathon" | "live" | "in-progress")[];
  stack: string[];
  links?: { label: string; href: string }[];
  diagram: DiagramSpec | { custom: "waterfall" | "loss" | "loop" };
  steps: { id: StepId; heading: string; body: string; diagramState?: DiagramState; needsReview?: boolean }[];
}
```

Below, **[CONFIRM]** marks drafted wording Shivam must approve, and **TODO(shivam)** marks missing information.

---

#### WORK 01: `ai-agents`, "AI agents that plan and ship code"

- **Org / category:** Mindex · AI engineering. **Metric:** −60% manual effort.
- **Stack:** Python, TypeScript, Azure DevOps, GitHub Copilot, MCP, tracing, evals.
- **Pitch:** "Agents that turn requirements into Azure DevOps plans and code changes, with tracing and evals."
- **Diagram (flow):**
  - Nodes: `req` Requirement → `plan` Planning agent → `ado` Azure DevOps plan + tasks → `impl` Implementation agent → `code` Code changes → `review` Review agents (Copilot + MCP) → `eng` Engineer **[CONFIRM: final human approval step]**.
  - A dashed group band labeled "Tracing + evals" spans `plan`, `impl`, and `review`.
  - Mobile: vertical.
- **Steps:**
  1. **Situation [CONFIRM]:** "Engineering preplanning and implementation meant a lot of repetitive manual work: turning requirements into Azure DevOps plans and tasks, making routine code changes, and reviewing them." State: show `req`, `ado`, `code`, `eng` with a "manual" label and the path dimmed.
  2. **Challenge [CONFIRM]:** "Agents that write plans and code are only useful if the team can trust them. That means seeing what an agent did and measuring whether it's getting better." State: highlight the gaps between nodes with "?" annotations.
  3. **What I did:** "I built AI agents for engineering preplanning and implementation that create Azure DevOps plans and apply code changes, and added tracing and evals to every run. Then I built GitHub Copilot + MCP workflows for multi-agent code review and automatic task creation." State: reveal `plan`, `impl`, `review` and the tracing/evals band, with flow running through all edges.
  4. **Result:** "Manual effort on preplanning and implementation dropped by 60%. The Copilot + MCP workflows cut manual effort by another 40% in their area." Visual: two count-up numbers, −60% and −40%, with flow running.
  5. **Learned [CONFIRM]:** "Tracing and evals are what turn an agent demo into a tool a team actually relies on." State: highlight the tracing/evals band.

#### WORK 02: `faster-api`, "The 80% faster API" (titleAccent "80%")

- **Org / category:** Mindex · Backend performance. **Metric:** −80% response time.
- **Stack:** C#, SQL stored procedures, Entity Framework, parallel async calls.
- **Pitch:** "Swapped ORM queries for stored procedures and parallelized the database calls."
- **Diagram:** custom `waterfall`.
  - **Before:** three bars, "query 1/2/3", in sequence, staircase.
  - **After:** three shorter bars starting at t=0 in parallel, totaling about 20% of the before width.
  - Caption: "Bar lengths are illustrative; the 80% drop is the real result."
- **Steps:**
  1. **Situation:** "An API endpoint built its response from three Entity Framework LINQ queries, run one after another." Visual: the before waterfall draws bar by bar.
  2. **Challenge [CONFIRM]:** "Each call waited for the previous one, so the endpoint's latency was the sum of three database round trips, plus the overhead of ORM-generated queries." Visual: total-time bracket over the before bars.
  3. **What I did:** "I replaced the Entity Framework LINQ queries with SQL stored procedures and parallelized the three database calls in C#, so the endpoint waits for the slowest call instead of the sum of all three." Visual: the after bars grow in parallel.
  4. **Result:** "Response time for the endpoint dropped by 80%. The same instinct worked elsewhere: batching translation API requests in JavaScript made that flow 80% faster too." Visual: big −80% plus a small secondary "−80% · batched translation requests" chip.
  5. **Learned [CONFIRM]:** "Find where the time actually goes before optimizing. The biggest win came from changing *how* work was scheduled, not from micro-tuning code." Visual: both timelines side by side.

#### WORK 03: `missing-errors`, "The case of the missing errors"

- **Org / category:** Mindex · Reliability / observability. **Metric:** 10% of errors were vanishing.
- **Stack:** C#, AWS CloudWatch, Datadog.
- **Pitch:** "1 in 10 error messages never arrived. I led the production logging overhaul that fixed it."
- **Diagram:** custom `loss`.
  - **Before:** packets flow from "C# application" toward "Logs", and about 1 in 10 packets fall away (shown in muted color, not red).
  - **After:** C# application → structured production logging → AWS CloudWatch → Datadog, with no drops.
- **Steps:**
  1. **Situation:** "A production C# application was losing about 10% of its error messages before anyone could see them." Visual: before state with dropping packets.
  2. **Challenge:** "TODO(shivam): what made it hard? (root cause, why it wasn't obvious)." Show this step only once content exists; until then the story has four steps.
  3. **What I did:** "I spearheaded the end-to-end implementation of production logging for the application in AWS CloudWatch and Datadog." Visual: after pipeline draws in.
  4. **Result:** "The issue that was silently dropping 10% of error messages was resolved, so failures became visible and debuggable." Visual: no drops, with a counter showing "10% lost → resolved".
  5. **Learned [CONFIRM]:** "Observability is a feature. If you can't see a failure, you can't fix it."

#### WORK 04: `hackathon-3rd-place`, "Third place at SF Tech Week"

- **Org / category:** AI-Native Talent Hunt Hackathon · Oct 2026. **Metric:** 3rd place. **Badge:** hackathon.
- **Hosts:** Emergence Labs × TinyFish **[CONFIRM spelling: the LinkedIn post shows "Emergences Labs"]**.
- **Stack:** Codex, Claude, Python **[CONFIRM languages used]**, spec-driven development.
- **Pitch:** "Solved real problems from OpenArt and Dify with a spec-driven workflow using AI coding agents."
- **Diagram:** custom `loop`. A circular workflow: Spec + input data → Plan with Codex → Ask questions first → Implement → Review important code myself → Second review with Claude → Check against acceptance criteria → (loop back to Spec when something is missing). Two side panels show mini flows for each challenge:
  - **OpenArt:** Project memories → relevance → resolve dependencies, revisions, and conflicts → fit token budget → context for the video assistant.
  - **Dify:** Prerecorded RAG responses + product guide → evaluation harness → reproducible results → release recommendation.
- **Steps:**
  1. **Situation:** "At the AI-Native Talent Hunt Hackathon during SF Tech Week, hosted by Emergence Labs × TinyFish, every challenge was a real problem from a real company."
  2. **Challenge:** "I took on two. For OpenArt: a context picker for their video creation assistant that selects the relevant project memories within a token budget, while handling dependencies, revisions, and conflicting information. For Dify: evaluate a RAG support assistant's prerecorded responses against the product guide, build a harness that reproduces the results, and make a release recommendation." Visual: the two mini flows.
  3. **What I did:** "I worked spec-first with Codex: gave it the specifications and input data, worked through a plan, and went back to the acceptance criteria whenever something was missing. I reviewed important code myself, which is how I caught a type-checking warning in the Dify evaluation code. We fixed it and confirmed the tests still passed. Then I used Claude as a second reviewer." Visual: the loop animates around.
  4. **Result:** "3rd place." Visual: `<PhotoStrip>` with hackathon photos (TODO(shivam): add photos to `public/images/hackathon/`). Until photos exist, show a large "3rd" medal-style number.
  5. **Learned:** "Ask questions before writing code. Keep the conversation open and ask the agent to challenge your understanding. Review important code yourself. Use a second model as a code-review step."

#### PROJECT 01: `vacate`, "Vacate: an AI move-out agent"

- **Badges:** hackathon, live. **Org:** Built at the Personal Agents Hackathon, San Francisco, Oct 2026 **[CONFIRM: solo or team? your role?]**.
- **Stack:** TypeScript, Next.js, React, Tailwind, Supabase (Auth, Postgres, Storage), OpenRouter, Zod, MCP, A2A, Telegram Bot API, Bland, Vercel, Vitest.
- **Links:**
  - Live demo: https://ai-moveout-automation-agent-tau.vercel.app
  - Demo video: https://youtu.be/mS64XBHnGX0
  - Code: https://github.com/ShivamSpm/ai-moveout-automation-agent
- **Pitch:** "A personal agent that handles a renter's move-out: lease, listings, buyer negotiation, with human approval on every outbound action."
- **Diagram (flow):**
  - Inputs: Lease PDF, Item photos, Buyer messages → Agent (OpenRouter) → **Policy layer in code** (price floor · pickup deadline · address checks) → **Review card** (approval bound to a hash of the exact content) → Channels: Telegram · Muse via MCP/A2A · Bland calls.
  - Data store: Supabase (row-level security).
  - Tagline on the diagram: "The model proposes. The code decides."
- **Steps:**
  1. **Situation:** "Moving out means reading a lease, chasing a landlord, booking cleaners and movers, and selling everything you own, all before a hard deadline."
  2. **Challenge:** "An agent that sends messages and makes deals on your behalf has to be safe: no deals below your minimum, no duplicate sends, no acting on injected instructions."
  3. **What I did:** "Built Vacate: the lease becomes a dated checklist with page references, a photo becomes a draft listing, and the agent negotiates with buyers in parallel. Every outbound action becomes a review card whose approval is tied to a hash of the exact content. Policy checks run in code, not in the prompt." State: reveal the policy layer, then the review card.
  4. **Result:** "Live: accounts, lease-to-checklist, photo-to-listing, and Telegram selling with agent negotiation. The same tools are exposed over MCP and A2A so other agents can act for the renter." Also: "Engineering details: exactly-once external actions via an atomic claim, one active buyer per item via a partial unique index, row-level security everywhere, a per-instance spend cap, and prompt-injection defenses."
  5. **Learned [CONFIRM]:** "Let the model propose and the code decide. Guardrails belong in code you can test."

#### PROJECT 02: `hollow-manor`, "Hollow Manor: AI agents escape a haunted house"

- **Badge:** hackathon. **Org:** Haunted Hacks: Realtime AI Edition · Oct 31, 2026 · built in 5 hours · team of 2. Shivam owned the backend (engine, actor, orchestrator).
- **Stack:** TypeScript, Bun, React, Vite, Tailwind, Motion, Agent Relay, Durable Actors, Claude Code, Codex CLI, ElevenLabs, OpenAI speech-to-text.
- **Links:**
  - Demo video: https://youtu.be/TuA9KB2804E
  - Code: https://github.com/ShivamSpm/ai-agents-collaboration-escape-room
- **Pitch:** "Three AI agents from two vendors, each with private knowledge, coordinate in real time to escape."
- **Diagram (flow):**
  - Three agent nodes: Medium (Claude Code, reads clues), Electrician (Codex CLI, controls power), Locksmith (Codex CLI, enters codes) → Agent Relay `#manor` channel → Orchestrator → Manor (Durable Actor + deterministic rules engine, 21 unit tests) → Live web UI.
  - An operator node feeds the orchestrator ("whisper orders, collapse a corridor").
- **Steps:**
  1. **Situation:** "Can AI agents from different vendors cooperate when none of them has the full picture?"
  2. **Challenge:** "Each agent knows things the others don't. The game state must stay correct even if agents misfire or the server crashes mid-run."
  3. **What I did:** "I built the backend: a pure TypeScript rules engine that validates every action, a Durable Actor that owns game state and persists each action, and an orchestrator that spawns the agents, turns their messages into actions, and queues actions through outages." State: flow from agents to engine.
  4. **Result:** Three stat cards:
     - "Clean run: escaped in 36s, 15 actions, 0 failed."
     - "Corridor collapsed mid-run: replanned via a secret passage, escaped in 90s, 21 actions, 0 failed."
     - "Server killed mid-run: resumed at the same state, no actions lost or duplicated."
  5. **Learned [CONFIRM]:** "Agents propose, a deterministic engine decides. That's what makes multi-agent systems reliable and replayable."

#### PROJECT 03: `appeal-agent`, "AI Health Insurance Appeal Agent"

- **Badge:** in-progress.
- **Stack:** Python, TypeScript, Next.js, FastAPI, Hermes Agent, Crusoe.
- **Links:** Code: https://github.com/ShivamSpm/ai-health-insurance-appeal-agent
- **Pitch:** "Drafts policy-cited insurance appeals from denial letters, for human review."
- **Diagram (flow):** Denial letter + Plan document → Classify denial reason → Find governing plan clause → List missing evidence → Compute appeal deadline → Draft appeal (every claim cites the plan) → Human review. Side node: "40-case eval suite" feeding back into the agent. Footnote: "Synthetic data from a fictional insurer, no real patient data."
- **Steps:**
  1. **Situation:** "Appealing a denied health-insurance claim means decoding a denial letter, digging through a plan document, and hitting a deadline."
  2. **Challenge:** "Every claim in an appeal has to be correct and traceable to the plan. A confident but wrong draft is worse than none."
  3. **What I did:** "Built an agent that explains the denial, finds the governing clause, lists missing evidence, computes the deadline, and drafts a plan-cited appeal. It never sends anything; a human reviews and edits. Built a 40-case eval suite to measure it."
  4. **Result:** "Evals raised denial-classification accuracy from 72% to 93% and cut cost per case by 45%." Visual: a bar from 72 animating to 93, and a −45% chip.
  5. **Learned [CONFIRM]:** "Evals first. You can't improve an agent you can't measure."

#### PROJECT 04: `incident-investigator`, "AI Incident Investigator"

- **Badge:** in-progress.
- **Stack:** Python, TypeScript, React, FastAPI, Hermes Agent, MCP, OpenTelemetry, Docker.
- **Links:** Code: https://github.com/ShivamSpm/AI-Incident-Investigator
- **Pitch:** "An agent that correlates logs, metrics, traces, and dependencies to find the root cause, with human-approved fixes."
- **Diagram (flow):** React console → FastAPI (incident state, evidence, approval checks) → Hermes agent (+ versioned skills) → typed MCP tools → OpenTelemetry telemetry. A remediation node sits behind an "approval gate" and is limited to allowlisted actions. Label the planned parts "planned".
- **Steps:**
  1. **Situation:** "When a service fails, engineers jump between logs, metrics, and traces to find out why."
  2. **Challenge:** "An AI investigator must cite real evidence, say 'inconclusive' when the evidence isn't there, and never run unsafe fixes."
  3. **What I'm building:** "A deterministic baseline today: read-only tools, evidence-linked JSON diagnoses, a versioned investigation skill, and regression evals. Next: Hermes agent, MCP tools, OpenTelemetry data, and a React console."
  4. **Result (so far):** "Baseline diagnoses a sample checkout/payment incident with evidence IDs, and returns 'inconclusive' when evidence is missing." Clearly labeled "in progress".
  5. **Learned / next [CONFIRM]:** "Design the safety boundary first: the agent investigates, the application decides what's allowed."

### 6.5 Experience timeline (`src/content/experience.ts`)

- **Software Engineer, Mindex** · Oct 2023 – Jul 2026. Show no location.
  - Led a team of 3 developers, working with clients on end-to-end enhancements across 3 event-driven microservices (C#, Angular, AWS Lambda, CloudFormation).
  - Built a dashboard web app (Python, React, TypeScript, SQL, AWS) that saves stakeholders 50+ hours of analysis each quarter.
  - Turned ambiguous customer requirements into Python and SQL automation, reducing manual effort by 50%.
  - Links to stories: AI agents, the 80% faster API, the missing errors.
- **Software Engineer Intern, Mindex** · Jan 2022 – Aug 2022
  - Built a billing system (Python, React, TypeScript) that made payment processing 30% more efficient.
  - Caught a major bug in code review that prevented updates to 1M+ database records (team of 11, Agile).
  - Integrated AWS Cognito with C# and SQL, reducing invalid access attempts by 50%.
  - Designed a serverless integration architecture (CloudFormation, Lambda, DynamoDB, SNS, SQS) that decoupled services and reduced critical failures by 20%.
- **MS Computer Science, Rochester Institute of Technology** · Aug 2020 – Aug 2023 · GPA 3.79/4.0
- **Awards and certifications:**
  - 3rd Place, AI-Native Talent Hunt Hackathon, SF Tech Week · Oct 2026 (links to the story)
  - AWS Certified Developer – Associate

### 6.6 Skills (`src/content/skills.ts`)

Grouped, with "used in" links to story slugs where applicable:

- **Languages:** Python, TypeScript, JavaScript, C#, SQL
- **Frontend:** React, Next.js, Angular, Tailwind CSS
- **Backend:** Node.js, FastAPI, .NET / Entity Framework, REST APIs
- **AI engineering:** AI agents, MCP, A2A, evals, tracing, OpenTelemetry, LangChain-style multi-agent workflows (omit this one if unsure), OpenRouter, GitHub Copilot, Codex, Claude Code
- **Cloud and infra:** AWS (Lambda, SNS, SQS, DynamoDB, CloudWatch, Cognito, CloudFormation), Docker, Vercel, Supabase, Datadog
- **Practices:** event-driven microservices, performance optimization, observability, code review, spec-driven development

### 6.7 About and outside of work

- **About [CONFIRM]:** "I'm a full-stack engineer in San Francisco. I've spent 3+ years shipping React and TypeScript products and AWS backends, and lately building AI agents that teams can trust, with tracing, evals, and humans in the loop. I like turning vague problems into working software quickly."
- **Outside of work:** Boxing · Swimming · Hiking, each with a simple line icon and its name only. No invented details.

---

## 7. Project structure

```
src/
  app/
    layout.tsx               fonts, ThemeProvider, <Analytics/>, metadata, JSON-LD Person
    page.tsx                 Home
    @modal/default.tsx       returns null
    @modal/(.)stories/[slug]/page.tsx   intercepted pop-up
    stories/[slug]/page.tsx  full-page story
    stories/[slug]/opengraph-image.tsx
    for/[company]/page.tsx   renders <Home/>, robots noindex
    opengraph-image.tsx
    sitemap.ts, robots.ts, not-found.tsx
  components/
    nav/, hero/ (Headline, Schematic), impact/, work-toc/, projects/, timeline/, skills/, about/, contact/
    story/ (StoryDialog, StoryPlayer, ProgressSegments, StepPanel, StepControls)
    diagrams/ (FlowDiagram, WaterfallDiagram, LossDiagram, LoopDiagram, PhotoStrip, Packet)
    ui/ (Button, Badge, Chip, ThemeToggle, CopyEmail, Icon)
  content/ site.ts, stories.ts, experience.ts, skills.ts
  lib/ motion.ts (shared variants and easing), useAutoAdvance.ts, useReducedMotion.ts
  styles/globals.css         Tailwind v4 + tokens
public/
  images/hackathon/          (Shivam adds photos)
docs/PLAN.md
scripts/check-content.ts     lists needsReview and TODO(shivam) items
```

---

## 8. Resume (dynamic, via Google Drive)

- The Resume button links to `site.resumeUrl` and opens in a new tab.
- **TODO(shivam):** set the link. Instructions for Shivam, to put in the README:
  1. Upload the resume PDF to Google Drive, then choose Share → "Anyone with the link" → Viewer, and copy the link.
  2. **To update it later without changing the link:** right-click the file in Drive → File information → **Manage versions → Upload new version**. The link stays the same, so the website never needs to change.
- If the link is still unset at build time, hide the Resume button rather than linking to nothing.

---

## 9. Analytics (free)

- Enable **Vercel Web Analytics** for the project in the Vercel dashboard, and add `<Analytics />` in `layout.tsx`.
- **What it shows:** page views, top pages, referrers (for example LinkedIn), countries, and devices. The Hobby plan includes 50,000 events per month with 1 month of history, which is plenty here.
- Vercel can't tell you *who* visited by name.
- **Which stories get opened:** each story is its own URL, so story opens appear as page views (for example `/stories/faster-api`). Hobby doesn't include custom events, so don't rely on them.
- **Per-company tracking links:**
  - `/for/[company]` (for example `/for/stripe`) shows the normal homepage and is `noindex`.
  - When Shivam applies somewhere, he sends that company's link. Views of `/for/stripe` in analytics mean someone opened it.
  - Use the README to explain this.
  - The page must not show any company name or greeting.

---

## 10. Quality bar (acceptance criteria)

- **Performance:** Lighthouse mobile scores of 95 or higher for Performance, Accessibility, Best Practices, and SEO. LCP under 2.0s, CLS under 0.05, INP under 200ms. Home JavaScript should be about 240 KB gzipped at most (raised from 170 KB in M6: React and Next.js alone are about 150 KB).
- **Responsive:** looks right at 360, 390, 768, 1024, 1280, and 1440px, with no horizontal scroll at any width.
- **Accessibility:**
  - Full keyboard support, visible focus rings, and correct pop-up focus handling.
  - AA contrast in both themes.
  - `prefers-reduced-motion` respected.
  - Alt text on all images.
  - Diagrams have `role="img"` and labels.
- **Theme:** no flash of the wrong theme on load, and the toggle is remembered.
- **SEO and sharing:**
  - Per-page `<title>`/description, canonical URLs, and a sitemap.
  - An OG image that looks good when shared on LinkedIn and Slack: name, positioning line, and accent. Per-story OG images use the story title and metric.
- **Content check:** `pnpm check:content` prints every `needsReview` and `TODO(shivam)` item.
- **No console errors.** Run TypeScript strict and ESLint clean.

---

## 11. Milestones (stop at each CHECKPOINT)

1. **M0 · Scaffold.** Next.js, TypeScript, Tailwind v4, Motion, next-themes, Radix Dialog, and Vercel Analytics. Add tokens, fonts, the theme toggle, and the base layout. Add `docs/PLAN.md`, `CLAUDE.md`, and a README covering how to run it, edit content, and update the resume.
2. **M1 · Content layer.** Put all content from Section 6 into typed files and add `scripts/check-content.ts`.
3. **M2 · Home page, static.** Build all nine sections with real content. Add responsive layouts. No animation yet. **CHECKPOINT:** preview deploy so Shivam can review copy and layout.
4. **M3 · Motion pass on Home.** Hero reveal, live schematic, count-ups, section reveals, hovers, and reduced-motion handling.
5. **M4 · StoryPlayer + first story.** Build the dialog, routes (intercepting + full page), auto-advance, controls, and keyboard/swipe. Build `faster-api` fully with `WaterfallDiagram`. **CHECKPOINT:** Shivam reviews the feel of the story interaction before the rest are built.
6. **M5 · Remaining stories.** Build `FlowDiagram`, `LossDiagram`, and `LoopDiagram`, then all eight stories, project card thumbnails, and "Next story" chaining. **CHECKPOINT.**
7. **M6 · Polish.** OG images, SEO, sitemap/robots, JSON-LD, the `/for/[company]` route, the 404 page, accessibility and performance audits against Section 10, and cross-browser checks (Chrome, Safari, Firefox, iOS Safari).
8. **M7 · Launch.** Shivam imports the repo into Vercel (steps below), enables Web Analytics, and checks the live site against Section 10.

### Vercel setup (Shivam does this once)

1. Sign in at vercel.com with GitHub, then choose **Add New → Project → Import** `ShivamSpm/portfolio-website`.
2. Set the project name to `shivam-mahajan`, which gives the address `shivam-mahajan.vercel.app` if it's available. Keep the framework preset as Next.js and click Deploy.
3. Go to Project → **Analytics** → Enable Web Analytics.
4. Every push to `main` now redeploys automatically, and every pull request gets a preview URL.

---

## 12. Open items for Shivam

| # | Item | Needed by |
|---|---|---|
| 1 | Google Drive resume link | M6 |
| 2 | Hackathon photos (2–4 images) in `public/images/hackathon/` | M5 |
| 3 | Missing-errors story: what caused the 10% loss, and what made it hard? | M5 |
| 4 | Approve or edit every [CONFIRM] line (story steps, "What I learned", About) | M5 |
| 5 | Vacate: solo or team, and your role | M5 |
| 6 | Hackathon host spelling ("Emergence Labs"?) and the languages you used | M5 |
| 7 | AI agents story: is the final step a human/engineer approval? | M5 |