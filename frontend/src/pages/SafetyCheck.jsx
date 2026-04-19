// src/pages/SafetyCheck.jsx
import { useState } from "react"
import PipelineStepper from "../components/PipelineStepper"
import ReportView      from "../components/ReportView"
import CitationList    from "../components/CitationList"
import usePipeline     from "../hooks/usePipeline"

const AGENTS = [
  { id: "A1", name: "Remedy Hunter",         desc: "Finding safe remedies" },
  { id: "A2", name: "Science Validator",     desc: "Checking safety evidence" },
  { id: "A3", name: "Pose & Point Verifier", desc: "Strict contraindication check" },
  { id: "A4", name: "Citation Checker",      desc: "Validating safety sources" },
  { id: "A5", name: "Report Builder",        desc: "Building safety report" },
]

export default function SafetyCheck() {
  const { status, agentStates, agentSummaries, report, citations, error, run } = usePipeline()
  const [form, setForm] = useState({ condition: "", age: "", weight_kg: "", medications: "" })

  function update(k, v) { setForm(p => ({ ...p, [k]: v })) }
  const isValid = form.condition.trim() && form.age && form.weight_kg

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.icon}>🛡️</div>
        <h1 style={styles.title}>Safety Check</h1>
        <p style={styles.subtitle}>
          Safety-first remedy search — your profile is used to flag
          drug interactions, dosage adjustments and contraindications
        </p>
      </div>

      {status === "idle" && (
        <div style={styles.card}>
          <div style={styles.formGrid}>
            <div style={styles.field}>
              <label style={styles.label}>Condition *</label>
              <input style={styles.input} placeholder="e.g. high blood pressure"
                value={form.condition} onChange={e => update("condition", e.target.value)} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Age *</label>
              <input style={styles.input} type="number" placeholder="e.g. 45"
                value={form.age} onChange={e => update("age", e.target.value)} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Weight (kg) *</label>
              <input style={styles.input} type="number" placeholder="e.g. 70"
                value={form.weight_kg} onChange={e => update("weight_kg", e.target.value)} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Current Medications</label>
              <input style={styles.input} placeholder="e.g. metformin, lisinopril (optional)"
                value={form.medications} onChange={e => update("medications", e.target.value)} />
            </div>
          </div>
          <button
            style={{ ...styles.btn, opacity: isValid ? 1 : 0.5 }}
            disabled={!isValid}
            onClick={() => run("http://localhost:8000/safety-check/stream", {
              condition: form.condition,
              age: parseInt(form.age),
              weight_kg: parseFloat(form.weight_kg),
              medications: form.medications
            })}
          >
            Run Safety Check →
          </button>
        </div>
      )}

      {status !== "idle" && (
        <PipelineStepper agents={AGENTS} agentStates={agentStates} agentSummaries={agentSummaries} />
      )}
      {status === "error" && <div style={styles.error}>⚠️ {error}</div>}
      {status === "done" && report && (
        <>
          <ReportView report={report} />
          <CitationList citations={citations} />
        </>
      )}
    </div>
  )
}

const styles = {
  container: { display: "flex", flexDirection: "column", gap: 28, maxWidth: 860, margin: "0 auto" },
  header: { textAlign: "center" },
  icon: { fontSize: 52, marginBottom: 8 },
  title: { fontSize: 32, color: "#14532d", margin: 0 },
  subtitle: { color: "#4b7a5e", marginTop: 8, fontSize: 15 },
  card: {
    background: "#fff", border: "1px solid #dcfce7",
    borderRadius: 16, padding: 28,
    display: "flex", flexDirection: "column", gap: 20
  },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: "#374151" },
  input: {
    padding: "11px 14px", borderRadius: 10, fontSize: 14,
    border: "1.5px solid #bbf7d0", outline: "none", color: "#14532d"
  },
  btn: {
    background: "#16a34a", color: "#fff", border: "none",
    borderRadius: 12, padding: "14px", fontSize: 15,
    fontWeight: 600, cursor: "pointer"
  },
  error: {
    background: "#fef2f2", border: "1px solid #fca5a5",
    borderRadius: 12, padding: "16px 20px", color: "#b91c1c", fontSize: 15
  }
}