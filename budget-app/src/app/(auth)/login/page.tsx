"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, type AuthState } from "@/app/actions/auth";
import { t } from "@/lib/strings";

export default function LoginPage() {
  const [state, action, pending] = useActionState<AuthState, FormData>(login, {});

  return (
    <form action={action} className="space-y-4">
      <h2 className="text-lg font-semibold">{t.auth.login}</h2>

      <Field label={t.auth.email} name="email" type="email" autoComplete="email" />
      <Field
        label={t.auth.password}
        name="password"
        type="password"
        autoComplete="current-password"
      />

      {state.error && <p className="text-sm text-expense">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-primary py-2 font-medium text-white disabled:opacity-60"
      >
        {pending ? t.common.loading : t.auth.loginCta}
      </button>

      <p className="text-center text-sm text-muted">
        {t.auth.noAccount}{" "}
        <Link href="/signup" className="text-primary hover:underline">
          {t.auth.signup}
        </Link>
      </p>
    </form>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-muted">{label}</span>
      <input
        {...props}
        required
        className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-primary"
      />
    </label>
  );
}
