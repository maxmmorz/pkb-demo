export type PaymentMethod = "kasi" | "apple" | "card" | "phone";

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  orderNumber: string;
  items: OrderItem[];
  total: number;
}

export interface SavedCard {
  id: string;
  last4: string;
  brand: "visa" | "mastercard" | "mir";
  expiry: string;
}

export interface CardInputState {
  number: string;
  expiry: string;
  cvc: string;
  currentField: "number" | "expiry" | "cvc";
}
