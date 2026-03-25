"use client";

import { useState } from "react";
import {
  LessonBuilderAside,
  LessonBuilderControlBar,
  LessonBuilderExercisesSection,
  LessonBuilderTopBar,
  LessonBuilderVideoSection,
} from "@/features/lesson-builder/components";
import { LESSON_BUILDER_MOCK } from "@/features/lesson-builder/data";

const LessonBuilderView = () => {
  const [isPublished, setIsPublished] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <LessonBuilderTopBar
        backHref="/dashboard/teacher"
        backLabel="Clases"
        className={LESSON_BUILDER_MOCK.className}
      />

      <LessonBuilderControlBar
        className={LESSON_BUILDER_MOCK.className}
        draftLabel={LESSON_BUILDER_MOCK.draftLabel}
        isPublished={isPublished}
        metrics={LESSON_BUILDER_MOCK.metrics}
        onTogglePublished={() => setIsPublished((prev) => !prev)}
      />

      <main className="grid gap-6 p-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <LessonBuilderVideoSection video={LESSON_BUILDER_MOCK.video} />
          <LessonBuilderExercisesSection exercises={LESSON_BUILDER_MOCK.exercises} />
        </div>

        <LessonBuilderAside
          aiTools={LESSON_BUILDER_MOCK.aiTools}
          settings={LESSON_BUILDER_MOCK.settings}
          performance={LESSON_BUILDER_MOCK.performance}
        />
      </main>
    </div>
  );
};

export default LessonBuilderView;
