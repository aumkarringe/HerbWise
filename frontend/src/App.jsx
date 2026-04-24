// src/App.jsx
import { useState, useEffect } from "react"
import { Routes, Route, useNavigate, useLocation } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"
import AuthWall  from "./components/AuthWall"
import Sidebar   from "./components/Sidebar"
import { hasUsedFreeSearch } from "./hooks/useGuestLimit"

import WellnessSearch   from "./pages/WellnessSearch"
import SymptomAnalyzer  from "./pages/SymptomAnalyzer"
import SafetyCheck      from "./pages/SafetyCheck"
import WellnessPlan     from "./pages/WellnessPlan"
import DosageCalculator from "./pages/DosageCalculator"
import PreparationGuide from "./pages/PreparationGuide"
import SeasonalRemedies from "./pages/SeasonalRemedies"
import NaturalBeauty    from "./pages/NaturalBeauty"
import SleepOptimizer   from "./pages/SleepOptimizer"
import StressRelief     from "./pages/StressRelief"
import ImmunityBooster  from "./pages/ImmunityBooster"
import BreathingTest    from "./pages/BreathingTest"
import HomeRemediesPlus from "./pages/HomeRemediesPlus"
import ExercisePlanner  from "./pages/ExercisePlanner"
import SavedReports     from "./pages/SavedReports"

function AppInner() {
  const { user }          = useAuth()
  const location          = useLocation()
  const [collapsed, setCollapsed]       = useState(false)
  const [showAuthWall, setShowAuthWall] = useState(false)
  const [guestUsedFreeSearch, setGuestUsedFreeSearch] = useState(false)

  // Check if guest has used their free search
  useEffect(() => {
    if (!user) {
      hasUsedFreeSearch().then(used => {
        setGuestUsedFreeSearch(used)
      })
    } else {
      setGuestUsedFreeSearch(false)
    }
  }, [user])

  // Show auth wall when guest tries to access non-wellness pages
  useEffect(() => {
    const isWellnessSearch = location.pathname === "/"
    if (!user && !isWellnessSearch) {
      setShowAuthWall(true)
    } else {
      setShowAuthWall(false)
    }
  }, [location.pathname, user])

  return (
    <div className="app-shell" style={styles.app}>
      {showAuthWall && (
        <AuthWall />
      )}

      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(p => !p)}
        user={user}
      />

      <main className="app-main" style={styles.main}>
        <Routes>
          <Route path="/"                   element={<WellnessSearch />} />
          <Route path="/symptom-analyzer"   element={<SymptomAnalyzer />} />
          <Route path="/safety-check"       element={<SafetyCheck />} />
          <Route path="/wellness-plan"      element={<WellnessPlan />} />
          <Route path="/dosage-calculator"  element={<DosageCalculator />} />
          <Route path="/preparation-guide"  element={<PreparationGuide />} />
          <Route path="/seasonal-remedies"  element={<SeasonalRemedies />} />
          <Route path="/natural-beauty"     element={<NaturalBeauty />} />
          <Route path="/sleep-optimizer"    element={<SleepOptimizer />} />
          <Route path="/stress-relief"      element={<StressRelief />} />
          <Route path="/immunity-booster"   element={<ImmunityBooster />} />
          <Route path="/breathing-test"     element={<BreathingTest />} />
          <Route path="/home-remedies"      element={<HomeRemediesPlus />} />
          <Route path="/exercise-planner"   element={<ExercisePlanner />} />
          <Route path="/saved-reports"      element={<SavedReports />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}

const styles = {
  app: { display: "flex", minHeight: "100vh", background: "#f0fdf4" },
  main: {
    flex: 1, overflowY: "auto",
    padding: "40px 32px", maxWidth: "100%",
    fontFamily: "'Segoe UI', sans-serif"
  }
}