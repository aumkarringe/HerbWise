// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get current session on load
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setUser(session?.user ?? null)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Failed to get Supabase session:", error)
        setLoading(false)
      })

    // Listen for auth changes
    let subscription
    try {
      const { data } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setUser(session?.user ?? null)
        }
      )
      subscription = data?.subscription
    } catch (error) {
      console.error("Failed to set up auth listener:", error)
    }

    return () => {
      subscription?.unsubscribe?.()
    }
  }, [])

  // Magic link sign in
  async function signInWithMagicLink(email) {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin
      }
    })
    return { error }
  }

  // Sign out
  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signInWithMagicLink,
      signOut
    }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)