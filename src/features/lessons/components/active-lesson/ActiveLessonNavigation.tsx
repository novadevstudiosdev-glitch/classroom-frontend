import type { ActiveLessonNavigationProps } from "@/features/lessons/types";

const ActiveLessonNavigation = ({
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
}: ActiveLessonNavigationProps) => {
  return (
    <nav className="mt-4 flex items-center justify-between" aria-label="Navegación entre bloques">
      <div>
        {hasPrevious ? (
          <button
            type="button"
            onClick={() => {
              console.log("[ActiveLessonNavigation] ir al bloque anterior");
              onPrevious();
            }}
            className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700"
          >
            <span aria-hidden="true">←</span>
            <span>Atrás</span>
          </button>
        ) : null}
      </div>

      <div>
        {hasNext ? (
          <button
            type="button"
            onClick={() => {
              console.log("[ActiveLessonNavigation] ir al bloque siguiente");
              onNext();
            }}
            className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700"
          >
            <span>Siguiente</span>
            <span aria-hidden="true">→</span>
          </button>
        ) : null}
      </div>
    </nav>
  );
};

export default ActiveLessonNavigation;
