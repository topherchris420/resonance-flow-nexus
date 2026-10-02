import StudioHeader from "@/components/studio/StudioHeader";
import GuidedMeditation from "@/components/GuidedMeditation";
import TargetCoordinateGenerator from "@/components/TargetCoordinateGenerator";
import IdeogramCanvas from "@/components/IdeogramCanvas";
import VocabularyBuilder from "@/components/VocabularyBuilder";
import "@/studio.css";
export default function SRV() {
  return (
    <div className="sentinel-app">
      <StudioHeader />
      <main className="lab-main">
        <p className="eyebrow">AN OPEN-ENDED PRACTICE</p>
        <h1>The imagination lab.</h1>
        <p className="lab-intro">
          Listen, sketch, and notice what comes to mind. This creative exercise
          draws on remote-viewing traditions; it does not verify perception of
          distant places.
        </p>
        <div className="lab-grid">
          <GuidedMeditation />
          <TargetCoordinateGenerator />
        </div>
        <IdeogramCanvas />
        <VocabularyBuilder />
      </main>
    </div>
  );
}
