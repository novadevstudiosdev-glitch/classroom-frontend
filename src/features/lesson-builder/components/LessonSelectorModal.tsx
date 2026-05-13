import Link from "next/link";
import type { Lesson } from "@/features/lessons/types";

type LessonSelectorModalProps = {
  isOpen: boolean;
  isLoading: boolean;
  searchTerm: string;
  statusFilter: "all" | "draft" | "published";
  lessons: Lesson[];
  onClose: () => void;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: "all" | "draft" | "published") => void;
  onSelectLesson: (lessonId: string) => void;
};

const LessonSelectorModal = ({
  isOpen,
  isLoading,
  searchTerm,
  statusFilter,
  lessons,
  onClose,
  onSearchChange,
  onStatusFilterChange,
  onSelectLesson,
}: LessonSelectorModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-[#020617]/70 p-4">
      <div className="w-full max-w-3xl rounded-2xl border border-white/15 bg-[#070c22] p-5 shadow-[0_20px_45px_rgba(0,0,0,0.45)]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-xl font-black text-white">Mis lecciones</h3>
          <button type="button" onClick={onClose} className="rounded-lg bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20">Cerrar</button>
        </div>

        <div className="mb-4 grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar por titulo, materia o grado..."
            className="w-full rounded-xl bg-white/12 px-3 py-2 text-sm text-white outline-none ring-1 ring-white/20 placeholder:text-white/45"
          />
          <select
            value={statusFilter}
            onChange={(event) => onStatusFilterChange(event.target.value as "all" | "draft" | "published")}
            className="rounded-xl bg-white/12 px-3 py-2 text-sm text-white outline-none ring-1 ring-white/20"
          >
            <option value="all" className="text-black">Todos</option>
            <option value="draft" className="text-black">Borrador</option>
            <option value="published" className="text-black">Publicada</option>
          </select>
        </div>

        {isLoading ? <p className="text-sm text-white/70">Cargando lecciones...</p> : null}

        {!isLoading && lessons.length === 0 ? (
          <div className="rounded-xl bg-white/8 p-4">
            <p className="text-sm font-semibold text-white">No hay lecciones creadas</p>
            <p className="mt-1 text-sm text-white/70">
              Crea tu primera lección para comenzar a configurarla y agregar ejercicios.
            </p>
            <Link
              href="/lessons/new"
              className="mt-3 inline-flex rounded-lg bg-gradient-to-r from-emerald-400/85 to-cyan-400/85 px-3 py-2 text-xs font-black text-[#03212a] transition hover:from-emerald-300 hover:to-cyan-300"
            >
              Crear lección
            </Link>
          </div>
        ) : null}

        {!isLoading && lessons.length > 0 ? (
          <div className="max-h-[380px] space-y-2 overflow-y-auto pr-1">
            {lessons.map((lesson) => (
              <button
                key={lesson.id}
                type="button"
                onClick={() => onSelectLesson(lesson.id)}
                className="w-full rounded-xl bg-white/8 p-3 text-left transition hover:bg-white/15"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold text-white">{lesson.icon ? `${lesson.icon} ` : ""}{lesson.title}</p>
                  <span className="rounded-full bg-white/15 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/75">{lesson.status}</span>
                </div>
                <p className="mt-1 text-xs text-white/70">{lesson.subject ?? "General"} · {lesson.grade ?? "Sin grado"}</p>
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default LessonSelectorModal;
