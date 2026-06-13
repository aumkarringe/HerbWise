import { BottomLine, Section, Card, InfoRow, HerbCard, EvidenceBadge, TypeBadge, SafetyWarning, s } from "./shared"

export default function BreathingReport({ report }) {
  return (
    <div className="report-wrapper" style={s.wrapper}>
      <BottomLine report={report} title="🌬️ Breathing Practice Guide" />

      <Section title="Breathing Techniques" emoji="🌬️" accent="#60a5fa">
        {report.breathing_technique_guides?.map((t, i) => (
          <Card key={i}>
            <div className="report-card-header" style={s.cardHeader}>
              <span style={s.itemName}>{t.name}</span>
              <EvidenceBadge level={t.evidence_level} />
              {t.type && <TypeBadge type={t.type} color="#60a5fa" />}
            </div>
            <div className="report-grid" style={s.grid}>
              <InfoRow label="Breath ratio" value={t.breath_ratio} />
              <InfoRow label="Rounds" value={t.rounds} />
              <InfoRow label="Duration" value={t.total_duration} />
              <InfoRow label="When to use" value={t.when_to_use} />
              <InfoRow label="How to do" value={t.step_by_step} />
              <InfoRow label="Benefits" value={t.benefits} />
              {t.beginner_tip && <InfoRow label="Beginner tip" value={t.beginner_tip} />}
              {t.contraindications && <div style={s.warn}>⚠️ Cautions: {t.contraindications}</div>}
            </div>
          </Card>
        ))}
      </Section>

      {report.seven_day_schedule?.length > 0 && (
        <Section title="7-Day Training Schedule" emoji="📅">
          <div className="report-table" style={s.table}>
            <div className="report-table-row report-table-header" style={{ ...s.tableRow, ...s.tableHeader, gridTemplateColumns: "80px 1fr 80px 1fr" }}>
              {["Day", "Technique", "Duration", "Focus"].map(h => (
                <div key={h} className="report-table-cell" style={s.tableCell}>{h}</div>
              ))}
            </div>
            {report.seven_day_schedule.map((d, i) => (
              <div key={i} className="report-table-row" style={{ ...s.tableRow, gridTemplateColumns: "80px 1fr 80px 1fr", background: i % 2 === 0 ? "rgba(10,26,14,0.4)" : "transparent" }}>
                <div className="report-table-cell" style={{ ...s.tableCell, fontWeight: 700, color: "#60a5fa" }}>Day {d.day}</div>
                <div className="report-table-cell" style={s.tableCell}>{d.technique}</div>
                <div className="report-table-cell" style={s.tableCell}>{d.duration_minutes}m</div>
                <div className="report-table-cell" style={s.tableCell}>{d.focus}</div>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section title="Lung Support Herbs" emoji="🌿">
        {report.herbs?.map((h, i) => (
          <HerbCard key={i} h={h} extraFields={[["Respiratory benefit", "respiratory_benefit"]]} />
        ))}
      </Section>

      <SafetyWarning warning={report.general_safety_warning} whenToSeeDoctor={report.when_to_see_doctor} />
    </div>
  )
}
