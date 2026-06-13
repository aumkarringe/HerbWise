import { useState } from "react"

export default function SearchBar({ onSearch, disabled }) {
  const [value, setValue] = useState("")

  function handleSubmit(e) {
    e.preventDefault()
    if (value.trim()) onSearch(value.trim())
  }

  return (
    <form className="searchbar-form" onSubmit={handleSubmit}>
      <input
        className="searchbar-input"
        type="text"
        placeholder='Enter a condition e.g. "headache", "insomnia", "anxiety"'
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={disabled}
      />
      <button className="searchbar-button" type="submit" disabled={disabled}>
        {disabled ? "Analyzing…" : "Analyze →"}
      </button>
    </form>
  )
}
