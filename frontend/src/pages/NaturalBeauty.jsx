import { useState }  from "react"
import usePipeline   from "../hooks/usePipeline"
import FeaturePage   from "../components/FeaturePage"

const AGENTS = [
  { id: "A1", name: "Remedy Hunter",         desc: "Finding beauty remedies" },
  { id: "A2", name: "Science Validator",     desc: "Checking dermatology research" },
  { id: "A3", name: "Pose & Point Verifier", desc: "Verifying beauty poses" },
  { id: "A4", name: "Citation Checker",      desc: "Validating sources" },
  { id: "A5", name: "Report Builder",        desc: "Building beauty guide" },
]

const QUICK_CONCERNS = [
  "Acne & blemishes", "Dry skin", "Dark circles",
  "Hair loss", "Oily skin", "Dull complexion",
  "Fine lines", "Uneven skin tone"
]

export default function NaturalBeauty() {
  const pipeline = usePipeline()
  const [concern, setConcern] = useState("")

  function handleSubmit() {
    if (!concern.trim()) return
    pipeline.run("/natural-beauty/stream", { beauty_concern: concern, feature_key: "natural_beauty" })
  }

  return (
    <FeaturePage
      title="Natural Beauty" emoji="💄"
      subtitle="Evidence-validated herbal beauty remedies, face-map acupressure and yoga poses for skin & hair health"
      agents={AGENTS} pipeline={pipeline} featureKey="natural_beauty"
    >
      {pipeline.status === "idle" && (
        <div className="fp-card">
          <p className="fp-label">What's your beauty concern?</p>
          <div className="fp-quick-tags">
            {QUICK_CONCERNS.map(q => (
              <button
                key={q}
                className={`fp-tag${concern === q ? " fp-tag-active" : ""}`}
                onClick={() => setConcern(q)}
              >
                {q}
              </button>
            ))}
          </div>
          <input
            className="fp-input"
            placeholder="Or type your own concern..."
            value={concern}
            onChange={e => setConcern(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
          />
          <button className="fp-btn" onClick={handleSubmit} disabled={!concern.trim()}>
            Find Natural Remedies →
          </button>
        </div>
      )}
    </FeaturePage>
  )
}
