// src/pages/SleepOptimizer.jsx
import PipelineStepper from "../components/PipelineStepper"
import ReportView      from "../components/ReportView"
import CitationList    from "../components/CitationList"
import usePipeline     from "../hooks/usePipeline"

const AGENTS = [
  { id: "A1", name: "Remedy Hunter",         desc: "Finding sleep remedies" },
  { id: "A2", name: "Science Validator",     desc: "Checking sleep research" },
  { id: "A3", name: "Pose & Point Verifier", desc: "Verifying bedtime poses" },
  { id: "A4", name: "Citation Checker",      desc: "Validating sources" },
  { id: "A5", name: "Report Builder",        desc: "Building sleep protocol" },
]

export default function SleepOptimizer() {
  const { status, agentStates, agentSummaries, report, citations, error, warning, run, fromCache, cacheMessage } = usePipeline()

  function handleStart() {
    run("/sleep-optimizer/stream", { feature_key: "sleep_optimizer" })
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.icon}>😴</div>
        <h1 style={styles.title}>Sleep Optimizer</h1>
        <p style={styles.subtitle}>
          A validated bedtime protocol — herbs, yoga poses & acupressure points
          proven to improve sleep quality
        </p>
      </div>

      {status === "idle" && (
        <div style={styles.startCard}>
          <p style={styles.startText}>
            Get a personalized sleep improvement plan based on peer-reviewed research.
            No input needed — click below to start.
          </p>
          <button style={styles.startBtn} onClick={handleStart}>
            Build My Sleep Protocol →
          </button>
        </div>
      )}

      {status === "running" && (
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
          <PipelineStepper
  agents={AGENTS}
  agentStates={agentStates}
  agentSummaries={agentSummaries}
  fromCache={fromCache}
  cacheMessage={cacheMessage}
/>
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
  subtitle: { color: "rgba(232,245,232,0.55)", marginTop: 8, fontSize: 15, maxWidth: 560, display: "block", marginInline: "auto" },
  startCard: {
    background: "rgba(10,26,14,0.8)", backdropFilter: "blur(12px)",
    border: "1px solid rgba(74,222,128,0.2)", borderRadius: 16,
    padding: "32px", textAlign: "center", display: "flex",
    flexDirection: "column", gap: 20, alignItems: "center"
  },
  startText: { color: "rgba(232,245,232,0.7)", fontSize: 15, lineHeight: 1.7, maxWidth: 480 },
  startBtn: {
    background: "#4ade80", color: "#050e08", border: "none",
    borderRadius: 12, padding: "14px 32px", fontSize: 16,
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