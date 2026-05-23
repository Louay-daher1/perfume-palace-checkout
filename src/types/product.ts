export interface ProductPrice {

  size: string;

  /** Original list price. */

  price: number;

  /** Sale price when a promotion applies; omit if not on sale. */

  sale_price?: number;

  /** `null` = stock not tracked (unlimited). */

  stock: number | null;

}



export interface VariantPrice {

  product_id: number;

  size: string;

  price: number;

  sale_price?: number;

  stock: number | null;

}



export interface ProductNotes {

  top: string[];

  middle: string[];

  base: string[];

}



export interface Product {

  product_id: number;

  slug: string;

  name: string;

  tagline: string;

  description: string;

  image: string;

  prices: ProductPrice[];

  category: string;

  notes?: ProductNotes;

  images?: { url: string; is_primary: boolean; sort_order: number }[];

  quantity_offers?: { min_quantity: number; savings: number; label: string }[];

  discount?: ProductDiscount | null;

}

export interface PaginatedProducts {
  data: Product[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
  };
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
}

export interface ProductDiscount {
  label: string;
  name: string;
  type: "percent" | "fixed_amount";
  percent: number | null;
  amount: number | null;
}



export interface Category {

  id: number;

  name: string;

  slug: string;

  image_url: string | null;

}



export interface Slide {

  id: number;

  title: string;

  description: string | null;

  image_url: string;

  route: string | null;

  button_text: string | null;

  show_logo: boolean;

  product_id: number | null;

  category_id: number | null;

}



export interface CartPreviewLine {

  product_id: number;

  product_name: string;

  size: string;

  quantity: number;

  unit_price: number;

  line_subtotal: number;

  quantity_tier_savings: number;

  line_total: number;

}



export interface CartPreview {

  subtotal: number;

  quantity_savings: number;

  discount_savings: number;

  total: number;

  discount_code: string | null;

  items: CartPreviewLine[];

  adjustments: { type: string; label: string; amount: number }[];

}



export interface OrderPayload {

  customer: {

    name: string;

    phone: string;

    address: string;

    city: string;

    notes?: string;

  };

  payment_method: "cod";

  items: { product_id: number; size: string; quantity: number }[];

  discount_code?: string;

}



export interface OrderResponse {

  order_number: string;

  status: string;

  payment_method: string;

  subtotal: number;

  quantity_savings: number;

  discount_savings: number;

  total: number;

  discount_code: string | null;

  items: { product_name: string; size: string; quantity: number; unit_price: number; line_total: number }[];

  adjustments: { type: string; label: string; amount: number }[];

}

