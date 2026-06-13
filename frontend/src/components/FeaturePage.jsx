import PipelineLoader   from "./PipelineLoader"
import ReportView       from "./ReportView"
import CitationList     from "./CitationList"
import SaveReportButton from "./SaveReportButton"
import { useAuth }      from "../context/AuthContext"

export default function FeaturePage({ title, emoji, subtitle, agents, pipeline, featureKey, condition, showSave = true, children }) {
  const { user } = useAuth()
  const { status, agentStates, report, citations,
          error, warning, fromCache, cacheMessage, retry } = pipeline

  return (
    <div className="fp-page">
      <div className="fp-header">
        <div className="fp-icon">{emoji}</div>
        <h1 className="fp-title">{title}</h1>
        {subtitle && <p className="fp-subtitle">{subtitle}</p>}
      </div>

      {children}

      {(status === "running" || status === "warning") && (
        <PipelineLoader
          agents={agents}
          agentStates={agentStates}
          fromCache={fromCache}
          cacheMessage={cacheMessage}
        />
      )}

      {status === "warning" && warning && (
        <div className="fp-warning">⚠️ {warning}</div>
      )}

      {status === "error" && error && (
        <div className="fp-error-box">
          <span>⚠️ {error}</span>
          <button className="fp-retry-btn" onClick={retry}>Try again</button>
        </div>
      )}

      {status === "done" && report && (
        <>
          {showSave && user && (
            <SaveReportButton
              condition={condition || title}
              featureKey={featureKey}
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
