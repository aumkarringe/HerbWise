// src/hooks/usePipeline.js
import { useState } from "react"

export default function usePipeline() {
  const [status, setStatus]           = useState("idle")
  const [agentStates, setAgentStates] = useState({})
  const [agentSummaries, setAgentSummaries] = useState({})
  const [report, setReport]           = useState(null)
  const [citations, setCitations]     = useState([])
  const [extraData, setExtraData]     = useState({})
  const [error, setError]             = useState("")
  const [detectedCondition, setDetectedCondition] = useState("")

  function reset() {
    setStatus("idle")
    setAgentStates({})
    setAgentSummaries({})
    setReport(null)
    setCitations([])
    setExtraData({})
    setError("")
    setDetectedCondition("")
  }

  async function run(url, body) {
    reset()
    setStatus("running")

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
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

          if (event === "pre_process_done") {
            setDetectedCondition(data.detected_condition)
          }

          if (event === "agent_start") {
            setAgentStates(p => ({ ...p, [data.agent]: "running" }))
          }

          if (event === "agent_done") {
            setAgentStates(p => ({ ...p, [data.agent]: "done" }))
            setAgentSummaries(p => ({ ...p, [data.agent]: data.summary }))
          }

          if (event === "complete") {
            setReport(data.report)
            setCitations(data.verified_citations || [])
            setExtraData({
              wellness_plan: data.wellness_plan,
              dosage:        data.dosage,
              preparation:   data.preparation,
            })
            setStatus("done")
          }

          if (event === "error") {
            setError(data.message)
            setStatus("error")
          }
        }
      }
    } catch (err) {
      setError(err.message)
      setStatus("error")
    }
  }

  return {
    status, agentStates, agentSummaries,
    report, citations, extraData,
    error, detectedCondition, run, reset
  }
}