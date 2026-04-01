import { AuthBackgroundCanvas } from "@/features/auth/components/AuthBackgroundCanvas";
import { LessonBuilderExercisesView } from "@/features/lesson-builder/views";

const LessonBuilderExercisesPage = () => {
  return (
    <div className="relative min-h-screen">
      
      {/* BACKGROUND (fijo) */}
      <div className="fixed inset-0 z-0">
        <AuthBackgroundCanvas />
      </div>

      {/* CONTENIDO (scrollea normal) */}
      <LessonBuilderExercisesView />

    </div>
  );
};
export default LessonBuilderExercisesPage;
