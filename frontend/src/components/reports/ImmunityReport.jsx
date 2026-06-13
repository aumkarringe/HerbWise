import { BottomLine, Section, Card, InfoRow, AcuCard, PoseCard, ProtocolCard, EvidenceBadge, TypeBadge, SafetyWarning, s } from "./shared"

export default function ImmunityReport({ report }) {
  return (
    <div className="report-wrapper" style={s.wrapper}>
      <BottomLine report={report} title="🛡️ Your Immunity Protocol" />

      {report.stimulation_vs_modulation_note && (
        <div style={{ ...s.infoCallout, borderColor: "rgba(96,165,250,0.3)", background: "rgba(96,165,250,0.06)" }}>
          <strong style={{ color: "#60a5fa" }}>ℹ️ Stimulation vs Modulation:</strong>
          <p style={{ margin: "6px 0 0", color: "rgba(232,245,232,0.75)", fontSize: 14 }}>{report.stimulation_vs_modulation_note}</p>
        </div>
      )}

      <Section title="Immune-Boosting Herbs" emoji="🌿">
        {report.immune_herbs?.map((h, i) => (
          <Card key={i}>
            <div className="report-card-header" style={s.cardHeader}>
              <span style={s.itemName}>{h.name}</span>
              <EvidenceBadge level={h.evidence_level} />
              {h.type && <TypeBadge type={h.type} color={h.type === "stimulating" ? "#fb923c" : h.type === "modulating" ? "#4ade80" : "#f472b6"} />}
            </div>
            <div className="report-grid" style={s.grid}>
              <InfoRow label="How to use" value={h.how_to_use} />
              <InfoRow label="Dosage" value={h.dosage} />
              <InfoRow label="Immune mechanism" value={h.immune_mechanism} />
              {h.safety_notes && <InfoRow label="Safety" value={h.safety_notes} />}
              {h.who_should_avoid && <div style={s.warn}>⚠️ Avoid if: {h.who_should_avoid}</div>}
            </div>
          </Card>
        ))}
      </Section>

      <Section title="Daily Maintenance" emoji="📅" accent="#4ade80">
        <p style={{ fontSize: 13, color: "rgba(232,245,232,0.45)", marginBottom: 8 }}>
          Do these every day to stay strong
        </p>
        {report.daily_maintenance?.map((item, i) => <ProtocolCard key={i} item={item} />)}
      </Section>

      <Section title="Acute Immune Boost" emoji="🚀" accent="#fb923c">
        <p style={{ fontSize: 13, color: "rgba(232,245,232,0.45)", marginBottom: 8 }}>
          Use these when you feel run-down or getting sick
        </p>
        {report.acute_immune_boost?.map((item, i) => <ProtocolCard key={i} item={item} />)}
      </Section>

      <Section title="Lymphatic Yoga Routine" emoji="🧘">
        {report.lymphatic_yoga_routine?.map((p, i) => (
          <PoseCard key={i} p={p} extraFields={[["Lymphatic benefit", "lymphatic_benefit"]]} />
        ))}
      </Section>

      <Section title="Wei Qi Acupressure Points" emoji="👆">
        {report.acupressure_guide?.map((a, i) => (
          <AcuCard key={i} a={a} extraFields={[["Immune benefit", "immune_benefit"]]} />
        ))}
      </Section>

      <SafetyWarning warning={report.general_safety_warning} whenToSeeDoctor={report.when_to_see_doctor} />
    </div>
  )
}
