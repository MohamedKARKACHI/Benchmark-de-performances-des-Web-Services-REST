// Client for fetching metrics from REST APIs and Prometheus
import useSWR from "swr"

const API_ENDPOINTS = {
  C: "http://localhost:8080",
  D: "http://localhost:8081",
}

const PROMETHEUS_URL = "http://localhost:9090"

const fetcher = (url: string) =>
  fetch(url)
    .then((r) => r.json())
    .catch(() => ({}))

export function useMetrics(variant: "C" | "D") {
  const baseUrl = API_ENDPOINTS[variant]

  const { data: health } = useSWR(`${baseUrl}/actuator/health`, fetcher)
  const { data: jvmMetrics } = useSWR(`${baseUrl}/actuator/prometheus`, fetcher)

  return {
    health: health?.status === "UP",
    metrics: jvmMetrics,
  }
}

export function usePrometheusMetrics(variant: "C" | "D", query: string) {
  const variantLabel = variant === "C" ? "mvc" : "rest"
  const prometheusQuery = encodeURIComponent(`${query}{service="${variantLabel}"}`)

  const { data, error, isLoading } = useSWR(`${PROMETHEUS_URL}/api/v1/query?query=${prometheusQuery}`, fetcher, {
    refreshInterval: 5000,
  })

  return {
    data: data?.data?.result || [],
    isLoading,
    error,
  }
}

// Fetch historical data for charts
export function useHistoricalMetrics(variant: "C" | "D", metric: string, timeRange: string) {
  const variantLabel = variant === "C" ? "mvc" : "rest"

  const timeRangeMap = {
    "15m": "15m",
    "1h": "1h",
    "6h": "6h",
    "24h": "24h",
  }

  const range = timeRangeMap[timeRange as keyof typeof timeRangeMap] || "1h"
  const prometheusQuery = encodeURIComponent(`${metric}{service="${variantLabel}"}[${range}]`)

  const { data, isLoading } = useSWR(
    `${PROMETHEUS_URL}/api/v1/query_range?query=${prometheusQuery}&step=300s`,
    fetcher,
    { refreshInterval: 10000 },
  )

  return {
    data: data?.data?.result || [],
    isLoading,
  }
}

// Fetch test results from dashboard API
export async function runLoadTest(variant: "C" | "D", scenario: string) {
  const response = await fetch("/api/tests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ variant, scenario }),
  })
  return response.json()
}

export async function getTestResults() {
  const response = await fetch("/api/tests/results")
  return response.json()
}
