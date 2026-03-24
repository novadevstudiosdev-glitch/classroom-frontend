import { useMemo, useState } from "react";
import type { AssignedLessonBlocksProps, LessonQuestionBlock } from "../types";

const AssignedLessonBlocks = ({
  lesson,
  activeBlockIndex,
  totalBlocks,
  onContinue,
}: AssignedLessonBlocksProps) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const block = lesson.content_json.blocks[activeBlockIndex];

  const questionBlock = useMemo(() => {
    if (!block || block.type !== "question") return null;
    return block as LessonQuestionBlock;
  }, [block]);

  if (!block) {
    return <p className="text-sm text-gray-500">Bloque no encontrado.</p>;
  }

  if (block.type === "paragraph") {
    return (
      <button
        type="button"
        onClick={onContinue}
        className="w-full rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-lg transition-all hover:scale-[1.01] hover:border-[#1CB0F6]/40"
      >
        <p className="text-base text-gray-800">{block.text}</p>
      </button>
    );
  }

  if (!questionBlock) return null;

  const selectedOption = questionBlock.options.find((o) => o.id === selectedOptionId);
  const correctOption = questionBlock.options.find(
    (o) => o.id === questionBlock.correctOptionId,
  );
  const isCorrect = selectedOptionId === questionBlock.correctOptionId;

  const handleActionButton = () => {
    if (isCorrect) {
      onContinue?.();
      return;
    }

    setSelectedOptionId(null);
    setShowFeedback(false);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <p className="mb-2 text-sm text-[#1CB0F6]/60">
          Pregunta {Math.min(activeBlockIndex + 1, totalBlocks)} de {totalBlocks}
        </p>
        <h2 className="text-xl font-bold mb-4">{questionBlock.prompt}</h2>

        <div className="space-y-3">
          {questionBlock.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            const showCorrect = showFeedback && option.id === questionBlock.correctOptionId;
            const showWrong =
              showFeedback && isSelected && option.id !== questionBlock.correctOptionId;

            let bgColor = "bg-white";
            let borderColor = "border-gray-200";
            let badgeColor = "bg-[#1CB0F6]";

            if (showCorrect) {
              bgColor = "bg-[#58CC02]/10";
              borderColor = "border-[#58CC02]";
              badgeColor = "bg-[#58CC02]";
            } else if (showWrong) {
              bgColor = "bg-[#FF4B4B]/10";
              borderColor = "border-[#FF4B4B]";
              badgeColor = "bg-[#FF4B4B]";
            } else if (isSelected) {
              borderColor = "border-[#1CB0F6]";
            }

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  if (showFeedback) return;
                  setSelectedOptionId(option.id);
                  setShowFeedback(true);
                }}
                disabled={showFeedback}
                className={`w-full ${bgColor} border-2 ${borderColor} rounded-2xl p-4 flex items-center gap-4 transition-all hover:scale-[1.02] shadow-md disabled:cursor-not-allowed`}
              >
                <div
                  className={`${badgeColor} text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0`}
                >
                  {option.letter}
                </div>
                <span className="font-bold text-left text-black">{option.text}</span>
                {showCorrect && <span className="ml-auto text-2xl">✓</span>}
                {showWrong && <span className="ml-auto text-2xl">✗</span>}
              </button>
            );
          })}
        </div>
      </div>

      {showFeedback ? (
        <div
          className={`rounded-2xl p-5 text-white ${
            isCorrect ? "bg-[#58CC02]" : "bg-[#FF4B4B]"
          }`}
        >
          {isCorrect ? (
            <>
              <div className="mb-3 flex items-center gap-2">
                <span className="text-2xl">✅</span>
                <p className="text-xl font-bold">¡Excelente! ¡Eso es!</p>
              </div>
              <div className="mb-4 flex items-center gap-2 text-sm font-bold">
                <span>⚡</span>
                <span>+10 XP</span>
              </div>
            </>
          ) : (
            <>
              <div className="mb-3 flex items-center gap-2">
                <span className="text-2xl">💪</span>
                <p className="text-xl font-bold">¡Casi! Intentá de nuevo</p>
              </div>
              <p className="mb-2 text-sm font-semibold">
                La respuesta correcta es:
              </p>
              <div className="rounded-xl bg-white/20 p-3">
                <p className="text-sm font-bold">
                  {correctOption?.letter}. {correctOption?.text}
                </p>
                {questionBlock.explanation ? (
                  <p className="mt-1 text-sm">{questionBlock.explanation}</p>
                ) : null}
              </div>
            </>
          )}
          {selectedOption ? (
            <p className="mt-2 text-xs">Elegiste: {selectedOption.letter}</p>
          ) : null}

          <button
            type="button"
            onClick={handleActionButton}
            className={`mt-4 w-full rounded-xl py-3 text-sm font-bold transition-colors ${
              isCorrect
                ? "bg-[#3fae01] hover:bg-[#379a01]"
                : "bg-[#d93b3b] hover:bg-[#be3333]"
            }`}
          >
            {isCorrect ? "Continuar" : "Intentar de nuevo"}
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default AssignedLessonBlocks;
