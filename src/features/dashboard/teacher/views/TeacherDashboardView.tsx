"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { notFound } from "next/navigation";
import {
  TeacherDashboardBottomNavigation,
  TeacherDashboardHero,
  TeacherDashboardTopbar,
  TeacherClassesSection,
  TeacherInsightsSidebar,
  TeacherStudentsSection,
} from "@/features/dashboard/teacher/components";
import { AuthBackgroundCanvas } from "@/features/auth/components/AuthBackgroundCanvas";
import { useAuthStore } from "@/store/auth/auth.store";
import type { TeacherClass } from "../types";
import { useTeacherIdentityStore } from "../store/teacher-identity.store";
import { getTeacherFullName } from "../utils/teacher-identity.utils";
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
  { id: "builder", icon: "🧩", label: "Crear ejercicios", href: "/lesson-builder" },
];

const formatToday = () => {
  return new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
};

const TeacherDashboardView = () => {
  const { initialized, isAuthenticated, status, user } = useAuthStore();
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
  const setTeacherIdentityFromProfile = useTeacherIdentityStore((state) => state.setFromProfile);

  const isWaitingForAuth =
    !initialized || status === "loading" || (isAuthenticated && !user);
  const canSeeTeacherDashboard = initialized && isAuthenticated && user?.role === "teacher";

  if (!isWaitingForAuth && !canSeeTeacherDashboard) {
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

      const fullName = getTeacherFullName(teacherProfile);
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
      setTeacherIdentityFromProfile(teacherProfile);
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
  }, [canSeeTeacherDashboard, setTeacherIdentityFromProfile]);

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

  if (isWaitingForAuth) {
    return (
      <main className="landing-module-shell min-h-screen bg-[#070c22] p-6">
        <div className="landing-module-card text-white/80">
          Validando acceso...
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
        {profile ? <TeacherDashboardTopbar /> : null}

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
                    <TeacherClassesSection
                      classes={classes}
                      selectedClassId={selectedClassId}
                      classProgress={classProgress}
                      onSelectClass={setSelectedClassId}
                    />

                    <TeacherStudentsSection
                      selectedClass={selectedClass}
                      isClassLoading={isClassLoading}
                      studentSearchTerm={studentSearchTerm}
                      filteredStudents={filteredStudents}
                      selectedStudentId={selectedStudentId}
                      onSearchChange={setStudentSearchTerm}
                      onSelectStudent={setSelectedStudentId}
                    />
                  </div>
                  <TeacherInsightsSidebar
                    attentionStudents={attentionStudents}
                    selectedStudent={selectedStudent}
                    selectedStudentProgress={selectedStudentProgress}
                    onSelectStudent={setSelectedStudentId}
                  />
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
