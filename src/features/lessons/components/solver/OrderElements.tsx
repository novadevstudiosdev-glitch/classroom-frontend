import { DndContext, type DragEndEvent, useDraggable, useDroppable } from '@dnd-kit/core';
import { useState } from 'react';
import type { OrderElementsProps } from '@/features/lessons/types';
import { answerExercise, type CorrectionResult, type OrderItemsAnswer } from '@/features/lessons/services';
import SolverOptionalMedia from './SolverOptionalMedia';
import XPAnimation from './XPAnimation';

type OrderItemProps = {
  id: string;
  label: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

const OrderItem = ({ id, label, onChange, disabled }: OrderItemProps) => {
  const { attributes, listeners, setNodeRef: setDragRef, transform, isDragging } = useDraggable({ id });
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
      className={`rounded-lg border p-3 ${isOver ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/15' : 'border-white/25 bg-white/10'}`}
    >
      <div className="mb-2 flex items-center justify-between text-xs text-white/70">
        <span>Arrastra para ordenar</span>
        <button type="button" {...listeners} {...attributes} className="cursor-grab rounded border border-white/25 px-2 py-1">
          ⠿
        </button>
      </div>

      <input
        value={label}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="w-full rounded-md border border-white/25 bg-white/10 px-2 py-1 text-sm text-white disabled:opacity-50"
      />
    </div>
  );
};

const OrderElements = ({ block, onContinue }: OrderElementsProps) => {
  const [orderedItems, setOrderedItems] = useState<string[]>(() => [...block.items].reverse());
  const [serverResult, setServerResult] = useState<CorrectionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showXPAnimation, setShowXPAnimation] = useState(false);

  const answered = serverResult !== null;

  const handleDragEnd = (event: DragEndEvent) => {
    if (answered || isLoading) return;
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

  const handleValidate = async () => {
    if (isLoading || answered) return;

    setIsLoading(true);
    try {
      const order = orderedItems.map((item) => block.items.indexOf(item));
      const answer: OrderItemsAnswer = { order };
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
        <div className="space-y-2">
          {orderedItems.map((item, index) => (
            <OrderItem
              key={`order-${index}`}
              id={`order-${index}`}
              label={item}
              disabled={answered}
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

      {!answered ? (
        <button
          type="button"
          onClick={handleValidate}
          disabled={isLoading}
          className="w-full rounded-xl bg-[#1CB0F6] py-3 text-sm font-bold text-white hover:bg-[#1398d8] disabled:opacity-50"
        >
          {isLoading ? 'Validando...' : 'Validar orden'}
        </button>
      ) : serverResult ? (
        <div className={`rounded-2xl p-5 text-white ${serverResult.is_correct ? 'bg-[#58CC02]' : 'bg-[#FF4B4B]'}`}>
          <p className="text-lg font-bold">{serverResult.feedback}</p>

          {!serverResult.is_correct && serverResult.correct_answer?.items_in_order ? (
            <div className="mt-3 rounded-lg bg-black/30 p-3">
              <p className="text-xs font-semibold text-white/70">Orden correcto:</p>
              <div className="mt-2 space-y-1">
                {serverResult.correct_answer.items_in_order?.map((item: string, idx: number) => (
                  <p key={idx} className="text-sm font-bold">
                    {idx + 1}. {item}
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
              setOrderedItems([...block.items].reverse());
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

export default OrderElements;
