"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AUTH_TOKEN_STORAGE_KEY } from "../../../src/lib/api";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const oauthError = searchParams.get("error");

    if (oauthError) {
      setError(oauthError);
      return;
    }

    if (!token) {
      setError("Missing auth token in callback URL");
      return;
    }

    window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    router.replace("/discover");
  }, [router, searchParams]);

  return (
    <p className="text-slate-600">
      {error ? `Sign-in failed: ${error}` : "Signing you in…"}
    </p>
  );
}

export default function AuthCallbackPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-8">
      <Suspense fallback={<p className="text-slate-600">Signing you in…</p>}>
        <AuthCallbackContent />
      </Suspense>
    </main>
  );
}
