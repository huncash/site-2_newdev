import { useSyncExternalStore } from "react";
import type { Product } from "./types";
import type { CartItem } from "./cart-types";

export type { CartItem };

type Listener = () => void;

const STORAGE_KEY = "prepper_cart_v1";
const STORAGE_USER_KEY = "prepper_cart_user_id";

let state: CartItem[] = [];
let hydrated = false;
const listeners = new Set<Listener>();

function notify() {
  for (const l of listeners) l();
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): CartItem[] {
  return state;
}

function readLocal(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocal(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // quota / private mode
  }
}

function ensureHydrated() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  state = readLocal();
}

function setState(next: CartItem[]) {
  state = next;
  writeLocal(state);
  notify();
}

export function addItem(product: Pick<Product, "id" | "name" | "price">): void {
  ensureHydrated();
  const existing = state.find((i) => i.id === product.id);
  if (existing) {
    setState(
      state.map((i) =>
        i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  } else {
    setState([
      ...state,
      {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      },
    ]);
  }
}

export function removeItem(id: number): void {
  ensureHydrated();
  setState(state.filter((i) => i.id !== id));
}

export function getCartItems(): CartItem[] {
  ensureHydrated();
  return state;
}

export function clearCart(): void {
  ensureHydrated();
  setState([]);
}

export function replaceCart(items: CartItem[]): void {
  ensureHydrated();
  setState(Array.isArray(items) ? items : []);
}

export function mergeCart(items: CartItem[]): CartItem[] {
  ensureHydrated();
  const map = new Map<number, CartItem>();
  for (const item of state) map.set(item.id, { ...item });
  for (const item of items) {
    const prev = map.get(item.id);
    if (prev) {
      map.set(item.id, {
        ...prev,
        quantity: prev.quantity + item.quantity,
        price: item.price,
        name: item.name,
      });
    } else {
      map.set(item.id, { ...item });
    }
  }
  const merged = Array.from(map.values());
  setState(merged);
  return merged;
}

export function getCartUserId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_USER_KEY);
}

export function setCartUserId(userId: string | null): void {
  if (typeof window === "undefined") return;
  if (userId) localStorage.setItem(STORAGE_USER_KEY, userId);
  else localStorage.removeItem(STORAGE_USER_KEY);
}

export function useCartStore(): CartItem[] {
  ensureHydrated();
  return useSyncExternalStore(subscribe, getSnapshot, () => []);
}
