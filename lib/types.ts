export type ProductCategoryKey =
  | "premium"
  | "fiskebensmonster"
  | "stein-betong"
  | "tredesign"
  | "budsjettvennlig";

export type OrderStatus = "pending" | "paid" | "cancelled" | "refunded";

export interface ProductInput {
  name: string;
  slug: string;
  categoryId: number;
  description: string;
  price: number;
  dimensions: string;
  sqmPerPackage: number;
  stock: number;
  images: string[];
  featured: boolean;
  active: boolean;
}

export interface CheckoutCustomerInput {
  name: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
}

export interface CartCheckoutItem {
  productId: number;
  quantity: number;
}

export interface StatusHistoryItem {
  status: OrderStatus;
  at: string;
  note: string;
}
