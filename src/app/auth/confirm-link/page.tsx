"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { confirmParentLinkToken } from "@/services/auth/auth.service";
import { extractApiErrorMessage } from "@/lib/axios/extract-api-error-message";

type ConfirmStatus = "loading" | "success" | "error";

export default function ConfirmParentLinkPage() {
  const [status, setStatus] = useState<ConfirmStatus>("loading");
  const [message, setMessage] = useState("Estamos confirmando la vinculacion...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Falta el token de vinculacion en el enlace.");
      return;
    }

    let isMounted = true;

    const run = async () => {
      try {
        const response = await confirmParentLinkToken(token);
        if (!isMounted) return;
        setStatus("success");
        setMessage(response.message ?? "Vinculacion confirmada correctamente.");
      } catch (error) {
        if (!isMounted) return;
        setStatus("error");
        setMessage(
          extractApiErrorMessage(error, "No se pudo confirmar la vinculacion. El enlace puede estar vencido.")
        );
      }
    };

    void run();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#0b1230] text-white p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <section className="w-full max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.18em] text-white/60">Vinculacion familiar</p>
        <h1 className="mt-2 text-2xl font-black sm:text-3xl">
          {status === "loading" ? "Confirmando vinculacion" : status === "success" ? "Vinculacion confirmada" : "No se pudo confirmar"}
        </h1>
        <p className="mt-4 text-white/85">{message}</p>

        {status !== "success" ? (
          <ol className="mt-5 list-decimal pl-5 text-sm text-white/85 space-y-2">
            <li>Inicia sesion como alumno.</li>
            <li>Revisa solicitudes familiares en tu dashboard.</li>
            <li>Acepta la vinculacion manualmente.</li>
          </ol>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/login"
            className="rounded-xl border border-white/20 px-4 py-2 text-sm font-bold text-white/90 hover:bg-white/10"
          >
            Iniciar sesion
          </Link>
          <Link
            href="/register?mode=register&role=student"
            className="rounded-xl border border-blue-300/40 bg-blue-500/20 px-4 py-2 text-sm font-bold text-blue-100 hover:bg-blue-500/30"
          >
            Crear cuenta de alumno
          </Link>
        </div>
      </section>
    </main>
  );
}
