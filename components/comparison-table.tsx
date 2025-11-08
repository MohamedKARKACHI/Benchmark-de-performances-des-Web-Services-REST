interface ComparisonTableProps {
  variant: "C" | "D"
}

const endpointData = [
  {
    endpoint: "GET /categories?page=&size=",
    method: "GET",
    throughput: { C: 4200, D: 4100 },
    latencyP95: { C: 89, D: 95 },
    errors: { C: 0.01, D: 0.02 },
    allocation: { C: 12, D: 15 },
  },
  {
    endpoint: "GET /items?page=&size=",
    method: "GET",
    throughput: { C: 3800, D: 3650 },
    latencyP95: { C: 145, D: 168 },
    errors: { C: 0.03, D: 0.04 },
    allocation: { C: 18, D: 22 },
  },
  {
    endpoint: "GET /items?categoryId=",
    method: "GET",
    throughput: { C: 2900, D: 2750 },
    latencyP95: { C: 198, D: 234 },
    errors: { C: 0.02, D: 0.05 },
    allocation: { C: 25, D: 35 },
  },
  {
    endpoint: "POST /items",
    method: "POST",
    throughput: { C: 1200, D: 1100 },
    latencyP95: { C: 234, D: 289 },
    errors: { C: 0.05, D: 0.08 },
    allocation: { C: 45, D: 52 },
  },
  {
    endpoint: "PUT /items/{id}",
    method: "PUT",
    throughput: { C: 890, D: 820 },
    latencyP95: { C: 267, D: 312 },
    errors: { C: 0.04, D: 0.06 },
    allocation: { C: 42, D: 48 },
  },
]

export default function ComparisonTable({ variant }: ComparisonTableProps) {
  return (
    <div className="p-6 rounded-lg border border-(--color-border) bg-(--color-surface)">
      <h3 className="text-lg font-semibold text-(--color-text) mb-4">Endpoint Comparison</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-(--color-border)">
              <th className="text-left py-3 px-4 font-semibold text-(--color-text)">Endpoint</th>
              <th className="text-right py-3 px-4 font-semibold text-(--color-text-muted)">RPS (C/D)</th>
              <th className="text-right py-3 px-4 font-semibold text-(--color-text-muted)">p95 (C/D)</th>
              <th className="text-right py-3 px-4 font-semibold text-(--color-text-muted)">Errors (C/D)</th>
              <th className="text-right py-3 px-4 font-semibold text-(--color-text-muted)">Allocation (C/D)</th>
              <th className="text-right py-3 px-4 font-semibold text-(--color-text-muted)">Winner</th>
            </tr>
          </thead>
          <tbody>
            {endpointData.map((row) => {
              const cWins = row.throughput.C > row.throughput.D
              return (
                <tr
                  key={row.endpoint}
                  className="border-b border-(--color-border) hover:bg-(--color-background) transition-colors"
                >
                  <td className="py-3 px-4 font-medium text-(--color-text)">{row.endpoint}</td>
                  <td className="text-right py-3 px-4 text-(--color-text-muted)">
                    <span className={cWins ? "text-(--color-success)" : "text-(--color-text-muted)"}>
                      {row.throughput.C}
                    </span>
                    {" / "}
                    <span className={!cWins ? "text-(--color-success)" : "text-(--color-text-muted)"}>
                      {row.throughput.D}
                    </span>
                  </td>
                  <td className="text-right py-3 px-4 text-(--color-text-muted)">
                    <span
                      className={
                        row.latencyP95.C < row.latencyP95.D ? "text-(--color-success)" : "text-(--color-text-muted)"
                      }
                    >
                      {row.latencyP95.C}
                    </span>
                    {" / "}
                    <span
                      className={
                        row.latencyP95.D < row.latencyP95.C ? "text-(--color-success)" : "text-(--color-text-muted)"
                      }
                    >
                      {row.latencyP95.D}
                    </span>
                    {" ms"}
                  </td>
                  <td className="text-right py-3 px-4 text-(--color-text-muted)">
                    {row.errors.C.toFixed(2)}% / {row.errors.D.toFixed(2)}%
                  </td>
                  <td className="text-right py-3 px-4 text-(--color-text-muted)">
                    {row.allocation.C}MB / {row.allocation.D}MB
                  </td>
                  <td className="text-right py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded text-xs font-semibold ${
                        cWins
                          ? "bg-(--color-primary)/20 text-(--color-primary)"
                          : "bg-(--color-success)/20 text-(--color-success)"
                      }`}
                    >
                      {cWins ? "C" : "D"}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-4 rounded bg-(--color-background) border border-(--color-border)">
        <p className="text-xs text-(--color-text-muted)">
          Variant C (Spring MVC) shows consistent advantages in throughput, while Variant D (Spring Data REST) shows
          comparable latency at scale. Memory allocation difference is minimal (~2-7 MB per endpoint).
        </p>
      </div>
    </div>
  )
}
