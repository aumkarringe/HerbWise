import { BottomLine, Section, HerbCard, PoseCard, AcuCard, SafetyWarning, s } from "./shared"

export default function DefaultReport({ report }) {
  const herbItems  = report.herbs || report.sleep_herbs || report.stress_herbs || report.immune_herbs || report.kitchen_remedy_recipes || report.diy_beauty_recipes || []
  const poseItems  = report.yoga_routine || report.lymphatic_yoga_routine || report.beauty_yoga_routine || []
  const pointItems = report.acupressure_guide || report.face_acupressure_guide || []

  return (
    <div className="report-wrapper" style={s.wrapper}>
      <BottomLine report={report} title="💡 Bottom Line" />

      <Section title="Herbal Remedies" emoji="🌿">
        {herbItems.map((h, i) => <HerbCard key={i} h={h} />)}
      </Section>

      <Section title="Yoga Routine" emoji="🧘">
        {poseItems.map((p, i) => <PoseCard key={i} p={p} />)}
      </Section>

      <Section title="Acupressure Guide" emoji="👆">
        {pointItems.map((a, i) => <AcuCard key={i} a={a} />)}
      </Section>

      <SafetyWarning warning={report.general_safety_warning} whenToSeeDoctor={report.when_to_see_doctor} />
    </div>
  )
}
