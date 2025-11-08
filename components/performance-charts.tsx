"use client"

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { useHistoricalMetrics } from "@/lib/api-client"

const chartData = [
  { time: "00:00", throughput: 7200, latency: 145, cpu: 35, memory: 420 },
  { time: "04:00", throughput: 7800, latency: 152, cpu: 38, memory: 450 },
  { time: "08:00", throughput: 8100, latency: 168, cpu: 42, memory: 480 },
  { time: "12:00", throughput: 8650, latency: 198, cpu: 48, memory: 520 },
  { time: "16:00", throughput: 8432, latency: 234, cpu: 45, memory: 512 },
]

interface PerformanceChartsProps {
  variant: "C" | "D"
  timeRange: string
}

export default function PerformanceCharts({ variant, timeRange }: PerformanceChartsProps) {
  const { data: historicalThroughput } = useHistoricalMetrics(variant, "rate(http_requests_total[1m])", timeRange)
  const { data: historicalLatency } = useHistoricalMetrics(
    variant,
    "histogram_quantile(0.95, http_request_duration_seconds_bucket)",
    timeRange,
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Throughput & Latency */}
      <div className="p-6 rounded-lg border border-(--color-border) bg-(--color-surface)">
        <h3 className="text-lg font-semibold text-(--color-text) mb-4">Throughput & Latency</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="time" stroke="var(--color-text-muted)" />
            <YAxis stroke="var(--color-text-muted)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "var(--color-text)" }}
            />
            <Legend />
            <Line type="monotone" dataKey="throughput" stroke="var(--color-primary)" strokeWidth={2} name="RPS" />
            <Line type="monotone" dataKey="latency" stroke="var(--color-warning)" strokeWidth={2} name="p95 (ms)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Resource Usage */}
      <div className="p-6 rounded-lg border border-(--color-border) bg-(--color-surface)">
        <h3 className="text-lg font-semibold text-(--color-text) mb-4">Resource Usage</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="time" stroke="var(--color-text-muted)" />
            <YAxis stroke="var(--color-text-muted)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "var(--color-text)" }}
            />
            <Legend />
            <Bar dataKey="cpu" fill="var(--color-primary)" name="CPU %" />
            <Bar dataKey="memory" fill="var(--color-success)" name="Memory (MB)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Request Distribution */}
      <div className="p-6 rounded-lg border border-(--color-border) bg-(--color-surface)">
        <h3 className="text-lg font-semibold text-(--color-text) mb-4">Request Types</h3>
        <div className="space-y-3">
          {[
            { label: "GET /items", value: 45, color: "bg-(--color-primary)" },
            { label: "GET /items?categoryId=", value: 30, color: "bg-(--color-success)" },
            { label: "POST /items", value: 15, color: "bg-(--color-warning)" },
            { label: "Other", value: 10, color: "bg-(--color-error)" },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-(--color-text-muted)">{item.label}</span>
                <span className="text-sm font-semibold text-(--color-text)">{item.value}%</span>
              </div>
              <div className="h-2 bg-(--color-border) rounded-full overflow-hidden">
                <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Endpoints Performance */}
      <div className="p-6 rounded-lg border border-(--color-border) bg-(--color-surface)">
        <h3 className="text-lg font-semibold text-(--color-text) mb-4">Top Endpoints</h3>
        <div className="space-y-3">
          {[
            { endpoint: "GET /items?page=&size=50", rps: 3200, latency: 145 },
            { endpoint: "GET /categories/{id}", rps: 2100, latency: 89 },
            { endpoint: "GET /items/{id}", rps: 1800, latency: 76 },
            { endpoint: "POST /items", rps: 890, latency: 234 },
          ].map((item) => (
            <div key={item.endpoint} className="flex items-center justify-between p-3 rounded bg-(--color-background)">
              <div>
                <p className="text-sm font-medium text-(--color-text) text-[rgba(83,26,26,1)]">{item.endpoint}</p>
                <p className="text-xs text-(--color-text-muted)">{item.rps} RPS</p>
              </div>
              <span className="px-3 py-1 rounded text-sm font-semibold text-(--color-text) bg-(--color-primary)/20">
                {item.latency}ms
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
