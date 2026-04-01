"use client";

import { FormEvent, useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginWithEmail } from "@/services/auth/auth.service";
import { useAuthStore } from "@/store/auth/auth.store";

export const dynamic = "force-dynamic";

const LoginContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setSession = useAuthStore((state) => state.setSession);
  const refreshUser = useAuthStore((state) => state.refreshUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const redirectTo = useMemo(() => {
    const redirectParam = searchParams.get("redirect");
    return redirectParam && redirectParam.startsWith("/")
      ? redirectParam
      : "/dashboard/teacher";
  }, [searchParams]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Completa email y contraseña.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const tokens = await loginWithEmail({
        email: email.trim(),
        password,
      });

      if (!tokens.accessToken) {
        setErrorMessage("No se recibió access token del backend.");
        return;
      }

      setSession({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });

      // Traemos perfil para dejar el store listo antes de navegar.
      await refreshUser();

      router.push(redirectTo);
    } catch {
      setErrorMessage("Credenciales inválidas o servidor no disponible.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Iniciar sesión</h1>
        <p className="mb-6 text-sm text-gray-600">Ingresa con tu cuenta para continuar.</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-800 outline-none transition focus:border-[#1CB0F6]"
              placeholder="tu@email.com"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-gray-800 outline-none transition focus:border-[#1CB0F6]"
              placeholder="••••••••"
              disabled={isSubmitting}
            />
          </div>

          {errorMessage ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-[#1CB0F6] px-4 py-2 font-semibold text-white transition hover:bg-[#16a1df] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
};

const LoginPage = () => {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center px-6">
          <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-gray-600">Cargando...</p>
          </div>
        </main>
      }
    >
      <LoginContent />
    </Suspense>
  );
};

export default LoginPage;
