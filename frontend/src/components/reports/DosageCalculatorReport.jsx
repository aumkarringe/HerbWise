import { BottomLine, Section, EvidenceBadge, SafetyWarning, s } from "./shared"

export default function DosageCalculatorReport({ report }) {
  return (
    <div className="report-wrapper" style={s.wrapper}>
      <BottomLine report={report} title="💊 Age & Weight-Adjusted Dosages" />

      <Section title="Herb Dosages" emoji="📊">
        <div className="report-table" style={s.table}>
          <div className="report-table-row report-table-header" style={{ ...s.tableRow, ...s.tableHeader, gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr" }}>
            {["Herb", "Your Dose", "Max Daily", "Timing", "Form"].map(h => (
              <div key={h} className="report-table-cell" style={s.tableCell}>{h}</div>
            ))}
          </div>
          {report.dosage_table?.map((h, i) => (
            <div key={i} className="report-table-row" style={{ ...s.tableRow, gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr", background: i % 2 === 0 ? "rgba(10,26,14,0.4)" : "transparent" }}>
              <div className="report-table-cell" style={{ ...s.tableCell, fontWeight: 700 }}>
                {h.herb_name}
                <div style={{ fontSize: 11, marginTop: 2 }}><EvidenceBadge level={h.evidence_level} /></div>
              </div>
              <div className="report-table-cell" style={{ ...s.tableCell, color: "#4ade80", fontWeight: 600 }}>{h.personalized_dose}</div>
              <div className="report-table-cell" style={{ ...s.tableCell, color: "#fbbf24" }}>{h.max_daily_dose}</div>
              <div className="report-table-cell" style={s.tableCell}>{h.timing}</div>
              <div className="report-table-cell" style={s.tableCell}>{h.dose_form}</div>
            </div>
          ))}
        </div>
      </Section>

      {report.dosage_notes && (
        <div style={s.infoCallout}>
          <strong style={{ color: "#4ade80" }}>📝 Dosage Notes:</strong>
          <p style={{ margin: "6px 0 0", color: "rgba(232,245,232,0.75)", fontSize: 14 }}>{report.dosage_notes}</p>
        </div>
      )}

      <SafetyWarning warning={report.important_warnings || report.general_safety_warning} whenToSeeDoctor={report.when_to_see_doctor} />
    </div>
  )
}
