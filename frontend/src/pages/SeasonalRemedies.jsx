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
        error, run, fromCache, cacheMessage } = usePipeline()
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
                  background: s === currentSeason ? "#16a34a" : "#f0fdf4",
                  color: s === currentSeason ? "#fff" : "#14532d",
                  border: `1.5px solid ${s === currentSeason ? "#16a34a" : "#86efac"}`
                }}
                onClick={() => run(
                  "http://localhost:8000/seasonal-remedies/stream",
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
  label: { fontSize: 15, color: "#374151" },
  hint: { fontSize: 13, color: "#6b7280" },
  seasonGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  seasonBtn: {
    padding: "16px", borderRadius: 12, fontSize: 15,
    fontWeight: 600, cursor: "pointer", transition: "all 0.15s"
  },
  error: {
    background: "#fef2f2", border: "1px solid #fca5a5",
    borderRadius: 12, padding: "16px 20px", color: "#b91c1c", fontSize: 15
  }
}