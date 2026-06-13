import usePipeline  from "../hooks/usePipeline"
import FeaturePage  from "../components/FeaturePage"

const AGENTS = [
  { id: "A1", name: "Remedy Hunter",         desc: "Finding sleep remedies" },
  { id: "A2", name: "Science Validator",     desc: "Checking sleep research" },
  { id: "A3", name: "Pose & Point Verifier", desc: "Verifying bedtime poses" },
  { id: "A4", name: "Citation Checker",      desc: "Validating sources" },
  { id: "A5", name: "Report Builder",        desc: "Building sleep protocol" },
]

export default function SleepOptimizer() {
  const pipeline = usePipeline()

  return (
    <FeaturePage
      title="Sleep Optimizer" emoji="😴"
      subtitle="A validated bedtime protocol — herbs, yoga poses & acupressure points proven to improve sleep quality"
      agents={AGENTS} pipeline={pipeline} featureKey="sleep_optimizer" condition="sleep optimization"
    >
      {pipeline.status === "idle" && (
        <div className="fp-card fp-card-center">
          <p className="fp-muted">
            Get a personalized sleep improvement plan based on peer-reviewed research.
            No input needed — click below to start.
          </p>
          <button className="fp-btn" onClick={() => pipeline.run("/sleep-optimizer/stream", { feature_key: "sleep_optimizer" })}>
            Build My Sleep Protocol →
          </button>
        </div>
      )}
    </FeaturePage>
  )
}
