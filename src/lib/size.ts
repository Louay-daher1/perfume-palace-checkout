/** Display label for variant size (all sizes are in ml). */
export function formatSize(size: string): string {
  const trimmed = size.trim();
  if (!trimmed) {
    return trimmed;
  }

  const value = trimmed.replace(/\s*ml\s*$/i, "").trim();
  return `${value} ml`;
}
