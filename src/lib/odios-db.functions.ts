import { createServerFn } from "@tanstack/react-start";

export const pingOdiosDatabase = createServerFn({ method: "GET" }).handler(
  async () => {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    const tables = ["profiles", "tracks", "karts"] as const;
    const results: Record<string, { count: number | null; error: string | null }> =
      {};

    for (const table of tables) {
      const { count, error } = await supabaseAdmin
        .from(table)
        .select("*", { count: "exact", head: true });
      results[table] = {
        count: count ?? null,
        error: error ? error.message : null,
      };
    }

    return { ok: true, projectRef: "zymqgigftefjvzhdhqvh", results };
  },
);
