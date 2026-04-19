// src/components/CitationList.jsx

export default function CitationList({ citations }) {
  if (!citations.length) return null

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>📚 Verified Citations</h2>
      {citations.map((c, i) => (
        <div key={i} style={styles.item}>
          <div style={styles.top}>
            <span style={styles.type}>{c.item_type}</span>
            <span style={styles.name}>{c.item_name}</span>
            <span style={{
              ...styles.status,
              background: c.verification_status === "verified" ? "#dcfce7" : "#fef9c3",
              color: c.verification_status === "verified" ? "#166534" : "#854d0e"
            }}>
              {c.verification_status}
            </span>
          </div>
          <div style={styles.paper}>{c.paper_title} — {c.authors} ({c.year})</div>
          <a href={c.url} target="_blank" rel="noreferrer" style={styles.link}>
            {c.url}
          </a>
        </div>
      ))}
    </div>
  )
}

const styles = {
  wrapper: {
    background: "#fff",
    border: "1px solid #dcfce7",
    borderRadius: 16,
    padding: "24px 28px",
    display: "flex",
    flexDirection: "column",
    gap: 16
  },
  title: { margin: "0 0 4px", color: "#14532d", fontSize: 20 },
  item: {
    borderBottom: "1px solid #f1f5f9",
    paddingBottom: 14,
    display: "flex",
    flexDirection: "column",
    gap: 4
  },
  top: { display: "flex", alignItems: "center", gap: 10 },
  type: {
    background: "#e0f2fe",
    color: "#0369a1",
    borderRadius: 20,
    padding: "2px 10px",
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase"
  },
  name: { fontWeight: 600, fontSize: 15, color: "#1e293b" },
  status: { borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600, marginLeft: "auto" },
  paper: { fontSize: 13, color: "#475569" },
  link: { fontSize: 12, color: "#16a34a", wordBreak: "break-all" }
}