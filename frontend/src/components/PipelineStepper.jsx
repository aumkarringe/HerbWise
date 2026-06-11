// src/components/PipelineStepper.jsx

const STATUS_COLORS = {
  idle:    { bg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.08)", text: "rgba(232,245,232,0.35)" },
  running: { bg: "rgba(251,146,60,0.08)",  border: "rgba(251,146,60,0.35)",  text: "#fb923c" },
  done:    { bg: "rgba(74,222,128,0.08)",  border: "rgba(74,222,128,0.3)",   text: "#4ade80" },
}

const STATUS_ICON = {
  idle:    "○",
  running: "⟳",
  done:    "✓"
}

export default function PipelineStepper({
  agents,
  agentStates,
  agentSummaries,
  fromCache = false,       // ← new prop
  cacheMessage = ""        // ← new prop
}) {
  return (
    <div className="pipeline-wrapper" style={styles.wrapper}>
      <h3 className="pipeline-heading" style={styles.heading}>Pipeline Progress</h3>

      {/* Cache badge — only shows when result came from cache */}
      {fromCache && (
        <div className="pipeline-cache-badge" style={styles.cacheBadge}>
          ⚡ {cacheMessage || "Loaded from cache — instant result"}
        </div>
      )}

      <div className="pipeline-steps" style={styles.steps}>
        {agents.map((agent, i) => {
          const state   = agentStates[agent.id] || "idle"
          const summary = agentSummaries[agent.id]
          const colors  = STATUS_COLORS[state]

          return (
            <div key={agent.id} className="pipeline-row" style={styles.row}>

              {/* Connector line */}
              {i > 0 && <div className="pipeline-line" style={styles.line} />}

              {/* Card */}
              <div className="pipeline-card" style={{
                ...styles.card,
                background:  colors.bg,
                borderColor: colors.border
              }}>
                <div className="pipeline-card-top" style={styles.cardTop}>
                  <span className="pipeline-icon" style={{ ...styles.icon, color: colors.text }}>
                    {STATUS_ICON[state]}
                  </span>
                  <div>
                    <div style={{ ...styles.agentId, color: colors.text }}>
                      {agent.id}
                    </div>
                    <div style={styles.agentName}>{agent.name}</div>
                    <div className="pipeline-agent-desc" style={styles.agentDesc}>{agent.desc}</div>
                  </div>
                </div>

                {/* Summary badges when done */}
                {state === "done" && summary && (
                  <div className="pipeline-badges" style={styles.badges}>
                    {Object.entries(summary).map(([k, v]) => (
                      <span key={k} style={styles.badge}>
                        {k.replace(/_/g, " ")}: <strong>{v}</strong>
                      </span>
                    ))}
                  </div>
                )}

                {/* Spinner when running */}
                {state === "running" && (
                  <div className="pipeline-running" style={styles.running}>Processing...</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    background: "rgba(10,26,14,0.8)",
    backdropFilter: "blur(12px)",
    borderRadius: 16,
    padding: "24px 28px",
    border: "1px solid rgba(74,222,128,0.2)"
  },
  heading:  { margin: "0 0 20px", color: "#f0faf0", fontSize: 18, fontWeight: 700 },
  steps:    { display: "flex", flexDirection: "column", gap: 0 },
  row:      { display: "flex", flexDirection: "column" },
  line:     { width: 2, height: 14, background: "rgba(74,222,128,0.15)", marginLeft: 20 },
  card: {
    border: "1.5px solid",
    borderRadius: 12,
    padding: "14px 18px",
    transition: "all 0.3s ease"
  },
  cardTop:   { display: "flex", gap: 14, alignItems: "flex-start" },
  icon:      { fontSize: 20, marginTop: 2, fontWeight: 700, minWidth: 24 },
  agentId:   { fontWeight: 700, fontSize: 12, letterSpacing: "0.05em" },
  agentName: { fontWeight: 600, fontSize: 14, color: "#f0faf0" },
  agentDesc: { fontSize: 12, color: "rgba(232,245,232,0.5)", marginTop: 2 },
  badges:    { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 },
  badge: {
    background: "rgba(74,222,128,0.1)",
    border: "1px solid rgba(74,222,128,0.2)",
    borderRadius: 20,
    padding: "3px 12px",
    fontSize: 11,
    color: "#4ade80"
  },
  cacheBadge: {
    background: "rgba(251,191,36,0.08)",
    border: "1px solid rgba(251,191,36,0.25)",
    borderRadius: 10,
    padding: "8px 16px",
    fontSize: 13,
    color: "#fbbf24",
    fontWeight: 600,
    marginBottom: 12,
    textAlign: "center"
  },
  running: { marginTop: 8, fontSize: 13, color: "#fb923c", fontStyle: "italic" }
}