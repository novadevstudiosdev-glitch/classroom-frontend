"use client";

import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArchiveClassModal,
  EditClassModal,
  TeacherDashboardTopbar,
  TeacherDashboardHero,
  TeacherDashboardBottomNavigation,
} from "@/features/dashboard/teacher/components";
import { AuthBackgroundCanvas } from "@/features/auth/components/AuthBackgroundCanvas";
import { useAuthStore } from "@/store/auth/auth.store";
import { TeacherClass } from "../types";
import {
  CLASS_PROGRESS_MATRIX_MOCK,
  CLASS_STUDENTS_PROGRESS_MOCK,
  TEACHER_CLASSES_MOCK,
} from "../data";
import { getTeacherClassrooms } from "../services";

type ClassStatus = "active" | "waiting" | "finished";
const CLASSES_PER_PAGE = 8;
const STUDENTS_PER_PAGE = 10;
const ATTENTION_PER_PAGE = 3;

const DEMO_EXTRA_CLASSES: TeacherClass[] = [
  { id: "MAT4C-2026", emoji: "➗", name: "Matemática 4° C", studentCount: 23, isActive: true, completionPercent: 76, activeToday: 14, behind: 4, code: "MAT4C-2026" },
  { id: "LEN4A-2026", emoji: "📝", name: "Lengua 4° A", studentCount: 21, isActive: true, completionPercent: 81, activeToday: 16, behind: 2, code: "LEN4A-2026" },
  { id: "CSN4A-2026", emoji: "🔬", name: "Ciencias 4° A", studentCount: 25, isActive: false, completionPercent: 58, activeToday: 10, behind: 6, code: "CSN4A-2026" },
  { id: "HIS4B-2026", emoji: "🌎", name: "Historia 4° B", studentCount: 20, isActive: true, completionPercent: 92, activeToday: 17, behind: 1, code: "HIS4B-2026" },
  { id: "ART4A-2026", emoji: "🎨", name: "Arte 4° A", studentCount: 19, isActive: false, completionPercent: 43, activeToday: 8, behind: 7, code: "ART4A-2026" },
  { id: "TEC4B-2026", emoji: "💻", name: "Tecnología 4° B", studentCount: 18, isActive: true, completionPercent: 67, activeToday: 12, behind: 5, code: "TEC4B-2026" },
  { id: "ING4A-2026", emoji: "🇬🇧", name: "Inglés 4° A", studentCount: 24, isActive: true, completionPercent: 74, activeToday: 15, behind: 4, code: "ING4A-2026" },
  { id: "GEO4B-2026", emoji: "🗺️", name: "Geografía 4° B", studentCount: 22, isActive: false, completionPercent: 36, activeToday: 7, behind: 8, code: "GEO4B-2026" },
];

const DEMO_ATTENTION_STUDENTS = [
  { id: "student-4", name: "Valentina Ruiz", issue: "Sin actividad hace 4 días", className: "Lengua 4° B" },
  { id: "student-5", name: "Tomás Acosta", issue: "3 lecciones atrasadas", className: "Matemática 4° C" },
  { id: "student-6", name: "Emma Sosa", issue: "Baja participación semanal", className: "Ciencias 4° A" },
  { id: "student-7", name: "Bruno Castro", issue: "No entrega tareas", className: "Historia 4° B" },
  { id: "student-8", name: "Julieta Gómez", issue: "Sin actividad hace 2 días", className: "Inglés 4° A" },
  { id: "student-9", name: "Dylan Martínez", issue: "4 ausencias acumuladas", className: "Geografía 4° B" },
];

const TeacherDashboardView = () => {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<TeacherClass | null>(null);
  const [classes, setClasses] = useState<TeacherClass[]>([...TEACHER_CLASSES_MOCK, ...DEMO_EXTRA_CLASSES]);
  const [selectedClassCode, setSelectedClassCode] = useState<string>(
    TEACHER_CLASSES_MOCK[0]?.code ?? "",
  );
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [observationNotes, setObservationNotes] = useState("");
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [quickStudentSearch, setQuickStudentSearch] = useState("");
  const [classesPage, setClassesPage] = useState(0);
  const [studentsPage, setStudentsPage] = useState(0);
  const [attentionPage, setAttentionPage] = useState(0);

  const heroStats = [
    { id: "students", value: "24", label: "Alumnos" },
    { id: "lessons", value: "12", label: "Lecciones" },
    { id: "completion", value: "87%", label: "Completitud" },
  ];

  const statusLegend: Array<{ id: ClassStatus; label: string; className: string }> = [
    { id: "active", label: "Activa", className: "bg-emerald-500/25 text-emerald-200" },
    { id: "waiting", label: "En espera", className: "bg-orange-500/25 text-orange-200" },
    { id: "finished", label: "Terminada", className: "bg-rose-500/25 text-rose-200" },
  ];

  const studentsNeedingAttention = [
    {
      id: "student-1",
      name: "Salvador Gerardo De la Tijera Martínez",
      issue: "Sin actividad hace 3 días",
      className: "Matemática 4° A",
    },
    {
      id: "student-2",
      name: "Sofía Gómez",
      issue: "2 lecciones atrasadas",
      className: "Lengua 4° B",
    },
    {
      id: "student-3",
      name: "Lucas Martínez",
      issue: "Racha perdida",
      className: "Matemática 4° A",
    },
    ...DEMO_ATTENTION_STUDENTS,
  ];
  const bottomNavigationItems = [
    { id: "home", icon: "🏠", label: "Inicio", isActive: true, href: "/dashboard/teacher" },
    { id: "lessons", icon: "📚", label: "Lecciones", href: "/lessons" },
    { id: "builder", icon: "🧩", label: "Builder", href: "/lesson-builder" },
  ];

  const classDetailById = useMemo(
    () => new Map(CLASS_STUDENTS_PROGRESS_MOCK.map((item) => [item.classId, item])),
    [],
  );
  const progressMatrixById = useMemo(
    () => new Map(CLASS_PROGRESS_MATRIX_MOCK.map((item) => [item.classroomId, item])),
    [],
  );

  const currentClass = useMemo(
    () => classes.find((item) => item.code === selectedClassCode) ?? classes[0] ?? null,
    [classes, selectedClassCode],
  );
  const currentClassCode = currentClass?.code ?? "";

  const currentClassDetail = useMemo(() => {
    if (!currentClassCode) return null;
    return (
      classDetailById.get(currentClassCode) ?? {
        classId: currentClassCode,
        className: currentClass?.name ?? "Clase",
        classCode: currentClassCode,
        students: [],
      }
    );
  }, [classDetailById, currentClass?.name, currentClassCode]);

  const currentProgressMatrix = useMemo(
    () => progressMatrixById.get(currentClassCode) ?? null,
    [progressMatrixById, currentClassCode],
  );
  const effectiveSelectedStudentId =
    selectedStudentId &&
    currentProgressMatrix?.students.some((student) => student.id === selectedStudentId)
      ? selectedStudentId
      : (currentProgressMatrix?.students[0]?.id ?? "");

  useEffect(() => {
    let mounted = true;

    const loadTeacherClassrooms = async () => {
      try {
        const response = await getTeacherClassrooms();
        if (!mounted || response.length === 0) return;
        const merged = [...response, ...DEMO_EXTRA_CLASSES];
        const byCode = new Map(merged.map((item) => [item.code, item]));
        setClasses(Array.from(byCode.values()));
        setSelectedClassCode((prev) =>
          prev && merged.some((item) => item.code === prev) ? prev : merged[0].code,
        );
      } catch {
        // para cuando funione el back....
      }
    };

    loadTeacherClassrooms();

    return () => {
      mounted = false;
    };
  }, []);

  const handleOpenEditModal = (classItem: TeacherClass) => {
    setSelectedClass(classItem);
    setIsEditModalOpen(true);
  };

  const handleOpenArchiveModal = (classItem: TeacherClass) => {
    setSelectedClass(classItem);
    setIsArchiveModalOpen(true);
  };

  const handleEditClass = (updatedClass: TeacherClass) => {
    const originalCode = selectedClass?.code;
    setClasses((prev) =>
      prev.map((item) =>
        item.code === originalCode ? updatedClass : item,
      ),
    );
    setIsEditModalOpen(false);
    setSelectedClass(null);
  };

  const handleArchiveClass = (classCode: string) => {
    setClasses((prev) =>
      prev.map((item) =>
        item.code === classCode ? { ...item, isActive: false } : item,
      ),
    );
    setIsArchiveModalOpen(false);
    setSelectedClass(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedClass(null);
  };

  const handleCloseArchiveModal = () => {
    setIsArchiveModalOpen(false);
    setSelectedClass(null);
  };

  const selectedMatrixStudent = currentProgressMatrix?.students.find(
    (student) => student.id === effectiveSelectedStudentId,
  );

  const selectedClassStudent = currentClassDetail?.students.find(
    (student) => student.id === effectiveSelectedStudentId,
  );

  const selectedStudentLessonProgress = (currentProgressMatrix?.lessons ?? []).map((lesson) => {
    const progressCell = currentProgressMatrix?.matrix.find(
      (cell) => cell.lessonId === lesson.id && cell.studentId === effectiveSelectedStudentId,
    );
    return {
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      percent: progressCell?.progressPercent ?? 0,
    };
  });

  const absencesTotal = Math.max(
    0,
    Math.round((100 - (selectedClassStudent?.progressPercent ?? 0)) / 12),
  );
  const participationLevel =
    (selectedClassStudent?.progressPercent ?? 0) >= 85
      ? "Alta"
      : (selectedClassStudent?.progressPercent ?? 0) >= 65
        ? "Media"
        : "Baja";
  const pendingHomework = Math.max(
    0,
    Math.round((100 - (selectedClassStudent?.progressPercent ?? 0)) / 25),
  );

  const classStatus = (item: TeacherClass): ClassStatus => {
    if (item.completionPercent >= 100) return "finished";
    if (item.isActive) return "active";
    return "waiting";
  };

  const filteredStudents = (currentClassDetail?.students ?? []).filter((student) =>
    student.fullName.toLowerCase().includes(studentSearchTerm.trim().toLowerCase()),
  );
  const quickMatchStudent = (currentClassDetail?.students ?? []).find((student) =>
    student.fullName.toLowerCase().includes(quickStudentSearch.trim().toLowerCase()),
  );
  const studentsGrid = Array.from({ length: 30 }, (_, index) => filteredStudents[index] ?? null);
  const classesTotalPages = Math.max(1, Math.ceil(classes.length / CLASSES_PER_PAGE));
  const effectiveClassesPage = Math.min(classesPage, classesTotalPages - 1);
  const visibleClasses = classes.slice(
    effectiveClassesPage * CLASSES_PER_PAGE,
    effectiveClassesPage * CLASSES_PER_PAGE + CLASSES_PER_PAGE,
  );

  const studentsTotalPages = Math.max(1, Math.ceil(studentsGrid.length / STUDENTS_PER_PAGE));
  const effectiveStudentsPage = Math.min(studentsPage, studentsTotalPages - 1);
  const visibleStudentsGrid = studentsGrid.slice(
    effectiveStudentsPage * STUDENTS_PER_PAGE,
    effectiveStudentsPage * STUDENTS_PER_PAGE + STUDENTS_PER_PAGE,
  );

  const attentionTotalPages = Math.max(
    1,
    Math.ceil(studentsNeedingAttention.length / ATTENTION_PER_PAGE),
  );
  const effectiveAttentionPage = Math.min(attentionPage, attentionTotalPages - 1);
  const visibleAttentionStudents = studentsNeedingAttention.slice(
    effectiveAttentionPage * ATTENTION_PER_PAGE,
    effectiveAttentionPage * ATTENTION_PER_PAGE + ATTENTION_PER_PAGE,
  );

  const getInitials = (fullName: string) => {
    const parts = fullName.split(" ").filter(Boolean);
    return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-0">
        <AuthBackgroundCanvas />
      </div>

      <div className="landing-module-shell relative z-10 pb-24">
        <TeacherDashboardTopbar onLogout={handleLogout} />

        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl space-y-6">
          <section>
            <TeacherDashboardHero
              title="¡Bienvenido/a de nuevo! 👋"
              subtitle="Lunes, 16 de marzo de 2026"
              stats={heroStats}
            />
          </section>

            <section className="grid gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)]">
            <div className="space-y-6">
              <article className="cosmic-panel border-0 shadow-[0_18px_40px_rgba(2,6,26,0.58)]">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-xl font-black text-white">Mis clases</h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {statusLegend.map((status) => (
                        <span
                          key={status.id}
                          className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${status.className}`}
                        >
                          {status.label}
                        </span>
                      ))}
                    </div>
                    {classesTotalPages > 1 && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setClassesPage((prev) => Math.max(0, prev - 1))}
                          disabled={effectiveClassesPage === 0}
                          className="rounded-lg bg-white/10 px-2 py-1 text-xs text-white disabled:opacity-40"
                        >
                          ◀
                        </button>
                        <span className="text-xs font-bold text-white/70">
                          {effectiveClassesPage + 1}/{classesTotalPages}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setClassesPage((prev) => Math.min(classesTotalPages - 1, prev + 1))
                          }
                          disabled={effectiveClassesPage === classesTotalPages - 1}
                          className="rounded-lg bg-white/10 px-2 py-1 text-xs text-white disabled:opacity-40"
                        >
                          ▶
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {visibleClasses.map((item) => {
                    const isSelected = item.code === currentClassCode;
                    const currentStatus = classStatus(item);
                    const statusTone =
                      currentStatus === "active"
                        ? "bg-emerald-500/30 text-emerald-200"
                        : currentStatus === "waiting"
                          ? "bg-orange-500/30 text-orange-200"
                          : "bg-rose-500/30 text-rose-200";
                    return (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => setSelectedClassCode(item.code)}
                        className={`rounded-xl bg-white/10 px-2.5 py-2 text-left transition hover:bg-white/15 hover:shadow-[0_12px_24px_rgba(2,6,26,0.42)] ${
                          isSelected
                            ? "bg-white/18 shadow-[0_16px_34px_rgba(2,6,26,0.58)]"
                            : "shadow-[0_10px_22px_rgba(2,6,26,0.4)]"
                        }`}
                      >
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <p className="text-xs font-bold text-white">{item.name}</p>
                          <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${statusTone}`}>
                            {statusLegend.find((status) => status.id === currentStatus)?.label}
                          </span>
                        </div>
                        <p className="text-[10px] text-white/70">Completada: {item.completionPercent}%</p>
                      </button>
                    );
                  })}
                </div>
              </article>

              <article className="cosmic-panel border-0 shadow-[0_18px_40px_rgba(2,6,26,0.58)]">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h4 className="text-xl font-black text-white">{currentClass?.name ?? "Clase"}</h4>
                    <p className="text-sm text-white/70">Código: {currentClass?.code ?? "N/D"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => currentClass && handleOpenEditModal(currentClass)}
                      className="rounded-xl bg-sky-500/25 px-3 py-2 text-xs font-bold uppercase tracking-wide text-sky-200"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => currentClass && handleOpenArchiveModal(currentClass)}
                      className="rounded-xl bg-rose-500/25 px-3 py-2 text-xs font-bold uppercase tracking-wide text-rose-200"
                    >
                      Archivar
                    </button>
                  </div>
                </div>

                <div className="mb-5 grid gap-2 sm:grid-cols-3">
                  <div className="rounded-xl bg-white/8 px-3 py-2 text-sm text-white/85">
                    Total alumnos: <span className="font-bold text-white">{currentClass?.studentCount ?? 0}</span>
                  </div>
                  <div className="rounded-xl bg-white/8 px-3 py-2 text-sm text-white/85">
                    Alumnos activos: <span className="font-bold text-white">{currentClass?.activeToday ?? 0}</span>
                  </div>
                  <div className="rounded-xl bg-white/8 px-3 py-2 text-sm text-white/85">
                    Atrasados: <span className="font-bold text-white">{currentClass?.behind ?? 0}</span>
                  </div>
                </div>

                <h5 className="mb-3 text-sm font-extrabold uppercase tracking-[0.14em] text-white/65">
                  Lista de alumnos
                </h5>
                <input
                  type="text"
                  value={studentSearchTerm}
                  onChange={(event) => {
                    setStudentSearchTerm(event.target.value);
                    setStudentsPage(0);
                  }}
                  placeholder="Buscar alumno por nombre..."
                  className="mb-3 w-full rounded-xl bg-white/12 px-3 py-2 text-sm text-white outline-none ring-1 ring-white/20 placeholder:text-white/45"
                />
                {studentsTotalPages > 1 && (
                  <div className="mb-3 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setStudentsPage((prev) => Math.max(0, prev - 1))}
                      disabled={effectiveStudentsPage === 0}
                      className="rounded-lg bg-white/10 px-2 py-1 text-xs text-white disabled:opacity-40"
                    >
                      ◀
                    </button>
                    <span className="text-xs font-bold text-white/70">
                      {effectiveStudentsPage + 1}/{studentsTotalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setStudentsPage((prev) => Math.min(studentsTotalPages - 1, prev + 1))
                      }
                      disabled={effectiveStudentsPage === studentsTotalPages - 1}
                      className="rounded-lg bg-white/10 px-2 py-1 text-xs text-white disabled:opacity-40"
                    >
                      ▶
                    </button>
                  </div>
                )}
                <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
                  {visibleStudentsGrid.map((student, index) => (
                    <div
                      key={`${student?.id ?? "empty"}-${effectiveStudentsPage}-${index}`}
                      className="min-h-[66px] rounded-xl bg-white/8 px-3 py-2.5"
                    >
                      {student ? (
                        <div className="text-sm font-semibold text-white">
                          <span className="mr-2 inline-flex w-6 justify-center rounded-md bg-white/12 py-0.5 text-xs font-black text-white/85">
                            {effectiveStudentsPage * STUDENTS_PER_PAGE + index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedStudentId(student.id);
                              document
                                .getElementById("tabla-progreso-alumno")
                                ?.scrollIntoView({ behavior: "smooth", block: "start" });
                            }}
                            className="text-left text-white underline decoration-white/35 underline-offset-4 hover:decoration-white"
                          >
                            {student.fullName}
                          </button>
                        </div>
                      ) : (
                        <p className="text-xs text-white/35">
                          <span className="mr-2 inline-flex w-6 justify-center rounded-md bg-white/10 py-0.5 text-[11px] font-black text-white/40">
                            {effectiveStudentsPage * STUDENTS_PER_PAGE + index + 1}
                          </span>
                          Sin alumno
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </article>
            </div>

            <aside className="space-y-6">
              <article className="cosmic-panel border-0 shadow-[0_18px_40px_rgba(2,6,26,0.58)]">
                <div className="mb-4 flex items-center justify-between gap-2">
                  <h4 className="text-lg font-black text-white">Alumnos que necesitan atención</h4>
                  {attentionTotalPages > 1 && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setAttentionPage((prev) => Math.max(0, prev - 1))}
                        disabled={effectiveAttentionPage === 0}
                        className="rounded-lg bg-white/10 px-2 py-1 text-xs text-white disabled:opacity-40"
                      >
                        ◀
                      </button>
                      <span className="text-xs font-bold text-white/70">
                        {effectiveAttentionPage + 1}/{attentionTotalPages}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setAttentionPage((prev) => Math.min(attentionTotalPages - 1, prev + 1))
                        }
                        disabled={effectiveAttentionPage === attentionTotalPages - 1}
                        className="rounded-lg bg-white/10 px-2 py-1 text-xs text-white disabled:opacity-40"
                      >
                        ▶
                      </button>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  {visibleAttentionStudents.map((student) => (
                    <div key={student.id} className="rounded-xl bg-white/8 p-3">
                      <div className="mb-2 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-xs font-black text-white">
                          {getInitials(student.name)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{student.name}</p>
                          <p className="text-xs text-white/65">{student.className}</p>
                        </div>
                      </div>
                      <p className="text-xs text-orange-200">{student.issue}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article id="tabla-progreso-alumno" className="cosmic-panel border-0 shadow-[0_18px_40px_rgba(2,6,26,0.58)]">
                <h4 className="text-lg font-black text-white">Tabla de progreso por alumno</h4>
                <p className="mb-4 text-sm text-white/70">{currentClass?.name ?? "Clase"}</p>
                <div className="mb-4">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-white/65">
                    Buscar alumno directo
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={quickStudentSearch}
                      onChange={(event) => setQuickStudentSearch(event.target.value)}
                      placeholder="Nombre del alumno..."
                      className="w-full rounded-xl bg-white/12 px-3 py-2 text-sm text-white outline-none ring-1 ring-white/20 placeholder:text-white/45"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!quickMatchStudent) return;
                        setSelectedStudentId(quickMatchStudent.id);
                      }}
                      className="rounded-xl bg-[#FFD700]/25 px-3 py-2 text-xs font-bold uppercase tracking-wide text-[#FFD700]"
                    >
                      Ir
                    </button>
                  </div>
                </div>
                <div className="mb-4 rounded-xl bg-white/8 px-3 py-2 text-sm text-white/80">
                  Alumno seleccionado:{" "}
                  <span className="font-bold text-white">
                    {selectedMatrixStudent
                      ? `${selectedMatrixStudent.firstName} ${selectedMatrixStudent.lastName}`
                      : "Selecciona un alumno desde la lista"}
                  </span>
                </div>

                <div className="space-y-2">
                  {selectedStudentLessonProgress.map((lesson) => (
                    <div
                      key={lesson.lessonId}
                      className="flex items-center justify-between rounded-lg bg-white/8 px-3 py-2 text-sm"
                    >
                      <span className="text-white/85">{lesson.lessonTitle}</span>
                      <span className="font-bold text-white">{lesson.percent}%</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between rounded-lg bg-white/8 px-3 py-2 text-sm">
                    <span className="text-white/85">Ausencias totales</span>
                    <span className="font-bold text-white">{absencesTotal}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-white/8 px-3 py-2 text-sm">
                    <span className="text-white/85">Participación</span>
                    <span className="font-bold text-white">{participationLevel}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-white/8 px-3 py-2 text-sm">
                    <span className="text-white/85">Tareas pendientes</span>
                    <span className="font-bold text-white">{pendingHomework}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-white/65">
                    Observaciones
                  </p>
                  <textarea
                    value={observationNotes}
                    onChange={(event) => setObservationNotes(event.target.value)}
                    className="h-24 w-full resize-none rounded-xl bg-white/12 p-3 text-sm text-white outline-none ring-1 ring-white/20 placeholder:text-white/45"
                    placeholder={`Notas de ${selectedMatrixStudent?.firstName ?? "alumno"} ${selectedMatrixStudent?.lastName ?? ""}`}
                  />
                </div>
              </article>
            </aside>
            </section>
          </div>
        </div>

        <EditClassModal
          key={selectedClass?.code ?? "edit-modal-empty"}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          initialData={selectedClass}
          onSubmit={handleEditClass}
        />

        <ArchiveClassModal
          isOpen={isArchiveModalOpen}
          onClose={handleCloseArchiveModal}
          classData={selectedClass}
          onConfirm={handleArchiveClass}
        />

        <TeacherDashboardBottomNavigation items={bottomNavigationItems} />
      </div>
    </div>
  );
};

export default TeacherDashboardView;
