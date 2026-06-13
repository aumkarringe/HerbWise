import { useState }  from "react"
import usePipeline   from "../hooks/usePipeline"
import FeaturePage   from "../components/FeaturePage"

const AGENTS = [
  { id: "A1", name: "Remedy Hunter",     desc: "Finding safe remedies" },
  { id: "A2", name: "Science Validator", desc: "Checking safety evidence" },
  { id: "A4", name: "Citation Checker",  desc: "Validating safety sources" },
  { id: "A5", name: "Report Builder",    desc: "Building safety report" },
]

export default function SafetyCheck() {
  const pipeline = usePipeline()
  const [form, setForm] = useState({ condition: "", age: "", weight_kg: "", medications: "" })
  const update = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const isValid = form.condition.trim() && form.age && form.weight_kg

  return (
    <FeaturePage
      title="Safety Check" emoji="🛡️"
      subtitle="Safety-first remedy search — your profile is used to flag drug interactions, dosage adjustments and contraindications"
      agents={AGENTS} pipeline={pipeline} featureKey="safety_check"
    >
      {pipeline.status === "idle" && (
        <div className="fp-card">
          <div className="fp-form-grid">
            <div className="fp-field" style={{ gridColumn: "1 / -1" }}>
              <label className="fp-label">Condition *</label>
              <input className="fp-input" placeholder="e.g. high blood pressure"
                value={form.condition} onChange={e => update("condition", e.target.value)} />
            </div>
            <div className="fp-field">
              <label className="fp-label">Age *</label>
              <input className="fp-input" type="number" placeholder="e.g. 45"
                value={form.age} onChange={e => update("age", e.target.value)} />
            </div>
            <div className="fp-field">
              <label className="fp-label">Weight (kg) *</label>
              <input className="fp-input" type="number" placeholder="e.g. 70"
                value={form.weight_kg} onChange={e => update("weight_kg", e.target.value)} />
            </div>
            <div className="fp-field" style={{ gridColumn: "1 / -1" }}>
              <label className="fp-label">Current Medications (optional)</label>
              <input className="fp-input" placeholder="e.g. metformin, lisinopril"
                value={form.medications} onChange={e => update("medications", e.target.value)} />
            </div>
          </div>
          <button
            className="fp-btn"
            disabled={!isValid}
            onClick={() => pipeline.run("/safety-check/stream", {
              condition: form.condition,
              age: parseInt(form.age),
              weight_kg: parseFloat(form.weight_kg),
              medications: form.medications,
              feature_key: "safety_check"
            })}
          >
            Run Safety Check →
          </button>
        </div>
      )}
    </FeaturePage>
  )
}
