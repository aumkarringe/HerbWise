// src/components/ReportView.jsx

const EVIDENCE_COLORS = {
  strong:       "#16a34a",
  moderate:     "#d97706",
  weak:         "#dc2626",
  none:         "#6b7280",
  contradicted: "#dc2626"
}

function EvidenceBadge({ level }) {
  return (
    <span className="report-evidence-badge" style={{
      background: EVIDENCE_COLORS[level] || "#6b7280",
      color: "#fff",
      borderRadius: 20,
      padding: "2px 10px",
      fontSize: 12,
      fontWeight: 600,
      textTransform: "uppercase"
    }}>
      {level}
    </span>
  )
}

function Section({ title, emoji, children }) {
  return (
    <div className="report-section" style={styles.section}>
      <h2 className="report-section-title" style={styles.sectionTitle}>{emoji} {title}</h2>
      {children}
    </div>
  )
}

// ─── Feature-Specific Renderers ────────────────────────────────────────────

function BreathingTestReport({ report }) {
  return (
    <div className="report-wrapper" style={styles.wrapper}>
      <div style={styles.bottomLine}>
        <h2 style={styles.bottomLineTitle}>💡 Bottom Line</h2>
        <p style={styles.bottomLineText}>{report.bottom_line}</p>
      </div>

      <Section title="Breathing Techniques" emoji="🌬️">
        {report.breathing_technique_guides?.map((t, i) => (
          <div key={i} className="report-card" style={styles.card}>
            <div className="report-card-header" style={styles.cardHeader}>
              <span style={styles.itemName}>{t.name}</span>
              <EvidenceBadge level={t.evidence_level || "moderate"} />
            </div>
            <div className="report-grid" style={styles.grid}>
              <div><strong>Breath Ratio:</strong> {t.breath_ratio}</div>
              <div><strong>Rounds:</strong> {t.rounds}</div>
              <div><strong>Duration:</strong> {t.total_duration}</div>
              <div><strong>How to do:</strong> {t.step_by_step}</div>
              <div><strong>Benefits:</strong> {t.benefits}</div>
              {t.contraindications && <div style={styles.warning}><strong>Cautions:</strong> {t.contraindications}</div>}
            </div>
          </div>
        ))}
      </Section>

      <Section title="Supporting Herbs" emoji="🌿">
        {report.herbs?.map((h, i) => (
          <div key={i} className="report-card" style={styles.card}>
            <div className="report-card-header" style={styles.cardHeader}>
              <span style={styles.itemName}>{h.name}</span>
              <EvidenceBadge level={h.evidence_level || "moderate"} />
            </div>
            <div className="report-grid" style={styles.grid}>
              <div><strong>How to use:</strong> {h.how_to_use}</div>
              <div><strong>Dosage:</strong> {h.dosage}</div>
              <div><strong>Why it helps:</strong> {h.respiratory_benefit}</div>
            </div>
          </div>
        ))}
      </Section>

      <div className="report-safety-box" style={styles.safetyBox}>
        <h3 style={styles.safetyTitle}>⚠️ Safety Notes</h3>
        <p style={styles.safetyText}>{report.overall_safety_notes}</p>
      </div>
    </div>
  )
}

function ExercisePlannerReport({ report }) {
  return (
    <div className="report-wrapper" style={styles.wrapper}>
      <div style={styles.bottomLine}>
        <h2 style={styles.bottomLineTitle}>💡 Bottom Line</h2>
        <p style={styles.bottomLineText}>{report.bottom_line}</p>
      </div>

      <Section title="Warm-up Sequence" emoji="🔥">
        {report.warmup?.map((p, i) => (
          <div key={i} className="report-card" style={styles.card}>
            <span style={styles.itemName}>{p.name}</span>
            <div className="report-grid" style={styles.grid}>
              <div><strong>Duration:</strong> {p.duration}</div>
              <div><strong>How to do:</strong> {p.how_to_do}</div>
            </div>
          </div>
        ))}
      </Section>

      <Section title="Main Sequence" emoji="💪">
        {report.main_sequence?.map((p, i) => (
          <div key={i} className="report-card" style={styles.card}>
            <span style={styles.itemName}>{p.name}</span>
            <div className="report-grid" style={styles.grid}>
              <div><strong>Sets / Reps:</strong> {p.hold_time_or_reps}</div>
              <div><strong>How to do:</strong> {p.how_to_do}</div>
              <div><strong>Beginner:</strong> {p.beginner_variation}</div>
              <div><strong>Advanced:</strong> {p.advanced_variation}</div>
            </div>
          </div>
        ))}
      </Section>

      <Section title="Cool-down" emoji="🧘">
        {report.cooldown?.map((p, i) => (
          <div key={i} className="report-card" style={styles.card}>
            <span style={styles.itemName}>{p.name}</span>
            <div className="report-grid" style={styles.grid}>
              <div><strong>Duration:</strong> {p.duration}</div>
              <div><strong>How to do:</strong> {p.how_to_do}</div>
            </div>
          </div>
        ))}
      </Section>

      <Section title="Recovery Herbs" emoji="🌿">
        {report.recovery_herbs?.map((h, i) => (
          <div key={i} className="report-card" style={styles.card}>
            <span style={styles.itemName}>{h.name}</span>
            <div className="report-grid" style={styles.grid}>
              <div><strong>When to take:</strong> {h.when_to_take}</div>
              <div><strong>Dosage:</strong> {h.dosage}</div>
              <div><strong>Why it helps:</strong> {h.recovery_benefit}</div>
            </div>
          </div>
        ))}
      </Section>

      <div className="report-safety-box" style={styles.safetyBox}>
        <h3 style={styles.safetyTitle}>⚠️ Safety Notes</h3>
        <p style={styles.safetyText}>{report.overall_safety_notes}</p>
      </div>
    </div>
  )
}

function SafetyCheckReport({ report }) {
  return (
    <div className="report-wrapper" style={styles.wrapper}>
      <div style={styles.bottomLine}>
        <h2 style={styles.bottomLineTitle}>💡 Safe Remedies for Your Profile</h2>
        <p style={styles.bottomLineText}>{report.bottom_line}</p>
      </div>

      <Section title="Herbs - Safety Table" emoji="🌿">
        <div className="report-table" style={styles.table}>
          <div className="report-table-row report-table-header" style={{ ...styles.tableRow, ...styles.tableHeader }}>
            <div className="report-table-cell" style={styles.tableCell}>Herb</div>
            <div className="report-table-cell" style={styles.tableCell}>Dosage</div>
            <div className="report-table-cell" style={styles.tableCell}>Drug Interactions</div>
            <div className="report-table-cell" style={styles.tableCell}>Your Status</div>
          </div>
          {report.safety_rated_herbs?.map((h, i) => (
            <div key={i} className="report-table-row" style={styles.tableRow}>
              <div className="report-table-cell" style={styles.tableCell}><strong>{h.name}</strong></div>
              <div className="report-table-cell" style={styles.tableCell}>{h.dosage_for_this_profile}</div>
              <div className="report-table-cell" style={styles.tableCell}>{h.drug_interactions || "None reported"}</div>
              <div className="report-table-cell" style={{ ...styles.tableCell, color: h.safety_rating === "very_safe" || h.safety_rating === "generally_safe" ? "#16a34a" : "#dc2626" }}>
                {h.safety_rating}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <div className="report-safety-box" style={styles.safetyBox}>
        <h3 style={styles.safetyTitle}>⚠️ Important Safety Notes</h3>
        <p style={styles.safetyText}>{report.general_safety_warning}</p>
        <h3 style={styles.safetyTitle}>🏥 When to See a Doctor</h3>
        <p style={styles.safetyText}>{report.when_to_see_doctor}</p>
      </div>
    </div>
  )
}

function DosageCalculatorReport({ report }) {
  return (
    <div className="report-wrapper" style={styles.wrapper}>
      <div style={styles.bottomLine}>
        <h2 style={styles.bottomLineTitle}>💡 Age & Weight-Adjusted Dosages</h2>
        <p style={styles.bottomLineText}>{report.bottom_line}</p>
      </div>

      <Section title="Herb Dosages" emoji="📊">
        <div className="report-table" style={styles.table}>
          <div className="report-table-row report-table-header" style={{ ...styles.tableRow, ...styles.tableHeader }}>
            <div className="report-table-cell" style={styles.tableCell}>Herb</div>
            <div className="report-table-cell" style={styles.tableCell}>Recommended Dose</div>
            <div className="report-table-cell" style={styles.tableCell}>Frequency</div>
            <div className="report-table-cell" style={styles.tableCell}>Form</div>
          </div>
          {report.dosage_table?.map((h, i) => (
            <div key={i} className="report-table-row" style={styles.tableRow}>
              <div className="report-table-cell" style={styles.tableCell}><strong>{h.herb_name}</strong></div>
              <div className="report-table-cell" style={styles.tableCell}>{h.personalized_dose}</div>
              <div className="report-table-cell" style={styles.tableCell}>{h.timing}</div>
              <div className="report-table-cell" style={styles.tableCell}>{h.dose_form}</div>
            </div>
          ))}
        </div>
      </Section>

      <div className="report-safety-box" style={styles.safetyBox}>
        <h3 style={styles.safetyTitle}>⚠️ Dosage Notes</h3>
        <p style={styles.safetyText}>{report.overall_safety_notes}</p>
      </div>
    </div>
  )
}

function PreparationGuideReport({ report }) {
  return (
    <div className="report-wrapper" style={styles.wrapper}>
      <div style={styles.bottomLine}>
        <h2 style={styles.bottomLineTitle}>💡 How to Prepare Your Herbs</h2>
        <p style={styles.bottomLineText}>{report.bottom_line}</p>
      </div>

      <Section title="Recipes" emoji="🍃">
        {report.preparation_guides?.map((h, i) => (
          <div key={i} className="report-card" style={{ ...styles.card, padding: "20px" }}>
            <h3 style={{ margin: "0 0 12px", color: "#14532d", fontSize: 18 }}>
              {h.herb_name}
            </h3>
            <div className="report-grid" style={styles.grid}>
              <div>
                <strong>Ingredients:</strong>
                <ul style={{ margin: "4px 0 0 16px", paddingLeft: 0 }}>
                  {h.ingredients?.map((ing, j) => <li key={j}>{ing.quantity} {ing.item}</li>)}
                </ul>
              </div>
              <div>
                <strong>Instructions:</strong>
                <ol style={{ margin: "4px 0 0 16px", paddingLeft: 0 }}>
                  {h.step_by_step?.map((step, j) => <li key={j}>{step.instruction}</li>)}
                </ol>
              </div>
              <div><strong>Dosage:</strong> {h.dosage}</div>
              <div><strong>Storage:</strong> {h.storage_instructions}</div>
            </div>
          </div>
        ))}
      </Section>

      <div className="report-safety-box" style={styles.safetyBox}>
        <h3 style={styles.safetyTitle}>⚠️ Preparation Notes</h3>
        <p style={styles.safetyText}>{report.overall_safety_notes}</p>
      </div>
    </div>
  )
}

// ─── Default Report (for herbs + yoga + acupressure) ──────────────────────

function DefaultReport({ report }) {
  const herbItems = report.herbs || report.sleep_herbs || report.stress_herbs || report.immune_herbs || report.kitchen_remedy_recipes || report.diy_beauty_recipes || []
  const poseItems = report.yoga_routine || report.lymphatic_yoga_routine || report.beauty_yoga_routine || []
  const pointItems = report.acupressure_guide || report.face_acupressure_guide || []

  return (
    <div className="report-wrapper" style={styles.wrapper}>

      {/* Bottom Line */}
      <div style={styles.bottomLine}>
        <h2 style={styles.bottomLineTitle}>💡 Bottom Line</h2>
        <p style={styles.bottomLineText}>{report.bottom_line}</p>
      </div>

      {/* Herbs */}
      <Section title="Herbal Remedies" emoji="🌿">
        {herbItems?.map((h, i) => (
          <div key={i} className="report-card" style={styles.card}>
            <div className="report-card-header" style={styles.cardHeader}>
              <span style={styles.itemName}>{h.name || h.herb_name || h.ingredient}</span>
              <EvidenceBadge level={h.evidence_level || "moderate"} />
            </div>
            <div className="report-grid" style={styles.grid}>
              <div><strong>How to use:</strong> {h.how_to_use || h.how_to_prepare || h.how_to_apply || h.step_by_step}</div>
              <div><strong>Dosage:</strong> {h.dosage || h.frequency}</div>
              <div><strong>Safety:</strong> {h.safety_notes || h.patch_test_required && "Patch test required"}</div>
              <div style={styles.warning}><strong>Avoid if:</strong> {h.who_should_avoid}</div>
            </div>
          </div>
        ))}
      </Section>

      {/* Yoga */}
      <Section title="Yoga Routine" emoji="🧘">
        {poseItems?.map((p, i) => (
          <div key={i} className="report-card" style={styles.card}>
            <div className="report-card-header" style={styles.cardHeader}>
              <span style={styles.itemName}>{p.name}</span>
              <span style={styles.sanskrit}>{p.sanskrit_name}</span>
            </div>
            <div className="report-grid" style={styles.grid}>
              <div><strong>How to do:</strong> {p.how_to_do}</div>
              <div><strong>Hold time:</strong> {p.hold_time}</div>
              <div><strong>Modification:</strong> {p.modification}</div>
              <div><strong>Why it helps:</strong> {p.why_it_helps}</div>
            </div>
          </div>
        ))}
      </Section>

      {/* Acupressure */}
      <Section title="Acupressure Guide" emoji="👆">
        {pointItems?.map((a, i) => (
          <div key={i} className="report-card" style={styles.card}>
            <div className="report-card-header" style={styles.cardHeader}>
              <span style={styles.itemName}>{a.point_name}</span>
            </div>
            <div className="report-grid" style={styles.grid}>
              <div><strong>Where:</strong> {a.where_to_find_it}</div>
              <div><strong>How to apply:</strong> {a.how_to_apply}</div>
              <div><strong>Duration:</strong> {a.how_long}</div>
              <div><strong>Frequency:</strong> {a.how_often}</div>
              <div><strong>Why it helps:</strong> {a.why_it_helps}</div>
            </div>
          </div>
        ))}
      </Section>

      {/* Safety */}
      <div className="report-safety-box" style={styles.safetyBox}>
        <h3 style={styles.safetyTitle}>⚠️ Safety Warning</h3>
        <p style={styles.safetyText}>{report.general_safety_warning}</p>
        <h3 style={styles.safetyTitle}>🏥 When to See a Doctor</h3>
        <p style={styles.safetyText}>{report.when_to_see_doctor}</p>
      </div>

    </div>
  )
}

// ─── Main Router Component ────────────────────────────────────────────────

export default function ReportView({ report }) {
  if (!report) return null

  const feature = report.feature_key || "wellness_search"

  // Route to feature-specific renderer
  switch (feature) {
    case "breathing_test":
      return <BreathingTestReport report={report} />
    case "exercise_planner":
      return <ExercisePlannerReport report={report} />
    case "safety_check":
      return <SafetyCheckReport report={report} />
    case "dosage_calculator":
      return <DosageCalculatorReport report={report} />
    case "preparation_guide":
      return <PreparationGuideReport report={report} />
    default:
      return <DefaultReport report={report} />
  }
}


const styles = {
  wrapper: { display: "flex", flexDirection: "column", gap: 28 },
  bottomLine: {
    background: "#f0fdf4",
    border: "1.5px solid #86efac",
    borderRadius: 16,
    padding: "20px 24px"
  },
  bottomLineTitle: { margin: "0 0 10px", color: "#14532d", fontSize: 20 },
  bottomLineText: { margin: 0, color: "#1e293b", lineHeight: 1.7, fontSize: 15 },
  section: {
    background: "#fff",
    border: "1px solid #dcfce7",
    borderRadius: 16,
    padding: "24px 28px",
    display: "flex",
    flexDirection: "column",
    gap: 16
  },
  sectionTitle: { margin: "0 0 4px", color: "#14532d", fontSize: 20 },
  card: {
    background: "#f8fafc",
    borderRadius: 12,
    padding: "16px 20px",
    border: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    gap: 12
  },
  cardHeader: { display: "flex", alignItems: "center", gap: 12, justifyContent: "space-between" },
  itemName: { fontWeight: 700, fontSize: 16, color: "#1e293b" },
  sanskrit: { color: "#64748b", fontSize: 13, fontStyle: "italic" },
  grid: { display: "flex", flexDirection: "column", gap: 6, fontSize: 14, color: "#374151", lineHeight: 1.6 },
  warning: { color: "#b45309" },
  
  // Table styles
  table: {
    width: "100%",
    borderCollapse: "collapse",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    overflow: "hidden"
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    borderBottom: "1px solid #e2e8f0",
    minHeight: 48,
    alignItems: "center"
  },
  tableHeader: {
    background: "#f0fdf4",
    fontWeight: 700,
    color: "#14532d",
    borderBottom: "2px solid #86efac"
  },
  tableCell: {
    padding: "12px 16px",
    fontSize: 14,
    color: "#374151"
  },
  
  safetyBox: {
    background: "#fff7ed",
    border: "1.5px solid #fed7aa",
    borderRadius: 16,
    padding: "20px 24px",
    display: "flex",
    flexDirection: "column",
    gap: 8
  },
  safetyTitle: { margin: 0, color: "#9a3412", fontSize: 16 },
  safetyText: { margin: 0, color: "#1e293b", fontSize: 14, lineHeight: 1.7 }
}