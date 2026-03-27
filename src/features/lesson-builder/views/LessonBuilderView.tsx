"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  LessonBuilderAside,
  LessonBuilderControlBar,
  LessonBuilderExercisesSummaryCard,
  LessonBuilderMinigameCard,
  LessonBuilderSectionTabs,
  LessonBuilderTopBar,
  LessonBuilderVideoSection,
  MinigamePicker,
} from "@/features/lesson-builder/components";
import { LESSON_BUILDER_MOCK } from "@/features/lesson-builder/data";

const LessonBuilderView = () => {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const shouldShowForward = from === "exercise-new";
  const [isPublished, setIsPublished] = useState(false);
  const [isMinigamePickerOpen, setIsMinigamePickerOpen] = useState(false);
  const [selectedMinigameId, setSelectedMinigameId] = useState<string | null>(
    LESSON_BUILDER_MOCK.minigames[0]?.id ?? null,
  );
  const selectedMinigame =
    LESSON_BUILDER_MOCK.minigames.find((item) => item.id === selectedMinigameId) ?? null;

  return (
    <div className="landing-module-shell">
      <LessonBuilderTopBar
        backHref="/dashboard/teacher"
        backLabel="Clases"
        className={LESSON_BUILDER_MOCK.className}
        forwardHref={shouldShowForward ? "/lesson-builder/exercises/new" : undefined}
        forwardLabel="Adelante"
      />
      <LessonBuilderSectionTabs activeSection="builder" />

      <LessonBuilderControlBar
        className={LESSON_BUILDER_MOCK.className}
        draftLabel={LESSON_BUILDER_MOCK.draftLabel}
        isPublished={isPublished}
        metrics={LESSON_BUILDER_MOCK.metrics}
        onTogglePublished={() => setIsPublished((prev) => !prev)}
      />

      <main className="landing-module-content grid gap-6 p-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <LessonBuilderVideoSection video={LESSON_BUILDER_MOCK.video} />
          <LessonBuilderExercisesSummaryCard
            totalExercises={LESSON_BUILDER_MOCK.exercises.length}
            manageExercisesHref="/lesson-builder/exercises"
            addExerciseHref="/lesson-builder/exercises/new"
          />
          <LessonBuilderMinigameCard
            selectedMinigameName={selectedMinigame?.name ?? null}
            onOpenPicker={() => setIsMinigamePickerOpen(true)}
          />
        </div>

        <LessonBuilderAside
          aiTools={LESSON_BUILDER_MOCK.aiTools}
          settings={LESSON_BUILDER_MOCK.settings}
          performance={LESSON_BUILDER_MOCK.performance}
        />
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
    </div>
  );
};

export default LessonBuilderView;
