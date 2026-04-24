// src/lib/config.js
// Application configuration from environment variables

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"

/**
 * Build a full API endpoint URL
 * @param {string} endpoint - Path like "/analyze/stream"
 * @returns {string} - Full URL like "http://localhost:8000/analyze/stream"
 */
export function buildApiUrl(endpoint) {
  return `${API_BASE_URL}${endpoint}`
}
