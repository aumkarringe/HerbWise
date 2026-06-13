import usePipeline from "../hooks/usePipeline"
import FeaturePage from "../components/FeaturePage"

const AGENTS = [
  { id: "A1", name: "Remedy Hunter",         desc: "Finding immune remedies" },
  { id: "A2", name: "Science Validator",     desc: "Checking immunology research" },
  { id: "A3", name: "Pose & Point Verifier", desc: "Verifying lymphatic poses" },
  { id: "A4", name: "Citation Checker",      desc: "Validating sources" },
  { id: "A5", name: "Report Builder",        desc: "Building immunity protocol" },
]

export default function ImmunityBooster() {
  const pipeline = usePipeline()

  return (
    <FeaturePage
      title="Immunity Booster" emoji="🛡"
      subtitle="Evidence-backed herbs, lymphatic yoga & Wei Qi acupressure to strengthen your immune system"
      agents={AGENTS} pipeline={pipeline} featureKey="immunity_booster" condition="immune support"
    >
      {pipeline.status === "idle" && (
        <div className="fp-card fp-card-center">
          <p className="fp-muted">
            Get a complete immune support protocol backed by peer-reviewed research.
            No input needed — click below to start.
          </p>
          <button className="fp-btn" onClick={() => pipeline.run("/immunity-booster/stream", { feature_key: "immunity_booster" })}>
            Build My Immunity Protocol →
          </button>
        </div>
      )}
    </FeaturePage>
  )
}
