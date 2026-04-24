// src/hooks/useGuestLimit.js
import { supabase } from "../lib/supabase"

// Generate a simple browser fingerprint
function getFingerprint() {
  const key = "herbwise_guest"
  let fp = localStorage.getItem(key)
  if (!fp) {
    fp = `guest_${Date.now()}_${Math.random().toString(36).slice(2)}`
    localStorage.setItem(key, fp)
  }
  return fp
}

export async function hasUsedFreeSearch() {
  try {
    const fp = getFingerprint()
    const { data, error } = await supabase
      .from("guest_usage")
      .select("used")
      .eq("fingerprint", fp)
    
    if (error) {
      // Silently fail - don't expose Supabase error details
      return false
    }
    // Return true if at least one record exists with used=true
    return data?.length > 0 && data[0]?.used === true
  } catch (err) {
    // Silently fail - don't expose Supabase error details
    return false
  }
}

export async function markFreeSearchUsed() {
  try {
    const fp = getFingerprint()
    const { error } = await supabase
      .from("guest_usage")
      .upsert({ fingerprint: fp, used: true, used_at: new Date().toISOString() })
    
    if (error) {
      // Silently fail - don't expose Supabase error details
    }
  } catch (err) {
    // Silently fail - don't expose Supabase error details
  }
}