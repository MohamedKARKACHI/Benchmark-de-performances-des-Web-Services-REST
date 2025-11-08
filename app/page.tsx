"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import VariantSelector from "@/components/variant-selector"
import Dashboard from "@/components/dashboard"

export default function Home() {
  const [selectedVariant, setSelectedVariant] = useState<"C" | "D">("C")
  const [timeRange, setTimeRange] = useState("1h")

  return (
    <div className="flex min-h-screen bg-(--color-background)">
      <Navigation />

      <main className="flex-1">
        {/* Header */}
        <header className="border-b border-(--color-border) sticky top-0 z-40 bg-(--color-background)/95 backdrop-blur">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-(--color-text)">Performance Benchmark</h1>
              <p className="text-sm text-(--color-text-muted) mt-1">Compare REST API implementations</p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 rounded bg-(--color-surface) border border-(--color-border) text-(--color-text) text-sm hover:bg-(--color-surface-hover) transition-colors"
              >
                <option value="15m">Last 15 minutes</option>
                <option value="1h">Last 1 hour</option>
                <option value="6h">Last 6 hours</option>
                <option value="24h">Last 24 hours</option>
              </select>
              <VariantSelector selectedVariant={selectedVariant} onSelectVariant={setSelectedVariant} />
            </div>
          </div>
        </header>

        {/* Dashboard */}
        <div className="p-8">
          <Dashboard variant={selectedVariant} timeRange={timeRange} />
        </div>
      </main>
    </div>
  )
}
