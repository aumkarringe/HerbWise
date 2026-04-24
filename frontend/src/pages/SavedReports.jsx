// src/pages/SavedReports.jsx
import { useEffect, useState } from "react"
import { supabase }   from "../lib/supabase"
import { useAuth }    from "../context/AuthContext"
import ReportView     from "../components/ReportView"
import CitationList   from "../components/CitationList"

export default function SavedReports() {
  const { user }            = useAuth()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    if (!user) return
    supabase
      .from("saved_reports")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setReports(data || [])
        setLoading(false)
      })
  }, [user])

  async function handleDelete(id) {
    await supabase.from("saved_reports").delete().eq("id", id)
    setReports(p => p.filter(r => r.id !== id))
  }

  if (loading) return <div style={styles.loading}>Loading saved reports...</div>

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🔖 Saved Reports</h1>
        <p style={styles.subtitle}>{reports.length} saved reports</p>
      </div>

      {reports.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>📭</div>
          <p>No saved reports yet.</p>
          <p>Run a search and click "Save This Report" to save it here.</p>
        </div>
      ) : (
        reports.map(r => (
          <div key={r.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <div style={styles.condition}>{r.condition}</div>
                <div style={styles.meta}>
                  {r.feature_key.replace(/_/g, " ")} ·{" "}
                  {new Date(r.created_at).toLocaleDateString()}
                </div>
              </div>
              <div style={styles.actions}>
                <button
                  style={styles.expandBtn}
                  onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                >
                  {expanded === r.id ? "Collapse ↑" : "View Report ↓"}
                </button>
                <button
                  style={styles.deleteBtn}
                  onClick={() => handleDelete(r.id)}
                >
                  🗑
                </button>
              </div>
            </div>

            {expanded === r.id && (
              <div style={styles.reportBody}>
                <ReportView report={r.report} />
                <CitationList citations={r.citations} />
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}

const styles = {
  container: { display: "flex", flexDirection: "column", gap: 16, maxWidth: 860, margin: "0 auto" },
  header: { marginBottom: 8 },
  title: { fontSize: 32, color: "#14532d", margin: 0 },
  subtitle: { color: "#6b7280", marginTop: 6, fontSize: 14 },
  loading: { color: "#6b7280", padding: 40, textAlign: "center" },
  empty: {
    background: "#fff", border: "1px solid #dcfce7",
    borderRadius: 16, padding: "48px 32px",
    textAlign: "center", color: "#6b7280", fontSize: 15,
    display: "flex", flexDirection: "column", gap: 8, alignItems: "center"
  },
  emptyIcon: { fontSize: 48, marginBottom: 8 },
  card: {
    background: "#fff", border: "1px solid #dcfce7",
    borderRadius: 16, overflow: "hidden"
  },
  cardHeader: {
    padding: "20px 24px", display: "flex",
    justifyContent: "space-between", alignItems: "center"
  },
  condition: { fontWeight: 700, fontSize: 18, color: "#14532d" },
  meta: { fontSize: 13, color: "#6b7280", marginTop: 4, textTransform: "capitalize" },
  actions: { display: "flex", gap: 10, alignItems: "center" },
  expandBtn: {
    background: "#f0fdf4", border: "1px solid #86efac",
    borderRadius: 8, padding: "8px 16px",
    fontSize: 13, fontWeight: 600, color: "#14532d", cursor: "pointer"
  },
  deleteBtn: {
    background: "#fef2f2", border: "1px solid #fca5a5",
    borderRadius: 8, padding: "8px 12px",
    fontSize: 14, cursor: "pointer"
  },
  reportBody: { borderTop: "1px solid #f1f5f9", padding: "24px" }
}