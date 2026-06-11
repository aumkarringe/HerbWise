// src/components/ReportView.jsx

const EV = {
  strong:       { bg: "rgba(22,163,74,0.15)",  color: "#4ade80",  label: "Strong Evidence" },
  moderate:     { bg: "rgba(234,179,8,0.15)",   color: "#facc15",  label: "Moderate Evidence" },
  weak:         { bg: "rgba(239,68,68,0.12)",   color: "#f87171",  label: "Weak Evidence" },
  none:         { bg: "rgba(107,114,128,0.12)", color: "#9ca3af",  label: "No Evidence" },
  contradicted: { bg: "rgba(239,68,68,0.12)",   color: "#f87171",  label: "Contradicted" },
}

function EvidenceBadge({ level }) {
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

function TypeBadge({ type, color }) {
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

function Section({ title, emoji, children, accent }) {
  return (
    <div className="report-section" style={s.section}>
      <h2 className="report-section-title" style={{ ...s.sectionTitle, color: accent || "#f0faf0" }}>
        {emoji} {title}
      </h2>
      {children}
    </div>
  )
}

function Card({ children, highlight }) {
  return (
    <div className="report-card" style={{ ...s.card, ...(highlight ? { borderColor: "rgba(74,222,128,0.35)" } : {}) }}>
      {children}
    </div>
  )
}

function InfoRow({ label, value }) {
  if (!value) return null
  return (
    <div style={s.infoRow}>
      <span style={s.infoLabel}>{label}</span>
      <span style={s.infoValue}>{value}</span>
    </div>
  )
}

function SafetyWarning({ warning, whenToSeeDoctor }) {
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

function CitationCount({ citations }) {
  if (!citations?.length) return null
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 20, padding: "4px 12px", fontSize: 12, color: "#4ade80", fontWeight: 600 }}>
      🔬 {citations.length} verified citation{citations.length !== 1 ? "s" : ""}
    </div>
  )
}

// ─── Herb Card ────────────────────────────────────────────────────────────────
function HerbCard({ h, extraFields }) {
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

// ─── Pose Card ────────────────────────────────────────────────────────────────
function PoseCard({ p, extraFields }) {
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

// ─── Acupressure Card ─────────────────────────────────────────────────────────
function AcuCard({ a, extraFields }) {
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

// ─── Protocol Row (for quick-relief, routines, etc.) ─────────────────────────
function ProtocolCard({ item }) {
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

// ══════════════════════════════════════════════════════════════════════════════
// FEATURE-SPECIFIC RENDERERS
// ══════════════════════════════════════════════════════════════════════════════

function SleepOptimizerReport({ report }) {
  return (
    <div className="report-wrapper" style={s.wrapper}>
      <BottomLine report={report} title="😴 Your Sleep Protocol" />

      <Section title="Sleep Herbs" emoji="🌿" accent="#4ade80">
        {report.sleep_herbs?.map((h, i) => (
          <Card key={i}>
            <div className="report-card-header" style={s.cardHeader}>
              <span style={s.itemName}>{h.name}</span>
              <EvidenceBadge level={h.evidence_level} />
            </div>
            <div className="report-grid" style={s.grid}>
              <InfoRow label="How to prepare" value={h.how_to_prepare} />
              <InfoRow label="Dosage" value={h.dosage} />
              <InfoRow label="When to take" value={h.when_to_take} />
              <InfoRow label="How it helps sleep" value={h.how_it_helps_sleep} />
              {h.safety_notes && <InfoRow label="Safety" value={h.safety_notes} />}
              {h.who_should_avoid && <div style={s.warn}>⚠️ Avoid if: {h.who_should_avoid}</div>}
            </div>
          </Card>
        ))}
      </Section>

      <Section title="Bedtime Routine" emoji="🌙" accent="#818cf8">
        <p style={{ fontSize: 13, color: "rgba(232,245,232,0.45)", marginBottom: 8 }}>
          Chronological sequence — follow in order for best results
        </p>
        {report.bedtime_routine?.map((step, i) => {
          const typeColor = step.activity_type === "herb" ? "#4ade80" : step.activity_type === "acupressure" ? "#f472b6" : "#818cf8"
          return (
            <Card key={i} highlight>
              <div className="report-card-header" style={s.cardHeader}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ background: "#818cf818", color: "#818cf8", border: "1px solid #818cf844", borderRadius: 20, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>
                    {step.time_before_bed}
                  </span>
                  <span style={s.itemName}>{step.name}</span>
                </div>
                {step.activity_type && <TypeBadge type={step.activity_type} color={typeColor} />}
              </div>
              <div className="report-grid" style={s.grid}>
                <InfoRow label="Instructions" value={step.instructions} />
                <InfoRow label="Duration" value={step.duration} />
                <InfoRow label="Why at this time" value={step.why_at_this_time} />
              </div>
            </Card>
          )
        })}
      </Section>

      <Section title="Acupressure Points" emoji="👆">
        {report.acupressure_guide?.map((a, i) => (
          <AcuCard key={i} a={a} extraFields={[["How it induces sleep", "how_it_induces_sleep"]]} />
        ))}
      </Section>

      {report.morning_after_tip && (
        <div style={{ ...s.infoCallout, borderColor: "rgba(74,222,128,0.25)" }}>
          <strong style={{ color: "#4ade80" }}>🌅 Morning After Tip:</strong>
          <p style={{ margin: "6px 0 0", color: "rgba(232,245,232,0.75)", fontSize: 14 }}>{report.morning_after_tip}</p>
        </div>
      )}

      <SafetyWarning warning={report.general_safety_warning} whenToSeeDoctor={report.when_to_see_doctor} />
    </div>
  )
}

function StressReliefReport({ report }) {
  return (
    <div className="report-wrapper" style={s.wrapper}>
      <BottomLine report={report} title="🧘 Your Stress Relief Protocol" />

      <Section title="Adaptogenic Herbs" emoji="🌿">
        {report.stress_herbs?.map((h, i) => (
          <Card key={i}>
            <div className="report-card-header" style={s.cardHeader}>
              <span style={s.itemName}>{h.name}</span>
              <EvidenceBadge level={h.evidence_level} />
              {h.onset_time && <span style={{ fontSize: 12, color: "rgba(232,245,232,0.45)" }}>⏱ {h.onset_time}</span>}
            </div>
            <div className="report-grid" style={s.grid}>
              <InfoRow label="How to use" value={h.how_to_use} />
              <InfoRow label="Dosage" value={h.dosage} />
              <InfoRow label="How it reduces stress" value={h.how_it_reduces_stress} />
              {h.safety_notes && <InfoRow label="Safety" value={h.safety_notes} />}
              {h.who_should_avoid && <div style={s.warn}>⚠️ Avoid if: {h.who_should_avoid}</div>}
            </div>
          </Card>
        ))}
      </Section>

      <Section title="Quick Relief — 5 Minutes" emoji="⚡" accent="#fb923c">
        <p style={{ fontSize: 13, color: "rgba(232,245,232,0.45)", marginBottom: 8 }}>
          Use these techniques right now when stress hits
        </p>
        {report.quick_relief_5min?.map((item, i) => <ProtocolCard key={i} item={item} />)}
      </Section>

      <Section title="Daily Practice — 20 Minutes" emoji="🗓️" accent="#a78bfa">
        <p style={{ fontSize: 13, color: "rgba(232,245,232,0.45)", marginBottom: 8 }}>
          Consistent daily practice for chronic stress management
        </p>
        {report.daily_practice_20min?.map((item, i) => <ProtocolCard key={i} item={item} />)}
      </Section>

      <Section title="Acupressure Points" emoji="👆">
        {report.acupressure_guide?.map((a, i) => (
          <AcuCard key={i} a={a} extraFields={[["Cortisol effect", "cortisol_effect"]]} />
        ))}
      </Section>

      {report.stress_journal_prompt && (
        <div style={s.infoCallout}>
          <strong style={{ color: "#a78bfa" }}>📓 Stress Journal Prompt:</strong>
          <p style={{ margin: "6px 0 0", color: "rgba(232,245,232,0.75)", fontSize: 14 }}>{report.stress_journal_prompt}</p>
        </div>
      )}

      <SafetyWarning warning={report.general_safety_warning} whenToSeeDoctor={report.when_to_see_doctor} />
    </div>
  )
}

function ImmunityBoosterReport({ report }) {
  return (
    <div className="report-wrapper" style={s.wrapper}>
      <BottomLine report={report} title="🛡️ Your Immunity Protocol" />

      {report.stimulation_vs_modulation_note && (
        <div style={{ ...s.infoCallout, borderColor: "rgba(96,165,250,0.3)", background: "rgba(96,165,250,0.06)" }}>
          <strong style={{ color: "#60a5fa" }}>ℹ️ Stimulation vs Modulation:</strong>
          <p style={{ margin: "6px 0 0", color: "rgba(232,245,232,0.75)", fontSize: 14 }}>{report.stimulation_vs_modulation_note}</p>
        </div>
      )}

      <Section title="Immune-Boosting Herbs" emoji="🌿">
        {report.immune_herbs?.map((h, i) => (
          <Card key={i}>
            <div className="report-card-header" style={s.cardHeader}>
              <span style={s.itemName}>{h.name}</span>
              <EvidenceBadge level={h.evidence_level} />
              {h.type && <TypeBadge type={h.type} color={h.type === "stimulating" ? "#fb923c" : h.type === "modulating" ? "#4ade80" : "#f472b6"} />}
            </div>
            <div className="report-grid" style={s.grid}>
              <InfoRow label="How to use" value={h.how_to_use} />
              <InfoRow label="Dosage" value={h.dosage} />
              <InfoRow label="Immune mechanism" value={h.immune_mechanism} />
              {h.safety_notes && <InfoRow label="Safety" value={h.safety_notes} />}
              {h.who_should_avoid && <div style={s.warn}>⚠️ Avoid if: {h.who_should_avoid}</div>}
            </div>
          </Card>
        ))}
      </Section>

      <Section title="Daily Maintenance" emoji="📅" accent="#4ade80">
        <p style={{ fontSize: 13, color: "rgba(232,245,232,0.45)", marginBottom: 8 }}>
          Do these every day to stay strong
        </p>
        {report.daily_maintenance?.map((item, i) => <ProtocolCard key={i} item={item} />)}
      </Section>

      <Section title="Acute Immune Boost" emoji="🚀" accent="#fb923c">
        <p style={{ fontSize: 13, color: "rgba(232,245,232,0.45)", marginBottom: 8 }}>
          Use these when you feel run-down or getting sick
        </p>
        {report.acute_immune_boost?.map((item, i) => <ProtocolCard key={i} item={item} />)}
      </Section>

      <Section title="Lymphatic Yoga Routine" emoji="🧘">
        {report.lymphatic_yoga_routine?.map((p, i) => (
          <PoseCard key={i} p={p} extraFields={[["Lymphatic benefit", "lymphatic_benefit"]]} />
        ))}
      </Section>

      <Section title="Wei Qi Acupressure Points" emoji="👆">
        {report.acupressure_guide?.map((a, i) => (
          <AcuCard key={i} a={a} extraFields={[["Immune benefit", "immune_benefit"]]} />
        ))}
      </Section>

      <SafetyWarning warning={report.general_safety_warning} whenToSeeDoctor={report.when_to_see_doctor} />
    </div>
  )
}

function HomeRemediesPlusReport({ report }) {
  return (
    <div className="report-wrapper" style={s.wrapper}>
      <BottomLine report={report} title="🏠 Kitchen Remedy Guide" />

      {report.pantry_checklist?.length > 0 && (
        <div style={{ ...s.infoCallout, borderColor: "rgba(74,222,128,0.3)" }}>
          <strong style={{ color: "#4ade80" }}>🛒 Check Your Pantry:</strong>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
            {report.pantry_checklist.map((item, i) => (
              <span key={i} style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: 20, padding: "4px 12px", fontSize: 13, color: "#4ade80" }}>
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      <Section title="Kitchen Remedy Recipes" emoji="🍃">
        {report.kitchen_remedy_recipes?.map((h, i) => (
          <Card key={i}>
            <div className="report-card-header" style={s.cardHeader}>
              <div>
                <div style={s.itemName}>{h.recipe_name || h.ingredient}</div>
                {h.ingredient && h.recipe_name && <div style={{ fontSize: 12, color: "rgba(232,245,232,0.45)", marginTop: 2 }}>Main ingredient: {h.ingredient}</div>}
              </div>
              <EvidenceBadge level={h.evidence_level} />
            </div>
            <div className="report-grid" style={s.grid}>
              <InfoRow label="What you need" value={h.what_you_need} />
              <InfoRow label="Step by step" value={h.step_by_step} />
              <InfoRow label="Dosage" value={h.dosage} />
              <InfoRow label="Why it helps" value={h.why_it_helps} />
              {h.safety_notes && <InfoRow label="Safety" value={h.safety_notes} />}
            </div>
          </Card>
        ))}
      </Section>

      <Section title="Zero-Equipment Yoga" emoji="🧘">
        {report.yoga_routine?.map((p, i) => <PoseCard key={i} p={p} />)}
      </Section>

      <Section title="Acupressure Guide" emoji="👆">
        {report.acupressure_guide?.map((a, i) => <AcuCard key={i} a={a} />)}
      </Section>

      {report.quick_reference_table?.length > 0 && (
        <Section title="Quick Reference" emoji="📋">
          <div className="report-table" style={s.table}>
            <div className="report-table-row report-table-header" style={{ ...s.tableRow, ...s.tableHeader, gridTemplateColumns: "1fr 2fr" }}>
              <div className="report-table-cell" style={s.tableCell}>Symptom</div>
              <div className="report-table-cell" style={s.tableCell}>Kitchen Remedy</div>
            </div>
            {report.quick_reference_table.map((row, i) => (
              <div key={i} className="report-table-row" style={{ ...s.tableRow, gridTemplateColumns: "1fr 2fr", background: i % 2 === 0 ? "rgba(10,26,14,0.4)" : "transparent" }}>
                <div className="report-table-cell" style={{ ...s.tableCell, fontWeight: 600 }}>{row.symptom}</div>
                <div className="report-table-cell" style={s.tableCell}>{row.kitchen_remedy}</div>
              </div>
            ))}
          </div>
        </Section>
      )}

      <SafetyWarning warning={report.general_safety_warning} whenToSeeDoctor={report.when_to_see_doctor} />
    </div>
  )
}

function NaturalBeautyReport({ report }) {
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

function SeasonalRemediesReport({ report }) {
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

function SymptomAnalyzerReport({ report }) {
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

function WellnessPlanReport({ report }) {
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

function BreathingTestReport({ report }) {
  return (
    <div className="report-wrapper" style={s.wrapper}>
      <BottomLine report={report} title="🌬️ Breathing Practice Guide" />

      <Section title="Breathing Techniques" emoji="🌬️" accent="#60a5fa">
        {report.breathing_technique_guides?.map((t, i) => (
          <Card key={i}>
            <div className="report-card-header" style={s.cardHeader}>
              <span style={s.itemName}>{t.name}</span>
              <EvidenceBadge level={t.evidence_level} />
              {t.type && <TypeBadge type={t.type} color="#60a5fa" />}
            </div>
            <div className="report-grid" style={s.grid}>
              <InfoRow label="Breath ratio" value={t.breath_ratio} />
              <InfoRow label="Rounds" value={t.rounds} />
              <InfoRow label="Duration" value={t.total_duration} />
              <InfoRow label="When to use" value={t.when_to_use} />
              <InfoRow label="How to do" value={t.step_by_step} />
              <InfoRow label="Benefits" value={t.benefits} />
              {t.beginner_tip && <InfoRow label="Beginner tip" value={t.beginner_tip} />}
              {t.contraindications && <div style={s.warn}>⚠️ Cautions: {t.contraindications}</div>}
            </div>
          </Card>
        ))}
      </Section>

      {report.seven_day_schedule?.length > 0 && (
        <Section title="7-Day Training Schedule" emoji="📅">
          <div className="report-table" style={s.table}>
            <div className="report-table-row report-table-header" style={{ ...s.tableRow, ...s.tableHeader, gridTemplateColumns: "80px 1fr 80px 1fr" }}>
              {["Day", "Technique", "Duration", "Focus"].map(h => (
                <div key={h} className="report-table-cell" style={s.tableCell}>{h}</div>
              ))}
            </div>
            {report.seven_day_schedule.map((d, i) => (
              <div key={i} className="report-table-row" style={{ ...s.tableRow, gridTemplateColumns: "80px 1fr 80px 1fr", background: i % 2 === 0 ? "rgba(10,26,14,0.4)" : "transparent" }}>
                <div className="report-table-cell" style={{ ...s.tableCell, fontWeight: 700, color: "#60a5fa" }}>Day {d.day}</div>
                <div className="report-table-cell" style={s.tableCell}>{d.technique}</div>
                <div className="report-table-cell" style={s.tableCell}>{d.duration_minutes}m</div>
                <div className="report-table-cell" style={s.tableCell}>{d.focus}</div>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section title="Lung Support Herbs" emoji="🌿">
        {report.herbs?.map((h, i) => (
          <HerbCard key={i} h={h} extraFields={[["Respiratory benefit", "respiratory_benefit"]]} />
        ))}
      </Section>

      <SafetyWarning warning={report.general_safety_warning} whenToSeeDoctor={report.when_to_see_doctor} />
    </div>
  )
}

function ExercisePlannerReport({ report }) {
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

function SafetyCheckReport({ report }) {
  const safetyColor = (rating) => {
    if (rating === "very_safe" || rating === "generally_safe") return "#4ade80"
    if (rating === "use_with_caution") return "#fbbf24"
    return "#f87171"
  }
  return (
    <div className="report-wrapper" style={s.wrapper}>
      <BottomLine report={report} title="🛡️ Safety Assessment" />

      {report.patient_profile_summary && (
        <div style={{ ...s.infoCallout, borderColor: "rgba(96,165,250,0.25)" }}>
          <strong style={{ color: "#60a5fa" }}>👤 Profile:</strong>
          <p style={{ margin: "6px 0 0", color: "rgba(232,245,232,0.75)", fontSize: 14 }}>{report.patient_profile_summary}</p>
        </div>
      )}

      <Section title="Safety-Rated Herbs" emoji="🌿">
        <div className="report-table" style={s.table}>
          <div className="report-table-row report-table-header" style={{ ...s.tableRow, ...s.tableHeader, gridTemplateColumns: "1.5fr 1fr 2fr 1fr" }}>
            {["Herb", "Dosage", "Drug Interactions", "Safety Rating"].map(h => (
              <div key={h} className="report-table-cell" style={s.tableCell}>{h}</div>
            ))}
          </div>
          {report.safety_rated_herbs?.map((h, i) => (
            <div key={i} className="report-table-row" style={{ ...s.tableRow, gridTemplateColumns: "1.5fr 1fr 2fr 1fr", background: i % 2 === 0 ? "rgba(10,26,14,0.4)" : "transparent" }}>
              <div className="report-table-cell" style={{ ...s.tableCell, fontWeight: 700 }}>{h.name}</div>
              <div className="report-table-cell" style={s.tableCell}>{h.dosage_for_this_profile}</div>
              <div className="report-table-cell" style={s.tableCell}>{h.drug_interactions || "None reported"}</div>
              <div className="report-table-cell" style={{ ...s.tableCell, fontWeight: 700, color: safetyColor(h.safety_rating) }}>
                {h.safety_rating?.replace(/_/g, " ")}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {report.safest_options?.length > 0 && (
        <div style={{ ...s.infoCallout, borderColor: "rgba(74,222,128,0.3)" }}>
          <strong style={{ color: "#4ade80" }}>✅ Safest Options for Your Profile:</strong>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
            {report.safest_options.map((item, i) => (
              <span key={i} style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: 20, padding: "4px 12px", fontSize: 13, color: "#4ade80" }}>
                ✓ {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {report.herbs_to_avoid_for_this_profile?.length > 0 && (
        <div style={s.safetyBox}>
          <strong style={s.safetyTitle}>🚫 Herbs to Avoid for Your Profile:</strong>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
            {report.herbs_to_avoid_for_this_profile.map((item, i) => (
              <span key={i} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 20, padding: "4px 12px", fontSize: 13, color: "#f87171" }}>
                ✕ {item}
              </span>
            ))}
          </div>
        </div>
      )}

      <SafetyWarning warning={report.general_safety_warning} whenToSeeDoctor={report.when_to_see_doctor} />
    </div>
  )
}

function DosageCalculatorReport({ report }) {
  return (
    <div className="report-wrapper" style={s.wrapper}>
      <BottomLine report={report} title="💊 Age & Weight-Adjusted Dosages" />

      <Section title="Herb Dosages" emoji="📊">
        <div className="report-table" style={s.table}>
          <div className="report-table-row report-table-header" style={{ ...s.tableRow, ...s.tableHeader, gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr" }}>
            {["Herb", "Your Dose", "Max Daily", "Timing", "Form"].map(h => (
              <div key={h} className="report-table-cell" style={s.tableCell}>{h}</div>
            ))}
          </div>
          {report.dosage_table?.map((h, i) => (
            <div key={i} className="report-table-row" style={{ ...s.tableRow, gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr", background: i % 2 === 0 ? "rgba(10,26,14,0.4)" : "transparent" }}>
              <div className="report-table-cell" style={{ ...s.tableCell, fontWeight: 700 }}>
                {h.herb_name}
                <div style={{ fontSize: 11, marginTop: 2 }}><EvidenceBadge level={h.evidence_level} /></div>
              </div>
              <div className="report-table-cell" style={{ ...s.tableCell, color: "#4ade80", fontWeight: 600 }}>{h.personalized_dose}</div>
              <div className="report-table-cell" style={{ ...s.tableCell, color: "#fbbf24" }}>{h.max_daily_dose}</div>
              <div className="report-table-cell" style={s.tableCell}>{h.timing}</div>
              <div className="report-table-cell" style={s.tableCell}>{h.dose_form}</div>
            </div>
          ))}
        </div>
      </Section>

      {report.dosage_notes && (
        <div style={s.infoCallout}>
          <strong style={{ color: "#4ade80" }}>📝 Dosage Notes:</strong>
          <p style={{ margin: "6px 0 0", color: "rgba(232,245,232,0.75)", fontSize: 14 }}>{report.dosage_notes}</p>
        </div>
      )}

      <SafetyWarning warning={report.important_warnings || report.general_safety_warning} whenToSeeDoctor={report.when_to_see_doctor} />
    </div>
  )
}

function PreparationGuideReport({ report }) {
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

// Default renderer for wellness_search and any unrecognized features
function DefaultReport({ report }) {
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

function BottomLine({ report, title }) {
  if (!report.bottom_line) return null
  return (
    <div style={s.bottomLine}>
      <h2 style={s.bottomLineTitle}>{title || "💡 Bottom Line"}</h2>
      <p style={s.bottomLineText}>{report.bottom_line}</p>
    </div>
  )
}

// ─── Main Router ──────────────────────────────────────────────────────────────
export default function ReportView({ report }) {
  if (!report) return null
  const feature = report.feature_key || "wellness_search"
  switch (feature) {
    case "sleep_optimizer":    return <SleepOptimizerReport report={report} />
    case "stress_relief":      return <StressReliefReport report={report} />
    case "immunity_booster":   return <ImmunityBoosterReport report={report} />
    case "home_remedies_plus": return <HomeRemediesPlusReport report={report} />
    case "natural_beauty":     return <NaturalBeautyReport report={report} />
    case "seasonal_remedies":  return <SeasonalRemediesReport report={report} />
    case "symptom_analyzer":   return <SymptomAnalyzerReport report={report} />
    case "wellness_plan":      return <WellnessPlanReport report={report} />
    case "breathing_test":     return <BreathingTestReport report={report} />
    case "exercise_planner":   return <ExercisePlannerReport report={report} />
    case "safety_check":       return <SafetyCheckReport report={report} />
    case "dosage_calculator":  return <DosageCalculatorReport report={report} />
    case "preparation_guide":  return <PreparationGuideReport report={report} />
    default:                   return <DefaultReport report={report} />
  }
}

// ─── Shared Styles ────────────────────────────────────────────────────────────
const s = {
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
