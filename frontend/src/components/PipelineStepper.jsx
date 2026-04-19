// src/components/PipelineStepper.jsx

const STATUS_COLORS = {
  idle:    { bg: "#f1f5f9", border: "#cbd5e1", text: "#64748b" },
  running: { bg: "#fffbeb", border: "#fcd34d", text: "#92400e" },
  done:    { bg: "#f0fdf4", border: "#86efac", text: "#14532d" },
}

const STATUS_ICON = {
  idle: "○",
  running: "⟳",
  done: "✓"
}

export default function PipelineStepper({ agents, agentStates, agentSummaries }) {
  return (
    <div style={styles.wrapper}>
      <h3 style={styles.heading}>Pipeline Progress</h3>
      <div style={styles.steps}>
        {agents.map((agent, i) => {
          const state   = agentStates[agent.id] || "idle"
          const summary = agentSummaries[agent.id]
          const colors  = STATUS_COLORS[state]

          return (
            <div key={agent.id} style={styles.row}>

              {/* Connector line */}
              {i > 0 && <div style={styles.line} />}

              {/* Card */}
              <div style={{
                ...styles.card,
                background: colors.bg,
                borderColor: colors.border
              }}>
                <div style={styles.cardTop}>
                  <span style={{ ...styles.icon, color: colors.text }}>
                    {STATUS_ICON[state]}
                  </span>
                  <div>
                    <div style={{ ...styles.agentId, color: colors.text }}>
                      {agent.id}
                    </div>
                    <div style={styles.agentName}>{agent.name}</div>
                    <div style={styles.agentDesc}>{agent.desc}</div>
                  </div>
                </div>

                {/* Summary badges when done */}
                {state === "done" && summary && (
                  <div style={styles.badges}>
                    {Object.entries(summary).map(([k, v]) => (
                      <span key={k} style={styles.badge}>
                        {k.replace(/_/g, " ")}: <strong>{v}</strong>
                      </span>
                    ))}
                  </div>
                )}

                {/* Spinner when running */}
                {state === "running" && (
                  <div style={styles.running}>Processing...</div>
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
    background: "#fff",
    borderRadius: 16,
    padding: "24px 28px",
    border: "1px solid #dcfce7"
  },
  heading: { margin: "0 0 20px", color: "#14532d", fontSize: 18 },
  steps: { display: "flex", flexDirection: "column", gap: 0 },
  row: { display: "flex", flexDirection: "column" },
  line: { width: 2, height: 16, background: "#dcfce7", marginLeft: 20 },
  card: {
    border: "1.5px solid",
    borderRadius: 12,
    padding: "14px 18px",
    transition: "all 0.3s ease"
  },
  cardTop: { display: "flex", gap: 14, alignItems: "flex-start" },
  icon: { fontSize: 22, marginTop: 2, fontWeight: 700, minWidth: 24 },
  agentId: { fontWeight: 700, fontSize: 13 },
  agentName: { fontWeight: 600, fontSize: 15, color: "#1e293b" },
  agentDesc: { fontSize: 13, color: "#64748b", marginTop: 2 },
  badges: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 },
  badge: {
    background: "#dcfce7",
    borderRadius: 20,
    padding: "3px 12px",
    fontSize: 12,
    color: "#166534"
  },
  running: { marginTop: 8, fontSize: 13, color: "#92400e", fontStyle: "italic" }
}