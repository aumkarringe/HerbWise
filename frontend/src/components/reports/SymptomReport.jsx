import { BottomLine, Section, HerbCard, PoseCard, AcuCard, SafetyWarning, s } from "./shared"

export default function SymptomReport({ report }) {
  return (
    <div className="report-wrapper" style={s.wrapper}>
      {report.detected_root_cause && (
        <div style={{ ...s.infoCallout, borderColor: "rgba(96,165,250,0.3)", background: "rgba(96,165,250,0.06)" }}>
          <strong style={{ color: "#60a5fa" }}>🔍 Detected Root Cause:</strong>
          <p style={{ margin: "6px 0 0", color: "#f0faf0", fontSize: 15, fontWeight: 600 }}>{report.detected_root_cause}</p>
        </div>
      )}
      <BottomLine report={report} title="🩺 Symptom Analysis" />

      <Section title="Targeted Herbs" emoji="🌿">
        {report.herbs?.map((h, i) => (
          <HerbCard key={i} h={h} extraFields={[["Targets symptom", "targets_symptom"]]} />
        ))}
      </Section>

      <Section title="Symptom-Relief Yoga" emoji="🧘">
        {report.yoga_routine?.map((p, i) => (
          <PoseCard key={i} p={p} extraFields={[["Targets symptom", "targets_symptom"]]} />
        ))}
      </Section>

      <Section title="Acupressure Guide" emoji="👆">
        {report.acupressure_guide?.map((a, i) => (
          <AcuCard key={i} a={a} extraFields={[["Targets symptom", "targets_symptom"]]} />
        ))}
      </Section>

      {report.symptom_tracking_tip && (
        <div style={s.infoCallout}>
          <strong style={{ color: "#4ade80" }}>📊 Symptom Tracking Tip:</strong>
          <p style={{ margin: "6px 0 0", color: "rgba(232,245,232,0.75)", fontSize: 14 }}>{report.symptom_tracking_tip}</p>
        </div>
      )}

      <SafetyWarning warning={report.general_safety_warning} whenToSeeDoctor={report.when_to_see_doctor} />
    </div>
  )
}
