// src/components/SearchBar.jsx
import { useState } from "react"

export default function SearchBar({ onSearch, disabled }) {
  const [value, setValue] = useState("")

  function handleSubmit(e) {
    e.preventDefault()
    if (value.trim()) onSearch(value.trim())
  }

  return (
    <form className="searchbar-form" onSubmit={handleSubmit} style={styles.form}>
      <input
        className="searchbar-input"
        style={styles.input}
        type="text"
        placeholder='Enter a condition e.g. "headache", "insomnia", "anxiety"'
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={disabled}
      />
      <button className="searchbar-button" style={{
        ...styles.button,
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? "not-allowed" : "pointer"
      }} type="submit" disabled={disabled}>
        {disabled ? "Analyzing..." : "Analyze →"}
      </button>
    </form>
  )
}

const styles = {
  form: { display: "flex", gap: 12 },
  input: {
    flex: 1,
    padding: "14px 18px",
    fontSize: 16,
    borderRadius: 12,
    border: "1.5px solid rgba(74,222,128,0.3)",
    outline: "none",
    background: "rgba(10,26,14,0.8)",
    color: "#e8f5e8",
    backdropFilter: "blur(8px)",
  },
  button: {
    padding: "14px 28px",
    fontSize: 16,
    borderRadius: 12,
    border: "none",
    background: "#4ade80",
    color: "#050e08",
    fontWeight: 700,
    letterSpacing: "-0.2px",
  }
}