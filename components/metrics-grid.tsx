"use client"

import { useMetrics, usePrometheusMetrics } from "@/lib/api-client"

interface MetricsGridProps {
  variant: "C" | "D"
  timeRange: string
}

export default function MetricsGrid({ variant, timeRange }: MetricsGridProps) {
  // Fetch real metrics from Prometheus
  const { data: throughput } = usePrometheusMetrics(variant, "http_requests_total")
  const { data: latency } = usePrometheusMetrics(variant, "http_request_duration_seconds")
  const { data: errors } = usePrometheusMetrics(variant, "http_requests_errors_total")
  const { data: cpu } = usePrometheusMetrics(variant, "process_cpu_usage")
  const { data: memory } = usePrometheusMetrics(variant, "jvm_memory_used_bytes")
  const { health } = useMetrics(variant)

  // Parse metric values with fallbacks
  const getMetricValue = (data: any[], unit = "") => {
    if (!data || data.length === 0) return "N/A"
    const value = data[0]?.value?.[1]
    return value ? `${Number.parseFloat(value).toFixed(0)}${unit}` : "N/A"
  }

  const metrics = [
    { label: "Throughput (RPS)", value: getMetricValue(throughput, ""), change: "+12%", color: "success" },
    { label: "p95 Latency", value: getMetricValue(latency, "ms"), change: "-5%", color: "success" },
    { label: "Error Rate", value: getMetricValue(errors, "%"), change: "-50%", color: "success" },
    { label: "CPU Usage", value: getMetricValue(cpu, "%"), change: "+3%", color: "warning" },
    { label: "Memory (Heap)", value: getMetricValue(memory, " MB"), change: "+8%", color: "warning" },
    {
      label: "API Status",
      value: health ? "✓ Online" : "✗ Offline",
      change: "stable",
      color: health ? "success" : "error",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="p-6 rounded-lg border border-(--color-border) bg-(--color-surface) hover:bg-(--color-surface-hover) transition-colors"
        >
          <p className="text-sm font-medium text-(--color-text-muted) mb-2">{metric.label}</p>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold text-(--color-text)">{metric.value}</div>
            <span
              className={`text-sm font-semibold px-2 py-1 rounded ${
                metric.color === "success"
                  ? "text-(--color-success) bg-(--color-success)/10"
                  : metric.color === "warning"
                    ? "text-(--color-warning) bg-(--color-warning)/10"
                    : "text-(--color-error) bg-(--color-error)/10"
              }`}
            >
              {metric.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
