import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";

export const requireSupabaseAuth = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const authHeader = getRequestHeader("authorization");
    if (!authHeader) throw new Error("Unauthorized: No authorization header provided");

    const url = process.env.ODIOS_SUPABASE_URL!;
    const anon = process.env.ODIOS_SUPABASE_ANON_KEY!;
    const supabase = createClient(url, anon, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw new Error("Unauthorized: invalid session");

    return next({ context: { supabase, userId: data.user.id, claims: data.user } });
  },
);
