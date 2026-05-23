import type { BundleTierOption } from "@/lib/quantity-tiers";
import { cn } from "@/lib/utils";

interface BundleSaveSelectorProps {
  options: BundleTierOption[];
  selectedQuantity: number;
  onSelect: (quantity: number) => void;
  disabled?: boolean;
}

const BundleSaveSelector = ({
  options,
  selectedQuantity,
  onSelect,
  disabled = false,
}: BundleSaveSelectorProps) => {
  if (options.length <= 1) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="relative flex items-center justify-center mb-4">
        <hr className="absolute inset-x-0 top-1/2 border-border" />
        <span className="relative z-10 bg-background px-4 font-sans text-[11px] tracking-[0.25em] text-muted-foreground uppercase">
          Bundle &amp; Save
        </span>
      </div>

      <div className="space-y-2" role="radiogroup" aria-label="Bundle quantity">
        {options.map((option) => {
          const selected = selectedQuantity === option.quantity;
          const hasSavings = option.savings > 0;

          return (
            <button
              key={option.quantity}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={disabled}
              onClick={() => onSelect(option.quantity)}
              className={cn(
                "w-full flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                selected
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                  : "border-border bg-card hover:border-primary/40",
              )}
            >
              <span
                className={cn(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
                  selected ? "border-primary" : "border-muted-foreground/50",
                )}
                aria-hidden
              >
                {selected && <span className="h-2 w-2 rounded-full bg-primary" />}
              </span>

              <span className="flex-1 min-w-0">
                <span className="block font-sans text-sm font-semibold text-foreground">
                  {option.title}
                </span>
                <span className="block font-sans text-xs text-muted-foreground mt-0.5">
                  {hasSavings ? `You save $${option.savings.toFixed(2)}` : "You save $0"}
                </span>
              </span>

              <span className="shrink-0 text-right">
                <span className="block font-sans text-sm font-bold text-foreground">
                  ${option.total.toFixed(2)}
                </span>
                {hasSavings && (
                  <span className="block font-sans text-xs text-muted-foreground line-through">
                    ${option.compareAt.toFixed(2)}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BundleSaveSelector;
