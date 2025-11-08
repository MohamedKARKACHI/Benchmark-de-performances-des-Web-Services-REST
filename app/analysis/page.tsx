"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import VariantSelector from "@/components/variant-selector"
import AnalysisView from "@/components/analysis-view"
import ComparisonTable from "@/components/comparison-table"

export default function AnalysisPage() {
  const [selectedVariant, setSelectedVariant] = useState<"C" | "D">("C")

  return (
    <div className="flex min-h-screen bg-(--color-background)">
      <Navigation />

      <main className="flex-1">
        {/* Header */}
        <header className="border-b border-(--color-border) sticky top-0 z-40 bg-(--color-background)/95 backdrop-blur">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-(--color-text)">Analysis & Insights</h1>
              <p className="text-sm text-(--color-text-muted) mt-1">Deep dive into performance characteristics</p>
            </div>
            <VariantSelector selectedVariant={selectedVariant} onSelectVariant={setSelectedVariant} />
          </div>
        </header>

        {/* Content */}
        <div className="p-8 space-y-8">
          <AnalysisView variant={selectedVariant} />
          <ComparisonTable variant={selectedVariant} />
        </div>
      </main>
    </div>
  )
}
