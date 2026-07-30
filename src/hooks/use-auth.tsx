import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabase, isSupabaseConfigured } from "@/integrations/supabase/client";

/**
 * Opcionális Supabase session.
 * JWT admin auth mellett env nélkül is biztonságosan no-op.
 */
export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setSession(null);
      setLoading(false);
      return;
    }

    const client = getSupabase();
    if (!client) {
      setLoading(false);
      return;
    }

    const { data: sub } = client.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setLoading(false);
    });
    client.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return {
    session,
    user: session?.user ?? null,
    loading,
    accessToken: session?.access_token ?? null,
    signOut: async () => {
      const client = getSupabase();
      if (client) await client.auth.signOut();
    },
    supabaseReady: isSupabaseConfigured(),
  };
}
