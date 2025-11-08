import MetricsGrid from "./metrics-grid"
import PerformanceCharts from "./performance-charts"
import TestControls from "./test-controls"

interface DashboardProps {
  variant: "C" | "D"
  timeRange: string
}

export default function Dashboard({ variant, timeRange }: DashboardProps) {
  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <MetricsGrid variant={variant} timeRange={timeRange} />

      {/* Charts */}
      <PerformanceCharts variant={variant} timeRange={timeRange} />

      {/* Test Controls */}
      <TestControls variant={variant} />
    </div>
  )
}
