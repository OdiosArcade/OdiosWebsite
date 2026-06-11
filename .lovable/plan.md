## Goal

Connect this Lovable app to your existing Supabase project under the Odios org (`zymqgigftefjvzhdhqvh.supabase.co`) so the frontend and server functions can read/write your real `profiles`, `tracks`, and `karts` tables — without enabling Lovable Cloud (which would spin up a separate, empty Supabase project).

## Step 0 — Rotate the service role key (you do this)

The service role key you pasted is compromised. In the Supabase dashboard:
- Project Settings → API → **Reset `service_role` secret**
- Keep the new value handy for Step 2.

## Step 1 — Frontend Supabase client

Create `src/integrations/supabase/client.ts` exporting a browser Supabase client built with:
- URL: `https://zymqgigftefjvzhdhqvh.supabase.co`
- Anon key (the one you shared — safe in frontend)
- `persistSession: true`, `autoRefreshToken: true`, storage = `localStorage`

These two values go in `.env` as `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` so they're available at build time.

## Step 2 — Server-side admin client + secrets

- Store the **new** service role key and URL as runtime secrets via Lovable's secret tool: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`. (You'll type the service role into a secure form — not chat.)
- Create `src/integrations/supabase/client.server.ts` exporting `supabaseAdmin` (service role, bypasses RLS) — imported only inside `createServerFn` handlers via `await import(...)` so it never leaks to the client bundle.
- Create `src/integrations/supabase/auth-middleware.ts` with `requireSupabaseAuth` for user-scoped server functions (RLS applies as the signed-in user).
- Create `src/integrations/supabase/auth-attacher.ts` and register it in `src/start.ts` `functionMiddleware` so the browser auto-attaches the bearer token to server-fn calls.

## Step 3 — Verify the connection

Add a small server function `pingDatabase` that runs `select count(*) from profiles` (and `tracks`, `karts`) using the admin client, plus a temporary `/debug` route that calls it and renders the counts. This confirms:
- Credentials are valid
- The tables exist and are reachable
- RLS / grants are configured correctly on your side

Once confirmed, the debug route can stay or be removed.

## Step 4 — Decide what to build on top

After the connection works, we can talk about which tables to surface in the UI (karts listing? profile pages? track detail pages?). That's a follow-up — this plan stops at "app is connected and can query your three tables".

## Out of scope

- Migrating, mirroring, or modifying your existing schema. Your Supabase project remains the source of truth; this app is just a client.
- Enabling Lovable Cloud. We're intentionally bypassing it because you already have a Supabase project.
- Auth UI (sign-in pages). Can be added later once we know which auth providers you have enabled in the Odios project.

## Technical notes

- The TanStack Start template's standard Supabase integration assumes Lovable Cloud provisioned the project. We're manually replicating the same file layout (`client.ts`, `client.server.ts`, `auth-middleware.ts`, `auth-attacher.ts`) so all the existing patterns in the framework guidance work unchanged.
- `client.server.ts` will only be imported inside server-fn `.handler()` bodies via `await import(...)` to keep it out of the client bundle (TanStack's import-graph enforcement).
- All server-only env (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) is read via `process.env` **inside handler bodies**, never at module scope.
