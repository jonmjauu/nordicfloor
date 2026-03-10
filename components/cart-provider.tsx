"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export interface CartItem {
  productId: number;
  name: string;
  slug: string;
  pricePerSqm: number;
  packagePrice: number;
  image: string;
  sqmPerPackage: number;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "nordicfloor-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setItems(JSON.parse(raw));
      }
    } catch {
      // ignore corrupt local storage
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, loaded]);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((acc, item) => acc + item.packagePrice * item.quantity, 0);
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

    return {
      items,
      subtotal,
      totalItems,
      addItem: (item, quantity = 1) => {
        setItems((prev) => {
          const existing = prev.find((entry) => entry.productId === item.productId);
          if (existing) {
            return prev.map((entry) =>
              entry.productId === item.productId
                ? { ...entry, quantity: entry.quantity + quantity }
                : entry
            );
          }
          return [...prev, { ...item, quantity }];
        });
      },
      removeItem: (productId) => {
        setItems((prev) => prev.filter((item) => item.productId !== productId));
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          setItems((prev) => prev.filter((item) => item.productId !== productId));
          return;
        }
        setItems((prev) =>
          prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
        );
      },
      clearCart: () => setItems([])
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
