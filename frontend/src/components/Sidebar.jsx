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

  return (
    <aside className={`sidebar-shell${compact ? " sidebar-shell--compact" : ""}`}>

      {/* Logo + toggle */}
      <div className={`sidebar-header${compact ? " sidebar-header--compact" : ""}`}>
        {!compact && <span className="sidebar-logo">🌿 HerbWise</span>}
        <button
          className="sidebar-icon-btn"
          onClick={onToggle}
          title={compact ? "Expand sidebar" : "Collapse sidebar"}
        >
          {compact ? "▶" : "◀"}
        </button>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const isLocked = !user && item.path !== "/wellness-search"
          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={compact ? item.label : undefined}
              className={({ isActive }) =>
                "sidebar-link" +
                (isActive   ? " sidebar-link--active" : "") +
                (isLocked   ? " sidebar-link--locked" : "")
              }
            >
              <span className="sidebar-emoji">{item.emoji}</span>
              {!compact && (
                <>
                  <span className="sidebar-label">{item.label}</span>
                  {isLocked && <span className="sidebar-lock">🔒</span>}
                </>
              )}
            </NavLink>
          )
        })}

        {user && (
          <NavLink
            to="/saved-reports"
            title={compact ? "Saved Reports" : undefined}
            className={({ isActive }) =>
              "sidebar-link" + (isActive ? " sidebar-link--active" : "")
            }
          >
            <span className="sidebar-emoji">🔖</span>
            {!compact && <span className="sidebar-label">Saved Reports</span>}
          </NavLink>
        )}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        {user ? (
          <div className="sidebar-user">
            {!compact && (
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">
                  {user.user_metadata?.full_name || user.email}
                </div>
                <div className="sidebar-user-email">{user.email}</div>
              </div>
            )}
            <button
              className="sidebar-icon-btn sidebar-signout-btn"
              onClick={signOut}
              title="Sign out"
            >
              ↩
            </button>
          </div>
        ) : (
          !compact && (
            <div className="sidebar-auth-hint">Sign in for full access</div>
          )
        )}
      </div>

    </aside>
  )
}
