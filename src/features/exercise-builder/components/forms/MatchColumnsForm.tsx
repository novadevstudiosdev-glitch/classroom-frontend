import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { Plus } from "lucide-react";
import DroppableLeftSlot from "@/features/exercise-builder/components/dnd/DroppableLeftSlot";
import DraggableRightItem from "@/features/exercise-builder/components/dnd/DraggableRightItem";
import type { MatchColumnsFormProps } from "@/features/exercise-builder/types";

const MatchColumnsForm = ({
  data,
  onChangeLeftLabel,
  onChangeRightLabel,
  onAddLeftItem,
  onAddRightItem,
  onSetPair,
  onClearPair,
}: MatchColumnsFormProps) => {
  const handleDragEnd = (event: DragEndEvent) => {
    const rightId = String(event.active.id);
    const leftId = event.over ? String(event.over.id) : null;
    if (!leftId) return;
    onSetPair(leftId, rightId);
  };

  const pairedRightIds = new Set(data.pairs.map((pair) => pair.rightId));

  return (
    <section className="space-y-3 rounded-2xl border border-white/20 bg-white/10 p-5 shadow-sm backdrop-blur-md">
      <h3 className="text-base font-bold text-white">
        Formulario Relacionar columnas
      </h3>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-white/80">Columna izquierda</p>
            <button
              type="button"
              onClick={onAddLeftItem}
              className="inline-flex items-center gap-1 rounded-lg border border-white/25 bg-white/10 px-2 py-1 text-xs font-semibold text-white"
            >
              <Plus size={14} />
              Agregar
            </button>
          </div>
          {data.leftItems.map((item) => (
            <input
              key={item.id}
              value={item.label}
              onChange={(e) => onChangeLeftLabel(item.id, e.target.value)}
              className="w-full rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-sm text-white"
            />
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-white/80">Columna derecha</p>
            <button
              type="button"
              onClick={onAddRightItem}
              className="inline-flex items-center gap-1 rounded-lg border border-white/25 bg-white/10 px-2 py-1 text-xs font-semibold text-white"
            >
              <Plus size={14} />
              Agregar
            </button>
          </div>
          {data.rightItems.map((item) => (
            <input
              key={item.id}
              value={item.label}
              onChange={(e) => onChangeRightLabel(item.id, e.target.value)}
              className="w-full rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-sm text-white"
            />
          ))}
        </div>
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-white/80">Soltar sobre la izquierda</p>
            {data.leftItems.map((leftItem) => {
              const pair = data.pairs.find((item) => item.leftId === leftItem.id);
              const paired = data.rightItems.find((r) => r.id === pair?.rightId);
              return (
                <DroppableLeftSlot
                  key={leftItem.id}
                  leftItem={leftItem}
                  pairedLabel={paired?.label}
                  onClearPair={() => onClearPair(leftItem.id)}
                />
              );
            })}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-white/80">Opciones arrastrables</p>
            {data.rightItems.map((rightItem) => (
              <DraggableRightItem
                key={rightItem.id}
                item={rightItem}
                isLinked={pairedRightIds.has(rightItem.id)}
              />
            ))}
          </div>
        </div>
      </DndContext>
    </section>
  );
};

export default MatchColumnsForm;
