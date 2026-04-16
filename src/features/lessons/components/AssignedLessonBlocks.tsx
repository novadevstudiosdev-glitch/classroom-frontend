import type { AssignedLessonBlocksProps } from "../types";
import { ActiveLessonBlockRenderer } from "./active-lesson";

const AssignedLessonBlocks = ({
  lesson,
  activeBlockIndex,
  totalBlocks,
  onContinue,
}: AssignedLessonBlocksProps) => {
  const block = lesson.content_json.blocks[activeBlockIndex];

  if (!block) {
    return <p className="text-sm text-gray-500">Bloque no encontrado.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-transparent p-6 shadow-[0_16px_24px_rgba(2,6,26,0.5)] backdrop-blur-md">
        <h4 className="mb-2 text-lg text-[#1CB0F6]/80">
          Bloque {Math.min(activeBlockIndex + 1, totalBlocks)} de {totalBlocks}
        </h4>

        <ActiveLessonBlockRenderer block={block} onContinue={onContinue} />
      </div>
    </div>
  );
};

export default AssignedLessonBlocks;
