import { BottomLine, Section, HerbCard, PoseCard, AcuCard, SafetyWarning, s } from "./shared"

export default function SeasonalReport({ report }) {
  return (
    <div className="report-wrapper" style={s.wrapper}>
      {report.season && (
        <div style={{ ...s.infoCallout, borderColor: "rgba(251,191,36,0.3)", background: "rgba(251,191,36,0.05)" }}>
          <strong style={{ color: "#fbbf24", fontSize: 16 }}>
            {report.season === "winter" ? "❄️" : report.season === "spring" ? "🌸" : report.season === "summer" ? "☀️" : "🍂"}&nbsp;
            {report.season?.charAt(0).toUpperCase() + report.season?.slice(1)} Protocol
          </strong>
          {report.seasonal_health_context && (
            <p style={{ margin: "8px 0 0", fontSize: 14, color: "rgba(232,245,232,0.7)", lineHeight: 1.6 }}>{report.seasonal_health_context}</p>
          )}
        </div>
      )}
      <BottomLine report={report} title="🍂 Seasonal Bottom Line" />

      <Section title="Seasonal Herbs" emoji="🌿">
        {report.herbs?.map((h, i) => (
          <HerbCard key={i} h={h} extraFields={[["Why perfect for this season", "why_perfect_for_this_season"]]} />
        ))}
      </Section>

      <Section title="Seasonal Yoga Routine" emoji="🧘">
        {report.yoga_routine?.map((p, i) => (
          <PoseCard key={i} p={p} extraFields={[["Seasonal benefit", "seasonal_benefit"]]} />
        ))}
      </Section>

      <Section title="TCM Acupressure Points" emoji="👆">
        {report.acupressure_guide?.map((a, i) => (
          <AcuCard key={i} a={a} extraFields={[["TCM seasonal significance", "tcm_seasonal_significance"]]} />
        ))}
      </Section>

      <SafetyWarning warning={report.general_safety_warning} whenToSeeDoctor={report.when_to_see_doctor} />
    </div>
  )
}
