"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup, type AuthState } from "@/app/actions/auth";
import { t } from "@/lib/strings";

export default function SignupPage() {
  const [state, action, pending] = useActionState<AuthState, FormData>(signup, {});

  return (
    <form action={action} className="space-y-4">
      <h2 className="text-lg font-semibold">{t.auth.signup}</h2>

      <Field label={t.auth.displayName} name="display_name" type="text" required={false} />
      <Field label={t.auth.email} name="email" type="email" autoComplete="email" />
      <Field
        label={t.auth.password}
        name="password"
        type="password"
        autoComplete="new-password"
      />

      {state.error && <p className="text-sm text-expense">{state.error}</p>}
      {state.message && <p className="text-sm text-income">{state.message}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-primary py-2 font-medium text-white disabled:opacity-60"
      >
        {pending ? t.common.loading : t.auth.signupCta}
      </button>

      <p className="text-center text-sm text-muted">
        {t.auth.haveAccount}{" "}
        <Link href="/login" className="text-primary hover:underline">
          {t.auth.login}
        </Link>
      </p>
    </form>
  );
}

function Field({
  label,
  required = true,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-muted">{label}</span>
      <input
        {...props}
        required={required}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-primary"
      />
    </label>
  );
}
