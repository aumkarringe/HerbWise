// src/App.jsx
import { useState, useEffect } from "react"
import { Routes, Route, useNavigate, useLocation } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { ThemeProvider } from "./context/ThemeContext"
import AuthWall  from "./components/AuthWall"
import Sidebar   from "./components/Sidebar"
import { hasUsedFreeSearch } from "./hooks/useGuestLimit"
import LandingPage       from "./pages/LandingPage"
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
import ExercisePlanner  from "./pages/ExercisePlanner"
import SavedReports     from "./pages/SavedReports"

function AppInner() {
  const { user }          = useAuth()
  const location          = useLocation()
  const navigate          = useNavigate()
  const pathname = location.pathname
  const isLandingPage = pathname === "/"
  const isPublicPath = pathname === "/" || pathname === "/wellness-search"
  const [collapsed, setCollapsed]       = useState(false)
  const [showAuthWall, setShowAuthWall] = useState(false)

  useEffect(() => {
    if (!user && !isPublicPath) {
      setShowAuthWall(true)
    } else {
      setShowAuthWall(false)
    }
  }, [isPublicPath, user])

  const bg  = "#050e08"
  const txt = "#e8f5e8"

  return (
    <div className="app-shell" style={{ display: "flex", minHeight: "100vh", background: bg, color: txt, transition: "background 0.3s ease" }}>
      {showAuthWall && (
        <AuthWall onClose={() => { setShowAuthWall(false); navigate("/") }} />
      )}

      {!isLandingPage && (
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(p => !p)}
          user={user}
        />
      )}

      <main
        className={isLandingPage ? "app-main landing-main" : "app-main"}
        style={isLandingPage
          ? { flex: 1, background: bg, padding: "0", overflowX: "hidden", maxWidth: "100%" }
          : { flex: 1, overflowY: "auto", padding: "32px 28px", maxWidth: "100%", fontFamily: "'DM Sans', 'Outfit', system-ui, sans-serif", background: bg, color: txt }
        }
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/wellness-search"    element={<WellnessSearch />} />
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
          <Route path="/exercise-planner"   element={<ExercisePlanner />} />
          <Route path="/saved-reports"      element={<SavedReports />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </ThemeProvider>
  )
}
