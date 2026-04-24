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
    background: "rgba(0,0,0,0.6)",
    display: "flex", alignItems: "center",
    justifyContent: "center", zIndex: 1000,
    backdropFilter: "blur(4px)"
  },
  modal: {
    background: "#fff", borderRadius: 20,
    padding: "36px 32px", width: "100%",
    maxWidth: 420, position: "relative",
    display: "flex", flexDirection: "column", gap: 14,
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)"
  },
  closeBtn: {
    position: "absolute", top: 16, right: 16,
    background: "none", border: "none",
    fontSize: 18, cursor: "pointer", color: "#9ca3af"
  },
  header: { textAlign: "center", marginBottom: 4 },
  logo: { fontSize: 40, marginBottom: 8 },
  title: { fontSize: 22, color: "#14532d", margin: "0 0 6px" },
  subtitle: { fontSize: 14, color: "#6b7280", margin: 0 },
  freeNotice: {
    background: "#fefce8", border: "1px solid #fde047",
    borderRadius: 10, padding: "10px 14px",
    fontSize: 13, color: "#854d0e",
    display: "flex", gap: 8, alignItems: "center"
  },
  freeIcon: { fontWeight: 700, color: "#16a34a" },
  input: {
    padding: "12px 14px", borderRadius: 10,
    border: "1.5px solid #e2e8f0", fontSize: 15,
    outline: "none", color: "#1e293b"
  },
  error: {
    background: "#fef2f2", borderRadius: 8,
    padding: "10px 14px", fontSize: 13, color: "#b91c1c"
  },
  success: {
    background: "#f0fdf4", borderRadius: 8,
    padding: "10px 14px", fontSize: 13, color: "#166534"
  },
  submitBtn: {
    background: "#16a34a", color: "#fff",
    border: "none", borderRadius: 10,
    padding: "13px", fontSize: 15,
    fontWeight: 600, cursor: "pointer"
  }
}