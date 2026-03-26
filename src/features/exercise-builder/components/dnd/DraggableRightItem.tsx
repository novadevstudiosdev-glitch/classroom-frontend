import { useDraggable } from "@dnd-kit/core";
import type { MatchItem } from "@/features/exercise-builder/types";

type DraggableRightItemProps = {
  item: MatchItem;
  isLinked: boolean;
};

const DraggableRightItem = ({ item, isLinked }: DraggableRightItemProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: item.id,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.5 : isLinked ? 0.6 : 1,
  };

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      type="button"
      className="w-full rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-left text-sm font-semibold text-white"
    >
      {item.label}
    </button>
  );
};

export default DraggableRightItem;
