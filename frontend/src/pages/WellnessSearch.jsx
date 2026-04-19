// src/pages/WellnessSearch.jsx
import SearchBar       from "../components/SearchBar"
import PipelineStepper from "../components/PipelineStepper"
import ReportView      from "../components/ReportView"
import CitationList    from "../components/CitationList"
import usePipeline     from "../hooks/usePipeline"

const AGENTS = [
  { id: "A1", name: "Remedy Hunter",         desc: "Finding herbs, poses & points" },
  { id: "A2", name: "Science Validator",     desc: "Checking peer-reviewed evidence" },
  { id: "A3", name: "Pose & Point Verifier", desc: "Verifying safety & anatomy" },
  { id: "A4", name: "Citation Checker",      desc: "Validating all sources" },
  { id: "A5", name: "Report Builder",        desc: "Assembling final report" },
]

export default function WellnessSearch() {
  const {
    status, agentStates, agentSummaries,
    report, citations, error, run
  } = usePipeline()

  function handleSearch(condition) {
    run("http://localhost:8000/analyze/stream", { condition })
  }

  return (
    <div style={styles.container}>

      <div style={styles.header}>
        <h1 style={styles.title}>🔍 Wellness Search</h1>
        <p style={styles.subtitle}>
          Search any condition — get evidence-validated herbs, yoga & acupressure
        </p>
      </div>

      <SearchBar
        onSearch={handleSearch}
        disabled={status === "running"}
        placeholder='e.g. "headache", "insomnia", "joint pain"'
      />

      {status !== "idle" && (
        <PipelineStepper
          agents={AGENTS}
          agentStates={agentStates}
          agentSummaries={agentSummaries}
        />
      )}

      {status === "error" && (
        <div style={styles.error}>⚠️ {error}</div>
      )}

      {status === "done" && report && (
        <>
          <ReportView report={report} />
          <CitationList citations={citations} />
        </>
      )}

    </div>
  )
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 28,
    maxWidth: 860,
    margin: "0 auto",
  },
  header: { textAlign: "center" },
  title: { fontSize: 32, color: "#14532d", margin: 0 },
  subtitle: { color: "#4b7a5e", marginTop: 8, fontSize: 15 },
  error: {
    background: "#fef2f2",
    border: "1px solid #fca5a5",
    borderRadius: 12,
    padding: "16px 20px",
    color: "#b91c1c",
    fontSize: 15
  }
}