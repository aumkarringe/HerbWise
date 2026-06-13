import { BottomLine, Section, Card, EvidenceBadge, SafetyWarning, s } from "./shared"

export default function PreparationGuideReport({ report }) {
  return (
    <div className="report-wrapper" style={s.wrapper}>
      <BottomLine report={report} title="📖 Preparation Recipes" />

      <Section title="Step-by-Step Recipes" emoji="🍃">
        {report.preparation_guides?.map((h, i) => (
          <Card key={i}>
            <div className="report-card-header" style={s.cardHeader}>
              <h3 style={{ margin: 0, color: "#4ade80", fontSize: 17, fontWeight: 700 }}>{h.herb_name}</h3>
              <EvidenceBadge level={h.evidence_level} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, fontSize: 14, color: "rgba(232,245,232,0.75)" }}>
              <div>
                <strong style={{ color: "rgba(232,245,232,0.9)" }}>Ingredients:</strong>
                <ul style={{ margin: "6px 0 0 16px", paddingLeft: 0 }}>
                  {h.ingredients?.map((ing, j) => <li key={j}>{ing.quantity} {ing.item}</li>)}
                </ul>
              </div>
              <div>
                <strong style={{ color: "rgba(232,245,232,0.9)" }}>Equipment:</strong>
                <ul style={{ margin: "6px 0 0 16px", paddingLeft: 0 }}>
                  {h.equipment?.map((eq, j) => <li key={j}>{eq}</li>)}
                </ul>
              </div>
            </div>
            <div>
              <strong style={{ fontSize: 14, color: "rgba(232,245,232,0.9)" }}>Instructions:</strong>
              <ol style={{ margin: "8px 0 0 16px", paddingLeft: 0, fontSize: 14, color: "rgba(232,245,232,0.75)", display: "flex", flexDirection: "column", gap: 6 }}>
                {h.step_by_step?.map((step, j) => (
                  <li key={j}>
                    {step.instruction}
                    {step.duration && <span style={{ color: "rgba(232,245,232,0.4)", fontSize: 12 }}> — {step.duration}</span>}
                    {step.tip && <div style={{ marginTop: 3, color: "#fbbf24", fontSize: 12 }}>💡 {step.tip}</div>}
                  </li>
                ))}
              </ol>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 13, color: "rgba(232,245,232,0.65)" }}>
              {h.dosage && <div><strong>Dosage:</strong> {h.dosage}</div>}
              {h.best_time_to_use && <div><strong>Best time:</strong> {h.best_time_to_use}</div>}
              {h.storage_instructions && <div><strong>Storage:</strong> {h.storage_instructions}</div>}
              {h.shelf_life && <div><strong>Shelf life:</strong> {h.shelf_life}</div>}
            </div>
            {h.how_to_tell_if_bad && (
              <div style={{ ...s.warn, fontSize: 13 }}>⚠️ Gone bad if: {h.how_to_tell_if_bad}</div>
            )}
          </Card>
        ))}
      </Section>

      <SafetyWarning warning={report.general_safety_warning} whenToSeeDoctor={report.when_to_see_doctor} />
    </div>
  )
}
