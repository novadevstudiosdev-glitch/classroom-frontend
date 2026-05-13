import { useDraggable, useDroppable } from "@dnd-kit/core";
import { Trash2 } from "lucide-react";

type OrderDraggableItemProps = {
  id: string;
  label: string;
  onChange: (value: string) => void;
  onRemove: () => void;
};

const OrderDraggableItem = ({ id, label, onChange, onRemove }: OrderDraggableItemProps) => {
  const { attributes, listeners, setNodeRef: setDragRef, transform, isDragging } =
    useDraggable({ id });
  const { isOver, setNodeRef: setDropRef } = useDroppable({ id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={(node) => {
        setDragRef(node);
        setDropRef(node);
      }}
      style={style}
      className={`rounded-lg border p-3 ${
        isOver
          ? "border-[var(--color-primary)] bg-[var(--color-primary)]/15"
          : "border-white/25 bg-white/10"
      }`}
    >
      <div className="mb-2 flex items-center justify-between text-md text-white/70">
        <p className="text-[#1CB0F6]/80">Arrastra para ordenar</p>
        <button
          type="button"
          {...listeners}
          {...attributes}
          className="cursor-grab rounded border border-white/25 px-2 py-1 bg-gradient-to-r from-[#2c65f6]/30 via-[#00ffe4]/30 to-[#0ad3fb]/30 backdrop-blur-2xl border border-white/20 shadow-[0_0_40px_rgba(0,255,228,0.25)] text-white"
        >
          ⠿
        </button>
      </div>
      <div className="flex items-center gap-2">
        <input
          value={label}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md border border-white/25 bg-white/10 px-2 py-1 text-sm text-white"
        />
        <button
          type="button"
          onClick={onRemove}
          className="rounded-lg border border-white/25 p-2 text-white/80 rounded-lg border border-white/25 p-2 bg-[#8B0000]/40 text-white/60  hover:bg-[#FF0000]/60"
          aria-label="Eliminar elemento"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default OrderDraggableItem;
