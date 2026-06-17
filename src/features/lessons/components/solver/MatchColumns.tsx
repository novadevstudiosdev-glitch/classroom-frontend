import { DndContext, type DragEndEvent, useDraggable, useDroppable } from '@dnd-kit/core';
import { useMemo, useState } from 'react';
import type { MatchColumnsProps, MatchPair } from '@/features/lessons/types';
import { answerExercise, type CorrectionResult, type MatchColumnsAnswer } from '@/features/lessons/services';
import SolverOptionalMedia from './SolverOptionalMedia';
import XPAnimation from './XPAnimation';

type MatchRightOptionProps = {
  id: string;
  label: string;
  isLinked: boolean;
  disabled?: boolean;
};

const MatchRightOption = ({ id, label, isLinked, disabled }: MatchRightOptionProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    disabled,
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
  disabled?: boolean;
};

const MatchLeftDrop = ({ id, label, pairedLabel, onClear, disabled }: MatchLeftDropProps) => {
  const { isOver, setNodeRef } = useDroppable({ id, disabled });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-lg border p-3 ${isOver ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/15' : 'border-white/25 bg-white/5'}`}
    >
      <p className="text-sm font-semibold text-white">{label}</p>
      <div className="mt-2 rounded-md border border-dashed border-white/30 p-2 text-xs text-white/70">
        {pairedLabel ?? 'Arrastra aquí la opción correcta'}
      </div>
      {pairedLabel ? (
        <button
          type="button"
          onClick={onClear}
          disabled={disabled}
          className="mt-2 text-xs font-semibold text-red-300 hover:text-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Quitar relación
        </button>
      ) : null}
    </div>
  );
};

const MatchColumns = ({ block, onContinue }: MatchColumnsProps) => {
  const [pairs, setPairs] = useState<MatchPair[]>([]);
  const [serverResult, setServerResult] = useState<CorrectionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showXPAnimation, setShowXPAnimation] = useState(false);

  const answered = serverResult !== null;

  const handleDragEnd = (event: DragEndEvent) => {
    if (answered || isLoading) return;

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

  const handleValidate = async () => {
    if (isLoading || answered) return;

    setIsLoading(true);
    try {
      // Mapear al formato que espera el backend: left_index y right_index
      const pairsArray = pairs.map((pair) => {
        const leftIdx = block.leftItems.findIndex((item) => item.id === pair.leftId);
        const rightIdx = block.rightItems.findIndex((item) => item.id === pair.rightId);
        return { left_index: leftIdx, right_index: rightIdx };
      });

      const answer: MatchColumnsAnswer = { pairs: pairsArray };
      const result = await answerExercise(block.id, answer);
      setServerResult(result);
      if (result.is_correct) {
        setShowXPAnimation(true);
      }
    } catch (error) {
      console.error('Error al responder ejercicio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <XPAnimation amount={10} isVisible={showXPAnimation} />
      <SolverOptionalMedia imageSrc={block.imageSrc} imageAlt={block.imageAlt} imageCaption={block.imageCaption} />
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
                  onClear={() => setPairs((prev) => prev.filter((item) => item.leftId !== leftItem.id))}
                  disabled={answered}
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
                disabled={answered}
              />
            ))}
          </div>
        </div>
      </DndContext>

      {!answered ? (
        <button
          type="button"
          onClick={handleValidate}
          disabled={isLoading}
          className="w-full rounded-xl bg-[#1CB0F6] py-3 text-sm font-bold text-white hover:bg-[#1398d8] disabled:opacity-50"
        >
          {isLoading ? 'Validando...' : 'Validar relaciones'}
        </button>
      ) : serverResult ? (
        <div className={`rounded-2xl p-5 text-white ${serverResult.is_correct ? 'bg-[#58CC02]' : 'bg-[#FF4B4B]'}`}>
          <p className="text-lg font-bold">{serverResult.feedback}</p>

          {!serverResult.is_correct && serverResult.correct_answer?.pairs ? (
            <div className="mt-3 rounded-lg bg-black/30 p-3">
              <p className="text-xs font-semibold text-white/70">Pares correctos:</p>
              <div className="mt-2 space-y-1">
                {serverResult.correct_answer.pairs?.map((pair: { left_text: string; right_text: string }, idx: number) => (
                  <p key={idx} className="text-sm font-bold">
                    {pair.left_text} → {pair.right_text}
                  </p>
                ))}
              </div>
            </div>
          ) : null}

          {serverResult.is_correct && (
            <div className="mt-2 inline-flex items-center gap-2 text-sm font-bold">
              <span>⚡</span>
              <span>+10 XP</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              if (serverResult.is_correct) {
                onContinue?.();
                return;
              }
              setPairs([]);
              setServerResult(null);
            }}
            className={`mt-4 w-full rounded-xl py-3 text-sm font-bold ${
              serverResult.is_correct ? 'bg-[#3fae01] hover:bg-[#379a01]' : 'bg-[#d93b3b] hover:bg-[#be3333]'
            }`}
          >
            {serverResult.is_correct ? 'Continuar' : 'Intentar de nuevo'}
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default MatchColumns;
