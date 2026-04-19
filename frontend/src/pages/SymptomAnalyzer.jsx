// src/pages/SymptomAnalyzer.jsx
import { useState } from "react"
import PipelineStepper from "../components/PipelineStepper"
import ReportView      from "../components/ReportView"
import CitationList    from "../components/CitationList"
import usePipeline     from "../hooks/usePipeline"

const AGENTS = [
  { id: "A1", name: "Remedy Hunter",         desc: "Finding symptom remedies" },
  { id: "A2", name: "Science Validator",     desc: "Checking evidence" },
  { id: "A3", name: "Pose & Point Verifier", desc: "Verifying safety" },
  { id: "A4", name: "Citation Checker",      desc: "Validating sources" },
  { id: "A5", name: "Report Builder",        desc: "Building report" },
]

export default function SymptomAnalyzer() {
  const { status, agentStates, agentSummaries, report, citations,
          error, detectedCondition, run } = usePipeline()
  const [symptoms, setSymptoms] = useState("")

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.icon}>🩺</div>
        <h1 style={styles.title}>Symptom Analyzer</h1>
        <p style={styles.subtitle}>
          Describe your symptoms in plain English — the pipeline identifies
          your condition and finds validated remedies
        </p>
      </div>

      {status === "idle" && (
        <div style={styles.card}>
          <label style={styles.label}>Describe your symptoms</label>
          <textarea
            style={styles.textarea}
            placeholder="e.g. I have trouble sleeping, feel anxious, my heart races at night and I wake up tired..."
            value={symptoms}
            onChange={e => setSymptoms(e.target.value)}
            rows={4}
          />
          <p style={styles.hint}>
            Be as descriptive as possible — the more detail you give,
            the more accurate the condition detection.
          </p>
          <button
            style={{ ...styles.btn, opacity: symptoms.trim() ? 1 : 0.5 }}
            disabled={!symptoms.trim()}
            onClick={() => run(
              "http://localhost:8000/symptom-analyzer/stream",
              { symptoms }
            )}
          >
            Analyze My Symptoms →
          </button>
        </div>
      )}

      {detectedCondition && (
        <div style={styles.detectedBox}>
          🔍 Detected condition: <strong>{detectedCondition}</strong>
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
    display: "flex", flexDirection: "column", gap: 16
  },
  label: { fontSize: 15, fontWeight: 600, color: "#14532d" },
  textarea: {
    padding: "12px 16px", borderRadius: 10, fontSize: 15,
    border: "1.5px solid #bbf7d0", outline: "none",
    color: "#14532d", resize: "vertical", lineHeight: 1.6
  },
  hint: { fontSize: 13, color: "#6b7280" },
  btn: {
    background: "#16a34a", color: "#fff", border: "none",
    borderRadius: 12, padding: "14px", fontSize: 15,
    fontWeight: 600, cursor: "pointer"
  },
  detectedBox: {
    background: "#f0fdf4", border: "1.5px solid #86efac",
    borderRadius: 12, padding: "14px 20px",
    fontSize: 15, color: "#14532d"
  },
  error: {
    background: "#fef2f2", border: "1px solid #fca5a5",
    borderRadius: 12, padding: "16px 20px", color: "#b91c1c", fontSize: 15
  }
}