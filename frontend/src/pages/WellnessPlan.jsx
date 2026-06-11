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
        error, warning, run, fromCache, cacheMessage } = usePipeline()
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
                    background: days === d ? "#4ade80" : "rgba(74,222,128,0.07)",
                    color: days === d ? "#050e08" : "rgba(232,245,232,0.75)",
                    border: `1.5px solid ${days === d ? "#4ade80" : "rgba(74,222,128,0.3)"}`
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
            onClick={() => run("/wellness-plan/stream", {
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
      {status === "warning" && warning && <div style={styles.warning}>⚠️ {warning}</div>}
      {status === "error" && error && <div style={styles.error}>⚠️ {error}</div>}

      {/* Wellness Plan Calendar */}
      {(status === "done" || status === "error") && extraData?.wellness_plan && (
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

      {(status === "done" || status === "error") && report && (
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
  daysRow: { display: "flex", gap: 12 },
  dayBtn: {
    flex: 1, padding: "12px", borderRadius: 10,
    fontSize: 15, fontWeight: 600, cursor: "pointer"
  },
  btn: {
    background: "#4ade80", color: "#050e08", border: "none",
    borderRadius: 12, padding: "14px", fontSize: 15,
    fontWeight: 700, cursor: "pointer"
  },
  planCard: {
    background: "rgba(10,26,14,0.8)", backdropFilter: "blur(12px)",
    border: "1px solid rgba(74,222,128,0.2)",
    borderRadius: 16, padding: 28,
    display: "flex", flexDirection: "column", gap: 20
  },
  planTitle: { fontSize: 22, color: "#f0faf0", margin: 0, fontWeight: 700 },
  planOverview: { fontSize: 14, color: "rgba(232,245,232,0.65)", lineHeight: 1.7 },
  daysGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 },
  dayCard: {
    background: "rgba(5,14,8,0.7)", borderRadius: 12, padding: 16,
    border: "1px solid rgba(74,222,128,0.12)", display: "flex", flexDirection: "column", gap: 10
  },
  dayHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  dayNum: { fontWeight: 700, fontSize: 14, color: "#4ade80" },
  dayTheme: { fontSize: 12, color: "rgba(232,245,232,0.4)", fontStyle: "italic" },
  slot: { display: "flex", flexDirection: "column", gap: 4 },
  slotLabel: { fontSize: 12, fontWeight: 600, color: "rgba(232,245,232,0.6)" },
  slotItems: { display: "flex", flexWrap: "wrap", gap: 4 },
  chip: {
    background: "rgba(74,222,128,0.1)", borderRadius: 20, padding: "2px 8px",
    fontSize: 11, color: "#4ade80"
  },
  slotDuration: { fontSize: 11, color: "rgba(232,245,232,0.35)" },
  dayNotes: {
    fontSize: 12, color: "rgba(232,245,232,0.45)", fontStyle: "italic",
    borderTop: "1px solid rgba(74,222,128,0.1)", paddingTop: 8
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