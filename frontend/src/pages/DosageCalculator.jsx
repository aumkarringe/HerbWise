// src/pages/DosageCalculator.jsx
import { useState } from "react"
import PipelineStepper from "../components/PipelineStepper"
import ReportView      from "../components/ReportView"
import CitationList    from "../components/CitationList"
import usePipeline     from "../hooks/usePipeline"

const AGENTS = [
  { id: "A1", name: "Remedy Hunter",     desc: "Finding herbs with dosage data" },
  { id: "A2", name: "Science Validator", desc: "Checking clinical dose studies" },
  { id: "A4", name: "Citation Checker",  desc: "Validating dosage sources" },
  { id: "A5", name: "Report Builder",    desc: "Building dosage report" },
]

export default function DosageCalculator() {
  const { status, agentStates, agentSummaries, report, citations, extraData,
        error, run, fromCache, cacheMessage } = usePipeline()
  const [form, setForm] = useState({ condition: "", age: "", weight_kg: "" })

  function update(k, v) { setForm(p => ({ ...p, [k]: v })) }
  const isValid = form.condition.trim() && form.age && form.weight_kg

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.icon}>💊</div>
        <h1 style={styles.title}>Dosage Calculator</h1>
        <p style={styles.subtitle}>
          Personalized herb dosages calculated using Clark's Rule —
          adjusted for your age and weight
        </p>
      </div>

      {status === "idle" && (
        <div style={styles.card}>
          <div style={styles.formRow}>
            <div style={styles.field}>
              <label style={styles.label}>Condition *</label>
              <input style={styles.input} placeholder="e.g. anxiety"
                value={form.condition} onChange={e => update("condition", e.target.value)} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Age *</label>
              <input style={styles.input} type="number" placeholder="e.g. 35"
                value={form.age} onChange={e => update("age", e.target.value)} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Weight (kg) *</label>
              <input style={styles.input} type="number" placeholder="e.g. 68"
                value={form.weight_kg} onChange={e => update("weight_kg", e.target.value)} />
            </div>
          </div>
          <button
            style={{ ...styles.btn, opacity: isValid ? 1 : 0.5 }}
            disabled={!isValid}
            onClick={() => run("http://localhost:8000/dosage-calculator/stream", {
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

      {status !== "idle" && (
        <PipelineStepper
  agents={AGENTS}
  agentStates={agentStates}
  agentSummaries={agentSummaries}
  fromCache={fromCache}
  cacheMessage={cacheMessage}
/>
      )}
      {status === "error" && <div style={styles.error}>⚠️ {error}</div>}

      {/* Dosage Table */}
      {status === "done" && extraData?.dosage && (
        <div style={styles.dosageCard}>
          <h2 style={styles.sectionTitle}>💊 Personalized Dosage Table</h2>
          <p style={styles.profile}>
            Profile: {extraData.dosage.patient_profile?.age} yrs —{" "}
            {extraData.dosage.patient_profile?.weight_kg} kg ({extraData.dosage.patient_profile?.weight_lbs} lbs)
          </p>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {["Herb","Your Dose","Max Daily","Timing","Form","Warnings"].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {extraData.dosage.dosage_table?.map((d, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "#f8fafc" : "#fff" }}>
                    <td style={styles.td}><strong>{d.herb_name}</strong></td>
                    <td style={styles.td}>{d.personalized_dose}</td>
                    <td style={styles.td}>{d.max_daily_dose}</td>
                    <td style={styles.td}>{d.timing}</td>
                    <td style={styles.td}>{d.form}</td>
                    <td style={{ ...styles.td, color: "#b45309" }}>{d.warnings || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {extraData.dosage.important_warnings && (
            <div style={styles.warning}>
              ⚠️ {extraData.dosage.important_warnings}
            </div>
          )}
        </div>
      )}

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
  formRow: { display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 16 },
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
  dosageCard: {
    background: "#fff", border: "1px solid #dcfce7",
    borderRadius: 16, padding: 28,
    display: "flex", flexDirection: "column", gap: 16
  },
  sectionTitle: { fontSize: 20, color: "#14532d", margin: 0 },
  profile: { fontSize: 13, color: "#6b7280" },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: {
    background: "#f0fdf4", padding: "10px 12px",
    textAlign: "left", color: "#14532d",
    fontWeight: 600, borderBottom: "2px solid #dcfce7"
  },
  td: { padding: "10px 12px", borderBottom: "1px solid #f1f5f9", color: "#374151" },
  warning: {
    background: "#fff7ed", border: "1px solid #fed7aa",
    borderRadius: 10, padding: "12px 16px",
    fontSize: 13, color: "#9a3412"
  },
  error: {
    background: "#fef2f2", border: "1px solid #fca5a5",
    borderRadius: 12, padding: "16px 20px", color: "#b91c1c", fontSize: 15
  }
}