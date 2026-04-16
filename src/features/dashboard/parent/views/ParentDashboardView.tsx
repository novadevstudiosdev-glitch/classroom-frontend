"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getParentProfile, type ParentProfile } from "@/services/parents/parents.service";
import { useAuthStore } from "@/store/auth/auth.store";

export default function ParentDashboardView() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const [profile, setProfile] = useState<ParentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
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

    load();
  }, []);

  const linkedStudents = useMemo(() => profile?.students ?? [], [profile]);

  const handleLogout = () => {
    logout();
    router.push("/login");
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
                Cerrar sesión
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
              Si recién creaste tu cuenta, verificá tu email y volvé a iniciar sesión.
            </p>
          </section>
        ) : null}

        {!isLoading && !error ? (
          <section className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-white/60">Alumnos vinculados</p>
              <p className="mt-2 text-4xl font-black">{linkedStudents.length}</p>
              <p className="mt-1 text-sm text-white/70">
                Esta cifra muestra vínculos confirmados disponibles para tu cuenta.
              </p>
            </article>

            <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-white/60">Acción recomendada</p>
              <p className="mt-2 text-sm text-white/80">
                Si no ves alumnos, revisá el email de confirmación de vinculación enviado durante el registro.
              </p>
            </article>

            <article className="sm:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-white/60">Detalle de vínculos</p>
              {linkedStudents.length === 0 ? (
                <p className="mt-3 text-sm text-white/70">Todavía no hay alumnos confirmados.</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {linkedStudents.map((student) => (
                    <li
                      key={student.id}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/85"
                    >
                      Alumno vinculado ID: {student.student_id}
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
