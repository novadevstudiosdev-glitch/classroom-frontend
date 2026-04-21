"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  TeacherDashboardBottomNavigation,
  TeacherDashboardTopbar,
} from "@/features/dashboard/teacher/components";
import {
  LessonBuilderControlBar,
  LessonBuilderExercisesSummaryCard,
  LessonBuilderMinigameCard,
  LessonBuilderPerformanceCard,
  LessonBuilderSettingsCard,
  LessonBuilderTopBar,
  MinigamePicker,
} from "@/features/lesson-builder/components";
import { LESSON_BUILDER_MOCK } from "@/features/lesson-builder/data";

const LessonBuilderView = () => {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const shouldShowForward = from === "exercise-new";
  const [isMinigamePickerOpen, setIsMinigamePickerOpen] = useState(false);
  const [selectedMinigameId, setSelectedMinigameId] = useState<string | null>(
    LESSON_BUILDER_MOCK.minigames[0]?.id ?? null,
  );
  const selectedMinigame =
    LESSON_BUILDER_MOCK.minigames.find((item) => item.id === selectedMinigameId) ?? null;
  const bottomNavigationItems = [
    { id: "home", icon: "🏠", label: "Inicio", href: "/dashboard/teacher" },
    { id: "lessons", icon: "📚", label: "Lecciones", href: "/lessons" },
    { id: "builder", icon: "🧩", label: "Crear ejercicios", href: "/lesson-builder", isActive: true },
  ];

  return (
    <div className="landing-module-shell pb-24">
      <TeacherDashboardTopbar />
      <LessonBuilderTopBar
        backHref="/dashboard/teacher"
        backLabel="Clases"
        className={LESSON_BUILDER_MOCK.className}
        forwardHref={shouldShowForward ? "/lesson-builder/exercises/new" : undefined}
        forwardLabel="Adelante"
      />

      <LessonBuilderControlBar
        className={LESSON_BUILDER_MOCK.className}
        draftLabel={LESSON_BUILDER_MOCK.draftLabel}
      />

      <main className="landing-module-content space-y-6 p-6">
        <section className="grid gap-4 md:grid-cols-2">
          <LessonBuilderSettingsCard data={LESSON_BUILDER_MOCK.settings} />
          <LessonBuilderPerformanceCard data={LESSON_BUILDER_MOCK.performance} />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <LessonBuilderExercisesSummaryCard
            totalExercises={LESSON_BUILDER_MOCK.exercises.length}
            exercises={LESSON_BUILDER_MOCK.exercises}
            addExerciseHref="/lesson-builder/exercises/new"
          />
          <LessonBuilderMinigameCard
            selectedMinigameName={selectedMinigame?.name ?? null}
            onOpenPicker={() => setIsMinigamePickerOpen(true)}
          />
        </section>
      </main>

      <MinigamePicker
        isOpen={isMinigamePickerOpen}
        minigames={LESSON_BUILDER_MOCK.minigames}
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
