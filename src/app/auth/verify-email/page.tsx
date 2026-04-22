"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { verifyEmailToken } from "@/services/auth/auth.service";
import { extractApiErrorMessage } from "@/lib/axios/extract-api-error-message";

type VerificationStatus = "loading" | "success" | "error";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<VerificationStatus>("loading");
  const [message, setMessage] = useState("Verificando tu cuenta...");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Falta el token de verificacion en el enlace.");
      return;
    }

    let isMounted = true;

    const run = async () => {
      try {
        const response = await verifyEmailToken(token);
        if (!isMounted) return;
        setStatus("success");
        setMessage(response.message ?? "Tu cuenta fue verificada correctamente.");
      } catch (error) {
        if (!isMounted) return;
        setMessage(
          extractApiErrorMessage(
            error,
            "No se pudo verificar tu cuenta. El enlace puede estar vencido o ser invalido."
          )
        );
        setStatus("error");
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#0b1230] text-white p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <section className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.18em] text-white/60">Verificacion de cuenta</p>
        <h1 className="mt-2 text-2xl font-black sm:text-3xl">
          {status === "loading" ? "Estamos validando tu enlace" : status === "success" ? "Cuenta verificada" : "No pudimos verificarla"}
        </h1>
        <p className="mt-4 text-white/85">{message}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/login"
            className="rounded-xl border border-white/20 px-4 py-2 text-sm font-bold text-white/90 hover:bg-white/10"
          >
            Ir a iniciar sesion
          </Link>
          <Link
            href="/register"
            className="rounded-xl border border-blue-300/40 bg-blue-500/20 px-4 py-2 text-sm font-bold text-blue-100 hover:bg-blue-500/30"
          >
            Volver al registro
          </Link>
        </div>
      </section>
    </main>
  );
}
