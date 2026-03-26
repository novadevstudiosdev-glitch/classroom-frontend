import { LessonBuilderExercisesSection, LessonBuilderSectionTabs, LessonBuilderTopBar } from "@/features/lesson-builder/components";
import { LESSON_BUILDER_MOCK } from "@/features/lesson-builder/data";

const LessonBuilderExercisesView = () => {
  return (
    <div className="landing-module-shell">
      <LessonBuilderTopBar
        backHref="/dashboard/teacher"
        backLabel="Clases"
        className={LESSON_BUILDER_MOCK.className}
      />

      <LessonBuilderSectionTabs activeSection="exercises" />

      <main className="landing-module-content p-6">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-white">Gestión de ejercicios</h2>
          <p className="text-sm text-white/70">
            Lista mock para adelantar UI. Luego solo reemplazas por data del backend.
          </p>
        </div>

        <LessonBuilderExercisesSection
          exercises={LESSON_BUILDER_MOCK.exercises}
          addExerciseHref="/lesson-builder/exercises/new"
        />
      </main>
    </div>
  );
};

export default LessonBuilderExercisesView;
