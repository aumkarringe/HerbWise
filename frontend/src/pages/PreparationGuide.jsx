import { useState }  from "react"
import usePipeline   from "../hooks/usePipeline"
import FeaturePage   from "../components/FeaturePage"

const AGENTS = [
  { id: "A1", name: "Remedy Hunter",     desc: "Finding preparation methods" },
  { id: "A2", name: "Science Validator", desc: "Checking preparation evidence" },
  { id: "A4", name: "Citation Checker",  desc: "Validating sources" },
  { id: "A5", name: "Report Builder",    desc: "Writing step-by-step guides" },
]

export default function PreparationGuide() {
  const pipeline = usePipeline()
  const [condition, setCondition] = useState("")
  const [herbName, setHerbName]   = useState("")

  return (
    <FeaturePage
      title="Preparation Guide" emoji="📖"
      subtitle="Step-by-step recipes for preparing herbal teas, tinctures, and topicals — with ingredient lists and storage tips"
      agents={AGENTS} pipeline={pipeline} featureKey="preparation_guide"
    >
      {pipeline.status === "idle" && (
        <div className="fp-card">
          <div className="fp-field">
            <label className="fp-label">Condition *</label>
            <input className="fp-input" placeholder='e.g. "headache", "insomnia"'
              value={condition} onChange={e => setCondition(e.target.value)} />
          </div>
          <div className="fp-field">
            <label className="fp-label">Specific Herb (optional)</label>
            <input className="fp-input" placeholder='e.g. "ashwagandha", "ginger" — leave blank for all herbs'
              value={herbName} onChange={e => setHerbName(e.target.value)} />
          </div>
          <button
            className="fp-btn"
            disabled={!condition.trim()}
            onClick={() => pipeline.run("/preparation-guide/stream", {
              condition, herb_name: herbName || null, feature_key: "preparation_guide"
            })}
          >
            Get Preparation Guides →
          </button>
        </div>
      )}
    </FeaturePage>
  )
}
