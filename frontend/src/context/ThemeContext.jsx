import { createContext, useContext, useEffect } from "react"

const ThemeCtx = createContext({ isDark: true })

export function ThemeProvider({ children }) {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark")
  }, [])

  return (
    <ThemeCtx.Provider value={{ isDark: true }}>
      {children}
    </ThemeCtx.Provider>
  )
}

export const useTheme = () => useContext(ThemeCtx)
