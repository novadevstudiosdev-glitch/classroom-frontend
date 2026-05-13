"use client";

import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { LessonBuilderExercisesModalProps } from "@/features/lesson-builder/types";

const LessonBuilderExercisesModal = ({
  isOpen,
  exercises,
  onClose,
}: LessonBuilderExercisesModalProps) => {
  const [pageSize, setPageSize] = useState<5 | 10>(5);
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(exercises.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);

  const pageItems = useMemo(() => {
    const start = safePage * pageSize;
    return exercises.slice(start, start + pageSize);
  }, [exercises, pageSize, safePage]);

  const pageStart = safePage * pageSize + 1;
  const pageEnd = Math.min((safePage + 1) * pageSize, exercises.length);

  if (!isOpen) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[180] flex h-screen w-screen items-center justify-center bg-slate-950/60 p-3 backdrop-blur-lg sm:p-6">
      <div className="flex h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/20 bg-[#0f1536]/95 shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
        <header className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
          <div>
            <h2 className="text-lg font-black text-[#FF9500] sm:text-xl">Ejercicios creados</h2>
            <p className="text-xs text-white/70 sm:text-sm md:text-md">
              {exercises.length === 0
                ? "No hay ejercicios cargados todavía."
                : `Mostrando ${pageStart}-${pageEnd} de ${exercises.length}`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value) as 5 | 10);
                setPage(0);
              }}
              className="rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-xs font-semibold text-white outline-none"
            >
              <option value={5}>5 por página</option>
              <option value={10}>10 por página</option>
            </select>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-white/20 bg-white/10 p-2 text-white/90 hover:bg-white/20"
              aria-label="Cerrar modal"
            >
              <X size={16} />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          {pageItems.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/75">
              Todavía no hay ejercicios para mostrar.
            </div>
          ) : (
            <ul className="space-y-3">
              {pageItems.map((exercise) => (
                <li
                  key={exercise.id}
                  className="bg-gradient-to-br from-[#6C63FF]/10 to-[#9B5DE5]/15 backdrop-blur-2xl border border-white/0 shadow-xl rounded-3xl p-4 shadow-[0_10px_24px_rgba(2,6,26,0.35)]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-white sm:text-base">{exercise.title}</h3>
                    <span className="rounded-full bg-white/10 px-2 py-1 text-xs font-semibold text-white/85">
                      {exercise.duration}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-white/75">{exercise.subtitle}</p>
                  <p className="mt-3 text-md font-semibold text-cyan-200">{exercise.points} puntos</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="flex items-center justify-between border-t border-white/10 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(0, current - 1))}
            disabled={safePage === 0}
            className="inline-flex items-center gap-1 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white disabled:opacity-40"
          >
            <ChevronLeft size={14} />
            Anterior
          </button>

          <span className="text-xs font-semibold text-white/75 sm:text-sm">
            Página {safePage + 1} de {totalPages}
          </span>

          <button
            type="button"
            onClick={() => setPage((current) => Math.min(totalPages - 1, current + 1))}
            disabled={safePage === totalPages - 1}
            className="inline-flex items-center gap-1 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white disabled:opacity-40"
          >
            Siguiente
            <ChevronRight size={14} />
          </button>
        </footer>
      </div>
    </div>,
    document.body,
  );
};

export default LessonBuilderExercisesModal;
