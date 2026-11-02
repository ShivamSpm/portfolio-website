// Skills, grouped. Source of truth: docs/PLAN.md Section 6.6.
// `usedIn` only links stories whose stack or text in the plan names the skill.
import type { SkillGroup } from "./types";

export const skillGroups: SkillGroup[] = [
  {
    title: "Languages",
    skills: [
      {
        name: "Python",
        usedIn: ["ai-agents", "hackathon-3rd-place", "appeal-agent", "incident-investigator"],
      },
      {
        name: "TypeScript",
        usedIn: ["ai-agents", "vacate", "hollow-manor", "appeal-agent", "incident-investigator"],
      },
      { name: "JavaScript", usedIn: ["faster-api"] },
      { name: "C#", usedIn: ["faster-api", "missing-errors"] },
      { name: "SQL", usedIn: ["faster-api"] },
    ],
  },
  {
    title: "Frontend",
    skills: [
      { name: "React", usedIn: ["vacate", "hollow-manor", "incident-investigator"] },
      { name: "Next.js", usedIn: ["vacate", "appeal-agent"] },
      { name: "Angular" },
      { name: "Tailwind CSS", usedIn: ["vacate", "hollow-manor"] },
    ],
  },
  {
    title: "Backend",
    skills: [
      { name: "Node.js" },
      { name: "FastAPI", usedIn: ["appeal-agent", "incident-investigator"] },
      { name: ".NET / Entity Framework", usedIn: ["faster-api"] },
      { name: "REST APIs" },
    ],
  },
  {
    // "LangChain-style multi-agent workflows" is omitted, as the plan allows when unsure.
    title: "AI engineering",
    skills: [
      {
        name: "AI agents",
        usedIn: ["ai-agents", "vacate", "hollow-manor", "appeal-agent", "incident-investigator"],
      },
      { name: "MCP", usedIn: ["ai-agents", "vacate", "incident-investigator"] },
      { name: "A2A", usedIn: ["vacate"] },
      { name: "evals", usedIn: ["ai-agents", "appeal-agent", "incident-investigator"] },
      { name: "tracing", usedIn: ["ai-agents"] },
      { name: "OpenTelemetry", usedIn: ["incident-investigator"] },
      { name: "OpenRouter", usedIn: ["vacate"] },
      { name: "GitHub Copilot", usedIn: ["ai-agents"] },
      { name: "Codex", usedIn: ["hackathon-3rd-place", "hollow-manor"] },
      { name: "Claude Code", usedIn: ["hollow-manor"] },
    ],
  },
  {
    title: "Cloud and infra",
    skills: [
      {
        name: "AWS (Lambda, SNS, SQS, DynamoDB, CloudWatch, Cognito, CloudFormation)",
        usedIn: ["missing-errors"],
      },
      { name: "Docker", usedIn: ["incident-investigator"] },
      { name: "Vercel", usedIn: ["vacate"] },
      { name: "Supabase", usedIn: ["vacate"] },
      { name: "Datadog", usedIn: ["missing-errors"] },
    ],
  },
  {
    title: "Practices",
    skills: [
      { name: "event-driven microservices" },
      { name: "performance optimization", usedIn: ["faster-api"] },
      { name: "observability", usedIn: ["missing-errors"] },
      { name: "code review", usedIn: ["ai-agents", "hackathon-3rd-place"] },
      { name: "spec-driven development", usedIn: ["hackathon-3rd-place"] },
    ],
  },
];
