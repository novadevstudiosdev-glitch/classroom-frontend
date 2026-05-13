import type { TeacherNeedsAttentionSectionProps } from "@/features/dashboard/teacher/types";

const TeacherNeedsAttentionSection = ({
  title = "Alumnos que necesitan atención",
  students,
}: TeacherNeedsAttentionSectionProps) => {
  return (
    <div className="pb-6">
      <h3 className="mb-4 text-xl font-bold text-white">{title}</h3>

      <div className="divide-y divide-white/15 rounded-2xl bg-white/10 shadow-sm backdrop-blur-md">
        {students.map((student) => (
          <div key={student.id} className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/20 font-bold text-white">
              {student.name[0]}
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-white">{student.name}</p>
              <p className="text-xs text-white/70">{student.className}</p>
              <p className="mt-1 text-xs font-medium text-[#FF9600]">{student.issue}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherNeedsAttentionSection;
