import { Suspense } from "react";
import { LessonBuilderView } from "@/features/lesson-builder/views";

const LessonBuilderPage = () => {
  return (
    <Suspense fallback={null}>
      <LessonBuilderView />
    </Suspense>
  );
};

export default LessonBuilderPage;
