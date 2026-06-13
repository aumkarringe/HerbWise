import { useState }  from "react"
import usePipeline   from "../hooks/usePipeline"
import FeaturePage   from "../components/FeaturePage"

const AGENTS = [
  { id: "A1", name: "Remedy Hunter",         desc: "Building exercise sequence" },
  { id: "A2", name: "Science Validator",     desc: "Checking exercise research" },
  { id: "A3", name: "Pose & Point Verifier", desc: "Verifying pose safety" },
  { id: "A4", name: "Citation Checker",      desc: "Validating sources" },
  { id: "A5", name: "Report Builder",        desc: "Assembling workout plan" },
]

const LEVELS = ["beginner", "intermediate", "advanced"]

const levelBtn = (active) => ({
  flex: 1, padding: "10px", borderRadius: 10, border: "1.5px solid",
  borderColor: active ? "#4ade80" : "rgba(74,222,128,0.3)",
  background: active ? "#4ade80" : "rgba(74,222,128,0.07)",
  color: active ? "#050e08" : "rgba(232,245,232,0.7)",
  fontWeight: 700, fontSize: 14, cursor: "pointer", textTransform: "capitalize",
})

export default function ExercisePlanner() {
  const pipeline = usePipeline()
  const [condition, setCondition]       = useState("")
  const [fitnessLevel, setFitnessLevel] = useState("beginner")

  return (
    <FeaturePage
      title="Exercise Planner" emoji="🏋️"
      subtitle="A personalized yoga workout — warm-up, main sequence, and cool-down — tailored to your fitness level and condition"
      agents={AGENTS} pipeline={pipeline} featureKey="exercise_planner"
    >
      {pipeline.status === "idle" && (
        <div className="fp-card">
          <div className="fp-field">
            <label className="fp-label">Health Condition or Goal *</label>
            <input className="fp-input" placeholder='e.g. "lower back pain", "weight loss", "flexibility"'
              value={condition} onChange={e => setCondition(e.target.value)} />
          </div>
          <div className="fp-field">
            <label className="fp-label">Fitness Level</label>
            <div style={{ display: "flex", gap: 12 }}>
              {LEVELS.map(l => (
                <button key={l} style={levelBtn(fitnessLevel === l)} onClick={() => setFitnessLevel(l)}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <button
            className="fp-btn"
            disabled={!condition.trim()}
            onClick={() => pipeline.run("/exercise-planner/stream", {
              condition, fitness_level: fitnessLevel, feature_key: "exercise_planner"
            })}
          >
            Build My Workout →
          </button>
        </div>
      )}
    </FeaturePage>
  )
}
