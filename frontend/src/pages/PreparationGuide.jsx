// src/pages/PreparationGuide.jsx
import { useState } from "react"
import PipelineStepper from "../components/PipelineStepper"
import CitationList    from "../components/CitationList"
import usePipeline     from "../hooks/usePipeline"

const AGENTS = [
  { id: "A1", name: "Remedy Hunter",     desc: "Finding herbs to prepare" },
  { id: "A2", name: "Science Validator", desc: "Checking preparation evidence" },
  { id: "A4", name: "Citation Checker",  desc: "Validating sources" },
  { id: "A5", name: "Report Builder",    desc: "Building preparation guide" },
]

const DIFFICULTY_COLORS = { easy: "#16a34a", medium: "#d97706", hard: "#dc2626" }

export default function PreparationGuide() {
  const { status, agentStates, agentSummaries, report, citations, extraData,
        error, run, fromCache, cacheMessage } = usePipeline()
  const [condition, setCondition] = useState("")
  const [herbName, setHerbName]   = useState("")

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.icon}>📖</div>
        <h1 style={styles.title}>Preparation Guide</h1>
        <p style={styles.subtitle}>
          Step-by-step herb preparation — teas, tinctures, oils and more
          with exact quantities, temperatures and storage instructions
        </p>
      </div>

      {status === "idle" && (
        <div style={styles.card}>
          <div style={styles.field}>
            <label style={styles.label}>Condition *</label>
            <input style={styles.input} placeholder='e.g. "insomnia", "anxiety"'
              value={condition} onChange={e => setCondition(e.target.value)} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Specific Herb (optional)</label>
            <input style={styles.input} placeholder='e.g. "valerian root" — leave blank for all herbs'
              value={herbName} onChange={e => setHerbName(e.target.value)} />
          </div>
          <button
            style={{ ...styles.btn, opacity: condition.trim() ? 1 : 0.5 }}
            disabled={!condition.trim()}
            onClick={() => run("http://localhost:8000/preparation-guide/stream", {
              condition, herb_name: herbName || null, feature_key: "preparation_guide"
            })}
          >
            Generate Preparation Guides →
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

      {/* Recipe Cards */}
      {status === "done" && extraData?.preparation?.preparation_guides?.map((g, i) => (
        <div key={i} style={styles.recipeCard}>
          <div style={styles.recipeHeader}>
            <div>
              <h3 style={styles.herbName}>{g.herb_name}</h3>
              <div style={styles.recipeMeta}>
                <span style={{ ...styles.diffBadge, background: DIFFICULTY_COLORS[g.difficulty] }}>
                  {g.difficulty}
                </span>
                <span style={styles.metaItem}>⏱ {g.prep_time_minutes} min</span>
                <span style={styles.metaItem}>📦 {g.shelf_life}</span>
                <span style={styles.metaItem}>🧪 {g.preparation_type}</span>
              </div>
            </div>
            <div style={styles.bestTime}>🕐 {g.best_time_to_use}</div>
          </div>

          <div style={styles.twoCol}>
            <div>
              <h4 style={styles.subTitle}>🛒 Ingredients</h4>
              {g.ingredients?.map((ing, j) => (
                <div key={j} style={styles.ingredient}>
                  <span style={styles.qty}>{ing.quantity}</span>
                  <span>{ing.item}</span>
                </div>
              ))}
            </div>
            <div>
              <h4 style={styles.subTitle}>🔧 Equipment</h4>
              {g.equipment?.map((eq, j) => (
                <div key={j} style={styles.equipItem}>• {eq}</div>
              ))}
            </div>
          </div>

          <h4 style={styles.subTitle}>📋 Steps</h4>
          {g.steps?.map(step => (
            <div key={step.step_number} style={styles.step}>
              <div style={styles.stepNum}>{step.step_number}</div>
              <div style={styles.stepContent}>
                <div style={styles.stepInstruction}>{step.instruction}</div>
                <div style={styles.stepMeta}>
                  {step.duration && <span style={styles.metaChip}>⏱ {step.duration}</span>}
                  {step.temperature && <span style={styles.metaChip}>🌡 {step.temperature}</span>}
                  {step.tip && <span style={styles.tipChip}>💡 {step.tip}</span>}
                </div>
              </div>
            </div>
          ))}

          <div style={styles.storageBox}>
            <strong>Storage:</strong> {g.storage_instructions}
            <br />
            <strong>Gone bad if:</strong> {g.how_to_tell_if_bad}
          </div>
        </div>
      ))}

      {status === "done" && <CitationList citations={citations} />}
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
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: "#374151" },
  input: {
    padding: "12px 16px", borderRadius: 10, fontSize: 15,
    border: "1.5px solid #bbf7d0", outline: "none", color: "#14532d"
  },
  btn: {
    background: "#16a34a", color: "#fff", border: "none",
    borderRadius: 12, padding: "14px", fontSize: 15,
    fontWeight: 600, cursor: "pointer"
  },
  recipeCard: {
    background: "#fff", border: "1px solid #dcfce7",
    borderRadius: 16, padding: 28,
    display: "flex", flexDirection: "column", gap: 16
  },
  recipeHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  herbName: { fontSize: 22, color: "#14532d", margin: "0 0 8px" },
  recipeMeta: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" },
  diffBadge: {
    color: "#fff", borderRadius: 20, padding: "2px 10px",
    fontSize: 12, fontWeight: 600, textTransform: "capitalize"
  },
  metaItem: { fontSize: 13, color: "#6b7280" },
  bestTime: { fontSize: 13, color: "#6b7280", textAlign: "right" },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 },
  subTitle: { fontSize: 14, fontWeight: 700, color: "#374151", margin: "0 0 8px" },
  ingredient: { display: "flex", gap: 10, fontSize: 14, color: "#374151", marginBottom: 4 },
  qty: { fontWeight: 600, color: "#16a34a", minWidth: 60 },
  equipItem: { fontSize: 14, color: "#374151", marginBottom: 4 },
  step: { display: "flex", gap: 14, alignItems: "flex-start" },
  stepNum: {
    background: "#16a34a", color: "#fff", borderRadius: "50%",
    width: 28, height: 28, display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0
  },
  stepContent: { display: "flex", flexDirection: "column", gap: 4, flex: 1 },
  stepInstruction: { fontSize: 14, color: "#1e293b", lineHeight: 1.6 },
  stepMeta: { display: "flex", flexWrap: "wrap", gap: 6 },
  metaChip: {
    background: "#f1f5f9", borderRadius: 20, padding: "2px 8px",
    fontSize: 12, color: "#475569"
  },
  tipChip: {
    background: "#fefce8", borderRadius: 20, padding: "2px 8px",
    fontSize: 12, color: "#854d0e"
  },
  storageBox: {
    background: "#f0fdf4", borderRadius: 10, padding: "12px 16px",
    fontSize: 13, color: "#374151", lineHeight: 1.7
  },
  error: {
    background: "#fef2f2", border: "1px solid #fca5a5",
    borderRadius: 12, padding: "16px 20px", color: "#b91c1c", fontSize: 15
  }
}