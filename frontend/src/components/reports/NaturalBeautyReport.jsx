import { BottomLine, Section, Card, InfoRow, PoseCard, EvidenceBadge, SafetyWarning, s } from "./shared"

export default function NaturalBeautyReport({ report }) {
  return (
    <div className="report-wrapper" style={s.wrapper}>
      <BottomLine report={report} title="💄 Natural Beauty Guide" />

      {(report.morning_beauty_routine || report.evening_skin_ritual) && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {report.morning_beauty_routine && (
            <div style={{ ...s.infoCallout, borderColor: "rgba(251,191,36,0.3)", background: "rgba(251,191,36,0.05)" }}>
              <strong style={{ color: "#fbbf24" }}>🌅 Morning Routine</strong>
              <p style={{ margin: "8px 0 0", fontSize: 13, color: "rgba(232,245,232,0.7)", lineHeight: 1.6 }}>{report.morning_beauty_routine}</p>
            </div>
          )}
          {report.evening_skin_ritual && (
            <div style={{ ...s.infoCallout, borderColor: "rgba(167,139,250,0.3)", background: "rgba(167,139,250,0.05)" }}>
              <strong style={{ color: "#a78bfa" }}>🌙 Evening Ritual</strong>
              <p style={{ margin: "8px 0 0", fontSize: 13, color: "rgba(232,245,232,0.7)", lineHeight: 1.6 }}>{report.evening_skin_ritual}</p>
            </div>
          )}
        </div>
      )}

      <Section title="DIY Beauty Recipes" emoji="🌸" accent="#f472b6">
        {report.diy_beauty_recipes?.map((h, i) => (
          <Card key={i}>
            <div className="report-card-header" style={s.cardHeader}>
              <div>
                <div style={s.itemName}>{h.recipe_name || h.herb_name}</div>
                {h.herb_name && h.recipe_name && <div style={{ fontSize: 12, color: "rgba(232,245,232,0.45)", marginTop: 2 }}>Herb: {h.herb_name}</div>}
              </div>
              <EvidenceBadge level={h.evidence_level} />
            </div>
            <div className="report-grid" style={s.grid}>
              <InfoRow label="Ingredients" value={h.ingredients} />
              <InfoRow label="How to make" value={h.how_to_make} />
              <InfoRow label="How to apply" value={h.how_to_apply} />
              <InfoRow label="Frequency" value={h.frequency} />
              <InfoRow label="Skin benefit" value={h.skin_benefit} />
              {h.patch_test_required && (
                <div style={{ color: "#fbbf24", fontSize: 13, fontWeight: 600 }}>🔬 Patch test required before use</div>
              )}
              {h.who_should_avoid && <div style={s.warn}>⚠️ Avoid if: {h.who_should_avoid}</div>}
            </div>
          </Card>
        ))}
      </Section>

      <Section title="Beauty Yoga Routine" emoji="🧘" accent="#f472b6">
        {report.beauty_yoga_routine?.map((p, i) => (
          <PoseCard key={i} p={p} extraFields={[["Beauty benefit", "beauty_benefit"]]} />
        ))}
      </Section>

      <Section title="Face Acupressure" emoji="✨">
        {report.face_acupressure_guide?.map((a, i) => (
          <Card key={i}>
            <div className="report-card-header" style={s.cardHeader}>
              <span style={s.itemName}>{a.point_name}</span>
            </div>
            <div className="report-grid" style={s.grid}>
              <InfoRow label="Face location" value={a.face_location} />
              <InfoRow label="How to apply" value={a.how_to_apply} />
              <InfoRow label="Duration" value={a.how_long} />
              <InfoRow label="Beauty benefit" value={a.beauty_benefit} />
            </div>
          </Card>
        ))}
      </Section>

      <SafetyWarning warning={report.general_safety_warning} />
    </div>
  )
}
