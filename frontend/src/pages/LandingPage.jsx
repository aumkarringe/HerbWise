import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import * as THREE from "three"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const FEATURES = [
  { icon: "🌿", title: "Herbal Remedies", desc: "5 evidence-backed herbs per condition with preparation methods and dosage" },
  { icon: "🧘", title: "Yoga Therapy", desc: "Safe poses verified by certified therapists with contraindication checks" },
  { icon: "👆", title: "Acupressure", desc: "TCM-validated pressure points with anatomically accurate locations" },
  { icon: "🔬", title: "Science Validated", desc: "Every remedy checked against PubMed, Semantic Scholar & OpenAlex" },
  { icon: "🤖", title: "5 Agent Pipeline", desc: "Hunter → Validator → Verifier → Citation Checker → Report Builder" },
  { icon: "⚡", title: "Zero Hallucinations", desc: "Real citations only — dead links and fake papers are automatically removed" },
]

const AGENTS = [
  { id: "A1", name: "Remedy Hunter",    color: "#4ade80", desc: "Finds herbs, poses & points" },
  { id: "A2", name: "Science Validator",color: "#60a5fa", desc: "Checks peer-reviewed evidence" },
  { id: "A3", name: "Pose Verifier",    color: "#f472b6", desc: "Validates safety & anatomy" },
  { id: "A4", name: "Citation Checker", color: "#fb923c", desc: "Verifies real sources live" },
  { id: "A5", name: "Report Builder",   color: "#a78bfa", desc: "Assembles final report" },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const mountRef   = useRef(null)
  const heroRef    = useRef(null)
  const badgeRef   = useRef(null)
  const titleRef   = useRef(null)
  const subRef     = useRef(null)
  const ctasRef    = useRef(null)
  const floatRef   = useRef(null)
  const statsRef   = useRef(null)
  const featRef    = useRef(null)
  const pipeRef    = useRef(null)
  const ctaSectRef = useRef(null)
  const styleRef   = useRef(null)

  const [scrollY, setScrollY]       = useState(0)
  const [mousePos, setMousePos]     = useState({ x: 0, y: 0 })
  const [activeAgent, setActiveAgent] = useState(0)
  const [screenW, setScreenW]       = useState(typeof window !== "undefined" ? window.innerWidth : 1200)
  const [typed, setTyped]           = useState("")

  const conditions  = ["headache", "insomnia", "anxiety", "joint pain", "stress", "acidity"]
  const condRef     = useRef(0)
  const charRef2    = useRef(0)
  const deletingRef = useRef(false)

  // ── Three.js particle background ─────────────────────────────────────────
  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.domElement.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;"
    mount.appendChild(renderer.domElement)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5

    const COUNT = 280
    const positions = new Float32Array(COUNT * 3)
    const colors    = new Float32Array(COUNT * 3)
    const speeds    = []

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10

      const hue = 110 + Math.random() * 80
      const c = new THREE.Color(`hsl(${hue}, 60%, 65%)`)
      colors[i * 3]     = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b

      speeds.push({
        x: (Math.random() - 0.5) * 0.003,
        y: (Math.random() - 0.5) * 0.003,
      })
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    geo.setAttribute("color",    new THREE.BufferAttribute(colors, 3))

    const mat = new THREE.PointsMaterial({
      size: 0.06, vertexColors: true,
      transparent: true, opacity: 0.55,
      sizeAttenuation: true,
    })

    const points = new THREE.Points(geo, mat)
    scene.add(points)

    let animId
    const animate = () => {
      animId = requestAnimationFrame(animate)
      const pos = geo.attributes.position.array
      for (let i = 0; i < COUNT; i++) {
        pos[i * 3]     += speeds[i].x
        pos[i * 3 + 1] += speeds[i].y
        if (pos[i * 3] > 10)    pos[i * 3]     = -10
        if (pos[i * 3] < -10)   pos[i * 3]     =  10
        if (pos[i * 3 + 1] > 10) pos[i * 3 + 1] = -10
        if (pos[i * 3 + 1] < -10) pos[i * 3 + 1] =  10
      }
      geo.attributes.position.needsUpdate = true
      points.rotation.y += 0.0005
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener("resize", onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", onResize)
      renderer.dispose()
      geo.dispose()
      mat.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  // ── GSAP hero entrance animations ────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 })
      tl.from(badgeRef.current,  { opacity: 0, y: 30, duration: 0.6, ease: "power3.out" })
        .from(titleRef.current,  { opacity: 0, y: 40, duration: 0.7, ease: "power3.out" }, "-=0.35")
        .from(subRef.current,    { opacity: 0, y: 30, duration: 0.6, ease: "power3.out" }, "-=0.4")
        .from(ctasRef.current,   { opacity: 0, y: 20, duration: 0.5, ease: "power3.out" }, "-=0.3")
        .from(floatRef.current,  { opacity: 0, y: 50, scale: 0.96, duration: 0.8, ease: "power3.out" }, "-=0.2")
    })
    return () => ctx.revert()
  }, [])

  // ── GSAP scroll animations ────────────────────────────────────────────────
  // NOTE: uses fromTo() — elements stay visible until they enter the viewport,
  // then animate in. from() would set opacity:0 immediately on mount (blank page).
  useEffect(() => {
    const ctx = gsap.context(() => {
      const into = (els, vars) => gsap.fromTo(els,
        { opacity: 0, y: vars.y ?? 40 },
        { opacity: 1, y: 0, duration: vars.dur ?? 0.7, stagger: vars.stagger ?? 0,
          ease: vars.ease ?? "power3.out",
          scrollTrigger: { trigger: vars.trigger, start: "top 92%", once: true } }
      )

      // Stats
      const statItems = statsRef.current?.querySelectorAll(".hw-stat-item")
      if (statItems?.length) into(statItems, { trigger: statsRef.current, stagger: 0.12 })

      // Feature cards
      const featureCards = featRef.current?.querySelectorAll(".hw-feature-card")
      if (featureCards?.length) {
        gsap.fromTo(featureCards,
          { opacity: 0, y: 50, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.65, stagger: 0.08, ease: "power3.out",
            scrollTrigger: { trigger: featRef.current, start: "top 92%", once: true } }
        )
      }

      // Pipeline cards
      const pipeCards = pipeRef.current?.querySelectorAll(".hw-pipeline-card")
      if (pipeCards?.length) {
        gsap.fromTo(pipeCards,
          { opacity: 0, y: 45 },
          { opacity: 1, y: 0, duration: 0.65, stagger: 0.12, ease: "power3.out",
            scrollTrigger: { trigger: pipeRef.current, start: "top 92%", once: true } }
        )
        // Bar fills — scaleX from 0 → 1 after cards arrive
        pipeRef.current.querySelectorAll(".hw-pipeline-bar-fill").forEach((bar, i) => {
          gsap.fromTo(bar,
            { scaleX: 0, transformOrigin: "left center" },
            { scaleX: 1, duration: 1.1, ease: "power2.out",
              scrollTrigger: { trigger: pipeRef.current, start: "top 92%", once: true },
              delay: i * 0.16 + 0.35 }
          )
        })
      }

      // CTA section
      const ctaInner = ctaSectRef.current?.querySelector(".hw-cta-inner")
      if (ctaInner) {
        gsap.fromTo(ctaInner,
          { opacity: 0, scale: 0.95, y: 35 },
          { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "back.out(1.2)",
            scrollTrigger: { trigger: ctaSectRef.current, start: "top 92%", once: true } }
        )
      }

      // Parallax on hero rings (scrub — no opacity, always visible)
      const rings = heroRef.current?.querySelector(".hero-rings")
      if (rings) {
        gsap.to(rings, {
          scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: 1 },
          y: -120, scale: 1.08,
        })
      }
    })

    return () => ctx.revert()
  }, [])

  // ── Typewriter ────────────────────────────────────────────────────────────
  useEffect(() => {
    const tick = () => {
      const word = conditions[condRef.current]
      if (!deletingRef.current) {
        setTyped(word.slice(0, charRef2.current + 1))
        charRef2.current++
        if (charRef2.current === word.length) { deletingRef.current = true; setTimeout(tick, 1800); return }
      } else {
        setTyped(word.slice(0, charRef2.current - 1))
        charRef2.current--
        if (charRef2.current === 0) { deletingRef.current = false; condRef.current = (condRef.current + 1) % conditions.length }
      }
      setTimeout(tick, deletingRef.current ? 60 : 100)
    }
    const t = setTimeout(tick, 800)
    return () => clearTimeout(t)
  }, [])

  // ── Agent cycling ─────────────────────────────────────────────────────────
  useEffect(() => {
    const iv = setInterval(() => setActiveAgent(p => (p + 1) % AGENTS.length), 1400)
    return () => clearInterval(iv)
  }, [])

  // ── Scroll / mouse / resize ───────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const onMove = e => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener("mousemove", onMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  useEffect(() => {
    const onResize = () => setScreenW(window.innerWidth)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  // ── CSS keyframes ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (styleRef.current) return
    const style = document.createElement("style")
    style.textContent = `
      @keyframes pulse { 0%,100%{opacity:1;box-shadow:0 0 8px #4ade80} 50%{opacity:0.5;box-shadow:0 0 16px #4ade80} }
      @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0} }
      @keyframes scrollAnim { 0%{transform:scaleY(0);transform-origin:top} 50%{transform:scaleY(1);transform-origin:top} 51%{transform:scaleY(1);transform-origin:bottom} 100%{transform:scaleY(0);transform-origin:bottom} }
    `
    document.head.appendChild(style)
    styleRef.current = style
    return () => { if (styleRef.current) { document.head.removeChild(styleRef.current); styleRef.current = null } }
  }, [])

  const vH = typeof window !== "undefined" ? window.innerHeight || 1 : 1
  const vW = typeof window !== "undefined" ? window.innerWidth  || 1 : 1
  const isMobile = screenW < 768
  const tiltStyle = {
    transform: `perspective(1000px) rotateX(${(mousePos.y / vH - 0.5) * -8}deg) rotateY(${(mousePos.x / vW - 0.5) * 8}deg)`,
    transition: "transform 0.15s ease",
  }

  return (
    <div style={s.page}>
      {/* Three.js mount point — zero-size, canvas is fixed-position */}
      <div ref={mountRef} style={{ position: "absolute", width: 0, height: 0, overflow: "visible" }} />

      {/* Noise texture overlay */}
      <div style={s.texture} />

      {/* Parallax gradient orbs */}
      <div style={{ ...s.orb1, ...(isMobile ? s.orbCompact : {}), transform: `translate(${scrollY * 0.15}px, ${scrollY * 0.1}px)` }} />
      <div style={{ ...s.orb2, ...(isMobile ? s.orbCompact : {}), transform: `translate(${-scrollY * 0.1}px, ${scrollY * 0.08}px)` }} />

      {/* Nav */}
      <nav style={{ ...s.nav, ...(isMobile ? s.navMobile : {}) }}>
        <div style={s.navLogo}>🌿 HerbWise</div>
        <div style={{ ...s.navLinks, ...(isMobile ? s.navLinksMobile : {}) }}>
          {!isMobile && <a href="#features" style={s.navLink}>Features</a>}
          {!isMobile && <a href="#pipeline" style={s.navLink}>How It Works</a>}
          <button style={s.navCta} onClick={() => navigate("/wellness-search")}>Try It Free →</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section ref={heroRef} style={{ ...s.hero, ...(isMobile ? s.heroMobile : {}) }}>
        <div className="hero-rings" style={{ ...s.heroRings, ...(isMobile ? s.heroRingsMobile : {}) }} />
        <div style={{ ...s.heroInner, ...(isMobile ? s.heroInnerMobile : {}) }}>

          <div ref={badgeRef} className="hw-badge" style={{ ...s.badge, ...(isMobile ? s.badgeMobile : {}) }}>
            <span style={s.badgeDot} />
            AI Powered · Evidence Validated · Zero Hallucinations
          </div>

          <h1 ref={titleRef} className="hw-title" style={s.heroTitle}>
            Natural Remedies,<br />
            <span style={s.heroGradient}>Scientifically Verified</span>
          </h1>

          <p ref={subRef} style={{ ...s.heroSub, ...(isMobile ? s.heroSubMobile : {}) }}>
            Type{" "}
            <span style={s.typewriter}>
              <span style={s.typed}>{typed}</span>
              <span style={s.cursor}>|</span>
            </span>
            {" "}and get herbs, yoga poses & acupressure points — all backed by real peer-reviewed research.
          </p>

          <div ref={ctasRef} style={{ ...s.heroCtas, ...(isMobile ? s.heroCtasMobile : {}) }}>
            <button style={{ ...s.ctaPrimary, ...(isMobile ? s.ctaPrimaryMobile : {}) }} onClick={() => navigate("/wellness-search")}>
              Start Your Search
            </button>
            <button style={{ ...s.ctaSecondary, ...(isMobile ? s.ctaSecondaryMobile : {}) }}
              onClick={() => document.getElementById("pipeline")?.scrollIntoView({ behavior: "smooth" })}>
              See How It Works
            </button>
          </div>

          {/* 3D floating card */}
          <div ref={floatRef} style={{ ...s.floatCard, ...(isMobile ? s.floatCardMobile : {}), ...(!isMobile ? tiltStyle : {}) }}>
            <div style={s.floatCardInner}>
              <div style={{ ...s.floatRow, ...(isMobile ? s.floatRowMobile : {}) }}>
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
                      <div style={{ ...s.agentArrow, opacity: i < activeAgent ? 1 : 0.2, color: i < activeAgent ? "#4ade80" : "rgba(255,255,255,0.2)" }}>→</div>
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

        <div style={s.scrollHint}>
          <div style={s.scrollLine} />
          <span style={s.scrollText}>scroll</span>
        </div>
      </section>

      {/* ── STATS ── */}
      <section ref={statsRef} style={{ ...s.stats, ...(isMobile ? s.statsMobile : {}) }}>
        {[
          { num: "14", label: "Health Features" },
          { num: "0%", label: "Hallucination Rate" },
          { num: "5",  label: "Validation Agents" },
          { num: "3",  label: "Citation Databases" },
        ].map((stat, i) => (
          <div key={i} className="hw-stat-item" style={{ ...s.statItem, ...(isMobile ? s.statItemMobile : {}) }}>
            <div style={s.statNum}>{stat.num}</div>
            <div style={s.statLabel}>{stat.label}</div>
          </div>
        ))}
      </section>

      {/* ── FEATURES ── */}
      <section id="features" ref={featRef} style={{ ...s.section, ...(isMobile ? s.sectionMobile : {}) }}>
        <div style={{ ...s.sectionHead, ...(isMobile ? s.sectionHeadMobile : {}) }}>
          <h2 style={{ ...s.sectionTitle, ...(isMobile ? s.sectionTitleMobile : {}) }}>Everything you need, nothing you don't</h2>
          <p style={{ ...s.sectionSub, ...(isMobile ? s.sectionSubMobile : {}) }}>Every modality validated. Every source verified. Every recommendation safe.</p>
        </div>
        <div style={{ ...s.featureGrid, ...(isMobile ? s.featureGridMobile : {}) }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="hw-feature-card" style={s.featureCard}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-8px) scale(1.02)"; e.currentTarget.style.borderColor = "rgba(74,222,128,0.4)" }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)" }}
            >
              <div style={s.featureIcon}>{f.icon}</div>
              <h3 style={s.featureTitle}>{f.title}</h3>
              <p style={s.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PIPELINE ── */}
      <section id="pipeline" ref={pipeRef} style={{ ...s.pipelineSection, ...(isMobile ? s.pipelineSectionMobile : {}) }}>
        <div style={{ ...s.sectionHead, ...(isMobile ? s.sectionHeadMobile : {}) }}>
          <h2 style={{ ...s.sectionTitle, ...(isMobile ? s.sectionTitleMobile : {}) }}>The 5 Agent Validation Pipeline</h2>
          <p style={{ ...s.sectionSub, ...(isMobile ? s.sectionSubMobile : {}) }}>Every search triggers a full validation chain before anything reaches you</p>
        </div>
        <div style={{ ...s.pipeline, ...(isMobile ? s.pipelineMobile : {}) }}>
          {AGENTS.map((agent, i) => (
            <div key={agent.id} style={{ display: "flex", alignItems: "center" }}>
              <div className="hw-pipeline-card" style={{ ...s.pipelineCard, ...(isMobile ? s.pipelineCardMobile : {}), borderColor: agent.color + "44", boxShadow: `0 0 30px ${agent.color}11` }}>
                <div style={{ ...s.pipelineId, color: agent.color, borderColor: agent.color + "44" }}>{agent.id}</div>
                <div style={s.pipelineName}>{agent.name}</div>
                <div style={s.pipelineDesc}>{agent.desc}</div>
                <div style={{ ...s.pipelineBar, background: agent.color + "33" }}>
                  <div className="hw-pipeline-bar-fill" style={{ ...s.pipelineBarFill, background: agent.color }} />
                </div>
              </div>
              {i < AGENTS.length - 1 && (
                <div style={{ ...s.pipelineConnector, ...(isMobile ? s.pipelineConnectorMobile : {}), color: agent.color }}>→</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section ref={ctaSectRef} style={{ ...s.ctaSection, ...(isMobile ? s.ctaSectionMobile : {}) }}>
        <div className="hw-cta-inner" style={{ ...s.ctaInner, ...(isMobile ? s.ctaInnerMobile : {}) }}>
          <div style={s.ctaGlow} />
          <h2 style={{ ...s.ctaTitle, ...(isMobile ? s.ctaTitleMobile : {}) }}>Ready to find your remedy?</h2>
          <p style={{ ...s.ctaSub, ...(isMobile ? s.ctaSubMobile : {}) }}>No accounts needed. Start with one free search.</p>
          <button style={{ ...s.ctaBig, ...(isMobile ? s.ctaBigMobile : {}) }} onClick={() => navigate("/wellness-search")}>
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
  page: { minHeight: "100vh", background: "#050e08", color: "#e8f5e8", fontFamily: "'DM Sans','Outfit',system-ui,sans-serif", overflowX: "hidden", position: "relative" },
  texture: { position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.1, backgroundImage: "radial-gradient(rgba(255,255,255,0.35) 0.45px,transparent 0.45px)", backgroundSize: "8px 8px" },
  orb1: { position: "fixed", top: "-20%", left: "-10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(34,197,94,0.12) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 },
  orb2: { position: "fixed", bottom: "-20%", right: "-10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(96,165,250,0.1) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 },
  orbCompact: { width: 300, height: 300 },
  nav: { position: "fixed", top: 0, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 48px", background: "rgba(5,14,8,0.7)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(74,222,128,0.08)", zIndex: 100 },
  navMobile: { padding: "12px 16px" },
  navLogo: { fontSize: 22, fontWeight: 700, color: "#4ade80", letterSpacing: "-0.5px" },
  navLinks: { display: "flex", alignItems: "center", gap: 32 },
  navLinksMobile: { gap: 10 },
  navLink: { color: "rgba(232,245,232,0.6)", textDecoration: "none", fontSize: 14, fontWeight: 500 },
  navCta: { background: "#4ade80", color: "#050e08", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer" },
  hero: { position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "120px 24px 80px", textAlign: "center" },
  heroMobile: { padding: "104px 16px 56px", minHeight: "calc(100vh - 20px)" },
  heroRings: { position: "absolute", width: 560, height: 560, borderRadius: "50%", border: "1px solid rgba(74,222,128,0.12)", boxShadow: "0 0 0 55px rgba(74,222,128,0.05),0 0 0 110px rgba(34,211,238,0.04)", top: "50%", left: "50%", transform: "translate(-50%,-52%)", pointerEvents: "none", zIndex: 0, willChange: "transform" },
  heroRingsMobile: { width: 300, height: 300, boxShadow: "0 0 0 28px rgba(74,222,128,0.05),0 0 0 56px rgba(34,211,238,0.04)" },
  heroInner: { position: "relative", zIndex: 2, maxWidth: 900, margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 28 },
  heroInnerMobile: { gap: 20, maxWidth: 620 },
  badge: { display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 100, padding: "8px 20px", fontSize: 12, fontWeight: 600, color: "#4ade80", letterSpacing: "0.05em", textTransform: "uppercase" },
  badgeMobile: { fontSize: 10, padding: "8px 12px" },
  badgeDot: { width: 6, height: 6, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px #4ade80", animation: "pulse 2s infinite", display: "inline-block" },
  heroTitle: { fontSize: "clamp(48px,7vw,88px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-2px", color: "#f0faf0", margin: 0 },
  heroGradient: { background: "linear-gradient(135deg,#4ade80 0%,#22d3ee 50%,#a78bfa 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" },
  heroSub: { fontSize: 20, color: "rgba(232,245,232,0.6)", lineHeight: 1.7, maxWidth: 580, margin: 0 },
  heroSubMobile: { fontSize: 16, lineHeight: 1.5 },
  typewriter: { fontStyle: "italic", color: "#4ade80" },
  typed: { fontWeight: 700 },
  cursor: { animation: "blink 1s infinite", marginLeft: 1, fontWeight: 300 },
  heroCtas: { display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" },
  heroCtasMobile: { width: "100%", flexDirection: "column", gap: 10 },
  ctaPrimary: { background: "#4ade80", color: "#050e08", border: "none", borderRadius: 12, padding: "16px 36px", fontSize: 17, fontWeight: 700, cursor: "pointer", letterSpacing: "-0.3px" },
  ctaPrimaryMobile: { width: "100%", padding: "14px 16px", fontSize: 16 },
  ctaSecondary: { background: "transparent", color: "#4ade80", border: "1.5px solid rgba(74,222,128,0.3)", borderRadius: 12, padding: "16px 36px", fontSize: 17, fontWeight: 600, cursor: "pointer" },
  ctaSecondaryMobile: { width: "100%", padding: "14px 16px", fontSize: 16 },
  floatCard: { marginTop: 20, background: "rgba(10,26,14,0.85)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 20, padding: "28px 32px", backdropFilter: "blur(24px)", boxShadow: "0 32px 80px rgba(0,0,0,0.5),0 0 60px rgba(74,222,128,0.05)", width: "100%", maxWidth: 680, transformStyle: "preserve-3d" },
  floatCardMobile: { padding: "18px 14px", borderRadius: 14, marginTop: 10 },
  floatCardInner: { display: "flex", flexDirection: "column", gap: 20 },
  floatRow: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  floatRowMobile: { flexDirection: "column", alignItems: "flex-start", gap: 6 },
  floatLabel: { fontSize: 12, color: "rgba(232,245,232,0.4)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.1em" },
  floatCondition: { fontSize: 16, fontWeight: 700, color: "#4ade80" },
  agentFlow: { display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" },
  agentPill: { border: "1px solid", borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 600, transition: "all 0.3s ease", letterSpacing: "0.02em" },
  agentArrow: { fontSize: 14, transition: "all 0.3s ease" },
  floatResult: { display: "flex", flexDirection: "column", gap: 8, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 },
  resultItem: { fontSize: 14, color: "rgba(232,245,232,0.8)", display: "flex", gap: 8, alignItems: "center" },
  scrollHint: { position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: 0.4, zIndex: 2 },
  scrollLine: { width: 1, height: 40, background: "linear-gradient(to bottom,transparent,#4ade80)", animation: "scrollAnim 2s infinite" },
  scrollText: { fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#4ade80" },
  stats: { position: "relative", zIndex: 1, display: "flex", justifyContent: "center", background: "rgba(74,222,128,0.04)", borderTop: "1px solid rgba(74,222,128,0.08)", borderBottom: "1px solid rgba(74,222,128,0.08)", flexWrap: "wrap" },
  statsMobile: { flexDirection: "column" },
  statItem: { flex: "1 1 200px", textAlign: "center", padding: "48px 32px", borderRight: "1px solid rgba(74,222,128,0.08)" },
  statItemMobile: { borderRight: "none", borderBottom: "1px solid rgba(74,222,128,0.08)", padding: "28px 18px" },
  statNum: { fontSize: 52, fontWeight: 800, color: "#4ade80", letterSpacing: "-2px", lineHeight: 1 },
  statLabel: { fontSize: 14, color: "rgba(232,245,232,0.5)", marginTop: 8, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em" },
  section: { position: "relative", zIndex: 1, padding: "120px 48px", maxWidth: 1200, margin: "0 auto" },
  sectionMobile: { padding: "72px 16px" },
  sectionHead: { textAlign: "center", marginBottom: 64 },
  sectionHeadMobile: { marginBottom: 34 },
  sectionTitle: { fontSize: "clamp(32px,4vw,52px)", fontWeight: 800, color: "#f0faf0", margin: "0 0 16px", letterSpacing: "-1px" },
  sectionTitleMobile: { lineHeight: 1.15 },
  sectionSub: { fontSize: 18, color: "rgba(232,245,232,0.5)", maxWidth: 500, margin: "0 auto", lineHeight: 1.6 },
  sectionSubMobile: { fontSize: 15, maxWidth: 340 },
  featureGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 },
  featureGridMobile: { gridTemplateColumns: "1fr", gap: 14 },
  featureCard: { background: "rgba(10,26,14,0.6)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "32px 28px", backdropFilter: "blur(12px)", cursor: "default", transition: "all 0.35s cubic-bezier(0.23,1,0.32,1)" },
  featureIcon: { fontSize: 36, marginBottom: 16, display: "block" },
  featureTitle: { fontSize: 19, fontWeight: 700, color: "#f0faf0", margin: "0 0 10px", letterSpacing: "-0.3px" },
  featureDesc: { fontSize: 14, color: "rgba(232,245,232,0.5)", lineHeight: 1.7, margin: 0 },
  pipelineSection: { position: "relative", zIndex: 1, padding: "120px 48px", background: "rgba(5,14,8,0.5)", borderTop: "1px solid rgba(74,222,128,0.06)" },
  pipelineSectionMobile: { padding: "72px 16px" },
  pipeline: { display: "flex", alignItems: "stretch", justifyContent: "center", gap: 0, flexWrap: "wrap", maxWidth: 1200, margin: "0 auto" },
  pipelineMobile: { flexDirection: "column", alignItems: "stretch", gap: 8 },
  pipelineCard: { background: "rgba(10,26,14,0.8)", border: "1px solid", borderRadius: 16, padding: "28px 24px", width: 180, display: "flex", flexDirection: "column", gap: 10, backdropFilter: "blur(12px)" },
  pipelineCardMobile: { width: "100%" },
  pipelineConnector: { fontSize: 22, fontWeight: 300, padding: "0 8px", alignSelf: "center" },
  pipelineConnectorMobile: { display: "none" },
  pipelineId: { fontSize: 13, fontWeight: 700, border: "1px solid", borderRadius: 6, padding: "4px 10px", display: "inline-block", letterSpacing: "0.05em", width: "fit-content" },
  pipelineName: { fontSize: 15, fontWeight: 700, color: "#f0faf0", lineHeight: 1.3 },
  pipelineDesc: { fontSize: 12, color: "rgba(232,245,232,0.45)", lineHeight: 1.5, flex: 1 },
  pipelineBar: { height: 3, borderRadius: 2, overflow: "hidden", marginTop: 8 },
  pipelineBarFill: { height: "100%", width: "100%", borderRadius: 2 },
  ctaSection: { position: "relative", zIndex: 1, padding: "120px 48px", display: "flex", justifyContent: "center" },
  ctaSectionMobile: { padding: "72px 16px" },
  ctaInner: { position: "relative", background: "rgba(10,26,14,0.8)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 28, padding: "80px 60px", textAlign: "center", maxWidth: 680, width: "100%", backdropFilter: "blur(20px)", overflow: "hidden" },
  ctaInnerMobile: { padding: "46px 18px", borderRadius: 18 },
  ctaGlow: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 400, height: 200, background: "radial-gradient(ellipse,rgba(74,222,128,0.12) 0%,transparent 70%)", pointerEvents: "none" },
  ctaTitle: { fontSize: "clamp(32px,4vw,48px)", fontWeight: 800, color: "#f0faf0", margin: "0 0 16px", letterSpacing: "-1px", position: "relative" },
  ctaTitleMobile: { lineHeight: 1.12 },
  ctaSub: { fontSize: 18, color: "rgba(232,245,232,0.5)", margin: "0 0 40px", position: "relative" },
  ctaSubMobile: { fontSize: 15, marginBottom: 24 },
  ctaBig: { background: "#4ade80", color: "#050e08", border: "none", borderRadius: 14, padding: "20px 48px", fontSize: 18, fontWeight: 800, cursor: "pointer", position: "relative", letterSpacing: "-0.3px", boxShadow: "0 0 40px rgba(74,222,128,0.3)" },
  ctaBigMobile: { width: "100%", fontSize: 16, padding: "14px 18px" },
  footer: { position: "relative", zIndex: 1, textAlign: "center", padding: "60px 24px", borderTop: "1px solid rgba(74,222,128,0.06)", display: "flex", flexDirection: "column", gap: 8, alignItems: "center" },
  footerLogo: { fontSize: 22, fontWeight: 700, color: "#4ade80" },
  footerSub: { fontSize: 14, color: "rgba(232,245,232,0.4)" },
  footerNote: { fontSize: 12, color: "rgba(232,245,232,0.2)", marginTop: 8 },
}
