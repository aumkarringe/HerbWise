// src/hooks/usePipeline.js
import { useState } from "react"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"

/**
 * Sanitize error messages - don't expose sensitive details
 */
function sanitizeError(err) {
  const message = err.message || String(err)
  
  // Don't expose file paths, stack traces, or internal errors
  if (message.includes("/") || message.includes("node_modules") || message.includes("at ")) {
    return "An error occurred. Please try again."
  }
  
  // Safe patterns to show
  if (message.includes("not found") || message.includes("invalid") || message.includes("required")) {
    return message
  }
  
  return "An error occurred. Please try again."
}

/**
 * Sanitize URL - accept both full URLs and paths
 * "/analyze/stream" → "http://localhost:8000/analyze/stream"
 * "http://localhost:8000/analyze/stream" → "http://localhost:8000/analyze/stream"
 */
function buildUrl(urlOrPath) {
  if (urlOrPath.startsWith("http")) return urlOrPath
  return `${API_BASE_URL}${urlOrPath}`
}

/**
 * Basic input validation - just length checks, won't reject normal input
 */
function validateInput(input) {
  if (typeof input === "string" && input.length > 5000) {
    throw new Error("Input exceeds maximum length of 5000 characters")
  }
  return input
}

export default function usePipeline() {
  const [status, setStatus]                     = useState("idle")
  const [agentStates, setAgentStates]           = useState({})
  const [agentSummaries, setAgentSummaries]     = useState({})
  const [report, setReport]                     = useState(null)
  const [citations, setCitations]               = useState([])
  const [extraData, setExtraData]               = useState({})
  const [error, setError]                       = useState("")
  const [detectedCondition, setDetectedCondition] = useState("")
  const [fromCache, setFromCache]               = useState(false)
  const [cacheMessage, setCacheMessage]         = useState("")

  function reset() {
    setStatus("idle")
    setAgentStates({})
    setAgentSummaries({})
    setReport(null)
    setCitations([])
    setExtraData({})
    setError("")
    setDetectedCondition("")
    setFromCache(false)
    setCacheMessage("")
  }

  async function run(url, body) {
    reset()
    setStatus("running")

    try {
      // Validate input body
      if (body.condition) validateInput(body.condition)
      if (body.symptoms) validateInput(body.symptoms)
      if (body.beauty_concern) validateInput(body.beauty_concern)
      
      // Build full URL from env variable if needed
      const fullUrl = buildUrl(url)
      
      const response = await fetch(fullUrl, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body)
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.detail || "Request failed")
      }

      const reader  = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer    = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const parts = buffer.split("\n\n")
        buffer = parts.pop()

        for (const part of parts) {
          if (!part.trim()) continue

          const eventLine = part.split("\n").find(l => l.startsWith("event:"))
          const dataLine  = part.split("\n").find(l => l.startsWith("data:"))
          if (!eventLine || !dataLine) continue

          const event = eventLine.replace("event:", "").trim()
          const data  = JSON.parse(dataLine.replace("data:", "").trim())

          // ── Cache hit ────────────────────────────────────────────────────
          if (event === "cache_hit") {
            setFromCache(true)
            setCacheMessage(data.message || "Loaded from cache")
          }

          // ── Pre-processing (symptom analyzer) ────────────────────────────
          if (event === "pre_process_done") {
            setDetectedCondition(data.detected_condition)
          }

          // ── Agent progress ────────────────────────────────────────────────
          if (event === "agent_start") {
            setAgentStates(p => ({ ...p, [data.agent]: "running" }))
          }

          if (event === "agent_done") {
            setAgentStates(p => ({ ...p, [data.agent]: "done" }))
            setAgentSummaries(p => ({ ...p, [data.agent]: data.summary }))
          }

          // ── Post processing ───────────────────────────────────────────────
          if (event === "post_process") {
            // optional: could show a post-processing message in UI
          }

          // ── Final result ──────────────────────────────────────────────────
          if (event === "complete") {
            setReport({ ...(data.report || {}), feature_key: data.feature_key })
            setCitations(data.verified_citations || [])
            setExtraData({
              wellness_plan: data.wellness_plan,
              dosage:        data.dosage,
              preparation:   data.preparation,
            })
            setStatus("done")
          }

          // ── Error ─────────────────────────────────────────────────────────
          if (event === "error") {
            setError(data.message)
            setStatus("error")
          }
        }
      }
    } catch (err) {
      // Sanitize error message - don't expose internal details
      const sanitizedError = sanitizeError(err)
      setError(sanitizedError)
      setStatus("error")
    }
  }

  return {
    status,
    agentStates,
    agentSummaries,
    report,
    citations,
    extraData,
    error,
    detectedCondition,
    fromCache,
    cacheMessage,
    run,
    reset
  }
}