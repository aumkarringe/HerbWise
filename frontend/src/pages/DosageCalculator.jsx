import { useState }  from "react"
import usePipeline   from "../hooks/usePipeline"
import FeaturePage   from "../components/FeaturePage"

const AGENTS = [
  { id: "A1", name: "Remedy Hunter",     desc: "Finding relevant herbs" },
  { id: "A2", name: "Science Validator", desc: "Checking dosage evidence" },
  { id: "A4", name: "Citation Checker",  desc: "Validating dosage sources" },
  { id: "A5", name: "Report Builder",    desc: "Building dosage table" },
]

export default function DosageCalculator() {
  const pipeline = usePipeline()
  const [form, setForm] = useState({ condition: "", age: "", weight_kg: "" })
  const update = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const isValid = form.condition.trim() && form.age && form.weight_kg

  return (
    <FeaturePage
      title="Dosage Calculator" emoji="💊"
      subtitle="Personalized herb doses adjusted for your age and body weight — never guess how much to take"
      agents={AGENTS} pipeline={pipeline} featureKey="dosage_calculator"
    >
      {pipeline.status === "idle" && (
        <div className="fp-card">
          <div className="fp-form-grid">
            <div className="fp-field" style={{ gridColumn: "1 / -1" }}>
              <label className="fp-label">Condition *</label>
              <input className="fp-input" placeholder='e.g. "insomnia", "anxiety"'
                value={form.condition} onChange={e => update("condition", e.target.value)} />
            </div>
            <div className="fp-field">
              <label className="fp-label">Age *</label>
              <input className="fp-input" type="number" placeholder="e.g. 35"
                value={form.age} onChange={e => update("age", e.target.value)} />
            </div>
            <div className="fp-field">
              <label className="fp-label">Weight (kg) *</label>
              <input className="fp-input" type="number" placeholder="e.g. 70"
                value={form.weight_kg} onChange={e => update("weight_kg", e.target.value)} />
            </div>
          </div>
          <button
            className="fp-btn"
            disabled={!isValid}
            onClick={() => pipeline.run("/dosage-calculator/stream", {
              condition: form.condition,
              age: parseInt(form.age),
              weight_kg: parseFloat(form.weight_kg),
              feature_key: "dosage_calculator"
            })}
          >
            Calculate My Dosages →
          </button>
        </div>
      )}
    </FeaturePage>
  )
}
