"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  TeacherDashboardBottomNavigation,
  TeacherDashboardTopbar,
} from "@/features/dashboard/teacher/components";
import { getLessonById, getLessonsList } from "@/features/lessons/services";
import type { Lesson } from "@/features/lessons/types";
import {
  LessonBuilderControlBar,
  LessonBuilderExercisesSummaryCard,
  LessonBuilderMinigameCard,
  LessonBuilderPerformanceCard,
  LessonBuilderSettingsCard,
  LessonSelectorModal,
  MinigamePicker,
} from "@/features/lesson-builder/components";

const LessonBuilderView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lessonId = searchParams.get("lessonId");

  const [isMinigamePickerOpen, setIsMinigamePickerOpen] = useState(false);
  const [selectedMinigameId, setSelectedMinigameId] = useState<string | null>(null);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isLessonsLoading, setIsLessonsLoading] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "published">("all");

  const lessonExercises = useMemo(() => {
    if (!selectedLesson) return [];
    return selectedLesson.content_json.blocks
      .filter((block) => block.type === "multiple_choice" || block.type === "fill_blank" || block.type === "true_false" || block.type === "match_columns" || block.type === "order_elements")
      .map((block, index) => ({
        id: block.id ?? `exercise-${index + 1}`,
        title: `Ejercicio ${index + 1}`,
        subtitle: block.type.replace("_", " "),
        duration: "-",
        points: 0,
      }));
  }, [selectedLesson]);

  const lessonMinigames = useMemo(() => {
    if (!selectedLesson) return [];
    return selectedLesson.content_json.blocks
      .filter((block) => block.type === "minigame")
      .map((block, index) => ({
        id: block.id ?? `minigame-${index + 1}`,
        name: "Minijuego",
        description: "Configurado desde la leccion",
      }));
  }, [selectedLesson]);

  const selectedMinigame =
    lessonMinigames.find((item) => item.id === selectedMinigameId) ?? null;

  const performanceData = useMemo(() => {
    const totalBlocks = selectedLesson?.content_json.blocks.length ?? 0;
    const exerciseCount = lessonExercises.length;
    const completionRate = totalBlocks > 0 ? `${Math.round((exerciseCount / totalBlocks) * 100)}%` : "0%";

    return {
      completionRate,
      averageScore: "N/D",
      averageTime: "N/D",
    };
  }, [lessonExercises.length, selectedLesson]);

  const bottomNavigationItems = [
    { id: "home", icon: "🏠", label: "Inicio", href: "/dashboard/teacher" },
    { id: "lessons", icon: "📚", label: "Lecciones", href: "/lessons" },
    { id: "builder", icon: "🧩", label: "Crear ejercicios", href: "/lesson-builder", isActive: true },
  ];

  useEffect(() => {
    let isMounted = true;
    const loadLessons = async () => {
      setIsLessonsLoading(true);
      try {
        const rows = await getLessonsList();
        if (!isMounted) return;
        setLessons(rows);
      } catch {
        if (!isMounted) return;
        setLessons([]);
      } finally {
        if (isMounted) setIsLessonsLoading(false);
      }
    };
    void loadLessons();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!lessonId) {
      setSelectedLesson(null);
      return;
    }

    let isMounted = true;
    const loadSelectedLesson = async () => {
      try {
        const lesson = await getLessonById(lessonId);
        if (!isMounted) return;
        setSelectedLesson(lesson);
      } catch {
        if (!isMounted) return;
        setSelectedLesson(null);
      }
    };

    void loadSelectedLesson();
    return () => {
      isMounted = false;
    };
  }, [lessonId]);

  const filteredLessons = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return lessons.filter((lesson) => {
      if (statusFilter !== "all" && lesson.status !== statusFilter) return false;
      if (!query) return true;

      const haystack = `${lesson.title} ${lesson.subject ?? ""} ${lesson.grade ?? ""}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [lessons, searchTerm, statusFilter]);

  const handleSelectLesson = (id: string) => {
    setIsLessonModalOpen(false);
    router.push(`/lesson-builder?lessonId=${id}`);
  };

  const lessonClassName = selectedLesson
    ? `${selectedLesson.subject ?? "General"} ${selectedLesson.grade ?? ""}`.trim()
    : "Sin leccion seleccionada";

  const lessonDraftLabel = selectedLesson
    ? selectedLesson.status === "published"
      ? "Publicada"
      : "Borrador"
    : "Selecciona una leccion";

  return (
    <div className="landing-module-shell pb-24">
      <TeacherDashboardTopbar />
      <LessonBuilderControlBar
        className={lessonClassName}
        draftLabel={lessonDraftLabel}
      />

      <main className="landing-module-content space-y-6 p-6">
        {!selectedLesson ? (
          <section className="cosmic-panel border-0 shadow-[0_18px_40px_rgba(2,6,26,0.58)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-white">Selecciona una leccion para continuar</h3>
                <p className="mt-2 text-sm text-white/75">Abre &quot;Mis lecciones&quot; para elegir una existente o crea una nueva desde Lecciones.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsLessonModalOpen(true)}
                className="rounded-xl border border-white/30 bg-gradient-to-r from-emerald-300 to-cyan-300 px-4 py-2 text-sm font-black text-[#03212a] shadow-[0_10px_24px_rgba(16,185,129,0.35)] transition hover:from-emerald-200 hover:to-cyan-200"
              >
                Mis lecciones
              </button>
            </div>
          </section>
        ) : (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsLessonModalOpen(true)}
              className="rounded-xl border border-white/30 bg-gradient-to-r from-emerald-300 to-cyan-300 px-4 py-2 text-sm font-black text-[#03212a] shadow-[0_10px_24px_rgba(16,185,129,0.35)] transition hover:from-emerald-200 hover:to-cyan-200"
            >
              Mis lecciones
            </button>
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-2">
          <LessonBuilderSettingsCard
            data={{
              grade: selectedLesson?.grade ?? "Sin grado",
              subject: selectedLesson?.subject ?? "General",
              difficulty: (selectedLesson?.difficulty as "" | "facil" | "medio" | "dificil" | undefined) ?? "",
            }}
          />
          <LessonBuilderPerformanceCard data={performanceData} />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <LessonBuilderExercisesSummaryCard
            totalExercises={lessonExercises.length}
            exercises={lessonExercises}
            addExerciseHref={selectedLesson ? `/lesson-builder/exercises/new?lessonId=${selectedLesson.id}` : "/lesson-builder/exercises/new"}
          />
          <LessonBuilderMinigameCard
            selectedMinigameName={selectedMinigame?.name ?? null}
            onOpenPicker={() => setIsMinigamePickerOpen(true)}
          />
        </section>
      </main>

      <LessonSelectorModal
        isOpen={isLessonModalOpen}
        isLoading={isLessonsLoading}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        lessons={filteredLessons}
        onClose={() => setIsLessonModalOpen(false)}
        onSearchChange={setSearchTerm}
        onStatusFilterChange={setStatusFilter}
        onSelectLesson={handleSelectLesson}
      />

      <MinigamePicker
        isOpen={isMinigamePickerOpen}
        minigames={lessonMinigames}
        selectedMinigameId={selectedMinigameId}
        onSelect={(minigameId) => {
          setSelectedMinigameId(minigameId);
          setIsMinigamePickerOpen(false);
        }}
        onClose={() => setIsMinigamePickerOpen(false)}
      />

      <TeacherDashboardBottomNavigation items={bottomNavigationItems} />
    </div>
  );
};

export default LessonBuilderView;
