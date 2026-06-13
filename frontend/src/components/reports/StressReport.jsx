import { BottomLine, Section, AcuCard, ProtocolCard, EvidenceBadge, InfoRow, SafetyWarning, s } from "./shared"

export default function StressReport({ report }) {
  return (
    <div className="report-wrapper" style={s.wrapper}>
      <BottomLine report={report} title="🧘 Your Stress Relief Protocol" />

      <Section title="Adaptogenic Herbs" emoji="🌿">
        {report.stress_herbs?.map((h, i) => (
          <div key={i} style={{ ...s.card, display: "flex", flexDirection: "column", gap: 12, background: "rgba(5,14,8,0.7)", borderRadius: 12, padding: "16px 20px", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="report-card-header" style={s.cardHeader}>
              <span style={s.itemName}>{h.name}</span>
              <EvidenceBadge level={h.evidence_level} />
              {h.onset_time && <span style={{ fontSize: 12, color: "rgba(232,245,232,0.45)" }}>⏱ {h.onset_time}</span>}
            </div>
            <div className="report-grid" style={s.grid}>
              <InfoRow label="How to use" value={h.how_to_use} />
              <InfoRow label="Dosage" value={h.dosage} />
              <InfoRow label="How it reduces stress" value={h.how_it_reduces_stress} />
              {h.safety_notes && <InfoRow label="Safety" value={h.safety_notes} />}
              {h.who_should_avoid && <div style={s.warn}>⚠️ Avoid if: {h.who_should_avoid}</div>}
            </div>
          </div>
        ))}
      </Section>

      <Section title="Quick Relief — 5 Minutes" emoji="⚡" accent="#fb923c">
        <p style={{ fontSize: 13, color: "rgba(232,245,232,0.45)", marginBottom: 8 }}>
          Use these techniques right now when stress hits
        </p>
        {report.quick_relief_5min?.map((item, i) => <ProtocolCard key={i} item={item} />)}
      </Section>

      <Section title="Daily Practice — 20 Minutes" emoji="🗓️" accent="#a78bfa">
        <p style={{ fontSize: 13, color: "rgba(232,245,232,0.45)", marginBottom: 8 }}>
          Consistent daily practice for chronic stress management
        </p>
        {report.daily_practice_20min?.map((item, i) => <ProtocolCard key={i} item={item} />)}
      </Section>

      <Section title="Acupressure Points" emoji="👆">
        {report.acupressure_guide?.map((a, i) => (
          <AcuCard key={i} a={a} extraFields={[["Cortisol effect", "cortisol_effect"]]} />
        ))}
      </Section>

      {report.stress_journal_prompt && (
        <div style={s.infoCallout}>
          <strong style={{ color: "#a78bfa" }}>📓 Stress Journal Prompt:</strong>
          <p style={{ margin: "6px 0 0", color: "rgba(232,245,232,0.75)", fontSize: 14 }}>{report.stress_journal_prompt}</p>
        </div>
      )}

      <SafetyWarning warning={report.general_safety_warning} whenToSeeDoctor={report.when_to_see_doctor} />
    </div>
  )
}
