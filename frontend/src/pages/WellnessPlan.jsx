import { useState }  from "react"
import usePipeline   from "../hooks/usePipeline"
import FeaturePage   from "../components/FeaturePage"

const AGENTS = [
  { id: "A1", name: "Remedy Hunter",         desc: "Finding daily-use remedies" },
  { id: "A2", name: "Science Validator",     desc: "Checking long-term evidence" },
  { id: "A3", name: "Pose & Point Verifier", desc: "Building progressive sequence" },
  { id: "A4", name: "Citation Checker",      desc: "Validating sources" },
  { id: "A5", name: "Report Builder",        desc: "Assembling wellness plan" },
]

const btnStyle = (active) => ({
  flex: 1, padding: "10px", borderRadius: 10, border: "1.5px solid",
  borderColor: active ? "#4ade80" : "rgba(74,222,128,0.3)",
  background: active ? "#4ade80" : "rgba(74,222,128,0.07)",
  color: active ? "#050e08" : "rgba(232,245,232,0.7)",
  fontWeight: 700, fontSize: 14, cursor: "pointer",
})

export default function WellnessPlan() {
  const pipeline = usePipeline()
  const [condition, setCondition] = useState("")
  const [days, setDays]           = useState(7)

  return (
    <FeaturePage
      title="Wellness Plan" emoji="📅"
      subtitle="A structured day-by-day plan combining herbs, yoga and acupressure into morning and evening routines"
      agents={AGENTS} pipeline={pipeline} featureKey="wellness_plan"
    >
      {pipeline.status === "idle" && (
        <div className="fp-card">
          <div className="fp-field">
            <label className="fp-label">What condition do you want to address?</label>
            <input className="fp-input" placeholder='e.g. "chronic fatigue", "anxiety", "back pain"'
              value={condition} onChange={e => setCondition(e.target.value)} />
          </div>
          <div className="fp-field">
            <label className="fp-label">Plan Duration</label>
            <div style={{ display: "flex", gap: 12 }}>
              {[7, 14, 30].map(d => (
                <button key={d} style={btnStyle(days === d)} onClick={() => setDays(d)}>
                  {d} Days
                </button>
              ))}
            </div>
          </div>
          <button
            className="fp-btn"
            disabled={!condition.trim()}
            onClick={() => pipeline.run("/wellness-plan/stream", {
              condition, duration_days: days, feature_key: "wellness_plan"
            })}
          >
            Build My {days}-Day Plan →
          </button>
        </div>
      )}
    </FeaturePage>
  )
}
