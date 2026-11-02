import { About } from "@/components/about/About";
import { Contact } from "@/components/contact/Contact";
import { Hero } from "@/components/hero/Hero";
import { ImpactStrip } from "@/components/impact/ImpactStrip";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { Skills } from "@/components/skills/Skills";
import { Timeline } from "@/components/timeline/Timeline";
import { WorkToc } from "@/components/work-toc/WorkToc";

// Home: the nine sections from PLAN.md Section 4 (the nav lives in the root layout).
export default function Home() {
  return (
    <>
      <Hero />
      <ImpactStrip />
      <WorkToc index={1} />
      <ProjectGrid index={2} />
      <Timeline index={3} />
      <Skills index={4} />
      <About index={5} />
      <Contact index={6} />
    </>
  );
}
