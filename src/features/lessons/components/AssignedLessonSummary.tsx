import type { AssignedLessonSummaryProps } from "../types";

const AssignedLessonSummary = ({ lesson }: AssignedLessonSummaryProps) => {
  return (
    <section className="px-6 py-4">
      <h1 className="text-2xl font-bold text-gray-800">{lesson.title}</h1>
      <p className="text-sm text-gray-600 mt-2">{lesson.description}</p>
    </section>
  );
};

export default AssignedLessonSummary;
