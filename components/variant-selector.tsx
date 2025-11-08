"use client"

interface VariantSelectorProps {
  selectedVariant: "C" | "D"
  onSelectVariant: (variant: "C" | "D") => void
}

export default function VariantSelector({ selectedVariant, onSelectVariant }: VariantSelectorProps) {
  return (
    <div className="inline-flex gap-1 p-1 rounded-lg bg-(--color-surface) border border-(--color-border)">
      {(["C", "D"] as const).map((variant) => (
        <button
          key={variant}
          onClick={() => onSelectVariant(variant)}
          className={`px-4 py-2 rounded font-semibold text-sm transition-colors ${
            selectedVariant === variant
              ? "bg-(--color-primary) text-white"
              : "text-(--color-text-muted) hover:text-(--color-text)"
          }`}
        >
          Variant {variant}
          {variant === "C" && " (MVC)"}
          {variant === "D" && " (Data REST)"}
        </button>
      ))}
    </div>
  )
}
