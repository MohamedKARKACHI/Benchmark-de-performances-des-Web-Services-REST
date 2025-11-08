import Link from "next/link"

export default function Navigation() {
  const navItems = [
    { icon: "📊", label: "Dashboard", href: "/", active: true },
    { icon: "📈", label: "Analysis", href: "/analysis", active: false },
    { icon: "⚙️", label: "Settings", href: "/settings", active: false },
  ]

  return (
    <aside className="w-64 border-r border-(--color-border) bg-(--color-surface) h-screen sticky top-0">
      <div className="p-6 border-b border-(--color-border)">
        <h2 className="text-lg font-bold text-(--color-text)">Benchmark</h2>
        <p className="text-xs text-(--color-text-muted) mt-1">REST API Performance</p>
      </div>

      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <Link href={item.href} key={item.label}>
            <button
              className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-3 ${
                item.active
                  ? "bg-(--color-primary) text-white"
                  : "text-(--color-text-muted) hover:bg-(--color-surface-hover) hover:text-(--color-text)"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-(--color-border) bg-(--color-background)">
        <div className="p-4 rounded-lg bg-(--color-surface) border border-(--color-border)">
          <p className="text-xs font-semibold text-(--color-text) mb-2">Status</p>
          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-(--color-text-muted)">API C</span>
              <span className="inline-flex items-center gap-1 text-(--color-success)">● Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-(--color-text-muted)">API D</span>
              <span className="inline-flex items-center gap-1 text-(--color-success)">● Online</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
