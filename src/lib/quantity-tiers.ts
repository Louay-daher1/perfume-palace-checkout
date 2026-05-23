import type { Product } from "@/types/product";

export interface BundleTierOption {
  quantity: number;
  title: string;
  savings: number;
  total: number;
  compareAt: number;
}

function applicableSavings(
  offers: NonNullable<Product["quantity_offers"]>,
  quantity: number,
): number {
  const tier = [...offers]
    .filter((o) => o.min_quantity <= quantity)
    .sort((a, b) => b.min_quantity - a.min_quantity)[0];

  return tier?.savings ?? 0;
}

/** Build bundle rows (qty 1 + each tier min_quantity) for display. */
export function buildBundleTierOptions(
  unitPrice: number,
  offers: Product["quantity_offers"],
): BundleTierOption[] {
  if (!offers?.length || unitPrice <= 0) {
    return [];
  }

  const quantities = new Set<number>([1]);
  for (const offer of offers) {
    if (offer.min_quantity >= 1) {
      quantities.add(offer.min_quantity);
    }
  }

  return [...quantities]
    .sort((a, b) => a - b)
    .map((quantity) => {
      const compareAt = Math.round(unitPrice * quantity * 100) / 100;
      const savings = Math.min(applicableSavings(offers, quantity), compareAt);
      const total = Math.round((compareAt - savings) * 100) / 100;
      const tierLabel = offers.find((o) => o.min_quantity === quantity)?.label;

      return {
        quantity,
        title: tierLabel?.trim() || `Buy ${quantity}`,
        savings: Math.round(savings * 100) / 100,
        total,
        compareAt,
      };
    });
}

export function filterBundleOptionsByStock(
  options: BundleTierOption[],
  maxQuantity: number | null,
): BundleTierOption[] {
  if (maxQuantity === null) {
    return options;
  }

  return options.filter((option) => option.quantity <= maxQuantity);
}
