"use client"

interface AnalysisViewProps {
  variant: "C" | "D"
}

const analysisData = {
  C: {
    title: "Spring MVC + @RestController",
    summary: "Manual routing provides consistent low-latency performance across all scenarios",
    strengths: [
      "Highest throughput in READ-heavy scenarios (+5-8% vs Data REST)",
      "Lowest p95 latency for complex queries (-12-15% vs Data REST)",
      "Minimal memory allocation per request (12-25 MB average)",
      "Predictable performance scaling with explicit caching strategies",
    ],
    weaknesses: [
      "Requires manual endpoint implementation for each query pattern",
      "More boilerplate code for relationship exposure",
      "N+1 query risk without explicit joins management",
      "Heavier to maintain as API complexity grows",
    ],
    recommendations: [
      "Use for high-throughput, read-heavy workloads",
      "Combine with query optimization and caching layers",
      "Implement explicit JOIN FETCH patterns for related entities",
      "Monitor and adjust pagination size based on response times",
    ],
    useCases: ["High-traffic APIs", "Performance-critical applications", "Complex filtering scenarios"],
  },
  D: {
    title: "Spring Data REST (Auto-exposed Repositories)",
    summary: "Automatic HAL format provides rapid development with acceptable performance",
    strengths: [
      "Fastest to implement - endpoints auto-generated from repositories",
      "Consistent HAL+JSON format reduces client-side parsing",
      "Built-in pagination, sorting, and filtering support",
      "Excellent for rapid prototyping and CRUD operations",
    ],
    weaknesses: [
      "5-12% lower throughput due to HAL serialization overhead",
      "Latency penalties for complex relationship queries (p95 +15-20%)",
      "Higher memory footprint with automatic relationship inclusion",
      "Limited control over query optimization",
    ],
    recommendations: [
      "Use for rapid development and internal APIs",
      "Apply projections to reduce payload size",
      "Disable eager loading of relationships in non-detail endpoints",
      "Consider migration to Variant C for production at scale",
    ],
    useCases: ["Rapid API development", "Internal/administrative APIs", "Prototyping"],
  },
}

export default function AnalysisView({ variant }: AnalysisViewProps) {
  const data = analysisData[variant]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-lg border border-(--color-border) bg-(--color-surface)">
        <h2 className="text-2xl font-bold text-(--color-text) mb-2">{data.title}</h2>
        <p className="text-sm text-(--color-text-muted)">{data.summary}</p>
      </div>

      {/* Two-column layout for strengths and weaknesses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="p-6 rounded-lg border border-(--color-border) bg-(--color-surface)">
          <h3 className="text-lg font-semibold text-(--color-success) mb-4">Strengths</h3>
          <ul className="space-y-3">
            {data.strengths.map((item, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="text-(--color-success) font-bold flex-shrink-0">+</span>
                <span className="text-sm text-(--color-text)">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="p-6 rounded-lg border border-(--color-border) bg-(--color-surface)">
          <h3 className="text-lg font-semibold text-(--color-warning) mb-4">Weaknesses</h3>
          <ul className="space-y-3">
            {data.weaknesses.map((item, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="text-(--color-warning) font-bold flex-shrink-0">−</span>
                <span className="text-sm text-(--color-text)">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommendations */}
      <div className="p-6 rounded-lg border border-(--color-border) bg-(--color-surface)">
        <h3 className="text-lg font-semibold text-(--color-primary) mb-4">Recommendations</h3>
        <div className="space-y-2">
          {data.recommendations.map((item, idx) => (
            <div key={idx} className="flex gap-3 p-3 rounded bg-(--color-background)">
              <span className="text-(--color-primary) font-bold flex-shrink-0">{idx + 1}.</span>
              <span className="text-sm text-(--color-text) text-[rgba(163,58,58,1)]">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Use Cases */}
      <div className="p-6 rounded-lg border border-(--color-border) bg-(--color-surface)">
        <h3 className="text-lg font-semibold text-(--color-text) mb-4">Best Use Cases</h3>
        <div className="flex flex-wrap gap-2">
          {data.useCases.map((useCase) => (
            <span
              key={useCase}
              className="px-4 py-2 rounded-full bg-(--color-primary)/20 text-(--color-primary) text-sm font-medium"
            >
              {useCase}
            </span>
          ))}
        </div>
      </div>

      {/* Performance Matrix */}
      <div className="p-6 rounded-lg border border-(--color-border) bg-(--color-surface)">
        <h3 className="text-lg font-semibold text-(--color-text) mb-4">Performance Summary</h3>
        <div className="space-y-4">
          {[
            { metric: "Throughput", score: variant === "C" ? 9.2 : 8.5, description: "Higher is better" },
            { metric: "Latency", score: variant === "C" ? 9.1 : 7.8, description: "Higher is better (inverted)" },
            { metric: "Development Speed", score: variant === "C" ? 7.0 : 9.5, description: "Time to market" },
            { metric: "Memory Efficiency", score: variant === "C" ? 9.0 : 7.5, description: "Lower allocation" },
            { metric: "Scalability", score: variant === "C" ? 8.8 : 8.2, description: "Horizontal scale" },
          ].map((item) => (
            <div key={item.metric}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-(--color-text)">{item.metric}</span>
                <span className="text-sm text-(--color-text-muted)">{item.score.toFixed(1)}/10</span>
              </div>
              <div className="h-3 bg-(--color-border) rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.score > 8.5 ? "bg-(--color-success)" : item.score > 7.5 ? "bg-(--color-primary)" : "bg-(--color-warning)"}`}
                  style={{ width: `${(item.score / 10) * 100}%` }}
                />
              </div>
              <p className="text-xs text-(--color-text-muted) mt-1">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
