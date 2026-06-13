import { useEffect, useRef } from "react"

const VERTICAL_SPACING = 58
const CENTER_Y         = 78
const VIEWPORT_H       = 230

function AgentRow({ agent, state, index }) {
  const isDone    = state === "done"
  const isRunning = state === "running"
  const y         = 30 + VERTICAL_SPACING * index

  const circleFill   = isDone    ? "#4ade80"                : "rgba(255,255,255,0)"
  const outlineColor = isDone    ? "#4ade80"
                     : isRunning ? "#fb923c"                : "rgba(255,255,255,0.28)"
  const checkFill    = isDone    ? "rgba(5,14,8,1)"
                     : isRunning ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.15)"
  const nameColor    = isDone    ? "#4ade80"
                     : isRunning ? "#f0faf0"                : "rgba(232,245,232,0.28)"
  const descColor    = isRunning ? "#fb923c"
                     : isDone    ? "rgba(74,222,128,0.55)"  : "rgba(232,245,232,0.2)"
  const descLabel    = isRunning ? `${agent.desc}…`
                     : isDone    ? "Complete"               : agent.desc

  return (
    <g transform={`translate(0 ${y})`}>
      <g transform="translate(8 -18) scale(0.75)">
        <circle
          fill={circleFill}
          cx={16} cy={16} r={15}
          style={{ transition: "fill 0.6s ease" }}
        />
        {isRunning && (
          <circle
            fill="none"
            stroke="#fb923c"
            strokeWidth={2.5}
            strokeDasharray="22 72"
            strokeLinecap="round"
            cx={16} cy={16} r={15}
            style={{
              animation:       "hw-spin 1.2s linear infinite",
              transformBox:    "fill-box",
              transformOrigin: "center",
            }}
          />
        )}
        <polygon
          points="21.661,7.643 13.396,19.328 9.429,15.361 7.075,17.714 13.745,24.384 24.345,9.708"
          fill={checkFill}
          style={{ transition: "fill 0.6s ease" }}
        />
        <path
          d="M16,0C7.163,0,0,7.163,0,16s7.163,16,16,16s16-7.163,16-16S24.837,0,16,0z
             M16,30C8.28,30,2,23.72,2,16C2,8.28,8.28,2,16,2
             c7.72,0,14,6.28,14,14C30,23.72,23.72,30,16,30z"
          fill={outlineColor}
          style={{ transition: "fill 0.6s ease" }}
        />
      </g>

      <text
        x={52} y={2}
        fill={nameColor}
        fontSize={15}
        fontFamily="DM Sans, system-ui, sans-serif"
        fontWeight={isRunning ? 700 : 500}
        style={{ transition: "fill 0.4s ease" }}
      >
        {agent.name}
      </text>
      <text
        x={52} y={21}
        fill={descColor}
        fontSize={12}
        fontFamily="DM Sans, system-ui, sans-serif"
        style={{ transition: "fill 0.4s ease" }}
      >
        {descLabel}
      </text>
    </g>
  )
}

export default function PipelineLoader({ agents, agentStates, fromCache, cacheMessage }) {
  const groupRef   = useRef(null)
  const currentRef = useRef(null)
  const targetRef  = useRef(0)
  const rafRef     = useRef(null)

  const doneCount = agents.filter(a => agentStates[a.id] === "done").length

  useEffect(() => {
    targetRef.current = CENTER_Y - (30 + VERTICAL_SPACING * doneCount)
  }, [doneCount])

  useEffect(() => {
    function tick() {
      if (groupRef.current) {
        if (currentRef.current === null) currentRef.current = targetRef.current
        const diff = targetRef.current - currentRef.current
        currentRef.current += diff * 0.07
        groupRef.current.setAttribute(
          "transform",
          `translate(0 ${currentRef.current.toFixed(2)})`
        )
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <div style={{
      background:     "rgba(10,26,14,0.82)",
      backdropFilter: "blur(14px)",
      border:         "1px solid rgba(74,222,128,0.2)",
      borderRadius:   16,
      padding:        "22px 26px",
    }}>
      {fromCache && (
        <div style={{
          marginBottom: 16,
          background:   "rgba(251,191,36,0.07)",
          border:       "1px solid rgba(251,191,36,0.25)",
          borderRadius: 10,
          padding:      "8px 16px",
          textAlign:    "center",
          fontSize:     13,
          fontWeight:   600,
          color:        "#fbbf24",
        }}>
          ⚡ {cacheMessage || "Loaded from cache — instant result"}
        </div>
      )}

      <div style={{ position: "relative", overflow: "hidden", height: VIEWPORT_H }}>
        <div style={{
          position:   "absolute", top: 0, left: 0, right: 0, height: 54,
          background: "linear-gradient(to bottom, rgba(10,26,14,0.96), transparent)",
          zIndex: 2, pointerEvents: "none",
        }} />

        <svg
          width="100%"
          height={30 + VERTICAL_SPACING * agents.length + 60}
          style={{ overflow: "visible", display: "block" }}
        >
          <g ref={groupRef}>
            {agents.map((agent, i) => (
              <AgentRow
                key={agent.id}
                agent={agent}
                state={agentStates[agent.id] || "idle"}
                index={i}
              />
            ))}
          </g>
        </svg>

        <div style={{
          position:   "absolute", bottom: 0, left: 0, right: 0, height: 54,
          background: "linear-gradient(to top, rgba(10,26,14,0.96), transparent)",
          zIndex: 2, pointerEvents: "none",
        }} />
      </div>
    </div>
  )
}
