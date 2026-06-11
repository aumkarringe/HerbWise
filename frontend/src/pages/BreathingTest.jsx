import { useEffect, useMemo, useRef, useState } from "react"

const EXERCISES = [
  {
    id: "box",
    name: "Box Breathing",
    description: "Navy technique for stress relief and focus",
    inhale: 4,
    hold: 4,
    exhale: 4,
    holdAfter: 4,
    cycles: 4,
    icon: "🧭",
    benefits: ["Reduces stress", "Improves focus", "Calms anxiety"],
    gradient: "linear-gradient(135deg, #3b82f6, #06b6d4)",
  },
  {
    id: "478",
    name: "4 7 8 Relaxing Breath",
    description: "Deep relaxation pattern for sleep and calm",
    inhale: 4,
    hold: 7,
    exhale: 8,
    holdAfter: 0,
    cycles: 4,
    icon: "🌙",
    benefits: ["Promotes sleep", "Reduces anxiety", "Lowers heart rate"],
    gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
  },
  {
    id: "energizing",
    name: "Energizing Breath",
    description: "Quick rhythm to boost energy and alertness",
    inhale: 2,
    hold: 0,
    exhale: 2,
    holdAfter: 0,
    cycles: 10,
    icon: "⚡",
    benefits: ["Increases energy", "Improves alertness", "Boosts oxygen"],
    gradient: "linear-gradient(135deg, #f97316, #eab308)",
  },
  {
    id: "calm",
    name: "Calming Breath",
    description: "Simple technique for immediate calm",
    inhale: 4,
    hold: 2,
    exhale: 6,
    holdAfter: 0,
    cycles: 6,
    icon: "💗",
    benefits: ["Instant calm", "Heart coherence", "Emotional balance"],
    gradient: "linear-gradient(135deg, #ec4899, #f43f5e)",
  },
]

const PHASE = {
  IDLE: "idle",
  INHALE: "inhale",
  HOLD: "hold",
  EXHALE: "exhale",
  HOLD_AFTER: "holdAfter",
}

export default function BreathingTest() {
  const [selectedExercise, setSelectedExercise] = useState(EXERCISES[0])
  const [isRunning, setIsRunning] = useState(false)
  const [phase, setPhase] = useState(PHASE.IDLE)
  const [timeLeft, setTimeLeft] = useState(0)
  const [currentCycle, setCurrentCycle] = useState(0)
  const [circleScale, setCircleScale] = useState(1)
  const intervalRef = useRef(null)

  const totalSeconds = useMemo(() => {
    return (selectedExercise.inhale + selectedExercise.hold + selectedExercise.exhale + (selectedExercise.holdAfter || 0)) * selectedExercise.cycles
  }, [selectedExercise])

  const getPhaseInstruction = () => {
    if (phase === PHASE.INHALE) return "Breathe In"
    if (phase === PHASE.HOLD) return "Hold"
    if (phase === PHASE.EXHALE) return "Breathe Out"
    if (phase === PHASE.HOLD_AFTER) return "Hold"
    return "Get Ready"
  }

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const stopExercise = () => {
    setIsRunning(false)
    setPhase(PHASE.IDLE)
    setCurrentCycle(0)
    setTimeLeft(0)
    setCircleScale(1)
    clearTimer()
  }

  const startExercise = () => {
    clearTimer()
    setIsRunning(true)
    setCurrentCycle(1)
    setPhase(PHASE.INHALE)
    setTimeLeft(selectedExercise.inhale)
    setCircleScale(1.5)
  }

  useEffect(() => {
    if (!isRunning) return undefined

    clearTimer()
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 1) return prev - 1

        if (phase === PHASE.INHALE) {
          if (selectedExercise.hold > 0) {
            setPhase(PHASE.HOLD)
            setCircleScale(1.5)
            return selectedExercise.hold
          }
          setPhase(PHASE.EXHALE)
          setCircleScale(1)
          return selectedExercise.exhale
        }

        if (phase === PHASE.HOLD) {
          setPhase(PHASE.EXHALE)
          setCircleScale(1)
          return selectedExercise.exhale
        }

        if (phase === PHASE.EXHALE) {
          if (selectedExercise.holdAfter && selectedExercise.holdAfter > 0) {
            setPhase(PHASE.HOLD_AFTER)
            return selectedExercise.holdAfter
          }

          if (currentCycle >= selectedExercise.cycles) {
            stopExercise()
            return 0
          }

          setCurrentCycle((c) => c + 1)
          setPhase(PHASE.INHALE)
          setCircleScale(1.5)
          return selectedExercise.inhale
        }

        if (phase === PHASE.HOLD_AFTER) {
          if (currentCycle >= selectedExercise.cycles) {
            stopExercise()
            return 0
          }

          setCurrentCycle((c) => c + 1)
          setPhase(PHASE.INHALE)
          setCircleScale(1.5)
          return selectedExercise.inhale
        }

        return 0
      })
    }, 1000)

    return () => clearTimer()
  }, [isRunning, phase, currentCycle, selectedExercise])

  useEffect(() => {
    return () => clearTimer()
  }, [])

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.hero}>
          <div style={styles.badge}>🌬️ Breathing Exercises</div>
          <h1 style={styles.title}>Breathing Test and Exercises</h1>
          <p style={styles.subtitle}>
            Practice guided breathing techniques for stress relief, better sleep, and improved focus.
          </p>
        </div>

        <div style={styles.grid}>
          <div style={styles.panel}>
            <h2 style={styles.panelTitle}>Choose Exercise</h2>

            {EXERCISES.map((exercise) => {
              const active = selectedExercise.id === exercise.id
              return (
                <button
                  key={exercise.id}
                  type="button"
                  onClick={() => {
                    if (!isRunning) setSelectedExercise(exercise)
                  }}
                  disabled={isRunning}
                  style={{
                    ...styles.exerciseCard,
                    ...(active ? styles.exerciseCardActive : null),
                    ...(isRunning ? styles.exerciseCardDisabled : null),
                  }}
                >
                  <div style={styles.exerciseHead}>
                    <div style={{ ...styles.exerciseIcon, background: exercise.gradient }}>{exercise.icon}</div>
                    <div style={styles.exerciseMeta}>
                      <h3 style={styles.exerciseTitle}>{exercise.name}</h3>
                      <p style={styles.exerciseDesc}>{exercise.description}</p>
                    </div>
                  </div>

                  <div style={styles.benefitWrap}>
                    {exercise.benefits.map((benefit) => (
                      <span key={`${exercise.id}-${benefit}`} style={styles.benefitPill}>{benefit}</span>
                    ))}
                  </div>

                  <div style={styles.timings}>
                    <span>Inhale: {exercise.inhale}s</span>
                    {exercise.hold > 0 && <span>Hold: {exercise.hold}s</span>}
                    <span>Exhale: {exercise.exhale}s</span>
                    {exercise.holdAfter > 0 && <span>Hold: {exercise.holdAfter}s</span>}
                  </div>
                </button>
              )
            })}
          </div>

          <div style={styles.panel}>
            <div style={styles.circleShell}>
              <div
                style={{
                  ...styles.ring,
                  ...styles.ringOuter,
                  background: selectedExercise.gradient,
                  transform: `scale(${circleScale})`,
                }}
              />
              <div
                style={{
                  ...styles.ring,
                  ...styles.ringMid,
                  background: selectedExercise.gradient,
                  transform: `scale(${circleScale})`,
                }}
              />
              <div
                style={{
                  ...styles.ring,
                  ...styles.ringCore,
                  background: selectedExercise.gradient,
                  transform: `scale(${circleScale})`,
                }}
              >
                <span style={styles.counter}>{isRunning ? timeLeft : ""}</span>
              </div>
            </div>

            <div style={styles.statusWrap}>
              <h3 style={styles.statusTitle}>{getPhaseInstruction()}</h3>
              {isRunning && (
                <p style={styles.statusSub}>
                  Cycle {currentCycle} of {selectedExercise.cycles}
                </p>
              )}
            </div>

            <div style={styles.controls}>
              {!isRunning ? (
                <button type="button" onClick={startExercise} style={styles.primaryBtn}>
                  ▶ Start Exercise
                </button>
              ) : (
                <>
                  <button type="button" onClick={stopExercise} style={styles.secondaryBtn}>
                    ⏸ Pause
                  </button>
                  <button type="button" onClick={stopExercise} style={styles.ghostBtn}>
                    ↺ Reset
                  </button>
                </>
              )}
            </div>

            <p style={styles.totalTime}>⏱ Total time: ~{totalSeconds}s</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: "100%",
    width: "100%",
    maxWidth: "100%",
    padding: "28px 16px",
    boxSizing: "border-box",
    overflowX: "hidden",
  },
  container: {
    maxWidth: 1120,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  hero: {
    textAlign: "center",
    padding: "12px 4px",
  },
  badge: {
    display: "inline-block",
    padding: "8px 14px",
    background: "rgba(74,222,128,0.12)",
    border: "1px solid rgba(74,222,128,0.3)",
    borderRadius: 999,
    color: "#4ade80",
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 12,
  },
  title: {
    margin: "0 0 10px",
    fontSize: "clamp(28px, 4vw, 46px)",
    lineHeight: 1.1,
    color: "#f0faf0",
    fontWeight: 800,
  },
  subtitle: {
    margin: 0,
    color: "rgba(232,245,232,0.55)",
    fontSize: 16,
    maxWidth: 700,
    marginInline: "auto",
    lineHeight: 1.6,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 20,
    width: "100%",
  },
  panel: {
    background: "rgba(10,26,14,0.8)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(74,222,128,0.2)",
    borderRadius: 16,
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 14,
    boxSizing: "border-box",
    overflow: "hidden",
  },
  panelTitle: {
    margin: "0 0 6px",
    color: "#f0faf0",
    fontSize: 20,
    fontWeight: 700,
  },
  exerciseCard: {
    width: "100%",
    textAlign: "left",
    background: "rgba(5,14,8,0.7)",
    border: "1px solid rgba(74,222,128,0.12)",
    borderRadius: 14,
    padding: 14,
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    transition: "all 0.2s ease",
  },
  exerciseCardActive: {
    border: "1px solid rgba(74,222,128,0.5)",
    background: "rgba(74,222,128,0.07)",
  },
  exerciseCardDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  exerciseHead: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
  },
  exerciseIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    color: "#fff",
    fontSize: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  exerciseMeta: {
    flex: 1,
    minWidth: 0,
  },
  exerciseTitle: {
    margin: 0,
    color: "#f0faf0",
    fontSize: 16,
    fontWeight: 600,
  },
  exerciseDesc: {
    margin: "4px 0 0",
    color: "rgba(232,245,232,0.5)",
    fontSize: 13,
    lineHeight: 1.5,
  },
  benefitWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  benefitPill: {
    fontSize: 12,
    padding: "5px 8px",
    borderRadius: 999,
    background: "rgba(74,222,128,0.08)",
    color: "rgba(232,245,232,0.6)",
    border: "1px solid rgba(74,222,128,0.15)",
  },
  timings: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    fontSize: 12,
    color: "rgba(232,245,232,0.4)",
  },
  circleShell: {
    position: "relative",
    width: 260,
    height: 260,
    margin: "0 auto 6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    borderRadius: "50%",
    transition: "transform 0.8s ease-in-out",
    willChange: "transform",
  },
  ringOuter: {
    width: 190,
    height: 190,
    opacity: 0.18,
  },
  ringMid: {
    width: 140,
    height: 140,
    opacity: 0.38,
  },
  ringCore: {
    width: 96,
    height: 96,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  counter: {
    fontSize: 30,
    fontWeight: 800,
  },
  statusWrap: {
    textAlign: "center",
    minHeight: 62,
  },
  statusTitle: {
    margin: "0 0 6px",
    fontSize: 28,
    color: "#f0faf0",
    fontWeight: 700,
  },
  statusSub: {
    margin: 0,
    color: "rgba(232,245,232,0.45)",
    fontSize: 13,
  },
  controls: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 10,
  },
  primaryBtn: {
    border: "none",
    borderRadius: 10,
    padding: "12px 18px",
    background: "#4ade80",
    color: "#050e08",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
  },
  secondaryBtn: {
    border: "1px solid rgba(74,222,128,0.3)",
    borderRadius: 10,
    padding: "12px 18px",
    background: "rgba(74,222,128,0.08)",
    color: "#f0faf0",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
  },
  ghostBtn: {
    border: "1px solid rgba(232,245,232,0.15)",
    borderRadius: 10,
    padding: "12px 18px",
    background: "rgba(232,245,232,0.05)",
    color: "rgba(232,245,232,0.7)",
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
  },
  totalTime: {
    margin: "2px 0 0",
    textAlign: "center",
    color: "rgba(232,245,232,0.4)",
    fontSize: 13,
  },
}