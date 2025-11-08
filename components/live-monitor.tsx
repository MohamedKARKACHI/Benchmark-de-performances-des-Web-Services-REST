"use client"

import { useEffect, useState } from "react"
import { usePrometheusMetrics } from "@/lib/api-client"

interface LiveMonitorProps {
  variant: "C" | "D"
}

interface MetricValue {
  label: string
  value: number
  unit: string
  color: string
  trend?: "up" | "down" | "stable"
}

export default function LiveMonitor({ variant }: LiveMonitorProps) {
  const [metrics, setMetrics] = useState<MetricValue[]>([])
  const [isLive, setIsLive] = useState(true)

  // Fetch multiple metrics
  const { data: requestsPerSec } = usePrometheusMetrics(variant, "rate(http_requests_total[1m])")
  const { data: p95Latency } = usePrometheusMetrics(
    variant,
    "histogram_quantile(0.95, http_request_duration_seconds_bucket)",
  )
  const { data: errorRate } = usePrometheusMetrics(variant, "rate(http_requests_errors_total[1m])")
  const { data: gcTime } = usePrometheusMetrics(variant, "rate(jvm_gc_pause_seconds_sum[1m])")

  useEffect(() => {
    const newMetrics = [
      {
        label: "Requests/sec",
        value: Number.parseFloat(requestsPerSec?.[0]?.value?.[1] || "0"),
        unit: "RPS",
        color: "primary",
        trend: "up" as const,
      },
      {
        label: "p95 Latency",
        value: Number.parseFloat(p95Latency?.[0]?.value?.[1] || "0") * 1000,
        unit: "ms",
        color: "warning",
        trend: "stable" as const,
      },
      {
        label: "Error Rate",
        value: Number.parseFloat(errorRate?.[0]?.value?.[1] || "0") * 100,
        unit: "%",
        color: Number.parseFloat(errorRate?.[0]?.value?.[1] || "0") > 0.01 ? "error" : "success",
        trend: "down" as const,
      },
      {
        label: "GC Time",
        value: Number.parseFloat(gcTime?.[0]?.value?.[1] || "0") * 1000,
        unit: "ms/s",
        color: "info",
        trend: "stable" as const,
      },
    ]
    setMetrics(newMetrics)
  }, [requestsPerSec, p95Latency, errorRate, gcTime])

  return (
    <div className="p-6 rounded-lg border border-(--color-border) bg-(--color-surface)">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-(--color-text)">Real-time Monitor</h3>
          <p className="text-sm text-(--color-text-muted)">Variant {variant} - Live metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${isLive ? "bg-(--color-success) animate-pulse" : "bg-(--color-error)"}`}
          />
          <span className="text-sm font-medium text-(--color-text)">{isLive ? "Live" : "Offline"}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="p-4 rounded-lg bg-(--color-background) border border-(--color-border)">
            <p className="text-xs text-(--color-text-muted) mb-2">{metric.label}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-(--color-text)">{metric.value.toFixed(1)}</span>
              <span className="text-xs text-(--color-text-muted)">{metric.unit}</span>
            </div>
            <div className="mt-2 flex items-center gap-1">
              <span
                className={`text-xs font-semibold ${
                  metric.color === "success"
                    ? "text-(--color-success)"
                    : metric.color === "error"
                      ? "text-(--color-error)"
                      : metric.color === "warning"
                        ? "text-(--color-warning)"
                        : "text-(--color-primary)"
                }`}
              >
                {metric.trend === "up" ? "↑" : metric.trend === "down" ? "↓" : "→"}
              </span>
              <span className="text-xs text-(--color-text-muted)">{metric.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-2">
        <h4 className="text-sm font-semibold text-(--color-text)">Thread Pool Status</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded bg-(--color-background) border border-(--color-border)">
            <p className="text-xs text-(--color-text-muted)">Active Threads</p>
            <p className="text-lg font-bold text-(--color-text)">42/100</p>
            <div className="h-1 bg-(--color-border) rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-(--color-primary)" style={{ width: "42%" }} />
            </div>
          </div>
          <div className="p-3 rounded bg-(--color-background) border border-(--color-border)">
            <p className="text-xs text-(--color-text-muted)">Queue Size</p>
            <p className="text-lg font-bold text-(--color-text)">3</p>
            <div className="h-1 bg-(--color-border) rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-(--color-success)" style={{ width: "3%" }} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 rounded bg-(--color-background) border border-(--color-border)">
        <h4 className="text-sm font-semibold text-(--color-text) mb-2">Connection Pool</h4>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <p className="text-(--color-text-muted)">Active</p>
            <p className="text-lg font-bold text-(--color-text)">12/20</p>
          </div>
          <div>
            <p className="text-(--color-text-muted)">Idle</p>
            <p className="text-lg font-bold text-(--color-text)">8</p>
          </div>
          <div>
            <p className="text-(--color-text-muted)">Wait Queue</p>
            <p className="text-lg font-bold text-(--color-text)">0</p>
          </div>
        </div>
      </div>
    </div>
  )
}
