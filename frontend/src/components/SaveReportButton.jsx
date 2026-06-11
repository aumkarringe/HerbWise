// src/components/SaveReportButton.jsx
import { useState } from "react"
import { supabase } from "../lib/supabase"
import { useAuth }  from "../context/AuthContext"

export default function SaveReportButton({ condition, featureKey, report, citations }) {
  const { user }    = useAuth()
  const [saved, setSaved]     = useState(false)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState("")

  async function handleSave() {
    if (!user) return
    setSaving(true)
    setError("")

    const { error } = await supabase
      .from("saved_reports")
      .insert({
        user_id:     user.id,
        condition,
        feature_key: featureKey,
        report,
        citations:   citations || []
      })

    if (error) setError("Failed to save report")
    else setSaved(true)
    setSaving(false)
  }

  if (saved) return (
    <div className="save-report-saved" style={styles.saved}>✓ Report saved to your account</div>
  )

  return (
    <div className="save-report-wrapper" style={styles.wrapper}>
      <button
        className="save-report-btn"
        style={{ ...styles.btn, opacity: saving ? 0.7 : 1 }}
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Saving..." : "🔖 Save This Report"}
      </button>
      {error && <span className="save-report-error" style={styles.error}>{error}</span>}
    </div>
  )
}

const styles = {
  wrapper: { display: "flex", alignItems: "center", gap: 12 },
  btn: {
    background: "rgba(74,222,128,0.1)", border: "1.5px solid rgba(74,222,128,0.35)",
    borderRadius: 10, padding: "10px 20px",
    fontSize: 14, fontWeight: 600,
    color: "#4ade80", cursor: "pointer"
  },
  saved: {
    background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.3)",
    borderRadius: 10, padding: "10px 20px",
    fontSize: 14, color: "#4ade80", fontWeight: 600
  },
  error: { fontSize: 13, color: "#fca5a5" }
}