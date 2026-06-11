// src/pages/SavedReports.jsx
import { useEffect, useState } from "react"
import { supabase }   from "../lib/supabase"
import { useAuth }    from "../context/AuthContext"
import ReportView     from "../components/ReportView"
import CitationList   from "../components/CitationList"

async function downloadReportPdf(r) {
  const element = document.getElementById(`report-pdf-${r.id}`)
  if (!element) return

  const { default: html2pdf } = await import("html2pdf.js")

  const filename = `${r.condition.replace(/\s+/g, "_")}_${r.feature_key}_herbwise.pdf`

  await html2pdf()
    .set({
      margin: 0,
      filename,
      image: { type: "jpeg", quality: 0.97 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#050e08",
        logging: false,
        // onclone fires on html2canvas's own internal clone — the element is fully
        // visible inside a hidden iframe at this point, so styles apply correctly
        onclone: (clonedDoc) => {
          // Remove backdrop-filter from every element (renders as white bar in html2canvas)
          clonedDoc.querySelectorAll("*").forEach(el => {
            el.style.backdropFilter = "none"
            el.style.webkitBackdropFilter = "none"
          })
          // Replace semi-transparent rgba backgrounds with solid equivalents
          const fixes = [
            [".report-section",    "#0a1a0e"],
            [".report-card",       "#080f0a"],
            [".report-safety-box", "#1a0f00"],
            [".citations-wrapper", "#0a1a0e"],
            [".pipeline-wrapper",  "#0a1a0e"],
          ]
          fixes.forEach(([sel, bg]) => {
            clonedDoc.querySelectorAll(sel).forEach(el => {
              el.style.background = bg
              el.style.breakInside = "avoid"
              el.style.pageBreakInside = "avoid"
            })
          })
          // Protect citation rows from mid-row page breaks
          clonedDoc.querySelectorAll(".citation-item").forEach(el => {
            el.style.breakInside = "avoid"
            el.style.pageBreakInside = "avoid"
          })
        },
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: {
        mode: ["avoid-all", "css"],
        avoid: [
          ".report-section",
          ".report-card",
          ".report-safety-box",
          ".citation-item",
          ".citations-wrapper",
        ],
      },
    })
    .from(element)
    .save()
}

export default function SavedReports() {
  const { user }              = useAuth()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded]     = useState(null)
  const [downloading, setDownloading] = useState(null)

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

  async function handleDownload(r) {
    setDownloading(r.id)
    try {
      await downloadReportPdf(r)
    } finally {
      setDownloading(null)
    }
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
                {expanded === r.id && (
                  <button
                    style={{
                      ...styles.downloadBtn,
                      opacity: downloading === r.id ? 0.6 : 1,
                      cursor: downloading === r.id ? "wait" : "pointer",
                    }}
                    onClick={() => handleDownload(r)}
                    disabled={downloading === r.id}
                  >
                    {downloading === r.id ? "Generating…" : "⬇ Download PDF"}
                  </button>
                )}
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
              <div
                id={`report-pdf-${r.id}`}
                style={styles.reportBody}
              >
                {/* PDF header — condition + feature + date */}
                <div style={styles.pdfHeader}>
                  <div style={styles.pdfTitle}>{r.condition}</div>
                  <div style={styles.pdfMeta}>
                    {r.feature_key.replace(/_/g, " ")} &nbsp;·&nbsp;
                    {new Date(r.created_at).toLocaleDateString()} &nbsp;·&nbsp;
                    <span style={{ color: "#4ade80" }}>HerbWise</span>
                  </div>
                </div>
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
  title: { fontSize: 32, color: "#f0faf0", margin: 0, fontWeight: 800 },
  subtitle: { color: "rgba(232,245,232,0.45)", marginTop: 6, fontSize: 14 },
  loading: { color: "rgba(232,245,232,0.45)", padding: 40, textAlign: "center" },
  empty: {
    background: "rgba(10,26,14,0.8)", backdropFilter: "blur(12px)",
    border: "1px solid rgba(74,222,128,0.2)",
    borderRadius: 16, padding: "48px 32px",
    textAlign: "center", color: "rgba(232,245,232,0.55)", fontSize: 15,
    display: "flex", flexDirection: "column", gap: 8, alignItems: "center"
  },
  emptyIcon: { fontSize: 48, marginBottom: 8 },
  card: {
    background: "rgba(10,26,14,0.8)", backdropFilter: "blur(12px)",
    border: "1px solid rgba(74,222,128,0.2)",
    borderRadius: 16, overflow: "hidden"
  },
  cardHeader: {
    padding: "20px 24px", display: "flex",
    justifyContent: "space-between", alignItems: "center"
  },
  condition: { fontWeight: 700, fontSize: 18, color: "#f0faf0" },
  meta: { fontSize: 13, color: "rgba(232,245,232,0.45)", marginTop: 4, textTransform: "capitalize" },
  actions: { display: "flex", gap: 10, alignItems: "center" },
  expandBtn: {
    background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)",
    borderRadius: 8, padding: "8px 16px",
    fontSize: 13, fontWeight: 600, color: "#4ade80", cursor: "pointer"
  },
  downloadBtn: {
    background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.35)",
    borderRadius: 8, padding: "8px 14px",
    fontSize: 13, fontWeight: 600, color: "#60a5fa", cursor: "pointer",
    transition: "opacity 0.2s"
  },
  deleteBtn: {
    background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)",
    borderRadius: 8, padding: "8px 12px",
    fontSize: 14, cursor: "pointer"
  },
  reportBody: {
    borderTop: "1px solid rgba(74,222,128,0.1)",
    padding: "24px",
    background: "#050e08",
    // Solid background ensures html2canvas captures correctly
    backdropFilter: "none",
  },
  pdfHeader: {
    paddingBottom: 16,
    marginBottom: 20,
    borderBottom: "1px solid rgba(74,222,128,0.2)",
  },
  pdfTitle: { fontSize: 22, fontWeight: 800, color: "#f0faf0" },
  pdfMeta: { fontSize: 13, color: "rgba(232,245,232,0.45)", marginTop: 4, textTransform: "capitalize" },
}
