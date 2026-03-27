import { useDraggable, useDroppable } from "@dnd-kit/core";

type OrderDraggableItemProps = {
  id: string;
  label: string;
  onChange: (value: string) => void;
};

const OrderDraggableItem = ({ id, label, onChange }: OrderDraggableItemProps) => {
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
      <div className="mb-2 flex items-center justify-between text-xs text-white/70">
        <span>Arrastra para ordenar</span>
        <button
          type="button"
          {...listeners}
          {...attributes}
          className="cursor-grab rounded border border-white/25 px-2 py-1"
        >
          ⠿
        </button>
      </div>
      <input
        value={label}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-white/25 bg-white/10 px-2 py-1 text-sm text-white"
      />
    </div>
  );
};

export default OrderDraggableItem;
