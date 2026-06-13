import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register | Odios" },
      { name: "description", content: "Create your Odios racing profile." },
    ],
  }),
  component: RegisterPage,
});

const schema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(32, "Username must be 32 characters or fewer")
    .regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers, and underscores only"),
  email: z.string().trim().email("Enter a valid email").max(255),
  mobile_number: z
    .string()
    .trim()
    .min(7, "Enter a valid mobile number")
    .max(20)
    .regex(/^\+?[0-9\s\-()]+$/, "Digits, spaces, +, -, () only"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password too long"),
});

type FormState = z.infer<typeof schema>;

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    username: "",
    email: "",
    mobile_number: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof FormState, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormState;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
          emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
          data: {
            username: parsed.data.username,
            mobile_number: parsed.data.mobile_number,
            email: parsed.data.email,
          },
        },
      });
      if (error) {
        setServerError(error.message);
        return;
      }
      setSuccess(true);
      if (data.session) {
        setTimeout(() => navigate({ to: "/" }), 800);
      }
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white antialiased">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-10">
        <header className="mb-10">
          <Link
            to="/"
            className="text-xs uppercase tracking-[0.3em] text-white/60 transition hover:text-white"
          >
            ← Odios
          </Link>
          <h1 className="mt-8 text-3xl font-semibold tracking-tight sm:text-4xl">
            Create your profile
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-white/60">
            Start at Level 1. Earn XP every lap. Climb the leaderboard.
          </p>
        </header>

        {success ? (
          <div className="rounded-lg border border-white/15 bg-white/5 p-6">
            <h2 className="text-lg font-semibold">Check your email</h2>
            <p className="mt-2 text-sm text-white/70">
              We sent a confirmation link to <span className="text-white">{form.email}</span>. Tap
              it to activate your Odios profile.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-1 flex-col gap-5" noValidate>
            <Field
              label="Username"
              name="username"
              autoComplete="username"
              value={form.username}
              onChange={(v) => update("username", v)}
              error={errors.username}
              placeholder="apex_runner"
            />
            <Field
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={form.email}
              onChange={(v) => update("email", v)}
              error={errors.email}
              placeholder="you@domain.com"
            />
            <Field
              label="Mobile number"
              name="mobile_number"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              value={form.mobile_number}
              onChange={(v) => update("mobile_number", v)}
              error={errors.mobile_number}
              placeholder="+1 555 123 4567"
            />
            <Field
              label="Password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={(v) => update("password", v)}
              error={errors.password}
              placeholder="At least 8 characters"
            />

            {serverError && (
              <p
                role="alert"
                className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200"
              >
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 inline-flex h-12 items-center justify-center rounded-md bg-white text-sm font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Creating…" : "Create profile"}
            </button>

            <p className="mt-auto pt-6 text-center text-xs text-white/50">
              By continuing you agree to the Odios terms and privacy policy.
            </p>
          </form>
        )}
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  autoComplete,
  inputMode,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <label htmlFor={name} className="block">
      <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">
        {label}
      </span>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={!!error}
        className="mt-2 h-12 w-full rounded-md border border-white/15 bg-white/[0.03] px-3 text-base text-white placeholder:text-white/30 transition focus:border-white focus:bg-white/[0.06] focus:outline-none aria-[invalid=true]:border-red-500/60"
      />
      {error && <span className="mt-1 block text-xs text-red-300">{error}</span>}
    </label>
  );
}
