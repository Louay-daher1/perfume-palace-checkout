import { ApiError } from "@/lib/api";

export function formatApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiError) {
    const validation = error.validationErrors;
    if (validation) {
      const messages = Object.values(validation).flat();
      const stockMessage = messages.find((m) => /stock/i.test(m));
      if (stockMessage) {
        return stockMessage;
      }
      if (messages[0]) {
        return messages[0];
      }
    }

    if (error.status >= 500) {
      return fallback;
    }

    return error.message || fallback;
  }

  return fallback;
}
