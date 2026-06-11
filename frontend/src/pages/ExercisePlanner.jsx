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
  const { status, agentStates, agentSummaries, report, citations, error, warning, run, fromCache, cacheMessage } = usePipeline()
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
                    background: level === l.key ? "#4ade80" : "rgba(74,222,128,0.07)",
                    color: level === l.key ? "#050e08" : "rgba(232,245,232,0.7)",
                    border: `1.5px solid ${level === l.key ? "#4ade80" : "rgba(74,222,128,0.3)"}`
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
            onClick={() => run("/exercise-planner/stream", {
              condition, fitness_level: level, feature_key: "exercise_planner"
            })}
          >
            Build My Exercise Plan →
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
      {status === "warning" && warning && <div style={styles.warning}>⚠️ {warning}</div>}
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
  container: { display: "flex", flexDirection: "column", gap: 24, maxWidth: 860, margin: "0 auto" },
  header: { textAlign: "center" },
  icon: { fontSize: 52, marginBottom: 8 },
  title: { fontSize: 32, color: "#f0faf0", margin: 0, fontWeight: 800 },
  subtitle: { color: "rgba(232,245,232,0.55)", marginTop: 8, fontSize: 15 },
  card: {
    background: "rgba(10,26,14,0.8)", backdropFilter: "blur(12px)",
    border: "1px solid rgba(74,222,128,0.2)",
    borderRadius: 16, padding: 28,
    display: "flex", flexDirection: "column", gap: 20
  },
  field: { display: "flex", flexDirection: "column", gap: 8 },
  label: { fontSize: 14, fontWeight: 600, color: "rgba(232,245,232,0.7)" },
  input: {
    padding: "12px 16px", borderRadius: 10, fontSize: 15,
    border: "1.5px solid rgba(74,222,128,0.3)", outline: "none",
    background: "rgba(5,14,8,0.8)", color: "#e8f5e8"
  },
  levelGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 },
  levelBtn: {
    padding: "14px", borderRadius: 12, cursor: "pointer",
    textAlign: "left", display: "flex", flexDirection: "column", gap: 4,
    transition: "all 0.15s"
  },
  levelLabel: { fontWeight: 700, fontSize: 14 },
  levelDesc: { fontSize: 12, opacity: 0.8 },
  btn: {
    background: "#4ade80", color: "#050e08", border: "none",
    borderRadius: 12, padding: "14px", fontSize: 15,
    fontWeight: 700, cursor: "pointer"
  },
  error: {
    background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)",
    borderRadius: 12, padding: "16px 20px", color: "#fca5a5", fontSize: 15
  },
  warning: {
    background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)",
    borderRadius: 12, padding: "16px 20px", color: "#fbbf24", fontSize: 15
  }
}