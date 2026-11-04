import type { Metadata } from "next";
import Home from "@/app/page";

// Per-company tracking link (PLAN.md Section 9): /for/stripe shows the normal home
// page, so a view of that path in Vercel Analytics means someone opened the link.
// It never reads the company name and never shows it, so one static page serves every link.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function CompanyHome() {
  return <Home />;
}
