// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom"
import { useState } from "react"

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

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div style={styles.overlay} onClick={onToggle} />
      )}

      <aside style={{
        ...styles.sidebar,
        width: collapsed ? 64 : 260,
        minWidth: collapsed ? 64 : 260,
      }}>

        {/* Logo + toggle */}
        <div style={styles.logoRow}>
          {!collapsed && (
            <div style={styles.logo}>
              <span style={styles.logoEmoji}>🌿</span>
              <span style={styles.logoText}>Remedy</span>
            </div>
          )}
          <button style={styles.toggleBtn} onClick={onToggle}>
            {collapsed ? "→" : "←"}
          </button>
        </div>

        {/* Nav links */}
        <nav style={styles.nav}>
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              style={({ isActive }) => ({
                ...styles.navItem,
                background: isActive ? "#166534" : "transparent",
                color: isActive ? "#fff" : "#86efac",
                justifyContent: collapsed ? "center" : "flex-start",
              })}
              title={collapsed ? item.label : ""}
            >
              <span style={styles.navEmoji}>{item.emoji}</span>
              {!collapsed && (
                <span style={styles.navLabel}>{item.label}</span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div style={styles.footer}>
            <div style={styles.footerText}>
              Powered by Groq + Gemini
            </div>
            <div style={styles.footerSub}>
              5-Agent Validation Pipeline
            </div>
          </div>
        )}
      </aside>
    </>
  )
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    zIndex: 99,
    display: "none",
    "@media(maxWidth:768px)": { display: "block" }
  },
  sidebar: {
    height: "100vh",
    background: "#14532d",
    display: "flex",
    flexDirection: "column",
    position: "sticky",
    top: 0,
    overflowY: "auto",
    overflowX: "hidden",
    transition: "width 0.25s ease, min-width 0.25s ease",
    zIndex: 100,
    flexShrink: 0,
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 16px 12px",
    borderBottom: "1px solid #166534",
    minHeight: 64,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  logoEmoji: { fontSize: 24 },
  logoText: {
    fontSize: 22,
    fontWeight: 700,
    color: "#fff",
    letterSpacing: "-0.5px"
  },
  toggleBtn: {
    background: "#166534",
    border: "none",
    color: "#86efac",
    borderRadius: 8,
    width: 32,
    height: 32,
    cursor: "pointer",
    fontSize: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  nav: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "12px 8px",
    gap: 2,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 12px",
    borderRadius: 10,
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 500,
    transition: "all 0.15s ease",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
  navEmoji: { fontSize: 18, flexShrink: 0 },
  navLabel: { overflow: "hidden", textOverflow: "ellipsis" },
  footer: {
    padding: "16px",
    borderTop: "1px solid #166534",
  },
  footerText: {
    fontSize: 11,
    color: "#4ade80",
    fontWeight: 600,
  },
  footerSub: {
    fontSize: 10,
    color: "#166534",
    marginTop: 4,
  }
}