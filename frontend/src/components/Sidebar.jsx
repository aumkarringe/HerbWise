// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"

const NAV_ITEMS = [
  { path: "/wellness-search",   label: "Wellness Search",    emoji: "🔍" },
  { path: "/symptom-analyzer",  label: "Symptom Analyzer",  emoji: "🩺" },
  { path: "/safety-check",      label: "Safety Check",      emoji: "🛡️" },
  { path: "/wellness-plan",     label: "Wellness Plan",     emoji: "📅" },
  { path: "/dosage-calculator", label: "Dosage Calculator", emoji: "💊" },
  { path: "/preparation-guide", label: "Preparation Guide", emoji: "📖" },
  { path: "/seasonal-remedies", label: "Seasonal Remedies", emoji: "🍂" },
  { path: "/natural-beauty",    label: "Natural Beauty",    emoji: "💄" },
  { path: "/sleep-optimizer",   label: "Sleep Optimizer",   emoji: "😴" },
  { path: "/stress-relief",     label: "Stress Relief",     emoji: "🧘" },
  { path: "/immunity-booster",  label: "Immunity Booster",  emoji: "🛡" },
  { path: "/breathing-test",    label: "Breathing Test",    emoji: "🌬️" },
  { path: "/exercise-planner",  label: "Exercise Planner",  emoji: "🏋️" },
]

export default function Sidebar({ collapsed, onToggle, user }) {
  const { signOut } = useAuth()
  const [isMobile, setIsMobile] = useState(() => (
    typeof window !== "undefined" ? window.innerWidth <= 900 : false
  ))

  useEffect(() => {
    function onResize() { setIsMobile(window.innerWidth <= 900) }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  const compact = collapsed || isMobile

  const sidebarBg     = "rgba(5,14,8,0.98)"
  const sidebarBorder = "rgba(74,222,128,0.1)"
  const sidebarShadow = "2px 0 24px rgba(0,0,0,0.5)"
  const textNormal    = "rgba(232,245,232,0.65)"
  const textLocked    = "rgba(232,245,232,0.3)"
  const activeColor   = "#4ade80"
  const activeBg      = "rgba(74,222,128,0.12)"
  const profileBorder = "rgba(74,222,128,0.1)"
  const btnBg         = "rgba(74,222,128,0.1)"
  const btnBorder     = "rgba(74,222,128,0.25)"
  const logoColor     = "#4ade80"
  const headingColor  = "#f0faf0"

  return (
    <aside className="sidebar-shell" style={{
      display: "flex", flexDirection: "column",
      background: sidebarBg, backdropFilter: "blur(20px)",
      borderRight: `1px solid ${sidebarBorder}`,
      color: "#e8f5e8",
      minHeight: "100vh", width: compact ? 64 : 260,
      transition: "width 0.2s ease, background 0.3s ease",
      boxShadow: sidebarShadow,
    }}>

      {/* Logo */}
      <div style={{ padding: compact ? "16px 0" : "16px 16px", display: "flex", alignItems: "center", justifyContent: compact ? "center" : "space-between", borderBottom: `1px solid ${sidebarBorder}` }}>
        {!compact && <span style={{ fontSize: 18, fontWeight: 800, color: logoColor, letterSpacing: "-0.5px" }}>🌿 HerbWise</span>}
        <button
          onClick={onToggle}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: activeColor, padding: 4, borderRadius: 6 }}
          title={compact ? "Expand sidebar" : "Collapse sidebar"}
        >
          {compact ? "▶" : "◀"}
        </button>
      </div>

      {/* Nav */}
      <nav style={{ display: "flex", flexDirection: "column", gap: 4, padding: "12px 8px", flex: 1, overflowY: "auto" }}>
        {NAV_ITEMS.map((item) => {
          const isLocked = !user && item.path !== "/wellness-search"
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 10px", borderRadius: 10, textDecoration: "none",
                fontSize: 13, fontWeight: 500, transition: "all 0.2s ease",
                background: isActive ? activeBg : "transparent",
                color: isActive ? activeColor : isLocked ? textLocked : textNormal,
                borderLeft: isActive ? `2px solid ${activeColor}` : "2px solid transparent",
                opacity: isLocked ? 0.5 : 1,
              })}
            >
              <span style={{ width: 20, textAlign: "center", fontSize: 15 }}>{item.emoji}</span>
              {!compact && (
                <>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {isLocked && <span style={{ fontSize: 11 }}>🔒</span>}
                </>
              )}
            </NavLink>
          )
        })}

        {user && (
          <NavLink
            to="/saved-reports"
            style={({ isActive }) => ({
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 10px", borderRadius: 10, textDecoration: "none",
              fontSize: 13, fontWeight: 500, transition: "all 0.2s ease",
              background: isActive ? activeBg : "transparent",
              color: isActive ? activeColor : textNormal,
              borderLeft: isActive ? `2px solid ${activeColor}` : "2px solid transparent",
            })}
          >
            <span style={{ width: 20, textAlign: "center", fontSize: 15 }}>🔖</span>
            {!compact && <span style={{ flex: 1 }}>Saved Reports</span>}
          </NavLink>
        )}
      </nav>

      {/* Bottom — user profile */}
      <div style={{ borderTop: `1px solid ${profileBorder}`, padding: "10px 8px", display: "flex", flexDirection: "column", gap: 8 }}>

        {/* User */}
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 2px" }}>
            {!compact && (
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: headingColor, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.user_metadata?.full_name || user.email}
                </div>
                <div style={{ fontSize: 11, color: activeColor, overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</div>
              </div>
            )}
            <button
              onClick={signOut}
              title="Sign out"
              style={{ background: btnBg, border: `1px solid ${btnBorder}`, color: activeColor, borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16, flexShrink: 0 }}
            >
              ↩
            </button>
          </div>
        ) : (
          !compact && (
            <div style={{ padding: "4px 2px", fontSize: 12, color: textLocked }}>
              Sign in for full access
            </div>
          )
        )}
      </div>
    </aside>
  )
}
