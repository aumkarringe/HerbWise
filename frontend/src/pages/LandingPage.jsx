import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

const FEATURES = [
  { icon: "🌿", title: "Herbal Remedies", desc: "5 evidence backed herbs per condition with preparation methods and dosage" },
  { icon: "🧘", title: "Yoga Therapy", desc: "Safe poses verified by certified therapists with contraindication checks" },
  { icon: "👆", title: "Acupressure", desc: "TCM-validated pressure points with anatomically accurate locations" },
  { icon: "🔬", title: "Science Validated", desc: "Every remedy checked against PubMed, Semantic Scholar & OpenAlex" },
  { icon: "🤖", title: "5 Agent Pipeline", desc: "Hunter → Validator → Verifier → Citation Checker → Report Builder" },
  { icon: "⚡", title: "Zero Hallucinations", desc: "Real citations only — dead links and fake papers are automatically removed" },
]

const AGENTS = [
  { id: "A1", name: "Remedy Hunter", color: "#4ade80", desc: "Finds herbs, poses & points" },
  { id: "A2", name: "Science Validator", color: "#60a5fa", desc: "Checks peer-reviewed evidence" },
  { id: "A3", name: "Pose Verifier", color: "#f472b6", desc: "Validates safety & anatomy" },
  { id: "A4", name: "Citation Checker", color: "#fb923c", desc: "Verifies real sources live" },
  { id: "A5", name: "Report Builder", color: "#a78bfa", desc: "Assembles final report" },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const heroRef = useRef(null)
  const canvasRef = useRef(null)
  const [scrollY, setScrollY] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [activeAgent, setActiveAgent] = useState(0)
  const [screenW, setScreenW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200)
  const [typed, setTyped] = useState("")
  const [visibleSections, setVisibleSections] = useState(new Set())
  const animFrameRef = useRef(null)
  const particlesRef = useRef([])
  const styleTagRef = useRef(null)

  const conditions = ["headache", "insomnia", "anxiety", "joint pain", "stress", "acidity"]
  const conditionRef = useRef(0)
  const charRef = useRef(0)
  const deletingRef = useRef(false)

  // Typewriter effect
  useEffect(() => {
    const tick = () => {
      const word = conditions[conditionRef.current]
      if (!deletingRef.current) {
        setTyped(word.slice(0, charRef.current + 1))
        charRef.current++
        if (charRef.current === word.length) {
          deletingRef.current = true
          setTimeout(tick, 1800)
          return
        }
      } else {
        setTyped(word.slice(0, charRef.current - 1))
        charRef.current--
        if (charRef.current === 0) {
          deletingRef.current = false
          conditionRef.current = (conditionRef.current + 1) % conditions.length
        }
      }
      setTimeout(tick, deletingRef.current ? 60 : 100)
    }
    const t = setTimeout(tick, 800)
    return () => clearTimeout(t)
  }, [])

  // Agent cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAgent(p => (p + 1) % AGENTS.length)
    }, 1400)
    return () => clearInterval(interval)
  }, [])

  // Parallax scroll
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Mouse tracking
  useEffect(() => {
    const onMove = e => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener("mousemove", onMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  // Responsive breakpoints
  useEffect(() => {
    const onResize = () => setScreenW(window.innerWidth)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  // Intersection observer for section animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, entry.target.dataset.section]))
          }
        })
      },
      { threshold: 0.15 }
    )
    document.querySelectorAll("[data-section]").forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    particlesRef.current = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
      hue: 120 + Math.random() * 60,
    }))

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particlesRef.current.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 70%, 60%, ${p.opacity})`
        ctx.fill()
      })
      // Draw connections
      particlesRef.current.forEach((p, i) => {
        particlesRef.current.slice(i + 1).forEach(q => {
          const dx = p.x - q.x
          const dy = p.y - q.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `rgba(74, 222, 128, ${0.08 * (1 - dist / 100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })
      animFrameRef.current = requestAnimationFrame(animate)
    }
    animate()

    const onResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener("resize", onResize)
    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener("resize", onResize)
    }
  }, [])

  // Inject page-scoped keyframes once and clean up on unmount.
  useEffect(() => {
    if (styleTagRef.current) return
    const style = document.createElement("style")
    style.textContent = `
      @keyframes pulse { 0%,100%{opacity:1;box-shadow:0 0 8px #4ade80} 50%{opacity:0.5;box-shadow:0 0 16px #4ade80} }
      @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      @keyframes scrollAnim { 0%{transform:scaleY(0);transform-origin:top} 50%{transform:scaleY(1);transform-origin:top} 51%{transform:scaleY(1);transform-origin:bottom} 100%{transform:scaleY(0);transform-origin:bottom} }
    `
    document.head.appendChild(style)
    styleTagRef.current = style

    return () => {
      if (styleTagRef.current) {
        document.head.removeChild(styleTagRef.current)
        styleTagRef.current = null
      }
    }
  }, [])

  const viewportH = typeof window !== "undefined" ? window.innerHeight || 1 : 1
  const viewportW = typeof window !== "undefined" ? window.innerWidth || 1 : 1
  const isMobile = screenW < 768
  const isTablet = screenW < 1024
  const tiltStyle = {
    transform: `perspective(1000px) rotateX(${(mousePos.y / viewportH - 0.5) * -8}deg) rotateY(${(mousePos.x / viewportW - 0.5) * 8}deg)`,
    transition: "transform 0.15s ease",
  }

  return (
    <div style={s.page}>
      {/* Particle canvas */}
      <canvas ref={canvasRef} style={s.canvas} />

      {/* Texture overlay */}
      <div style={s.texture} />

      {/* Gradient orbs */}
      <div style={{ ...s.orb1, ...(isMobile ? s.orbCompact : null), transform: `translate(${scrollY * 0.15}px, ${scrollY * 0.1}px)` }} />
      <div style={{ ...s.orb2, ...(isMobile ? s.orbCompact : null), transform: `translate(${-scrollY * 0.1}px, ${scrollY * 0.08}px)` }} />

      {/* Nav */}
      <nav style={{ ...s.nav, ...(isMobile ? s.navMobile : null) }}>
        <div style={s.navLogo}>🌿 HerbWise</div>
        <div style={{ ...s.navLinks, ...(isMobile ? s.navLinksMobile : null) }}>
          {!isMobile && <a href="#features" style={s.navLink}>Features</a>}
          {!isMobile && <a href="#pipeline" style={s.navLink}>How It Works</a>}
          <button style={s.navCta} onClick={() => navigate("/wellness-search")}>
            Try It Free →
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section ref={heroRef} style={{ ...s.hero, ...(isMobile ? s.heroMobile : null) }}>
        <div style={{ ...s.heroRings, ...(isMobile ? s.heroRingsMobile : null) }} />
        <div style={{ ...s.heroInner, ...(isMobile ? s.heroInnerMobile : null) }}>
          <div style={{ ...s.badge, ...(isMobile ? s.badgeMobile : null) }}>
            <span style={s.badgeDot} />
            AI Powered · Evidence Validated · Zero Hallucinations
          </div>

          <h1 style={s.heroTitle}>
            Natural Remedies,
            <br />
            <span style={s.heroGradient}>Scientifically Verified</span>
          </h1>

          <p style={{ ...s.heroSub, ...(isMobile ? s.heroSubMobile : null) }}>
            Type{" "}
            <span style={s.typewriter}>
              <span style={s.typed}>{typed}</span>
              <span style={s.cursor}>|</span>
            </span>
            {" "}and get herbs, yoga poses & acupressure points — all backed by real peer reviewed research.
          </p>

          <div style={{ ...s.heroCtas, ...(isMobile ? s.heroCtasMobile : null) }}>
            <button style={{ ...s.ctaPrimary, ...(isMobile ? s.ctaPrimaryMobile : null) }} onClick={() => navigate("/wellness-search")}>
              Start Your Search
            </button>
            <button style={{ ...s.ctaSecondary, ...(isMobile ? s.ctaSecondaryMobile : null) }} onClick={() => document.getElementById("pipeline").scrollIntoView({ behavior: "smooth" })}>
              See How It Works
            </button>
          </div>

          {/* 3D floating card */}
          <div style={{ ...s.floatCard, ...(isMobile ? s.floatCardMobile : null), ...(!isMobile ? tiltStyle : null) }}>
            <div style={s.floatCardInner}>
              <div style={{ ...s.floatRow, ...(isMobile ? s.floatRowMobile : null) }}>
                <span style={s.floatLabel}>Searching for</span>
                <span style={s.floatCondition}>Insomnia</span>
              </div>
              <div style={s.agentFlow}>
                {AGENTS.map((agent, i) => (
                  <div key={agent.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{
                      ...s.agentPill,
                      background: i <= activeAgent ? agent.color + "22" : "rgba(255,255,255,0.05)",
                      borderColor: i <= activeAgent ? agent.color : "rgba(255,255,255,0.1)",
                      color: i <= activeAgent ? agent.color : "rgba(255,255,255,0.3)",
                      transform: i === activeAgent ? "scale(1.05)" : "scale(1)",
                    }}>
                      {i <= activeAgent ? "✓" : "○"} {agent.id}
                    </div>
                    {i < AGENTS.length - 1 && (
                      <div style={{
                        ...s.agentArrow,
                        opacity: i < activeAgent ? 1 : 0.2,
                        color: i < activeAgent ? "#4ade80" : "rgba(255,255,255,0.2)"
                      }}>→</div>
                    )}
                  </div>
                ))}
              </div>
              <div style={s.floatResult}>
                <div style={s.resultItem}>🌿 Valerian Root — <span style={{ color: "#4ade80" }}>PubMed verified</span></div>
                <div style={s.resultItem}>🧘 Child's Pose — <span style={{ color: "#60a5fa" }}>Safe & anatomically accurate</span></div>
                <div style={s.resultItem}>👆 HT7 Shenmen — <span style={{ color: "#f472b6" }}>TCM validated</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={s.scrollHint}>
          <div style={s.scrollLine} />
          <span style={s.scrollText}>scroll</span>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ ...s.stats, ...(isMobile ? s.statsMobile : null) }} data-section="stats">
        {[
          { num: "14", label: "Health Features" },
          { num: "0%", label: "Hallucination Rate" },
          { num: "5", label: "Validation Agents" },
          { num: "3", label: "Citation Databases" },
        ].map((stat, i) => (
          <div key={i} style={{
            ...s.statItem,
            ...(isMobile ? s.statItemMobile : null),
            opacity: visibleSections.has("stats") ? 1 : 0,
            transform: visibleSections.has("stats") ? "translateY(0)" : "translateY(30px)",
            transition: `all 0.6s ease ${i * 0.12}s`,
          }}>
            <div style={s.statNum}>{stat.num}</div>
            <div style={s.statLabel}>{stat.label}</div>
          </div>
        ))}
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ ...s.section, ...(isMobile ? s.sectionMobile : null) }} data-section="features">
        <div style={{ ...s.sectionHead, ...(isMobile ? s.sectionHeadMobile : null) }}>
          <h2 style={{ ...s.sectionTitle, ...(isMobile ? s.sectionTitleMobile : null) }}>Everything you need, nothing you dont</h2>
          <p style={{ ...s.sectionSub, ...(isMobile ? s.sectionSubMobile : null) }}>Every modality validated. Every source verified. Every recommendation safe.</p>
        </div>
        <div style={{ ...s.featureGrid, ...(isMobile ? s.featureGridMobile : null) }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{
              ...s.featureCard,
              opacity: visibleSections.has("features") ? 1 : 0,
              transform: visibleSections.has("features") ? "translateY(0) scale(1)" : "translateY(40px) scale(0.97)",
              transition: `all 0.65s cubic-bezier(0.23, 1, 0.32, 1) ${i * 0.08}s`,
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px) scale(1.02)"; e.currentTarget.style.borderColor = "rgba(74,222,128,0.4)" }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0) scale(1)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)" }}
            >
              <div style={s.featureIcon}>{f.icon}</div>
              <h3 style={s.featureTitle}>{f.title}</h3>
              <p style={s.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PIPELINE ── */}
      <section id="pipeline" style={{ ...s.pipelineSection, ...(isMobile ? s.pipelineSectionMobile : null) }} data-section="pipeline">
        <div style={{ ...s.sectionHead, ...(isMobile ? s.sectionHeadMobile : null) }}>
          <h2 style={{ ...s.sectionTitle, ...(isMobile ? s.sectionTitleMobile : null) }}>The 5 Agent Validation Pipeline</h2>
          <p style={{ ...s.sectionSub, ...(isMobile ? s.sectionSubMobile : null) }}>Every search triggers a full validation chain before anything reaches you</p>
        </div>

        <div style={{ ...s.pipeline, ...(isMobile ? s.pipelineMobile : null) }}>
          {AGENTS.map((agent, i) => (
            <div key={agent.id} style={{ display: "flex", alignItems: "center" }}>
              <div style={{
                ...s.pipelineCard,
                ...(isMobile ? s.pipelineCardMobile : null),
                opacity: visibleSections.has("pipeline") ? 1 : 0,
                transform: visibleSections.has("pipeline") ? "translateY(0)" : "translateY(50px)",
                transition: `all 0.7s ease ${i * 0.15}s`,
                borderColor: agent.color + "44",
                boxShadow: `0 0 30px ${agent.color}11`,
              }}>
                <div style={{ ...s.pipelineId, color: agent.color, borderColor: agent.color + "44" }}>{agent.id}</div>
                <div style={s.pipelineName}>{agent.name}</div>
                <div style={s.pipelineDesc}>{agent.desc}</div>
                <div style={{ ...s.pipelineBar, background: agent.color + "33" }}>
                  <div style={{ ...s.pipelineBarFill, background: agent.color, width: visibleSections.has("pipeline") ? "100%" : "0%", transition: `width 1.2s ease ${i * 0.2 + 0.5}s` }} />
                </div>
              </div>
              {i < AGENTS.length - 1 && (
                <div style={{
                  ...s.pipelineConnector,
                  ...(isMobile ? s.pipelineConnectorMobile : null),
                  opacity: visibleSections.has("pipeline") ? 1 : 0,
                  transition: `opacity 0.5s ease ${i * 0.15 + 0.3}s`,
                  color: agent.color
                }}>→</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ ...s.ctaSection, ...(isMobile ? s.ctaSectionMobile : null) }} data-section="cta">
        <div style={{
          ...s.ctaInner,
          ...(isMobile ? s.ctaInnerMobile : null),
          opacity: visibleSections.has("cta") ? 1 : 0,
          transform: visibleSections.has("cta") ? "scale(1)" : "scale(0.95)",
          transition: "all 0.8s cubic-bezier(0.23, 1, 0.32, 1)",
        }}>
          <div style={s.ctaGlow} />
          <h2 style={{ ...s.ctaTitle, ...(isMobile ? s.ctaTitleMobile : null) }}>Ready to find your remedy?</h2>
          <p style={{ ...s.ctaSub, ...(isMobile ? s.ctaSubMobile : null) }}>No accounts needed. Start with one free search.</p>
          <button style={{ ...s.ctaBig, ...(isMobile ? s.ctaBigMobile : null) }} onClick={() => navigate("/wellness-search")}>
            Try HerbWise Now →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={s.footer}>
        <div style={s.footerLogo}>🌿 HerbWise</div>
        <div style={s.footerSub}>Natural Remedy Intelligence Platform</div>
        <div style={s.footerNote}>Built with FastAPI · React · Redis · Groq · Gemini</div>
      </footer>
    </div>
  )
}

const s = {
  page: {
    minHeight: "100vh",
    background: "#050e08",
    color: "#e8f5e8",
    fontFamily: "'DM Sans', 'Outfit', system-ui, sans-serif",
    overflowX: "hidden",
    position: "relative",
  },
  canvas: {
    position: "fixed",
    top: 0, left: 0,
    width: "100%", height: "100%",
    pointerEvents: "none",
    zIndex: 0,
    opacity: 0.6,
  },
  texture: {
    position: "fixed",
    inset: 0,
    pointerEvents: "none",
    zIndex: 0,
    opacity: 0.12,
    backgroundImage: "radial-gradient(rgba(255,255,255,0.35) 0.45px, transparent 0.45px)",
    backgroundSize: "8px 8px",
  },
  orb1: {
    position: "fixed",
    top: "-20%", left: "-10%",
    width: 600, height: 600,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  orb2: {
    position: "fixed",
    bottom: "-20%", right: "-10%",
    width: 500, height: 500,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(96,165,250,0.10) 0%, transparent 70%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  orbCompact: {
    width: 340,
    height: 340,
  },
  nav: {
    position: "fixed",
    top: 0, left: 0, right: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 48px",
    background: "rgba(5,14,8,0.7)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(74,222,128,0.08)",
    zIndex: 100,
  },
  navMobile: {
    padding: "12px 16px",
  },
  navLogo: {
    fontSize: 22,
    fontWeight: 700,
    color: "#4ade80",
    letterSpacing: "-0.5px",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: 32,
  },
  navLinksMobile: {
    gap: 10,
  },
  navLink: {
    color: "rgba(232,245,232,0.6)",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 500,
    transition: "color 0.2s",
  },
  navCta: {
    background: "#4ade80",
    color: "#050e08",
    border: "none",
    borderRadius: 8,
    padding: "10px 20px",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  hero: {
    position: "relative",
    zIndex: 1,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "120px 24px 80px",
    textAlign: "center",
  },
  heroMobile: {
    padding: "104px 16px 56px",
    minHeight: "calc(100vh - 20px)",
  },
  heroRings: {
    position: "absolute",
    width: 560,
    height: 560,
    borderRadius: "50%",
    border: "1px solid rgba(74,222,128,0.12)",
    boxShadow: "0 0 0 55px rgba(74,222,128,0.05), 0 0 0 110px rgba(34,211,238,0.04)",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -52%)",
    pointerEvents: "none",
    zIndex: 0,
  },
  heroRingsMobile: {
    width: 300,
    height: 300,
    boxShadow: "0 0 0 28px rgba(74,222,128,0.05), 0 0 0 56px rgba(34,211,238,0.04)",
  },
  heroInner: {
    maxWidth: 900,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 28,
  },
  heroInnerMobile: {
    gap: 20,
    maxWidth: 620,
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(74,222,128,0.08)",
    border: "1px solid rgba(74,222,128,0.2)",
    borderRadius: 100,
    padding: "8px 20px",
    fontSize: 12,
    fontWeight: 600,
    color: "#4ade80",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  badgeMobile: {
    fontSize: 10,
    padding: "8px 12px",
    textAlign: "center",
  },
  badgeDot: {
    width: 6, height: 6,
    borderRadius: "50%",
    background: "#4ade80",
    boxShadow: "0 0 8px #4ade80",
    animation: "pulse 2s infinite",
    display: "inline-block",
  },
  heroTitle: {
    fontSize: "clamp(48px, 7vw, 88px)",
    fontWeight: 800,
    lineHeight: 1.05,
    letterSpacing: "-2px",
    color: "#f0faf0",
    margin: 0,
  },
  heroGradient: {
    background: "linear-gradient(135deg, #4ade80 0%, #22d3ee 50%, #a78bfa 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  heroSub: {
    fontSize: 20,
    color: "rgba(232,245,232,0.6)",
    lineHeight: 1.7,
    maxWidth: 580,
    margin: 0,
  },
  heroSubMobile: {
    fontSize: 16,
    lineHeight: 1.5,
  },
  typewriter: {
    fontStyle: "italic",
    color: "#4ade80",
  },
  typed: { fontWeight: 700 },
  cursor: {
    animation: "blink 1s infinite",
    marginLeft: 1,
    fontWeight: 300,
  },
  heroCtas: {
    display: "flex",
    gap: 16,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  heroCtasMobile: {
    width: "100%",
    flexDirection: "column",
    gap: 10,
  },
  ctaPrimary: {
    background: "#4ade80",
    color: "#050e08",
    border: "none",
    borderRadius: 12,
    padding: "16px 36px",
    fontSize: 17,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s",
    letterSpacing: "-0.3px",
  },
  ctaPrimaryMobile: {
    width: "100%",
    padding: "14px 16px",
    fontSize: 16,
  },
  ctaSecondary: {
    background: "transparent",
    color: "#4ade80",
    border: "1.5px solid rgba(74,222,128,0.3)",
    borderRadius: 12,
    padding: "16px 36px",
    fontSize: 17,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  ctaSecondaryMobile: {
    width: "100%",
    padding: "14px 16px",
    fontSize: 16,
  },
  floatCard: {
    marginTop: 20,
    background: "rgba(10,26,14,0.85)",
    border: "1px solid rgba(74,222,128,0.2)",
    borderRadius: 20,
    padding: "28px 32px",
    backdropFilter: "blur(24px)",
    boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 60px rgba(74,222,128,0.05)",
    width: "100%",
    maxWidth: 680,
    transformStyle: "preserve-3d",
  },
  floatCardMobile: {
    padding: "18px 14px",
    borderRadius: 14,
    marginTop: 10,
  },
  floatCardInner: { display: "flex", flexDirection: "column", gap: 20 },
  floatRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  floatRowMobile: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 6,
  },
  floatLabel: { fontSize: 12, color: "rgba(232,245,232,0.4)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.1em" },
  floatCondition: { fontSize: 16, fontWeight: 700, color: "#4ade80" },
  agentFlow: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    flexWrap: "wrap",
  },
  agentPill: {
    border: "1px solid",
    borderRadius: 8,
    padding: "5px 12px",
    fontSize: 12,
    fontWeight: 600,
    transition: "all 0.3s ease",
    letterSpacing: "0.02em",
  },
  agentArrow: {
    fontSize: 14,
    transition: "all 0.3s ease",
  },
  floatResult: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    borderTop: "1px solid rgba(255,255,255,0.06)",
    paddingTop: 16,
  },
  resultItem: {
    fontSize: 14,
    color: "rgba(232,245,232,0.8)",
    display: "flex",
    gap: 8,
    alignItems: "center",
  },
  scrollHint: {
    position: "absolute",
    bottom: 40,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    opacity: 0.4,
  },
  scrollLine: {
    width: 1,
    height: 40,
    background: "linear-gradient(to bottom, transparent, #4ade80)",
    animation: "scrollAnim 2s infinite",
  },
  scrollText: {
    fontSize: 11,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "#4ade80",
  },
  stats: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    justifyContent: "center",
    gap: 0,
    background: "rgba(74,222,128,0.04)",
    borderTop: "1px solid rgba(74,222,128,0.08)",
    borderBottom: "1px solid rgba(74,222,128,0.08)",
    flexWrap: "wrap",
  },
  statsMobile: {
    flexDirection: "column",
  },
  statItem: {
    flex: "1 1 200px",
    textAlign: "center",
    padding: "48px 32px",
    borderRight: "1px solid rgba(74,222,128,0.08)",
  },
  statItemMobile: {
    borderRight: "none",
    borderBottom: "1px solid rgba(74,222,128,0.08)",
    padding: "28px 18px",
  },
  statNum: {
    fontSize: 52,
    fontWeight: 800,
    color: "#4ade80",
    letterSpacing: "-2px",
    lineHeight: 1,
  },
  statLabel: {
    fontSize: 14,
    color: "rgba(232,245,232,0.5)",
    marginTop: 8,
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  section: {
    position: "relative",
    zIndex: 1,
    padding: "120px 48px",
    maxWidth: 1200,
    margin: "0 auto",
  },
  sectionMobile: {
    padding: "72px 16px",
  },
  sectionHead: {
    textAlign: "center",
    marginBottom: 64,
  },
  sectionHeadMobile: {
    marginBottom: 34,
  },
  sectionTitle: {
    fontSize: "clamp(32px, 4vw, 52px)",
    fontWeight: 800,
    color: "#f0faf0",
    margin: "0 0 16px",
    letterSpacing: "-1px",
  },
  sectionSub: {
    fontSize: 18,
    color: "rgba(232,245,232,0.5)",
    maxWidth: 500,
    margin: "0 auto",
    lineHeight: 1.6,
  },
  sectionTitleMobile: {
    lineHeight: 1.15,
  },
  sectionSubMobile: {
    fontSize: 15,
    maxWidth: 340,
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 20,
  },
  featureGridMobile: {
    gridTemplateColumns: "1fr",
    gap: 14,
  },
  featureCard: {
    background: "rgba(10,26,14,0.6)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 16,
    padding: "32px 28px",
    backdropFilter: "blur(12px)",
    cursor: "default",
    transition: "all 0.35s cubic-bezier(0.23,1,0.32,1)",
  },
  featureIcon: {
    fontSize: 36,
    marginBottom: 16,
    display: "block",
  },
  featureTitle: {
    fontSize: 19,
    fontWeight: 700,
    color: "#f0faf0",
    margin: "0 0 10px",
    letterSpacing: "-0.3px",
  },
  featureDesc: {
    fontSize: 14,
    color: "rgba(232,245,232,0.5)",
    lineHeight: 1.7,
    margin: 0,
  },
  pipelineSection: {
    position: "relative",
    zIndex: 1,
    padding: "120px 48px",
    background: "rgba(5,14,8,0.5)",
    borderTop: "1px solid rgba(74,222,128,0.06)",
  },
  pipelineSectionMobile: {
    padding: "72px 16px",
  },
  pipeline: {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "center",
    gap: 0,
    flexWrap: "wrap",
    maxWidth: 1200,
    margin: "0 auto",
  },
  pipelineMobile: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 8,
  },
  pipelineCard: {
    background: "rgba(10,26,14,0.8)",
    border: "1px solid",
    borderRadius: 16,
    padding: "28px 24px",
    width: 180,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    backdropFilter: "blur(12px)",
    transition: "all 0.7s ease",
  },
  pipelineCardMobile: {
    width: "100%",
  },
  pipelineConnector: {
    fontSize: 22,
    fontWeight: 300,
    padding: "0 8px",
    alignSelf: "center",
    transition: "opacity 0.5s ease",
  },
  pipelineConnectorMobile: {
    display: "none",
  },
  pipelineId: {
    fontSize: 13,
    fontWeight: 700,
    border: "1px solid",
    borderRadius: 6,
    padding: "4px 10px",
    display: "inline-block",
    letterSpacing: "0.05em",
    width: "fit-content",
  },
  pipelineName: {
    fontSize: 15,
    fontWeight: 700,
    color: "#f0faf0",
    lineHeight: 1.3,
  },
  pipelineDesc: {
    fontSize: 12,
    color: "rgba(232,245,232,0.45)",
    lineHeight: 1.5,
    flex: 1,
  },
  pipelineBar: {
    height: 3,
    borderRadius: 2,
    overflow: "hidden",
    marginTop: 8,
  },
  pipelineBarFill: {
    height: "100%",
    borderRadius: 2,
    transition: "width 1.2s ease",
  },
  ctaSection: {
    position: "relative",
    zIndex: 1,
    padding: "120px 48px",
    display: "flex",
    justifyContent: "center",
  },
  ctaSectionMobile: {
    padding: "72px 16px",
  },
  ctaInner: {
    position: "relative",
    background: "rgba(10,26,14,0.8)",
    border: "1px solid rgba(74,222,128,0.2)",
    borderRadius: 28,
    padding: "80px 60px",
    textAlign: "center",
    maxWidth: 680,
    width: "100%",
    backdropFilter: "blur(20px)",
    overflow: "hidden",
  },
  ctaInnerMobile: {
    padding: "46px 18px",
    borderRadius: 18,
  },
  ctaGlow: {
    position: "absolute",
    top: "50%", left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400, height: 200,
    background: "radial-gradient(ellipse, rgba(74,222,128,0.12) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  ctaTitle: {
    fontSize: "clamp(32px, 4vw, 48px)",
    fontWeight: 800,
    color: "#f0faf0",
    margin: "0 0 16px",
    letterSpacing: "-1px",
    position: "relative",
  },
  ctaSub: {
    fontSize: 18,
    color: "rgba(232,245,232,0.5)",
    margin: "0 0 40px",
    position: "relative",
  },
  ctaTitleMobile: {
    lineHeight: 1.12,
  },
  ctaSubMobile: {
    fontSize: 15,
    marginBottom: 24,
  },
  ctaBig: {
    background: "#4ade80",
    color: "#050e08",
    border: "none",
    borderRadius: 14,
    padding: "20px 48px",
    fontSize: 18,
    fontWeight: 800,
    cursor: "pointer",
    position: "relative",
    letterSpacing: "-0.3px",
    transition: "all 0.2s",
    boxShadow: "0 0 40px rgba(74,222,128,0.3)",
  },
  ctaBigMobile: {
    width: "100%",
    fontSize: 16,
    padding: "14px 18px",
  },
  footer: {
    position: "relative",
    zIndex: 1,
    textAlign: "center",
    padding: "60px 24px",
    borderTop: "1px solid rgba(74,222,128,0.06)",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    alignItems: "center",
  },
  footerLogo: {
    fontSize: 22,
    fontWeight: 700,
    color: "#4ade80",
  },
  footerSub: {
    fontSize: 14,
    color: "rgba(232,245,232,0.4)",
  },
  footerNote: {
    fontSize: 12,
    color: "rgba(232,245,232,0.2)",
    marginTop: 8,
  },
}
