// Shared primitives used by every feature report renderer

const EV = {
  strong:       { bg: "rgba(22,163,74,0.15)",  color: "#4ade80",  label: "Strong Evidence" },
  moderate:     { bg: "rgba(234,179,8,0.15)",   color: "#facc15",  label: "Moderate Evidence" },
  weak:         { bg: "rgba(239,68,68,0.12)",   color: "#f87171",  label: "Weak Evidence" },
  none:         { bg: "rgba(107,114,128,0.12)", color: "#9ca3af",  label: "No Evidence" },
  contradicted: { bg: "rgba(239,68,68,0.12)",   color: "#f87171",  label: "Contradicted" },
}

export function EvidenceBadge({ level }) {
  const e = EV[level?.toLowerCase()] || EV.moderate
  return (
    <span className="report-evidence-badge" style={{
      background: e.bg, color: e.color, border: `1px solid ${e.color}55`,
      borderRadius: 20, padding: "3px 10px", fontSize: 11,
      fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap"
    }}>
      {e.label}
    </span>
  )
}

export function TypeBadge({ type, color }) {
  const c = color || "#60a5fa"
  return (
    <span style={{
      background: `${c}18`, color: c, border: `1px solid ${c}44`,
      borderRadius: 20, padding: "3px 10px", fontSize: 11,
      fontWeight: 600, textTransform: "capitalize", whiteSpace: "nowrap"
    }}>
      {type}
    </span>
  )
}

export function Section({ title, emoji, children, accent }) {
  return (
    <div className="report-section" style={s.section}>
      <h2 className="report-section-title" style={{ ...s.sectionTitle, color: accent || "#f0faf0" }}>
        {emoji} {title}
      </h2>
      {children}
    </div>
  )
}

export function Card({ children, highlight }) {
  return (
    <div className="report-card" style={{ ...s.card, ...(highlight ? { borderColor: "rgba(74,222,128,0.35)" } : {}) }}>
      {children}
    </div>
  )
}

export function InfoRow({ label, value }) {
  if (!value) return null
  return (
    <div style={s.infoRow}>
      <span style={s.infoLabel}>{label}</span>
      <span style={s.infoValue}>{value}</span>
    </div>
  )
}

export function SafetyWarning({ warning, whenToSeeDoctor }) {
  if (!warning && !whenToSeeDoctor) return null
  return (
    <div className="report-safety-box" style={s.safetyBox}>
      {warning && (
        <>
          <h3 style={s.safetyTitle}>⚠️ Safety Warning</h3>
          <p style={s.safetyText}>{warning}</p>
        </>
      )}
      {whenToSeeDoctor && (
        <>
          <h3 style={{ ...s.safetyTitle, marginTop: warning ? 12 : 0 }}>🏥 When to See a Doctor</h3>
          <p style={s.safetyText}>{whenToSeeDoctor}</p>
        </>
      )}
    </div>
  )
}

export function BottomLine({ report, title }) {
  if (!report.bottom_line) return null
  return (
    <div style={s.bottomLine}>
      <h2 style={s.bottomLineTitle}>{title || "💡 Bottom Line"}</h2>
      <p style={s.bottomLineText}>{report.bottom_line}</p>
    </div>
  )
}

export function HerbCard({ h, extraFields }) {
  return (
    <Card>
      <div className="report-card-header" style={s.cardHeader}>
        <span style={s.itemName}>{h.name || h.herb_name || h.ingredient}</span>
        <EvidenceBadge level={h.evidence_level} />
      </div>
      <div className="report-grid" style={s.grid}>
        <InfoRow label="How to use" value={h.how_to_use || h.how_to_prepare || h.how_to_apply} />
        <InfoRow label="Dosage" value={h.dosage || h.frequency} />
        {extraFields?.map(([lbl, key]) => <InfoRow key={key} label={lbl} value={h[key]} />)}
        {h.safety_notes && <InfoRow label="Safety" value={h.safety_notes} />}
        {h.who_should_avoid && (
          <div style={{ color: "var(--warning-text, #fbbf24)", fontSize: 13 }}>
            <strong>⚠️ Avoid if:</strong> {h.who_should_avoid}
          </div>
        )}
      </div>
    </Card>
  )
}

export function PoseCard({ p, extraFields }) {
  return (
    <Card>
      <div className="report-card-header" style={s.cardHeader}>
        <span style={s.itemName}>{p.name}</span>
        {p.sanskrit_name && <span style={s.sanskrit}>{p.sanskrit_name}</span>}
      </div>
      <div className="report-grid" style={s.grid}>
        <InfoRow label="How to do" value={p.how_to_do} />
        <InfoRow label="Hold time" value={p.hold_time || p.duration} />
        {extraFields?.map(([lbl, key]) => <InfoRow key={key} label={lbl} value={p[key]} />)}
        {p.modification && <InfoRow label="Modification" value={p.modification} />}
        {p.why_it_helps && <InfoRow label="Why it helps" value={p.why_it_helps} />}
      </div>
    </Card>
  )
}

export function AcuCard({ a, extraFields }) {
  return (
    <Card>
      <div className="report-card-header" style={s.cardHeader}>
        <span style={s.itemName}>{a.point_name}</span>
      </div>
      <div className="report-grid" style={s.grid}>
        <InfoRow label="Where" value={a.where_to_find_it || a.face_location} />
        <InfoRow label="How to apply" value={a.how_to_apply} />
        <InfoRow label="Duration" value={a.how_long} />
        {extraFields?.map(([lbl, key]) => <InfoRow key={key} label={lbl} value={a[key]} />)}
        {a.how_often && <InfoRow label="Frequency" value={a.how_often} />}
        {a.why_it_helps && <InfoRow label="Why it helps" value={a.why_it_helps} />}
      </div>
    </Card>
  )
}

export function ProtocolCard({ item }) {
  const typeColor = item.type === "herb" ? "#4ade80" : item.type === "acupressure" ? "#f472b6" : item.type === "breathing" ? "#60a5fa" : "#a78bfa"
  return (
    <Card>
      <div className="report-card-header" style={s.cardHeader}>
        <span style={s.itemName}>{item.name}</span>
        {item.type && <TypeBadge type={item.type} color={typeColor} />}
        {item.duration && <span style={{ fontSize: 12, color: "rgba(232,245,232,0.45)", marginLeft: "auto" }}>⏱ {item.duration}</span>}
      </div>
      <div className="report-grid" style={s.grid}>
        <InfoRow label="Instructions" value={item.instructions} />
        {item.when_to_use && <InfoRow label="When to use" value={item.when_to_use} />}
        {item.why_it_works_fast && <InfoRow label="Why it works fast" value={item.why_it_works_fast} />}
      </div>
    </Card>
  )
}

export const s = {
  wrapper: { display: "flex", flexDirection: "column", gap: 20 },
  bottomLine: {
    background: "rgba(74,222,128,0.06)",
    border: "1.5px solid rgba(74,222,128,0.25)",
    borderRadius: 16, padding: "20px 24px"
  },
  bottomLineTitle: { margin: "0 0 10px", color: "#4ade80", fontSize: 18, fontWeight: 700 },
  bottomLineText: { margin: 0, color: "rgba(232,245,232,0.85)", lineHeight: 1.75, fontSize: 15 },
  section: {
    background: "rgba(10,26,14,0.8)", backdropFilter: "blur(12px)",
    border: "1px solid rgba(74,222,128,0.15)", borderRadius: 16,
    padding: "24px 28px", display: "flex", flexDirection: "column", gap: 14
  },
  sectionTitle: { margin: "0 0 4px", fontSize: 18, fontWeight: 700 },
  card: {
    background: "rgba(5,14,8,0.7)", borderRadius: 12,
    padding: "16px 20px", border: "1px solid rgba(255,255,255,0.07)",
    display: "flex", flexDirection: "column", gap: 12
  },
  cardHeader: { display: "flex", alignItems: "center", gap: 10, justifyContent: "space-between", flexWrap: "wrap" },
  itemName: { fontWeight: 700, fontSize: 15, color: "#f0faf0" },
  sanskrit: { color: "rgba(232,245,232,0.4)", fontSize: 13, fontStyle: "italic" },
  grid: { display: "flex", flexDirection: "column", gap: 7, fontSize: 14, color: "rgba(232,245,232,0.75)", lineHeight: 1.65 },
  infoRow: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "baseline" },
  infoLabel: { fontWeight: 600, color: "rgba(232,245,232,0.55)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" },
  infoValue: { color: "rgba(232,245,232,0.82)", fontSize: 14, lineHeight: 1.6, flex: 1 },
  warn: { color: "var(--warning-text, #fbbf24)", fontSize: 13, fontWeight: 500 },
  infoCallout: {
    background: "rgba(74,222,128,0.04)", border: "1.5px solid rgba(74,222,128,0.2)",
    borderRadius: 14, padding: "16px 20px"
  },
  table: {
    width: "100%", borderCollapse: "collapse",
    border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, overflow: "hidden"
  },
  tableRow: {
    display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
    borderBottom: "1px solid rgba(255,255,255,0.06)", minHeight: 44, alignItems: "center"
  },
  tableHeader: {
    background: "rgba(74,222,128,0.07)", fontWeight: 700, color: "#4ade80",
    borderBottom: "1.5px solid rgba(74,222,128,0.2)"
  },
  tableCell: { padding: "10px 14px", fontSize: 13, color: "rgba(232,245,232,0.75)" },
  safetyBox: {
    background: "rgba(245,158,11,0.07)", border: "1.5px solid rgba(245,158,11,0.25)",
    borderRadius: 16, padding: "20px 24px", display: "flex", flexDirection: "column", gap: 8
  },
  safetyTitle: { margin: 0, color: "#fbbf24", fontSize: 15, fontWeight: 700 },
  safetyText: { margin: 0, color: "rgba(232,245,232,0.75)", fontSize: 14, lineHeight: 1.7 },
}
