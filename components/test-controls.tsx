"use client"

import { useState } from "react"
import { runLoadTest } from "@/lib/api-client"

interface TestControlsProps {
  variant: "C" | "D"
}

const scenarios = [
  { id: "read-heavy", name: "READ-heavy", description: "50% list, 20% by category, 20% related, 10% categories" },
  { id: "join-filter", name: "JOIN-filter", description: "70% filtered items, 30% single items" },
  { id: "mixed", name: "MIXED", description: "GET/POST/PUT/DELETE on items and categories" },
  { id: "heavy-body", name: "HEAVY-body", description: "POST/PUT with 5KB payloads" },
]

export default function TestControls({ variant }: TestControlsProps) {
  const [activeTest, setActiveTest] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState<any>(null)

  const handleRunTest = async (scenarioId: string) => {
    setActiveTest(scenarioId)
    setIsRunning(true)

    try {
      const result = await runLoadTest(variant, scenarioId)
      setTestResults(result)
    } catch (error) {
      console.error("Test failed:", error)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="p-6 rounded-lg border border-(--color-border) bg-(--color-surface)">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-(--color-text) mb-2">Load Test Scenarios</h3>
        <p className="text-sm text-(--color-text-muted)">Run JMeter benchmarks directly from this dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scenarios.map((scenario) => (
          <div
            key={scenario.id}
            className="p-4 rounded-lg border border-(--color-border) bg-(--color-background) hover:border-(--color-primary) transition-colors"
          >
            <h4 className="font-semibold text-(--color-text) mb-1 text-[rgba(97,28,28,1)]">{scenario.name}</h4>
            <p className="text-xs text-(--color-text-muted) mb-4">{scenario.description}</p>
            <button
              onClick={() => handleRunTest(scenario.id)}
              disabled={isRunning && activeTest === scenario.id}
              className={`w-full py-2 rounded font-semibold text-sm transition-colors ${
                isRunning && activeTest === scenario.id
                  ? "bg-(--color-warning) text-white cursor-wait"
                  : "bg-(--color-primary) text-white hover:bg-(--color-primary-hover)"
              }`}
            >
              {isRunning && activeTest === scenario.id ? "⏳ Running..." : "▶ Run Test"}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-lg bg-(--color-background) border border-(--color-border)">
        <p className="text-xs text-(--color-text-muted)">
          Tests will execute against Variant {variant} on port {variant === "C" ? "8080" : "8081"}. Results will be
          saved to InfluxDB and displayed in Grafana.
        </p>
        {testResults && (
          <div className="mt-4">
            <h4 className="font-semibold text-(--color-text) mb-1">Test Results</h4>
            <pre className="text-xs text-(--color-text-muted) bg-(--color-background) p-4 rounded">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
