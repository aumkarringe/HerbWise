import { BottomLine, Section, Card, InfoRow, AcuCard, EvidenceBadge, TypeBadge, SafetyWarning, s } from "./shared"

export default function SleepReport({ report }) {
  return (
    <div className="report-wrapper" style={s.wrapper}>
      <BottomLine report={report} title="😴 Your Sleep Protocol" />

      <Section title="Sleep Herbs" emoji="🌿" accent="#4ade80">
        {report.sleep_herbs?.map((h, i) => (
          <Card key={i}>
            <div className="report-card-header" style={s.cardHeader}>
              <span style={s.itemName}>{h.name}</span>
              <EvidenceBadge level={h.evidence_level} />
            </div>
            <div className="report-grid" style={s.grid}>
              <InfoRow label="How to prepare" value={h.how_to_prepare} />
              <InfoRow label="Dosage" value={h.dosage} />
              <InfoRow label="When to take" value={h.when_to_take} />
              <InfoRow label="How it helps sleep" value={h.how_it_helps_sleep} />
              {h.safety_notes && <InfoRow label="Safety" value={h.safety_notes} />}
              {h.who_should_avoid && <div style={s.warn}>⚠️ Avoid if: {h.who_should_avoid}</div>}
            </div>
          </Card>
        ))}
      </Section>

      <Section title="Bedtime Routine" emoji="🌙" accent="#818cf8">
        <p style={{ fontSize: 13, color: "rgba(232,245,232,0.45)", marginBottom: 8 }}>
          Chronological sequence — follow in order for best results
        </p>
        {report.bedtime_routine?.map((step, i) => {
          const typeColor = step.activity_type === "herb" ? "#4ade80" : step.activity_type === "acupressure" ? "#f472b6" : "#818cf8"
          return (
            <Card key={i} highlight>
              <div className="report-card-header" style={s.cardHeader}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ background: "#818cf818", color: "#818cf8", border: "1px solid #818cf844", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>
                    {step.time_before_bed}
                  </span>
                  <span style={s.itemName}>{step.name}</span>
                </div>
                {step.activity_type && <TypeBadge type={step.activity_type} color={typeColor} />}
              </div>
              <div className="report-grid" style={s.grid}>
                <InfoRow label="Instructions" value={step.instructions} />
                <InfoRow label="Duration" value={step.duration} />
                <InfoRow label="Why at this time" value={step.why_at_this_time} />
              </div>
            </Card>
          )
        })}
      </Section>

      <Section title="Acupressure Points" emoji="👆">
        {report.acupressure_guide?.map((a, i) => (
          <AcuCard key={i} a={a} extraFields={[["How it induces sleep", "how_it_induces_sleep"]]} />
        ))}
      </Section>

      {report.morning_after_tip && (
        <div style={{ ...s.infoCallout, borderColor: "rgba(74,222,128,0.25)" }}>
          <strong style={{ color: "#4ade80" }}>🌅 Morning After Tip:</strong>
          <p style={{ margin: "6px 0 0", color: "rgba(232,245,232,0.75)", fontSize: 14 }}>{report.morning_after_tip}</p>
        </div>
      )}

      <SafetyWarning warning={report.general_safety_warning} whenToSeeDoctor={report.when_to_see_doctor} />
    </div>
  )
}
