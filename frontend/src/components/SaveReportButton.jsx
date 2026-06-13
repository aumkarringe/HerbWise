import { useState } from "react"
import { supabase } from "../lib/supabase"
import { useAuth }  from "../context/AuthContext"

export default function SaveReportButton({ condition, featureKey, report, citations }) {
  const { user }  = useAuth()
  const [saved, setSaved]   = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState("")

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
    <div className="save-report-saved">✓ Report saved to your account</div>
  )

  return (
    <div className="save-report-wrapper">
      <button
        className="save-report-btn"
        style={{ opacity: saving ? 0.6 : 1 }}
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Saving…" : "🔖 Save This Report"}
      </button>
      {error && <span className="save-report-error">{error}</span>}
    </div>
  )
}
