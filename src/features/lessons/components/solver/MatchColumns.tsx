import { DndContext, type DragEndEvent, useDraggable, useDroppable } from "@dnd-kit/core";
import { useMemo, useState } from "react";
import type { MatchColumnsProps, MatchPair } from "@/features/lessons/types";
import SolverOptionalMedia from "./SolverOptionalMedia";

type MatchRightOptionProps = {
  id: string;
  label: string;
  isLinked: boolean;
};

const MatchRightOption = ({ id, label, isLinked }: MatchRightOptionProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
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
      {label}
    </button>
  );
};

type MatchLeftDropProps = {
  id: string;
  label: string;
  pairedLabel?: string;
  onClear: () => void;
};

const MatchLeftDrop = ({ id, label, pairedLabel, onClear }: MatchLeftDropProps) => {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-lg border p-3 ${
        isOver
          ? "border-[var(--color-primary)] bg-[var(--color-primary)]/15"
          : "border-white/25 bg-white/5"
      }`}
    >
      <p className="text-sm font-semibold text-white">{label}</p>
      <div className="mt-2 rounded-md border border-dashed border-white/30 p-2 text-xs text-white/70">
        {pairedLabel ?? "Arrastra aquí la opción correcta"}
      </div>
      {pairedLabel ? (
        <button
          type="button"
          onClick={onClear}
          className="mt-2 text-xs font-semibold text-red-300 hover:text-red-200"
        >
          Quitar relación
        </button>
      ) : null}
    </div>
  );
};

const MatchColumns = ({ block, onContinue }: MatchColumnsProps) => {
  const [pairs, setPairs] = useState<MatchPair[]>([]);
  const [checked, setChecked] = useState(false);

  const handleDragEnd = (event: DragEndEvent) => {
    const rightId = String(event.active.id);
    const leftId = event.over ? String(event.over.id) : null;
    if (!leftId) return;

    setPairs((prev) => {
      const withoutLeft = prev.filter((pair) => pair.leftId !== leftId);
      const withoutRight = withoutLeft.filter((pair) => pair.rightId !== rightId);
      return [...withoutRight, { leftId, rightId }];
    });
  };

  const pairedRightIds = useMemo(() => new Set(pairs.map((pair) => pair.rightId)), [pairs]);

  const isCorrect = useMemo(() => {
    if (pairs.length !== block.correctPairs.length) return false;
    return block.correctPairs.every((correctPair) =>
      pairs.some(
        (pair) => pair.leftId === correctPair.leftId && pair.rightId === correctPair.rightId,
      ),
    );
  }, [block.correctPairs, pairs]);

  return (
    <div className="space-y-4">
      <SolverOptionalMedia
        imageSrc={block.imageSrc}
        imageAlt={block.imageAlt}
        imageCaption={block.imageCaption}
      />
      <h2 className="text-xl font-bold text-white">{block.prompt}</h2>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-white/80">Columna izquierda</p>
            {block.leftItems.map((leftItem) => {
              const pair = pairs.find((item) => item.leftId === leftItem.id);
              const paired = block.rightItems.find((rightItem) => rightItem.id === pair?.rightId);
              return (
                <MatchLeftDrop
                  key={leftItem.id}
                  id={leftItem.id}
                  label={leftItem.label}
                  pairedLabel={paired?.label}
                  onClear={() =>
                    setPairs((prev) => prev.filter((item) => item.leftId !== leftItem.id))
                  }
                />
              );
            })}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-white/80">Columna derecha</p>
            {block.rightItems.map((rightItem) => (
              <MatchRightOption
                key={rightItem.id}
                id={rightItem.id}
                label={rightItem.label}
                isLinked={pairedRightIds.has(rightItem.id)}
              />
            ))}
          </div>
        </div>
      </DndContext>

      {!checked ? (
        <button
          type="button"
          onClick={() => setChecked(true)}
          className="w-full rounded-xl bg-[#1CB0F6] py-3 text-sm font-bold text-white hover:bg-[#1398d8]"
        >
          Validar relaciones
        </button>
      ) : (
        <div
          className={`rounded-2xl p-5 text-white ${isCorrect ? "bg-[#58CC02]" : "bg-[#FF4B4B]"}`}
        >
          {isCorrect ? (
            <p className="text-lg font-bold">¡Excelente! Relaciones correctas ✓</p>
          ) : (
            <>
              <p className="text-lg font-bold">Aún hay pares incorrectos ✗</p>
              <p className="mt-2 text-sm">
                {block.explanation ?? "Revisa los pares y vuelve a intentarlo."}
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
              setPairs([]);
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

export default MatchColumns;
