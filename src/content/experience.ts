// Experience timeline. Source of truth: docs/PLAN.md Section 6.5.
import type { Award, Education, Role } from "./types";

export const roles: Role[] = [
  {
    title: "Software Engineer",
    org: "Mindex",
    dates: "Oct 2023 – Jul 2026",
    highlights: [
      "Led a team of 3 developers, working with clients on end-to-end enhancements across 3 event-driven microservices (C#, Angular, AWS Lambda, CloudFormation).",
      "Built a dashboard web app (Python, React, TypeScript, SQL, AWS) that saves stakeholders 50+ hours of analysis each quarter.",
      "Turned ambiguous customer requirements into Python and SQL automation, reducing manual effort by 50%.",
    ],
    stories: ["ai-agents", "faster-api", "missing-errors"],
  },
  {
    title: "Software Engineer Intern",
    org: "Mindex",
    dates: "Jan 2022 – Aug 2022",
    highlights: [
      "Built a billing system (Python, React, TypeScript) that made payment processing 30% more efficient.",
      "Caught a major bug in code review that prevented updates to 1M+ database records (team of 11, Agile).",
      "Integrated AWS Cognito with C# and SQL, reducing invalid access attempts by 50%.",
      "Designed a serverless integration architecture (CloudFormation, Lambda, DynamoDB, SNS, SQS) that decoupled services and reduced critical failures by 20%.",
    ],
  },
];

export const education: Education[] = [
  {
    degree: "MS Computer Science",
    school: "Rochester Institute of Technology",
    dates: "Aug 2020 – Aug 2023",
    detail: "GPA 3.79/4.0",
  },
];

export const awards: Award[] = [
  {
    title: "3rd Place, AI-Native Talent Hunt Hackathon, SF Tech Week",
    date: "Oct 2026",
    story: "hackathon-3rd-place",
  },
  { title: "AWS Certified Developer – Associate" },
];
