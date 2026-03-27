import { DndContext, type DragEndEvent, useDraggable, useDroppable } from "@dnd-kit/core";
import { useMemo, useState } from "react";
import type { OrderElementsProps } from "@/features/lessons/types";

type OrderItemProps = {
  id: string;
  label: string;
  onChange: (value: string) => void;
};

const OrderItem = ({ id, label, onChange }: OrderItemProps) => {
  const { attributes, listeners, setNodeRef: setDragRef, transform, isDragging } =
    useDraggable({ id });
  const { isOver, setNodeRef: setDropRef } = useDroppable({ id });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
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
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-white/25 bg-white/10 px-2 py-1 text-sm text-white"
      />
    </div>
  );
};

const OrderElements = ({ block, onContinue }: OrderElementsProps) => {
  const [orderedItems, setOrderedItems] = useState<string[]>(() => [...block.items].reverse());
  const [checked, setChecked] = useState(false);

  const handleDragEnd = (event: DragEndEvent) => {
    if (!event.over) return;

    const activeId = String(event.active.id);
    const overId = String(event.over.id);
    const activeIndex = orderedItems.findIndex((_, index) => `order-${index}` === activeId);
    const overIndex = orderedItems.findIndex((_, index) => `order-${index}` === overId);
    if (activeIndex === -1 || overIndex === -1) return;

    setOrderedItems((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(activeIndex, 1);
      copy.splice(overIndex, 0, moved);
      return copy;
    });
  };

  const isCorrect = useMemo(
    () => orderedItems.every((item, index) => item === block.items[index]),
    [block.items, orderedItems],
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">{block.prompt}</h2>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="space-y-2">
          {orderedItems.map((item, index) => (
            <OrderItem
              key={`order-${index}`}
              id={`order-${index}`}
              label={item}
              onChange={(value) =>
                setOrderedItems((prev) => {
                  const copy = [...prev];
                  copy[index] = value;
                  return copy;
                })
              }
            />
          ))}
        </div>
      </DndContext>

      {!checked ? (
        <button
          type="button"
          onClick={() => setChecked(true)}
          className="w-full rounded-xl bg-[#1CB0F6] py-3 text-sm font-bold text-white hover:bg-[#1398d8]"
        >
          Validar orden
        </button>
      ) : (
        <div
          className={`rounded-2xl p-5 text-white ${isCorrect ? "bg-[#58CC02]" : "bg-[#FF4B4B]"}`}
        >
          {isCorrect ? (
            <p className="text-lg font-bold">¡Muy bien! El orden es correcto ✓</p>
          ) : (
            <>
              <p className="text-lg font-bold">El orden no es correcto todavía ✗</p>
              <p className="mt-2 text-sm">
                {block.explanation ?? "Vuelve a ordenar y prueba otra vez."}
              </p>
            </>
          )}

          <button
            type="button"
            onClick={() => {
              if (isCorrect) {
                onContinue?.();
                return;
              }
              setOrderedItems([...block.items].reverse());
              setChecked(false);
            }}
            className={`mt-4 w-full rounded-xl py-3 text-sm font-bold ${
              isCorrect ? "bg-[#3fae01] hover:bg-[#379a01]" : "bg-[#d93b3b] hover:bg-[#be3333]"
            }`}
          >
            {isCorrect ? "Continuar" : "Intentar de nuevo"}
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderElements;
