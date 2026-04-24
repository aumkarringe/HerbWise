// src/pages/WellnessSearch.jsx
import { useState, useEffect }  from "react"
import SearchBar                from "../components/SearchBar"
import PipelineStepper          from "../components/PipelineStepper"
import ReportView               from "../components/ReportView"
import CitationList             from "../components/CitationList"
import AuthWall                 from "../components/AuthWall"
import SaveReportButton         from "../components/SaveReportButton"
import usePipeline              from "../hooks/usePipeline"
import { useAuth }              from "../context/AuthContext"
import { hasUsedFreeSearch, markFreeSearchUsed } from "../hooks/useGuestLimit"

const AGENTS = [
  { id: "A1", name: "Remedy Hunter",         desc: "Finding herbs, poses & points" },
  { id: "A2", name: "Science Validator",     desc: "Checking peer-reviewed evidence" },
  { id: "A3", name: "Pose & Point Verifier", desc: "Verifying safety & anatomy" },
  { id: "A4", name: "Citation Checker",      desc: "Validating all sources" },
  { id: "A5", name: "Report Builder",        desc: "Assembling final report" },
]

export default function WellnessSearch() {
  const { user } = useAuth()
  const {
    status, agentStates, agentSummaries,
    report, citations, error,
    fromCache, cacheMessage, run
  } = usePipeline()

  const [showAuthWall,  setShowAuthWall]  = useState(false)
  const [guestBlocked,  setGuestBlocked]  = useState(false)

  // Check if guest already used their free search
  useEffect(() => {
    if (!user) {
      hasUsedFreeSearch().then(used => {
        if (used) setGuestBlocked(true)
      })
    }
  }, [user])

  async function handleSearch(condition) {
    // Guest already used free search → show auth wall
    if (!user && guestBlocked) {
      setShowAuthWall(true)
      return
    }

    run("http://localhost:8000/analyze/stream", { condition, feature_key: "wellness_search" })

    // Mark free search as used for guest
    if (!user) {
      await markFreeSearchUsed()
      setGuestBlocked(true)
    }
  }

  return (
    <div className="ws-container" style={styles.container}>

      {/* Auth wall modal - blocking, no close button */}
      {showAuthWall && (
        <AuthWall />
      )}

      {/* Header */}
      <div className="ws-header" style={styles.header}>
        <h1 className="ws-title" style={styles.title}>🔍 Wellness Search</h1>
        <p className="ws-subtitle" style={styles.subtitle}>
          Search any condition — get evidence-validated herbs, yoga & acupressure
        </p>
        {!user && !guestBlocked && (
          <div className="ws-guest-notice" style={styles.guestNotice}>
            ✨ You have 1 free search — sign in for unlimited access
          </div>
        )}
      </div>

      {/* Always show search bar - it will block on second search attempt */}
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
          fromCache={fromCache}
          cacheMessage={cacheMessage}
        />
      )}

      {status === "error" && (
        <div className="ws-error" style={styles.error}>⚠️ {error}</div>
      )}

      {status === "done" && report && (
        <>
          {user && (
            <SaveReportButton
              condition={report.condition}
              featureKey="wellness_search"
              report={report}
              citations={citations}
            />
          )}
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
  guestNotice: {
    marginTop: 10,
    display: "inline-block",
    background: "#f0fdf4",
    border: "1px solid #86efac",
    borderRadius: 20,
    padding: "6px 16px",
    fontSize: 13,
    color: "#166534"
  },
  error: {
    background: "#fef2f2",
    border: "1px solid #fca5a5",
    borderRadius: 12,
    padding: "16px 20px",
    color: "#b91c1c",
    fontSize: 15
  }
}