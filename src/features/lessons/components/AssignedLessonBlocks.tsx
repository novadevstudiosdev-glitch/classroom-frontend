import type { AssignedLessonBlocksProps } from "../types";
import {
  ActiveLessonBlockRenderer,
  ActiveLessonNavigation,
} from "./active-lesson";

const AssignedLessonBlocks = ({
  lesson,
  activeBlockIndex,
  totalBlocks,
  hasPrevious = false,
  hasNext = false,
  onPrevious,
  onNext,
  onContinue,
}: AssignedLessonBlocksProps) => {
  const block = lesson.content_json.blocks[activeBlockIndex];

  if (!block) {
    return <p className="text-sm text-gray-500">Bloque no encontrado.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
        <p className="mb-2 text-sm text-[#1CB0F6]/60">
          Bloque {Math.min(activeBlockIndex + 1, totalBlocks)} de {totalBlocks}
        </p>

        <ActiveLessonBlockRenderer block={block} onContinue={onContinue} />
      </div>

      {onPrevious && onNext ? (
        <ActiveLessonNavigation
          hasPrevious={hasPrevious}
          hasNext={hasNext}
          onPrevious={onPrevious}
          onNext={onNext}
        />
      ) : null}
    </div>
  );
};

export default AssignedLessonBlocks;
