import usePipeline from "../hooks/usePipeline"
import FeaturePage from "../components/FeaturePage"

const AGENTS = [
  { id: "A1", name: "Remedy Hunter",         desc: "Finding seasonal remedies" },
  { id: "A2", name: "Science Validator",     desc: "Checking seasonal research" },
  { id: "A3", name: "Pose & Point Verifier", desc: "Verifying seasonal poses" },
  { id: "A4", name: "Citation Checker",      desc: "Validating sources" },
  { id: "A5", name: "Report Builder",        desc: "Building seasonal protocol" },
]

export default function SeasonalRemedies() {
  const pipeline = usePipeline()

  return (
    <FeaturePage
      title="Seasonal Remedies" emoji="🍂"
      subtitle="Herbs, yoga & acupressure tuned to the current season — auto-detected from today's date"
      agents={AGENTS} pipeline={pipeline} featureKey="seasonal_remedies" condition="seasonal wellness"
    >
      {pipeline.status === "idle" && (
        <div className="fp-card fp-card-center">
          <p className="fp-muted">
            Get remedies optimized for your current season. The season is auto-detected
            — no input needed.
          </p>
          <button className="fp-btn" onClick={() => pipeline.run("/seasonal-remedies/stream", { feature_key: "seasonal_remedies" })}>
            Get Seasonal Remedies →
          </button>
        </div>
      )}
    </FeaturePage>
  )
}
