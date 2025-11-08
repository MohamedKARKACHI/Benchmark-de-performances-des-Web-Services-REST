"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"

interface Settings {
  autoRefresh: boolean
  refreshInterval: number
  alertsEnabled: boolean
  errorThreshold: number
  latencyThreshold: number
  theme: "dark" | "light"
  exportFormat: "csv" | "json"
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    autoRefresh: true,
    refreshInterval: 5,
    alertsEnabled: true,
    errorThreshold: 1.0,
    latencyThreshold: 500,
    theme: "dark",
    exportFormat: "csv",
  })

  const [saved, setSaved] = useState(false)

  const handleChange = (key: keyof Settings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const handleSave = () => {
    localStorage.setItem("benchmark-settings", JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex min-h-screen bg-(--color-background)">
      <Navigation />

      <main className="flex-1">
        {/* Header */}
        <header className="border-b border-(--color-border) sticky top-0 z-40 bg-(--color-background)/95 backdrop-blur">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-(--color-text)">Settings</h1>
              <p className="text-sm text-(--color-text-muted) mt-1">Configure dashboard preferences</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-2xl p-8 space-y-6">
          {/* Display Settings */}
          <div className="p-6 rounded-lg border border-(--color-border) bg-(--color-surface)">
            <h3 className="text-lg font-semibold text-(--color-text) mb-4">Display Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-(--color-text) mb-2">Theme</label>
                <select
                  value={settings.theme}
                  onChange={(e) => handleChange("theme", e.target.value)}
                  className="w-full px-3 py-2 rounded bg-(--color-background) border border-(--color-border) text-(--color-text) text-[rgba(87,21,21,1)]"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-(--color-text)">Auto Refresh</label>
                <input
                  type="checkbox"
                  checked={settings.autoRefresh}
                  onChange={(e) => handleChange("autoRefresh", e.target.checked)}
                  className="w-4 h-4 rounded"
                />
              </div>

              {settings.autoRefresh && (
                <div>
                  <label className="block text-sm font-medium text-(--color-text) mb-2">
                    Refresh Interval (seconds)
                  </label>
                  <input
                    type="number"
                    value={settings.refreshInterval}
                    onChange={(e) => handleChange("refreshInterval", Number.parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded bg-(--color-background) border border-(--color-border) text-(--color-text) text-[rgba(112,44,112,1)]"
                    min="1"
                    max="60"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Alert Thresholds */}
          <div className="p-6 rounded-lg border border-(--color-border) bg-(--color-surface)">
            <h3 className="text-lg font-semibold text-(--color-text) mb-4">Alert Thresholds</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-(--color-text)">Enable Alerts</label>
                <input
                  type="checkbox"
                  checked={settings.alertsEnabled}
                  onChange={(e) => handleChange("alertsEnabled", e.target.checked)}
                  className="w-4 h-4 rounded"
                />
              </div>

              {settings.alertsEnabled && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-(--color-text) mb-2">
                      Error Rate Threshold (%)
                    </label>
                    <input
                      type="number"
                      value={settings.errorThreshold}
                      onChange={(e) => handleChange("errorThreshold", Number.parseFloat(e.target.value))}
                      className="w-full px-3 py-2 rounded bg-(--color-background) border border-(--color-border) text-(--color-text) text-[rgba(100,27,27,1)]"
                      step="0.1"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-(--color-text) mb-2">Latency Threshold (ms)</label>
                    <input
                      type="number"
                      value={settings.latencyThreshold}
                      onChange={(e) => handleChange("latencyThreshold", Number.parseFloat(e.target.value))}
                      className="w-full px-3 py-2 rounded bg-(--color-background) border border-(--color-border) text-(--color-text) text-[rgba(90,31,31,1)]"
                      step="10"
                      min="100"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Export Settings */}
          <div className="p-6 rounded-lg border border-(--color-border) bg-(--color-surface)">
            <h3 className="text-lg font-semibold text-(--color-text) mb-4">Export Settings</h3>
            <div>
              <label className="block text-sm font-medium text-(--color-text) mb-2">Export Format</label>
              <select
                value={settings.exportFormat}
                onChange={(e) => handleChange("exportFormat", e.target.value)}
                className="w-full px-3 py-2 rounded bg-(--color-background) border border-(--color-border) text-(--color-text) text-[rgba(87,28,28,1)]"
              >
                <option value="csv">CSV</option>
                <option value="json">JSON</option>
              </select>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className={`w-full py-3 rounded-lg font-semibold transition-colors ${
              saved
                ? "bg-(--color-success) text-white"
                : "bg-(--color-primary) text-white hover:bg-(--color-primary-hover)"
            }`}
          >
            {saved ? "✓ Settings Saved" : "Save Settings"}
          </button>
        </div>
      </main>
    </div>
  )
}
