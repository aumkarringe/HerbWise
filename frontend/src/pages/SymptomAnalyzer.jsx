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
      error, warning, run, fromCache, cacheMessage } = usePipeline()
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
            onClick={() => {
              run("/symptom-analyzer/stream", { symptoms: symptoms.trim(), feature_key: "symptom_analyzer" })
            }}
          >
            Analyze My Symptoms →
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
      {status === "warning" && warning && <div style={styles.warning}>⚠️ {warning}</div>}
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
    display: "flex", flexDirection: "column", gap: 16
  },
  label: { fontSize: 15, fontWeight: 600, color: "#f0faf0" },
  textarea: {
    padding: "12px 16px", borderRadius: 10, fontSize: 15,
    border: "1.5px solid rgba(74,222,128,0.3)", outline: "none",
    background: "rgba(5,14,8,0.8)", color: "#e8f5e8", resize: "vertical", lineHeight: 1.6
  },
  hint: { fontSize: 13, color: "rgba(232,245,232,0.4)" },
  btn: {
    background: "#4ade80", color: "#050e08", border: "none",
    borderRadius: 12, padding: "14px", fontSize: 15,
    fontWeight: 700, cursor: "pointer"
  },
  detectedBox: {
    background: "rgba(74,222,128,0.08)", border: "1.5px solid rgba(74,222,128,0.25)",
    borderRadius: 12, padding: "14px 20px",
    fontSize: 15, color: "#4ade80"
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