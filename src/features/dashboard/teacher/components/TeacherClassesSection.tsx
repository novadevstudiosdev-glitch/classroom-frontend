import type { TeacherClass, TeacherClassProgress } from "../services";

type TeacherClassesSectionProps = {
  classes: TeacherClass[];
  selectedClassId: string;
  classProgress: TeacherClassProgress | null;
  onSelectClass: (classId: string) => void;
};

const getClassCompletion = (classId: string, progress: TeacherClassProgress | null) => {
  if (!progress || progress.classroom_id !== classId || progress.lessons.length === 0) {
    return 0;
  }

  const possibleCells = progress.students.length * progress.lessons.length;
  if (possibleCells === 0) return 0;

  const completedCells = progress.progress.filter((item) => item.status === "completed").length;
  return Math.round((completedCells / possibleCells) * 100);
};

const TeacherClassesSection = ({
  classes,
  selectedClassId,
  classProgress,
  onSelectClass,
}: TeacherClassesSectionProps) => {
  return (
    <article className="cosmic-panel border-0 shadow-[0_18px_40px_rgba(2,6,26,0.58)]">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-xl font-black text-white">Mis clases</h3>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/70">
          {classes.length} clases
        </span>
      </div>

      {classes.length === 0 ? (
        <p className="rounded-xl bg-white/8 p-4 text-sm text-white/70">Todavia no tienes clases creadas.</p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((item) => {
            const isSelected = item.id === selectedClassId;
            const completion = getClassCompletion(item.id ?? "", classProgress);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectClass(item.id ?? "")}
                className={`rounded-xl px-3 py-3 text-left transition ${
                  isSelected ? "bg-white/18" : "bg-white/10 hover:bg-white/15"
                }`}
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-white">{item.name}</p>
                  <span className="rounded-full bg-emerald-500/25 px-2 py-1 text-[10px] font-bold text-emerald-200">
                    Activa
                  </span>
                </div>
                <p className="text-xs text-white/65">Codigo: {item.code}</p>
                <p className="text-xs text-white/65">
                  {item.studentCount} alumnos · {completion}% completado
                </p>
              </button>
            );
          })}
        </div>
      )}
    </article>
  );
};

export default TeacherClassesSection;
