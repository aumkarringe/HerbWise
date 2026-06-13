import { BottomLine, Section, SafetyWarning, s } from "./shared"

function safetyColor(rating) {
  if (rating === "very_safe" || rating === "generally_safe") return "#4ade80"
  if (rating === "use_with_caution") return "#fbbf24"
  return "#f87171"
}

export default function SafetyCheckReport({ report }) {
  return (
    <div className="report-wrapper" style={s.wrapper}>
      <BottomLine report={report} title="🛡️ Safety Assessment" />

      {report.patient_profile_summary && (
        <div style={{ ...s.infoCallout, borderColor: "rgba(96,165,250,0.25)" }}>
          <strong style={{ color: "#60a5fa" }}>👤 Profile:</strong>
          <p style={{ margin: "6px 0 0", color: "rgba(232,245,232,0.75)", fontSize: 14 }}>{report.patient_profile_summary}</p>
        </div>
      )}

      <Section title="Safety-Rated Herbs" emoji="🌿">
        <div className="report-table" style={s.table}>
          <div className="report-table-row report-table-header" style={{ ...s.tableRow, ...s.tableHeader, gridTemplateColumns: "1.5fr 1fr 2fr 1fr" }}>
            {["Herb", "Dosage", "Drug Interactions", "Safety Rating"].map(h => (
              <div key={h} className="report-table-cell" style={s.tableCell}>{h}</div>
            ))}
          </div>
          {report.safety_rated_herbs?.map((h, i) => (
            <div key={i} className="report-table-row" style={{ ...s.tableRow, gridTemplateColumns: "1.5fr 1fr 2fr 1fr", background: i % 2 === 0 ? "rgba(10,26,14,0.4)" : "transparent" }}>
              <div className="report-table-cell" style={{ ...s.tableCell, fontWeight: 700 }}>{h.name}</div>
              <div className="report-table-cell" style={s.tableCell}>{h.dosage_for_this_profile}</div>
              <div className="report-table-cell" style={s.tableCell}>{h.drug_interactions || "None reported"}</div>
              <div className="report-table-cell" style={{ ...s.tableCell, fontWeight: 700, color: safetyColor(h.safety_rating) }}>
                {h.safety_rating?.replace(/_/g, " ")}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {report.safest_options?.length > 0 && (
        <div style={{ ...s.infoCallout, borderColor: "rgba(74,222,128,0.3)" }}>
          <strong style={{ color: "#4ade80" }}>✅ Safest Options for Your Profile:</strong>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
            {report.safest_options.map((item, i) => (
              <span key={i} style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: 20, padding: "4px 12px", fontSize: 13, color: "#4ade80" }}>
                ✓ {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {report.herbs_to_avoid_for_this_profile?.length > 0 && (
        <div style={s.safetyBox}>
          <strong style={s.safetyTitle}>🚫 Herbs to Avoid for Your Profile:</strong>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
            {report.herbs_to_avoid_for_this_profile.map((item, i) => (
              <span key={i} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 20, padding: "4px 12px", fontSize: 13, color: "#f87171" }}>
                ✕ {item}
              </span>
            ))}
          </div>
        </div>
      )}

      <SafetyWarning warning={report.general_safety_warning} whenToSeeDoctor={report.when_to_see_doctor} />
    </div>
  )
}
