// src/components/CitationList.jsx

const SOURCE_COLORS = {
  "PubMed":           { bg: "rgba(96,165,250,0.15)", text: "#60a5fa" },
  "Semantic Scholar": { bg: "rgba(167,139,250,0.15)", text: "#a78bfa" },
  "OpenAlex":         { bg: "rgba(74,222,128,0.12)",  text: "#4ade80" },
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
    background: "rgba(10,26,14,0.8)", backdropFilter: "blur(12px)",
    border: "1px solid rgba(74,222,128,0.2)",
    borderRadius: 16, padding: "24px 28px",
    display: "flex", flexDirection: "column", gap: 16
  },
  title: { margin: "0 0 4px", color: "#f0faf0", fontSize: 20, fontWeight: 700 },
  subtitle: { fontSize: 13, color: "rgba(232,245,232,0.45)", margin: "0 0 8px" },
  item: {
    borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: 16,
    display: "flex", flexDirection: "column", gap: 6
  },
  top: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  sourceBadge: {
    borderRadius: 20, padding: "2px 10px",
    fontSize: 11, fontWeight: 700
  },
  typeBadge: {
    background: "rgba(74,222,128,0.08)", color: "#4ade80",
    border: "1px solid rgba(74,222,128,0.2)",
    borderRadius: 20, padding: "2px 10px",
    fontSize: 11, fontWeight: 600, textTransform: "uppercase"
  },
  itemName: { fontWeight: 600, fontSize: 14, color: "#f0faf0" },
  year: { fontSize: 12, color: "rgba(232,245,232,0.35)", marginLeft: "auto" },
  paperTitle: { fontSize: 14, color: "rgba(232,245,232,0.8)", fontWeight: 500, lineHeight: 1.5 },
  authors: { fontSize: 12, color: "rgba(232,245,232,0.45)" },
  journal: { fontSize: 12, color: "rgba(232,245,232,0.45)", fontStyle: "italic" },
  linkRow: { display: "flex", gap: 16, alignItems: "center" },
  link: { fontSize: 12, color: "#4ade80", wordBreak: "break-all" },
  doiLink: { fontSize: 12, color: "rgba(232,245,232,0.4)", textDecoration: "none", fontWeight: 600 }
}