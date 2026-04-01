import { Suspense } from "react";
import { LessonBuilderView } from "@/features/lesson-builder/views";
import { AuthBackgroundCanvas } from "../../features/auth/components/AuthBackgroundCanvas";

const LessonBuilderPage = () => {
  return (
    <Suspense fallback={null}>
      <div className="fixed inset-0 z-0">
        <AuthBackgroundCanvas />
      </div>
      <LessonBuilderView />
    </Suspense>
  );
};

export default LessonBuilderPage;
