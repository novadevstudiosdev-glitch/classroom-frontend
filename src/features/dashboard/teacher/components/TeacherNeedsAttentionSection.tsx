import type { TeacherNeedsAttentionSectionProps } from "@/features/dashboard/teacher/types";

const TeacherNeedsAttentionSection = ({
  title = "Alumnos que necesitan atención",
  students,
}: TeacherNeedsAttentionSectionProps) => {
  return (
    <div className="px-6 pb-6">
      <h2 className="mb-4 text-xl font-bold text-gray-600">{title}</h2>

      <div className="divide-y rounded-2xl border bg-white shadow-sm">
        {students.map((student) => (
          <div key={student.id} className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 font-bold text-gray-600">
              {student.name[0]}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-600">{student.name}</p>
              <p className="text-xs text-gray-600">{student.className}</p>
              <p className="mt-1 text-xs font-medium text-[#FF9600]">{student.issue}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherNeedsAttentionSection;
