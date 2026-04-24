// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"

const NAV_ITEMS = [
  { path: "/",                  label: "Wellness Search",    emoji: "🔍" },
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
  { path: "/home-remedies",     label: "Home Remedies+",    emoji: "🏠" },
  { path: "/exercise-planner",  label: "Exercise Planner",  emoji: "🏋️" },
]

// Add to Sidebar.jsx — update the component signature and add profile section

export default function Sidebar({ collapsed, onToggle, user }) {
  const { signOut } = useAuth()
  const [isMobile, setIsMobile] = useState(() => (
    typeof window !== "undefined" ? window.innerWidth <= 900 : false
  ))

  useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth <= 900)
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  const compact = collapsed || isMobile

  return (
    <aside className="sidebar-shell" style={{ ...styles.sidebar, width: compact ? 64 : 260 }}>

      {/* Logo row — same as before */}

      <nav style={styles.nav}>
        {NAV_ITEMS.map((item, i) => {
          const isLocked = !user && item.path !== "/"
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              style={({ isActive }) => ({
                ...styles.navItem,
                background: isActive ? "#166534" : "transparent",
                color: isActive ? "#fff" : isLocked ? "#4b7a5e" : "#86efac",
                opacity: isLocked ? 0.6 : 1,
              })}
            >
              <span style={styles.navEmoji}>{item.emoji}</span>
              {!compact && (
                <>
                  <span style={styles.navLabel}>{item.label}</span>
                  {isLocked && <span style={styles.lockIcon}>🔒</span>}
                </>
              )}
            </NavLink>
          )
        })}

        {/* Saved Reports — only for logged in users */}
        {user && (
          <NavLink
            to="/saved-reports"
            style={({ isActive }) => ({
              ...styles.navItem,
              background: isActive ? "#166534" : "transparent",
              color: isActive ? "#fff" : "#86efac",
            })}
          >
            <span style={styles.navEmoji}>🔖</span>
            {!compact && <span style={styles.navLabel}>Saved Reports</span>}
          </NavLink>
        )}
      </nav>

      {/* User profile at bottom */}
      <div style={styles.profileSection}>
        {user ? (
          <div style={styles.profile}>
            {!compact && (
              <div style={styles.profileInfo}>
                <div style={styles.profileName}>
                  {user.user_metadata?.full_name || user.email}
                </div>
                <div style={styles.profileEmail}>{user.email}</div>
              </div>
            )}
            <button style={styles.signOutBtn} onClick={signOut} title="Sign out">
              ↩
            </button>
          </div>
        ) : (
          !compact && (
            <div style={styles.signInPrompt}>
              <div style={styles.signInText}>Sign in for full access</div>
            </div>
          )
        )}
      </div>

    </aside>
  )
}

const extraStyles = {
  lockIcon: { marginLeft: "auto", fontSize: 11 },
  profileSection: {
    borderTop: "1px solid #166534",
    padding: "12px 8px"
  },
  profile: {
    display: "flex", alignItems: "center",
    gap: 10, padding: "8px"
  },
  profileInfo: { flex: 1, overflow: "hidden" },
  profileName: {
    fontSize: 13, fontWeight: 600,
    color: "#fff", overflow: "hidden",
    textOverflow: "ellipsis", whiteSpace: "nowrap"
  },
  profileEmail: {
    fontSize: 11, color: "#4ade80",
    overflow: "hidden", textOverflow: "ellipsis"
  },
  signOutBtn: {
    background: "#166534", border: "none",
    color: "#86efac", borderRadius: 8,
    width: 32, height: 32, cursor: "pointer",
    fontSize: 16
  },
  signInPrompt: { padding: "8px" },
  signInText: { fontSize: 12, color: "#4ade80" }
}

const styles = {
  sidebar: {
    display: "flex",
    flexDirection: "column",
    background: "#14532d",
    color: "#fff",
    minHeight: "100vh",
    transition: "width 0.2s ease",
    boxShadow: "2px 0 12px rgba(0, 0, 0, 0.08)",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    padding: 12,
    flex: 1,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    borderRadius: 10,
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 500,
    transition: "background 0.2s ease, color 0.2s ease, opacity 0.2s ease",
  },
  navEmoji: { width: 20, textAlign: "center" },
  navLabel: { flex: 1 },
  ...extraStyles,
}