"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import {
  TeacherDashboardBottomNavigation,
  TeacherDashboardHero,
  TeacherDashboardTopbar,
} from "@/features/dashboard/teacher/components";
import { AuthBackgroundCanvas } from "@/features/auth/components/AuthBackgroundCanvas";
import { useAuthStore } from "@/store/auth/auth.store";
import type { TeacherClass } from "../types";
import {
  getTeacherClassProgress,
  getTeacherClassrooms,
  getTeacherClassStudents,
  getTeacherProfile,
  getTeacherStudentStats,
  type TeacherClassProgress,
  type TeacherClassStudent,
  type TeacherProfile,
  type TeacherStudentStats,
} from "../services";

const bottomNavigationItems = [
  { id: "home", icon: "🏠", label: "Inicio", isActive: true, href: "/dashboard/teacher" },
  { id: "lessons", icon: "📚", label: "Lecciones", href: "/lessons" },
  { id: "builder", icon: "🧩", label: "Builder", href: "/lesson-builder" },
];

const getFullName = (profile: TeacherProfile) => {
  return `${profile.first_name} ${profile.last_name}`.trim();
};

const getInitials = (name: string) => {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "D"
  );
};

const formatPlan = (plan?: string) => {
  if (!plan) return "Plan";
  return `Plan ${plan.charAt(0).toUpperCase()}${plan.slice(1)}`;
};

const formatToday = () => {
  return new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
};

const getClassCompletion = (
  classId: string,
  progress: TeacherClassProgress | null,
) => {
  if (!progress || progress.classroom_id !== classId || progress.lessons.length === 0) {
    return 0;
  }

  const possibleCells = progress.students.length * progress.lessons.length;
  if (possibleCells === 0) return 0;

  const completedCells = progress.progress.filter((item) => item.status === "completed").length;
  return Math.round((completedCells / possibleCells) * 100);
};

const TeacherDashboardView = () => {
  const router = useRouter();
  const { initialized, isAuthenticated, status, user, logout } = useAuthStore();
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [studentStats, setStudentStats] = useState<TeacherStudentStats | null>(null);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [classStudents, setClassStudents] = useState<TeacherClassStudent[]>([]);
  const [classProgress, setClassProgress] = useState<TeacherClassProgress | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isClassLoading, setIsClassLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isWaitingForAuth =
    !initialized || status === "loading" || (isAuthenticated && !user);
  const canSeeTeacherDashboard = initialized && isAuthenticated && user?.role === "teacher";

  if (!isLoggingOut && !isWaitingForAuth && !canSeeTeacherDashboard) {
    notFound();
  }

  const loadDashboard = useCallback(async () => {
    if (!canSeeTeacherDashboard) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [teacherProfile, classroomRows, stats] = await Promise.all([
        getTeacherProfile(),
        getTeacherClassrooms(),
        getTeacherStudentStats(),
      ]);

      const fullName = getFullName(teacherProfile);
      if (
        !teacherProfile.id ||
        !teacherProfile.user_id ||
        !teacherProfile.first_name.trim() ||
        !teacherProfile.last_name.trim() ||
        !fullName
      ) {
        throw new Error("Teacher profile not found");
      }

      setProfile(teacherProfile);
      setClasses(classroomRows);
      setStudentStats(stats);
      setSelectedClassId((currentClassId) => {
        if (classroomRows.length === 0) return "";
        return classroomRows.some((item) => item.id === currentClassId)
          ? currentClassId
          : classroomRows[0].id ?? "";
      });
    } catch {
      setProfile(null);
      setClasses([]);
      setStudentStats(null);
      setSelectedClassId("");
      setError("registro no econtrado");
    } finally {
      setIsLoading(false);
    }
  }, [canSeeTeacherDashboard]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    if (!selectedClassId || !canSeeTeacherDashboard) {
      setClassStudents([]);
      setClassProgress(null);
      setSelectedStudentId("");
      return;
    }

    let isMounted = true;

    const loadClassData = async () => {
      setIsClassLoading(true);
      setError(null);

      try {
        const [students, progress] = await Promise.all([
          getTeacherClassStudents(selectedClassId),
          getTeacherClassProgress(selectedClassId),
        ]);

        if (!isMounted) return;

        setClassStudents(students);
        setClassProgress(progress);
        setSelectedStudentId((currentStudentId) => {
          if (students.length === 0) return "";
          return students.some((student) => student.student_id === currentStudentId)
            ? currentStudentId
            : students[0].student_id;
        });
      } catch {
        if (!isMounted) return;
        setClassStudents([]);
        setClassProgress(null);
        setSelectedStudentId("");
        setError("No se pudo cargar la informacion de la clase.");
      } finally {
        if (isMounted) {
          setIsClassLoading(false);
        }
      }
    };

    void loadClassData();

    return () => {
      isMounted = false;
    };
  }, [canSeeTeacherDashboard, selectedClassId]);

  const teacherName = profile ? getFullName(profile) : "";
  const selectedClass = useMemo(
    () => classes.find((item) => item.id === selectedClassId) ?? null,
    [classes, selectedClassId],
  );
  const filteredStudents = useMemo(() => {
    const query = studentSearchTerm.trim().toLowerCase();
    if (!query) return classStudents;
    return classStudents.filter((student) => student.alias.toLowerCase().includes(query));
  }, [classStudents, studentSearchTerm]);
  const selectedStudent = useMemo(
    () => classStudents.find((student) => student.student_id === selectedStudentId) ?? null,
    [classStudents, selectedStudentId],
  );
  const attentionStudents = useMemo(
    () =>
      classStudents.filter(
        (student) => student.low_participation || student.pending_tasks > 0,
      ),
    [classStudents],
  );
  const selectedStudentProgress = useMemo(() => {
    if (!classProgress || !selectedStudentId) return [];

    return classProgress.lessons.map((lesson) => {
      const progress = classProgress.progress.find(
        (item) => item.lesson_id === lesson.lesson_id && item.student_id === selectedStudentId,
      );

      return {
        id: lesson.lesson_id,
        title: lesson.title,
        score: progress?.score_pct ?? null,
        status: progress?.status ?? "pendiente",
      };
    });
  }, [classProgress, selectedStudentId]);
  const heroStats = useMemo(
    () => [
      { id: "students", value: String(studentStats?.total ?? 0), label: "Alumnos" },
      { id: "active", value: String(studentStats?.active ?? 0), label: "Activos" },
      { id: "behind", value: String(studentStats?.behind ?? 0), label: "Atrasados" },
    ],
    [studentStats],
  );

  const handleLogout = () => {
    setIsLoggingOut(true);
    logout();
    router.replace("/");
  };

  if (isWaitingForAuth || isLoggingOut) {
    return (
      <main className="landing-module-shell min-h-screen bg-[#070c22] p-6">
        <div className="landing-module-card text-white/80">
          {isLoggingOut ? "Cerrando sesion..." : "Validando acceso..."}
        </div>
      </main>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-0">
        <AuthBackgroundCanvas />
      </div>

      <div className="landing-module-shell relative z-10 pb-24">
        {profile ? (
          <TeacherDashboardTopbar
            initials={getInitials(teacherName)}
            userName={teacherName}
            planLabel={formatPlan(profile.plan_type)}
            onLogout={handleLogout}
          />
        ) : null}

        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl space-y-6">
            {isLoading ? (
              <section className="pt-6">
                <div className="landing-module-card text-white/80">Cargando panel docente...</div>
              </section>
            ) : null}

            {!isLoading && error ? (
              <section className="pt-6">
                <div className="landing-module-card border-red-300/40 bg-red-500/10">
                  <p className="font-semibold text-red-100">{error}</p>
                </div>
              </section>
            ) : null}

            {!isLoading && !error && profile ? (
              <>
                <TeacherDashboardHero
                  title={`¡Bienvenido/a de nuevo, ${profile.first_name}!`}
                  subtitle={formatToday()}
                  stats={heroStats}
                />

                <section className="grid gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)]">
                  <div className="space-y-6">
                    <article className="cosmic-panel border-0 shadow-[0_18px_40px_rgba(2,6,26,0.58)]">
                      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                        <h3 className="text-xl font-black text-white">Mis clases</h3>
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/70">
                          {classes.length} clases
                        </span>
                      </div>

                      {classes.length === 0 ? (
                        <p className="rounded-xl bg-white/8 p-4 text-sm text-white/70">
                          Todavia no tienes clases creadas.
                        </p>
                      ) : (
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          {classes.map((item) => {
                            const isSelected = item.id === selectedClassId;
                            const completion = getClassCompletion(item.id ?? "", classProgress);

                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => setSelectedClassId(item.id ?? "")}
                                className={`rounded-xl px-3 py-3 text-left transition ${
                                  isSelected ? "bg-white/18" : "bg-white/10 hover:bg-white/15"
                                }`}
                              >
                                <div className="mb-2 flex items-center justify-between gap-2">
                                  <p className="text-sm font-bold text-white">{item.name}</p>
                                  <span className="rounded-full bg-emerald-500/25 px-2 py-1 text-[10px] font-bold text-emerald-200">
                                    Activa
                                  </span>
                                </div>
                                <p className="text-xs text-white/65">Codigo: {item.code}</p>
                                <p className="text-xs text-white/65">
                                  {item.studentCount} alumnos · {completion}% completado
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </article>

                    <article className="cosmic-panel border-0 shadow-[0_18px_40px_rgba(2,6,26,0.58)]">
                      <div className="mb-4">
                        <h4 className="text-xl font-black text-white">
                          {selectedClass?.name ?? "Selecciona una clase"}
                        </h4>
                        {selectedClass ? (
                          <p className="text-sm text-white/70">Codigo: {selectedClass.code}</p>
                        ) : null}
                      </div>

                      {isClassLoading ? (
                        <p className="rounded-xl bg-white/8 p-4 text-sm text-white/70">
                          Cargando alumnos...
                        </p>
                      ) : null}

                      {!isClassLoading && selectedClass ? (
                        <>
                          <input
                            type="text"
                            value={studentSearchTerm}
                            onChange={(event) => setStudentSearchTerm(event.target.value)}
                            placeholder="Buscar alumno por nombre..."
                            className="mb-3 w-full rounded-xl bg-white/12 px-3 py-2 text-sm text-white outline-none ring-1 ring-white/20 placeholder:text-white/45"
                          />

                          {filteredStudents.length === 0 ? (
                            <p className="rounded-xl bg-white/8 p-4 text-sm text-white/70">
                              No hay alumnos para mostrar.
                            </p>
                          ) : (
                            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                              {filteredStudents.map((student) => (
                                <button
                                  key={student.student_id}
                                  type="button"
                                  onClick={() => setSelectedStudentId(student.student_id)}
                                  className={`rounded-xl px-3 py-3 text-left ${
                                    student.student_id === selectedStudentId
                                      ? "bg-sky-500/20 ring-1 ring-sky-300/40"
                                      : "bg-white/8 hover:bg-white/12"
                                  }`}
                                >
                                  <p className="text-sm font-bold text-white">{student.alias}</p>
                                  <p className="text-xs text-white/65">
                                    Nivel {student.level ?? "-"} · {student.avg_score_pct}% promedio
                                  </p>
                                </button>
                              ))}
                            </div>
                          )}
                        </>
                      ) : null}
                    </article>
                  </div>

                  <aside className="space-y-6">
                    <article className="cosmic-panel border-0 shadow-[0_18px_40px_rgba(2,6,26,0.58)]">
                      <h4 className="mb-4 text-lg font-black text-white">
                        Alumnos que necesitan atencion
                      </h4>
                      {attentionStudents.length === 0 ? (
                        <p className="rounded-xl bg-white/8 p-4 text-sm text-white/70">
                          No hay alumnos marcados con baja participacion o tareas pendientes.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {attentionStudents.map((student) => (
                            <button
                              key={student.student_id}
                              type="button"
                              onClick={() => setSelectedStudentId(student.student_id)}
                              className="w-full rounded-xl bg-white/8 p-3 text-left hover:bg-white/12"
                            >
                              <p className="text-sm font-bold text-white">{student.alias}</p>
                              <p className="text-xs text-orange-200">
                                {student.pending_tasks} tareas pendientes · {student.participation_pct}% participacion
                              </p>
                            </button>
                          ))}
                        </div>
                      )}
                    </article>

                    <article className="cosmic-panel border-0 shadow-[0_18px_40px_rgba(2,6,26,0.58)]">
                      <h4 className="text-lg font-black text-white">Progreso del alumno</h4>
                      <p className="mb-4 text-sm text-white/70">
                        {selectedStudent?.alias ?? "Selecciona un alumno"}
                      </p>

                      {selectedStudent ? (
                        <div className="mb-4 grid gap-2 sm:grid-cols-3">
                          <div className="rounded-xl bg-white/8 px-3 py-2 text-sm text-white/85">
                            Promedio: <span className="font-bold text-white">{selectedStudent.avg_score_pct}%</span>
                          </div>
                          <div className="rounded-xl bg-white/8 px-3 py-2 text-sm text-white/85">
                            Participacion: <span className="font-bold text-white">{selectedStudent.participation_pct}%</span>
                          </div>
                          <div className="rounded-xl bg-white/8 px-3 py-2 text-sm text-white/85">
                            Pendientes: <span className="font-bold text-white">{selectedStudent.pending_tasks}</span>
                          </div>
                        </div>
                      ) : null}

                      {selectedStudentProgress.length === 0 ? (
                        <p className="rounded-xl bg-white/8 p-4 text-sm text-white/70">
                          No hay lecciones asignadas para mostrar.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {selectedStudentProgress.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between rounded-lg bg-white/8 px-3 py-2 text-sm"
                            >
                              <span className="text-white/85">{lesson.title}</span>
                              <span className="font-bold text-white">
                                {lesson.score === null ? lesson.status : `${lesson.score}%`}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </article>
                  </aside>
                </section>
              </>
            ) : null}
          </div>
        </div>

        <TeacherDashboardBottomNavigation items={bottomNavigationItems} />
      </div>
    </div>
  );
};

export default TeacherDashboardView;
