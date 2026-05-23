/** Parse numeric product id from route params. */
export function parseProductIdParam(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }

  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) {
    return undefined;
  }

  return id;
}
