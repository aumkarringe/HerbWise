import usePipeline from "../hooks/usePipeline"
import FeaturePage from "../components/FeaturePage"

const AGENTS = [
  { id: "A1", name: "Remedy Hunter",         desc: "Finding stress remedies" },
  { id: "A2", name: "Science Validator",     desc: "Checking cortisol research" },
  { id: "A3", name: "Pose & Point Verifier", desc: "Verifying calming poses" },
  { id: "A4", name: "Citation Checker",      desc: "Validating sources" },
  { id: "A5", name: "Report Builder",        desc: "Building stress protocol" },
]

export default function StressRelief() {
  const pipeline = usePipeline()

  return (
    <FeaturePage
      title="Stress Relief" emoji="🧘"
      subtitle="Adaptogenic herbs, calming yoga poses & acupressure points to reduce cortisol and calm your nervous system"
      agents={AGENTS} pipeline={pipeline} featureKey="stress_relief" condition="stress relief"
    >
      {pipeline.status === "idle" && (
        <div className="fp-card fp-card-center">
          <p className="fp-muted">
            Get a science-backed stress relief protocol with quick 5-minute
            techniques and a full daily practice.
          </p>
          <button className="fp-btn" onClick={() => pipeline.run("/stress-relief/stream", { feature_key: "stress_relief" })}>
            Build My Stress Relief Plan →
          </button>
        </div>
      )}
    </FeaturePage>
  )
}
