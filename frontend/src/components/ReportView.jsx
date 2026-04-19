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
    <span style={{
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
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>{emoji} {title}</h2>
      {children}
    </div>
  )
}

export default function ReportView({ report }) {
  return (
    <div style={styles.wrapper}>

      {/* Bottom Line */}
      <div style={styles.bottomLine}>
        <h2 style={styles.bottomLineTitle}>💡 Bottom Line</h2>
        <p style={styles.bottomLineText}>{report.bottom_line}</p>
      </div>

      {/* Herbs */}
      <Section title="Herbal Remedies" emoji="🌿">
        {report.herbs.map((h, i) => (
          <div key={i} style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.itemName}>{h.name}</span>
              <EvidenceBadge level={h.evidence_level} />
            </div>
            <div style={styles.grid}>
              <div><strong>How to use:</strong> {h.how_to_use}</div>
              <div><strong>Dosage:</strong> {h.dosage}</div>
              <div><strong>Safety:</strong> {h.safety_notes}</div>
              <div style={styles.warning}><strong>Avoid if:</strong> {h.who_should_avoid}</div>
            </div>
          </div>
        ))}
      </Section>

      {/* Yoga */}
      <Section title="Yoga Routine" emoji="🧘">
        {report.yoga_routine.map((p, i) => (
          <div key={i} style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.itemName}>{p.name}</span>
              <span style={styles.sanskrit}>{p.sanskrit_name}</span>
            </div>
            <div style={styles.grid}>
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
        {report.acupressure_guide.map((a, i) => (
          <div key={i} style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.itemName}>{a.point_name}</span>
            </div>
            <div style={styles.grid}>
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
      <div style={styles.safetyBox}>
        <h3 style={styles.safetyTitle}>⚠️ Safety Warning</h3>
        <p style={styles.safetyText}>{report.general_safety_warning}</p>
        <h3 style={styles.safetyTitle}>🏥 When to See a Doctor</h3>
        <p style={styles.safetyText}>{report.when_to_see_doctor}</p>
      </div>

    </div>
  )
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
  cardHeader: { display: "flex", alignItems: "center", gap: 12 },
  itemName: { fontWeight: 700, fontSize: 16, color: "#1e293b" },
  sanskrit: { color: "#64748b", fontSize: 13, fontStyle: "italic" },
  grid: { display: "flex", flexDirection: "column", gap: 6, fontSize: 14, color: "#374151", lineHeight: 1.6 },
  warning: { color: "#b45309" },
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