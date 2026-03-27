import type { AssignedLessonSummaryProps } from "../types";

const AssignedLessonSummary = ({ lesson }: AssignedLessonSummaryProps) => {
  return (
    <section className="landing-module-content px-6 py-4">
      <h1 className="text-2xl font-bold text-white">{lesson.title}</h1>
      <p className="mt-2 text-sm text-white/70">{lesson.description}</p>
    </section>
  );
};

export default AssignedLessonSummary;
