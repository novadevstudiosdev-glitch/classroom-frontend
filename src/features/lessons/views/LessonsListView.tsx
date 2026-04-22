"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  TeacherDashboardBottomNavigation,
  TeacherDashboardTopbar,
} from "@/features/dashboard/teacher/components";
import { AuthBackgroundCanvas } from "@/features/auth/components/AuthBackgroundCanvas";
import { LESSONS_MOCK } from "../data";

const LESSONS_PER_PAGE = 15;
const LESSON_CARD_TONES = [
  "from-sky-500/25 to-cyan-500/25",
  "from-emerald-500/25 to-teal-500/25",
  "from-violet-500/25 to-indigo-500/25",
  "from-fuchsia-500/25 to-pink-500/25",
  "from-amber-500/25 to-orange-500/25",
  "from-rose-500/25 to-red-500/25",
];

const LessonsListView = () => {
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(LESSONS_MOCK.length / LESSONS_PER_PAGE));
  const effectivePage = Math.min(page, totalPages - 1);
  const lessonsPage = useMemo(
    () =>
      LESSONS_MOCK.slice(
        effectivePage * LESSONS_PER_PAGE,
        effectivePage * LESSONS_PER_PAGE + LESSONS_PER_PAGE,
      ),
    [effectivePage],
  );
  const bottomNavigationItems = [
    { id: "home", icon: "🏠", label: "Inicio", href: "/dashboard/teacher" },
    { id: "lessons", icon: "📚", label: "Lecciones", isActive: true, href: "/lessons" },
    { id: "builder", icon: "🧩", label: "Builder", href: "/lesson-builder" },
  ];

  return (
    <main className="relative min-h-screen">
      <div className="fixed inset-0 z-0">
        <AuthBackgroundCanvas />
      </div>

      <div className="landing-module-shell relative z-10 pb-24">
        <TeacherDashboardTopbar />

        <div className="px-6 py-8">
          <div className="landing-module-content space-y-6">

          {/* ----------- titulo de sccione ------------ */}
          <section className="cosmic-hero">
            <div className="cosmic-hero-content">
              <span className="cosmic-badge">
                <span className="cosmic-badge-dot" />
                Modo exploracion
              </span>
              <div className="grid items-center gap-2 lg:grid-cols-[auto_1fr]">
                <h1 className="cosmic-title">Lecciones</h1>
                <div className="hidden justify-self-center lg:flex lg:translate-x-12 xl:translate-x-16 flex-nowrap items-center gap-2 sm:gap-3 whitespace-nowrap">
                  <h2 className="inline text-4xl font-black leading-none sm:text-5xl">
                    <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-300 bg-clip-text text-transparent">
                      {LESSONS_MOCK.length}
                    </span>
                  </h2>
                  <h3 className="inline text-base font-black tracking-wide text-white/85 sm:text-lg">
                    lecciones en total
                  </h3>
                </div>
              {/* ----------- Bloque de lecciones ------------ */}
              </div>
              <p className="cosmic-subtitle">
                Elegi una mision y continua el recorrido de aprendizaje de tu aula.
              </p>
              <div className="mt-2 flex flex-nowrap items-center gap-2 whitespace-nowrap lg:hidden">
                <h2 className="inline text-3xl font-black leading-none">
                  <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-300 bg-clip-text text-transparent">
                    {LESSONS_MOCK.length}
                  </span>
                </h2>
                <h3 className="inline text-sm font-black tracking-wide text-white/85">
                  Lecciones en total
                </h3>
              </div>
            </div>
          </section>

            <div className="mb-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(0, prev - 1))}
              disabled={effectivePage === 0}
              className="rounded-lg bg-white/10 px-2 py-1 text-xs text-white disabled:opacity-40"
            >
              ◀
            </button>
            <span className="text-xs font-bold text-white/70">
              {effectivePage + 1}/{totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(totalPages - 1, prev + 1))}
              disabled={effectivePage === totalPages - 1}
              className="rounded-lg bg-white/10 px-2 py-1 text-xs text-white disabled:opacity-40"
            >
              ▶
            </button>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {lessonsPage.map((lesson, index) => (
                <Link
                  key={lesson.id}
                  href={`/lessons/${lesson.id}`}
                  className={`block rounded-xl bg-gradient-to-br ${LESSON_CARD_TONES[(effectivePage * LESSONS_PER_PAGE + index) % LESSON_CARD_TONES.length]} p-2.5 shadow-[0_18px_40px_rgba(2,6,26,0.58)] transition hover:-translate-y-0.5 hover:shadow-[0_26px_52px_rgba(2,6,26,0.72)]`}
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-white/15 shadow-[0_8px_18px_rgba(2,6,26,0.5)]">
                      <Image
                        src={lesson.coverImage ?? "/NOVI.png"}
                        alt={lesson.subject ? `Icono de ${lesson.subject}` : "Icono de leccion"}
                        width={32}
                        height={32}
                        className="h-8 w-8 object-contain"
                      />
                    </div>
                    <span className="rounded-full bg-white/18 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white/90">
                      {lesson.subject ?? "General"}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-xs font-extrabold text-white">{lesson.title}</p>
                  <p className="mt-1 text-[11px] text-white/75">{lesson.id}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <TeacherDashboardBottomNavigation items={bottomNavigationItems} />
      </div>
    </main>
  );
};

export default LessonsListView;
