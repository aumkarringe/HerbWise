// src/pages/SeasonalRemedies.jsx
import PipelineStepper from "../components/PipelineStepper"
import ReportView      from "../components/ReportView"
import CitationList    from "../components/CitationList"
import usePipeline     from "../hooks/usePipeline"

const AGENTS = [
  { id: "A1", name: "Remedy Hunter",         desc: "Finding seasonal remedies" },
  { id: "A2", name: "Science Validator",     desc: "Checking seasonal research" },
  { id: "A3", name: "Pose & Point Verifier", desc: "Verifying seasonal poses" },
  { id: "A4", name: "Citation Checker",      desc: "Validating sources" },
  { id: "A5", name: "Report Builder",        desc: "Building seasonal guide" },
]

const SEASONS = ["Spring", "Summer", "Autumn", "Winter"]

function getCurrentSeason() {
  const month = new Date().getMonth() + 1
  if ([12,1,2].includes(month))  return "Winter"
  if ([3,4,5].includes(month))   return "Spring"
  if ([6,7,8].includes(month))   return "Summer"
  return "Autumn"
}

export default function SeasonalRemedies() {
  const { status, agentStates, agentSummaries, report, citations, 
        error, warning, run, fromCache, cacheMessage } = usePipeline()
  const currentSeason = getCurrentSeason()

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.icon}>🍂</div>
        <h1 style={styles.title}>Seasonal Remedies</h1>
        <p style={styles.subtitle}>
          Herbs, poses & acupressure points aligned with the current season
          and TCM seasonal health principles
        </p>
      </div>

      {status === "idle" && (
        <div style={styles.card}>
          <p style={styles.label}>
            Current season detected: <strong>{currentSeason}</strong>
          </p>
          <p style={styles.hint}>Or choose a different season:</p>
          <div style={styles.seasonGrid}>
            {SEASONS.map(s => (
              <button
                key={s}
                style={{
                  ...styles.seasonBtn,
                  background: s === currentSeason ? "#4ade80" : "rgba(74,222,128,0.07)",
                  color: s === currentSeason ? "#050e08" : "rgba(232,245,232,0.75)",
                  border: `1.5px solid ${s === currentSeason ? "#4ade80" : "rgba(74,222,128,0.3)"}`
                }}
                onClick={() => run(
                  "/seasonal-remedies/stream",
                  { season: s.toLowerCase(), feature_key: "seasonal_remedies" }
                )}
              >
                {s === "Spring"  ? "🌸" : ""}
                {s === "Summer"  ? "☀️" : ""}
                {s === "Autumn"  ? "🍂" : ""}
                {s === "Winter"  ? "❄️" : ""}
                {" "}{s}
              </button>
            ))}
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
  label: { fontSize: 15, color: "rgba(232,245,232,0.75)" },
  hint: { fontSize: 13, color: "rgba(232,245,232,0.4)" },
  seasonGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  seasonBtn: {
    padding: "16px", borderRadius: 12, fontSize: 15,
    fontWeight: 600, cursor: "pointer", transition: "all 0.15s"
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