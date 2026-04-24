// src/components/CitationList.jsx

const SOURCE_COLORS = {
  "PubMed":           { bg: "#dbeafe", text: "#1d4ed8" },
  "Semantic Scholar": { bg: "#ede9fe", text: "#6d28d9" },
  "OpenAlex":         { bg: "#dcfce7", text: "#166534" },
}

export default function CitationList({ citations }) {
  if (!citations?.length) return null

  return (
    <div className="citations-wrapper" style={styles.wrapper}>
      <h2 className="citations-title" style={styles.title}>📚 Verified Citations</h2>
      <p className="citations-subtitle" style={styles.subtitle}>
        All citations retrieved directly from PubMed, Semantic Scholar,
        and OpenAlex — no LLM-generated sources
      </p>
      {citations.map((c, i) => {
        const colors = SOURCE_COLORS[c.source] || { bg: "#f1f5f9", text: "#475569" }
        return (
          <div key={i} className="citation-item" style={styles.item}>
            <div className="citation-top" style={styles.top}>
              <span style={{ ...styles.sourceBadge, background: colors.bg, color: colors.text }}>
                {c.source}
              </span>
              <span style={styles.typeBadge}>{c.item_type}</span>
              <span style={styles.itemName}>{c.item_name}</span>
              {c.year && <span style={styles.year}>{c.year}</span>}
            </div>

            <div className="citation-paper-title" style={styles.paperTitle}>{c.title || c.paper_title || "Title unavailable"}</div>
            {c.authors && <div className="citation-authors" style={styles.authors}>{c.authors}</div>}
            {c.journal && <div className="citation-journal" style={styles.journal}>{c.journal}</div>}

            <div className="citation-link-row" style={styles.linkRow}>
              <a className="citation-link" href={c.url} target="_blank" rel="noreferrer" style={styles.link}>
                {c.pmid ? `PubMed ID: ${c.pmid}` : c.url}
              </a>
              {c.doi && (
                <a href={`https://doi.org/${c.doi}`} target="_blank"
                   rel="noreferrer" className="citation-doi-link" style={styles.doiLink}>
                  DOI →
                </a>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

const styles = {
  wrapper: {
    background: "#fff", border: "1px solid #dcfce7",
    borderRadius: 16, padding: "24px 28px",
    display: "flex", flexDirection: "column", gap: 16
  },
  title: { margin: "0 0 4px", color: "#14532d", fontSize: 20 },
  subtitle: { fontSize: 13, color: "#6b7280", margin: "0 0 8px" },
  item: {
    borderBottom: "1px solid #f1f5f9", paddingBottom: 16,
    display: "flex", flexDirection: "column", gap: 6
  },
  top: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  sourceBadge: {
    borderRadius: 20, padding: "2px 10px",
    fontSize: 11, fontWeight: 700
  },
  typeBadge: {
    background: "#f0fdf4", color: "#166534",
    borderRadius: 20, padding: "2px 10px",
    fontSize: 11, fontWeight: 600, textTransform: "uppercase"
  },
  itemName: { fontWeight: 600, fontSize: 14, color: "#1e293b" },
  year: { fontSize: 12, color: "#9ca3af", marginLeft: "auto" },
  paperTitle: { fontSize: 14, color: "#1e293b", fontWeight: 500, lineHeight: 1.5 },
  authors: { fontSize: 12, color: "#6b7280" },
  journal: { fontSize: 12, color: "#6b7280", fontStyle: "italic" },
  linkRow: { display: "flex", gap: 16, alignItems: "center" },
  link: { fontSize: 12, color: "#16a34a", wordBreak: "break-all" },
  doiLink: { fontSize: 12, color: "#6b7280", textDecoration: "none", fontWeight: 600 }
}