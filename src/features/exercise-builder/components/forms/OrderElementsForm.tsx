import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { Plus } from "lucide-react";
import OrderDraggableItem from "@/features/exercise-builder/components/dnd/OrderDraggableItem";
import type { OrderElementsFormProps } from "@/features/exercise-builder/types";

const OrderElementsForm = ({
  data,
  onChangeItem,
  onAddItem,
  onMoveItem,
}: OrderElementsFormProps) => {
  const handleDragEnd = (event: DragEndEvent) => {
    if (!event.over) return;
    const activeId = String(event.active.id);
    const overId = String(event.over.id);
    const activeIndex = data.items.findIndex((_, index) => `order-${index}` === activeId);
    const overIndex = data.items.findIndex((_, index) => `order-${index}` === overId);
    if (activeIndex === -1 || overIndex === -1) return;
    onMoveItem(activeIndex, overIndex);
  };

  return (
    <section className="space-y-3 rounded-2xl border border-white/20 bg-white/10 p-5 shadow-sm backdrop-blur-md">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white">Formulario Ordenar elementos</h3>
        <button
          type="button"
          onClick={onAddItem}
          className="inline-flex items-center gap-1 rounded-lg border border-white/25 bg-white/10 px-2 py-1 text-xs font-semibold text-white"
        >
          <Plus size={14} />
          Agregar
        </button>
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="space-y-2">
          {data.items.map((item, index) => (
            <OrderDraggableItem
              key={`order-${index}`}
              id={`order-${index}`}
              label={item}
              onChange={(value) => onChangeItem(index, value)}
            />
          ))}
        </div>
      </DndContext>
    </section>
  );
};

export default OrderElementsForm;
