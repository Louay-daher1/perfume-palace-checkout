import { formatSize } from "@/lib/size";

const RAW_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER ?? "";

/** International digits only (e.g. 96170123456). */
export function getWhatsAppPhone(): string | null {
  const digits = RAW_NUMBER.replace(/\D/g, "");
  return digits.length >= 8 ? digits : null;
}

export interface WhatsAppProductOrder {
  productName: string;
  productId: number;
  size: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productUrl?: string;
}

export function buildProductOrderMessage(order: WhatsAppProductOrder): string {
  const lines = [
    "Hello! I would like to order:",
    "",
    `Product: ${order.productName}`,
    `Size: ${formatSize(order.size)}`,
    `Quantity: ${order.quantity}`,
    `Unit price: $${order.unitPrice.toFixed(2)}`,
    `Total: $${order.totalPrice.toFixed(2)}`,
  ];

  if (order.productUrl) {
    lines.push("", `Link: ${order.productUrl}`);
  }

  return lines.join("\n");
}

export function openWhatsAppChat(message: string): boolean {
  const phone = getWhatsAppPhone();
  if (!phone) {
    return false;
  }

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
  return true;
}
