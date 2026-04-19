// src/pages/ExercisePlanner.jsx
import { useState } from "react"
import PipelineStepper from "../components/PipelineStepper"
import ReportView      from "../components/ReportView"
import CitationList    from "../components/CitationList"
import usePipeline     from "../hooks/usePipeline"

const AGENTS = [
  { id: "A1", name: "Remedy Hunter",         desc: "Building yoga sequence" },
  { id: "A2", name: "Science Validator",     desc: "Checking exercise research" },
  { id: "A3", name: "Pose & Point Verifier", desc: "Verifying sequence safety" },
  { id: "A4", name: "Citation Checker",      desc: "Validating sources" },
  { id: "A5", name: "Report Builder",        desc: "Assembling exercise plan" },
]

const LEVELS = [
  { key: "beginner",     label: "Beginner",     desc: "New to yoga, gentle pace" },
  { key: "intermediate", label: "Intermediate", desc: "Some experience, moderate intensity" },
  { key: "advanced",     label: "Advanced",     desc: "Regular practice, full poses" },
]

export default function ExercisePlanner() {
  const { status, agentStates, agentSummaries, report, citations, error, run } = usePipeline()
  const [condition, setCondition]   = useState("")
  const [level, setLevel]           = useState("beginner")

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.icon}>🏋️</div>
        <h1 style={styles.title}>Exercise Planner</h1>
        <p style={styles.subtitle}>
          A complete yoga workout — warm-up, main sequence and cool-down —
          with herb support for energy and recovery
        </p>
      </div>

      {status === "idle" && (
        <div style={styles.card}>
          <div style={styles.field}>
            <label style={styles.label}>What do you want to work on?</label>
            <input style={styles.input}
              placeholder='e.g. "flexibility", "back pain", "stress", "energy"'
              value={condition} onChange={e => setCondition(e.target.value)} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Fitness Level</label>
            <div style={styles.levelGrid}>
              {LEVELS.map(l => (
                <button key={l.key}
                  style={{
                    ...styles.levelBtn,
                    background: level === l.key ? "#16a34a" : "#f0fdf4",
                    color: level === l.key ? "#fff" : "#14532d",
                    border: `1.5px solid ${level === l.key ? "#16a34a" : "#86efac"}`
                  }}
                  onClick={() => setLevel(l.key)}
                >
                  <div style={styles.levelLabel}>{l.label}</div>
                  <div style={styles.levelDesc}>{l.desc}</div>
                </button>
              ))}
            </div>
          </div>
          <button
            style={{ ...styles.btn, opacity: condition.trim() ? 1 : 0.5 }}
            disabled={!condition.trim()}
            onClick={() => run("http://localhost:8000/exercise-planner/stream", {
              condition, fitness_level: level
            })}
          >
            Build My Exercise Plan →
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
  field: { display: "flex", flexDirection: "column", gap: 8 },
  label: { fontSize: 14, fontWeight: 600, color: "#374151" },
  input: {
    padding: "12px 16px", borderRadius: 10, fontSize: 15,
    border: "1.5px solid #bbf7d0", outline: "none", color: "#14532d"
  },
  levelGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 },
  levelBtn: {
    padding: "14px", borderRadius: 12, cursor: "pointer",
    textAlign: "left", display: "flex", flexDirection: "column", gap: 4
  },
  levelLabel: { fontWeight: 700, fontSize: 14 },
  levelDesc: { fontSize: 12, opacity: 0.8 },
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