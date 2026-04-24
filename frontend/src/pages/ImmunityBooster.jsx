// src/pages/ImmunityBooster.jsx
import PipelineStepper from "../components/PipelineStepper"
import ReportView      from "../components/ReportView"
import CitationList    from "../components/CitationList"
import usePipeline     from "../hooks/usePipeline"

const AGENTS = [
  { id: "A1", name: "Remedy Hunter",         desc: "Finding immune remedies" },
  { id: "A2", name: "Science Validator",     desc: "Checking immune research" },
  { id: "A3", name: "Pose & Point Verifier", desc: "Verifying lymphatic poses" },
  { id: "A4", name: "Citation Checker",      desc: "Validating sources" },
  { id: "A5", name: "Report Builder",        desc: "Building immunity protocol" },
]

export default function ImmunityBooster() {
  const { status, agentStates, agentSummaries, report, citations, error, run, fromCache, cacheMessage } = usePipeline()

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.icon}>🛡️</div>
        <h1 style={styles.title}>Immunity Booster</h1>
        <p style={styles.subtitle}>
          Immunomodulatory herbs, lymphatic yoga poses & Wei Qi acupressure points
          to strengthen your immune system
        </p>
      </div>

      {status === "idle" && (
        <div style={styles.startCard}>
          <p style={styles.startText}>
            Get a validated immunity protocol — daily maintenance routine,
            acute boost when feeling run down, and seasonal prevention.
          </p>
          <button style={styles.startBtn}
            onClick={() => run("http://localhost:8000/immunity-booster/stream", { feature_key: "immunity_booster" })}>
            Build My Immunity Protocol →
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
  subtitle: { color: "#4b7a5e", marginTop: 8, fontSize: 15, maxWidth: 560, margin: "8px auto 0" },
  startCard: {
    background: "#fff", border: "1px solid #dcfce7", borderRadius: 16,
    padding: "32px", textAlign: "center", display: "flex",
    flexDirection: "column", gap: 20, alignItems: "center"
  },
  startText: { color: "#374151", fontSize: 15, lineHeight: 1.7, maxWidth: 480 },
  startBtn: {
    background: "#16a34a", color: "#fff", border: "none",
    borderRadius: 12, padding: "14px 32px", fontSize: 16,
    fontWeight: 600, cursor: "pointer"
  },
  error: {
    background: "#fef2f2", border: "1px solid #fca5a5",
    borderRadius: 12, padding: "16px 20px", color: "#b91c1c", fontSize: 15
  }
}

// Paste this at the bottom of each Group 1 page
function pageStyles() {
  return {
    container: { display: "flex", flexDirection: "column", gap: 28, maxWidth: 860, margin: "0 auto" },
    header:    { textAlign: "center" },
    icon:      { fontSize: 52, marginBottom: 8 },
    title:     { fontSize: 32, color: "#14532d", margin: 0 },
    subtitle:  { color: "#4b7a5e", marginTop: 8, fontSize: 15, maxWidth: 560, margin: "8px auto 0" },
    startCard: {
      background: "#fff", border: "1px solid #dcfce7", borderRadius: 16,
      padding: "32px", textAlign: "center", display: "flex",
      flexDirection: "column", gap: 20, alignItems: "center"
    },
    startText: { color: "#374151", fontSize: 15, lineHeight: 1.7, maxWidth: 480 },
    startBtn: {
      background: "#16a34a", color: "#fff", border: "none",
      borderRadius: 12, padding: "14px 32px", fontSize: 16,
      fontWeight: 600, cursor: "pointer"
    },
    error: {
      background: "#fef2f2", border: "1px solid #fca5a5",
      borderRadius: 12, padding: "16px 20px", color: "#b91c1c", fontSize: 15
    }
  }
}