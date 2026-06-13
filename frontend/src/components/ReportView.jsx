import SleepReport           from "./reports/SleepReport"
import StressReport          from "./reports/StressReport"
import ImmunityReport        from "./reports/ImmunityReport"
import NaturalBeautyReport   from "./reports/NaturalBeautyReport"
import SeasonalReport        from "./reports/SeasonalReport"
import SymptomReport         from "./reports/SymptomReport"
import WellnessPlanReport    from "./reports/WellnessPlanReport"
import BreathingReport       from "./reports/BreathingReport"
import ExercisePlannerReport from "./reports/ExercisePlannerReport"
import SafetyCheckReport     from "./reports/SafetyCheckReport"
import DosageCalculatorReport from "./reports/DosageCalculatorReport"
import PreparationGuideReport from "./reports/PreparationGuideReport"
import DefaultReport         from "./reports/DefaultReport"

export default function ReportView({ report }) {
  if (!report) return null
  switch (report.feature_key) {
    case "sleep_optimizer":   return <SleepReport report={report} />
    case "stress_relief":     return <StressReport report={report} />
    case "immunity_booster":  return <ImmunityReport report={report} />
    case "natural_beauty":    return <NaturalBeautyReport report={report} />
    case "seasonal_remedies": return <SeasonalReport report={report} />
    case "symptom_analyzer":  return <SymptomReport report={report} />
    case "wellness_plan":     return <WellnessPlanReport report={report} />
    case "breathing_test":    return <BreathingReport report={report} />
    case "exercise_planner":  return <ExercisePlannerReport report={report} />
    case "safety_check":      return <SafetyCheckReport report={report} />
    case "dosage_calculator": return <DosageCalculatorReport report={report} />
    case "preparation_guide": return <PreparationGuideReport report={report} />
    default:                  return <DefaultReport report={report} />
  }
}
