import type { TeacherClassStudent } from "../services";

type StudentLessonProgress = {
  id: string;
  title: string;
  score: number | null;
  status: string;
};

type TeacherInsightsSidebarProps = {
  attentionStudents: TeacherClassStudent[];
  selectedStudent: TeacherClassStudent | null;
  selectedStudentProgress: StudentLessonProgress[];
  onSelectStudent: (studentId: string) => void;
};

const TeacherInsightsSidebar = ({
  attentionStudents,
  selectedStudent,
  selectedStudentProgress,
  onSelectStudent,
}: TeacherInsightsSidebarProps) => {
  return (
    <aside className="space-y-6">
      <article className="cosmic-panel border-0 shadow-[0_18px_40px_rgba(2,6,26,0.58)]">
        <h4 className="mb-4 text-lg font-black text-white">Alumnos que necesitan atencion</h4>
        {attentionStudents.length === 0 ? (
          <p className="rounded-xl bg-white/8 p-4 text-sm text-white/70">
            No hay alumnos marcados con baja participacion o tareas pendientes.
          </p>
        ) : (
          <div className="space-y-3">
            {attentionStudents.map((student) => (
              <button
                key={student.student_id}
                type="button"
                onClick={() => onSelectStudent(student.student_id)}
                className="w-full rounded-xl bg-white/8 p-3 text-left hover:bg-white/12"
              >
                <p className="text-sm font-bold text-white">{student.alias}</p>
                <p className="text-xs text-orange-200">
                  {student.pending_tasks} tareas pendientes · {student.participation_pct}% participacion
                </p>
              </button>
            ))}
          </div>
        )}
      </article>

      <article className="cosmic-panel border-0 shadow-[0_18px_40px_rgba(2,6,26,0.58)]">
        <h4 className="text-lg font-black text-white">Progreso del alumno</h4>
        <p className="mb-4 text-sm text-white/70">{selectedStudent?.alias ?? "Selecciona un alumno"}</p>

        {selectedStudent ? (
          <div className="mb-4 grid gap-2 sm:grid-cols-3">
            <div className="rounded-xl bg-white/8 px-3 py-2 text-sm text-white/85">
              Promedio: <span className="font-bold text-white">{selectedStudent.avg_score_pct}%</span>
            </div>
            <div className="rounded-xl bg-white/8 px-3 py-2 text-sm text-white/85">
              Participacion: <span className="font-bold text-white">{selectedStudent.participation_pct}%</span>
            </div>
            <div className="rounded-xl bg-white/8 px-3 py-2 text-sm text-white/85">
              Pendientes: <span className="font-bold text-white">{selectedStudent.pending_tasks}</span>
            </div>
          </div>
        ) : null}

        {selectedStudentProgress.length === 0 ? (
          <p className="rounded-xl bg-white/8 p-4 text-sm text-white/70">No hay lecciones asignadas para mostrar.</p>
        ) : (
          <div className="space-y-2">
            {selectedStudentProgress.map((lesson) => (
              <div
                key={lesson.id}
                className="flex items-center justify-between rounded-lg bg-white/8 px-3 py-2 text-sm"
              >
                <span className="text-white/85">{lesson.title}</span>
                <span className="font-bold text-white">
                  {lesson.score === null ? lesson.status : `${lesson.score}%`}
                </span>
              </div>
            ))}
          </div>
        )}
      </article>
    </aside>
  );
};

export default TeacherInsightsSidebar;
