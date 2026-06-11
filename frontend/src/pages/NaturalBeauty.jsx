// src/pages/NaturalBeauty.jsx
import { useState } from "react"
import PipelineStepper from "../components/PipelineStepper"
import ReportView      from "../components/ReportView"
import CitationList    from "../components/CitationList"
import usePipeline     from "../hooks/usePipeline"

const AGENTS = [
  { id: "A1", name: "Remedy Hunter",         desc: "Finding beauty remedies" },
  { id: "A2", name: "Science Validator",     desc: "Checking dermatology research" },
  { id: "A3", name: "Pose & Point Verifier", desc: "Verifying beauty poses" },
  { id: "A4", name: "Citation Checker",      desc: "Validating sources" },
  { id: "A5", name: "Report Builder",        desc: "Building beauty guide" },
]

const QUICK_CONCERNS = [
  "Acne & blemishes", "Dry skin", "Dark circles",
  "Hair loss", "Oily skin", "Dull complexion",
  "Fine lines", "Uneven skin tone"
]

export default function NaturalBeauty() {
  const { status, agentStates, agentSummaries, report, citations, 
        error, warning, run, fromCache, cacheMessage } = usePipeline()
  const [concern, setConcern] = useState("")

  function handleSubmit() {
    if (!concern.trim()) return
    run("/natural-beauty/stream", { beauty_concern: concern, feature_key: "natural_beauty" })
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.icon}>💄</div>
        <h1 style={styles.title}>Natural Beauty</h1>
        <p style={styles.subtitle}>
          Evidence-validated herbal beauty remedies, face-map acupressure
          and yoga poses for skin & hair health
        </p>
      </div>

      {status === "idle" && (
        <div style={styles.card}>
          <p style={styles.label}>What's your beauty concern?</p>
          <div style={styles.quickTags}>
            {QUICK_CONCERNS.map(q => (
              <button
                key={q}
                style={{
                  ...styles.tag,
                  background: concern === q ? "#4ade80" : "rgba(74,222,128,0.07)",
                  color: concern === q ? "#050e08" : "rgba(232,245,232,0.7)",
                  borderColor: concern === q ? "#4ade80" : "rgba(74,222,128,0.3)",
                }}
                onClick={() => setConcern(q)}
              >
                {q}
              </button>
            ))}
          </div>
          <input
            style={styles.input}
            placeholder="Or type your own concern..."
            value={concern}
            onChange={e => setConcern(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
          />
          <button
            style={{ ...styles.btn, opacity: concern ? 1 : 0.5 }}
            onClick={handleSubmit}
            disabled={!concern.trim()}
          >
            Find Natural Remedies →
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
    display: "flex", flexDirection: "column", gap: 16
  },
  label: { fontSize: 15, fontWeight: 600, color: "#f0faf0" },
  quickTags: { display: "flex", flexWrap: "wrap", gap: 8 },
  tag: {
    padding: "8px 14px", borderRadius: 20, border: "1.5px solid rgba(74,222,128,0.3)",
    fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 0.15s"
  },
  input: {
    padding: "12px 16px", borderRadius: 10, fontSize: 15,
    border: "1.5px solid rgba(74,222,128,0.3)", outline: "none",
    background: "rgba(5,14,8,0.8)", color: "#e8f5e8"
  },
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