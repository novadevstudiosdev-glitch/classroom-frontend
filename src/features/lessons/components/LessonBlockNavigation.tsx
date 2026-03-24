import type { LessonBlockNavigationProps } from "../types";
const LessonBlockNavigation = ({
  currentIndex,
  totalBlocks,
  onNext,
}: LessonBlockNavigationProps) => {
  const hasNext = currentIndex < totalBlocks - 1;

  return (
    <nav className="mt-6 flex items-center justify-end" aria-label="Navegacion entre bloques">
      <div>
      
        {hasNext ? (
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:text-red-700"
          >
          </button>
        ) : null}
      </div>
    </nav>
  );
};

export default LessonBlockNavigation;
