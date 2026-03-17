import ResumeCreatorWorkspace from "@/components/ResumeCreatorWorkspace";
import SiteFrame from "@/components/SiteFrame";

export default function BuilderPage() {
  return (
    <SiteFrame currentPath="/builder" wide mainClassName="pb-6">
      <section className="pt-2">
        <ResumeCreatorWorkspace />
      </section>
    </SiteFrame>
  );
}
