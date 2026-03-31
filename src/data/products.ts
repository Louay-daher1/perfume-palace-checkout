import perfume1 from "@/assets/perfume-1.jpg";
import perfume2 from "@/assets/perfume-2.jpg";
import perfume3 from "@/assets/perfume-3.jpg";
import perfume4 from "@/assets/perfume-4.jpg";
import perfume5 from "@/assets/perfume-5.jpg";
import perfume6 from "@/assets/perfume-6.jpg";

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  notes: { top: string[]; middle: string[]; base: string[] };
  image: string;
  prices: { size: string; price: number }[];
  category: string;
}

export const products: Product[] = [
  {
    id: "golden-oud",
    name: "Golden Oud",
    tagline: "A journey through ancient amber trails",
    description: "An opulent blend of rare oud wood and warm amber, enriched with saffron threads and velvety sandalwood. This masterpiece evokes the grandeur of Arabian palaces.",
    notes: { top: ["Saffron", "Bergamot"], middle: ["Oud Wood", "Rose"], base: ["Amber", "Sandalwood"] },
    image: perfume1,
    prices: [{ size: "50ml", price: 85 }, { size: "100ml", price: 140 }],
    category: "Oriental",
  },
  {
    id: "rose-velvet",
    name: "Rose Velvet",
    tagline: "Soft petals on silk",
    description: "A romantic symphony of Bulgarian rose and peony, wrapped in a soft musky veil. Elegant, feminine, and timeless — like a love letter sealed in silk.",
    notes: { top: ["Pink Pepper", "Lychee"], middle: ["Bulgarian Rose", "Peony"], base: ["Musk", "Cashmere Wood"] },
    image: perfume2,
    prices: [{ size: "50ml", price: 75 }, { size: "100ml", price: 120 }],
    category: "Floral",
  },
  {
    id: "midnight-sapphire",
    name: "Midnight Sapphire",
    tagline: "The mystery of midnight skies",
    description: "A bold, magnetic fragrance that captures the essence of a starlit night. Deep blue iris meets smoky incense, creating an unforgettable trail of sophistication.",
    notes: { top: ["Black Pepper", "Cardamom"], middle: ["Iris", "Incense"], base: ["Leather", "Vetiver"] },
    image: perfume3,
    prices: [{ size: "50ml", price: 95 }, { size: "100ml", price: 155 }],
    category: "Woody",
  },
  {
    id: "royal-amber",
    name: "Royal Amber",
    tagline: "Crown jewel of fragrances",
    description: "A regal composition of precious amber resin, enriched with rare spices and golden honey. This luxurious elixir is fit for royalty, leaving a warm, enveloping trail.",
    notes: { top: ["Cinnamon", "Honey"], middle: ["Amber", "Frankincense"], base: ["Benzoin", "Tonka Bean"] },
    image: perfume4,
    prices: [{ size: "50ml", price: 110 }, { size: "100ml", price: 180 }],
    category: "Oriental",
  },
  {
    id: "fresh-citron",
    name: "Fresh Citron",
    tagline: "Morning dew on Mediterranean groves",
    description: "A vibrant burst of Italian citrus and green tea, balanced with white cedar and light musk. Refreshing, clean, and effortlessly modern.",
    notes: { top: ["Lemon", "Grapefruit"], middle: ["Green Tea", "Mint"], base: ["White Cedar", "Musk"] },
    image: perfume5,
    prices: [{ size: "50ml", price: 65 }, { size: "100ml", price: 105 }],
    category: "Fresh",
  },
  {
    id: "pearl-mist",
    name: "Pearl Mist",
    tagline: "Whispers of ocean breeze",
    description: "A delicate, luminous fragrance evoking the iridescence of pearls. Soft white florals dance with clean musks, creating an airy, ethereal presence.",
    notes: { top: ["Sea Salt", "Pear"], middle: ["White Lily", "Jasmine"], base: ["Vanilla", "White Musk"] },
    image: perfume6,
    prices: [{ size: "50ml", price: 70 }, { size: "100ml", price: 115 }],
    category: "Fresh",
  },
];
