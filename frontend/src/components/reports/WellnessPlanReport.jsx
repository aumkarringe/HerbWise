import { BottomLine, Section, HerbCard, PoseCard, AcuCard, SafetyWarning, s } from "./shared"

export default function WellnessPlanReport({ report }) {
  return (
    <div className="report-wrapper" style={s.wrapper}>
      <BottomLine report={report} title="📅 Your Wellness Plan" />

      <Section title="Daily Herbs" emoji="🌿">
        {report.herbs?.map((h, i) => (
          <HerbCard key={i} h={h} extraFields={[["Best time", "best_time"]]} />
        ))}
      </Section>

      <Section title="Morning & Evening Yoga" emoji="🧘">
        {report.yoga_routine?.map((p, i) => (
          <PoseCard key={i} p={p} extraFields={[["Practice time", "practice_time"]]} />
        ))}
      </Section>

      <Section title="Acupressure Guide" emoji="👆">
        {report.acupressure_guide?.map((a, i) => (
          <AcuCard key={i} a={a} extraFields={[["Practice time", "practice_time"]]} />
        ))}
      </Section>

      <SafetyWarning warning={report.general_safety_warning} whenToSeeDoctor={report.when_to_see_doctor} />
    </div>
  )
}
