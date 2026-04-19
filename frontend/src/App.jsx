// src/App.jsx
import { useState } from "react"
import { Routes, Route } from "react-router-dom"
import Sidebar from "./components/SideBar"

// Pages
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

export default function App() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div style={styles.app}>

      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(p => !p)}
      />

      {/* Main content */}
      <main style={styles.main}>
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
        </Routes>
      </main>

    </div>
  )
}

const styles = {
  app: {
    display: "flex",
    minHeight: "100vh",
    background: "#f0fdf4",
  },
  main: {
    flex: 1,
    overflowY: "auto",
    padding: "40px 32px",
    maxWidth: "100%",
    fontFamily: "'Segoe UI', sans-serif",
  }
}