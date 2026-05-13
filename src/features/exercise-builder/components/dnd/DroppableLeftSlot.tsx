import { useDroppable } from "@dnd-kit/core";
import type { MatchItem } from "@/features/exercise-builder/types";

type DroppableLeftSlotProps = {
  leftItem: MatchItem;
  pairedLabel?: string;
  onClearPair: () => void;
};

const DroppableLeftSlot = ({
  leftItem,
  pairedLabel,
  onClearPair,
}: DroppableLeftSlotProps) => {
  const { isOver, setNodeRef } = useDroppable({ id: leftItem.id });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-lg border p-3 ${
        isOver
          ? "border-[var(--color-primary)] bg-[var(--color-primary)]/15"
          : "border-white/25 bg-white/5"
      }`}
    >
      <p className="text-sm font-semibold text-white">{leftItem.label}</p>
      <div className="mt-2 rounded-md border border-dashed border-white/30 p-2 text-xs text-white/70">
        {pairedLabel ?? "Arrastra aquí la opción correcta"}
      </div>
      {pairedLabel ? (
        <button
          type="button"
          onClick={onClearPair}
          className="mt-2 text-xs font-semibold text-red-600 hover:text-red-700"
        >
          Quitar relación
        </button>
      ) : null}
    </div>
  );
};

export default DroppableLeftSlot;
