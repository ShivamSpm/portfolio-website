// Home page copy and interface labels. Source of truth: docs/PLAN.md Sections 4, 5, 6.2, 6.3 and 6.7.
import type { Badge, StepId, StorySlug } from "./types";

export const nav = {
  links: [
    { label: "Work", href: "/#work" },
    { label: "Projects", href: "/#projects" },
    { label: "Experience", href: "/#experience" },
    { label: "About", href: "/#about" },
  ],
  resumeLabel: "Resume",
  menuLabel: "Menu",
  closeMenuLabel: "Close menu",
} as const;

export const hero = {
  status: "Open to work · San Francisco · Remote or onsite",
  // Three lines for the mask reveal. `accent` is rendered in accent italic.
  headline: ["A full-stack engineer", "who builds with AI —", "and ships it."],
  accent: "AI —",
  subcopy:
    "I'm Shivam. 3+ years building React and TypeScript products, AWS backends, and AI agents with tracing and evals. Every story below opens into how it actually happened.",
  primaryCta: { label: "Read the stories", href: "#work" },
  resumeCta: "Resume (PDF)",
  // "How I build" schematic: labels only, no data.
  schematic: {
    caption: "// how I build",
    ariaLabel:
      "How I build: an interface layer (React, Next.js, TypeScript) feeds APIs (C#, FastAPI, Node), which feed AI agents (MCP, tools, evals), all on an AWS foundation (Lambda, SNS/SQS, DynamoDB, CloudWatch).",
    layers: [
      { label: "Interface", items: ["React", "Next.js", "TypeScript"] },
      { label: "APIs", items: ["C#", "FastAPI", "Node"] },
      { label: "AI agents", items: ["MCP", "tools", "evals"] },
    ],
    foundation: { label: "AWS", items: ["Lambda", "SNS/SQS", "DynamoDB", "CloudWatch"] },
  },
} as const;

export const impact: { value: string; caption: string; story: StorySlug }[] = [
  { value: "−80%", caption: "API response time", story: "faster-api" },
  { value: "−60%", caption: "manual effort with AI agents", story: "ai-agents" },
  {
    value: "10%",
    caption: "of error messages were silently lost. Found and fixed.",
    story: "missing-errors",
  },
  {
    value: "3rd",
    caption: "place, AI-Native Talent Hunt Hackathon, SF Tech Week 2026",
    story: "hackathon-3rd-place",
  },
];

export const sections = {
  work: { id: "work", title: "Selected work" },
  projects: { id: "projects", title: "Projects" },
  experience: { id: "experience", title: "Experience" },
  skills: { id: "skills", title: "Skills" },
  about: { id: "about", title: "About" },
  contact: { id: "contact", title: "Let's build something." },
} as const;

export const about = {
  bio: {
    text: "I'm a full-stack engineer in San Francisco. I've spent 3+ years shipping React and TypeScript products and AWS backends, and lately building AI agents that teams can trust, with tracing, evals, and humans in the loop. I like turning vague problems into working software quickly.",
    needsReview: true,
  },
  outsideTitle: "Outside of work",
  // Icon and name only. No invented details.
  outside: [
    { name: "Boxing", icon: "boxing" },
    { name: "Swimming", icon: "swimming" },
    { name: "Hiking", icon: "hiking" },
  ],
};

export const contact = {
  copyEmailLabel: "Copy email",
  copiedLabel: "Copied",
  emailLabel: "Email",
  phoneLabel: "Phone",
};

export const footer = {
  copyright: "© 2026 Shivam Mahajan",
  builtWith: "Built with Next.js, deployed on Vercel",
  sourceLabel: "Source",
};

export const socialLabels = {
  github: "GitHub",
  linkedin: "LinkedIn",
  x: "X",
} as const;

export const badgeLabels: Record<Badge, string> = {
  hackathon: "Hackathon build",
  live: "Live demo",
  "in-progress": "In progress",
};

export const timeline = {
  highlightsLabel: "Highlights",
  educationTitle: "Education",
  awardsTitle: "Awards and certifications",
  storiesLabel: "Stories",
};

export const skillsCopy = {
  usedInLabel: "used in:",
};

// Story pop-up and full-page story.
export const storyUi = {
  stepLabels: {
    situation: "Situation",
    challenge: "Challenge",
    approach: "What I did",
    result: "Result",
    learned: "Learned",
  } satisfies Record<StepId, string>,
  storyLabel: "Story",
  projectLabel: "Project",
  roleLabel: "My role",
  loadingLabel: "Loading story",
  chaptersLabel: "Chapters",
  stepsLabel: "Story steps",
  diagramStepLabel: "Current step",
  diagramShownLabel: "Shown",
  close: "Close story",
  previous: "Previous",
  next: "Next",
  nextStory: "Next story →",
  pause: "Pause",
  play: "Play",
  allWork: "← All work",
  stackLabel: "Stack",
  linksLabel: "Links",
  plannedLabel: "planned",
};

// Search and link-preview text.
export const seo = {
  description:
    "Shivam Mahajan is a full-stack engineer who builds with AI: React and TypeScript products, AWS backends, and AI agents with tracing and evals.",
  ogAlt: "Shivam Mahajan, a full-stack engineer who builds with AI",
};

export const notFoundCopy = {
  label: "404",
  title: "This page doesn't exist.",
  body: "The link may be old or mistyped. The stories are all on the home page.",
  homeLink: "Back to home",
};

// Screen-reader text and control names.
export const ui = {
  skipToContent: "Skip to content",
  themeToggle: "Switch between light and dark theme",
  homeLink: "Shivam Mahajan, back to top",
  newTab: "(opens in a new tab)",
  primaryNav: "Primary",
} as const;
