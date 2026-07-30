import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

export function isSupabaseConfigured(): boolean {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    "";
  return Boolean(url && key);
}

function createSupabaseClient(): SupabaseClient<Database> {
  const SUPABASE_URL =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const SUPABASE_PUBLISHABLE_KEY =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    "";

  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    throw new Error(
      "Missing Supabase env: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    );
  }

  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

let _supabase: SupabaseClient<Database> | undefined;

/** Valódi kliens, vagy `null` ha nincs Supabase env (JWT admin mód). */
export function getSupabase(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured()) return null;
  if (!_supabase) _supabase = createSupabaseClient();
  return _supabase;
}

/**
 * Lazy proxy — csak konfigurált env mellett inicializál.
 * Konfigurálatlanul a property-hozzáférés hibát dob; használd inkább a `getSupabase()`-t.
 */
export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_, prop, receiver) {
    const client = getSupabase();
    if (!client) {
      throw new Error(
        "Supabase nincs konfigurálva (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY). " +
          "Az ügyvezetői JWT admin Supabase nélkül is működik — opcionális mentéshez állítsd be az env-et.",
      );
    }
    return Reflect.get(client, prop, receiver);
  },
});
