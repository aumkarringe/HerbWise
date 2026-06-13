import { BottomLine, Section, Card, InfoRow, HerbCard, SafetyWarning, s } from "./shared"

export default function ExercisePlannerReport({ report }) {
  return (
    <div className="report-wrapper" style={s.wrapper}>
      <BottomLine report={report} title="🏋️ Your Exercise Plan" />

      {report.total_duration_minutes && (
        <div style={{ textAlign: "center", color: "#4ade80", fontWeight: 700, fontSize: 15, marginBottom: -8 }}>
          Total workout: {report.total_duration_minutes} minutes
        </div>
      )}

      <Section title="Warm-up" emoji="🔥">
        {report.warmup?.map((p, i) => (
          <Card key={i}>
            <span style={s.itemName}>{p.name} {p.sanskrit_name && <span style={s.sanskrit}>({p.sanskrit_name})</span>}</span>
            <div className="report-grid" style={s.grid}>
              <InfoRow label="Duration" value={p.duration} />
              <InfoRow label="How to do" value={p.how_to_do} />
              <InfoRow label="Purpose" value={p.warmup_purpose} />
            </div>
          </Card>
        ))}
      </Section>

      <Section title="Main Sequence" emoji="💪">
        {report.main_sequence?.map((p, i) => (
          <Card key={i}>
            <span style={s.itemName}>{p.name} {p.sanskrit_name && <span style={s.sanskrit}>({p.sanskrit_name})</span>}</span>
            <div className="report-grid" style={s.grid}>
              <InfoRow label="Sets / Reps" value={p.hold_time_or_reps} />
              <InfoRow label="Sets" value={p.sets} />
              <InfoRow label="How to do" value={p.how_to_do} />
              <InfoRow label="Why it helps" value={p.why_it_helps} />
              {p.beginner_variation && <InfoRow label="Beginner version" value={p.beginner_variation} />}
              {p.advanced_variation && <InfoRow label="Advanced version" value={p.advanced_variation} />}
            </div>
          </Card>
        ))}
      </Section>

      <Section title="Cool-down" emoji="🧘">
        {report.cooldown?.map((p, i) => (
          <Card key={i}>
            <span style={s.itemName}>{p.name}</span>
            <div className="report-grid" style={s.grid}>
              <InfoRow label="Duration" value={p.duration} />
              <InfoRow label="How to do" value={p.how_to_do} />
              <InfoRow label="Recovery purpose" value={p.recovery_purpose} />
            </div>
          </Card>
        ))}
      </Section>

      <Section title="Recovery Herbs" emoji="🌿">
        {report.recovery_herbs?.map((h, i) => (
          <HerbCard key={i} h={h} extraFields={[["When to take", "when_to_take"], ["Recovery benefit", "recovery_benefit"]]} />
        ))}
      </Section>

      <SafetyWarning warning={report.general_safety_warning} whenToSeeDoctor={report.when_to_see_doctor} />
    </div>
  )
}
