import "server-only";

import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { randomUUID } from "node:crypto";

import bcrypt from "bcryptjs";

import type { CartItem } from "@/lib/cart-types";
import type { User } from "@/lib/types";
import { toPublicUser } from "./session-token";

export interface PartnerStoredUser {
  id: string;
  email: string;
  role: "user";
  passwordHash: string;
}

interface PartnerStoreData {
  users: PartnerStoredUser[];
  carts: Record<string, CartItem[]>;
}

function storePath(): string {
  if (process.env.PARTNER_STORE_PATH) {
    return resolve(process.env.PARTNER_STORE_PATH);
  }
  const productsPath = process.env.PRODUCTS_DB_PATH;
  if (productsPath) {
    return resolve(dirname(resolve(productsPath)), "partner_store.json");
  }
  return resolve(process.cwd(), "private_data", "partner_store.json");
}

function emptyStore(): PartnerStoreData {
  return { users: [], carts: {} };
}

function loadStore(): PartnerStoreData {
  const path = storePath();
  try {
    const raw = readFileSync(path, "utf-8");
    const parsed = JSON.parse(raw) as PartnerStoreData;
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      carts:
        parsed.carts && typeof parsed.carts === "object" && !Array.isArray(parsed.carts)
          ? parsed.carts
          : {},
    };
  } catch {
    return emptyStore();
  }
}

function persistStore(data: PartnerStoreData): void {
  const path = storePath();
  mkdirSync(dirname(path), { recursive: true });
  const tmp = `${path}.${process.pid}.tmp`;
  writeFileSync(tmp, JSON.stringify(data, null, 2), "utf-8");
  renameSync(tmp, path);
}

export function getPartnerByEmail(email: string): PartnerStoredUser | null {
  const normalized = email.trim().toLowerCase();
  return (
    loadStore().users.find((u) => u.email.trim().toLowerCase() === normalized) ??
    null
  );
}

export function getPartnerById(id: string): PartnerStoredUser | null {
  return loadStore().users.find((u) => u.id === id) ?? null;
}

export async function registerPartnerUser(
  email: string,
  password: string
): Promise<User | { error: string; status: number }> {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !normalized.includes("@")) {
    return { error: "Érvénytelen e-mail.", status: 400 };
  }
  if (!password || password.length < 8) {
    return { error: "A jelszó legalább 8 karakter legyen.", status: 400 };
  }
  if (getPartnerByEmail(normalized)) {
    return { error: "Ez az e-mail már regisztrálva van.", status: 409 };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user: PartnerStoredUser = {
    id: randomUUID(),
    email: normalized,
    role: "user",
    passwordHash,
  };

  const store = loadStore();
  store.users.push(user);
  persistStore(store);
  return toPublicUser(user);
}

export async function authenticatePartner(
  email: string,
  password: string
): Promise<User | null> {
  if (!email?.trim() || !password) return null;

  const record = getPartnerByEmail(email);
  if (!record?.passwordHash || record.role !== "user") {
    await bcrypt.compare(
      password,
      "$2b$10$UB6g93Lt4wqexGta/4r6S.NOyVe0BT9N1h6vTe085cXVy7exBVcAO"
    );
    return null;
  }

  const ok = await bcrypt.compare(password, record.passwordHash);
  if (!ok) return null;
  return toPublicUser({ ...record, role: "user" });
}

export function getPartnerCart(userId: string): CartItem[] {
  const cart = loadStore().carts[userId];
  return Array.isArray(cart) ? cart : [];
}

export function savePartnerCart(userId: string, items: CartItem[]): CartItem[] {
  if (!getPartnerById(userId)) {
    throw new Error("Partner not found");
  }
  const cleaned = items
    .filter(
      (i) =>
        typeof i.id === "number" &&
        typeof i.name === "string" &&
        typeof i.price === "number" &&
        typeof i.quantity === "number" &&
        i.quantity > 0
    )
    .slice(0, 100)
    .map((i) => ({
      id: i.id,
      name: String(i.name).slice(0, 200),
      price: Number(i.price),
      quantity: Math.min(999, Math.floor(i.quantity)),
    }));

  const store = loadStore();
  store.carts[userId] = cleaned;
  persistStore(store);
  return cleaned;
}
