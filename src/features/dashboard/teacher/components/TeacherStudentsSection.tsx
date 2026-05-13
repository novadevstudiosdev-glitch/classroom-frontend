import type { TeacherClass, TeacherClassStudent } from "../services";

type TeacherStudentsSectionProps = {
  selectedClass: TeacherClass | null;
  isClassLoading: boolean;
  studentSearchTerm: string;
  filteredStudents: TeacherClassStudent[];
  selectedStudentId: string;
  onSearchChange: (value: string) => void;
  onSelectStudent: (studentId: string) => void;
};

const TeacherStudentsSection = ({
  selectedClass,
  isClassLoading,
  studentSearchTerm,
  filteredStudents,
  selectedStudentId,
  onSearchChange,
  onSelectStudent,
}: TeacherStudentsSectionProps) => {
  return (
    <article className="cosmic-panel border-0 shadow-[0_18px_40px_rgba(2,6,26,0.58)]">
      <div className="mb-4">
        <h4 className="text-xl font-black text-white">{selectedClass?.name ?? "Selecciona una clase"}</h4>
        {selectedClass ? <p className="text-sm text-white/70">Codigo: {selectedClass.code}</p> : null}
      </div>

      {isClassLoading ? <p className="rounded-xl bg-white/8 p-4 text-sm text-white/70">Cargando alumnos...</p> : null}

      {!isClassLoading && selectedClass ? (
        <>
          <input
            type="text"
            value={studentSearchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar alumno por nombre..."
            className="mb-3 w-full rounded-xl bg-white/12 px-3 py-2 text-sm text-white outline-none ring-1 ring-white/20 placeholder:text-white/45"
          />

          {filteredStudents.length === 0 ? (
            <p className="rounded-xl bg-white/8 p-4 text-sm text-white/70">No hay alumnos para mostrar.</p>
          ) : (
            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
              {filteredStudents.map((student) => (
                <button
                  key={student.student_id}
                  type="button"
                  onClick={() => onSelectStudent(student.student_id)}
                  className={`rounded-xl px-3 py-3 text-left ${
                    student.student_id === selectedStudentId
                      ? "bg-sky-500/20 ring-1 ring-sky-300/40"
                      : "bg-white/8 hover:bg-white/12"
                  }`}
                >
                  <p className="text-sm font-bold text-white">{student.alias}</p>
                  <p className="text-xs text-white/65">
                    Nivel {student.level ?? "-"} · {student.avg_score_pct}% promedio
                  </p>
                </button>
              ))}
            </div>
          )}
        </>
      ) : null}
    </article>
  );
};

export default TeacherStudentsSection;
