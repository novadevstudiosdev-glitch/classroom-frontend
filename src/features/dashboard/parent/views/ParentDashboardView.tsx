"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getParentProfile,
  linkChildByEmail,
  type ParentProfile,
} from "@/services/parents/parents.service";
import { useAuthStore } from "@/store/auth/auth.store";

export default function ParentDashboardView() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const [profile, setProfile] = useState<ParentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [childEmail, setChildEmail] = useState("");
  const [linkMessage, setLinkMessage] = useState<string | null>(null);
  const [isLinking, setIsLinking] = useState(false);

  const loadProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getParentProfile();
      setProfile(data);
    } catch {
      setError("No se pudo cargar tu dashboard de familia.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadProfile();
  }, []);

  const linkedStudents = useMemo(() => profile?.children ?? [], [profile]);
  const confirmedStudents = useMemo(
    () => linkedStudents.filter((student) => student.status === "confirmed"),
    [linkedStudents]
  );

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleLinkChild = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLinkMessage(null);

    if (!childEmail.trim()) {
      setLinkMessage("Ingresa un email de alumno.");
      return;
    }

    setIsLinking(true);
    try {
      const response = await linkChildByEmail(childEmail);
      setLinkMessage(response.message ?? "Solicitud de vinculacion enviada.");
      setChildEmail("");
      await loadProfile();
    } catch (linkError) {
      if (linkError instanceof Error && linkError.message) {
        setLinkMessage(linkError.message);
      } else {
        setLinkMessage("No se pudo enviar la solicitud de vinculacion.");
      }
    } finally {
      setIsLinking(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0b1230] text-white p-4 sm:p-6 md:p-8">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">Dashboard de familia</p>
              <h1 className="mt-2 text-2xl font-black sm:text-3xl">
                {profile ? `${profile.first_name} ${profile.last_name}` : "Padre / Madre / Tutor"}
              </h1>
            </div>
            <div className="flex gap-2">
              <Link
                href="/"
                className="rounded-xl border border-white/20 px-4 py-2 text-sm font-bold text-white/90 hover:bg-white/10"
              >
                Inicio
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-xl border border-red-300/40 bg-red-500/20 px-4 py-2 text-sm font-bold text-red-100 hover:bg-red-500/30"
              >
                Cerrar sesion
              </button>
            </div>
          </div>
        </header>

        {isLoading ? (
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/80">
            Cargando datos de familia...
          </section>
        ) : null}

        {!isLoading && error ? (
          <section className="rounded-2xl border border-red-300/40 bg-red-500/10 p-6">
            <p className="font-semibold text-red-100">{error}</p>
            <p className="mt-2 text-sm text-red-100/80">
              Si recien creaste tu cuenta, verifica tu email y vuelve a iniciar sesion.
            </p>
          </section>
        ) : null}

        {!isLoading && !error ? (
          <section className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-white/60">Alumnos vinculados</p>
              <p className="mt-2 text-4xl font-black">{confirmedStudents.length}</p>
              <p className="mt-1 text-sm text-white/70">
                Esta cifra muestra vinculos confirmados disponibles para tu cuenta.
              </p>
            </article>

            <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-white/60">Accion recomendada</p>
              <p className="mt-2 text-sm text-white/80">
                Si no ves alumnos, envia una solicitud ingresando su email.
              </p>
              <form onSubmit={handleLinkChild} className="mt-4 space-y-3">
                <input
                  type="email"
                  value={childEmail}
                  onChange={(event) => setChildEmail(event.target.value)}
                  placeholder="alumno@email.com"
                  className="w-full rounded-xl border border-white/20 bg-black/10 px-3 py-2 text-sm text-white placeholder:text-white/50 outline-none focus:border-blue-300/60"
                />
                <button
                  type="submit"
                  disabled={isLinking}
                  className="rounded-xl border border-blue-300/40 bg-blue-500/20 px-4 py-2 text-sm font-bold text-blue-100 hover:bg-blue-500/30 disabled:opacity-70"
                >
                  {isLinking ? "Enviando..." : "Vincular alumno"}
                </button>
              </form>
              {linkMessage ? <p className="mt-3 text-sm text-white/80">{linkMessage}</p> : null}
            </article>

            <article className="sm:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-white/60">Detalle de vinculos</p>
              {linkedStudents.length === 0 ? (
                <p className="mt-3 text-sm text-white/70">Todavia no hay solicitudes ni vinculos.</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {linkedStudents.map((student) => (
                    <li
                      key={student.id}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/85"
                    >
                      Alumno ID: {student.student_id} | Estado: {student.status}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </section>
        ) : null}
      </div>
    </main>
  );
}