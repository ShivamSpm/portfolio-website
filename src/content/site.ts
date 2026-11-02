// Profile and site-wide copy. Source of truth: docs/PLAN.md Section 6.1.
// The email, phone and links here are approved. Don't add other personal info.

export const site = {
  name: "Shivam Mahajan",
  role: "Full-stack engineer who builds with AI",
  location: "San Francisco, CA",
  availability: { openToWork: true, text: "Open to work · Remote or onsite" },
  email: "spmshivam@gmail.com",
  phone: "(585) 743-8485",
  links: {
    github: "https://github.com/ShivamSpm",
    linkedin: "https://www.linkedin.com/in/shivamspm/",
    x: "https://x.com/Shivam_Spm",
    repo: "https://github.com/ShivamSpm/portfolio-website",
  },
  // TODO(shivam): Google Drive share link (see README). While null, the Resume button is hidden.
  resumeUrl: null as string | null,
  siteUrl: "https://shivam-mahajan.vercel.app",
} as const;
