// src/pages/WellnessPlan.jsx
import { useState } from "react"
import PipelineStepper from "../components/PipelineStepper"
import ReportView      from "../components/ReportView"
import CitationList    from "../components/CitationList"
import usePipeline     from "../hooks/usePipeline"

const AGENTS = [
  { id: "A1", name: "Remedy Hunter",         desc: "Finding daily-use remedies" },
  { id: "A2", name: "Science Validator",     desc: "Checking long-term evidence" },
  { id: "A3", name: "Pose & Point Verifier", desc: "Building progressive sequence" },
  { id: "A4", name: "Citation Checker",      desc: "Validating sources" },
  { id: "A5", name: "Report Builder",        desc: "Assembling wellness plan" },
]

export default function WellnessPlan() {
  const { status, agentStates, agentSummaries, report, citations, extraData,
        error, run, fromCache, cacheMessage } = usePipeline()
  const [condition, setCondition] = useState("")
  const [days, setDays]           = useState(7)

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.icon}>📅</div>
        <h1 style={styles.title}>Wellness Plan</h1>
        <p style={styles.subtitle}>
          A structured day-by-day plan combining herbs, yoga and acupressure
          into morning and evening routines
        </p>
      </div>

      {status === "idle" && (
        <div style={styles.card}>
          <div style={styles.field}>
            <label style={styles.label}>What condition do you want to address?</label>
            <input style={styles.input} placeholder='e.g. "chronic fatigue", "anxiety", "back pain"'
              value={condition} onChange={e => setCondition(e.target.value)} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Plan Duration</label>
            <div style={styles.daysRow}>
              {[7, 14, 30].map(d => (
                <button key={d}
                  style={{
                    ...styles.dayBtn,
                    background: days === d ? "#16a34a" : "#f0fdf4",
                    color: days === d ? "#fff" : "#14532d",
                    border: `1.5px solid ${days === d ? "#16a34a" : "#86efac"}`
                  }}
                  onClick={() => setDays(d)}
                >
                  {d} Days
                </button>
              ))}
            </div>
          </div>
          <button
            style={{ ...styles.btn, opacity: condition.trim() ? 1 : 0.5 }}
            disabled={!condition.trim()}
            onClick={() => run("http://localhost:8000/wellness-plan/stream", {
              condition, duration_days: days, feature_key: "wellness_plan"
            })}
          >
            Generate {days}-Day Plan →
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

      {/* Wellness Plan Calendar */}
      {status === "done" && extraData?.wellness_plan && (
        <div style={styles.planCard}>
          <h2 style={styles.planTitle}>{extraData.wellness_plan.plan_title}</h2>
          <p style={styles.planOverview}>{extraData.wellness_plan.overview}</p>
          <div style={styles.daysGrid}>
            {extraData.wellness_plan.days?.map(day => (
              <div key={day.day} style={styles.dayCard}>
                <div style={styles.dayHeader}>
                  <span style={styles.dayNum}>Day {day.day}</span>
                  <span style={styles.dayTheme}>{day.theme}</span>
                </div>
                <div style={styles.slot}>
                  <div style={styles.slotLabel}>🌅 Morning</div>
                  <div style={styles.slotItems}>
                    {day.morning?.herbs?.map(h => <span key={h} style={styles.chip}>🌿 {h}</span>)}
                    {day.morning?.yoga?.map(y => <span key={y} style={styles.chip}>🧘 {y}</span>)}
                  </div>
                  <div style={styles.slotDuration}>{day.morning?.duration_minutes} min</div>
                </div>
                <div style={styles.slot}>
                  <div style={styles.slotLabel}>🌙 Evening</div>
                  <div style={styles.slotItems}>
                    {day.evening?.herbs?.map(h => <span key={h} style={styles.chip}>🌿 {h}</span>)}
                    {day.evening?.acupressure?.map(a => <span key={a} style={styles.chip}>👆 {a}</span>)}
                  </div>
                  <div style={styles.slotDuration}>{day.evening?.duration_minutes} min</div>
                </div>
                {day.notes && <div style={styles.dayNotes}>{day.notes}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

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
  daysRow: { display: "flex", gap: 12 },
  dayBtn: {
    flex: 1, padding: "12px", borderRadius: 10,
    fontSize: 15, fontWeight: 600, cursor: "pointer"
  },
  btn: {
    background: "#16a34a", color: "#fff", border: "none",
    borderRadius: 12, padding: "14px", fontSize: 15,
    fontWeight: 600, cursor: "pointer"
  },
  planCard: {
    background: "#fff", border: "1px solid #dcfce7",
    borderRadius: 16, padding: 28,
    display: "flex", flexDirection: "column", gap: 20
  },
  planTitle: { fontSize: 22, color: "#14532d", margin: 0 },
  planOverview: { fontSize: 14, color: "#4b7a5e", lineHeight: 1.7 },
  daysGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 },
  dayCard: {
    background: "#f8fafc", borderRadius: 12, padding: 16,
    border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: 10
  },
  dayHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  dayNum: { fontWeight: 700, fontSize: 14, color: "#14532d" },
  dayTheme: { fontSize: 12, color: "#6b7280", fontStyle: "italic" },
  slot: { display: "flex", flexDirection: "column", gap: 4 },
  slotLabel: { fontSize: 12, fontWeight: 600, color: "#374151" },
  slotItems: { display: "flex", flexWrap: "wrap", gap: 4 },
  chip: {
    background: "#dcfce7", borderRadius: 20, padding: "2px 8px",
    fontSize: 11, color: "#166534"
  },
  slotDuration: { fontSize: 11, color: "#9ca3af" },
  dayNotes: { fontSize: 12, color: "#6b7280", fontStyle: "italic", borderTop: "1px solid #e2e8f0", paddingTop: 8 },
  error: {
    background: "#fef2f2", border: "1px solid #fca5a5",
    borderRadius: 12, padding: "16px 20px", color: "#b91c1c", fontSize: 15
  }
}