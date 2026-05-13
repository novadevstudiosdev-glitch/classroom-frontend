import { AuthBackgroundCanvas } from "@/features/auth/components/AuthBackgroundCanvas";
import { ExerciseBuilderView } from "@/features/exercise-builder/views";

export default function NewExerciseBuilderPage() {
  return (
    <div className="relative min-h-screen">

      {/* BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <AuthBackgroundCanvas />
      </div>

      {/* CONTENIDO */}
      <div className="relative z-10">
        <ExerciseBuilderView />
      </div>

    </div>
  );
}