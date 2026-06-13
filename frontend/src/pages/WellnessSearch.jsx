import { useState, useEffect }  from "react"
import SearchBar                from "../components/SearchBar"
import AuthWall                 from "../components/AuthWall"
import FeaturePage              from "../components/FeaturePage"
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
  const pipeline = usePipeline()
  const [showAuthWall, setShowAuthWall]   = useState(false)
  const [guestBlocked, setGuestBlocked]   = useState(false)
  const [lastCondition, setLastCondition] = useState("")

  useEffect(() => {
    if (!user) {
      hasUsedFreeSearch().then(used => { if (used) setGuestBlocked(true) })
    }
  }, [user])

  async function handleSearch(condition) {
    if (!user && guestBlocked) { setShowAuthWall(true); return }
    setLastCondition(condition)
    pipeline.run("/analyze/stream", { condition, feature_key: "wellness_search" })
    if (!user) { await markFreeSearchUsed(); setGuestBlocked(true) }
  }

  return (
    <>
      {showAuthWall && <AuthWall />}

      <FeaturePage
        title="Wellness Search" emoji="🔍"
        subtitle="Search any condition, get evidence-validated herbs, yoga & acupressure"
        agents={AGENTS} pipeline={pipeline} featureKey="wellness_search" condition={lastCondition}
      >
        {!user && !guestBlocked && (
          <div style={{ textAlign: "center" }}>
            <span style={{ display: "inline-block", background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: 20, padding: "6px 16px", fontSize: 13, color: "#4ade80" }}>
              ✨ You have 1 free search — sign in for unlimited access
            </span>
          </div>
        )}
        <SearchBar
          onSearch={handleSearch}
          disabled={pipeline.status === "running"}
          placeholder='e.g. "headache", "insomnia", "joint pain"'
        />
      </FeaturePage>
    </>
  )
}
