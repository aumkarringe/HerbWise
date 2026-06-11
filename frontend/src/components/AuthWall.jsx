// src/components/AuthWall.jsx
import { useState } from "react"
import { useAuth } from "../context/AuthContext"

export default function AuthWall({ onClose }) {
  const { signInWithMagicLink } = useAuth()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  async function handleMagicLink() {
    if (!email) {
      setError("Please enter your email")
      return
    }
    setLoading(true)
    setError("")
    const { error } = await signInWithMagicLink(email)
    if (error) {
      setError(error.message)
    } else {
      setMessage("✓ Check your email for the sign-in link. It expires in 12 hours.")
      setEmail("")
    }
    setLoading(false)
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>

        {/* Close button */}
        {onClose && (
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        )}

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.logo}>🌿</div>
          <h2 style={styles.title}>Sign in to HerbWise</h2>
          <p style={styles.subtitle}>
            Enter your email to continue with unlimited access
          </p>
        </div>

        {/* Free tier notice */}
        <div style={styles.freeNotice}>
          <span style={styles.freeIcon}>✓</span>
          You've used your free Wellness Search.
          Sign in to continue with unlimited access.
        </div>

        {/* Email input */}
        <input
          style={styles.input}
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleMagicLink()}
        />

        {error && <div style={styles.error}>{error}</div>}
        {message && <div style={styles.success}>{message}</div>}

        <button
          style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
          onClick={handleMagicLink}
          disabled={loading}
        >
          {loading ? "Sending link..." : "Send Magic Link"}
        </button>

      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.75)",
    display: "flex", alignItems: "center",
    justifyContent: "center", zIndex: 1000,
    backdropFilter: "blur(8px)"
  },
  modal: {
    background: "rgba(10,26,14,0.95)", backdropFilter: "blur(20px)",
    border: "1px solid rgba(74,222,128,0.2)",
    borderRadius: 20, padding: "36px 32px", width: "100%",
    maxWidth: 420, position: "relative",
    display: "flex", flexDirection: "column", gap: 14,
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)"
  },
  closeBtn: {
    position: "absolute", top: 16, right: 16,
    background: "none", border: "none",
    fontSize: 18, cursor: "pointer", color: "rgba(232,245,232,0.4)"
  },
  header: { textAlign: "center", marginBottom: 4 },
  logo: { fontSize: 40, marginBottom: 8 },
  title: { fontSize: 22, color: "#f0faf0", margin: "0 0 6px", fontWeight: 700 },
  subtitle: { fontSize: 14, color: "rgba(232,245,232,0.55)", margin: 0 },
  freeNotice: {
    background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)",
    borderRadius: 10, padding: "10px 14px",
    fontSize: 13, color: "#fbbf24",
    display: "flex", gap: 8, alignItems: "center"
  },
  freeIcon: { fontWeight: 700, color: "#4ade80" },
  input: {
    padding: "12px 14px", borderRadius: 10,
    border: "1.5px solid rgba(74,222,128,0.3)", fontSize: 15,
    outline: "none", background: "rgba(5,14,8,0.8)", color: "#e8f5e8"
  },
  error: {
    background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)",
    borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#fca5a5"
  },
  success: {
    background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.25)",
    borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#4ade80"
  },
  submitBtn: {
    background: "#4ade80", color: "#050e08",
    border: "none", borderRadius: 10,
    padding: "13px", fontSize: 15,
    fontWeight: 700, cursor: "pointer"
  }
}