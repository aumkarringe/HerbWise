// src/pages/HomeRemediesPlus.jsx
import { useState } from "react"
import PipelineStepper from "../components/PipelineStepper"
import ReportView      from "../components/ReportView"
import CitationList    from "../components/CitationList"
import usePipeline     from "../hooks/usePipeline"

const AGENTS = [
  { id: "A1", name: "Remedy Hunter",         desc: "Finding kitchen remedies" },
  { id: "A2", name: "Science Validator",     desc: "Checking household ingredient research" },
  { id: "A3", name: "Pose & Point Verifier", desc: "Verifying poses" },
  { id: "A4", name: "Citation Checker",      desc: "Validating sources" },
  { id: "A5", name: "Report Builder",        desc: "Building home remedy guide" },
]

const QUICK_CONDITIONS = [
  "Common cold", "Upset stomach", "Sore throat",
  "Headache", "Indigestion", "Muscle pain",
  "Nausea", "Bloating"
]

export default function HomeRemediesPlus() {
  const { status, agentStates, agentSummaries, report, citations, 
        error, run, fromCache, cacheMessage } = usePipeline()
  const [condition, setCondition] = useState("")

  function handleSubmit() {
    if (!condition.trim()) return
    run("http://localhost:8000/home-remedies/stream", { condition, feature_key: "home_remedies_plus" })
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.icon}>🏠</div>
        <h1 style={styles.title}>Home Remedies+</h1>
        <p style={styles.subtitle}>
          Remedies using only kitchen ingredients — ginger, turmeric, honey,
          garlic and more. No special equipment needed.
        </p>
      </div>

      {status === "idle" && (
        <div style={styles.card}>
          <p style={styles.label}>What condition do you want to treat?</p>
          <div style={styles.quickTags}>
            {QUICK_CONDITIONS.map(q => (
              <button
                key={q}
                style={{
                  ...styles.tag,
                  background: condition === q ? "#16a34a" : "#f0fdf4",
                  color: condition === q ? "#fff" : "#14532d",
                }}
                onClick={() => setCondition(q)}
              >
                {q}
              </button>
            ))}
          </div>
          <div style={styles.inputRow}>
            <input
              style={styles.input}
              placeholder='Or type a condition e.g. "fever", "cough"'
              value={condition}
              onChange={e => setCondition(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
            />
            <button
              style={{ ...styles.btn, opacity: condition ? 1 : 0.5 }}
              onClick={handleSubmit}
              disabled={!condition.trim()}
            >
              Find Remedies →
            </button>
          </div>
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
    display: "flex", flexDirection: "column", gap: 16
  },
  label: { fontSize: 15, fontWeight: 600, color: "#14532d" },
  quickTags: { display: "flex", flexWrap: "wrap", gap: 8 },
  tag: {
    padding: "8px 14px", borderRadius: 20, border: "1.5px solid #86efac",
    fontSize: 13, fontWeight: 500, cursor: "pointer"
  },
  inputRow: { display: "flex", gap: 12 },
  input: {
    flex: 1, padding: "12px 16px", borderRadius: 10, fontSize: 15,
    border: "1.5px solid #bbf7d0", outline: "none", color: "#14532d"
  },
  btn: {
    background: "#16a34a", color: "#fff", border: "none",
    borderRadius: 12, padding: "12px 24px", fontSize: 15,
    fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap"
  },
  error: {
    background: "#fef2f2", border: "1px solid #fca5a5",
    borderRadius: 12, padding: "16px 20px", color: "#b91c1c", fontSize: 15
  }
}