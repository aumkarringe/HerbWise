import { useState }  from "react"
import usePipeline   from "../hooks/usePipeline"
import FeaturePage   from "../components/FeaturePage"

const AGENTS = [
  { id: "A1", name: "Remedy Hunter",         desc: "Finding symptom remedies" },
  { id: "A2", name: "Science Validator",     desc: "Checking evidence" },
  { id: "A3", name: "Pose & Point Verifier", desc: "Verifying safety" },
  { id: "A4", name: "Citation Checker",      desc: "Validating sources" },
  { id: "A5", name: "Report Builder",        desc: "Building report" },
]

export default function SymptomAnalyzer() {
  const pipeline = usePipeline()
  const [symptoms, setSymptoms] = useState("")

  function handleSubmit() {
    if (!symptoms.trim()) return
    pipeline.run("/symptom-analyzer/stream", { symptoms: symptoms.trim(), feature_key: "symptom_analyzer" })
  }

  return (
    <FeaturePage
      title="Symptom Analyzer" emoji="🩺"
      subtitle="Describe your symptoms in plain English — the pipeline identifies your condition and finds validated remedies"
      agents={AGENTS} pipeline={pipeline} featureKey="symptom_analyzer"
    >
      {pipeline.status === "idle" && (
        <div className="fp-card">
          <label className="fp-label">Describe your symptoms</label>
          <textarea
            className="fp-textarea"
            placeholder="e.g. I have trouble sleeping, feel anxious, my heart races at night and I wake up tired..."
            value={symptoms}
            onChange={e => setSymptoms(e.target.value)}
            rows={4}
          />
          <p className="fp-hint">
            Be as descriptive as possible — the more detail you give, the more accurate the condition detection.
          </p>
          <button
            className="fp-btn"
            disabled={!symptoms.trim()}
            onClick={handleSubmit}
          >
            Analyze My Symptoms →
          </button>
        </div>
      )}
    </FeaturePage>
  )
}
