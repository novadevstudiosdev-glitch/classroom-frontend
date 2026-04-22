import type { AssignedLessonSummaryProps } from "../types";

const AssignedLessonSummary = ({ lesson }: AssignedLessonSummaryProps) => {
  return (
    //---------TItula r de la leccion y descripcuon
    <section className="landing-module-content px-6 py-4">
      <h2 className="text-xl font-black text-yellow-300">{lesson.title}</h2>
      <p className="mt-2 text-lg text-white/70">{lesson.description}</p>
    </section>
  );
};

export default AssignedLessonSummary;
