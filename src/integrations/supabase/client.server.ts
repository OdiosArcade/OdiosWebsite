import { createClient } from "@supabase/supabase-js";

const url = process.env.ODIOS_SUPABASE_URL;
const serviceRoleKey = process.env.ODIOS_SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  throw new Error("Missing ODIOS_SUPABASE_URL or ODIOS_SUPABASE_SERVICE_ROLE_KEY env vars");
}

export const supabaseAdmin = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
